#!/bin/bash

# Advanced TTS Setup Script
# This script installs the required TTS engines for the application

echo "🚀 Setting up Advanced TTS Application..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install packages on different systems
install_tts_engines() {
    echo "📦 Installing TTS engines..."
    
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
        echo "⚠️  Some TTS engines are missing. The application will work with available engines."
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
    
    # Verify installations
    verify_installations
    
    # Test engines
    test_engines
    
    echo ""
    echo "🎉 Setup completed!"
    echo "=================================="
    echo "🚀 To start the application:"
    echo "   npm run dev"
    echo ""
    echo "🌐 The application will be available at:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo ""
    echo "📚 For more information, check the README.md file"
}

# Run main function
main "$@"
