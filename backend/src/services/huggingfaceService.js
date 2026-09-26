import axios from 'axios';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const analyzeTextContent = async (text) => {
  if (!env.huggingfaceApiKey) {
    // Deterministic free-tier fallback for local/dev without API key
    const heuristicFake =
      /\b(breaking|shocking|you won't believe|secret|miracle|100%)\b/i.test(
        text
      );
    return [
      {
        label: heuristicFake ? 'LABEL_FAKE' : 'LABEL_REAL',
        score: heuristicFake ? 0.72 : 0.68,
      },
    ];
  }

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${env.huggingfaceTextModel}`,
      { inputs: text.slice(0, 2000) },
      {
        headers: {
          Authorization: `Bearer ${env.huggingfaceApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const raw = response.data;
    const labels = Array.isArray(raw?.[0]) ? raw[0] : Array.isArray(raw) ? raw : [];

    return labels
      .map((item) => ({
        label: item.label,
        score: item.score,
      }))
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    const detail = error.response?.data?.error || error.message;
    throw new AppError(`Hugging Face inference failed: ${detail}`, 502);
  }
};
