import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        self.geocoding_url = "https://geocoding-api.open-meteo.com/v1/search"
        self.weather_url = "https://api.open-meteo.com/v1/forecast"

    def get_coordinates(self, city: str):
        try:
            params = {"name": city, "count": 1, "language": "en", "format": "json"}
            response = requests.get(self.geocoding_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "results" in data and len(data["results"]) > 0:
                result = data["results"][0]
                return result["latitude"], result["longitude"], result["name"]
            return None, None, None
        except Exception as e:
            logger.error(f"Geocoding error for {city}: {e}")
            return None, None, None

    def get_weather(self, latitude: float = None, longitude: float = None, city: str = None):
        target_city = city or "Mumbai"
        try:
            if latitude is None or longitude is None:
                lat, lon, city_name = self.get_coordinates(target_city)
                if lat is None:
                    # Final safety fallback to Mumbai coordinates
                    latitude, longitude, target_city = 19.0760, 72.8777, "Mumbai"
                else:
                    latitude, longitude, target_city = lat, lon, city_name

            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
                "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "uv_index_max", "precipitation_sum"],
                "timezone": "auto"
            }
            
            response = requests.get(self.weather_url, params=params, timeout=10)
            response.raise_for_status()
            weather_response = response.json()
            
            current = weather_response.get("current", {})
            return {
                "temperature": current.get("temperature_2m", 25),
                "windspeed": current.get("wind_speed_10m", 10),
                "humidity": current.get("relative_humidity_2m", 60),
                "condition_code": current.get("weather_code", 1),
                "city": target_city,
                "weather": weather_response,
                "success": True
            }
        except Exception as e:
            logger.error(f"Weather fetch error: {e}")
            # Robust fallback to avoid 500
            return {
                "success": False,
                "error": str(e),
                "temperature": 25,
                "windspeed": 10,
                "humidity": 60,
                "condition_code": 1,
                "city": target_city,
                "weather": {
                    "current": {"temperature_2m": 25, "relative_humidity_2m": 60, "wind_speed_10m": 10, "weather_code": 1},
                    "daily": {"time": [], "temperature_2m_max": [], "weather_code": []}
                }
            }
