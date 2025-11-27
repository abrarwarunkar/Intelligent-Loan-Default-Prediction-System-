import requests
import json

url = "http://127.0.0.1:8000/predict"

payload = {
  "age": 30,
  "income": 50000,
  "loan_amount": 20000,
  "credit_score": 600,
  "months_employed": 24,
  "num_credit_lines": 5,
  "interest_rate": 10.5,
  "loan_term": 36,
  "dti_ratio": 0.4
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Error:", e)
