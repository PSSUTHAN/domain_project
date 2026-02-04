"""
Quick test script to verify Gemini API key is working
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {api_key[:20]}..." if api_key else "No API key found!")

genai.configure(api_key=api_key)

# Test the API
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello!")
    print(f"\n✅ SUCCESS! Gemini API is working!\n")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"\n❌ ERROR: Gemini API test failed!\n")
    print(f"Error details: {e}")
