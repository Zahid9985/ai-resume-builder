const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/ai_resume'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-3.8-flash'),
  GEMINI_FALLBACK_MODEL: z.string().default('gemini-3.6-flash'),
  GEMINI_SECONDARY_FALLBACK_MODEL: z.string().default('gemini-3.5-flash-lite'),
  PUPPETEER_EXECUTABLE_PATH: z.string().optional().default(''),
  UPLOAD_MAX_MB: z.coerce.number().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100)
});

const env = envSchema.parse(process.env);

module.exports = { env };
