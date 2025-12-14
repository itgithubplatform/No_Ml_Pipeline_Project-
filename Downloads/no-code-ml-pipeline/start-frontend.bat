@echo off
echo ============================================
echo   Starting Frontend (Next.js)
echo ============================================
echo.

cd frontend

echo Installing dependencies (if needed)...
if not exist "node_modules\" (
    npm install
)

echo.
echo Starting Next.js development server...
echo Frontend will be available at: http://localhost:3000
echo.

npm run dev
