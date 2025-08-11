# AdvancedTTS - Troubleshooting & Bug Fix Guide

## Table of Contents
- [Common Issues & Solutions](#common-issues--solutions)
- [Bug Tracking System](#bug-tracking-system)
- [Known Issues](#known-issues)
- [Debugging Tools](#debugging-tools)
- [Error Patterns](#error-patterns)
- [Recovery Procedures](#recovery-procedures)
- [Performance Issues](#performance-issues)
- [Security Issues](#security-issues)
- [Recent Bug Fixes](#recent-bug-fixes)

## Common Issues & Solutions

### 1. TTS Engine Issues

#### Engine Not Available Error
**Symptoms**: API returns "TTS engine X is not available on this system"

**Causes**:
- Engine binary not installed
- Incorrect path configuration
- Permission issues
- Virtual environment issues

**Solutions**:
```bash
# Check if engine is installed
which espeak-ng
which gtts-cli
which tts

# Install missing engines
# For macOS:
brew install espeak-ng festival

# For Ubuntu/Debian:
sudo apt-get install espeak-ng festival pico-utils

# For Python-based engines:
source .venv/bin/activate
pip install gtts

# Fix permissions
chmod +x /path/to/engine/binary
```

**Code Fix**:
```javascript
// Enhanced engine checking with better error reporting
async checkEngineAvailability(engineName) {
  const engine = engines[engineName];
  if (!engine) {
    console.error(`Engine config not found: ${engineName}`);
    return false;
  }

  let commandToCheck = engine.command;
  
  // Special path handling
  if (engineName === 'gtts') {
    commandToCheck = '/Users/caoducanh/Desktop/Coding/AdvancedTTS/.venv/bin/gtts-cli';
  }

  return new Promise((resolve) => {
    exec(`test -f ${commandToCheck} && echo "exists" || which ${engine.command}`, 
      (error, stdout, stderr) => {
        const isAvailable = stdout.includes('exists') || (!error && stdout.trim().length > 0);
        
        if (!isAvailable) {
          console.warn(`Engine ${engineName} not available:`, {
            command: commandToCheck,
            error: error?.message,
            stderr
          });
        }
        
        resolve(isAvailable);
      }
    );
  });
}
```

#### Synthesis Timeout Issues
**Symptoms**: Requests hang or timeout after 5 minutes

**Causes**:
- Large text input
- Slow TTS engine
- System resource constraints
- Network issues (for cloud engines)

**Solutions**:
```javascript
// Add request timeout handling
app.use('/api/tts', (req, res, next) => {
  // Set longer timeout for TTS requests
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000);
  next();
});

// Add progress monitoring
async synthesizeSpeech(text, options = {}) {
  const startTime = Date.now();
  console.log(`Starting synthesis: ${text.substring(0, 50)}...`);
  
  try {
    const result = await this.generateSpeechFile(/* ... */);
    const duration = Date.now() - startTime;
    console.log(`Synthesis completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Synthesis failed after ${duration}ms:`, error.message);
    throw error;
  }
}
```

### 2. Fallback Mechanism Issues

#### Fallback Not Triggering
**Symptoms**: Engine fails but no fallback occurs

**Debug Steps**:
```javascript
// Enhanced fallback debugging
shouldTriggerFallback(errorMessage, modelName) {
  console.log('🔍 Fallback Analysis:', {
    model: modelName,
    errorLength: errorMessage.length,
    errorPreview: errorMessage.substring(0, 200)
  });

  const compatibilityErrorPatterns = [
    /weights_only.*set to.*False/i,
    /WeightsUnpickler error/i,
    /Unsupported class/i,
    /_pickle\.UnpicklingError/i,
    // ... more patterns
  ];
  
  for (let i = 0; i < compatibilityErrorPatterns.length; i++) {
    const pattern = compatibilityErrorPatterns[i];
    if (pattern.test(errorMessage)) {
      console.log(`✅ Pattern ${i} matched: ${pattern}`);
      return true;
    }
  }
  
  console.log('❌ No pattern matched - fallback not triggered');
  console.log('Full error message:', errorMessage);
  return false;
}
```

#### Infinite Fallback Loop
**Symptoms**: System continuously tries fallback engines

**Solution**:
```javascript
// Add fallback attempt tracking
generateCoqui(text, outputPath, options) {
  return new Promise((resolve, reject) => {
    // Track fallback attempts to prevent loops
    const fallbackAttempts = options._fallbackAttempts || 0;
    if (fallbackAttempts > 2) {
      return reject(new Error('Maximum fallback attempts reached'));
    }

    // ... existing code ...

    process.on('close', (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        const shouldFallback = this.shouldTriggerFallback(errorMessage, modelName);
        
        if (shouldFallback && fallbackAttempts < 2) {
          console.log(`🔄 Attempting fallback (attempt ${fallbackAttempts + 1})`);
          
          return this.generateGTTS(text, outputPath, { 
            ...options, 
            _fallbackAttempts: fallbackAttempts + 1 
          })
          .then(() => resolve({ fallbackUsed: true, fallbackEngine: 'gTTS', originalEngine: 'coqui' }))
          .catch(reject);
        } else {
          reject(new Error(`Coqui TTS failed: ${errorMessage}`));
        }
      }
    });
  });
}
```

### 3. Audio File Issues

#### File Not Found Errors
**Symptoms**: Generated audio files cannot be accessed

**Causes**:
- File cleanup running too early
- Incorrect file paths
- Permission issues
- Disk space issues

**Solutions**:
```javascript
// Enhanced file handling with validation
async synthesizeSpeech(text, options = {}) {
  const outputId = uuidv4();
  const outputFileName = `${outputId}.${format}`;
  const outputPath = path.join(this.outputDir, outputFileName);
  
  try {
    // Ensure output directory exists
    await fs.ensureDir(this.outputDir);
    
    // Generate speech
    const result = await this.generateSpeechFile(/* ... */);
    
    // Verify file was created
    if (!await fs.pathExists(outputPath)) {
      throw new Error(`Audio file was not created: ${outputPath}`);
    }
    
    // Check file size
    const stats = await fs.stat(outputPath);
    if (stats.size === 0) {
      throw new Error(`Generated audio file is empty: ${outputPath}`);
    }
    
    console.log(`✅ Audio file created: ${outputFileName} (${stats.size} bytes)`);
    
    return {
      id: outputId,
      filename: outputFileName,
      path: outputPath,
      url: `/audio/${outputFileName}`,
      format: format,
      engine: engine,
      language: language,
      duration: await this.getAudioDuration(outputPath)
    };
  } catch (error) {
    // Clean up failed file
    await fs.remove(outputPath).catch(() => {});
    throw error;
  }
}
```

#### Audio Format Issues
**Symptoms**: Audio files cannot be played or downloaded

**Solutions**:
```javascript
// Enhanced format conversion with validation
convertAudioFormat(inputPath, outputPath, format) {
  return new Promise((resolve, reject) => {
    // Verify input file exists
    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Input file not found: ${inputPath}`));
    }

    let command = ffmpeg(inputPath);

    // Enhanced format handling
    switch (format) {
      case 'mp3':
        command = command
          .audioCodec('libmp3lame')
          .audioBitrate('192k')
          .audioChannels(1)
          .audioFrequency(22050);
        break;
      case 'wav':
        command = command
          .audioCodec('pcm_s16le')
          .audioChannels(1)
          .audioFrequency(22050);
        break;
      case 'ogg':
        command = command
          .audioCodec('libvorbis')
          .audioBitrate('192k');
        break;
      default:
        return reject(new Error(`Unsupported format: ${format}`));
    }

    command
      .output(outputPath)
      .on('start', (cmdline) => {
        console.log('FFmpeg started:', cmdline);
      })
      .on('progress', (progress) => {
        console.log(`Conversion progress: ${progress.percent}%`);
      })
      .on('end', () => {
        console.log('✅ Audio conversion completed');
        resolve();
      })
      .on('error', (error) => {
        console.error('❌ Audio conversion failed:', error.message);
        reject(new Error(`Audio conversion failed: ${error.message}`));
      })
      .run();
  });
}
```

### 4. Frontend Issues

#### API Connection Issues
**Symptoms**: Frontend cannot connect to backend API

**Debug Steps**:
```javascript
// Enhanced API error handling
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request/response interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method,
      url: config.url,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running');
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded');
    }
    
    return Promise.reject(error);
  }
);
```

#### State Management Issues
**Symptoms**: UI state becomes inconsistent or unresponsive

**Solutions**:
```javascript
// Enhanced state management with validation
const [settings, setSettings] = useState({
  engine: 'espeak-ng',
  language: 'en',
  model: '',
  speaker: '',
  speed: 150,
  pitch: 50,
  volume: 100,
  format: 'mp3'
});

