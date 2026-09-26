import axios from 'axios';
import { AppError } from '../middleware/errorMiddleware.js';

const decodeHtmlEntities = (text) => {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

export const fetchArticleText = async (targetUrl) => {
  let url = targetUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      maxContentLength: 5_000_000,
    });

    const html = String(response.data);
    const cleanedText = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<header[\s\S]*?<\/header>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');

    const decoded = decodeHtmlEntities(cleanedText).trim();

    if (decoded.length < 50) {
      throw new AppError(
        'Could not extract sufficient article text from the URL. The page may require JavaScript or authentication.',
        422
      );
    }

    return decoded.slice(0, 8000);
  } catch (error) {
    if (error instanceof AppError) throw error;
    const msg = error.response?.status
      ? `HTTP ${error.response.status} when fetching URL`
      : error.message;
    throw new AppError(`Failed to fetch article from URL (${msg})`, 502);
  }
};
