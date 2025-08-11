# AdvancedTTS - Complete API Documentation

## Table of Contents
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Base URL & Headers](#base-url--headers)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Error Codes](#error-codes)
- [SDK & Integration](#sdk--integration)

## API Overview

The AdvancedTTS API provides RESTful endpoints for text-to-speech synthesis, engine management, and language detection. The API supports multiple TTS engines with automatic fallback mechanisms and comprehensive error handling.

### API Version
- **Current Version**: v1
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Encoding**: UTF-8

## Authentication

Currently, the API does not require authentication. However, it implements:
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Restricted to configured origins
- **Request Size Limits**: 50MB maximum

## Base URL & Headers

### Base URL
```
Development: http://localhost:5001/api
Production: https://your-domain.com/api
```

### Required Headers
```http
Content-Type: application/json
Accept: application/json
```

### Optional Headers
```http
Accept-Language: en-US,en;q=0.9  # For UI language preferences
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)",
    "timestamp": "2025-08-11T10:30:00.000Z"
  }
}
```

### Success Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers Returned**:
  ```http
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1628686200
  ```

## Endpoints

### 1. Health Check

Check API availability and status.

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-08-11T10:30:00.000Z",
    "version": "1.0.0",
    "engines": {
      "total": 8,
      "available": 6
    }
  }
}
```

### 2. Engine Management

#### Get All Available Engines

```http
GET /engines
```

**Response:**
```json
{
  "success": true,
  "data": {
    "coqui": {
      "name": "Coqui TTS",
      "description": "High-quality neural text-to-speech models",
      "supports": {
        "ssml": true,
        "speed": true,
        "pitch": false,
        "volume": false
      },
      "languages": [
        {
          "code": "en",
          "name": "English", 
          "variants": ["en-us", "en-gb", "en-au"]
        }
      ]
    },
    "gtts": {
      "name": "Google Text-to-Speech",
      "description": "High-quality neural voices from Google",
      "supports": {
        "ssml": false,
        "speed": true,
        "pitch": false,
        "volume": false
      },
      "languages": [
        {
          "code": "en",
          "name": "English",
          "variants": ["en-us", "en-gb", "en-au"]
        }
      ]
    }
  }
}
```

#### Get Engine Models

```http
GET /engines/{engine}/models?language={language}
```

**Parameters:**
- `engine` (path): Engine identifier (e.g., "coqui")
- `language` (query): Language code (e.g., "en", "fr")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ljspeech-vits",
      "name": "LJSpeech VITS",
      "model_name": "tts_models/en/ljspeech/vits",
      "quality": "High",
      "speakers": ["female"],
      "status": "working"
    },
    {
      "id": "vctk-vits",
      "name": "VCTK Multi-Speaker",
      "model_name": "tts_models/en/vctk/vits",
      "quality": "High", 
      "speakers": ["p225", "p226", "p227"],
      "status": "working"
    }
  ]
}
```

### 3. Language Management

#### Get Supported Languages

```http
GET /languages
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "en",
      "name": "English",
      "nativeName": "English",
      "variants": [
        {
          "code": "en-us",
          "name": "English (US)",
          "engines": ["coqui", "gtts", "espeak-ng"]
        },
        {
          "code": "en-gb", 
          "name": "English (UK)",
          "engines": ["coqui", "gtts", "espeak-ng"]
        }
      ]
    }
  ]
}
```

#### Detect Text Language

```http
POST /languages/detect
```

**Request Body:**
```json
{
  "text": "Hello, this is a sample text for language detection."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "detected": "en",
    "confidence": 0.95,
    "alternatives": [
      {
        "language": "en-us",
        "confidence": 0.95
      },
      {
        "language": "en-gb", 
        "confidence": 0.03
      }
    ]
  }
}
```

### 4. Text-to-Speech Synthesis

#### Synthesize Speech

```http
POST /tts/synthesize
```