// Validate settings changes
const updateSettings = useCallback((newSettings) => {
  console.log('📝 Updating settings:', newSettings);
  
  // Validate speed range
  if (newSettings.speed && (newSettings.speed < 50 || newSettings.speed > 300)) {
    console.warn('Invalid speed value:', newSettings.speed);
    newSettings.speed = Math.max(50, Math.min(300, newSettings.speed));
  }
  
  // Validate pitch range
  if (newSettings.pitch && (newSettings.pitch < 0 || newSettings.pitch > 100)) {
    console.warn('Invalid pitch value:', newSettings.pitch);
    newSettings.pitch = Math.max(0, Math.min(100, newSettings.pitch));
  }
  
  setSettings(prev => ({ ...prev, ...newSettings }));
}, []);
```

## Bug Tracking System

### Issue Categories

#### Priority Levels
- **P0 - Critical**: System down, data loss, security breach
- **P1 - High**: Major feature broken, performance severely impacted
- **P2 - Medium**: Minor feature issues, workarounds available
- **P3 - Low**: Cosmetic issues, enhancement requests

#### Severity Levels
- **S1 - Blocker**: Cannot proceed with testing
- **S2 - Major**: Major functionality affected
- **S3 - Minor**: Minor functionality affected
- **S4 - Trivial**: Cosmetic or documentation issues

### Bug Report Template
```markdown
## Bug Report

