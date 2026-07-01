import google.generativeai as genai

from backend.config import settings

model = None
_cache: dict = {}

def _call(prompt: str) -> str:
    global model
    if model is None:
        if not settings.gemini_api_key.strip():
            return "Gemini service not available. Add real GEMINI_API_KEY to .env for AI advisory."
        try:
            genai.configure(api_key=settings.gemini_api_key)
            model = genai.GenerativeModel("gemini-2.5-flash")
        except Exception as e:
            return f"Gemini setup error: {str(e)}"
    if prompt in _cache:
        return _cache[prompt]
    try:
        response = model.generate_content(prompt)
        result = response.text
        _cache[prompt] = result
        return result
    except Exception as e:
        return f"AI response error: {str(e)}"

def explain_soil(nutrients: dict, score: float, recommendations: list) -> str:
    prompt = f"""You are an agricultural advisor. Explain these soil analysis results to an Indian farmer in simple language.
Nutrients: {nutrients}
Health Score: {score}/100
Recommendations: {recommendations}
Provide: Summary, Nutrient Analysis, Fertilizer Guidance, Precautions (4 bullet points each section)."""
    return _call(prompt)

def generate_crop_advisory(crops: list, weather: dict, market: dict, alerts: list) -> str:
    prompt = f"""You are an expert Indian agricultural advisor.
Top Crops: {crops}
Weather: {weather}
Market Data: {market}
Climate Alerts: {alerts}
Give a ranked crop recommendation with reasons. Keep it practical for a small farmer."""
    return _call(prompt)

def explain_disease(disease: str, crop: str, confidence: float) -> str:
    prompt = f"""An Indian farmer's {crop} plant has been diagnosed with: {disease} (confidence: {confidence}%).
Provide: Summary, Analysis, Treatment steps, Prevention tips, Key actions in simple language."""
    return _call(prompt)

def chat_intent_response(intent: str, data: dict, knowledge: dict = None) -> str:
    """Generate response for chat intent using knowledge."""
    cause = knowledge.get('cause', '') if knowledge else ''
    solution = knowledge.get('solution', '') if knowledge else ''
    prompt = f"""Chat intent: {intent}
Data: {data}
Knowledge cause: {cause}
Knowledge solution: {solution}
Generate natural, helpful response for Indian farmer as chatbot. Keep concise, actionable."""
    return _call(prompt)
