import sys
from pathlib import Path

# Add the project root and current directory to path to handle all import styles
base_path = Path(__file__).parent
sys.path.insert(0, str(base_path.parent)) # Root
sys.path.insert(0, str(base_path))        # current (backend/)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth, weather, market_prices, crop_recommendation, disease_detection, soil_analysis, chat, analytics
from backend.database import engine, Base
import backend.models.user
import backend.models.soil_analysis_history
import backend.models.crop_health_history

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Crop Advisory API", version="1.0.0")
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router)
app.include_router(weather.router)
app.include_router(market_prices.router)
app.include_router(crop_recommendation.router)
app.include_router(disease_detection.router)
app.include_router(soil_analysis.router)
app.include_router(chat.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"message": "🌾 Smart Crop Advisory API is running with Chatbot!", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
