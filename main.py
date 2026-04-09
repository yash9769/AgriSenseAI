import sys
from pathlib import Path
import logging
from typing import Optional
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# 1. Setup Environment
base_path = Path(__file__).parent
sys.path.insert(0, str(base_path))
load_dotenv()

# 2. Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AgriSenseMaster")

# 3. Database Sync
try:
    from backend.database import engine, Base
    import backend.models.user
    import backend.models.crop_health_history
    import backend.models.soil_analysis_history
    import backend.models.market_price
    import backend.models.social
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database synced successfully.")
except Exception as e:
    logger.error(f"DB Error: {e}")

# 4. Import Services
from backend.services.chat_service import process_chat
from services.weather_service import WeatherService
from backend.routes import (
    auth, market_prices, crop_recommendation, 
    disease_detection, soil_analysis, analytics, social
)

# 5. Define Chat Request Structure (Exactly as sent by Dashboard/Assistant)
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = None
    image_base64: Optional[str] = None

app = FastAPI(title="AgriSense AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

weather_service = WeatherService()
api_router = APIRouter(prefix="/api")

# --- MASTER ENDPOINTS ---

@api_router.get("/weather/current")
async def get_weather_current(city: str = "Mumbai"):
    try:
        data = weather_service.get_weather(city=city)
        if "error" in data:
            return {"temperature": 25, "windspeed": 10, "condition_code": 1, "city": city}
        return data
    except:
        return {"temperature": 25, "windspeed": 10, "condition_code": 1, "city": city}

@api_router.post("/chat")
@api_router.post("/chat/")
async def chat_handler(request: ChatRequest):
    """Handles JSON chat requests from the frontend."""
    try:
        result = await process_chat(request.message, image_base64=request.image_base64)
        return {"response": result.get("explanation"), "data": result}
    except Exception as e:
        logger.error(f"Chat Error: {e}")
        return {"response": "I'm having trouble thinking right now. Please check your AI keys.", "data": {}}

# --- ASSEMBLE APP ---
app.include_router(api_router)
app.include_router(auth.router)
app.include_router(market_prices.router)
app.include_router(crop_recommendation.router)
app.include_router(disease_detection.router)
app.include_router(soil_analysis.router)
app.include_router(analytics.router)
app.include_router(social.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
