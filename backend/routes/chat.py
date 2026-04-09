from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import base64
from backend.services.chat_service import process_chat

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = None
    image_base64: Optional[str] = None

@router.post("/")
async def chat(request: ChatRequest):
    try:
        result = await process_chat(request.message, request.user_id, request.image_base64)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Note: For image upload alternative, but using base64 for simplicity
# @router.post("/upload")
# async def chat_with_image(message: str = Form(...), file: UploadFile = File(...)):
#     contents = await file.read()
#     image_base64 = base64.b64encode(contents).decode()
#     return await process_chat(message, image_base64=image_base64)
