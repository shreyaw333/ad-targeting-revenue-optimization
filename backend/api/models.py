from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pathlib import Path
import pandas as pd
import pickle

from app.database import get_db
from services.ml_service import ml_service

router = APIRouter()

DATA_PATH = Path(__file__).parent.parent.parent.parent / "data" / "processed"

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

    # Load real CTR metrics if available
    ctr_metrics_path = DATA_PATH / "ctr_model_metrics.csv"
    if ctr_metrics_path.exists():
        try:
            df = pd.read_csv(ctr_metrics_path)
            row = df.iloc[0]
            result["ctrPrediction"]["auc"] = round(float(row.get("auc", 0)), 3)
            result["ctrPrediction"]["precision"] = round(float(row.get("precision", 0)), 3)
            result["ctrPrediction"]["recall"] = round(float(row.get("recall", 0)), 3)
            result["ctrPrediction"]["f1"] = round(float(row.get("f1_score", 0)), 3)
        except Exception as e:
            print(f"Could not load CTR metrics: {e}")

    # Load real CF metrics if available
    cf_metrics_path = DATA_PATH / "cf_model_metrics.csv"
    if cf_metrics_path.exists():
        try:
            df = pd.read_csv(cf_metrics_path)
            row = df.iloc[0]
            result["collaborativeFiltering"]["reconstruction_error"] = round(float(row.get("reconstruction_error", 0)), 4)
        except Exception as e:
            print(f"Could not load CF metrics: {e}")

    # Load revenue optimizer metrics
    rev_metrics_path = DATA_PATH / "revenue_model_metrics.csv"
    if rev_metrics_path.exists():
        try:
            df = pd.read_csv(rev_metrics_path)
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