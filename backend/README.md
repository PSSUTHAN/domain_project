# RAG Chatbot Backend (Gemini API)

This backend provides a Flask API for the RAG-based chatbot using Google Gemini.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend` directory and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> **Get a Gemini API key:** [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Create Knowledge Base

Run the data ingestion script to create the knowledge base from your website:

```bash
python ingest_data.py
```

This will:
- Extract content from all HTML files
- Create a JSON knowledge base file
- Store company information and FAQs

### 4. Start the API Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### GET /health
Health check endpoint.

### POST /chat
Send a message to the chatbot.

**Request:**
```json
{
  "message": "What services do you offer?"
}
```

**Response:**
```json
{
  "response": "We offer residential construction, commercial buildouts...",
  "sources": ["index.html", "company_info"]
}
```

### POST /clear
Clear conversation history.

## How It Works

1. User sends a question
2. System searches knowledge base using keyword matching
3. Relevant context is sent to Gemini API
4. Gemini generates a response based on the context
5. Response is returned to user

## Troubleshooting

- Make sure your Gemini API key is set correctly in `.env`
- Run `ingest_data.py` first to create the knowledge base
- Check that `knowledge_base.json` exists in the backend directory
