from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
from pathlib import Path
import random
from datetime import datetime, timedelta

from app.database import get_db

router = APIRouter()

DATA_PATH = Path(__file__).parent.parent.parent.parent / "data" / "raw"

def load_campaigns():
    df = pd.read_csv(DATA_PATH / "campaign_performance.csv")
    campaigns = []
    for _, row in df.iterrows():
        budget = float(row["budget"])
        spent = float(row["spent"])
        impressions = int(row["impressions"])
        clicks = int(row["clicks"])
        conversions = int(row["conversions"])
        revenue = float(row["revenue"])

        if spent > budget * 0.8:
            status = "completed"
        elif spent > budget * 0.3:
            status = "active"
        else:
            status = "paused"

        campaigns.append({
            "id": int(row["campaign_id"]),
            "name": str(row["campaign_name"]),
            "status": status,
            "budget": budget,
            "spent": spent,
            "impressions": impressions,
            "clicks": clicks,
            "conversions": conversions,
            "revenue": revenue,
            "ctr": round(float(row["ctr"]), 3),
            "conversionRate": round(float(row["conversion_rate"]), 3),
            "roas": round(float(row["roas"]), 2),
            "startDate": str(row["start_date"]),
        })
    return campaigns

@router.get("/campaigns")
def get_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return load_campaigns()[skip:skip+limit]

@router.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    for c in load_campaigns():
        if c["id"] == campaign_id:
            return c
    raise HTTPException(status_code=404, detail="Campaign not found")

@router.post("/campaigns")
def create_campaign(campaign: dict, db: Session = Depends(get_db)):
    return {
        "id": random.randint(100, 999),
        **campaign,
        "status": "active",
        "spent": 0,
        "impressions": 0,
        "clicks": 0,
        "conversions": 0
    }

@router.put("/campaigns/{campaign_id}")
def update_campaign(campaign_id: int, campaign_update: dict, db: Session = Depends(get_db)):
    return {"id": campaign_id, **campaign_update}

@router.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    return {"message": "Campaign deleted successfully"}

@router.post("/campaigns/{campaign_id}/pause")
def pause_campaign(campaign_id: int, db: Session = Depends(get_db)):
    return {"id": campaign_id, "status": "paused"}

@router.post("/campaigns/{campaign_id}/resume")
def resume_campaign(campaign_id: int, db: Session = Depends(get_db)):
    return {"id": campaign_id, "status": "active"}