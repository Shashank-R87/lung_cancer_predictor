from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
import uvicorn
import os

from tensorflow.keras.models import load_model

print(os.listdir())
data_original = pd.read_csv("processed_lung_cancer_data.csv")
model = load_model("lung_cancer_predictor.h5")
data = data_original.drop(["case_id", "lung_cancer"], axis=1)
test_sample = []

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8081",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_distance(case):
    genes = test_sample.keys()
    return np.sqrt(np.sum((case[genes] - pd.Series(test_sample)) ** 2))

def matching():
    data['Distance'] = data.apply(calculate_distance, axis=1)
    closest_case_index = data['Distance'].idxmin()
    return (data_original.iloc[closest_case_index]).case_id

@app.get("/")
def default():
    return {"message": "Welcome to Lung Cancer Predictor API"}

@app.post("/get_prediction")
async def get_prediction(request: Request):
    global test_sample
    test_sample = await request.json()
    # data = np.array([[2.39650e+01, 3.00449e+01, 2.10000e-02, 1.36955e+01, 7.83391e+01, 1.37000e+00, 8.43680e+00, 6.63840e+00, 5.76600e-01, 5.81037e+01, 3.77890e+00]])
    data = np.array([list(test_sample.values())])
    print("\nMaking prediction...")
    prediction = model.predict(data)
    prediction_score = float(prediction[0][0])
    if (round(prediction_score*100, 2)>50):
        print("\nFinding match...")
        matching_caseid = matching()
        print("\nMatch found!\n")
        return {"prediction": round(prediction_score*100, 2), "caseid": matching_caseid}
    return {"prediction": round(prediction_score*100, 2), "caseid": "No case match needed"}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)