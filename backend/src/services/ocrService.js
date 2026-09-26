import axios from 'axios';
import FormData from 'form-data';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const extractTextFromImage = async (file) => {
  if (!env.ocrApiKey) {
    // Lightweight placeholder when OCR key is not configured
    return 'Sample OCR output: authorities confirm the circulating claim is unverified.';
  }

  try {
    const form = new FormData();
    form.append('language', 'eng');
    form.append('isOverlayRequired', 'false');
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(env.ocrApiUrl, form, {
      headers: {
        ...form.getHeaders(),
        apikey: env.ocrApiKey,
      },
      timeout: 30000,
    });

    const parsed = response.data?.ParsedResults?.[0]?.ParsedText || '';
    return parsed.trim();
  } catch (error) {
    const detail = error.response?.data?.ErrorMessage || error.message;
    throw new AppError(`OCR extraction failed: ${detail}`, 502);
  }
};
