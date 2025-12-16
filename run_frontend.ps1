
Write-Host "Iniciando Frontend..."
# Navegar a la carpeta frontend relativa a este script
Set-Location -Path "$PSScriptRoot\frontend" -ErrorAction Stop

Write-Host "Directorio actual: $(Get-Location)"

# Instalar dependencias si no existen
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependencias (npm install)..."
    npm install
}

# Iniciar servidor
Write-Host "Arrancando Vite..."
npm run dev
