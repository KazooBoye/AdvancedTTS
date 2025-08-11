const express = require('express');
const ttsService = require('../services/ttsService');

const router = express.Router();

// GET /api/engines
router.get('/', async (req, res) => {
  try {
    const engines = await ttsService.getAllAvailableEngines();
    
    res.json({
      success: true,
      data: engines,
      count: Object.keys(engines).length,
      message: 'Available TTS engines retrieved successfully'
    });
  } catch (error) {
    console.error('Get Engines Error:', error);
    res.status(500).json({
      error: 'Failed to retrieve engines',
      message: error.message
    });
  }
});

// GET /api/engines/:engineName/check
router.get('/:engineName/check', async (req, res) => {
  try {
    const { engineName } = req.params;
    const isAvailable = await ttsService.checkEngineAvailability(engineName);
    
    res.json({
      success: true,
      data: {
        engine: engineName,
        available: isAvailable
      },
      message: `Engine ${engineName} ${isAvailable ? 'is available' : 'is not available'}`
    });
  } catch (error) {
    console.error('Engine Check Error:', error);
    res.status(500).json({
      error: 'Failed to check engine availability',
      message: error.message
    });
  }
});

// GET /api/engines/:engineName/models/:language
router.get('/:engineName/models/:language?', async (req, res) => {
  try {
    const { engineName, language } = req.params;
    
    // Get engine configuration
    const engines = require('../config/engines');
    const engineConfig = engines[engineName];
    
    if (!engineConfig) {
      return res.status(404).json({
        error: 'Engine not found',
        message: `Engine ${engineName} is not available`
      });
    }

    // Check if engine supports models
    if (!engineConfig.supports?.models) {
      return res.json({
        success: true,
        data: {
          engine: engineName,
          modelsSupported: false,
          message: `Engine ${engineName} does not support model selection`
        }
      });
    }

    let availableModels = [];

    if (language) {
      // Get models for specific language
      const langConfig = engineConfig.languages.find(lang => 
        lang.code === language || lang.variants?.includes(language)
      );
      
      if (langConfig && langConfig.models) {
        availableModels = langConfig.models;
      }
    } else {
      // Get all models for all languages
      engineConfig.languages.forEach(lang => {
        if (lang.models) {
          availableModels = availableModels.concat(
            lang.models.map(model => ({
              ...model,
              languageCode: lang.code,
              languageName: lang.name
            }))
          );
        }
      });
    }

    res.json({
      success: true,
      data: {
        engine: engineName,
        language: language || 'all',
        models: availableModels,
        modelsSupported: true
      },
      count: availableModels.length,
      message: `Available models for ${engineName}${language ? ` (${language})` : ''} retrieved successfully`
    });
  } catch (error) {
    console.error('Get Models Error:', error);
    res.status(500).json({
      error: 'Failed to retrieve models',
      message: error.message
    });
  }
});

module.exports = router;
