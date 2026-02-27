from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import dashboard, campaigns, ab_tests, models

app = FastAPI(title="Ad Targeting API", version="1.0.0")

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])
app.include_router(campaigns.router, prefix="/api", tags=["campaigns"])
app.include_router(ab_tests.router, prefix="/api", tags=["ab_tests"])
app.include_router(models.router, prefix="/api", tags=["models"])

@app.get("/")
async def root():
    return {
        "message": "Ad Targeting Revenue Optimization API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "port": 8001}

if __name__ == "__main__":
    import uvicorn
    print("Starting backend on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)