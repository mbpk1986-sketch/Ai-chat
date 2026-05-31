# Nebula Pro - AI Chat Application

An intelligent web-based chat application powered by OpenAI's GPT-4o and DALL-E-3.

## Features

- 💬 Real-time AI chat using GPT-4o
- 🎨 Image generation with DALL-E-3 (type "Generate [prompt]")
- 🔐 Secure backend API with environment variables
- 📱 Responsive dark-themed UI
- 💾 Conversation history per session
- 🧹 Clear history functionality

## Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/mbpk1986-sketch/Ai-chat.git
   cd Ai-chat
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...
   PORT=5000
   ```

4. Start the server
   ```bash
   npm start
   ```

5. Open in browser
   ```
   http://localhost:5000
   ```

## Development

For auto-reload on file changes:

```bash
npm run dev
```

## API Endpoints

### POST `/api/chat`
Send a chat message.

**Request:**
```json
{
  "message": "Hello!",
  "sessionId": "optional_session_id"
}
```

**Response:**
```json
{
  "reply": "AI response here..."
}
```

### POST `/api/generate-image`
Generate an image from a prompt.

**Request:**
```json
{
  "prompt": "A beautiful sunset over mountains"
}
```

**Response:**
```json
{
  "imageUrl": "https://..."
}
```

### POST `/api/clear-history`
Clear conversation history for a session.

### GET `/api/health`
Health check endpoint.

## Security Notes

- ✅ API keys stored in `.env` (never in source code)
- ✅ All API calls go through secure backend
- ✅ Input sanitization and error handling
- ✅ CORS configured

## Deployment

For production deployment:

1. Set environment variables on your hosting platform
2. Set `NODE_ENV=production`
3. Use a process manager like PM2

## License

MIT

## Author

mbpk1986-sketch
