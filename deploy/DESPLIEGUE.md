# Despliegue de Taza Ideal en el VPS

Sitio: **https://tazaideal.online** · Backend en `127.0.0.1:8085` detrás de Nginx.

## Regla: nada se modifica a mano en el VPS

Todo cambio de código o de configuración se hace en GitHub (rama → PR → revisión → `main`).
En el servidor solo se **instala** lo que está en `main`, con los archivos de esta carpeta
y el script `publicar.ps1`. Lo único que existe solo en el VPS es
`/opt/taza-ideal/application.properties`, porque guarda contraseñas y tokens.

| Archivo | Para qué sirve |
|---|---|
| `taza-ideal.service` | Servicio systemd del backend (puerto 8085, se reinicia solo si falla) |
| `nginx-taza-ideal.conf` | HTTPS, frontend de React, `/api` y `/uploads` hacia el backend |
| `crear_base_vps.sql` | Base `taza_ideal` y usuario `taza_ideal_app` (no toca la base del proyecto anterior) |
| `application.properties.vps.example` | Plantilla de la configuración de producción |
| `publicar.ps1` | Compila `main` en la PC y lo sube al VPS |

## Lo que ya tiene el VPS

- Java 21, MySQL 8, Nginx, Postfix (reenvía el correo por el SMTP del dominio).
- Certificado de Let's Encrypt para `tazaideal.online`.
- Usuario de sistema `tazaideal`.
- El proyecto anterior (`tazaideal-api`) está **detenido y deshabilitado**, así que el puerto 8085 está libre.

## Instalación (una sola vez)

En la PC, desde la raíz del repositorio actualizado en `main`:

```powershell
scp deploy/* azureuser@68.155.155.10:/tmp/taza-ideal-deploy/
```

> Si la carpeta no existe, créala antes en el VPS con `mkdir -p /tmp/taza-ideal-deploy`.

En el VPS (`ssh azureuser@68.155.155.10`):

```bash
cd /tmp/taza-ideal-deploy

# 1. Carpetas
sudo mkdir -p /opt/taza-ideal/uploads /var/www/taza-ideal
sudo chown -R tazaideal:tazaideal /opt/taza-ideal

# 2. Base de datos (antes cambia CAMBIA_ESTA_CLAVE en el archivo)
nano crear_base_vps.sql
sudo mysql < crear_base_vps.sql

# 3. Configuración de producción (llenar contraseña de la base, JWT y Twilio)
sudo cp application.properties.vps.example /opt/taza-ideal/application.properties
openssl rand -base64 48            # copia el resultado en app.jwt.secreto
sudo nano /opt/taza-ideal/application.properties
sudo chown tazaideal:tazaideal /opt/taza-ideal/application.properties
sudo chmod 600 /opt/taza-ideal/application.properties

# 4. Servicio systemd
sudo cp taza-ideal.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable taza-ideal

# 5. Nginx: cambiar el sitio anterior por el nuevo
ls /etc/nginx/sites-enabled/                       # ubica el sitio viejo (tazaideal)
sudo rm /etc/nginx/sites-enabled/tazaideal         # solo quita el enlace; el archivo queda para regresar
sudo cp nginx-taza-ideal.conf /etc/nginx/sites-available/taza-ideal
sudo ln -s /etc/nginx/sites-available/taza-ideal /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Luego publica el código desde la PC (siguiente sección). Flyway crea las 11 tablas y carga los datos de prueba al primer arranque.

## Publicar una versión nueva

Cada vez que se une un PR a `main`:

```powershell
git checkout main
.\deploy\publicar.ps1
```

El script se niega a publicar si no estás en `main` o si hay cambios sin commit.

## Comprobar

```bash
systemctl status taza-ideal --no-pager
journalctl -u taza-ideal -n 50 --no-pager          # debe decir "Migrating schema ... to version 2" la primera vez
curl -s http://127.0.0.1:8085/api/categorias       # JSON con 6 categorías
```

En el navegador: `https://tazaideal.online` (candado), iniciar sesión con los 3 roles,
hacer un pedido y marcarlo como **Listo** desde el barista para recibir el correo, el SMS y el WhatsApp.

## Regresar al proyecto anterior (solo si algo sale mal)

```bash
sudo systemctl disable --now taza-ideal
sudo rm /etc/nginx/sites-enabled/taza-ideal
sudo ln -s /etc/nginx/sites-available/tazaideal /etc/nginx/sites-enabled/
sudo systemctl enable --now tazaideal-api
sudo nginx -t && sudo systemctl reload nginx
```
