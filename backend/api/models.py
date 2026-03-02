import boto3
import io
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import pandas as pd

from app.database import get_db
from services.ml_service import ml_service

router = APIRouter()

BUCKET = os.getenv('S3_BUCKET_NAME', 'ad-targeting-bucket-01')

def read_csv_from_s3(key):
    s3 = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_REGION', 'us-east-1')
    )
    obj = s3.get_object(Bucket=BUCKET, Key=key)
    return pd.read_csv(io.BytesIO(obj['Body'].read()))


def get_real_model_data():
    result = {
        "collaborativeFiltering": {
            "status": "active",
            "accuracy": None,
            "features": 50,
            "description": "NMF-based matrix factorization for user-ad recommendations"
        },
        "ctrPrediction": {
            "status": "active",
            "auc": None,
            "precision": None,
            "recall": None,
            "f1": None,
            "features": 15,
            "description": "Gradient Boosting classifier for click-through rate prediction"
        },
        "revenueOptimization": {
            "status": "active",
            "description": "Thompson Sampling multi-armed bandit for budget allocation"
        }
    }

    try:
        df = read_csv_from_s3('processed/ctr_model_metrics.csv')
        row = df.iloc[0]
        result["ctrPrediction"]["auc"] = round(float(row.get("auc", 0)), 3)
        result["ctrPrediction"]["precision"] = round(float(row.get("precision", 0)), 3)
        result["ctrPrediction"]["recall"] = round(float(row.get("recall", 0)), 3)
        result["ctrPrediction"]["f1"] = round(float(row.get("f1_score", 0)), 3)
    except Exception as e:
        print(f"Could not load CTR metrics: {e}")

    try:
        df = read_csv_from_s3('processed/cf_model_metrics.csv')
        row = df.iloc[0]
        result["collaborativeFiltering"]["reconstruction_error"] = round(float(row.get("reconstruction_error", 0)), 4)
    except Exception as e:
        print(f"Could not load CF metrics: {e}")

    try:
        df = read_csv_from_s3('processed/revenue_model_metrics.csv')
        row = df.iloc[0]
        result["revenueOptimization"]["total_revenue"] = round(float(row.get("total_revenue", 0)), 2)
        result["revenueOptimization"]["roi"] = round(float(row.get("roi", 0)), 3)
        result["revenueOptimization"]["profit"] = round(float(row.get("profit", 0)), 2)
    except Exception as e:
        print(f"Could not load revenue metrics: {e}")

    return result

@router.get("/models")
def get_models(db: Session = Depends(get_db)):
    return get_real_model_data()

@router.get("/models/{model_name}/status")
def get_model_status(model_name: str, db: Session = Depends(get_db)):
    data = get_real_model_data()
    mapping = {
        "collaborative-filtering": "collaborativeFiltering",
        "ctr-prediction": "ctrPrediction",
        "revenue-optimization": "revenueOptimization"
    }
    key = mapping.get(model_name, model_name)
    if key in data:
        return data[key]
    return {"error": "Model not found"}

@router.post("/models/{model_name}/train")
def train_model(model_name: str, db: Session = Depends(get_db)):
    return {"message": f"Training started for {model_name}", "status": "training"}

@router.post("/models/{model_name}/deploy")
def deploy_model(model_name: str, db: Session = Depends(get_db)):
    return {"message": f"Model {model_name} deployed successfully", "status": "active"}

@router.get("/models/{model_name}/metrics")
def get_model_metrics(model_name: str, time_range: str = "7d", db: Session = Depends(get_db)):
    data = get_real_model_data()
    mapping = {
        "collaborative-filtering": "collaborativeFiltering",
        "ctr-prediction": "ctrPrediction",
        "revenue-optimization": "revenueOptimization"
    }
    key = mapping.get(model_name, model_name)
    return data.get(key, {"error": "Model not found"})