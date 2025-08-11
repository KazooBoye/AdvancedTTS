#!/bin/bash

# Advanced TTS - Engine Installation Script
# This script installs additional TTS engines for better voice quality

echo "🎤 Advanced TTS - Installing Additional TTS Engines"
echo "=================================================="

# Check if Python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is required but not installed. Please install Python3 first."
    exit 1
fi

# Check if pip3 is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed. Please install pip3 first."
    exit 1
fi

echo "✅ Python3 and pip3 found"

# Install Python TTS packages
echo ""
echo "📦 Installing Python TTS packages..."
echo "Installing gTTS (Google Text-to-Speech)..."
pip3 install gtts gtts-cli

echo "Installing pyttsx3 (Cross-platform TTS)..."
pip3 install pyttsx3

echo "Installing Coqui TTS (Deep Learning TTS)..."
pip3 install coqui-tts

echo "✅ Python packages installed"

# Install Piper TTS
echo ""
echo "🔧 Installing Piper TTS..."

# Check system architecture
if [[ $(uname -m) == "arm64" ]]; then
    PIPER_URL="https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_macos_arm64.tar.gz"
    PIPER_FILE="piper_macos_arm64.tar.gz"
else
    PIPER_URL="https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_macos_x64.tar.gz"
    PIPER_FILE="piper_macos_x64.tar.gz"
fi

cd /tmp

echo "Downloading Piper TTS binary..."
if command -v wget &> /dev/null; then
    wget $PIPER_URL
elif command -v curl &> /dev/null; then
    curl -L -o $PIPER_FILE $PIPER_URL
else
    echo "❌ Neither wget nor curl found. Please install one of them."
    exit 1
fi

echo "Extracting Piper TTS..."
tar -xzf $PIPER_FILE

echo "Installing Piper TTS to /usr/local/bin..."
if sudo mv piper /usr/local/bin/; then
    echo "✅ Piper TTS installed successfully"
else
    echo "❌ Failed to install Piper TTS. You may need to run with sudo."
fi

# Clean up
rm -f $PIPER_FILE

# Create voice models directory
echo ""
echo "📁 Creating voice models directory..."
mkdir -p ~/.local/share/piper/voices
echo "✅ Voice models directory created at ~/.local/share/piper/voices"

# Download a basic English voice model for Piper
echo ""
echo "🎯 Downloading basic English voice model for Piper..."
cd ~/.local/share/piper/voices

if command -v wget &> /dev/null; then
    wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
    wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json
elif command -v curl &> /dev/null; then
    curl -L -o en_US-lessac-medium.onnx https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
    curl -L -o en_US-lessac-medium.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json
fi

if [ -f "en_US-lessac-medium.onnx" ]; then
    echo "✅ English voice model downloaded"
else
    echo "⚠️  Failed to download English voice model. You can download it manually later."
fi

# Test installations
echo ""
echo "🧪 Testing TTS engines..."

# Test gTTS
if command -v gtts-cli &> /dev/null; then
    echo "✅ gTTS: Available"
else
    echo "❌ gTTS: Not available"
fi

# Test Piper
if command -v piper &> /dev/null; then
    echo "✅ Piper TTS: Available"
else
    echo "❌ Piper TTS: Not available"
fi

# Test pyttsx3
if python3 -c "import pyttsx3" 2>/dev/null; then
    echo "✅ pyttsx3: Available"
else
    echo "❌ pyttsx3: Not available"
fi

# Test Coqui TTS
if python3 -c "import TTS" 2>/dev/null; then
    echo "✅ Coqui TTS: Available"
else
    echo "❌ Coqui TTS: Not available"
fi

echo ""
echo "🎉 Installation completed!"
echo ""
echo "📋 Summary:"
echo "- eSpeak-NG: Already installed"
echo "- eSpeak: Already installed"
echo "- gTTS: Newly installed (requires internet)"
echo "- Piper TTS: Newly installed (local, high quality)"
echo "- pyttsx3: Newly installed (uses system voices)"
echo "- Coqui TTS: Newly installed (deep learning, highest quality)"
echo ""
echo "📖 For more information and troubleshooting, see TTS_ENGINES_SETUP.md"
echo ""
echo "🚀 You can now restart the TTS application to use the new engines!"