**Request Body:**
```json
{
  "text": "Hello, this is a test message for text-to-speech synthesis.",
  "engine": "coqui",
  "language": "en-us",
  "model": "tts_models/en/ljspeech/vits",
  "speaker": "female",
  "speed": 150,
  "pitch": 50,
  "volume": 100,
  "format": "mp3"
}
```

**Parameters:**
- `text` (required): Text to synthesize (max 5000 characters)
- `engine` (optional): TTS engine to use (default: "espeak-ng")
- `language` (optional): Language code (default: "en")
- `model` (optional): Specific model for engines that support it
- `speaker` (optional): Speaker selection for multi-speaker models
- `speed` (optional): Speech speed 50-300 (default: 150)
- `pitch` (optional): Voice pitch 0-100 (default: 50)
- `volume` (optional): Audio volume 0-100 (default: 100)
- `format` (optional): Output format "mp3"|"wav"|"ogg"|"m4a" (default: "mp3")

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "550e8400-e29b-41d4-a716-446655440000.mp3",
    "path": "/path/to/output/file.mp3",
    "url": "/audio/550e8400-e29b-41d4-a716-446655440000.mp3",
    "format": "mp3",
    "engine": "coqui",
    "language": "en-us",
    "duration": 3.842,
    "fallback": {
      "used": false
    }
  },
  "message": "Speech synthesized successfully"
}
```

**Response with Fallback:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "550e8400-e29b-41d4-a716-446655440000.mp3",
    "path": "/path/to/output/file.mp3",
    "url": "/audio/550e8400-e29b-41d4-a716-446655440000.mp3",
    "format": "mp3",
    "engine": "coqui",
    "language": "en-us",
    "duration": 3.842,
    "fallback": {
      "used": true,
      "originalEngine": "coqui",
      "actualEngine": "gTTS",
      "reason": "Model compatibility issue"
    }
  },
  "message": "Speech synthesized successfully using fallback engine"
}
```

#### Preview Synthesis

Generate a short preview (first 100 characters) for testing.

```http
POST /tts/preview
```

**Request Body:** Same as synthesize but text is automatically truncated to 100 characters.

**Response:** Same format as synthesize endpoint.

### 5. Audio File Access

#### Download Audio File

```http
GET /audio/{filename}
```

**Parameters:**
- `filename` (path): Audio filename from synthesis response

**Response:** Audio file stream with appropriate headers
```http
Content-Type: audio/mpeg (or audio/wav, etc.)
Content-Disposition: inline; filename="audio.mp3"
Content-Length: 42367
Cache-Control: public, max-age=3600
```

## Request/Response Examples

### Complete Synthesis Example

**Request:**
```bash
curl -X POST http://localhost:5001/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world, this is a test of the text-to-speech system.",
    "engine": "coqui",
    "language": "en-us",
    "model": "tts_models/en/ljspeech/vits",
    "speed": 150,
    "format": "mp3"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "filename": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3",
    "url": "/audio/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3",
    "format": "mp3",
    "engine": "coqui",
    "language": "en-us",
    "duration": 4.2,
    "fallback": {
      "used": false
    }
  },
  "message": "Speech synthesized successfully"
}
```

### Multi-Language Example

**Request:**
```bash
curl -X POST http://localhost:5001/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour, comment allez-vous aujourd'\''hui?",
    "engine": "gtts",
    "language": "fr",
    "speed": 120,
    "format": "wav"
  }'
```

### Error Example

**Request with Invalid Engine:**
```bash
curl -X POST http://localhost:5001/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "engine": "invalid-engine"
  }'
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "ENGINE_NOT_AVAILABLE",
    "message": "TTS engine invalid-engine is not available on this system",
    "timestamp": "2025-08-11T10:30:00.000Z"
  }
}
```

## Error Codes

