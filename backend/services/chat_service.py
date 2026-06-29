import json
import re
from typing import Dict, Any, Optional
import base64
from PIL import Image
import io
from pathlib import Path
from backend.services.disease_detection import detector
from backend.services.weather_service import fetch_weather
from backend.services.crop_recommendation import recommend_crops
from backend.services.gemini_service import explain_disease, chat_intent_response

# Load knowledge globally with correct path
_base_path = Path(__file__).parent.parent
with open(_base_path / 'data' / 'knowledge.json', 'r') as f:
    KNOWLEDGE = json.load(f)

with open(_base_path / 'data' / 'symptom_graph.json', 'r') as f:
    SYMPTOM_GRAPH = json.load(f)

async def process_chat(message: str, user_id: int = None, image_base64: Optional[str] = None) -> Dict[str, Any]:
    message_lower = message.lower()
    
    # Intent detection
    if re.search(r'\b(disease|leaf|sick|plant|yellow|spot|blight|rust|mildew|curl)\b', message_lower):
        return await handle_disease_intent(message, image_base64)
    elif re.search(r'\b(weather|rain|forecast|temperature)\b', message_lower):
        return await handle_weather_intent(message)
    elif re.search(r'\b(crop|recommend|best|grow|planting)\b', message_lower):
        return await handle_crop_intent(message)
    else:
        fallback_msg = "Hi farmer! Ask about plant disease (upload photo or describe symptoms), weather, or crop recommendations."
        return {
            "explanation": fallback_msg,
            "followup": "E.g., 'Yellow leaves on tomato', 'Weather Hyderabad', 'Crop loam Telangana kharif'",
            "disease": None, "confidence": None, "cause": None, "solution": None, "top_crops": None, "weather": None
        }

async def handle_disease_intent(message: str, image_base64: Optional[str] = None) -> Dict[str, Any]:
    symptoms = extract_symptoms(message_lower)
    low_conf_msg = None
    
    if image_base64:
        # Image prediction with top 3
        if image_base64.startswith('data:image'):
            image_base64 = image_base64.split(',')[1]
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        result = detector.predict(image, top_k=3)
        
        primary = result['top_classes'][0]
        label_clean = f"{primary['crop']} {primary['disease']}"
        prediction_key = primary['label']
        
        knowledge_entry = KNOWLEDGE.get('diseases', {}).get(prediction_key, {})
        cause = knowledge_entry.get('cause', 'Unknown cause')
        solution = knowledge_entry.get('solution', 'Unknown solution')
        
        explanation = explain_disease(label_clean, primary['crop'], primary['confidence'])
        
        # Hybrid if low conf + symptoms
        if primary['confidence'] < 50 and symptoms:
            result = hybrid_reasoning(result, symptoms)
            low_conf_msg = "Low image conf, combined with symptoms for better accuracy."
        
        severity = "High" if primary['confidence'] > 80 else "Medium" if primary['confidence'] > 50 else "Low"
        
        return {
            "disease": label_clean,
            "confidence": primary['confidence'],
            "severity": severity,
            "top_classes": result['top_classes'],
            "explanation": explanation,
            "cause": cause,
            "solution": solution,
            "uncertainty_msg": low_conf_msg,
            "reasoning_flow": result.get('reasoning', ''),
            "followup": None
        }
    else:
        # Symptom fallback
        if symptoms:
            sym_result = symptom_reasoning(symptoms)
            return {
                "disease": None,
                "confidence": None,
                "explanation": "No image, using symptom graph.",
                "top_classes": sym_result['top_classes'],
                "cause": sym_result.get('cause'),
                "solution": sym_result.get('solution'),
                "uncertainty_msg": "Upload image for ML prediction.",
                "followup": "Upload leaf photo for accurate ML diagnosis?",
                "reasoning_flow": "Symptom → Disease probabilities"
            }
        return {
            "explanation": "Describe symptoms (yellow leaves, spots) or upload photo.",
            "followup": "Upload image or describe symptoms?",
            "disease": None
        }

def extract_symptoms(text):
    symptoms = ["Yellow leaves", "Leaf spots", "Powdery white", "Rust spots", "Leaf curl", "Blight wilting"]
    for sym in symptoms:
        if sym.lower() in text:
            return sym
    return None

def symptom_reasoning(symptom):
    graph = SYMPTOM_GRAPH.get(symptom, {})
    top_classes = sorted(graph.items(), key=lambda x: x[1], reverse=True)[:3]
    top_list = [{"disease": d, "confidence": p*100} for d, p in top_classes]
    # Get knowledge for top
    top_disease = top_classes[0][0] if top_classes else None
    knowledge = KNOWLEDGE.get('diseases', {}).get(top_disease, {})
    return {
        "top_classes": top_list,
        "cause": knowledge.get('cause'),
        "solution": knowledge.get('solution'),
        "reasoning": f"Symptom '{symptom}' mapped to top diseases."
    }

def hybrid_reasoning(image_result, symptoms):
    sym_result = symptom_reasoning(symptoms)
    # Simple weighted combine
    for img_class in image_result['top_classes']:
        disease = img_class['disease']
        img_conf = img_class['confidence'] / 100
        sym_conf = SYMPTOM_GRAPH.get(symptoms, {}).get(disease, 0)
        combined = 0.6 * img_conf + 0.4 * sym_conf
        img_class['combined_conf'] = round(combined * 100, 2)
    
    # Re-sort by combined
    image_result['top_classes'] = sorted(image_result['top_classes'], key=lambda x: x['combined_conf'], reverse=True)
    image_result['reasoning'] = f"Hybrid: Image (60%) + Symptom '{symptoms}' (40%)."
    return image_result

async def handle_weather_intent(message: str) -> Dict[str, Any]:
    location_match = re.search(r'(?:in|for)\s*([a-zA-Z\s,]+)', message)
    loc = location_match.group(1).strip() if location_match else 'Delhi'
    
    weather = fetch_weather(loc)
    current = weather.get('current', {})
    temp = current.get('temperature_2m', 'N/A')
    condition = current.get('weathercode', '')
    
    explanation = f"🌤️ Weather in {loc}: {temp}°C, condition {condition}. Plan irrigation accordingly!"
    
    return {
        "weather": weather,
        "explanation": explanation,
        "followup": "What soil/state for crop recs?"
    }

async def handle_crop_intent(message: str) -> Dict[str, Any]:
    soil_match = re.search(r'soil\s*([a-z]+)', message.lower())
    state_match = re.search(r'(?:state|in)\s*([a-zA-Z\s,]+)', message.lower())
    season_match = re.search(r'(kharif|rabi|zaid|monsoon|winter)', message.lower())
    
    soil_type = soil_match.group(1) if soil_match else 'loam'
    state = state_match.group(1).strip() if state_match else 'Telangana'
    season = season_match.group(1) if season_match else 'kharif'
    
    recs = recommend_crops(soil_type, state, season)
    explanation = recs.get('advisory', 'Crop recommendations ready.')
    
    return {
        "top_crops": recs.get('crops', []),
        "explanation": explanation,
        "followup": None
    }
