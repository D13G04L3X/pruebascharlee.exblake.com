#!/usr/bin/env bash
# Configura https://pruebascharlee.exblake.com en el VPS con CloudPanel.
# Se corre UNA sola vez, como root, en el VPS:   bash /root/setup-vps.sh
# Es seguro volver a correrlo: no duplica nada.
set -euo pipefail

DOMINIO="pruebascharlee.exblake.com"
USUARIO="pruebascharlee"                    # usuario del sitio en CloudPanel (nuevo, solo para este sitio)
CARPETA="/home/$USUARIO/htdocs/$DOMINIO"    # aquí sube GitHub los archivos

[ "$(id -u)" -eq 0 ] || { echo "Córrelo como root"; exit 1; }
command -v clpctl >/dev/null || { echo "!! No encontré CloudPanel (clpctl). Avísale a Claude."; exit 1; }

echo "==> Instalando rsync (lo usa GitHub para subir los archivos)…"
command -v rsync >/dev/null || { apt-get update -qq && apt-get install -y -qq rsync >/dev/null; }

if id "$USUARIO" >/dev/null 2>&1; then
  [ -d "$CARPETA" ] || { echo "!! El usuario '$USUARIO' ya existe pero no es de $DOMINIO. No toco nada. Avísale a Claude."; exit 1; }
  echo "==> El sitio ya existe en CloudPanel, no lo vuelvo a crear."
else
  echo "==> Creando el sitio estático $DOMINIO en CloudPanel…"
  CLAVE_SITIO=$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-24)
  clpctl site:add:static --domainName="$DOMINIO" --siteUser="$USUARIO" --siteUserPassword="$CLAVE_SITIO"
  echo "    Contraseña del usuario '$USUARIO' (guárdala, casi nunca la necesitarás): $CLAVE_SITIO"
fi

echo "==> Generando la llave SSH para GitHub…"
SSH_DIR="/home/$USUARIO/.ssh"
mkdir -p "$SSH_DIR"
[ -f "$SSH_DIR/github_deploy" ] || ssh-keygen -t ed25519 -N "" -C "github-actions-pruebascharlee" -f "$SSH_DIR/github_deploy" >/dev/null
touch "$SSH_DIR/authorized_keys"
grep -qF "$(cat "$SSH_DIR/github_deploy.pub")" "$SSH_DIR/authorized_keys" || cat "$SSH_DIR/github_deploy.pub" >> "$SSH_DIR/authorized_keys"
chown -R "$USUARIO:$USUARIO" "$SSH_DIR"
chmod 700 "$SSH_DIR"; chmod 600 "$SSH_DIR"/*

# Página temporal hasta el primer deploy
[ -f "$CARPETA/robots.txt" ] || { printf 'User-agent: *\nDisallow: /\n' > "$CARPETA/robots.txt"; chown "$USUARIO:$USUARIO" "$CARPETA/robots.txt"; }

echo "==> Pidiendo el certificado HTTPS (Let's Encrypt)…"
clpctl lets-encrypt:install:certificate --domainName="$DOMINIO" || echo "!! No se pudo emitir el certificado. Hazlo desde CloudPanel → Sites → $DOMINIO → SSL/TLS."

IP=$(curl -fsS -4 https://ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo
echo "================================================================"
echo " LISTO. Crea estos 4 secretos en GitHub:"
echo " Repo → Settings → Secrets and variables → Actions → New repository secret"
echo "================================================================"
echo
echo "VPS_HOST:"
echo "$IP"
echo
echo "VPS_USER:"
echo "$USUARIO"
echo
echo "VPS_KNOWN_HOSTS (copia TODAS las líneas):"
ssh-keyscan -t ed25519,rsa,ecdsa localhost 2>/dev/null | sed "s/^localhost/$IP/"
echo
echo "VPS_SSH_KEY (copia TODO, incluidas las líneas BEGIN y END):"
cat "$SSH_DIR/github_deploy"
echo
