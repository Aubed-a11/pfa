@echo off
chcp 65001 >nul
setlocal

echo.
echo  ============================================
echo   RestaurantPFA - Lancement Windows
echo  ============================================
echo.

:: ── Vérification Java ─────────────────────────────────────
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Java non trouvé.
    echo Installe JDK 21 depuis : https://adoptium.net/
    pause
    exit /b 1
)

:: ── Vérification Maven ────────────────────────────────────
mvn -version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Maven non trouvé.
    echo Installe Maven depuis : https://maven.apache.org/download.cgi
    echo Ou utilise : winget install Apache.Maven
    pause
    exit /b 1
)

:: ── Vérification Node ─────────────────────────────────────
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js non trouvé.
    echo Installe Node 20 depuis : https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Java, Maven et Node detectes.
echo.

:: ── Démarrage Backend ─────────────────────────────────────
echo [INFO] Demarrage du backend Spring Boot...
echo [INFO] Assure-toi que PostgreSQL tourne sur le port 5432
echo [INFO] et que la base 'restaurant_db' existe.
echo.

start "Backend Spring Boot" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

echo [INFO] Backend en cours de demarrage (attente 20 secondes)...
timeout /t 20 /nobreak >nul

:: ── Installation dépendances frontend ─────────────────────
echo [INFO] Installation des dependances frontend...
cd /d "%~dp0frontend"
call npm install

:: ── Démarrage Frontend ────────────────────────────────────
echo [INFO] Demarrage du frontend Next.js...
start "Frontend Next.js" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 5 /nobreak >nul

:: ── Résumé ────────────────────────────────────────────────
echo.
echo  ============================================
echo   Application demarree !
echo  ============================================
echo.
echo   Frontend  -^>  http://localhost:3000
echo   Backend   -^>  http://localhost:8080/api
echo   Swagger   -^>  http://localhost:8080/api/swagger-ui.html
echo.
echo   Comptes de demo :
echo   Admin   : admin@restaurant.ma / admin123
echo   Cuisine : chef@restaurant.ma  / chef123
echo   Client  : client@restaurant.ma / client123
echo.

:: Ouvrir le navigateur
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo   Deux fenetres de terminal ont ete ouvertes.
echo   Ferme-les pour arreter l'application.
echo.
pause
