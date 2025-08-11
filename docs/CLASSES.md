# AdvancedTTS - Class Documentation

## Table of Contents
- [Overview](#overview)
- [Core Classes](#core-classes)
- [Service Classes](#service-classes)
- [Configuration Classes](#configuration-classes)
- [React Components](#react-components)
- [Utility Classes](#utility-classes)
- [Type Definitions](#type-definitions)

## Overview

This document provides comprehensive documentation for all classes, components, and modules in the AdvancedTTS system. Each class is documented with its purpose, methods, properties, and usage examples.

## Core Classes

### TTSService (`server/services/ttsService.js`)

The main service class responsible for text-to-speech synthesis operations.

#### Class Definition
```javascript
class TTSService {
  constructor()
  // Properties
  outputDir: string          // Output directory for audio files
  tempDir: string           // Temporary directory for processing
  
  // Methods
  async checkEngineAvailability(engineName: string): Promise<boolean>
  async getAllAvailableEngines(): Promise<object>
  async synthesizeSpeech(text: string, options: object): Promise<object>
  async generateSpeechFile(engine: string, text: string, outputPath: string, options: object): Promise<object|null>
  generateCoqui(text: string, outputPath: string, options: object): Promise<object|null>
  generateGTTS(text: string, outputPath: string, options: object): Promise<void>
  generateEspeakNG(text: string, outputPath: string, options: object): Promise<void>
  generateEspeak(text: string, outputPath: string, options: object): Promise<void>
  generateFestival(text: string, outputPath: string, options: object): Promise<void>
  generatePico(text: string, outputPath: string, options: object): Promise<void>
  generatePiper(text: string, outputPath: string, options: object): Promise<void>
  generatePyttsx3(text: string, outputPath: string, options: object): Promise<void>
  shouldTriggerFallback(errorMessage: string, modelName: string): boolean
  convertAudioFormat(inputPath: string, outputPath: string, format: string): Promise<void>
  async getAudioDuration(filePath: string): Promise<number>
  async cleanupOldFiles(maxAge: number): Promise<void>
}
```

#### Constructor
```javascript
constructor() {
  this.outputDir = path.join(__dirname, '../output');
  this.tempDir = path.join(__dirname, '../temp');
}
```

**Purpose**: Initializes the service with default directory paths for output and temporary files.

#### Methods

##### `checkEngineAvailability(engineName: string): Promise<boolean>`

**Purpose**: Checks if a TTS engine is available on the system.

**Parameters**:
- `engineName` (string): Name of the engine to check ('coqui', 'gtts', 'espeak-ng', etc.)

**Returns**: Promise resolving to boolean indicating availability.

**Example**:
```javascript
const isAvailable = await ttsService.checkEngineAvailability('gtts');
if (isAvailable) {
  console.log('Google TTS is available');
}
```

**Implementation Details**:
- Checks for engine-specific command paths
- Uses system commands to verify binary existence
- Handles special cases for Python-based engines

##### `getAllAvailableEngines(): Promise<object>`

**Purpose**: Returns all engines that are currently available on the system.

**Returns**: Promise resolving to object with engine configurations.

**Example**:
```javascript
const engines = await ttsService.getAllAvailableEngines();
console.log(Object.keys(engines)); // ['gtts', 'espeak-ng', 'coqui']
```

##### `synthesizeSpeech(text: string, options: object): Promise<object>`

**Purpose**: Main synthesis method that coordinates the entire TTS process.

**Parameters**:
- `text` (string): Text to synthesize
- `options` (object): Synthesis options
  - `engine` (string, optional): TTS engine to use
  - `language` (string, optional): Language code
  - `speed` (number, optional): Speech speed (50-300)
  - `pitch` (number, optional): Voice pitch (0-100)
  - `volume` (number, optional): Audio volume (0-100)
  - `format` (string, optional): Output format ('mp3', 'wav', 'ogg', 'm4a')
  - `model` (string, optional): Specific model for engines that support it
  - `speaker` (string, optional): Speaker selection

**Returns**: Promise resolving to synthesis result object.

**Example**:
```javascript
const result = await ttsService.synthesizeSpeech("Hello world", {
  engine: 'gtts',
  language: 'en',
  speed: 150,
  format: 'mp3'
});
```

**Response Format**:
```javascript
{
  id: "uuid-string",
  filename: "uuid.mp3",
  path: "/full/path/to/file.mp3",
  url: "/audio/uuid.mp3",
  format: "mp3",
  engine: "gtts",
  language: "en",
  duration: 3.42,
  fallback?: {
    used: true,
    originalEngine: "coqui",
    actualEngine: "gTTS",
    reason: "Model compatibility issue"
  }
}
```

##### `generateCoqui(text: string, outputPath: string, options: object): Promise<object|null>`

**Purpose**: Generates speech using Coqui TTS with intelligent fallback mechanism.

**Parameters**:
- `text` (string): Text to synthesize
- `outputPath` (string): Path for output audio file
- `options` (object): Generation options including language, speed, model, speaker

**Returns**: Promise resolving to fallback metadata object or null if successful.

**Fallback Logic**:
```javascript
// Dynamic error detection patterns
const compatibilityErrorPatterns = [
  /weights_only.*set to.*False/i,
  /WeightsUnpickler error/i,
  /Unsupported class/i,
  /_pickle\.UnpicklingError/i,
  /Error loading model/i,
  // ... more patterns
];
```

**Example**:
```javascript
const result = await ttsService.generateCoqui("Bonjour", "/tmp/output.wav", {
  language: 'fr',
  model: 'tts_models/fr/mai/tacotron2-DDC'
});

if (result && result.fallbackUsed) {
  console.log(`Fallback used: ${result.fallbackEngine}`);
}
```

##### `shouldTriggerFallback(errorMessage: string, modelName: string): boolean`

**Purpose**: Analyzes error messages to determine if fallback should be triggered.

**Parameters**:
- `errorMessage` (string): Error message from TTS engine
- `modelName` (string): Name of the model that failed

**Returns**: Boolean indicating whether fallback should be used.

**Error Patterns Detected**:
- PyTorch serialization issues
- Model loading problems
- Version compatibility issues
- Memory/resource constraints
- Architecture mismatches

**Example**:
```javascript
const errorMsg = "_pickle.UnpicklingError: Weights only load failed...";
const shouldFallback = ttsService.shouldTriggerFallback(errorMsg, "model-name");
// Returns: true
```

##### `convertAudioFormat(inputPath: string, outputPath: string, format: string): Promise<void>`

**Purpose**: Converts audio files between different formats using FFmpeg.

**Parameters**:
- `inputPath` (string): Path to input audio file
- `outputPath` (string): Path for converted output file
- `format` (string): Target format ('mp3', 'wav', 'ogg', 'm4a')

**Supported Formats**:
- MP3: `libmp3lame` codec, 192k bitrate
- OGG: `libvorbis` codec, 192k bitrate
- M4A: `aac` codec, 192k bitrate
- WAV: No conversion needed

**Example**:
```javascript
await ttsService.convertAudioFormat(
  '/tmp/input.wav',
  '/output/final.mp3',
  'mp3'
);
```

## React Components

### App Component (`client/src/App.js`)

Main React component managing the entire frontend application.

#### Component Definition
```javascript
function App() {
  // State Variables
  const [text, setText]: [string, function]
  const [engines, setEngines]: [object, function]
  const [availableModels, setAvailableModels]: [array, function]
  const [settings, setSettings]: [object, function]
  const [isLoading, setIsLoading]: [boolean, function]
  const [isPreviewLoading, setIsPreviewLoading]: [boolean, function]
  const [error, setError]: [string|null, function]
  const [success, setSuccess]: [string|null, function]
  const [audioUrl, setAudioUrl]: [string|null, function]
  const [isPlaying, setIsPlaying]: [boolean, function]
  const [audioRef, setAudioRef]: [HTMLAudioElement|null, function]
  
  // Methods
  const loadEngines(): Promise<void>
  const loadLanguages(): Promise<void>
  const loadModels(): Promise<void>
  const handleSynthesize(): Promise<void>
  const handlePreview(): Promise<void>
  const handlePlay(): void
  const handleStop(): void
  const handleDownload(): void
  const handleClear(): void
  const validateInput(): boolean
}
```

#### State Management

##### Settings State
```javascript
const [settings, setSettings] = useState({
  engine: 'espeak-ng',      // Default TTS engine
  language: 'en',           // Language code
  model: '',                // Model selection for advanced engines
  speaker: '',              // Speaker selection for multi-speaker models
  speed: 150,               // Speech speed (50-300)
  pitch: 50,                // Voice pitch (0-100)
  volume: 100,              // Audio volume (0-100)
  format: 'mp3'             // Output format
});
```

##### Loading States
```javascript
const [isLoading, setIsLoading] = useState(false);           // Main synthesis
const [isPreviewLoading, setIsPreviewLoading] = useState(false); // Preview synthesis
```

#### Key Methods

##### `loadEngines(): Promise<void>`

**Purpose**: Fetches available TTS engines from the backend.

**Implementation**:
```javascript
const loadEngines = async () => {
  try {
    const response = await enginesAPI.getAll();
    if (response.data.success) {
      setEngines(response.data.data);
    }
  } catch (error) {
    setError(t('errors.loadEngines'));
  }
};
```

##### `handleSynthesize(): Promise<void>`

**Purpose**: Main synthesis handler that processes user input and generates audio.

**Flow**:
1. Validate input text
2. Prepare synthesis parameters
3. Call TTS API
4. Handle response (success/error/fallback)
5. Update UI state

**Implementation**:
```javascript
const handleSynthesize = async () => {
  if (!validateInput()) return;
  
  setIsLoading(true);
  setError(null);
  setSuccess(null);
  
  try {
    const response = await ttsAPI.synthesize({
      text: text.trim(),
      ...settings
    });
    
    if (response.data.success) {
      const { data } = response.data;
      setAudioUrl(data.url);
      setSuccess(t('synthesis.success'));
      
      // Handle fallback notification
      if (data.fallback?.used) {
        setSuccess(t('synthesis.fallbackUsed', { 
          engine: data.fallback.actualEngine 
        }));
      }
    }
  } catch (error) {
    setError(error.response?.data?.error?.message || t('errors.synthesis'));
  } finally {
    setIsLoading(false);
  }
};
```

##### `validateInput(): boolean`

**Purpose**: Validates user input before synthesis.

**Validation Rules**:
- Text length: 1-5000 characters
- Engine availability
- Language support
- Parameter ranges

**Implementation**:
```javascript
const validateInput = () => {
  if (!text.trim()) {
    setError(t('errors.textRequired'));
    return false;
  }
  
  if (text.length > 5000) {
    setError(t('errors.textTooLong'));
    return false;
  }
  
  if (!engines[settings.engine]) {
    setError(t('errors.engineNotAvailable'));
    return false;
  }
  
  return true;
};
```

## Service Classes

### API Service (`client/src/services/api.js`)

HTTP client abstraction for backend communication.

#### Configuration
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 300000, // 5 minutes for long synthesis operations
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### Service Objects

##### TTS API
```javascript
export const ttsAPI = {
  synthesize: (data) => api.post('/tts/synthesize', data),
  preview: (data) => api.post('/tts/preview', data)
};
```

##### Engines API
```javascript
export const enginesAPI = {
  getAll: () => api.get('/engines'),
  getModels: (engine, language) => api.get(`/engines/${engine}/models`, {
    params: { language }
  })
};
```

##### Languages API
```javascript
export const languagesAPI = {
  getAll: () => api.get('/languages'),
  detect: (text) => api.post('/languages/detect', { text })
};
```

## Configuration Classes

### Engine Configuration (`server/config/engines.js`)

Central configuration for all TTS engines.

#### Structure
```javascript
const engines = {
  'engine-id': {
    name: string,                    // Display name
    description: string,             // Engine description
    command: string,                 // CLI command
    supports: {
      ssml: boolean,                 // SSML markup support
      speed: boolean,                // Speed control
      pitch: boolean,                // Pitch control
      volume: boolean                // Volume control
    },
    languages: [
      {
        code: string,                // Language code (ISO 639-1)
        name: string,                // Display name
        variants: string[]           // Language variants/dialects
      }
    ],
    models?: [                       // Optional: for engines with multiple models
      {
        id: string,                  // Model identifier
        name: string,                // Display name
        model_name: string,          // Internal model name
        quality: string,             // Quality level
        speakers?: string[],         // Available speakers
        status: string               // Model status
      }
    ]
  }
}
```

#### Example Engine Configuration
```javascript
'coqui': {
  name: 'Coqui TTS',
  description: 'High-quality neural text-to-speech models',
  command: 'tts',
  supports: {
    ssml: true,
    speed: true,
    pitch: false,
    volume: false
  },
  languages: [
    {
      code: 'en',
      name: 'English',
      variants: ['en-us', 'en-gb', 'en-au'],
      models: [
        {
          id: 'ljspeech-vits',
          name: 'LJSpeech VITS',
          model_name: 'tts_models/en/ljspeech/vits',
          quality: 'High',
          speakers: ['female'],
          status: 'working'
        }
      ]
    }
  ]
}
```

## Utility Classes

### Internationalization (`client/src/i18n.js`)

Internationalization configuration using react-i18next.

#### Configuration
```javascript
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: englishTranslations },
      vi: { translation: vietnameseTranslations },
      fr: { translation: frenchTranslations }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
```

#### Translation Structure
```javascript
const translations = {
  title: 'Advanced Text-to-Speech',
  synthesis: {
    success: 'Speech synthesized successfully',
    fallbackUsed: 'Fallback to {{engine}} used due to compatibility issues',
    generating: 'Generating speech...',
    preview: 'Generating preview...'
  },
  errors: {
    textRequired: 'Text is required',
    textTooLong: 'Text is too long (max 5000 characters)',
    synthesis: 'Failed to synthesize speech',
    loadEngines: 'Failed to load engines',
    engineNotAvailable: 'Selected engine is not available'
  },
  settings: {
    engine: 'TTS Engine',
    language: 'Language',
    model: 'Model',
    speaker: 'Speaker',
    speed: 'Speed',
    pitch: 'Pitch',
    volume: 'Volume',
    format: 'Format'
  }
};
```

## Type Definitions

### TypeScript Interfaces (Future Implementation)

```typescript
// TTS Service Types
interface SynthesisOptions {
  engine?: string;
  language?: string;
  model?: string;
  speaker?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  format?: 'mp3' | 'wav' | 'ogg' | 'm4a';
}

interface SynthesisResult {
  id: string;
  filename: string;
  path: string;
  url: string;
  format: string;
  engine: string;
  language: string;
  duration: number;
  fallback?: FallbackInfo;
}

interface FallbackInfo {
  used: boolean;
  originalEngine?: string;
  actualEngine?: string;
  reason?: string;
}

// Engine Configuration Types
interface EngineConfig {
  name: string;
  description: string;
  command: string;
  supports: EngineCapabilities;
  languages: LanguageConfig[];
  models?: ModelConfig[];
}

interface EngineCapabilities {
  ssml: boolean;
  speed: boolean;
  pitch: boolean;
  volume: boolean;
}

interface LanguageConfig {
  code: string;
  name: string;
  variants: string[];
}

interface ModelConfig {
  id: string;
  name: string;
  model_name: string;
  quality: string;
  speakers?: string[];
  status: 'working' | 'fallback' | 'broken';
}

// API Response Types
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
}

interface APIError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
}

// React Component Types
interface AppState {
  text: string;
  engines: Record<string, EngineConfig>;
  availableModels: ModelConfig[];
  settings: SynthesisOptions;
  isLoading: boolean;
  isPreviewLoading: boolean;
  error: string | null;
  success: string | null;
  audioUrl: string | null;
  isPlaying: boolean;
  audioRef: HTMLAudioElement | null;
}
```

## Class Usage Examples

### Complete TTS Service Usage
```javascript
// Initialize service
const ttsService = require('./services/ttsService');

// Check engine availability
const engines = await ttsService.getAllAvailableEngines();
console.log('Available engines:', Object.keys(engines));

// Synthesize speech
const result = await ttsService.synthesizeSpeech("Hello world", {
  engine: 'gtts',
  language: 'en',
  speed: 150,
  format: 'mp3'
});

console.log('Audio generated:', result.url);

// Handle fallback scenario
if (result.fallback?.used) {
  console.log(`Fallback used: ${result.fallback.actualEngine}`);
}
```

### Complete React Component Usage
```javascript
function CustomTTSComponent() {
  const [result, setResult] = useState(null);
  
  const handleSynthesize = async () => {
    try {
      const response = await ttsAPI.synthesize({
        text: "Custom synthesis",
        engine: "coqui",
        language: "en"
      });
      setResult(response.data.data);
    } catch (error) {
      console.error('Synthesis failed:', error);
    }
  };
  
  return (
    <div>
      <button onClick={handleSynthesize}>Synthesize</button>
      {result && (
        <audio controls src={result.url} />
      )}
    </div>
  );
}
```

This comprehensive class documentation provides all necessary information for developers to understand, use, and extend the AdvancedTTS system.
