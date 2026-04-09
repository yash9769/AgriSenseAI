import os
import base64
import logging
import requests
from typing import Optional, Dict, Any
from services.gemini_service import GeminiService
from services.groq_service import GroqService

logger = logging.getLogger(__name__)

gemini_service = GeminiService()
groq_service = GroqService()

class ChatService:
    def chat(self, message: str, image_base64: Optional[str] = None) -> Dict[str, Any]:
        """
        Processes a chat message, optionally with an image.
        Uses Supabase Diagnose function for Vision (HF + Gemini)
        and Groq for Natural Language Generation.
        """
        
        # 1. Handle Vision if image is present
        if image_base64:
            try:
                # Use the already fixed diagnose function on Supabase for HF/Gemini hybrid analysis
                supabase_url = os.getenv("SUPABASE_URL")
                supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
                
                headers = {
                    "Authorization": f"Bearer {supabase_key}",
                    "Content-Type": "application/json"
                }
                
                diagnose_url = f"{supabase_url}/functions/v1/diagnose"
                payload = {
                    "image": image_base64,
                    "cropType": "Unknown",
                    "season": "kharif"
                }
                
                resp = requests.post(diagnose_url, headers=headers, json=payload, timeout=30)
                diagnosis_data = resp.json()
                
                if not diagnosis_data.get("success"):
                    raise Exception(diagnosis_data.get("error", "Diagnosis failed"))
                    
                diagnosis = diagnosis_data.get("diagnosis", {})
                
                # Use Groq to provide a conversational chat response
                chat_query = f"I've analyzed an image of a {diagnosis.get('crop')} and found {diagnosis.get('disease')}. reasoning: {diagnosis.get('reasoning')}. explain this to the farmer conversationally and suggest treatment: {diagnosis.get('treatment')}."
                
                llm_response = groq_service.chat(chat_query)
                
                return {
                    "response": llm_response.get("explanation"),
                    "data": {
                        "disease": diagnosis.get("disease"),
                        "cause": diagnosis.get("reasoning")[0] if diagnosis.get("reasoning") else "Visual markers",
                        "solution": ", ".join(diagnosis.get("treatment", [])),
                        "confidence": diagnosis.get("confidence", 100),
                        "Problem": llm_response.get("Problem", diagnosis.get("disease")),
                        "Cause": llm_response.get("Cause", "Identified by AI vision"),
                        "Solution": llm_response.get("Solution", diagnosis.get("treatment")[0] if diagnosis.get("treatment") else "Contact expert"),
                        "original_diagnosis": diagnosis_data
                    }
                }
            except Exception as e:
                logger.error(f"Chat vision error: {e}")
                return {
                    "response": "I analyzed the image but encountered an error interpreting it with the advanced core. It looks like a crop health issue.",
                    "data": {"error": str(e)}
                }

        # 2. Handle Text Query with LLM
        try:
            llm_response = groq_service.chat(message)
            return {
                "response": llm_response.get("explanation"),
                "data": {
                    "Problem": llm_response.get("Problem"),
                    "Cause": llm_response.get("Cause"),
                    "Solution": llm_response.get("Solution")
                }
            }
        except Exception as e:
            logger.error(f"Chat error: {e}")
            return {
                "response": "I'm having some trouble processing your request right now. Please try again later.",
                "data": {"error": str(e)}
            }

async def process_chat(message: str, user_id: Optional[int] = None, image_base64: Optional[str] = None):
    service = ChatService()
    return service.chat(message, image_base64)
