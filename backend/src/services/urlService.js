import axios from 'axios';
import { AppError } from '../middleware/errorMiddleware.js';

export const fetchArticleText = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'FakeNewsDetectBot/1.0',
      },
      maxContentLength: 2_000_000,
    });

    const html = String(response.data);
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length < 80) {
      throw new AppError('Could not extract enough article text from URL', 422);
    }

    return text.slice(0, 8000);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch URL content: ${error.message}`, 502);
  }
};
