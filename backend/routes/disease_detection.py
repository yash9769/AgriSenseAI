from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from PIL import Image
import io
import json
import logging
import base64
import os
import requests
from services.gemini_service import GeminiService
from backend.database import get_db
from backend.models.crop_health_history import CropHealthHistory

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/disease", tags=["disease"])
gemini_service = GeminiService()

@router.post("/detect")
async def detect_disease(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        image_base64 = base64.b64encode(contents).decode()
        
        # Call Supabase Diagnose Function (HF + Gemini Hybrid)
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
        
        import requests
        resp = requests.post(diagnose_url, headers=headers, json=payload, timeout=30)
        result = resp.json()
        
        if not result.get("success"):
             raise HTTPException(status_code=500, detail=result.get("error", "Diagnosis failed"))
        
        diagnosis_data = result.get("diagnosis", {})
        
        # Save to history 
        record = CropHealthHistory(
            user_id=1,
            crop=diagnosis_data.get("crop"),
            disease=diagnosis_data.get("disease"),
            confidence=float(diagnosis_data.get("confidence", 0)),
            pathogen=diagnosis_data.get("pathogen", "AI Agent"),
            risk_level=diagnosis_data.get("risk_level", "Moderate"),
            reasoning=json.dumps(diagnosis_data.get("reasoning", [])), 
            treatment="; ".join(diagnosis_data.get("treatment", [])),
            prevention="; ".join(diagnosis_data.get("prevention", [])),
        )
        db.add(record)
        db.commit()
             
        return result
    except Exception as e:
        logger.error(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/history/{user_id}")
async def get_disease_history(user_id: int, db: Session = Depends(get_db)):
    history = db.query(CropHealthHistory).filter(CropHealthHistory.user_id == user_id).order_by(CropHealthHistory.timestamp.desc()).all()
    return history
