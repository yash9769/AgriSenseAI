import requests
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"

    def chat(self, query: str, weather_data: dict = None):
        if not self.api_key:
            logger.error("GROQ_API_KEY not found")
            raise Exception("GROQ_API_KEY not configured")

        weather_context = ""
        if weather_data:
            weather_context = f"\n\n[SYSTEM: Local Weather: {weather_data.get('temperature')}°C, {weather_data.get('condition_code')}]"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        # New flexible system prompt
        system_prompt = (
            "You are AgriSense AI, a helpful and expert agricultural assistant. "
            "Talk naturally to the farmer. If they ask a general question, answer it clearly. "
            "If they ask about a crop problem, identify: 1. Problem, 2. Cause, 3. Solution. "
            "ALWAYS return a JSON object with this structure: "
            "{ 'explanation': 'your natural conversational response here', 'Problem': '...', 'Cause': '...', 'Solution': '...' } "
            "If no specific problem is discussed, put 'None' in the Problem/Cause/Solution fields."
            f"{weather_context}"
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            "response_format": {"type": "json_object"}
        }

        try:
            response = requests.post(self.url, headers=headers, json=payload, timeout=12)
            response.raise_for_status()
            result = response.json()
            content = result['choices'][0]['message']['content']
            return json.loads(content)
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            raise e
