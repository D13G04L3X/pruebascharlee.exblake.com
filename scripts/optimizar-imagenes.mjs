// Genera versiones optimizadas de cada foto de public/images:
//   AVIF (la más liviana) y WebP (respaldo) en varios anchos, en public/_img/.
// También escribe src/imagenes.json con los anchos disponibles de cada foto; el componente <Img>
// lo usa para que cada navegador descargue solo el formato y el tamaño que necesita.
//
// Se ejecuta solo antes de "npm run dev" y "npm run build" (predev / prebuild).
// Solo procesa fotos nuevas o modificadas (compara el contenido, no la fecha: en GitHub Actions
// todos los archivos llegan con fecha nueva); las demás se reutilizan.
// Uso manual: npm run imagenes
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import sharp from 'sharp'

const ORIGEN = 'public/images'
const DESTINO = 'public/_img'
const MANIFIESTO = 'src/imagenes.json'
const HUELLAS = '.cache/imagenes-huellas.json' // huella de cada foto ya procesada (fuera de public: no se publica)
const ANCHOS = [480, 960, 1600, 2400]
const FORMATOS = {
  avif: (img) => img.avif({ quality: 50, effort: 4 }),
  webp: (img) => img.webp({ quality: 78 }),
}
const EXT = /\.(jpe?g|png|webp)$/i

const listar = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? listar(join(dir, e.name)) : [join(dir, e.name)]))

const fotos = existsSync(ORIGEN) ? listar(ORIGEN).filter((f) => EXT.test(f)) : []
const manifiesto = {}
const previas = existsSync(HUELLAS) ? JSON.parse(readFileSync(HUELLAS, 'utf8')) : {}
const huellas = {}
const esperados = new Set()
let generadas = 0
const inicio = Date.now()

for (const archivo of fotos) {
  const rel = relative(ORIGEN, archivo).split(sep).join('/') // rooms/king-1.jpg
  const base = rel.replace(EXT, '') // rooms/king-1
  const meta = await sharp(archivo).metadata()
  const ancho = meta.autoOrient?.width ?? meta.width
  const alto = meta.autoOrient?.height ?? meta.height
  // Nunca se agranda: anchos menores que el original, y el original si es más chico que 2400
  const anchos = ANCHOS.filter((w) => w < ancho)
  if (ancho <= ANCHOS.at(-1) && !anchos.includes(ancho)) anchos.push(ancho)
  if (!anchos.length) anchos.push(ancho)

  const huella = createHash('sha1').update(readFileSync(archivo)).digest('hex')
  const igual = previas[rel] === huella
  huellas[rel] = huella
  for (const w of anchos) {
    for (const [fmt, codificar] of Object.entries(FORMATOS)) {
      const salida = join(DESTINO, `${base}-${w}.${fmt}`)
      esperados.add(salida)
      if (igual && existsSync(salida)) continue
      mkdirSync(dirname(salida), { recursive: true })
      await codificar(sharp(archivo).rotate().resize({ width: w, withoutEnlargement: true })).toFile(salida)
      generadas++
    }
  }
  manifiesto[`/images/${rel}`] = { w: ancho, h: alto, anchos }
}

// Borra versiones de fotos que ya no existen o cambiaron de nombre
if (existsSync(DESTINO)) {
  for (const f of listar(DESTINO)) if (!esperados.has(f)) rmSync(f)
}
mkdirSync(dirname(HUELLAS), { recursive: true })
writeFileSync(HUELLAS, JSON.stringify(huellas))

writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + '\n')
const seg = ((Date.now() - inicio) / 1000).toFixed(1)
console.log(`Imágenes: ${fotos.length} fotos · ${generadas} versiones nuevas · ${esperados.size - generadas} reutilizadas (${seg}s)`)
