param(
  [switch]$SkipDb
)

Write-Host "=== SmartEvents - Setup ===" -ForegroundColor Cyan

# Check Node.js
try {
  $nodeVer = node -v
  Write-Host "Node.js: $nodeVer" -ForegroundColor Green
} catch {
  Write-Host "Node.js no encontrado. Instalalo desde https://nodejs.org" -ForegroundColor Red; exit 1
}

# Install backend dependencies
Write-Host "`nInstalando dependencias del backend..." -ForegroundColor Yellow
Set-Location -LiteralPath "$PSScriptRoot\backend"
npm install
if ($?) { Write-Host "Dependencias instaladas" -ForegroundColor Green } else { Write-Host "Error instalando dependencias" -ForegroundColor Red; exit 1 }

# Create .env if missing
if (-not (Test-Path ".env")) {
  Write-Host "Creando .env con valores por defecto..." -ForegroundColor Yellow
  @"
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smartevents
JWT_SECRET=$( -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_}) )
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:contacto@smartevents.cl
"@ | Set-Content -Path ".env" -Encoding ASCII
  Write-Host ".env creado. Editalo con tus credenciales de MySQL." -ForegroundColor Yellow
}

# MySQL check
if (-not $SkipDb) {
  try {
    $mysql = mysql --version
    Write-Host "MySQL: $mysql" -ForegroundColor Green
  } catch {
    Write-Host "MySQL CLI no encontrado. Asegurate de que MySQL este instalado y corriendo." -ForegroundColor Yellow
  }
}

Write-Host "`n=== Setup completado ===" -ForegroundColor Cyan
Write-Host "Para iniciar el backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "Para abrir el frontend: abre index.html en tu navegador o usa Live Server" -ForegroundColor White
