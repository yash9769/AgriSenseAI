from fastapi import APIRouter, Query
from services.weather_service import fetch_weather
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/weather", tags=["weather"])

@router.get("/current")
def current_weather(
    latitude: float = Query(None), 
    longitude: float = Query(None),
    city: str = Query(None)
):
    try:
        data = fetch_weather(city=city, lat=latitude, lon=longitude)
        return data
    except Exception as e:
        logger.error(f"Weather route error: {e}")
        return {
            "error": str(e),
            "current": {"temperature_2m": 25},
            "daily": {"time": []}
        }
