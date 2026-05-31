const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store conversation history per session
const conversations = {};

// Helper to get or create conversation
function getConversation(sessionId) {
  if (!conversations[sessionId]) {
    conversations[sessionId] = [
      {
        role: 'system',
        content: 'You are Nebula Pro, an all-knowing, professional, and helpful AI assistant.',
      },
    ];
  }
  return conversations[sessionId];
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const conversation = getConversation(sessionId);
    conversation.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: conversation,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = response.choices[0].message.content;
    conversation.push({ role: 'assistant', content: assistantMessage });

    res.json({ reply: assistantMessage });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
});

// Image generation endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

// Clear conversation history endpoint
app.post('/api/clear-history', (req, res) => {
  const { sessionId = 'default' } = req.body;
  conversations[sessionId] = [
    {
      role: 'system',
      content: 'You are Nebula Pro, an all-knowing, professional, and helpful AI assistant.',
    },
  ];
  res.json({ message: 'Conversation history cleared' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Nebula Pro server running on http://localhost:${PORT}`);
});
