# pruebascharlee.exblake.com
Este repositorio alberga la página web pruebascharlee.exblake.com, la cual será un espejo de la original: thecharlee.com

## Publicar

**Automático:** cada `git push` a `main` publica en https://pruebascharlee.exblake.com (VPS de Hostinger con CloudPanel). El avance se ve en la pestaña **Actions** del repo; si sale en rojo, **el sitio queda como estaba** y el error dice por qué.

Qué hace GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)), en orden; si un paso falla, no sigue:

1. `npm ci`: instala exactamente lo de `package-lock.json`. Si agregas una librería, corre `npm install` y sube también el `package-lock.json`.
2. `npm run revisar`: comprueba que cada imagen y video que usa el código exista en `public/` **con el nombre exacto**. En Windows `Deluxe-1.jpg` y `deluxe-1.jpg` son lo mismo; en el servidor no, y la foto sale rota. Córrelo tú antes de hacer push.
3. Recupera de la caché de GitHub las versiones optimizadas de las fotos (ver [Imágenes optimizadas](#imágenes-optimizadas-avif--webp)).
4. `npm run build`: primero optimiza las fotos nuevas o cambiadas (`prebuild`) y luego genera el sitio en `dist/` (Vite). `dist/` no se sube al repo.
5. Revisa que `dist/` esté completo (portada, JS, CSS, `robots.txt`) **antes** de subir nada.
6. Sube `dist/` al VPS por SSH (`/home/pruebascharlee/htdocs/pruebascharlee.exblake.com`). Lo que ya no está en `dist/` se borra del servidor: no subas archivos a mano.
7. Comprueba la portada, una ruta interna (`/habitaciones`), el JS y el CSS como los vería un visitante.

Reglas para no romperlo:

- `index.html` (raíz) es la plantilla de la app; `public/` solo guarda archivos que se copian tal cual (imágenes, videos, `robots.txt`).
- Si **reemplazas una foto o video**, súbelo con el mismo nombre solo si no importa que algunos visitantes vean el anterior hasta 1 hora; si importa, cámbiale el nombre y la ruta en `src/content.js`.
- Para probar antes de publicar: `npm run build` y luego `npm run preview`.
- También se puede publicar sin cambios: **Actions → Publicar en el VPS → Run workflow**.
- Es un sitio de pruebas (espejo de thecharlee.com): no se indexa en Google (`public/robots.txt` + cabecera `X-Robots-Tag`). No borres `public/robots.txt`: el deploy falla si falta.

**Configuración del servidor (una sola vez):** [`deploy/setup-vps.sh`](deploy/setup-vps.sh) se corre como root en el VPS; crea el sitio en CloudPanel, la llave SSH para GitHub y el certificado HTTPS, e imprime los 4 secretos (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`) que van en Settings → Secrets and variables → Actions.

En CloudPanel → Sites → pruebascharlee.exblake.com → **Vhost**, debajo de `index index.html;`:

```nginx
  add_header X-Robots-Tag "noindex, nofollow" always;

  # App de React: rutas como /habitaciones/deluxe las resuelve index.html
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Fotos (originales y versiones optimizadas de /_img) y videos: caché de 1 hora
  # (si no, quien ya visitó vería las fotos viejas para siempre)
  location ~* ^/(images|_img|videos)/ {
    expires 1h;
  }
```

> Si el Vhost del servidor todavía dice `^/(images|videos)/`, agrégale `_img` como arriba: sin eso, las versiones optimizadas se sirven con la caché por defecto de Nginx.

## Imágenes optimizadas (AVIF / WebP)

### Resumen

Las fotos se suben **una sola vez, en JPG**, a `public/images/`. Antes de cada `npm run dev` y `npm run build`, un script genera automáticamente versiones **AVIF** y **WebP** en **varios anchos**, y el componente `<Img>` las sirve con `<picture>` + `srcset`. Así cada navegador descarga **solo el formato y el tamaño que necesita** (un celular no descarga la foto de 2400 px). El JPG original queda como último respaldo.

Medido en Chrome, recorriendo la página completa (peso total de fotos):

| Página | JPG originales | Con optimización |
| --- | --- | --- |
| `/habitaciones/king`, escritorio 1440 px | 4,4 MB | 0,86 MB |
| `/habitaciones/king`, celular 390 px (DPR 3) | 4,0 MB | 0,80 MB |
| `/` (inicio), escritorio 1440 px | 7,9 MB | 1,9 MB |
| `/` (inicio), celular 390 px (DPR 3) | 6,0 MB | 1,4 MB |

### Cómo fluye

```text
public/images/rooms/king-1.jpg                  ← lo único que sube una persona
        │
        │  npm run imagenes   (corre solo en predev / prebuild)
        │  scripts/optimizar-imagenes.mjs  (usa sharp)
        ▼
public/_img/rooms/king-1-480.avif   king-1-480.webp
public/_img/rooms/king-1-960.avif   king-1-960.webp      ← generado, NO va al repo
public/_img/rooms/king-1-1600.avif  king-1-1600.webp
public/_img/rooms/king-1-2400.avif  king-1-2400.webp
src/imagenes.json                                        ← índice generado, NO va al repo
.cache/imagenes-huellas.json                             ← huellas para no reprocesar, NO va al repo
        │
        │  import imagenes from '../imagenes.json'  (src/components/ui.jsx)
        ▼
<Img src="/images/rooms/king-1.jpg" sizes="…" />  →  <picture>
                                                       <source type="image/avif" srcset="…-480.avif 480w, …" sizes="…">
                                                       <source type="image/webp" srcset="…-480.webp 480w, …" sizes="…">
                                                       <img src="/images/rooms/king-1.jpg" width height loading decoding>
                                                     </picture>
```

En el código **siempre se referencia la ruta del original** (`/images/...jpg`), nunca `/_img/...`. La traducción a las versiones optimizadas la hace el componente.

### Archivos involucrados

| Archivo | Qué hace |
| --- | --- |
| [`scripts/optimizar-imagenes.mjs`](scripts/optimizar-imagenes.mjs) | Recorre `public/images/**` (`.jpg`, `.jpeg`, `.png`, `.webp`), genera las versiones en `public/_img/`, escribe el índice `src/imagenes.json` y borra versiones huérfanas. |
| [`src/components/ui.jsx`](src/components/ui.jsx) | `responsive(src)` arma los `srcset`; `<Picture>` renderiza `<picture>`; `<Img>` (el componente que usan las páginas) usa `<Picture>` y además muestra un bloque de color si la foto no existe. |
| [`src/components/Lightbox.jsx`](src/components/Lightbox.jsx) | Foto ampliada y miniaturas con `<Picture>`; precarga la foto anterior/siguiente con el mismo `srcset` AVIF para que quede en caché. |
| [`src/components/Preloader.jsx`](src/components/Preloader.jsx) | Las 5 fotos de la pantalla de carga usan `<Picture>`. |
| [`package.json`](package.json) | `imagenes` corre el script; `predev` y `prebuild` lo ejecutan solos. `sharp` está en `devDependencies`. |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Paso **Recuperar imágenes optimizadas** (`actions/cache`) antes del build. |
| [`.gitignore`](.gitignore) | Ignora `public/_img/`, `src/imagenes.json` y `.cache/`. |

### Comandos

| Comando | Cuándo |
| --- | --- |
| `npm run dev` | Desarrollo. Antes de arrancar Vite optimiza lo pendiente. |
| `npm run build` | Genera el sitio. Antes optimiza lo pendiente (así también corre en GitHub Actions). |
| `npm run imagenes` | A mano, p. ej. si agregaste fotos con `npm run dev` ya corriendo (Vite **no** vigila `public/images/`: corre esto y recarga la página). |

### El script en detalle

Configuración (arriba del archivo):

```js
const ANCHOS = [480, 960, 1600, 2400]           // anchos que se generan
const FORMATOS = {
  avif: (img) => img.avif({ quality: 50, effort: 4 }),  // ~50 % menos que JPG
  webp: (img) => img.webp({ quality: 78 }),             // respaldo, ~30 % menos que JPG
}
```

Para cada foto:

1. **Lee las dimensiones** con `sharp(...).metadata()`, respetando la orientación EXIF (las fotos de celular giradas se corrigen con `.rotate()` al generar).
2. **Decide los anchos sin agrandar nunca:** usa los de `ANCHOS` menores que el ancho original y, si el original mide 2400 px o menos, agrega también el ancho original. Ejemplo: un JPG de 1800 px genera `480, 960, 1600, 1800`; uno de 4000 px genera `480, 960, 1600, 2400`.
3. **Calcula una huella SHA-1 del contenido del archivo.** Si coincide con la guardada en `.cache/imagenes-huellas.json` y las versiones ya existen, no hace nada. Se compara el **contenido** y no la fecha a propósito: en GitHub Actions el `checkout` deja todos los archivos con fecha nueva, y con fechas se regeneraría todo en cada publicación.
4. **Genera** `public/_img/<ruta>-<ancho>.<avif|webp>` para cada ancho y formato.
5. **Registra** la foto en el índice.

Al final **borra de `public/_img/` las versiones que ya no corresponden** a ninguna foto (renombradas o eliminadas), guarda las huellas y escribe `src/imagenes.json`. Imprime algo como:

```text
Imágenes: 85 fotos · 8 versiones nuevas · 660 reutilizadas (3.1s)
```

Tiempos de referencia (Windows, 85 fotos): **~4 min** la primera vez (668 versiones; AVIF es lo lento), **~0,2 s** cuando no hay cambios, unos segundos por cada foto nueva.

Formato de `src/imagenes.json` (clave = ruta pública del original):

```json
{
  "/images/rooms/deluxe-1.jpg": { "w": 1800, "h": 1350, "anchos": [480, 960, 1600, 1800] }
}
```

### El componente en detalle

```jsx
import { Img } from '../components/ui'

// Ocupa todo el ancho de la pantalla (portadas, fondos): no hace falta `sizes`
<Img src="/images/hero.jpg" alt="The Charlee" eager className="h-full w-full" />

// Tarjeta que mide 40 % del ancho en escritorio y 78 % en celular
<Img src={room.images[0].src} alt={room.name} sizes="(min-width: 1024px) 40vw, 78vw" className="h-full w-full" />
```

Props de `<Img>`:

| Prop | Por defecto | Para qué |
| --- | --- | --- |
| `src` | — | Ruta del **original** en `public/` (`/images/...`). |
| `alt` | `''` | Texto alternativo. |
| `sizes` | `'100vw'` | **Qué tan ancha se ve la foto en pantalla.** El navegador lo combina con la densidad de píxeles para elegir del `srcset`. Si una foto se ve pequeña y no le pones `sizes`, funciona igual pero descarga una versión más grande de la necesaria. |
| `eager` | `false` | `true` para fotos visibles al cargar (portadas): `loading="eager"`. El resto carga en diferido (`lazy`). |
| `dark` | `false` | Tono del bloque de color que aparece si la foto no existe. |
| `className` | `''` | Clases del contenedor; la foto siempre llena el contenedor con `object-cover`. |

Cómo elige el navegador: con `sizes="78vw"` en un celular de 390 px y densidad 3, la foto mide 304 px CSS × 3 = ~912 px reales → descarga `-960.avif`. En un escritorio de 1440 px con `sizes="100vw"` y densidad 1 → `-1600.avif`.

Si necesitas una foto optimizada **fuera** de `<Img>` (sin contenedor ni bloque de color), usa `<Picture src sizes alt className ... />`, que pasa el resto de props al `<img>`. Para precargar en JS, `responsive(src)` devuelve `{ avif, webp, w, h }` (los `srcset`) o `null`.

Si una foto **no está en el índice** (por ejemplo, la agregaste y no corriste el script), `<Img>` y `<Picture>` usan el original sin optimizar: la página nunca se rompe por esto.

### En GitHub Actions

`npm ci` instala `sharp` con su binario para Linux (está en `package-lock.json`: `@img/sharp-linux-x64`). El paso **Recuperar imágenes optimizadas** restaura `public/_img/` y `.cache/imagenes-huellas.json` de la caché de GitHub:

- **Clave:** `imagenes-<hash de public/images/** y del script>`. Si no cambió ninguna foto ni el script, se restaura todo y el build no regenera nada.
- **`restore-keys: imagenes-`:** si cambiaron algunas fotos, se restaura la caché anterior más parecida y el script solo procesa las nuevas o cambiadas (gracias a las huellas).
- Sin caché (primera vez, o si GitHub la borró por no usarse en 7 días) el build tarda unos minutos más, pero funciona igual.

Las versiones quedan dentro de `dist/_img/` (Vite copia `public/` tal cual) y se suben al servidor junto con el resto del sitio.

### Tareas comunes

**Agregar o reemplazar fotos**
1. Pon el JPG en `public/images/...` con nombre en minúsculas, sin espacios ni tildes (`king-3.jpg`). Exporta en buena calidad: la compresión la hace el script.
2. Si es una foto nueva, agrégala en [`src/content.js`](src/content.js) (para las habitaciones, la cantidad de fotos es el tercer argumento de `room(...)`).
3. `npm run revisar` (que exista con el nombre exacto) y `npm run dev` o `npm run imagenes`.
4. Haz commit **solo de `public/images/...`** y del código. `public/_img/` no se sube.

**Cambiar anchos o calidad:** edita `ANCHOS` o `FORMATOS` en el script. Las huellas no detectan cambios de configuración, así que borra lo generado para regenerar todo: `rm -rf public/_img .cache` y `npm run imagenes`. En GitHub la clave de caché incluye el hash del script, así que se regenera sola.

**Ver qué versión cargó una foto:** DevTools → Elements → selecciona el `<img>` → en la consola `$0.currentSrc`. O en la pestaña Network, filtra por `_img`.

### Qué NO se optimiza

- **SVG** (logos en `public/images/logos/`): ya son livianos y vectoriales; se usan con `<img>` normal.
- **Videos** (`public/videos/`): se sirven tal cual. Recomendado: MP4, 10–20 s, sin audio, menos de 10 MB.
- **Imágenes escritas con `<img>` a mano** en vez de `<Img>`/`<Picture>`: usan el original. Usa siempre `<Img>` para fotos.

### Problemas frecuentes

| Síntoma | Causa y solución |
| --- | --- |
| `Failed to resolve import "../imagenes.json"` al abrir el sitio | Se arrancó Vite directamente (`npx vite`) sin pasar por `npm run dev`. Corre `npm run imagenes` una vez, o usa `npm run dev`. |
| La foto nueva se ve pero pesa mucho (carga el `.jpg`) | No está en el índice: corre `npm run imagenes` y recarga. |
| Bloque de color con la ruta `public/...` en lugar de la foto | El original no existe con ese nombre exacto. `npm run revisar` dice cuál. |
| `npm ci` falla con un error de `sharp` en Actions | Al agregar dependencias desde Windows, regenera el lock con `npm install` y súbelo; debe incluir `@img/sharp-linux-x64`. |
| Cambié la calidad y no pasa nada | Las huellas solo miran el contenido de las fotos: borra `public/_img` y `.cache` y vuelve a correr. |
| Reemplacé una foto con el mismo nombre y algunos ven la vieja | Caché de 1 hora del servidor (ver Vhost). Si importa, cambia el nombre del archivo. |
