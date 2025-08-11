# Coqui TTS Models - Quick Reference

## Model Status Overview

| Language | Model | Status | Quality | Speakers | Notes |
|----------|-------|--------|---------|----------|-------|
| 🇺🇸 English | LJSpeech VITS | ✅ Working | High | 1 (Female) | Pre-installed |
| 🇺🇸 English | LJSpeech Tacotron2 | ✅ Working | Medium | 1 (Female) | Auto-download |
| 🇬🇧 English | VCTK Multi-Speaker | ✅ Working | High | 10 (Mixed) | Pre-installed |
| 🇪🇸 Spanish | MAI Spanish | ⚠️ Auto-fallback | High | 1 (Female) | Uses gTTS fallback |
| 🇫🇷 French | MAI French | ⚠️ Auto-fallback | High | 1 (Female) | Uses gTTS fallback |
| 🇩🇪 German | Thorsten German | ✅ Working | High | 1 (Male) | Auto-download |
| 🇮🇹 Italian | MAI Italian | ✅ Working | High | 1 (Female) | Auto-download |
| 🇵🇹 Portuguese | Common Voice | ✅ Working | Medium | 1 (Mixed) | Auto-download |
| 🇨🇳 Chinese | Baker Chinese | ✅ Working | High | 1 (Female) | Auto-download |
| 🇯🇵 Japanese | Kokoro Japanese | ⚠️ Auto-fallback | High | 1 (Female) | Uses gTTS fallback |

## Quick Commands

### Check Model Storage
```bash
ls -la "~/Library/Application Support/tts/"
```

### Check Storage Usage  
```bash
du -sh "~/Library/Application Support/tts/"
```

### Test Model Loading
```bash
python3 -c "from TTS.api import TTS; TTS(model_name='tts_models/en/ljspeech/vits')"
```

### Download Specific Model
```bash
python3 -c "from TTS.api import TTS; TTS(model_name='tts_models/LANGUAGE/DATASET/MODEL')"
```

### Clear Model Cache
```bash
rm -rf "~/Library/Application Support/tts/"
```

## API Endpoints

### List All Models
```bash
curl "http://localhost:5001/api/engines/coqui/models"
```

### List Models for Language
```bash
curl "http://localhost:5001/api/engines/coqui/models/en"
```

### Synthesize with Model
```bash
curl -X POST "http://localhost:5001/api/tts/synthesize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "engine": "coqui", 
    "language": "en",
    "model": "ljspeech-vits",
    "format": "mp3"
  }'
```

### Multi-Speaker Synthesis
```bash
curl -X POST "http://localhost:5001/api/tts/synthesize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "engine": "coqui",
    "language": "en", 
    "model": "vctk-vits",
    "speaker": "p225",
    "format": "mp3"
  }'
```

## Performance Notes

- **Synthesis Time**: 15 seconds - 5 minutes depending on text length
- **Storage**: ~100-200MB per model
- **Memory**: 2-4GB RAM during synthesis
- **Quality**: Neural models provide highest quality but slower synthesis

## Troubleshooting

### Model Not Loading
1. Check internet connection
2. Clear model cache: `rm -rf "~/Library/Application Support/tts/"`
3. Re-download model manually

### French/Spanish/Japanese Model Issues
- These models have PyTorch compatibility issues
- System automatically falls back to eSpeak-NG for seamless experience
- May require TTS/PyTorch version updates to fix

### Auto-Fallback Behavior
When Coqui models fail to load, the system automatically uses eSpeak-NG:
- Spanish → eSpeak-NG Spanish voice
- French → eSpeak-NG French voice
- Japanese → eSpeak-NG Japanese voice
- User still gets speech output without errors

### Out of Memory
1. Reduce text length
2. Close other applications
3. Use lighter models (Tacotron2 vs VITS)

## Model Configuration

Models are configured in `server/config/engines.js`. See `docs/COQUI_TTS_MODELS.md` for detailed configuration information.

---
For complete documentation, see: `docs/COQUI_TTS_MODELS.md`
