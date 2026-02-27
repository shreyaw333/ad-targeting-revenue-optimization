from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
import string
from datetime import datetime, timedelta

from app.database import get_db

router = APIRouter()

def generate_test_id():
    return "A" + ''.join(random.choices(string.digits, k=3))

def generate_mock_ab_tests():
    test_names = [
        'Collaborative Filtering vs Manual Targeting',
        'Dynamic vs Static Pricing',
        'Personalized vs Generic Ads',
        'Video vs Image Creatives',
        'Mobile vs Desktop Optimization',
        'Morning vs Evening Timing',
        'Lookalike vs Interest Targeting',
        'Single vs Multi-Product Ads'
    ]
    
    tests = []
    for i in range(3):
        control_conversions = random.randint(200, 800)
        variant_conversions = random.randint(250, 1000)
        
        tests.append({
            "id": generate_test_id(),
            "name": random.choice(test_names),
            "status": random.choice(['running', 'completed', 'paused', 'draft']),
            "confidence": random.randint(70, 99),
            "winner": random.choice(['Control', 'Variant']),
            "startDate": (datetime.utcnow() - timedelta(days=random.randint(1, 30))).isoformat(),
            "variants": [
                {
                    "name": "Control",
                    "traffic": 50,
                    "conversions": control_conversions,
                    "conversionRate": round(random.uniform(3, 6), 2)
                },
                {
                    "name": "Variant",
                    "traffic": 50,
                    "conversions": variant_conversions,
                    "conversionRate": round(random.uniform(4, 8), 2)
                }
            ]
        })
    
    return tests

@router.get("/ab-tests")
def get_ab_tests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return generate_mock_ab_tests()

@router.get("/ab-tests/{test_id}")
def get_ab_test(test_id: str, db: Session = Depends(get_db)):
    tests = generate_mock_ab_tests()
    for test in tests:
        if test['id'] == test_id:
            return test
    raise HTTPException(status_code=404, detail="A/B test not found")

@router.post("/ab-tests")
def create_ab_test(test: dict, db: Session = Depends(get_db)):
    return {
        "id": generate_test_id(),
        **test,
        "status": "draft",
        "confidence": 0
    }

@router.put("/ab-tests/{test_id}")
def update_ab_test(test_id: str, test_update: dict, db: Session = Depends(get_db)):
    return {"id": test_id, **test_update}

@router.delete("/ab-tests/{test_id}")
def delete_ab_test(test_id: str, db: Session = Depends(get_db)):
    return {"message": "A/B test deleted successfully"}

@router.post("/ab-tests/{test_id}/start")
def start_ab_test(test_id: str, db: Session = Depends(get_db)):
    return {
        "id": test_id,
        "status": "running",
        "startDate": datetime.utcnow().isoformat()
    }

@router.post("/ab-tests/{test_id}/stop")
def stop_ab_test(test_id: str, db: Session = Depends(get_db)):
    return {
        "id": test_id,
        "status": "completed",
        "endDate": datetime.utcnow().isoformat()
    }

@router.get("/ab-tests/{test_id}/results")
def get_ab_test_results(test_id: str, db: Session = Depends(get_db)):
    tests = generate_mock_ab_tests()
    for test in tests:
        if test['id'] == test_id:
            return {
                "test_id": test['id'],
                "name": test['name'],
                "status": test['status'],
                "confidence": test['confidence'],
                "winner": test['winner'],
                "variants": test['variants']
            }
    raise HTTPException(status_code=404, detail="A/B test not found")