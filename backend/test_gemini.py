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
print(f"API Key loaded: {api_key[:20]}..." if api_key else "❌ No API key found!")

if not api_key:
    print("\nPlease add your Gemini API key to the .env file:")
    print("GEMINI_API_KEY=your-api-key-here")
    print("\nGet a free API key at: https://makersuite.google.com/app/apikey")
    exit(1)

genai.configure(api_key=api_key)

print("\n🔄 Testing Chat Model (gemini-1.5-flash)...")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say hello!")
    print(f"✅ Chat Model SUCCESS!")
    print(f"Response: {response.text[:100]}...")
except Exception as e:
    print(f"❌ Chat Model ERROR: {e}")

print("\n🔄 Testing Embedding Model (text-embedding-004)...")
try:
    result = genai.embed_content(
        model="models/text-embedding-004",
        content="Test embedding",
        task_type="retrieval_document"
    )
    print(f"✅ Embedding Model SUCCESS!")
    print(f"Embedding dimensions: {len(result['embedding'])}")
except Exception as e:
    print(f"❌ Embedding Model ERROR: {e}")

print("\n🎉 All tests completed!")