**Title**: Brief description of the issue

**Environment**:
- OS: macOS/Linux/Windows
- Node.js Version: 
- Browser: Chrome/Firefox/Safari
- TTS Engines: List installed engines

**Priority**: P0/P1/P2/P3
**Severity**: S1/S2/S3/S4

**Description**:
Clear description of the issue

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots/Logs**:
Include relevant screenshots and log output

**Additional Context**:
Any other relevant information
```

## Known Issues

### Current Known Issues

#### 1. Coqui TTS Model Compatibility (Fixed)
**Issue**: French, Spanish, and Japanese models fail with PyTorch compatibility errors
**Status**: ✅ Fixed with dynamic fallback detection
**Solution**: Implemented automatic gTTS fallback with user notification
**Date Fixed**: 2025-08-11

#### 2. Rate Limiting Headers Warning
**Issue**: Express rate limit shows X-Forwarded-For header warning
**Status**: 🟡 Known Issue - Low Priority
**Workaround**: Add trust proxy configuration
```javascript
// In server/index.js
app.set('trust proxy', 1); // Trust first proxy
```

#### 3. FFmpeg Installation Dependencies
**Issue**: Audio conversion fails if FFmpeg not installed
**Status**: 📝 Documented
**Solution**: Added to setup documentation and Docker image

### Recently Fixed Issues

#### Dynamic Fallback Implementation (2025-08-11)
**Problem**: Hardcoded list of problematic models
**Solution**: Implemented dynamic error pattern detection
```javascript
// Before: Hardcoded list
const problematicModels = [
  'tts_models/fr/mai/tacotron2-DDC',
  'tts_models/ja/kokoro/tacotron2-DDC',
  'tts_models/es/mai/tacotron2-DDC'
];

// After: Dynamic detection
shouldTriggerFallback(errorMessage, modelName) {
  const compatibilityErrorPatterns = [
    /weights_only.*set to.*False/i,
    /WeightsUnpickler error/i,
    // ... more patterns
  ];
  return compatibilityErrorPatterns.some(pattern => pattern.test(errorMessage));
}
```

## Debugging Tools

### Backend Debugging

#### Debug Logging Function
```javascript
// Add to ttsService.js
debugLog(context, data) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🐛 [${context}]`, data);
  }
}

// Usage
this.debugLog('Synthesis Start', { engine, language, textLength: text.length });
```

