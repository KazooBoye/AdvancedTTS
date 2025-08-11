const express = require('express');
const rateLimit = require('express-rate-limit');
const ttsService = require('../services/ttsService');

const router = express.Router();

// Rate limiting for TTS synthesis
const synthesisLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 synthesis requests per minute
  message: {
    error: 'Too many synthesis requests, please try again later.'
  }
});

// POST /api/tts/synthesize
router.post('/synthesize', synthesisLimiter, async (req, res) => {
  try {
    const {
      text,
      engine = 'espeak-ng',
      language = 'en',
      speed = 150,
      pitch = 50,
      volume = 100,
      format = 'mp3',
      model = null,
      speaker = null
    } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    if (text.length > 50000) {
      return res.status(400).json({
        error: 'Text is too long. Maximum length is 50,000 characters.'
      });
    }

    // Validate parameters
    if (speed < 50 || speed > 300) {
      return res.status(400).json({
        error: 'Speed must be between 50 and 300'
      });
    }

    if (pitch < 0 || pitch > 100) {
      return res.status(400).json({
        error: 'Pitch must be between 0 and 100'
      });
    }

    if (volume < 0 || volume > 100) {
      return res.status(400).json({
        error: 'Volume must be between 0 and 100'
      });
    }

    const validFormats = ['mp3', 'wav', 'ogg', 'm4a'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({
        error: `Format must be one of: ${validFormats.join(', ')}`
      });
    }

    console.log(`🎵 Synthesizing speech: ${text.substring(0, 50)}... (${engine}, ${language}${model ? `, model: ${model}` : ''}${speaker ? `, speaker: ${speaker}` : ''})`);

    const result = await ttsService.synthesizeSpeech(text, {
      engine,
      language,
      speed,
      pitch,
      volume,
      format,
      model,
      speaker
    });

    res.json({
      success: true,
      data: result,
      message: 'Speech synthesized successfully'
    });

  } catch (error) {
    console.error('TTS Synthesis Error:', error);
    
    res.status(500).json({
      error: 'Failed to synthesize speech',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET /api/tts/status/:id
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // This could be extended to check processing status for long texts
    res.json({
      success: true,
      data: {
        id,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Status Check Error:', error);
    res.status(500).json({
      error: 'Failed to check status',
      message: error.message
    });
  }
});

// POST /api/tts/preview
router.post('/preview', async (req, res) => {
  try {
    const {
      text,
      engine = 'espeak-ng',
      language = 'en',
      speed = 150,
      pitch = 50,
      volume = 100
    } = req.body;

    // For preview, limit text length and use WAV format for faster processing
    const previewText = text.substring(0, 200);
    
    if (!previewText || previewText.trim().length === 0) {
      return res.status(400).json({
        error: 'Text is required for preview'
      });
    }

    console.log(`🔊 Generating preview: ${previewText}... (${engine}, ${language})`);

    const result = await ttsService.synthesizeSpeech(previewText, {
      engine,
      language,
      speed,
      pitch,
      volume,
      format: 'wav' // Use WAV for faster preview generation
    });

    res.json({
      success: true,
      data: {
        ...result,
        isPreview: true,
        originalTextLength: text.length,
        previewTextLength: previewText.length
      },
      message: 'Preview generated successfully'
    });

  } catch (error) {
    console.error('Preview Generation Error:', error);
    
    res.status(500).json({
      error: 'Failed to generate preview',
      message: error.message
    });
  }
});

module.exports = router;
