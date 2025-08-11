# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Prerequisites Check
```bash
# Check Node.js version (requires 16+)
node --version

# Check npm version
npm --version
```

### 2. Installation
```bash
# Make setup script executable and run it
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 3. Start Development
```bash
# Start both frontend and backend
npm run dev
```

### 4. Open Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 🎯 First Test

1. Open http://localhost:3000
2. Type "Hello, this is a test" in the text field
3. Select your preferred language and engine
4. Click "Preview" to hear a quick sample
5. Click "Generate Speech" for full audio
6. Download the MP3 file

## 🛠️ Manual Engine Installation

If the setup script doesn't work on your system:

### macOS
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install TTS engines
brew install espeak espeak-ng festival
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install espeak espeak-ng festival festival-dev pico-utils
```

### Windows
- Use Windows Subsystem for Linux (WSL)
- Or use Docker deployment method

## 🐳 Docker Quick Start

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:3000
```

## 📱 Testing Different Languages

The application supports many languages including:
- English (en, en-us, en-gb)
- Vietnamese (vi)
- Spanish (es)
- French (fr)
- German (de)
- And many more...

## 🔧 Troubleshooting

### TTS Engine Not Found
```bash
# Check which engines are available
which espeak espeak-ng festival pico2wave

# Install missing engines using your package manager
```

### Port Already in Use
```bash
# Change ports in package.json or .env files
# Default: Frontend 3000, Backend 5001
```

### Permission Errors
```bash
# Ensure proper permissions for audio directories
chmod 755 server/output server/temp server/cache
```

## 📚 Next Steps

1. Read the full [README.md](README.md)
2. Check [API Documentation](docs/API.md)
3. Review [Deployment Guide](docs/DEPLOYMENT.md)
4. Explore the code structure
5. Contribute to the project!

## 🆘 Need Help?

- Check the logs: `npm run dev` (look for error messages)
- Verify engines: Visit http://localhost:5001/api/engines
- Test API: Visit http://localhost:5001/api/health
- Open an issue on GitHub with detailed error information

Enjoy using Advanced TTS! 🎉
