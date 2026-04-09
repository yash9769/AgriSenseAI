from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from PIL import Image
import io
import json
import logging
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
        
        # Use Unified Gemini Service
        result = await gemini_service.analyze_image(contents)
        
        if "error" in result:
             raise HTTPException(status_code=500, detail=result["error"])
        
        # Save to history (mock user_id 1)
        record = CropHealthHistory(
            user_id=1,
            crop=result.get("crop"),
            disease=result.get("disease"),
            confidence=float(result.get("confidence", 0)),
            pathogen=result.get("pathogen"),
            risk_level=result.get("risk_level"),
            reasoning=result.get("explanation"), # Mapping explanation to reasoning
            treatment=result.get("treatment"),
            prevention=result.get("prevention"),
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
