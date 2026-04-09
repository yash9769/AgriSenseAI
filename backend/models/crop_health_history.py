from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from datetime import datetime
from backend.database import Base

class CropHealthHistory(Base):
    __table_args__ = {'extend_existing': True}
    __tablename__ = "crop_health_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop = Column(String)
    disease = Column(String)
    confidence = Column(Float)
    pathogen = Column(String)
    risk_level = Column(String)
    reasoning = Column(JSON)
    treatment = Column(JSON)
    prevention = Column(JSON)
    image_url = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
