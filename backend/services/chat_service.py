import os
import json
from typing import Dict, Any, Optional
import base64
from PIL import Image
import io
from services.groq_service import GroqService
from services.together_service import TogetherService
from services.weather_service import WeatherService
from services.gemini_service import GeminiService

groq_service = GroqService()
together_service = TogetherService()
weather_service = WeatherService()
gemini_service = GeminiService()

async def process_chat(message: str, user_id: int = None, image_base64: Optional[str] = None) -> Dict[str, Any]:
    """
    Master chat processor that uses LLMs (Groq/Together) for reasoning 
    and Gemini for vision if an image is provided.
    """
    
    # 1. Handle Vision if image is present
    if image_base64:
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)
        vision_result = await gemini_service.analyze_image(image_bytes)
        
        explanation = f"I've analyzed the image. It looks like {vision_result.get('disease')}."
        return {
            "explanation": explanation,
            "disease": vision_result.get("disease"),
            "cause": vision_result.get("cause"),
            "solution": vision_result.get("treatment"),
            "confidence": vision_result.get("confidence", 100),
            "data": vision_result
        }

    # 2. Handle Text Query with LLM
    weather_data = None
    # Enrich with weather context if possible (defaulting to Mumbai for context)
    try:
        weather_data = weather_service.get_weather(city="Mumbai")
    except:
        pass

    try:
        # Primary LLM: Groq
        llm_response = groq_service.chat(message, weather_data=weather_data)
        return {
            "explanation": llm_response.get("explanation", "Thinking..."),
            **llm_response
        }
    except Exception:
        # Fallback LLM: Together AI
        try:
            llm_response = together_service.chat(message, weather_data=weather_data)
            return {
                "explanation": llm_response.get("explanation", "Thinking..."),
                **llm_response
            }
        except Exception as e:
            return {
                "explanation": "I'm sorry, I'm having trouble connecting to my AI core. Please check your API keys.",
                "error": str(e)
            }
