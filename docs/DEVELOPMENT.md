# AdvancedTTS - Development Guide

## Table of Contents
- [Development Environment Setup](#development-environment-setup)
- [Project Structure Deep Dive](#project-structure-deep-dive)
- [Development Workflow](#development-workflow)
- [Adding New Features](#adding-new-features)
- [Testing Strategy](#testing-strategy)
- [Debugging Guide](#debugging-guide)
- [Performance Optimization](#performance-optimization)
- [Deployment Pipeline](#deployment-pipeline)
- [Contributing Guidelines](#contributing-guidelines)

## Development Environment Setup

### Prerequisites
- Node.js 16+ and npm 8+
- Python 3.8+ with pip
- Git
- FFmpeg (for audio conversion)

### Initial Setup
```bash
# Clone repository
git clone https://github.com/yourusername/AdvancedTTS.git
cd AdvancedTTS

# Install all dependencies
npm run setup

# Create environment file
cp server/.env.example server/.env

# Setup Python virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install gtts

# Start development servers
npm run dev
```

### Development Tools Configuration

#### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

#### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## Project Structure Deep Dive

### Backend Architecture
```
server/
├── index.js                 # Express server entry point
├── config/
│   └── engines.js          # TTS engine configurations
├── routes/                 # API route handlers
│   ├── engines.js         # GET /engines, GET /engines/:engine/models
│   ├── languages.js       # GET /languages, POST /languages/detect
│   └── tts.js            # POST /tts/synthesize, POST /tts/preview
├── services/             # Business logic layer
│   └── ttsService.js    # Core TTS processing service
├── middleware/          # Custom middleware (future)
├── utils/              # Utility functions (future)
├── tests/              # Backend tests (future)
├── output/             # Generated audio files (runtime)
├── temp/               # Temporary processing files (runtime)
└── cache/              # Engine availability cache (runtime)
```

### Frontend Architecture
```
client/
├── public/
│   ├── index.html        # HTML template
│   └── manifest.json     # PWA manifest
├── src/
│   ├── components/       # Reusable React components (future)
│   ├── services/        # API communication layer
│   │   └── api.js      # HTTP client and API methods
│   ├── hooks/          # Custom React hooks (future)
│   ├── utils/          # Utility functions (future)
│   ├── styles/         # CSS/styling (future)
│   ├── tests/          # Frontend tests (future)
│   ├── App.js          # Main application component
│   ├── i18n.js         # Internationalization setup
│   └── index.js        # React entry point
└── build/              # Production build output (generated)
```

## Development Workflow

### Branch Strategy
```
main                    # Production-ready code
├── develop            # Integration branch
├── feature/xxx        # Feature branches
├── bugfix/xxx         # Bug fix branches
├── hotfix/xxx         # Emergency fixes
└── release/xxx        # Release preparation
```

### Commit Message Convention
```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Build/deployment changes

Examples:
feat(tts): add dynamic fallback detection
fix(api): handle engine initialization errors
docs(readme): update installation instructions
```

### Development Commands
```bash
# Start development servers (both frontend and backend)
npm run dev

# Start only backend server
npm run server:dev

# Start only frontend server
npm run client:dev

# Build production frontend
npm run build

# Run tests (when implemented)
npm test

# Lint code (when implemented)
npm run lint

# Clean generated files
npm run clean
```

## Adding New Features

### Adding a New TTS Engine

1. **Update Engine Configuration** (`server/config/engines.js`):
```javascript
'new-engine': {
  name: 'New Engine',
  description: 'Description of the new engine',
  command: 'new-engine-cli',
  supports: {
    ssml: true,
    speed: true,
    pitch: false,
    volume: true
  },
  languages: [
    {
      code: 'en',
      name: 'English',
      variants: ['en-us', 'en-gb']
    }
  ]
}
```

2. **Add Engine Availability Check** (`server/services/ttsService.js`):
```javascript
// In checkEngineAvailability method
if (engineName === 'new-engine') {
  commandToCheck = '/path/to/new-engine';
}
```

3. **Implement Generation Method** (`server/services/ttsService.js`):
```javascript
generateNewEngine(text, outputPath, options) {
  return new Promise((resolve, reject) => {
    const { language, speed, volume } = options;
    
    const args = [
      '--text', text,
      '--language', language,
      '--speed', speed.toString(),
      '--output', outputPath
    ];

    const process = spawn('new-engine-cli', args);
    
    let stderr = '';
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`New Engine failed: ${stderr || 'Unknown error'}`));
      }
    });

    process.on('error', (error) => {
      reject(new Error(`Failed to spawn New Engine: ${error.message}`));
    });
  });
}
```

4. **Add to Generation Switch** (`server/services/ttsService.js`):
```javascript
// In generateSpeechFile method
case 'new-engine':
  await this.generateNewEngine(text, outputPath, { language, speed, volume });
  return null;
```

### Adding a New API Endpoint

1. **Create Route Handler** (`server/routes/new-feature.js`):
```javascript
const express = require('express');
const router = express.Router();

router.get('/new-endpoint', async (req, res) => {
  try {
    // Implementation logic
    const result = await someService.process(req.query);
    
    res.json({
      success: true,
      data: result,
      message: 'Operation completed successfully'
    });
  } catch (error) {
    console.error('New endpoint error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'OPERATION_FAILED',
        message: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = router;
```

2. **Register Route** (`server/index.js`):
```javascript
const newFeatureRoutes = require('./routes/new-feature');
app.use('/api/new-feature', newFeatureRoutes);
```

3. **Add Frontend API Method** (`client/src/services/api.js`):
```javascript
export const newFeatureAPI = {
  getData: (params) => api.get('/new-feature/new-endpoint', { params }),
  processData: (data) => api.post('/new-feature/process', data)
};
```

### Adding New React Components

1. **Create Component File** (`client/src/components/NewComponent.js`):
```javascript
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function NewComponent({ prop1, prop2, onAction }) {
  const { t } = useTranslation();
  const [state, setState] = useState(null);

  useEffect(() => {
    // Component initialization
  }, []);

  const handleAction = () => {
    // Handle user interaction
    onAction(state);
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

export default NewComponent;
```

2. **Add Translations** (`client/src/i18n.js`):
```javascript
// In translation objects
newComponent: {
  title: 'New Component',
  action: 'Perform Action',
  success: 'Action completed successfully'
}
```

3. **Use in Main App** (`client/src/App.js`):
```javascript
import NewComponent from './components/NewComponent';

// In App component JSX
<NewComponent
  prop1={value1}
  prop2={value2}
  onAction={handleNewComponentAction}
/>
```

## Testing Strategy

### Backend Testing (Future Implementation)

#### Unit Tests with Jest
```javascript
// server/tests/services/ttsService.test.js
const TTSService = require('../../services/ttsService');

describe('TTSService', () => {
  let ttsService;

  beforeEach(() => {
    ttsService = new TTSService();
  });

  describe('checkEngineAvailability', () => {
    test('should return true for available engine', async () => {
      const result = await ttsService.checkEngineAvailability('gtts');
      expect(result).toBe(true);
    });

    test('should return false for non-existent engine', async () => {
      const result = await ttsService.checkEngineAvailability('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('shouldTriggerFallback', () => {
    test('should trigger fallback for PyTorch errors', () => {
      const errorMsg = '_pickle.UnpicklingError: Weights only load failed';
      const result = ttsService.shouldTriggerFallback(errorMsg, 'test-model');
      expect(result).toBe(true);
    });

    test('should not trigger fallback for network errors', () => {
      const errorMsg = 'Network timeout';
      const result = ttsService.shouldTriggerFallback(errorMsg, 'test-model');
      expect(result).toBe(false);
    });
  });
});
```

#### API Integration Tests
```javascript
// server/tests/routes/tts.test.js
const request = require('supertest');
const app = require('../../index');

describe('TTS API', () => {
  describe('POST /api/tts/synthesize', () => {
    test('should synthesize speech successfully', async () => {
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({
          text: 'Hello world',
          engine: 'gtts',
          language: 'en'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('url');
    });

    test('should return error for missing text', async () => {
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({ engine: 'gtts' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### Frontend Testing (Future Implementation)

#### Component Testing with React Testing Library
```javascript
// client/src/tests/App.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

test('renders main interface', () => {
  render(<App />);
  expect(screen.getByText(/Advanced Text-to-Speech/i)).toBeInTheDocument();
});

test('synthesizes speech on button click', async () => {
  render(<App />);
  
  const textInput = screen.getByLabelText(/text to synthesize/i);
  const synthesizeButton = screen.getByText(/generate speech/i);
  
  fireEvent.change(textInput, { target: { value: 'Hello world' } });
  fireEvent.click(synthesizeButton);
  
  await waitFor(() => {
    expect(screen.getByText(/generating speech/i)).toBeInTheDocument();
  });
});
```

## Debugging Guide

### Backend Debugging

#### Common Issues and Solutions

1. **Engine Not Available Error**
```javascript
// Check engine installation
console.log('Checking engine availability...');
const isAvailable = await ttsService.checkEngineAvailability('engine-name');
console.log(`Engine available: ${isAvailable}`);

// Verify command path
const { exec } = require('child_process');
exec('which engine-command', (error, stdout) => {
  console.log('Command path:', stdout || 'Not found');
});
```

2. **Synthesis Failures**
```javascript
// Add detailed error logging in generateSpeechFile
try {
  const result = await this.generateSpeechFile(engine, text, tempWavPath, options);
  console.log('Generation result:', result);
} catch (error) {
  console.error('Generation failed:', {
    engine,
    error: error.message,
    stack: error.stack
  });
  throw error;
}
```

3. **Fallback Detection Issues**
```javascript
// Debug fallback logic
shouldTriggerFallback(errorMessage, modelName) {
  console.log('Checking fallback for:', { errorMessage, modelName });
  
  const compatibilityErrorPatterns = [/* patterns */];
  
  for (const pattern of compatibilityErrorPatterns) {
    if (pattern.test(errorMessage)) {
      console.log('Matched pattern:', pattern);
      return true;
    }
  }
  
  console.log('No pattern matched, not triggering fallback');
  return false;
}
```

### Frontend Debugging

#### React DevTools
- Install React Developer Tools browser extension
- Use React Profiler to identify performance issues
- Inspect component state and props

#### Console Debugging
```javascript
// Add debug logging to API calls
const handleSynthesize = async () => {
  console.log('Starting synthesis with settings:', settings);
  
  try {
    const response = await ttsAPI.synthesize({
      text: text.trim(),
      ...settings
    });
    
    console.log('Synthesis response:', response.data);
    
    if (response.data.success) {
      console.log('Audio URL:', response.data.data.url);
    }
  } catch (error) {
    console.error('Synthesis error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};
```

#### Network Debugging
- Use browser DevTools Network tab
- Monitor API request/response times
- Check for CORS issues

### Logging Configuration

#### Backend Logging
```javascript
// Enhanced logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    if (req.path.includes('/tts/')) {
      console.log('TTS Request details:', {
        body: req.body,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    }
  });
  
  next();
});
```

## Performance Optimization

### Backend Optimization

#### Caching Strategy
```javascript
// Engine availability caching
class TTSService {
  constructor() {
    this.engineCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async checkEngineAvailability(engineName) {
    const cacheKey = `engine_${engineName}`;
    const cached = this.engineCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.available;
    }
    
    const available = await this.performEngineCheck(engineName);
    this.engineCache.set(cacheKey, {
      available,
      timestamp: Date.now()
    });
    
    return available;
  }
}
```

#### File Cleanup Optimization
```javascript
// Scheduled cleanup with better performance
async cleanupOldFiles(maxAge = 3600000) {
  const now = Date.now();
  const batchSize = 100;
  
  try {
    const files = await fs.readdir(this.outputDir);
    
    // Process files in batches
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (file) => {
          try {
            const filePath = path.join(this.outputDir, file);
            const stats = await fs.stat(filePath);
            
            if (now - stats.mtime.getTime() > maxAge) {
              await fs.remove(filePath);
              console.log(`Cleaned up: ${file}`);
            }
          } catch (error) {
            console.warn(`Cleanup error for ${file}:`, error.message);
          }
        })
      );
    }
  } catch (error) {
    console.error('Cleanup batch error:', error);
  }
}
```

### Frontend Optimization

#### Code Splitting (Future)
```javascript
// Lazy load components
const AudioPlayer = React.lazy(() => import('./components/AudioPlayer'));
const AdvancedSettings = React.lazy(() => import('./components/AdvancedSettings'));

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <AudioPlayer />
      <AdvancedSettings />
    </Suspense>
  );
}
```

#### State Optimization
```javascript
// Memoize expensive calculations
const availableLanguages = useMemo(() => {
  if (!engines[settings.engine]) return [];
  
  return engines[settings.engine].languages.flatMap(lang =>
    lang.variants.map(variant => ({
      code: variant,
      name: `${lang.name} (${variant.toUpperCase()})`
    }))
  );
}, [engines, settings.engine]);

// Debounce API calls
const debouncedLoadModels = useCallback(
  debounce(async (engine, language) => {
    try {
      const response = await enginesAPI.getModels(engine, language);
      setAvailableModels(response.data.data || []);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  }, 300),
  []
);
```

## Deployment Pipeline

### Production Build
```bash
# Build frontend
cd client
npm run build

# Copy build to server public directory
cp -r build/* ../server/public/

# Install production dependencies
cd ../server
npm ci --only=production
```

### Docker Deployment
```dockerfile
# Multi-stage build
FROM node:16-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:16-alpine AS backend
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production

# Install system dependencies
RUN apk add --no-cache \
  python3 \
  py3-pip \
  espeak-ng \
  festival \
  ffmpeg

# Install Python TTS packages
RUN pip3 install gtts

COPY server/ ./
COPY --from=frontend-builder /app/client/build ./public/

EXPOSE 5001
CMD ["npm", "start"]
```

### PM2 Production Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'advanced-tts',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## Contributing Guidelines

### Code Style
- Use ES6+ features
- Prefer async/await over Promises
- Use destructuring for cleaner code
- Follow consistent naming conventions
- Add JSDoc comments for complex functions

### Pull Request Process
1. Fork the repository
2. Create feature branch from develop
3. Make changes with tests
4. Update documentation
5. Submit pull request
6. Address review feedback
7. Merge after approval

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass and coverage maintained
- [ ] Documentation updated
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Performance impact considered
- [ ] Security implications reviewed

This development guide provides comprehensive information for developers to effectively work with and extend the AdvancedTTS system.
