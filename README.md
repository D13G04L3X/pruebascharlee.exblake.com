# pruebascharlee.exblake.com
Este repositorio alberga la página web pruebascharlee.exblake.com, la cual será un espejo de la original: thecharlee.com

## Publicar

**Automático:** cada `git push` a `main` publica en https://pruebascharlee.exblake.com (VPS de Hostinger con CloudPanel).

- El sitio es HTML plano: todo lo que esté en la carpeta [`public/`](public/) es el sitio (`public/index.html` es la portada, `public/404.html` la página de error).
- GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) sube `public/` al VPS por SSH (`/home/pruebascharlee/htdocs/pruebascharlee.exblake.com`) y luego comprueba que el sitio responda. El avance se ve en la pestaña **Actions** del repo; si sale en rojo, el error dice por qué.
- Lo que se borre de `public/` también se borra del servidor. No subas archivos al servidor a mano: el siguiente push los borraría.
- También se puede publicar sin hacer cambios: **Actions → Publicar en el VPS → Run workflow**.
- Es un sitio de pruebas (espejo de thecharlee.com): no se indexa en Google (`robots.txt` + `noindex`).

**Configuración inicial (una sola vez):** [`deploy/setup-vps.sh`](deploy/setup-vps.sh) se corre como root en el VPS; crea el sitio en CloudPanel, la llave SSH para GitHub y el certificado HTTPS, e imprime los 4 secretos (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`) que van en Settings → Secrets and variables → Actions.
