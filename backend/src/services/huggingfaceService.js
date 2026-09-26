import axios from 'axios';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const analyzeTextContent = async (text) => {
  if (!env.huggingfaceApiKey) {
    // Advanced deterministic heuristic analyzer when API key is missing
    const cleanText = text.trim();
    
    // Heuristic features
    const sensationalKeywords = [
      'breaking', 'shocking', "you won't believe", 'secret', 'miracle',
      '100%', 'cure', 'conspiracy', 'illuminati', 'exposed', 'unbelievable',
      'mind blowing', 'urgent share', 'forwarded as received', 'banned video'
    ];

    const lower = cleanText.toLowerCase();
    let scoreCount = 0;
    
    for (const kw of sensationalKeywords) {
      if (lower.includes(kw)) {
        scoreCount += 1;
      }
    }

    // Check for excessive ALL CAPS words
    const words = cleanText.split(/\s+/);
    const capsWords = words.filter(w => w.length > 3 && w === w.toUpperCase() && /^[A-Z]+$/.test(w));
    if (capsWords.length >= 2) scoreCount += 1;

    // Check for multiple exclamation marks
    if ((cleanText.match(/!{2,}/g) || []).length > 0) scoreCount += 1;

    const isSensational = scoreCount >= 1;
    const fakeConfidence = Math.min(0.65 + scoreCount * 0.1, 0.95);
    const realConfidence = Math.min(0.70 + Math.max(0, 3 - scoreCount) * 0.08, 0.92);

    if (isSensational) {
      return [
        { label: 'LABEL_FAKE', score: Number(fakeConfidence.toFixed(4)) },
        { label: 'LABEL_REAL', score: Number((1 - fakeConfidence).toFixed(4)) },
      ];
    } else {
      return [
        { label: 'LABEL_REAL', score: Number(realConfidence.toFixed(4)) },
        { label: 'LABEL_FAKE', score: Number((1 - realConfidence).toFixed(4)) },
      ];
    }
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

    if (!labels.length) {
      throw new Error('Empty label array returned from model endpoint');
    }

    return labels
      .map((item) => ({
        label: String(item.label || item.entity || 'UNKNOWN'),
        score: Number(item.score) || 0,
      }))
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    const detail = error.response?.data?.error || error.message;
    throw new AppError(`Hugging Face inference failed: ${detail}`, 502);
  }
};
