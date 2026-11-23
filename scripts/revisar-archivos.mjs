// Revisa que cada imagen y video que usa el sitio exista en public/ con el nombre EXACTO.
// En Windows "Hero.JPG" y "hero.jpg" son el mismo archivo; en el servidor (Linux) no, y la foto sale rota.
// Uso: npm run revisar   (GitHub Actions lo corre antes de publicar; si falla, no se publica nada)
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { createServer } from 'vite'

const RUTA = /^\/(images|videos)\/[^\s"'`]+\.[a-z0-9]+$/i

// Archivos dentro de una carpeta, como "/sub/archivo.ext", con mayúsculas y minúsculas exactas
const listar = (base, dir = base) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listar(base, join(dir, e.name)) : ['/' + relative(base, join(dir, e.name)).split(sep).join('/')],
  )
const existentes = new Set(listar('public'))

const usadas = new Map() // ruta -> de dónde sale

// 1) Rutas escritas tal cual en el código (src/ e index.html)
// src/imagenes.json se excluye: es un índice generado (npm run imagenes) y puede estar desactualizado
const fuentes = ['index.html', ...listar('src').map((f) => 'src' + f).filter((f) => f !== 'src/imagenes.json')]
for (const f of fuentes) {
  for (const m of readFileSync(f, 'utf8').matchAll(/["'`](\/(?:images|videos)\/[^"'`$]+)["'`]/g)) usadas.set(m[1], f)
}

// 2) Rutas que se arman con variables en los archivos de contenido (p. ej. /images/rooms/${media}-${i + 1}.jpg)
const server = await createServer({ configFile: false, logLevel: 'silent', server: { middlewareMode: true }, appType: 'custom' })
try {
  for (const archivo of ['/src/content.js']) {
    const recorrer = (v) => {
      if (typeof v === 'string') RUTA.test(v) && usadas.set(v, archivo.slice(1))
      else if (v && typeof v === 'object') Object.values(v).forEach(recorrer)
    }
    recorrer(await server.ssrLoadModule(archivo))
  }
} finally {
  await server.close()
}

const faltan = [...usadas].filter(([ruta]) => !existentes.has(ruta))
if (faltan.length) {
  console.error(`\n✗ Faltan ${faltan.length} archivo(s) en public/ (o el nombre no coincide en mayúsculas/minúsculas):\n`)
  for (const [ruta, origen] of faltan) console.error(`  public${ruta}   ← usado en ${origen}`)
  console.error('\nCorrige el nombre del archivo o la ruta en el código. No se publicó nada.\n')
  process.exit(1)
}
console.log(`✓ Las ${usadas.size} imágenes y videos que usa el sitio existen en public/.`)
