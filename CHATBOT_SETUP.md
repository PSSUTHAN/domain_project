# RAG Chatbot Integration - Setup Guide

This guide will help you set up and run the AI-powered RAG chatbot for the Engineers Veedu website.

## 🚀 Quick Start

1. Install dependencies: `pip install -r requirements.txt`
2. Add your Gemini API key to `.env`
3. Generate knowledge base: `python ingest_data.py`
4. Start server: `python app.py`
5. Open `http://localhost:5000` in your browser

## ✨ Features

- **Semantic Search**: Uses Gemini's embedding model for intelligent document retrieval
- **Conversational Memory**: Remembers context from previous messages
- **RAG Architecture**: Combines your website content with AI for accurate responses
- **Modern UI**: Sleek, responsive chatbot widget

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Google Gemini API key (free tier available)

## 🔧 Step-by-Step Setup

### 1. Install Backend Dependencies

Open a terminal/command prompt and navigate to the backend directory:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory and add your Gemini API key:

```
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

> **🔑 Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)**

### 3. Test Your API Key

Run the test script to verify everything is working:

```bash
python test_gemini.py
```

You should see:
```
✅ Chat Model SUCCESS!
✅ Embedding Model SUCCESS!
🎉 All tests completed!
```

### 4. Create the Knowledge Base

Run the data ingestion script to extract content from your website:

```bash
python ingest_data.py
```

This will:
- Extract text from all HTML files
- Create a JSON knowledge base with your website content
- Store it in `knowledge_base.json`

### 5. Start the Backend Server

Start the Flask API server:

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 6. Open the Website

Open your browser and go to `http://localhost:5000`

You should see a floating chat button (💬) in the bottom-right corner.

## 💬 Using the Chatbot

1. Click the floating chat button to open the chatbot
2. Try asking questions like:
   - "What services do you offer?"
   - "How can I get a quote?"
   - "What areas do you serve?"
   - "Tell me about your recent projects"
3. The chatbot will respond based on your website content!

## 🔧 Troubleshooting

### Backend Issues

**Error: "No module named 'google'"**
- Solution: Make sure you installed dependencies: `pip install -r requirements.txt`

**Error: "knowledge_base.json not found"**
- Solution: Run the ingestion script first: `python ingest_data.py`

**Error: "Invalid API key" or authentication errors**
- Solution: Check your `.env` file and make sure your Gemini API key is correct
- Make sure you enabled the Gemini API in Google AI Studio
- Run `python test_gemini.py` to diagnose issues

**Error: "models/text-embedding-004 is not found"**
- Solution: Update the google-generativeai package: `pip install --upgrade google-generativeai`

### Frontend Issues

**Chat button doesn't appear**
- Solution: Make sure `chatbot.css` and `chatbot.js` are linked in your HTML files
- Check browser console for errors (F12)

**"Failed to connect to server" error**
- Solution: Make sure the backend server is running on `http://localhost:5000`
- Check CORS settings if running from a different domain

## 🔑 API Key Information

The Gemini API offers a generous free tier, perfect for development and testing:
- **Free tier:** 60 requests per minute
- **Embedding model:** Included in free tier
- No credit card required
- Get your key at: [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🎨 Customization

### Change Chat Colors
Edit `chatbot.css` and modify the CSS variables:
```css
:root {
    --chatbot-primary: #004d99;  /* Change to your brand color */
    --chatbot-accent: #ff9900;   /* Change accent color */
}
```

### Modify Welcome Message
Edit `chatbot.js` and find the `showWelcomeMessage()` function to customize the welcome text and suggested questions.

### Add More Content
To add more knowledge to the chatbot:
1. Edit `backend/ingest_data.py`
2. Add custom documents to the `custom_knowledge` array
3. Run `python ingest_data.py` again to rebuild the database
4. Restart the server to regenerate embeddings

### Regenerate Embeddings
If you update the knowledge base, call this endpoint to regenerate embeddings:
```bash
curl -X POST http://localhost:5000/regenerate-embeddings
```

## 🚀 Production Deployment

For production use:

1. Set `debug=False` in `backend/app.py`
2. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```
3. Update the API URL in `chatbot.js` to your production server
4. Consider using environment variables for configuration
5. Enable HTTPS for secure communication
6. Consider adding rate limiting for production

## 📁 Project Structure

```
domain_project/
├── backend/
│   ├── app.py              # Main Flask server with RAG logic
│   ├── ingest_data.py      # Knowledge base creation script
│   ├── knowledge_base.json # Extracted website content
│   ├── embeddings.json     # Pre-computed vector embeddings
│   ├── test_gemini.py      # API key test script
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (API key)
├── chatbot.css             # Chatbot widget styles
├── chatbot.js              # Chatbot widget JavaScript
├── index.html              # Main website
└── ...                     # Other website files
```

Enjoy your new AI-powered chatbot! 🤖✨
