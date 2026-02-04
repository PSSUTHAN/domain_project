"""
Flask API server for RAG chatbot using Google Gemini.
This serves the chatbot API endpoints.
"""

import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load knowledge base
knowledge_base_path = os.path.join(os.path.dirname(__file__), "knowledge_base.json")
knowledge_base = []

try:
    with open(knowledge_base_path, 'r', encoding='utf-8') as f:
        knowledge_base = json.load(f)
    print(f"Loaded {len(knowledge_base)} documents from knowledge base")
except FileNotFoundError:
    print("WARNING: knowledge_base.json not found. Run ingest_data.py first!")

# Initialize Gemini model
model = genai.GenerativeModel('gemini-pro')

# Store conversation history
conversation_history = []

print("Chatbot initialized successfully!")


def search_knowledge_base(query):
    """Simple keyword-based search in knowledge base."""
    query_lower = query.lower()
    results = []
    
    for doc in knowledge_base:
        content = doc['content'].lower()
        # Simple relevance scoring based on keyword matches
        score = 0
        query_words = query_lower.split()
        for word in query_words:
            if len(word) > 3:  # Only consider words longer than 3 chars
                score += content.count(word)
        
        if score > 0:
            results.append({
                'doc': doc,
                'score': score
            })
    
    # Sort by score and return top 3
    results.sort(key=lambda x: x['score'], reverse=True)
    return [r['doc'] for r in results[:3]]


@app.route('/')
def serve_index():
    """Serve the main website."""
    parent_dir = os.path.dirname(os.path.dirname(__file__))
    return send_from_directory(parent_dir, 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, images, etc.)."""
    parent_dir = os.path.dirname(os.path.dirname(__file__))
    return send_from_directory(parent_dir, filename)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "message": "Chatbot API is running"})


@app.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat requests.
    Expected JSON: {"message": "user message"}
    """
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Search knowledge base for relevant context
        relevant_docs = search_knowledge_base(user_message)
        
        # Build context from relevant documents
        context = "\n\n".join([
            f"Source: {doc['title']}\n{doc['content']}"
            for doc in relevant_docs
        ])
        
        # Create prompt with context
        system_prompt = """You are a helpful assistant for Engineers Veedu, a construction contractor company.
You help customers learn about our services, projects, and get support.
Be friendly, professional, and concise. Use the context provided below to answer questions.
If the context doesn't contain relevant information, provide a general helpful response and encourage them to contact us.

Context from our website:
"""
        
        full_prompt = f"""{system_prompt}

{context}

---

Customer question: {user_message}

Please provide a helpful, friendly response:"""
        
        # Get response from Gemini
        response = model.generate_content(full_prompt)
        answer = response.text
        
        # Track sources
        sources = [doc['source'] for doc in relevant_docs]
        
        # Add to conversation history
        conversation_history.append({
            'question': user_message,
            'answer': answer
        })
        
        return jsonify({
            "response": answer,
            "sources": sources
        })
    
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/clear', methods=['POST'])
def clear_history():
    """Clear conversation history."""
    try:
        conversation_history.clear()
        return jsonify({"message": "Conversation history cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
