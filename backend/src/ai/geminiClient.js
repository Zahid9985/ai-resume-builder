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
  try {
    const response = await client.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    if (typeof response.text !== 'string' || !response.text.trim()) {
      throw new AppError('The AI service returned an empty response. Please try again.', 502);
    }
    return response.text;
  } catch (error) {
    if (error instanceof AppError) throw error;

    // Google GenAI SDK errors expose HTTP status under different fields across
    // SDK versions. Normalize them so provider failures never masquerade as
    // unhandled application 500s.
    const providerStatus = Number(error.status ?? error.statusCode ?? error.code);
    console.error('[Gemini API error]', {
      status: Number.isFinite(providerStatus) ? providerStatus : undefined,
      message: error.message,
      model: env.GEMINI_MODEL
    });

    if (providerStatus === 401 || providerStatus === 403) {
      throw new AppError('The AI service rejected its credentials. Check GEMINI_API_KEY in backend/.env and restart the backend.', 503);
    }
    if (providerStatus === 429) {
      throw new AppError('The AI service is busy or its quota is exhausted. Wait a moment and try again.', 503);
    }
    if (providerStatus >= 500) {
      throw new AppError('The AI service is temporarily unavailable. Please try again shortly.', 503);
    }
    if (providerStatus >= 400) {
      throw new AppError(`The AI service rejected the request (HTTP ${providerStatus}). Check GEMINI_MODEL and the backend configuration.`, 502);
    }
    throw new AppError('Could not get a response from the AI service. Check the backend logs and try again.', 502);
  }
}

module.exports = { generateJsonFromGemini };
