import pandas as pd
import numpy as np
import random

def generate_loan_data(num_samples=1000):
    np.random.seed(42)
    
    data = {
        'age': np.random.randint(21, 70, num_samples),
        'income': np.random.randint(20000, 150000, num_samples),
        'loan_amount': np.random.randint(5000, 50000, num_samples),
        'credit_score': np.random.randint(300, 850, num_samples),
        'months_employed': np.random.randint(0, 120, num_samples),
        'num_credit_lines': np.random.randint(0, 15, num_samples),
        'interest_rate': np.random.uniform(2.5, 25.0, num_samples),
        'loan_term': np.random.choice([12, 24, 36, 48, 60], num_samples),
        'dti_ratio': np.random.uniform(0.1, 0.6, num_samples), # Debt-to-Income
    }
    
    df = pd.DataFrame(data)
    
    # Simulate default (target variable) based on some logic + noise
    # Higher risk: Low credit score, high DTI, low income, high loan amount
    
    risk_score = (
        (850 - df['credit_score']) / 850 * 0.4 + 
        df['dti_ratio'] * 0.3 + 
        (df['loan_amount'] / df['income']) * 0.2 +
        (1 / (df['months_employed'] + 1)) * 0.1
    )
    
    # Add noise
    risk_score += np.random.normal(0, 0.05, num_samples)
    
    # Threshold for default (1 = Default, 0 = No Default)
    # Adjust threshold to get a balanced dataset or realistic imbalance
    threshold = np.percentile(risk_score, 80) # Top 20% risky
    df['default'] = (risk_score > threshold).astype(int)
    
    return df

if __name__ == "__main__":
    df = generate_loan_data(2000)
    df.to_csv("loan_data.csv", index=False)
    print("Generated loan_data.csv with 2000 samples.")
