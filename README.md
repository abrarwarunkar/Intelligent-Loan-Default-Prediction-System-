# Intelligent Loan Default Prediction System

A comprehensive system to predict loan defaults using Machine Learning, with a Spring Boot backend and React frontend.

## Features
- **User Dashboard**: Apply for loans, view application status.
- **Admin Dashboard**: View analytics (Risk Distribution, Monthly Trends), approve/reject applications.
- **ML Engine**: Predicts default risk using Random Forest/XGBoost and provides SHAP explanations.
- **Risk Assessment**: Real-time risk scoring and factor analysis.

## Prerequisites
- **Java 17+** & Maven
- **Node.js 16+** & npm
- **Python 3.8+**
- **PostgreSQL** (Running on localhost:5432)

## Quick Start (Windows)
1. **Database Setup**:
   - Create a PostgreSQL database named `loan_db`.
   - Update credentials in `backend/src/main/resources/application.properties` if needed.

2. **Run the Application**:
   - Double-click `run_app.bat`.
   - This will open 3 terminal windows for ML Engine, Backend, and Frontend.

3. **Access the App**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8081](http://localhost:8081)
   - ML Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Manual Setup

### 1. Machine Learning Engine
```bash
cd ml_engine
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Usage
1. **Register** a new user account.
2. **Login** to access the dashboard.
3. **Apply for a Loan** by filling out the form.
4. **View Application** details and risk assessment.
5. **Login as Admin** (Role needs to be set in DB manually for now, or register a user with username 'admin' if logic permits) to view analytics and manage applications.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Chart.js
- **Backend**: Java Spring Boot, Spring Security, JPA/Hibernate
- **ML**: Python, FastAPI, Scikit-learn, SHAP
- **Database**: PostgreSQL
