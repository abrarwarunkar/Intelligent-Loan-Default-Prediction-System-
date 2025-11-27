@echo off
echo Starting Intelligent Loan Default Prediction System...

echo Starting Machine Learning Engine...
start "ML Engine" cmd /k "cd ml_engine && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo Starting Backend (Spring Boot)...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Starting Frontend (React)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo All services started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8081
echo ML Engine: http://localhost:8000