### Client Errors (4xx)

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request body or parameters |
| `TEXT_TOO_LONG` | 400 | Text exceeds maximum length (5000 chars) |
| `TEXT_REQUIRED` | 400 | Text field is required |
| `INVALID_ENGINE` | 400 | Specified engine is not supported |
| `INVALID_LANGUAGE` | 400 | Language code is not supported |
| `INVALID_FORMAT` | 400 | Audio format is not supported |
| `INVALID_PARAMETERS` | 400 | Speed, pitch, or volume out of range |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

### Server Errors (5xx)

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `ENGINE_NOT_AVAILABLE` | 503 | TTS engine is not installed or accessible |
| `SYNTHESIS_FAILED` | 500 | TTS synthesis process failed |
| `CONVERSION_FAILED` | 500 | Audio format conversion failed |
| `FILE_SYSTEM_ERROR` | 500 | File I/O operation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Fallback Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `FALLBACK_FAILED` | 500 | Primary engine failed and fallback also failed |
| `NO_FALLBACK_AVAILABLE` | 503 | No suitable fallback engine available |

## SDK & Integration

### JavaScript/Node.js Example

```javascript
class TTSClient {
  constructor(baseURL = 'http://localhost:5001/api') {
    this.baseURL = baseURL;
  }

  async synthesize(options) {
    const response = await fetch(`${this.baseURL}/tts/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options)
    });
    
    return response.json();
  }

  async getEngines() {
    const response = await fetch(`${this.baseURL}/engines`);
    return response.json();
  }

  getAudioURL(filename) {
    return `${this.baseURL.replace('/api', '')}/audio/${filename}`;
  }
}

// Usage
const tts = new TTSClient();
const result = await tts.synthesize({
  text: "Hello world",
  engine: "gtts",
  language: "en"
});
```

### Python Example

```python
import requests
import json

class TTSClient:
    def __init__(self, base_url="http://localhost:5001/api"):
        self.base_url = base_url
    
    def synthesize(self, text, **kwargs):
        payload = {"text": text, **kwargs}
        response = requests.post(
            f"{self.base_url}/tts/synthesize",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        return response.json()
    
    def download_audio(self, filename, output_path):
        audio_url = f"{self.base_url.replace('/api', '')}/audio/{filename}"
        response = requests.get(audio_url)
        with open(output_path, 'wb') as f:
            f.write(response.content)

# Usage
tts = TTSClient()
result = tts.synthesize(
    text="Hello world",
    engine="gtts",
    language="en",
    format="mp3"
)
```

### cURL Examples

```bash
# Basic synthesis
curl -X POST http://localhost:5001/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "engine": "gtts"}'

# Advanced synthesis with all parameters
curl -X POST http://localhost:5001/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Advanced synthesis with custom parameters",
    "engine": "coqui",
    "language": "en-us",
    "model": "tts_models/en/ljspeech/vits",
    "speed": 130,
    "pitch": 45,
    "volume": 90,
    "format": "wav"
  }'

# Download generated audio
curl -O http://localhost:5001/audio/filename.mp3

# Get available engines
curl http://localhost:5001/api/engines

# Health check
curl http://localhost:5001/api/health
```

## WebSocket Support (Future)

**Note**: WebSocket support is planned for future versions to enable real-time streaming synthesis.

### Planned WebSocket Endpoints

```
ws://localhost:5001/ws/tts/stream
```

### Planned Message Format

```json
{
  "type": "synthesize",
  "data": {
    "text": "Streaming text...",
    "engine": "coqui",
    "language": "en"
  }
}
```

## Monitoring & Analytics

### Request Logging

All API requests are logged with the following information:
- Timestamp
- IP address
- Endpoint accessed
- Request parameters
- Response status
- Processing time
- Engine used
- Fallback status

### Metrics Available

- Request count by endpoint
- Average response time
- Success/failure rates
- Engine usage statistics
- Language distribution
- Error frequency by type

These metrics can be accessed through log files or integrated monitoring solutions.
