# setup-db.ps1
# Crée la base de données PostgreSQL pour le projet
# Lance ce script UNE SEULE FOIS avant le premier démarrage

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RestaurantPFA - Création base de données" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Chercher psql dans les emplacements courants
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "psql"
)

$psql = $null
foreach ($path in $psqlPaths) {
    if (Get-Command $path -ErrorAction SilentlyContinue) {
        $psql = $path
        break
    }
}

if (-not $psql) {
    Write-Host "[ERREUR] psql non trouvé." -ForegroundColor Red
    Write-Host "Installe PostgreSQL depuis : https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "Ou utilise Docker : docker compose up" -ForegroundColor Yellow
    Read-Host "Appuie sur Entree pour quitter"
    exit 1
}

Write-Host "[INFO] PostgreSQL trouvé : $psql" -ForegroundColor Green

# Créer la base
Write-Host "[INFO] Création de la base 'restaurant_db'..." -ForegroundColor Yellow
$env:PGPASSWORD = "postgres"

& $psql -U postgres -c "CREATE DATABASE restaurant_db;" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Base 'restaurant_db' créée avec succès !" -ForegroundColor Green
} else {
    Write-Host "[INFO] La base existe déjà ou erreur de connexion." -ForegroundColor Yellow
    Write-Host "       Vérifie que PostgreSQL tourne et que le mot de passe 'postgres' est correct." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Tu peux maintenant lancer : start.bat" -ForegroundColor Cyan
Write-Host ""
Read-Host "Appuie sur Entree pour quitter"
