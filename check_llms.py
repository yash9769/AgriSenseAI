import os
import asyncio
from dotenv import load_dotenv
from services.gemini_service import GeminiService
from services.groq_service import GroqService
from services.together_service import TogetherService

# Load keys
load_dotenv()

async def test_all_apis():
    print("Starting AgriSense AI - LLM Verification Test\n")
    
    # 1. Test Groq
    print("--- Testing Groq (Primary Chat) ---")
    groq = GroqService()
    try:
        response = groq.chat("Why are my tomato leaves turning yellow?")
        if response and "Problem" in response:
            print("SUCCESS: Groq (Real API response received)")
            print(f"   Response: {response['Problem'][:50]}...")
        else:
            print("FAILED: Groq (Unexpected response format)")
    except Exception as e:
        print(f"FAILED: Groq (Check GROQ_API_KEY) - Error: {str(e)}")

    print("\n--- Testing Together AI (Fallback Chat) ---")
    together = TogetherService()
    try:
        response = together.chat("How to prevent potato blight?")
        if response and "Problem" in response:
            print("SUCCESS: Together AI (Real API response received)")
            print(f"   Response: {response['Problem'][:50]}...")
        else:
            print("FAILED: Together AI (Unexpected response format)")
    except Exception as e:
        print(f"FAILED: Together AI (Check TOGETHER_API_KEY) - Error: {str(e)}")

    print("\n--- Testing Gemini (Vision) ---")
    gemini = GeminiService()
    # Note: Gemini requires a real image. This check verifies key initialization.
    if not gemini.api_key or gemini.api_key == "your_gemini_api_key_here":
         print("❌ Gemini: FAILED (GEMINI_API_KEY is still placeholder)")
    else:
        print("💡 Gemini: API Key configured. Run /analyze-image via the app with a real image to test vision functionality.")

    print("\n--- Summary ---")
    keys = ["GEMINI_API_KEY", "GROQ_API_KEY", "TOGETHER_API_KEY"]
    for key in keys:
        val = os.getenv(key)
        status = "SET" if val and "your_" not in val else "NOT SET/PLACEHOLDER"
        print(f"{key}: {status}")

if __name__ == "__main__":
    asyncio.run(test_all_apis())
