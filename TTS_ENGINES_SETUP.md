# TTS Engines Setup Guide

**🎯 Note: This guide provides manual installation instructions. The project's automated setup script (`scripts/setup.sh`) handles most installations automatically.**

This guide explains the TTS engines available in the Advanced TTS application and how to manually configure them if needed.

## Current Engine Status

### ✅ Primary Engines (Auto-configured)

### 1. **Coqui TTS** (Primary Engine)
- **Status**: ✅ Integrated with dynamic fallback
- **Installation**: Automated via setup script (`pip3 install coqui-tts`)
- **Languages**: 15+ languages with neural models
- **Voice Quality**: ⭐⭐⭐⭐⭐ Neural, highest quality
- **Fallback**: Automatically falls back to gTTS on compatibility issues

### 2. **Google TTS (gTTS)** (Fallback Engine)
- **Status**: ✅ Integrated as intelligent fallback
- **Installation**: Automated via setup script (`pip3 install gtts`)
- **Languages**: 60+ languages with neural voices
- **Voice Quality**: ⭐⭐⭐⭐⭐ Neural, very natural
- **Network**: Requires internet connection

### 3. **eSpeak-NG** (Multi-language Champion)
- **Status**: ✅ Working, auto-installed
- **Installation**: Already configured via Homebrew/apt
- **Languages**: 50+ languages including Vietnamese
- **Voice Quality**: ⭐⭐⭐ Basic, robotic but clear

### 4. **eSpeak** (Classic Reliable)
- **Status**: ✅ Working, auto-installed  
- **Installation**: Already configured via Homebrew/apt
- **Languages**: 40+ languages
- **Voice Quality**: ⭐⭐⭐ Basic, similar to eSpeak-NG

### 5. **pyttsx3** (System Voices)
- **Status**: ✅ Working, auto-installed
- **Installation**: Already configured via pip3
- **Languages**: Depends on system voices (typically 10+ languages)
- **Voice Quality**: ⭐⭐⭐ System-dependent

### ⚙️ Additional Engines (Configurable)

The following engines are configured but require additional setup:

### 6. **Festival** (High-Quality Synthesis)
- **Status**: ⚙️ Configured but not installed
- **Installation**: `brew install festival` (macOS) or `apt-get install festival` (Linux)
- **Languages**: Limited but high-quality English
- **Voice Quality**: ⭐⭐⭐⭐ High-quality synthesis

### 7. **Pico TTS** (Compact & Efficient)
- **Status**: ⚙️ Configured but not installed (Linux only)
- **Installation**: `apt-get install pico-utils` (Linux only)
- **Languages**: Limited selection
- **Voice Quality**: ⭐⭐⭐ Compact, efficient

### 8. **Piper TTS** (Neural Local)
- **Status**: ⚙️ Configured but requires voice models
- **Installation**: Binary auto-installed by setup script, models need download
- **Languages**: 20+ languages with high-quality voices
- **Voice Quality**: ⭐⭐⭐⭐⭐ Neural, very natural, local processing

## 🔧 Automatic Setup

**Recommended**: Use the automated setup script which handles all installations:

```bash
# Run the comprehensive setup
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will:
- ✅ Install all TTS engines for your platform
- ✅ Configure Python dependencies (Coqui, gTTS, pyttsx3)
- ✅ Set up FFmpeg for audio conversion
- ✅ Create required directories
- ✅ Configure environment variables
- ✅ Test all engines

**Current Status**: 5 engines working out-of-the-box, 3 additional engines available with manual setup.

## 🛠️ Manual Installation (Advanced Users)

Only needed if the automated setup script fails or you want to customize installations:

### Python TTS Engines
```bash
# Install Python TTS packages (if not done by setup script)
pip3 install gtts coqui-tts torch torchaudio
```

### Piper Voice Models (Optional)
```bash
# Create voice models directory
mkdir -p ~/.local/share/piper/voices
cd ~/.local/share/piper/voices

# Download popular English model
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json
```

## 🎛️ Engine Selection Strategy

The application uses intelligent engine selection:

1. **Primary**: Tries Coqui TTS for highest quality
2. **Fallback**: Automatically switches to gTTS if Coqui has compatibility issues
3. **Traditional**: Uses eSpeak-NG, Festival, Pico for basic needs
4. **User Choice**: Manual engine selection available in UI

## 🔄 Dynamic Fallback System

The application features an advanced fallback mechanism:

- **Pattern Detection**: Monitors for PyTorch compatibility errors
- **Automatic Switch**: Seamlessly falls back to gTTS
- **User Notification**: Informs users when fallback is triggered
- **Quality Maintenance**: Ensures neural voice quality even in fallback

## 🚨 Troubleshooting

### Engine Not Available
- **Solution**: Run `./scripts/setup.sh` to reinstall
- **Check**: Visit `http://localhost:5001/api/engines` to see available engines

### Coqui TTS Failing
- **Expected**: System will automatically fallback to gTTS
- **Manual Test**: Try different Coqui models or languages

### No Audio Output
- **Check**: FFmpeg installation (`which ffmpeg`)
- **Solution**: Run setup script or install FFmpeg manually

### Permission Errors
```bash
# Fix audio directory permissions
chmod 755 server/output server/temp server/cache
```

## 🎯 Performance Notes

**Currently Active Engines:**

| Engine | Quality | Speed | Network | Best For |
|--------|---------|-------|---------|----------|
| **Coqui TTS** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Offline | Highest quality |
| **gTTS** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Online | Fallback, reliability |
| **eSpeak-NG** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Offline | Multi-language |
| **eSpeak** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Offline | Classic reliability |
| **pyttsx3** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Offline | System voices |

**Optional Engines (require setup):**

| Engine | Quality | Speed | Network | Installation |
|--------|---------|-------|---------|--------------|
| **Piper** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Offline | Voice models needed |
| **Festival** | ⭐⭐⭐⭐ | ⭐⭐⭐ | Offline | Manual install required |
| **Pico** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Offline | Linux only |

The application intelligently selects the best available engine and handles fallbacks automatically.
