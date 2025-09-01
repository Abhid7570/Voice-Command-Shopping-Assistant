import express from 'express';
import { body, validationResult } from 'express-validator';
import { 
  processVoiceCommand, 
  getVoiceCommandHistory,
  getVoiceRecognitionStats 
} from '../controllers/voiceController.js';

const router = express.Router();

// Validation middleware
const validateVoiceCommand = [
  body('transcript').trim().isLength({ min: 2, max: 500 }).withMessage('Transcript must be between 2 and 500 characters'),
  body('language').isString().isLength({ min: 2, max: 10 }).withMessage('Language code must be between 2 and 10 characters'),
  body('confidence').optional().isFloat({ min: 0, max: 1 }).withMessage('Confidence must be between 0 and 1')
];

// Process voice command
router.post('/process', validateVoiceCommand, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { transcript, language, confidence } = req.body;
    const result = await processVoiceCommand(transcript, language, confidence);
    
    res.json({
      success: true,
      data: result,
      message: 'Voice command processed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get voice command history
router.get('/history', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0, language } = req.query;
    const history = await getVoiceCommandHistory(parseInt(limit), parseInt(offset), language);
    
    res.json({
      success: true,
      data: history,
      count: history.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get voice recognition statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getVoiceRecognitionStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Health check for voice service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Voice Recognition API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
