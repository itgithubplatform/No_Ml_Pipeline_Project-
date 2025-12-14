@echo off
echo ============================================
echo   Starting Backend (FastAPI)
echo ============================================
echo.

cd backend

REM Check if venv exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo Starting FastAPI server...
echo API will be available at: http://localhost:8000
echo API Docs: http://localhost:8000/api/v1/docs
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
