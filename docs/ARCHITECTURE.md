# AdvancedTTS - System Architecture Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Directory Structure](#directory-structure)
- [Technology Stack](#technology-stack)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Security](#security)
- [Performance](#performance)

## Project Overview

AdvancedTTS is a comprehensive text-to-speech web application that supports multiple TTS engines and languages. The application features a React frontend with Material-UI components and a Node.js/Express backend with intelligent fallback mechanisms.

### Key Features
- **Multi-Engine Support**: 5 TTS engines (Coqui, gTTS, eSpeak-NG, eSpeak, pyttsx3)
- **Dynamic Fallback**: Automatic error detection and engine switching
- **Multi-Language**: 50+ languages and language variants
- **Real-time Processing**: Audio generation and streaming
- **Responsive UI**: Material-UI React interface
- **Internationalization**: Multi-language UI support
- **Audio Controls**: Play, download, format conversion

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server  │◄──►│  TTS Engines    │
│                 │    │                  │    │                 │
│  - Material-UI  │    │  - REST API      │    │  - Coqui TTS    │
│  - Audio Player │    │  - Rate Limiting │    │  - Google TTS   │
│  - i18n Support │    │  - Error Handling│    │  - eSpeak-NG    │
│  - State Mgmt   │    │  - File Serving  │    │  - Festival     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Browser APIs  │    │   File System    │    │   External APIs │
│                 │    │                  │    │                 │
│  - Web Audio    │    │  - Temp Files    │    │  - Google Cloud │
│  - File Saver   │    │  - Output Cache  │    │  - Model Repos  │
│  - HTTP Client  │    │  - Cleanup Jobs  │    │  - PyTorch Hub  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Directory Structure

```
AdvancedTTS/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets
│   │   ├── index.html         # Main HTML template
│   │   └── manifest.json      # PWA manifest
│   ├── src/                   # Source code
│   │   ├── components/        # React components (future)
│   │   ├── services/          # API services
│   │   │   └── api.js        # HTTP client & API calls
│   │   ├── App.js            # Main React component
│   │   ├── i18n.js           # Internationalization config
│   │   └── index.js          # React entry point
│   └── package.json          # Client dependencies
│
├── server/                    # Express Backend Application
│   ├── config/               # Configuration files
│   │   └── engines.js       # TTS engine configurations
│   ├── routes/              # API route handlers
│   │   ├── engines.js       # Engine management routes
│   │   ├── languages.js     # Language detection routes
│   │   └── tts.js          # TTS synthesis routes
│   ├── services/           # Business logic services
│   │   └── ttsService.js   # Core TTS service class
│   ├── output/             # Generated audio files (runtime)
│   ├── temp/               # Temporary processing files
│   ├── cache/              # Engine availability cache
│   ├── index.js            # Express server entry point
│   └── package.json        # Server dependencies
│
├── docs/                     # Documentation
│   ├── API.md               # API endpoints documentation
│   ├── ARCHITECTURE.md      # This file
│   ├── BUG_FIXES.md        # Bug tracking and fixes
│   ├── COQUI_TTS_MODELS.md # Coqui model documentation
│   ├── COQUI_TTS_QUICK_REFERENCE.md # Quick reference
│   └── DEPLOYMENT.md       # Deployment instructions
│
├── scripts/                 # Utility scripts
│   └── setup.sh           # Environment setup script
│
├── .env                    # Environment configuration
├── .gitignore             # Git ignore rules
├── docker-compose.yml     # Docker composition
├── Dockerfile            # Docker container definition
├── ecosystem.config.js   # PM2 process management
├── package.json          # Root project configuration
└── README.md             # Project overview
```

## Technology Stack

### Frontend Stack
- **React 18**: UI framework with hooks and functional components
- **Material-UI (MUI) v5**: Component library and design system
- **React i18next**: Internationalization framework
- **Axios**: HTTP client for API communication
- **FileSaver.js**: Client-side file download utility
- **React Hooks**: State management and lifecycle

### Backend Stack
- **Node.js 16+**: JavaScript runtime environment
- **Express.js**: Web application framework
- **cors**: Cross-origin resource sharing middleware
- **helmet**: Security middleware
- **express-rate-limit**: Rate limiting middleware
- **fs-extra**: Enhanced file system operations
- **fluent-ffmpeg**: Audio format conversion
- **uuid**: Unique identifier generation

### TTS Engines
- **Coqui TTS**: Neural text-to-speech models
- **Google TTS (gTTS)**: Cloud-based neural voices
- **eSpeak-NG**: Lightweight multilingual engine
- **Festival**: Research-grade speech synthesis
- **Pico TTS**: Compact embedded engine
- **pyttsx3**: Python-based local engine
- **Piper**: Fast neural synthesis

### Development Tools
- **concurrently**: Parallel script execution
- **nodemon**: Development server auto-restart
- **Docker**: Containerization
- **PM2**: Production process management
- **ESLint**: Code linting (future)
- **Jest**: Testing framework (future)

## Core Components

### 1. TTSService Class (`server/services/ttsService.js`)

The central service managing all TTS operations.

```javascript
class TTSService {
  constructor()                           // Initialize directories
  async checkEngineAvailability()        // Check if engine is installed
  async getAllAvailableEngines()         // Get all working engines
  async synthesizeSpeech()               // Main synthesis method
  async generateSpeechFile()             // Route to specific engine
  generateCoqui()                        // Coqui TTS with fallback
  generateGTTS()                         // Google TTS generation
  generateEspeakNG()                     // eSpeak-NG generation
  shouldTriggerFallback()                // Dynamic error detection
  convertAudioFormat()                   // FFmpeg format conversion
  async getAudioDuration()               // Get audio metadata
  async cleanupOldFiles()                // File cleanup job
}
```

### 2. React App Component (`client/src/App.js`)

Main UI component with state management.

```javascript
function App() {
  // State Management
  const [text, setText]                   // Input text
  const [engines, setEngines]            // Available engines
  const [settings, setSettings]          // TTS parameters
  const [isLoading, setIsLoading]        // Loading states
  const [audioUrl, setAudioUrl]          // Generated audio URL
  
  // Core Methods
  const loadEngines()                     // Fetch available engines
  const loadModels()                      // Load engine-specific models
  const handleSynthesize()               // Main synthesis handler
  const handlePreview()                  // Preview synthesis
  const handlePlay()                     // Audio playback control
  const handleDownload()                 // File download
}
```

### 3. Engine Configuration (`server/config/engines.js`)

Centralized engine definitions with capabilities and language support.

```javascript
const engines = {
  'engine-name': {
    name: 'Display Name',
    description: 'Engine description',
    command: 'cli-command',
    supports: {
      ssml: boolean,      // SSML support
      speed: boolean,     // Speed control
      pitch: boolean,     // Pitch control
      volume: boolean     // Volume control
    },
    languages: [
      {
        code: 'lang',
        name: 'Language Name',
        variants: ['lang-variant1', 'lang-variant2']
      }
    ]
  }
}
```

### 4. API Service Layer (`client/src/services/api.js`)

HTTP client abstraction for backend communication.

```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 300000
});

export const ttsAPI = {
  synthesize: (data) => api.post('/tts/synthesize', data),
  preview: (data) => api.post('/tts/preview', data)
};

export const enginesAPI = {
  getAll: () => api.get('/engines'),
  getModels: (engine, language) => api.get(`/engines/${engine}/models`, { params: { language } })
};
```

## Data Flow

### 1. Synthesis Request Flow

```
User Input → React State → API Call → Express Route → TTS Service → Engine → Audio File → Response
```

1. **User Interaction**: User enters text and selects settings
2. **Frontend Validation**: React validates input and settings
3. **API Request**: HTTP POST to `/api/tts/synthesize`
4. **Route Handler**: Express route validates and delegates
5. **Service Layer**: TTSService processes request
6. **Engine Selection**: Determines appropriate TTS engine
7. **Audio Generation**: Engine generates speech audio
8. **Format Conversion**: FFmpeg converts to requested format
9. **File Storage**: Audio saved to output directory
10. **Response**: JSON response with file metadata
11. **Frontend Update**: UI updates with audio player

### 2. Fallback Mechanism Flow

```
Engine Error → Error Detection → Pattern Matching → Fallback Engine → Success/Fail
```

1. **Error Occurrence**: TTS engine fails with error
2. **Error Capture**: stderr/stdout captured by service
3. **Pattern Analysis**: `shouldTriggerFallback()` analyzes error
4. **Fallback Decision**: Determines if error is compatibility-related
5. **Alternative Engine**: Falls back to gTTS with same parameters
6. **Success Handling**: Returns fallback metadata
7. **User Notification**: Frontend displays fallback notification

### 3. Engine Discovery Flow

```
Server Start → Engine Check → Availability Cache → API Response → Frontend Update
```

1. **Initialization**: Server starts and checks available engines
2. **Binary Detection**: Checks for engine executables
3. **Capability Testing**: Tests basic functionality
4. **Cache Storage**: Stores availability in memory
5. **API Exposure**: `/api/engines` returns available engines
6. **Frontend Loading**: React loads and caches engine list
7. **UI Updates**: Dropdown menus populated with available options

## Security

### Authentication & Authorization
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Policy**: Restricted to configured client URL
- **Helmet.js**: Security headers and protection
- **Input Validation**: Text length and parameter validation
- **File Access**: Restricted to output directory only

### Data Protection
- **No Persistent Storage**: Audio files auto-deleted after 1 hour
- **Temporary Files**: Cleaned up after processing
- **Error Sanitization**: Error messages sanitized before client response
- **Path Traversal Protection**: File access restricted to designated directories

### API Security
- **Request Size Limits**: 50MB max request body
- **Timeout Protection**: 5-minute request timeout
- **Error Handling**: Graceful error responses without sensitive data
- **Static File Serving**: Secure audio file serving with CORS

## Performance

### Optimization Strategies
- **Concurrent Processing**: Multiple engines can process simultaneously
- **File Cleanup**: Automatic cleanup of old files (1-hour retention)
- **Caching**: Engine availability cached to avoid repeated checks
- **Format Conversion**: Efficient FFmpeg streaming conversion
- **Memory Management**: Temporary files cleaned up immediately

### Scalability Considerations
- **Stateless Design**: No session state stored on server
- **Horizontal Scaling**: Multiple server instances can run behind load balancer
- **File Storage**: Local storage suitable for single-instance deployment
- **Process Management**: PM2 ecosystem for production clustering
- **Docker Support**: Containerized deployment for cloud platforms

### Performance Metrics
- **Response Time**: Typically 2-10 seconds depending on text length and engine
- **Memory Usage**: ~100MB base + ~50MB per concurrent request
- **File Size**: Generated audio typically 50KB-500KB per request
- **Cleanup Efficiency**: Old files cleaned up every hour automatically

### Monitoring & Logging
- **Request Logging**: All synthesis requests logged with timing
- **Error Tracking**: Detailed error logs with engine-specific information
- **Performance Metrics**: Response times and success rates tracked
- **Resource Usage**: Memory and disk usage monitoring recommended
