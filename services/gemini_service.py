import google.generativeai as genai
import os
import json
import logging
import io
import re
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # FORCE STABLE MODEL PATH
            self.model_name = 'models/gemini-flash-latest' 
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None

    def _call_sync(self, prompt: str) -> str:
        if not self.model: return "AI not configured."
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Service Error: {str(e)}"

    async def analyze_image(self, image_data: bytes) -> dict:
        """Vision analysis using STABLE Gemini 1.5 Flash."""
        if not self.model:
            return {"error": "GEMINI_API_KEY not configured"}

        prompt = """
        ACT AS A PLANT PATHOLOGIST. NO CHAT. JSON ONLY.
        {
          "crop": "Corn",
          "disease": "Rust",
          "pathogen": "Fungal",
          "risk_level": "High",
          "confidence": 95,
          "treatment": ["step"],
          "prevention": ["step"],
          "explanation": "Brief reasoning"
        }
        """
        try:
            image = Image.open(io.BytesIO(image_data))
            # Maximum Compression for Quota Safety
            image.thumbnail((640, 640))
            
            response = self.model.generate_content([prompt, image])
            text = response.text
            match = re.search(r'\{.*\}', text, re.DOTALL)
            clean_json = match.group(0) if match else text
            return json.loads(clean_json)
        except Exception as e:
            logger.error(f"STABLE-SCAN-ERROR: {e}")
            return {
                "error": "Scan limit hit or connection issue. Please retry in 30 seconds.",
                "crop": "Plant", "disease": "Healthy/Checking", "confidence": 0,
                "treatment": ["Please wait for API quota reset"],
                "explanation": "Your Google Free Tier quota is resetting."
            }

# --- GLOBAL WRAPPERS ---
def generate_crop_advisory(crops, weather, market, alerts):
    s = GeminiService()
    return s._call_sync(f"Advise on {crops} with {weather} and {market}.")

def explain_soil(nutrients, score, recommendations):
    s = GeminiService()
    return s._call_sync(f"Explain soil {nutrients} with score {score}.")

def explain_disease(disease_name, crop, confidence):
    s = GeminiService()
    return s._call_sync(f"Explain {disease_name} on {crop}.")
