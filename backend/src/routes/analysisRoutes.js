import axios from 'axios';
import { env } from '../config/env.js';

export const analyzeText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text field is required' });
    }

    const hfResponse = await axios.post(
      'https://huggingface.co',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${env.huggingfaceApiKey || process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        options: {
          wait_for_model: true,
          use_cache: true
        }
      }
    );

    const predictions = hfResponse.data;
    let fakeScore = 0;

    if (Array.isArray(predictions) && Array.isArray(predictions[0])) {
      const target = predictions[0].find(p => p.label?.toLowerCase() === 'hate' || p.label?.toLowerCase() === 'label_1');
      if (target) fakeScore = target.score;
    } else if (Array.isArray(predictions)) {
      const target = predictions.find(p => p.label?.toLowerCase() === 'hate' || p.label?.toLowerCase() === 'label_1');
      if (target) fakeScore = target.score;
    }

    const credibilityScore = Math.round((1 - fakeScore) * 100);

    res.json({
      success: true,
      text,
      credibilityScore,
      classification: credibilityScore < 50 ? 'Unreliable' : 'Reliable',
      rawResults: predictions
    });
  } catch (error) {
    console.error('Hugging Face Text Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: 'Failed to process text analysis',
      error: error.response?.data || error.message
    });
  }
};

export const analyzeUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL field is required' });
    
    res.json({ success: true, message: 'URL analysis placeholder functionality' });
  } catch (error) {
    next(error);
  }
};

export const analyzeImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

    res.json({ success: true, message: 'Image analysis placeholder functionality' });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    res.json({ success: true, history: [] });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (req, res, next) => {
  try {
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    next(error);
  }
};