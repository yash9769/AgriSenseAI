import requests
import os
import logging

logger = logging.getLogger(__name__)

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

def get_coordinates(city: str):
    r = requests.get(GEOCODE_URL, params={"name": city, "count": 1, "language": "en"}, timeout=10)
    data = r.json()
    if not data.get("results"):
        return None, None
    res = data["results"][0]
    return res["latitude"], res["longitude"]

def fetch_weather(city: str = None, lat: float = None, lon: float = None) -> dict:
    if not lat or not lon:
        if city:
            lat, lon = get_coordinates(city)
        else:
            lat, lon = 19.0760, 72.8777 # Mumbai default
            
    if lat is None or lon is None:
        return {"error": "Location not found"}
        
    # Check if we should use Supabase Edge Function for weather (to keep it centralized)
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if supabase_url and supabase_key:
        try:
            url = f"{supabase_url}/functions/v1/weather"
            headers = {"Authorization": f"Bearer {supabase_key}", "Content-Type": "application/json"}
            payload = {"lat": lat, "lon": lon}
            r = requests.post(url, headers=headers, json=payload, timeout=15)
            if r.status_code == 200:
                return r.json()
        except Exception as e:
            logger.error(f"Supabase weather fallback error: {e}")

    # Local fallback to Open Meteo if Supabase fails
    params = {
        "latitude": lat, "longitude": lon,
        "current": ["temperature_2m","relative_humidity_2m","wind_speed_10m","weather_code"],
        "daily": ["temperature_2m_max","temperature_2m_min","precipitation_sum"],
        "timezone": "auto", "forecast_days": 7
    }
    try:
        r = requests.get(WEATHER_URL, params=params, timeout=10)
        return r.json()
    except Exception as e:
        return {"error": str(e), "current": {"temperature_2m": 25}, "daily": {"time": []}}