#### Request Tracing Middleware
```javascript
// Add to server/index.js
app.use((req, res, next) => {
  const requestId = uuidv4().substring(0, 8);
  req.requestId = requestId;
  
  console.log(`🔍 [${requestId}] ${req.method} ${req.path}`);
  
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`📤 [${requestId}] Response: ${res.statusCode}`);
    originalSend.call(this, data);
  };
  
  next();
});
```

### Frontend Debugging

#### React Error Boundary
```javascript
// Add to client/src/ErrorBoundary.js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary:', error, errorInfo);
    
    // Report error to monitoring service
    if (window.analytics) {
      window.analytics.track('Frontend Error', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page and try again.</p>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Recovery Procedures

### System Recovery

#### Backend Crash Recovery
```bash
# Check if server is running
ps aux | grep "node.*index.js"

# Restart with PM2 (production)
pm2 restart advanced-tts

# Restart manually (development)
cd server && npm run dev

# Check logs
tail -f server/logs/combined.log
```

#### Frontend Recovery
```bash
# Clear React cache
rm -rf client/node_modules/.cache

# Rebuild
cd client && npm run build

# Check for build errors
npm run build 2>&1 | grep ERROR
```

### Data Recovery

#### Audio File Recovery
```javascript
// Recover lost audio files from temp directory
async recoverAudioFiles() {
  try {
    const tempFiles = await fs.readdir(this.tempDir);
    const wavFiles = tempFiles.filter(file => file.endsWith('.wav'));
    
    for (const file of wavFiles) {
      const tempPath = path.join(this.tempDir, file);
      const outputPath = path.join(this.outputDir, file.replace('.wav', '.mp3'));
      
      await this.convertAudioFormat(tempPath, outputPath, 'mp3');
      console.log(`Recovered: ${file}`);
    }
  } catch (error) {
    console.error('Recovery failed:', error);
  }
}
```

## Performance Issues

### Memory Leaks

#### Detection
```javascript
// Monitor memory usage
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory Usage:', {
    rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB'
  });
}, 30000); // Every 30 seconds
```

#### Prevention
```javascript
// Proper cleanup in synthesis
async synthesizeSpeech(text, options = {}) {
  const tempFiles = [];
  
  try {
    // Track temp files for cleanup
    tempFiles.push(tempWavPath);
    
    // ... synthesis logic ...
    
    return response;
  } catch (error) {
    throw error;
  } finally {
    // Always cleanup temp files
    await Promise.all(
      tempFiles.map(file => fs.remove(file).catch(() => {}))
    );
  }
}
```

## Security Issues

### Input Validation

#### Text Input Sanitization
```javascript
// Enhanced input validation
function validateSynthesisInput(req, res, next) {
  const { text, engine, language } = req.body;
  
  // Text validation
  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: { code: 'TEXT_REQUIRED', message: 'Text is required' }
    });
  }
  
  // Length check
  if (text.length > 5000) {
    return res.status(400).json({
      success: false,
      error: { code: 'TEXT_TOO_LONG', message: 'Text exceeds maximum length' }
    });
  }
  
  // Sanitize text (remove potentially dangerous characters)
  req.body.text = text
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[`${}]/g, '') // Remove shell injection characters
    .trim();
  
  next();
}
```

### File System Security

#### Path Traversal Prevention
```javascript
// Secure file serving
app.use('/audio', (req, res, next) => {
  const filename = req.params[0];
  
  // Validate filename
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({
      error: 'Invalid filename'
    });
  }
  
  // Check file exists in output directory only
  const filePath = path.join(__dirname, 'output', filename);
  if (!filePath.startsWith(path.join(__dirname, 'output'))) {
    return res.status(403).json({
      error: 'Access denied'
    });
  }
  
  next();
});
```

This comprehensive troubleshooting guide provides developers and system administrators with the tools and knowledge needed to effectively diagnose, fix, and prevent issues in the AdvancedTTS system.
