import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  huggingfaceTextModel:
    process.env.HUGGINGFACE_TEXT_MODEL ||
    'facebook/roberta-hate-speech-dynabench-r4-target',
  ocrApiUrl: process.env.OCR_API_URL || 'https://api.ocr.space/parse/image',
  ocrApiKey: process.env.OCR_API_KEY || '',
};
