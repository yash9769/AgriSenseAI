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
        try:
            target_city = city or "Mumbai"
            if latitude is None or longitude is None:
                lat, lon, city_name = self.get_coordinates(target_city)
                if lat is None:
                    # Final safety fallback to Mumbai coordinates
                    lat, lon, target_city = 19.0760, 72.8777, "Mumbai"
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
                "temperature": current.get("temperature_2m"),
                "windspeed": current.get("wind_speed_10m"),
                "humidity": current.get("relative_humidity_2m"),
                "condition_code": current.get("weather_code"),
                "city": target_city,
                "weather": weather_response # Full object for frontend charts/forecasts
            }
        except Exception as e:
            logger.error(f"Weather fetch error: {e}")
            return {"error": str(e), "temperature": 0, "city": city}
