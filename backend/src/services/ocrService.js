import axios from 'axios';
import FormData from 'form-data';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const extractTextFromImage = async (file) => {
  try {
    const form = new FormData();
    form.append('language', 'eng');
    form.append('isOverlayRequired', 'false');
    form.append('detectOrientation', 'true');
    form.append('scale', 'true');
    form.append('OCREngine', '2');
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(env.ocrApiUrl, form, {
      headers: {
        ...form.getHeaders(),
        apikey: env.ocrApiKey || 'helloworld',
      },
      timeout: 30000,
    });

    if (response.data?.IsErroredOnProcessing) {
      const errDetail = response.data?.ErrorMessage?.[0] || 'OCR engine failed to parse image';
      throw new AppError(`OCR processing error: ${errDetail}`, 422);
    }

    const parsedResults = response.data?.ParsedResults;
    if (!parsedResults || !parsedResults.length) {
      throw new AppError('No text parsed from the uploaded image', 422);
    }

    const text = parsedResults.map((r) => r.ParsedText).join('\n').trim();
    if (!text) {
      throw new AppError('Image contained no readable textual content', 422);
    }

    return text;
  } catch (error) {
    if (error instanceof AppError) throw error;
    const detail = error.response?.data?.ErrorMessage || error.message;
    throw new AppError(`OCR extraction service error: ${detail}`, 502);
  }
};
