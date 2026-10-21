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
  const models = [...new Set([
    env.GEMINI_MODEL,
    env.GEMINI_FALLBACK_MODEL,
    env.GEMINI_SECONDARY_FALLBACK_MODEL
  ].filter(Boolean))];
  let lastError;

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index];
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      if (typeof response.text !== 'string' || !response.text.trim()) {
        throw new AppError('The AI service returned an empty response. Please try again.', 502);
      }
      if (index > 0) console.info(`[Gemini] Fallback model ${model} returned a response.`);
      return response.text;
    } catch (error) {
      if (error instanceof AppError) throw error;

      // SDK versions expose HTTP status under different fields. Retry capacity
      // and provider outages with the next configured model.
      const providerStatus = Number(error.status ?? error.statusCode ?? error.code);
      lastError = { providerStatus };
      const retryable = providerStatus === 429 || providerStatus >= 500;
      const hasFallback = index < models.length - 1;

      console.error('[Gemini API error]', {
        status: Number.isFinite(providerStatus) ? providerStatus : undefined,
        message: error.message,
        model
      });

      if (retryable && hasFallback) {
        console.warn(`[Gemini] ${model} is unavailable; retrying with ${models[index + 1]}.`);
        continue;
      }
      break;
    }
  }

  const { providerStatus } = lastError || {};
  if (providerStatus === 401 || providerStatus === 403) {
    throw new AppError('The AI service rejected its credentials. Check GEMINI_API_KEY in backend/.env and restart the backend.', 503);
  }
  if (providerStatus === 429) {
    throw new AppError('The AI service is busy or its quota is exhausted on the configured models. Wait a moment and try again.', 503);
  }
  if (providerStatus >= 500) {
    throw new AppError('The AI service is temporarily unavailable on the configured models. Please try again shortly.', 503);
  }
  if (providerStatus >= 400) {
    throw new AppError(`The AI service rejected the request (HTTP ${providerStatus}). Check GEMINI_MODEL and the backend configuration.`, 502);
  }
  throw new AppError('Could not get a response from the AI service. Check the backend logs and try again.', 502);
}

module.exports = { generateJsonFromGemini };
