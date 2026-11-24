// Genera versiones optimizadas de cada foto de public/images:
//   AVIF (la más liviana) y WebP (respaldo) en varios anchos, en public/_img/.
// También escribe src/imagenes.json con los anchos disponibles de cada foto; el componente <Img>
// lo usa para que cada navegador descargue solo el formato y el tamaño que necesita.
//
// Se ejecuta solo antes de "npm run dev" y "npm run build" (predev / prebuild).
// Solo procesa fotos nuevas o modificadas (compara el contenido, no la fecha: en GitHub Actions
// todos los archivos llegan con fecha nueva); las demás se reutilizan.
// Uso manual: npm run imagenes
//
// Rapidez (GitHub Actions corta la publicación si tarda demasiado):
// - Cada foto se abre UNA vez y se reduce a 2400 px; todas sus versiones salen de esa copia
//   (abrir 8 veces una foto de 20 MB era lo más lento).
// - AVIF con effort 2: ~7 veces más rápido que effort 4 y solo ~10 % más pesado.
// - Se procesan varias fotos a la vez.
// - El avance se guarda después de cada foto: si se interrumpe, la siguiente vez sigue donde quedó.
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { availableParallelism } from 'node:os'
import { dirname, join, relative, sep } from 'node:path'
import sharp from 'sharp'

const ORIGEN = 'public/images'
const DESTINO = 'public/_img'
const MANIFIESTO = 'src/imagenes.json'
const HUELLAS = '.cache/imagenes-huellas.json' // huella de cada foto ya procesada (fuera de public: no se publica)
const ANCHOS = [480, 960, 1600, 2400]
const FORMATOS = {
  avif: (img) => img.avif({ quality: 50, effort: 2 }),
  webp: (img) => img.webp({ quality: 78 }),
}
const EXT = /\.(jpe?g|png|webp)$/i
// La huella incluye la configuración: si cambias ANCHOS o FORMATOS, todo se regenera solo (también en GitHub)
const CONFIG = JSON.stringify(ANCHOS) + Object.values(FORMATOS).map(String).join('|')
const A_LA_VEZ = Math.max(1, Math.min(4, availableParallelism() - 1))
const PESADA_MB = 8 // avisa de fotos más pesadas que esto: hacen lento el repo y la publicación

const listar = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? listar(join(dir, e.name)) : [join(dir, e.name)]))

const fotos = existsSync(ORIGEN) ? listar(ORIGEN).filter((f) => EXT.test(f)).sort() : []
const manifiesto = {}
const previas = existsSync(HUELLAS) ? JSON.parse(readFileSync(HUELLAS, 'utf8')) : {}
const huellas = {}
const esperados = new Set()
const pesadas = []
let generadas = 0
let listas = 0
const inicio = Date.now()

mkdirSync(dirname(HUELLAS), { recursive: true })
// Guarda las huellas de lo ya terminado + las previas de lo que aún no se revisa (para no perderlas si se corta)
const guardarAvance = () => writeFileSync(HUELLAS, JSON.stringify({ ...previas, ...huellas }))

async function procesar(archivo) {
  const rel = relative(ORIGEN, archivo).split(sep).join('/') // rooms/king-1.jpg
  const base = rel.replace(EXT, '') // rooms/king-1
  const datos = readFileSync(archivo)
  if (datos.length > PESADA_MB * 1024 * 1024) pesadas.push(`${rel} (${(datos.length / 1048576).toFixed(1)} MB)`)
  const meta = await sharp(datos).metadata()
  const ancho = meta.autoOrient?.width ?? meta.width
  const alto = meta.autoOrient?.height ?? meta.height
  // Nunca se agranda: anchos menores que el original, y el original si es más chico que 2400
  const anchos = ANCHOS.filter((w) => w < ancho)
  if (ancho <= ANCHOS.at(-1) && !anchos.includes(ancho)) anchos.push(ancho)
  if (!anchos.length) anchos.push(ancho)

  const huella = createHash('sha1').update(CONFIG).update(datos).digest('hex')
  const igual = previas[rel] === huella
  const pendientes = []
  for (const w of anchos) {
    for (const fmt of Object.keys(FORMATOS)) {
      const salida = join(DESTINO, `${base}-${w}.${fmt}`)
      esperados.add(salida)
      if (!(igual && existsSync(salida))) pendientes.push([w, fmt, salida])
    }
  }
  if (pendientes.length) {
    // Se abre la foto una sola vez (girada según EXIF y reducida al ancho mayor que se necesita)
    const copia = await sharp(datos).rotate().resize({ width: Math.max(...anchos), withoutEnlargement: true }).toBuffer()
    mkdirSync(dirname(join(DESTINO, base)), { recursive: true })
    for (const [w, fmt, salida] of pendientes) {
      await FORMATOS[fmt](sharp(copia).resize({ width: w, withoutEnlargement: true })).toFile(salida)
      generadas++
    }
  }
  manifiesto[`/images/${rel}`] = { w: ancho, h: alto, anchos }
  huellas[rel] = huella
  listas++
  if (pendientes.length) {
    guardarAvance()
    console.log(`  [${listas}/${fotos.length}] ${rel}: ${pendientes.length} versiones`)
  }
}

// Varias fotos a la vez
const cola = [...fotos]
await Promise.all(
  Array.from({ length: A_LA_VEZ }, async () => {
    while (cola.length) await procesar(cola.shift())
  }),
)

// Borra versiones de fotos que ya no existen o cambiaron de nombre
if (existsSync(DESTINO)) {
  for (const f of listar(DESTINO)) if (!esperados.has(f)) rmSync(f)
}
writeFileSync(HUELLAS, JSON.stringify(huellas))

// Mismo orden siempre (el procesamiento en paralelo termina en desorden)
const ordenado = Object.fromEntries(Object.keys(manifiesto).sort().map((k) => [k, manifiesto[k]]))
writeFileSync(MANIFIESTO, JSON.stringify(ordenado, null, 2) + '\n')
const seg = ((Date.now() - inicio) / 1000).toFixed(1)
console.log(`Imágenes: ${fotos.length} fotos · ${generadas} versiones nuevas · ${esperados.size - generadas} reutilizadas (${seg}s)`)
if (pesadas.length) {
  console.warn(`\n⚠ ${pesadas.length} foto(s) de más de ${PESADA_MB} MB. Funcionan, pero hacen lento el repo y la publicación.`)
  console.warn('  Antes de subirlas, redúcelas a ~2400 px de ancho (la web nunca usa más):')
  for (const p of pesadas) console.warn('   - ' + p)
}
