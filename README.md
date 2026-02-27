# ML Ad Targeting & Revenue Optimization Engine

An end-to-end ML system that analyzes user behavior and ad interactions to optimize ad targeting, predict click-through rates, and maximize campaign revenue using real-time machine learning models.

## Live Demo

**Frontend:** [ad-targeting-revenue-optimization.vercel.app](https://ad-targeting-revenue-optimization.vercel.app)

---

## Results

| Metric | Value |
|--------|-------|
| Total Campaign Revenue | $4,533,134 |
| Total Ad Impressions | 27.8M |
| Average CTR | 3.08% |
| Average ROAS | 3.75x |
| Avg Conversion Rate | 6.44% |
| Users Modeled | 10,000 |
| Events Processed | 100,000 |

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Data Layer    │────▶│   ML Models      │────▶│   FastAPI       │
│                 │     │                  │     │   Backend       │
│ - User Events   │     │ - CTR Prediction │     │                 │
│ - Ad Features   │     │ - Collab Filter  │     │ /api/dashboard  │
│ - Campaigns     │     │ - Revenue Optim  │     │ /api/campaigns  │
│ - User Profiles │     │                  │     │ /api/models     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                           │
                                                  ┌────────▼────────┐
                                                  │  React Frontend │
                                                  │                 │
                                                  │ - Dashboard     │
                                                  │ - Campaigns     │
                                                  │ - A/B Testing   │
                                                  │ - ML Models     │
                                                  └─────────────────┘
```

---

## ML Models

### 1. CTR Prediction (Gradient Boosting)
Predicts click-through probability for user-ad pairs using engineered features.

**Features used:**
- Device type, browser, location
- User demographics (age group, gender, income level)
- User interests (tech, fashion, sports, gaming, travel, food, music)
- Ad category, type, target audience
- Temporal features (hour, day of week, weekend flag)
- Engagement score, bid price, quality score

**Performance:**
- Evaluated on AUC-ROC, Precision, Recall, F1
- Trained on 100K+ user interaction events

### 2. Collaborative Filtering (NMF Matrix Factorization)
Recommends ads to users based on historical interaction patterns.

- Non-negative Matrix Factorization with 50 latent components
- Cosine similarity for user-user recommendations
- Produces user and item factor matrices for real-time inference

### 3. Revenue Optimization (Thompson Sampling Bandit)
Multi-armed bandit algorithm for dynamic budget allocation across campaigns.

- Bayesian exploration-exploitation tradeoff
- Per-campaign Beta distribution tracking (alpha/beta parameters)
- Optimal budget allocation based on estimated CTR per campaign
- Simulates campaign outcomes with realistic conversion modeling

---

## Dataset

Synthetic dataset simulating a real ad platform with realistic distributions:

| Dataset | Records | Description |
|---------|---------|-------------|
| User Events | 100,000 | Impressions (85%), clicks (13%), conversions (2%) |
| User Profiles | 10,000 | Demographics, interests, engagement scores |
| Ad Inventory | 500 | Categories, types, bid prices, quality scores |
| Campaigns | 50 | Budgets, spend, impressions, clicks, revenue |

**User demographics:**
- Age: 25-34 (35%), 35-44 (25%), 45-54 (15%), 18-24 (15%), 55+ (10%)
- Devices: Mobile (60%), Desktop (35%), Tablet (5%)
- Locations: US (40%), UK (15%), CA (10%), AU (8%), others

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| ML Models | Python, scikit-learn, NumPy, pandas |
| Backend | FastAPI, SQLAlchemy, SQLite, Uvicorn |
| Frontend | React, Next.js, Recharts, Tailwind CSS |
| Auth | JWT, bcrypt, OAuth2 |
| Infrastructure | Docker, Vercel |

---

## Project Structure

```
ad-targeting-revenue-optimization/
├── ml_models/
│   ├── ctr_prediction/
│   │   ├── model.py          # GradientBoostingClassifier
│   │   ├── train.py          # Training pipeline
│   │   └── evaluate.py       # AUC, precision, recall, F1
│   ├── collaborative_filtering/
│   │   ├── model.py          # NMF matrix factorization
│   │   ├── train.py          # Builds user-ad interaction matrix
│   │   └── evaluate.py       # Reconstruction error, similarity
│   ├── revenue_optimization/
│   │   ├── model.py          # Thompson Sampling bandit
│   │   ├── train.py          # Campaign simulation & optimization
│   │   └── evaluate.py       # ROI, revenue, allocation metrics
│   └── data_processing/
│       ├── feature_engineering.py
│       └── preprocessor.py
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── api/
│   │   ├── dashboard.py      # KPIs, revenue trends, audience data
│   │   ├── campaigns.py      # Campaign CRUD from real CSV data
│   │   ├── ab_tests.py       # A/B test management
│   │   └── models.py         # ML model status & metrics
│   ├── services/
│   │   └── ml_service.py     # Model loading & inference
│   └── requirements.txt
├── frontend/                 # React/Next.js dashboard
├── data/
│   ├── raw/                  # Generated CSV datasets
│   └── generate_sample_data.py
└── docker/
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Generate Data

```bash
cd data
python generate_sample_data.py
```

### 2. Train ML Models

```bash
cd ml_models

# Train CTR prediction model
python ctr_prediction/train.py

# Train collaborative filtering
python collaborative_filtering/train.py

# Train revenue optimizer
python revenue_optimization/train.py
```

### 3. Start Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

API docs available at: `http://localhost:8001/docs`

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/dashboard/overview` | KPIs, revenue trends, audience segmentation |
| `GET /api/campaigns` | All campaigns with real performance metrics |
| `GET /api/campaigns/{id}` | Single campaign detail |
| `GET /api/models` | ML model status and metrics |
| `GET /api/ab-tests` | A/B test results |
| `POST /api/models/{name}/train` | Trigger model retraining |

---

## Dashboard Features

- **Overview** — Total revenue, CTR, impressions, active users from real data
- **Revenue Trends** — Monthly revenue chart derived from event timestamps
- **Audience Segmentation** — User interest clustering pie chart
- **Campaign Management** — All 50 campaigns with live status, CTR, ROAS
- **ML Model Monitor** — Model status, AUC scores, feature importance
- **A/B Testing** — Experiment management with statistical confidence

