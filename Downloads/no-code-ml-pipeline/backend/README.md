# Backend - FastAPI ML Pipeline API

## 🚀 Quick Start

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at `http://localhost:8000`

### API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📁 Directory Structure

```
backend/
├── app/
│   ├── api/              # API routes
│   ├── core/             # Core configuration
│   ├── models/           # Pydantic models
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── main.py          # FastAPI app entry
├── uploads/             # Uploaded datasets
├── temp/                # Temporary files
├── tests/               # Unit tests
├── requirements.txt     # Python dependencies
└── Dockerfile          # Docker configuration
```

## 🔑 Environment Variables

Create a `.env` file:

```env
CORS_ORIGINS=http://localhost:3000
MAX_UPLOAD_SIZE=10485760
UPLOAD_DIR=uploads
```
