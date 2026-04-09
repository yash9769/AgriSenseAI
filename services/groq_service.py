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
            "You are AgriSense AI, an elite agronomist and agricultural scientist. "
            "Provide highly professional yet accessible advice to farmers. "
            "If the user asks a general question, answer it in detail. "
            "If they describe a crop problem, precisely identify the problem, its cause, and an actionable solution. "
            "ALWAYS return a valid JSON object with EXACTLY this structure: "
            "{\"explanation\": \"your natural conversational response here\", \"Problem\": \"...\", \"Cause\": \"...\", \"Solution\": \"...\"} "
            "Ensure the JSON is properly escaped and use double quotes for all keys and values."
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
