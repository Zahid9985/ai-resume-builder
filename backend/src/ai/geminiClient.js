const { GoogleGenAI } = require('@google/genai');
const { env } = require('../config/env');
const { AppError } = require('../utils/AppError');

function getGeminiClient() {
  if (!env.GEMINI_API_KEY) {
    throw new AppError('GEMINI_API_KEY is required for AI analysis and generation.', 503);
  }
  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

async function generateJsonFromGemini(prompt) {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });
  return response.text;
}

module.exports = { generateJsonFromGemini };
