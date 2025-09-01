import express from 'express';
import { getSupportedLanguages, getLanguageConfig, getTranslations } from '../controllers/languageController.js';

const router = express.Router();

// Get all supported languages
router.get('/', async (req, res, next) => {
  try {
    const languages = await getSupportedLanguages();
    res.json({
      success: true,
      data: languages,
      count: languages.length
    });
  } catch (error) {
    next(error);
  }
});

// Get specific language configuration
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const language = await getLanguageConfig(code);
    
    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found'
      });
    }

    res.json({
      success: true,
      data: language
    });
  } catch (error) {
    next(error);
  }
});

// Get translations for a specific language
router.get('/:code/translations', async (req, res, next) => {
  try {
    const { code } = req.params;
    const translations = await getTranslations(code);
    
    if (!translations) {
      return res.status(404).json({
        success: false,
        message: 'Translations not found for this language'
      });
    }

    res.json({
      success: true,
      data: translations,
      language: code
    });
  } catch (error) {
    next(error);
  }
});

// Health check for language service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Language API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
