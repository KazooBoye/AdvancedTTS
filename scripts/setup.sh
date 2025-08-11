#!/bin/bash

# Advanced TTS Setup Script
# This script installs the required TTS engines for the application

echo "🚀 Setting up Advanced TTS Application..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

#     echo "🔧 Available TTS features:"
    echo "   • Multiple TTS engines (Coqui, gTTS, eSpeak-NG, eSpeak, pyttsx3)"
    echo "   • Dynamic fallback to gTTS for compatibility issues"
    echo "   • Multilingual support with voice selection"
    echo "   • Audio format conversion (WAV, MP3, OGG)"
    echo "   • Real-time synthesis with progress tracking"ho "🔧 Available TTS features:"unction to install packages on different systems
install_tts_engines() {
    echo "📦 Installing TTS engines and dependencies..."
    
    # Check for FFmpeg first (required for audio conversion)
    if ! command_exists ffmpeg; then
        echo "🎵 Installing FFmpeg..."
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command_exists apt-get; then
                sudo apt-get install -y ffmpeg
            elif command_exists yum; then
                sudo yum install -y ffmpeg
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            if command_exists brew; then
                brew install ffmpeg
            fi
        fi
        
        if command_exists ffmpeg; then
            echo "✅ FFmpeg installed successfully"
        else
            echo "⚠️  FFmpeg installation failed - audio conversion may not work"
        fi
    else
        echo "✅ FFmpeg already installed"
    fi
    
    # Check for Python and pip (required for Coqui TTS)
    if command_exists python3 && command_exists pip3; then
        echo "✅ Python3 and pip3 already available"
        echo "📦 Installing Python TTS dependencies..."
        pip3 install --user gtts coqui-tts torch torchaudio
        echo "✅ Python TTS packages installed"
    else
        echo "⚠️  Python3/pip3 not found - Coqui TTS models may not work"
        echo "   Please install Python 3.8+ and pip3 manually"
    fi
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux (Ubuntu/Debian)
        echo "🐧 Detected Linux system"
        
        if command_exists apt-get; then
            echo "📥 Installing packages with apt-get..."
            sudo apt-get update
            sudo apt-get install -y espeak espeak-ng festival festival-dev pico-utils alsa-utils
            
            # Install additional language data
            sudo apt-get install -y espeak-ng-data
            
            echo "✅ Linux packages installed successfully"
        elif command_exists yum; then
            echo "📥 Installing packages with yum..."
            sudo yum install -y espeak espeak-ng festival festival-devel
            echo "✅ RHEL/CentOS packages installed successfully"
        else
            echo "❌ Unsupported Linux distribution"
            exit 1
        fi
        
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "🍎 Detected macOS system"
        
        if command_exists brew; then
            echo "📥 Installing packages with Homebrew..."
            brew install espeak espeak-ng festival
            echo "✅ macOS packages installed successfully"
        else
            echo "❌ Homebrew not found. Please install Homebrew first:"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
        
    else
        echo "❌ Unsupported operating system: $OSTYPE"
        echo "📖 Please install the following TTS engines manually:"
        echo "   - espeak"
        echo "   - espeak-ng"
        echo "   - festival"
        echo "   - pico-utils (Linux only)"
        exit 1
    fi
}

# Function to verify installations
verify_installations() {
    echo "🔍 Verifying TTS engine installations..."
    
    engines=("espeak" "espeak-ng" "festival")
    all_good=true
    
    for engine in "${engines[@]}"; do
        if command_exists "$engine"; then
            echo "✅ $engine: installed"
        else
            echo "❌ $engine: not found"
            all_good=false
        fi
    done
    
    # Check FFmpeg
    if command_exists ffmpeg; then
        echo "✅ ffmpeg: installed"
    else
        echo "❌ ffmpeg: not found (required for audio conversion)"
        all_good=false
    fi
    
    # Check Python dependencies
    if command_exists python3; then
        echo "✅ python3: installed"
        python3 -c "import gtts, TTS" 2>/dev/null && echo "✅ Python TTS packages: installed" || echo "⚠️  Python TTS packages: missing"
    else
        echo "❌ python3: not found"
        all_good=false
    fi
    
    # Check pico on Linux
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command_exists pico2wave; then
            echo "✅ pico2wave: installed"
        else
            echo "❌ pico2wave: not found"
            all_good=false
        fi
    fi
    
    if [ "$all_good" = true ]; then
        echo "🎉 All TTS engines installed successfully!"
    else
        echo "⚠️  Some TTS engines are missing. The application will work with available engines and fallback to gTTS when needed."
    fi
}

# Function to test TTS engines
test_engines() {
    echo "🧪 Testing TTS engines..."
    
    test_text="Hello, this is a test of the text to speech engine."
    
    # Test espeak-ng
    if command_exists espeak-ng; then
        echo "Testing espeak-ng..."
        espeak-ng -v en "$test_text" --stdout > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✅ espeak-ng: working"
        else
            echo "⚠️  espeak-ng: installed but may have issues"
        fi
    fi
    
    # Test espeak
    if command_exists espeak; then
        echo "Testing espeak..."
        espeak -v en "$test_text" --stdout > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✅ espeak: working"
        else
            echo "⚠️  espeak: installed but may have issues"
        fi
    fi
    
    echo "🎯 Engine testing completed"
}

# Main installation process
main() {
    echo "🔧 Advanced TTS Setup Starting..."
    echo "=================================="
    
    # Install Node.js dependencies
    echo "📦 Installing Node.js dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        echo "✅ Root dependencies installed"
    fi
    
    if [ -d "server" ] && [ -f "server/package.json" ]; then
        cd server
        npm install
        cd ..
        echo "✅ Server dependencies installed"
    fi
    
    if [ -d "client" ] && [ -f "client/package.json" ]; then
        cd client
        npm install
        cd ..
        echo "✅ Client dependencies installed"
    fi
    
    # Install TTS engines
    install_tts_engines
    
    # Create necessary directories
    echo "📁 Creating project directories..."
    mkdir -p server/output server/temp server/cache server/logs
    echo "✅ Project directories created"
    
    # Setup environment configuration
    echo "⚙️  Setting up environment configuration..."
    if [ ! -f "server/.env" ]; then
        cat > server/.env << EOF
# Server Configuration
PORT=5001
NODE_ENV=development

# Audio Configuration
AUDIO_OUTPUT_DIR=./output
TEMP_DIR=./temp
CACHE_DIR=./cache

# TTS Configuration
DEFAULT_VOICE=en_US-ljspeech-high
FALLBACK_ENABLED=true
FALLBACK_ENGINE=gtts

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
EOF
        echo "✅ Environment configuration created"
    else
        echo "✅ Environment configuration already exists"
    fi
    
    # Verify installations
    verify_installations
    
    # Test engines
    test_engines
    
    echo ""
    echo "🎉 Setup completed!"
    echo "=================================="
    echo "🚀 To start the application:"
    echo "   npm run dev        # Development mode with hot reload"
    echo "   npm start         # Production mode"
    echo ""
    echo "🌐 The application will be available at:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5001"
    echo ""
    echo "� Available TTS features:"
    echo "   • Multiple TTS engines (Coqui, eSpeak, Festival, Pico)"
    echo "   • Dynamic fallback to gTTS for compatibility issues"
    echo "   • Multilingual support with voice selection"
    echo "   • Audio format conversion (WAV, MP3, OGG)"
    echo "   • Real-time synthesis with progress tracking"
    echo ""
    echo "📚 Documentation available in docs/ directory"
    echo "🐛 For troubleshooting, see TROUBLESHOOTING.md"
}

# Run main function
main "$@"
