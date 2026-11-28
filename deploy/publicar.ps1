# ============================================================
#  Taza Ideal - publicar en el VPS lo que esta en la rama main
#
#  Uso (desde la raiz del repositorio, en PowerShell):
#     .\deploy\publicar.ps1                  # backend y frontend
#     .\deploy\publicar.ps1 -SoloBackend
#     .\deploy\publicar.ps1 -SoloFrontend
#
#  Regla del proyecto: en el VPS NO se edita codigo a mano. Todo cambio pasa por
#  GitHub (rama -> PR -> main) y este script compila y sube exactamente main.
# ============================================================
param(
    [string]$Servidor = "azureuser@68.155.155.10",
    [switch]$SoloBackend,
    [switch]$SoloFrontend
)
$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

# 1) Solo se publica main, actualizado y sin cambios sin guardar
$rama = git branch --show-current
if ($rama -ne "main") { throw "Cambia a main antes de publicar (estas en '$rama')." }
if (git status --porcelain) { throw "Hay cambios sin commit. Publica solo lo que ya esta en main." }
git pull --ff-only
$commit = git rev-parse --short HEAD
Write-Host "Publicando main @ $commit" -ForegroundColor Cyan

$archivos = @()

# 2) Backend: compilar el JAR (sin application.properties adentro)
if (-not $SoloFrontend) {
    Push-Location backend
    .\mvnw.cmd -q clean package -DskipTests
    Pop-Location
    Copy-Item backend\target\tazaideal-0.0.1-SNAPSHOT.jar "$env:TEMP\taza-ideal.jar" -Force
    $archivos += "$env:TEMP\taza-ideal.jar"
}

# 3) Frontend: compilar React con Vite
if (-not $SoloBackend) {
    Push-Location frontend
    npm ci
    npm run build
    Pop-Location
    tar -czf "$env:TEMP\taza-ideal-web.tgz" -C frontend\dist .
    $archivos += "$env:TEMP\taza-ideal-web.tgz"
}

# 4) Subir y aplicar en el servidor (pide la contrasena SSH)
scp @archivos "${Servidor}:/tmp/"

$remoto = @'
set -e
if [ -f /tmp/taza-ideal.jar ]; then
  sudo install -o tazaideal -g tazaideal -m 640 /tmp/taza-ideal.jar /opt/taza-ideal/taza-ideal.jar
  sudo systemctl restart taza-ideal
  echo "Backend reiniciado"
fi
if [ -f /tmp/taza-ideal-web.tgz ]; then
  sudo rm -rf /var/www/taza-ideal/*
  sudo tar -xzf /tmp/taza-ideal-web.tgz -C /var/www/taza-ideal
  sudo chmod -R a+rX /var/www/taza-ideal
  echo "Frontend actualizado"
fi
rm -f /tmp/taza-ideal.jar /tmp/taza-ideal-web.tgz
sleep 15
CODIGO=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8085/api/categorias)
echo "API /api/categorias -> HTTP $CODIGO"
'@
# El script se manda por la entrada estandar para que PowerShell no le quite las comillas.
# UTF-8 sin BOM: con BOM bash recibe un caracter invisible al inicio ("set: command not found").
$OutputEncoding = New-Object System.Text.UTF8Encoding $false
($remoto -replace "`r", "") | ssh $Servidor "bash -s"
Write-Host "Listo: https://tazaideal.online (main @ $commit)" -ForegroundColor Green
