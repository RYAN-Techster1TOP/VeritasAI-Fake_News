import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/veritas_ai',
  jwtSecret: process.env.JWT_SECRET || 'veritas_ai_jwt_secret_key_2026_dev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  huggingfaceTextModel:
    process.env.HUGGINGFACE_TEXT_MODEL ||
    'facebook/roberta-hate-speech-dynabench-r4-target',
  ocrApiUrl: process.env.OCR_API_URL || 'https://api.ocr.space/parse/image',
  ocrApiKey: process.env.OCR_API_KEY || 'helloworld',
};

if (!process.env.MONGODB_URI) {
  console.warn('[Config] MONGODB_URI not set. Using fallback: mongodb://127.0.0.1:27017/veritas_ai');
}
if (!process.env.JWT_SECRET) {
  console.warn('[Config] JWT_SECRET not set. Using default development JWT secret key.');
}
if (!process.env.HUGGINGFACE_API_KEY) {
  console.warn('[Config] HUGGINGFACE_API_KEY not set. Using intelligent heuristic analysis fallback.');
}
