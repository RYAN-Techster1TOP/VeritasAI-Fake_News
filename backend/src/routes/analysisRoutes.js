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

router.use(protect);

router.post('/text', analyzeText);
router.post('/url', analyzeUrl);
router.post('/image', uploadImage, analyzeImage);
router.get('/history', getHistory);
router.get('/:id', getAnalysisById);

export default router;
