# TTS Engines Setup Guide

This guide explains how to install and configure various TTS engines for the Advanced TTS application.

## Currently Installed Engines

### 1. eSpeak-NG (✅ Installed)
- **Status**: Working
- **Installation**: Already installed via Homebrew
- **Languages**: 50+ languages including Vietnamese
- **Voice Quality**: Basic, robotic but clear

### 2. eSpeak (✅ Installed)
- **Status**: Working  
- **Installation**: Already installed via Homebrew
- **Languages**: 40+ languages
- **Voice Quality**: Basic, similar to eSpeak-NG

## New Engines to Install

### 3. Google TTS (gTTS)
- **Voice Quality**: Natural, high-quality
- **Languages**: 60+ languages with neural voices
- **Installation**:
```bash
# Install Python package
pip3 install gtts

# Install command-line tool
pip3 install gtts-cli
```
- **Test**:
```bash
gtts-cli --text "Hello world" --lang en --output test.mp3
```

### 4. Piper TTS
- **Voice Quality**: Neural, very natural
- **Languages**: 20+ languages with high-quality voices
- **Installation**:
```bash
# Download Piper binary for macOS
wget https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_macos_x64.tar.gz
tar -xzf piper_macos_x64.tar.gz
sudo mv piper /usr/local/bin/

# Download voice models (example for English)
mkdir -p ~/.local/share/piper/voices
cd ~/.local/share/piper/voices
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json
```
- **Test**:
```bash
echo "Hello world" | piper --model en_US-lessac-medium.onnx --output_file test.wav
```

### 5. pyttsx3
- **Voice Quality**: System voices (varies by OS)
- **Languages**: Depends on system voices
- **Installation**:
```bash
pip3 install pyttsx3
```
- **Test**:
```python
import pyttsx3
engine = pyttsx3.init()
engine.say("Hello world")
engine.runAndWait()
```

### 6. Coqui TTS
- **Voice Quality**: Deep learning, very natural
- **Languages**: 15+ languages with neural models
- **Installation**:
```bash
pip3 install coqui-tts
```
- **Test**:
```bash
tts --text "Hello world" --model_name "tts_models/en/ljspeech/tacotron2-DDC" --out_path test.wav
```

## Installation Script

Run this script to install all new TTS engines:

```bash
#!/bin/bash

echo "Installing TTS engines..."

# Install Python packages
echo "Installing Python TTS packages..."
pip3 install gtts gtts-cli pyttsx3 coqui-tts

# Install Piper TTS
echo "Installing Piper TTS..."
cd /tmp
wget https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_macos_x64.tar.gz
tar -xzf piper_macos_x64.tar.gz
sudo mv piper /usr/local/bin/
rm piper_macos_x64.tar.gz

# Create voice models directory
mkdir -p ~/.local/share/piper/voices

echo "TTS engines installation completed!"
echo "Note: You may need to download specific voice models for Piper TTS"
```

## Voice Models for Piper

Piper TTS requires voice models for each language. Download them from:
https://huggingface.co/rhasspy/piper-voices

### Popular Models:
- **English**: `en_US-lessac-medium.onnx`
- **Spanish**: `es_ES-mav-medium.onnx`
- **French**: `fr_FR-gille-medium.onnx`
- **German**: `de_DE-thorsten-medium.onnx`
- **Italian**: `it_IT-riccardo-medium.onnx`

## Troubleshooting

### Common Issues:

1. **Command not found**: Make sure the binary is in your PATH
2. **Permission denied**: Use `sudo` for system-wide installation
3. **Missing dependencies**: Install required Python packages
4. **Voice model not found**: Download the specific model for your language

### Testing Individual Engines:

```bash
# Test gTTS
gtts-cli --text "Test" --lang en --output test_gtts.mp3

# Test Piper (requires model)
echo "Test" | piper --model path/to/model.onnx --output_file test_piper.wav

# Test Coqui
tts --text "Test" --model_name "tts_models/en/ljspeech/tacotron2-DDC" --out_path test_coqui.wav

# Test pyttsx3 (Python script)
python3 -c "import pyttsx3; engine = pyttsx3.init(); engine.save_to_file('Test', 'test_pyttsx3.wav'); engine.runAndWait()"
```

## Configuration

The application will automatically detect available engines. Make sure:

1. All binaries are in your PATH
2. Required Python packages are installed
3. Voice models are downloaded (for Piper)
4. Permissions are set correctly

## Performance Notes

- **gTTS**: Requires internet connection
- **Piper**: Fast, local processing
- **pyttsx3**: Uses system voices, fast
- **Coqui**: Slower but highest quality
- **eSpeak/eSpeak-NG**: Fastest, basic quality

Choose the appropriate engine based on your quality and speed requirements.
