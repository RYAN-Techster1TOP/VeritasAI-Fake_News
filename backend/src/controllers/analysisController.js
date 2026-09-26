import { Analysis } from '../models/Analysis.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { analyzeTextContent } from '../services/huggingfaceService.js';
import { extractTextFromImage } from '../services/ocrService.js';
import { fetchArticleText } from '../services/urlService.js';

const mapVerdict = (labels = []) => {
  if (!labels.length) {
    return { verdict: 'uncertain', confidence: 0 };
  }

  const top = labels[0];
  const label = String(top.label || '').toLowerCase();
  const confidence = Number(top.score) || 0;

  if (label.includes('fake') || label.includes('hate') || label.includes('toxic')) {
    return { verdict: 'fake', confidence };
  }
  if (label.includes('real') || label.includes('true') || label.includes('neutral')) {
    return { verdict: 'real', confidence };
  }
  return { verdict: 'uncertain', confidence };
};

export const analyzeText = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      throw new AppError('Text content is required', 400);
    }

    const labels = await analyzeTextContent(text);
    const { verdict, confidence } = mapVerdict(labels);

    const analysis = await Analysis.create({
      user: req.user._id,
      inputType: 'text',
      sourceText: text,
      verdict,
      confidence,
      labels,
      explanation: `Primary model signal: ${labels[0]?.label || 'n/a'}`,
    });

    res.status(201).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

export const analyzeUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url?.trim()) {
      throw new AppError('URL is required', 400);
    }

    const articleText = await fetchArticleText(url);
    const labels = await analyzeTextContent(articleText);
    const { verdict, confidence } = mapVerdict(labels);

    const analysis = await Analysis.create({
      user: req.user._id,
      inputType: 'url',
      sourceUrl: url,
      sourceText: articleText.slice(0, 5000),
      verdict,
      confidence,
      labels,
      explanation: 'Analyzed extracted article body from URL',
    });

    res.status(201).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

export const analyzeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Image file is required', 400);
    }

    const extractedText = await extractTextFromImage(req.file);
    if (!extractedText?.trim()) {
      throw new AppError('No readable text found in image', 422);
    }

    const labels = await analyzeTextContent(extractedText);
    const { verdict, confidence } = mapVerdict(labels);

    const analysis = await Analysis.create({
      user: req.user._id,
      inputType: 'image',
      imageUrl: req.file.originalname,
      extractedText,
      sourceText: extractedText.slice(0, 5000),
      verdict,
      confidence,
      labels,
      explanation: 'OCR extracted text then scored via Hugging Face model',
      metadata: {
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });

    res.status(201).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, analyses });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      throw new AppError('Analysis not found', 404);
    }

    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};
