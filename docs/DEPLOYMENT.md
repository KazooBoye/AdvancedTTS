# Deployment Guide

## Local Development

### Prerequisites
- Node.js 16+ and npm
- TTS engines (espeak, espeak-ng, festival)

### Setup
```bash
# Clone repository
git clone <repository-url>
cd AdvancedTTS

# Run setup script
./scripts/setup.sh

# Start development server
npm run dev
```

## Production Deployment

### Option 1: Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t advanced-tts .
docker run -p 3000:5000 advanced-tts
```

### Option 2: Manual Installation

```bash
# Install dependencies
npm run install:all

# Build client
cd client && npm run build && cd ..

# Install TTS engines (Ubuntu/Debian)
sudo apt-get install espeak espeak-ng festival pico-utils

# Start production server
npm start
```

### Option 3: PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Environment Variables

Create `.env` file in server directory:

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=http://your-domain.com

# TTS Settings
DEFAULT_ENGINE=espeak-ng
MAX_TEXT_LENGTH=50000
AUDIO_FORMAT=mp3

# Security
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /audio/ {
        alias /path/to/app/server/output/;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }
}
```

## SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Performance Optimization

### Server Optimization
- Use PM2 cluster mode
- Enable gzip compression
- Set up CDN for audio files
- Configure rate limiting
- Use Redis for caching

### Client Optimization
- Enable service worker for caching
- Compress audio files
- Use lazy loading
- Minimize bundle size

## Monitoring

### Health Checks
```bash
# Check server health
curl http://localhost:5000/api/health

# Check engines
curl http://localhost:5000/api/engines
```

### Log Management
```bash
# View PM2 logs
pm2 logs

# View Docker logs
docker-compose logs -f
```

## Backup Strategy

### Database Backup
- No database required (stateless application)

### Audio Files
```bash
# Backup audio output
rsync -av /path/to/app/server/output/ /backup/location/
```

## Security Considerations

1. **Rate Limiting**: Implemented per IP
2. **Input Validation**: Text length and parameter validation
3. **File Cleanup**: Automatic cleanup of old audio files
4. **CORS**: Configured for specific domains
5. **Helmet**: Security headers enabled

## Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Share audio files via NFS or S3
- Use Redis for session management

### Vertical Scaling
- Increase server resources
- Optimize TTS engine settings
- Use SSD for faster I/O

## Troubleshooting

### Common Issues
1. **TTS Engine Not Found**: Install missing engines
2. **Audio Generation Fails**: Check file permissions
3. **High Memory Usage**: Implement audio file cleanup
4. **Slow Response**: Optimize engine settings

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm start
```
