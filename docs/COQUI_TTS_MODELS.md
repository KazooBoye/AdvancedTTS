# Coqui TTS Models Documentation

## Overview

This document provides comprehensive information about Coqui TTS models in the AdvancedTTS system, including installation, management, configuration, and troubleshooting.

## Table of Contents

1. [Model Overview](#model-overview)
2. [Installation Process](#installation-process)
3. [Model Configuration](#model-configuration)
4. [Model Status](#model-status)
5. [Adding New Models](#adding-new-models)
6. [Troubleshooting](#troubleshooting)
7. [Model Management](#model-management)
8. [Performance Considerations](#performance-considerations)

## Model Overview

Coqui TTS supports neural text-to-speech models with high-quality voice synthesis. The AdvancedTTS system includes models for multiple languages with both single-speaker and multi-speaker capabilities.

### Supported Languages

- **English**: 3 models (including multi-speaker)
- **Spanish**: 1 model
- **French**: 1 model
- **German**: 1 model
- **Italian**: 1 model
- **Portuguese**: 1 model
- **Chinese**: 1 model
- **Japanese**: 1 model (with known issues)

### Model Types

1. **Single-Speaker Models**: One voice per model
2. **Multi-Speaker Models**: Multiple voice options (e.g., VCTK with 10 speakers)
3. **Quality Levels**: High, Medium (indicated in UI)

## Installation Process

### Automatic Installation

The system automatically downloads models when first accessed through the API. Models are cached locally for future use.

### Manual Installation

For bulk downloading or pre-installation:

```bash
python3 -c "
from TTS.api import TTS

# List of models to download
models_to_download = [
    'tts_models/en/ljspeech/vits',
    'tts_models/en/ljspeech/tacotron2-DDC',
    'tts_models/en/vctk/vits',
    'tts_models/es/mai/tacotron2-DDC',
    'tts_models/fr/mai/tacotron2-DDC',
    'tts_models/de/thorsten/vits',
    'tts_models/it/mai_female/vits',
    'tts_models/pt/cv/vits',
    'tts_models/zh-CN/baker/tacotron2-DDC-GST',
    'tts_models/ja/kokoro/tacotron2-DDC'
]

for model_name in models_to_download:
    print(f'Downloading {model_name}...')
    try:
        tts = TTS(model_name=model_name)
        print(f'✅ {model_name} ready')
    except Exception as e:
        print(f'❌ Failed to download {model_name}: {e}')
        
print('Model download complete!')
"
```

### Storage Location

Models are stored in:
```
~/Library/Application Support/tts/
```

Example structure:
```
tts_models--en--ljspeech--vits/
tts_models--en--vctk--vits/
tts_models--fr--mai--tacotron2-DDC/
vocoder_models--universal--libri-tts--fullband-melgan/
```

## Model Configuration

### Configuration File Location

Models are configured in `server/config/engines.js` under the `coqui` engine section.

### Model Configuration Structure

```javascript
{
  code: 'en', 
  name: 'English', 
  variants: ['en-us', 'en-gb'],
  models: [
    {
      id: 'ljspeech-vits',                    // Unique identifier
      name: 'LJSpeech VITS',                  // Display name
      description: 'High-quality female voice trained on LJSpeech dataset',
      model_name: 'tts_models/en/ljspeech/vits',  // Coqui model path
      language: 'en-us',                      // Language variant
      speaker: 'female',                     // Speaker type
      quality: 'high',                       // Quality indicator
      speakers: ['p225', 'p226', '...']      // For multi-speaker models
    }
  ]
}
```

### Multi-Speaker Model Configuration

```javascript
{
  id: 'vctk-vits',
  name: 'VCTK Multi-Speaker',
  description: 'Multi-speaker English model with voice selection',
  model_name: 'tts_models/en/vctk/vits',
  language: 'en-gb',
  speaker: 'multi',
  quality: 'high',
  speakers: ['p225', 'p226', 'p227', 'p228', 'p229', 'p230', 'p231', 'p232', 'p233', 'p234']
}
```

## Model Status

### Currently Working Models (9/10)

## Model Status Overview

| Language | Model | Status | Quality | Speakers | Notes |
|----------|-------|--------|---------|----------|-------|
| 🇺🇸 English | LJSpeech VITS | ✅ Working | High | 1 (Female) | Default model |
| 🇺🇸 English | LJSpeech Tacotron2 | ✅ Working | Medium | 1 (Female) | Alternative |
| 🇬🇧 English | VCTK Multi-Speaker | ✅ Working | High | 10 (Mixed) | Multi-speaker |
| 🇪🇸 Spanish | MAI Spanish | ⚠️ Auto-fallback | High | 1 (Female) | Falls back to gTTS |
| 🇫🇷 French | MAI French | ⚠️ Auto-fallback | High | 1 (Female) | Falls back to gTTS |
| 🇩🇪 German | Thorsten German | ✅ Working | High | 1 (Male) | Available |
| 🇮🇹 Italian | MAI Italian | ✅ Working | High | 1 (Female) | Available |
| 🇵🇹 Portuguese | Common Voice | ✅ Working | Medium | 1 (Mixed) | Available |
| 🇨🇳 Chinese | Baker Chinese | ✅ Working | High | 1 (Female) | Available |
| 🇯🇵 Japanese | Kokoro Japanese | ⚠️ Auto-fallback | High | 1 (Female) | Falls back to gTTS |

**Note**: Models marked with ⚠️ Auto-fallback have PyTorch compatibility issues and automatically use gTTS (Google Text-to-Speech) as a fallback engine for better user experience.

### Known Issues

**Japanese Model (tts_models/ja/kokoro/tacotron2-DDC)**:
- **Issue**: PyTorch compatibility problem
- **Error**: `WeightsUnpickler error: Unsupported class TTS.utils.radam.RAdam`
- **Status**: Downloaded but not functional
- **Workaround**: May require TTS/PyTorch version updates

## Adding New Models

### Step 1: Find Available Models

```python
from TTS.api import TTS
print(TTS.list_models())
```

### Step 2: Test Model Compatibility

```python
from TTS.api import TTS
try:
    tts = TTS(model_name='tts_models/new/model/path')
    print("Model is compatible")
except Exception as e:
    print(f"Model issue: {e}")
```

### Step 3: Add to Configuration

Add model entry to `server/config/engines.js`:

```javascript
{
  id: 'new-model-id',
  name: 'New Model Name',
  description: 'Description of the model',
  model_name: 'tts_models/new/model/path',
  language: 'language-code',
  speaker: 'speaker-type',
  quality: 'high|medium|low'
}
```

### Step 4: Test API Integration

```bash
curl "http://localhost:5001/api/engines/coqui/models/language-code"
```

### Step 5: Test Synthesis

```bash
curl -X POST "http://localhost:5001/api/tts/synthesize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test synthesis",
    "engine": "coqui",
    "language": "language-code",
    "model": "new-model-id",
    "format": "mp3"
  }'
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Model Download Failures

**Symptoms**: API returns empty models array
**Solution**: 
```bash
# Check internet connection
# Manually download model
python3 -c "from TTS.api import TTS; TTS(model_name='model_path')"
```

#### 2. PyTorch Compatibility Issues

**Symptoms**: `WeightsUnpickler error` or similar PyTorch errors
**Solutions**:
```bash
# Update PyTorch
pip install --upgrade torch torchaudio

# Update Coqui TTS
pip install --upgrade coqui-tts

# Use weights_only=False (security risk)
# This is handled automatically in newer versions
```

#### 3. Language Dependencies Missing

**Symptoms**: Language-specific model failures
**Solutions**:
```bash
# Install language-specific dependencies
pip install "coqui-tts[ja]"  # For Japanese
pip install "coqui-tts[zh]"  # For Chinese
pip install "coqui-tts[ar]"  # For Arabic
```

#### 4. Memory Issues

**Symptoms**: Out of memory errors during synthesis
**Solutions**:
- Reduce text length
- Use smaller/faster models
- Increase system memory
- Use model-specific optimizations

#### 5. Model Cache Issues

**Symptoms**: Old/corrupted model files
**Solutions**:
```bash
# Clear model cache
rm -rf "~/Library/Application Support/tts/"

# Re-download models
python3 -c "from TTS.api import TTS; TTS(model_name='model_path')"
```

### Debugging Commands

#### Check Available Models
```bash
python3 -c "from TTS.api import TTS; print(TTS.list_models())"
```

#### Check Model Storage
```bash
ls -la "~/Library/Application Support/tts/"
```

#### Test Model Loading
```python
from TTS.api import TTS
try:
    tts = TTS(model_name='tts_models/en/ljspeech/vits')
    audio = tts.tts(text="Hello world")
    print("Model working correctly")
except Exception as e:
    print(f"Model error: {e}")
```

#### Check API Endpoints
```bash
# List engines
curl "http://localhost:5001/api/engines"

# List models for Coqui
curl "http://localhost:5001/api/engines/coqui/models"

# List models for specific language
curl "http://localhost:5001/api/engines/coqui/models/en"
```

## Model Management

### Model Storage Management

#### Check Storage Usage
```bash
du -sh "~/Library/Application Support/tts/"
```

#### Remove Unused Models
```bash
# Remove specific model
rm -rf "~/Library/Application Support/tts/tts_models--language--model"

# Remove all models (will re-download as needed)
rm -rf "~/Library/Application Support/tts/"
```

#### Backup Models
```bash
# Create backup
tar -czf tts_models_backup.tar.gz "~/Library/Application Support/tts/"

# Restore backup
tar -xzf tts_models_backup.tar.gz -C "~/Library/Application Support/"
```

### Model Update Process

1. **Check for new models**: Regularly check TTS.list_models()
2. **Test compatibility**: Test new models before adding to config
3. **Update configuration**: Add working models to engines.js
4. **Update documentation**: Document new models and any special requirements

## Performance Considerations

### Model Performance Characteristics

| Model Type | Speed | Quality | Memory Usage | Typical Use Case |
|------------|-------|---------|--------------|------------------|
| Tacotron2 | Medium | High | Medium | General purpose |
| VITS | Fast | High | Low | Real-time applications |
| Multi-speaker | Slow | High | High | Voice variety needed |

### Optimization Tips

1. **Model Selection**: Choose appropriate model for use case
2. **Text Length**: Shorter texts synthesize faster
3. **Caching**: Keep frequently used models in cache
4. **Memory Management**: Monitor memory usage for long texts
5. **Concurrent Synthesis**: Limit concurrent synthesis requests

### Synthesis Time Estimates

- **Short text (< 50 chars)**: 5-15 seconds
- **Medium text (50-200 chars)**: 15-60 seconds  
- **Long text (200+ chars)**: 1-5 minutes
- **Multi-speaker models**: +50% additional time

## API Integration

### Frontend Integration

The frontend automatically:
1. Loads available models when Coqui engine is selected
2. Shows model selection dropdown with quality indicators
3. Displays speaker selection for multi-speaker models
4. Handles model/speaker parameter passing to API

### Backend Integration

The backend:
1. Serves model lists via `/api/engines/coqui/models` endpoint
2. Accepts model/speaker parameters in synthesis requests
3. Automatically downloads models on first use
4. Handles model loading and caching

## Security Considerations

### Model Source Trust

- Models are downloaded from official Coqui TTS repositories
- Models contain PyTorch weights that execute code during loading
- Only use models from trusted sources
- Consider network restrictions for model downloads

### Model File Permissions

```bash
# Set appropriate permissions for model directory
chmod 755 "~/Library/Application Support/tts/"
chmod 644 "~/Library/Application Support/tts/"*/*
```

## Future Enhancements

### Planned Features

1. **Dynamic Model Management**: Install/uninstall models via UI
2. **Model Performance Monitoring**: Track synthesis times and quality
3. **Custom Model Support**: Add user-provided models
4. **Model Compression**: Optimize model storage and loading
5. **Batch Processing**: Handle multiple synthesis requests efficiently

### Model Roadmap

1. **Short Term**: Fix Japanese model compatibility
2. **Medium Term**: Add more language variants
3. **Long Term**: Support custom model training and deployment

---

**Last Updated**: August 11, 2025  
**Version**: 1.0  
**Maintainer**: AdvancedTTS Development Team
