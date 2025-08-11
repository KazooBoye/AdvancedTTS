# API Documentation

## Base URL
`http://localhost:5001/api`

## Endpoints

### Health Check
- **GET** `/health`
- Returns server health status

### TTS Endpoints

#### Synthesize Speech
- **POST** `/tts/synthesize`
- Generate speech from text

**Request Body:**
```json
{
  "text": "Your text here",
  "engine": "espeak-ng",
  "language": "en",
  "speed": 150,
  "pitch": 50,
  "volume": 100,
  "format": "mp3"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "uuid.mp3",
    "url": "/audio/uuid.mp3",
    "format": "mp3",
    "engine": "espeak-ng",
    "language": "en",
    "duration": 5.2
  }
}
```

#### Preview Speech
- **POST** `/tts/preview`
- Generate preview of first 200 characters

**Request Body:** Same as synthesize

#### Check Status
- **GET** `/tts/status/:id`
- Check synthesis status

### Engine Endpoints

#### Get Available Engines
- **GET** `/engines`
- Returns all available TTS engines

**Response:**
```json
{
  "success": true,
  "data": {
    "espeak-ng": {
      "name": "eSpeak NG",
      "description": "Modern TTS engine",
      "languages": [...],
      "supports": {
        "ssml": true,
        "speed": true,
        "pitch": true,
        "volume": true
      }
    }
  }
}
```

#### Check Engine Availability
- **GET** `/engines/:engineName/check`
- Check if specific engine is available

### Language Endpoints

#### Get All Languages
- **GET** `/languages`
- Returns all supported languages

#### Get Languages for Engine
- **GET** `/languages/:engineName`
- Returns languages supported by specific engine

## Parameters

### Text
- **Required:** Yes
- **Type:** String
- **Max Length:** 50,000 characters

### Engine
- **Default:** "espeak-ng"
- **Options:** "espeak-ng", "espeak", "festival", "pico"

### Language
- **Default:** "en"
- **Format:** Language code (e.g., "en", "vi", "es")

### Speed
- **Default:** 150
- **Range:** 50-300
- **Unit:** Words per minute

### Pitch
- **Default:** 50
- **Range:** 0-100
- **Unit:** Percentage

### Volume
- **Default:** 100
- **Range:** 0-100
- **Unit:** Percentage

### Format
- **Default:** "mp3"
- **Options:** "mp3", "wav", "ogg", "m4a"

## Error Responses

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

- **Synthesis:** 10 requests per minute per IP
- **General:** 100 requests per 15 minutes per IP
