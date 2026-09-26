import { Router } from 'express';
import {
  analyzeText,
  analyzeUrl,
  analyzeImage,
  getHistory,
  getAnalysisById,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/text', protect, analyzeText);
router.post('/url', protect, analyzeUrl);
router.post('/image', protect, uploadImage, analyzeImage);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getAnalysisById);

export default router;