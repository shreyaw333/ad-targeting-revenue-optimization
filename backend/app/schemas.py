from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from models.models import CampaignStatus, ABTestStatus

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    budget: float = Field(gt=0)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    target_audience: Optional[Dict[str, Any]] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[CampaignStatus] = None
    budget: Optional[float] = Field(default=None, gt=0)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    target_audience: Optional[Dict[str, Any]] = None

class Campaign(CampaignBase):
    id: int
    status: CampaignStatus
    spent: float
    impressions: int
    clicks: int
    conversions: int
    ctr: float
    conversion_rate: float
    created_at: datetime
    updated_at: datetime
    user_id: int
    
    class Config:
        from_attributes = True

class ABTestVariant(BaseModel):
    name: str
    traffic: int
    conversions: int
    conversion_rate: float

class ABTestBase(BaseModel):
    name: str
    description: Optional[str] = None
    variants: Optional[List[ABTestVariant]] = None

class ABTestCreate(ABTestBase):
    pass

class ABTestUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ABTestStatus] = None
    confidence: Optional[float] = None
    winner: Optional[str] = None
    variants: Optional[List[ABTestVariant]] = None

class ABTest(ABTestBase):
    id: str
    status: ABTestStatus
    confidence: float
    winner: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    user_id: int
    
    class Config:
        from_attributes = True

class ModelMetricsBase(BaseModel):
    model_name: str
    model_version: Optional[str] = None
    status: str = "active"
    accuracy: Optional[float] = None
    auc: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    last_trained: Optional[datetime] = None
    training_time: Optional[str] = None
    features_count: Optional[int] = None
    metrics_data: Optional[Dict[str, Any]] = None

class ModelMetricsCreate(ModelMetricsBase):
    pass

class ModelMetrics(ModelMetricsBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DashboardOverview(BaseModel):
    kpis: Dict[str, Any]
    revenue_data: List[Dict[str, Any]]
    audience_data: List[Dict[str, Any]]
    performance_data: List[Dict[str, Any]]