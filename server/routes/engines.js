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

module.exports = router;
