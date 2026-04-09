import requests
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TogetherService:
    def __init__(self):
        self.api_key = os.getenv("TOGETHER_API_KEY")
        self.url = "https://api.together.xyz/v1/chat/completions"
        self.model = "meta-llama/Llama-3-8b-chat-hf"

    def chat(self, query: str, weather_data: dict = None):
        if not self.api_key:
            logger.error("TOGETHER_API_KEY not found")
            raise Exception("TOGETHER_API_KEY not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        system_prompt = (
            "You are AgriSense AI (Fallback). Talk naturally to the farmer. "
            "ALWAYS return a JSON object: "
            "{ 'explanation': 'your natural response', 'Problem': '...', 'Cause': '...', 'Solution': '...' }"
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
            logger.error(f"Together AI API error: {str(e)}")
            raise e
