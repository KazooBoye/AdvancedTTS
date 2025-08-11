const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

const ttsRoutes = require('./routes/tts');
const languageRoutes = require('./routes/languages');
const engineRoutes = require('./routes/engines');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://172.19.80.24:3000',  // WSL network IP
    'http://192.168.1.64:3000',  // Your Windows network IP
    /^http:\/\/172\.19\.\d+\.\d+:3000$/,  // WSL subnet
    /^http:\/\/192\.168\.1\.\d+:3000$/,   // Local network subnet
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create necessary directories
const createDirectories = async () => {
  const dirs = ['./temp', './output', './cache'];
  for (const dir of dirs) {
    await fs.ensureDir(dir);
  }
};

// Static files - serve generated audio files with proper headers
app.use('/audio', (req, res, next) => {
  // Set CORS headers for audio files - allow all origins in development
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Set proper content type for audio files
  if (req.path.endsWith('.wav')) {
    res.type('audio/wav');
  } else if (req.path.endsWith('.mp3')) {
    res.type('audio/mpeg');
  } else if (req.path.endsWith('.ogg')) {
    res.type('audio/ogg');
  } else if (req.path.endsWith('.m4a')) {
    res.type('audio/mp4');
  }
  
  // Enable range requests for audio seeking
  res.header('Accept-Ranges', 'bytes');
  
  next();
}, express.static(path.join(__dirname, 'output')));

// Routes
app.use('/api/tts', ttsRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/engines', engineRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize server
const startServer = async () => {
  try {
    await createDirectories();
    console.log('📁 Directories created successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Network access: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
