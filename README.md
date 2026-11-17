# pruebascharlee.exblake.com
Este repositorio alberga la página web pruebascharlee.exblake.com, la cual será un espejo de la original: thecharlee.com

## Publicar

**Automático:** cada `git push` a `main` publica en https://pruebascharlee.exblake.com (VPS de Hostinger con CloudPanel). El avance se ve en la pestaña **Actions** del repo; si sale en rojo, **el sitio queda como estaba** y el error dice por qué.

Qué hace GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)), en orden; si un paso falla, no sigue:

1. `npm ci`: instala exactamente lo de `package-lock.json`. Si agregas una librería, corre `npm install` y sube también el `package-lock.json`.
2. `npm run revisar`: comprueba que cada imagen y video que usa el código exista en `public/` **con el nombre exacto**. En Windows `Deluxe-1.jpg` y `deluxe-1.jpg` son lo mismo; en el servidor no, y la foto sale rota. Córrelo tú antes de hacer push.
3. `npm run build`: genera el sitio en `dist/` (Vite). `dist/` no se sube al repo.
4. Revisa que `dist/` esté completo (portada, JS, CSS, `robots.txt`) **antes** de subir nada.
5. Sube `dist/` al VPS por SSH (`/home/pruebascharlee/htdocs/pruebascharlee.exblake.com`). Lo que ya no está en `dist/` se borra del servidor: no subas archivos a mano.
6. Comprueba la portada, una ruta interna (`/habitaciones`), el JS y el CSS como los vería un visitante.

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

  # Fotos y videos: caché de 1 hora (si no, quien ya visitó vería las fotos viejas para siempre)
  location ~* ^/(images|videos)/ {
    expires 1h;
  }
```
