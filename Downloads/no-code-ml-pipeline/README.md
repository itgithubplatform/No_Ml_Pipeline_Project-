# 🚀 No-Code ML Pipeline Builder

A professional web-based platform that allows users to create and run Machine Learning workflows without writing code.

## 📋 Features

- **Dataset Upload**: CSV/Excel file support with instant preview
- **Visual Pipeline Builder**: Drag-and-drop interface like Orange Data Mining
- **Data Preprocessing**: StandardScaler, MinMaxScaler, and more
- **Train-Test Split**: Customizable split ratios
- **Model Selection**: Logistic Regression, Decision Tree Classifier
- **Results Dashboard**: Accuracy metrics, confusion matrix, visualizations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **React Flow** (Visual pipeline builder)
- **ShadCN UI** (Component library)
- **Recharts** (Data visualization)

### Backend
- **FastAPI** (Python 3.11+)
- **Scikit-learn** (ML models)
- **Pandas** (Data processing)
- **NumPy** (Numerical operations)
- **Uvicorn** (ASGI server)

## 📁 Project Structure

```
no-code-ml-pipeline/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── docker-compose.yml # Container orchestration
└── README.md         # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- Docker (optional)

### Installation

See individual README files:
- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)

## 📝 License

MIT License
