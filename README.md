# Advanced Text-to-Speech Web Application

A modern, web-based text-to-speech application with multiple TTS engines, multi-language support (including Vietnamese), and unlimited conversion capabilities.

## Features

- 🎯 **Multiple TTS Engines**: 5 engines with intelligent fallback system
- 🧠 **Neural Voices**: Coqui TTS and gTTS for high-quality speech
- 🔄 **Dynamic Fallback**: Automatic error detection and engine switching
- 🌍 **Multi-language Support**: Including Vietnamese and 50+ other languages
- 🎵 **Audio Preview**: Listen to generated speech directly in the browser
- 📥 **MP3 Download**: Download high-quality audio in multiple formats
- ♾️ **Unlimited Length**: No restrictions on text length
- 🎨 **Modern UI**: Eye-catching and user-friendly interface with Material-UI
- 🌐 **Multi-language Interface**: Support for multiple UI languages
- 💰 **No API Fees**: All TTS engines run locally (gTTS uses free tier)

## Technology Stack

### Backend
- Node.js with Express
- Multiple TTS engines with dynamic fallback:
  - **Coqui TTS** (neural, high-quality, primary engine)
  - **Google TTS (gTTS)** (neural voices, fallback engine)
  - **eSpeak-NG** (lightweight, multi-language)
  - **eSpeak** (classic, reliable)
  - **pyttsx3** (system voices)
- Dynamic error detection and intelligent fallback
- Audio format conversion (MP3, WAV, OGG, M4A)

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
