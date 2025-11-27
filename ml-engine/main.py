from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import shap

app = FastAPI(title="Loan Default Prediction API")

# Load model
model = None
try:
    model = joblib.load("model.pkl")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Model not found or error loading: {e}")

class LoanApplication(BaseModel):
    age: int
    income: float
    loan_amount: float
    credit_score: int
    months_employed: int
    num_credit_lines: int
    interest_rate: float
    loan_term: int
    dti_ratio: float

@app.get("/")
def read_root():
    return {"message": "Loan Default Prediction API is running"}

@app.post("/predict")
def predict(application: LoanApplication):
    global model
    if not model:
        try:
            model = joblib.load("model.pkl")
        except:
            raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")
    
    data = pd.DataFrame([application.dict()])
    
    # Predict probability
    try:
        prob = model.predict_proba(data)[0][1]
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

    risk_level = "High" if prob > 0.5 else "Low" # Simple threshold
    
    # SHAP Explanation
    explanation = {}
    try:
        # Access classifier and preprocessor
        classifier = model.named_steps['classifier']
        preprocessor = model.named_steps['preprocessor']
        
        # Transform data
        data_transformed = preprocessor.transform(data)
        
        # Explain
        # TreeExplainer works well for XGBoost/RandomForest
        explainer = shap.TreeExplainer(classifier)
        shap_values = explainer.shap_values(data_transformed)
        
        # Handle SHAP output format (can vary by model type)
        if isinstance(shap_values, list):
            # For binary classification, SHAP might return a list of arrays (one for each class)
            # We usually want the values for the positive class (index 1)
            sv = shap_values[1][0]
        else:
            sv = shap_values[0]

        # Map back to feature names
        feature_names = ['age', 'income', 'loan_amount', 'credit_score', 'months_employed', 'num_credit_lines', 'interest_rate', 'loan_term', 'dti_ratio']
        
        # Create a dictionary of feature importance for this prediction
        # We'll just take the absolute SHAP values to show magnitude of impact
        explanation = dict(zip(feature_names, sv.tolist()))
        
        # Sort by absolute impact
        explanation = dict(sorted(explanation.items(), key=lambda item: abs(item[1]), reverse=True))

    except Exception as e:
        print(f"SHAP Error: {e}")
        explanation = {"error": str(e)}

    return {
        "default_probability": float(prob),
        "risk_level": risk_level,
        "explanation": explanation
    }
