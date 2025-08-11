const express = require('express');
const engines = require('../config/engines');

const router = express.Router();

// GET /api/languages
router.get('/', (req, res) => {
  try {
    // Aggregate all unique languages from all engines
    const languageMap = new Map();
    
    Object.values(engines).forEach(engine => {
      engine.languages.forEach(lang => {
        if (!languageMap.has(lang.code)) {
          languageMap.set(lang.code, {
            code: lang.code,
            name: lang.name,
            variants: new Set(lang.variants),
            supportedEngines: []
          });
        }
        
        const existing = languageMap.get(lang.code);
        lang.variants.forEach(variant => existing.variants.add(variant));
        existing.supportedEngines.push(Object.keys(engines).find(key => engines[key] === engine));
      });
    });

    // Convert to array and format variants
    const languages = Array.from(languageMap.values()).map(lang => ({
      ...lang,
      variants: Array.from(lang.variants),
      supportedEngines: [...new Set(lang.supportedEngines)]
    })).sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: languages,
      count: languages.length,
      message: 'Supported languages retrieved successfully'
    });
  } catch (error) {
    console.error('Get Languages Error:', error);
    res.status(500).json({
      error: 'Failed to retrieve languages',
      message: error.message
    });
  }
});

// GET /api/languages/:engineName
router.get('/:engineName', (req, res) => {
  try {
    const { engineName } = req.params;
    const engine = engines[engineName];
    
    if (!engine) {
      return res.status(404).json({
        error: 'Engine not found',
        message: `Engine '${engineName}' is not supported`
      });
    }

    res.json({
      success: true,
      data: {
        engine: engineName,
        languages: engine.languages
      },
      count: engine.languages.length,
      message: `Languages for ${engine.name} retrieved successfully`
    });
  } catch (error) {
    console.error('Get Engine Languages Error:', error);
    res.status(500).json({
      error: 'Failed to retrieve engine languages',
      message: error.message
    });
  }
});

module.exports = router;
