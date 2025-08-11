# Advanced Text-to-Speech Web Application

A modern, web-based text-to-speech application with multiple TTS engines, multi-language support (including Vietnamese), and unlimited conversion capabilities.

## Features

- 🎯 **Multiple TTS Engines**: Support for various local TTS engines
- 🌍 **Multi-language Support**: Including Vietnamese and many other languages
- 🎵 **Audio Preview**: Listen to generated speech directly in the browser
- 📥 **MP3 Download**: Download high-quality MP3 files
- ♾️ **Unlimited Length**: No restrictions on text length
- 🎨 **Modern UI**: Eye-catching and user-friendly interface
- 🌐 **Multi-language Interface**: Support for multiple UI languages
- 💰 **No API Fees**: All TTS engines run locally

## Technology Stack

### Backend
- Node.js with Express
- Multiple TTS engines:
  - espeak-ng (lightweight, multi-language)
  - Festival (high-quality synthesis)
  - Pico TTS (compact, efficient)
  - eSpeak (classic, reliable)

### Frontend
- React 18
- Material-UI (MUI)
- Axios for API calls
- Audio player components

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AdvancedTTS
```

2. Install dependencies:
```bash
npm run setup
```

3. Install TTS engines (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install espeak espeak-ng festival festival-dev pico-utils
```

4. For macOS:
```bash
brew install espeak espeak-ng festival
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Enter text, select language and TTS engine, then generate speech!

## Supported Languages

- English (US, UK, AU)
- Vietnamese
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Chinese (Mandarin)
- Japanese
- Korean
- And many more...

## Project Structure

```
AdvancedTTS/
├── client/          # React frontend
├── server/          # Node.js backend
├── docs/           # Documentation
├── scripts/        # Setup and utility scripts
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
