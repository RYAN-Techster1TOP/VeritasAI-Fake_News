import { Analysis } from '../models/Analysis.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { analyzeTextContent } from '../services/huggingfaceService.js';
import { extractTextFromImage } from '../services/ocrService.js';
import { fetchArticleText } from '../services/urlService.js';

const mapVerdict = (labels = []) => {
  if (!labels || !labels.length) {
    return { verdict: 'uncertain', confidence: 0 };
  }

  const top = labels[0];
  const label = String(top.label || '').toLowerCase();
  const confidence = Number(top.score) || 0;

  if (
    label.includes('fake') ||
    label.includes('hate') ||
    label.includes('toxic') ||
    label.includes('unreliable') ||
    label.includes('false') ||
    label === 'label_0'
  ) {
    return { verdict: 'fake', confidence: Math.min(Math.max(confidence, 0), 1) };
  }

  if (
    label.includes('real') ||
    label.includes('true') ||
    label.includes('neutral') ||
    label.includes('reliable') ||
    label.includes('non-hate') ||
    label === 'label_1'
  ) {
    return { verdict: 'real', confidence: Math.min(Math.max(confidence, 0), 1) };
  }

  return { verdict: 'uncertain', confidence: Math.min(Math.max(confidence, 0), 1) };
};

export const analyzeText = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      throw new AppError('Text content is required for analysis', 400);
    }

    const labels = await analyzeTextContent(text.trim());
    const { verdict, confidence } = mapVerdict(labels);

    const topLabel = labels[0]?.label || 'n/a';
    const explanation =
      verdict === 'fake'
        ? `Model detected indicators of fabricated or misleading material (signal: ${topLabel}).`
        : verdict === 'real'
        ? `Model detected indicators consistent with credible reporting (signal: ${topLabel}).`
        : `Model signals are inconclusive. Cross-referencing recommended (signal: ${topLabel}).`;

    const analysis = await Analysis.create({
      user: req.user._id,
      inputType: 'text',
      sourceText: text.trim(),
      verdict,
      confidence,
      labels,
      explanation,
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
      throw new AppError('Article URL is required', 400);
    }

    const articleText = await fetchArticleText(url.trim());
    const labels = await analyzeTextContent(articleText);
    const { verdict, confidence } = mapVerdict(labels);

    const topLabel = labels[0]?.label || 'n/a';
    const explanation = `Scraped and analyzed extracted article body from URL. Model signal: ${topLabel}.`;

    const analysis = await Analysis.create({
      user: req.user._id,
      inputType: 'url',
      sourceUrl: url.trim(),
      sourceText: articleText.slice(0, 5000),
      verdict,
      confidence,
      labels,
      explanation,
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
      throw new AppError('No readable text could be extracted from the uploaded image', 422);
    }

    const labels = await analyzeTextContent(extractedText);
    const { verdict, confidence } = mapVerdict(labels);

    const topLabel = labels[0]?.label || 'n/a';
    const explanation = `OCR extracted text and analyzed content. Model signal: ${topLabel}.`;

    const analysis = await Analysis.create({
      user: req.user._id,
      inputType: 'image',
      imageUrl: req.file.originalname,
      extractedText,
      sourceText: extractedText.slice(0, 5000),
      verdict,
      confidence,
      labels,
      explanation,
      metadata: {
        originalName: req.file.originalname,
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

    res.json({ success: true, count: analyses.length, analyses });
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
      throw new AppError('Analysis record not found', 404);
    }

    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};
