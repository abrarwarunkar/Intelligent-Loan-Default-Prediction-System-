import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
import xgboost as xgb
import joblib
import os

def train():
    # Load data
    if not os.path.exists("loan_data.csv"):
        print("loan_data.csv not found. Please run generate_data.py first.")
        return

    df = pd.read_csv("loan_data.csv")
    
    X = df.drop('default', axis=1)
    y = df['default']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Preprocessing
    numeric_features = ['age', 'income', 'loan_amount', 'credit_score', 'months_employed', 'num_credit_lines', 'interest_rate', 'loan_term', 'dti_ratio']
    categorical_features = [] # None in our synthetic data, but good to have the structure
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    # Model Pipeline (Random Forest)
    rf_pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                  ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))])
    
    # Train Random Forest
    print("Training Random Forest...")
    rf_pipeline.fit(X_train, y_train)
    y_pred_rf = rf_pipeline.predict(X_test)
    print("Random Forest Accuracy:", accuracy_score(y_test, y_pred_rf))
    print("Random Forest ROC-AUC:", roc_auc_score(y_test, rf_pipeline.predict_proba(X_test)[:, 1]))
    
    # Model Pipeline (XGBoost)
    xgb_pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                   ('classifier', xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42))])
    
    # Train XGBoost
    print("\nTraining XGBoost...")
    xgb_pipeline.fit(X_train, y_train)
    y_pred_xgb = xgb_pipeline.predict(X_test)
    print("XGBoost Accuracy:", accuracy_score(y_test, y_pred_xgb))
    print("XGBoost ROC-AUC:", roc_auc_score(y_test, xgb_pipeline.predict_proba(X_test)[:, 1]))
    
    # Save the best model (let's say XGBoost for now)
    joblib.dump(xgb_pipeline, "model.pkl")
    print("\nModel saved to model.pkl")

if __name__ == "__main__":
    train()
