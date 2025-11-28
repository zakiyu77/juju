import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import handlers
import facebook from './api/facebook.js';
import tiktok from './api/tiktok.js';
import youtube from './api/youtube.js';
import spotify from './api/spotify.js';
import threads from './api/threads.js';
import videy from './api/videy.js';
import statusHandler from './api/status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Request logger & timestamp
app.use((req, res, next) => {
  req.timestamp = Date.now();
  const timestamp = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Status endpoint (Main health check)
app.get('/api/status', statusHandler);

// Health check (redirect to status)
app.get('/api/health', (req, res) => {
  res.redirect(301, '/api/status');
});

// API root endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: '👋 Welcome to AIO Downloader API!',
    version: '1.0.0',
    endpoints: {
      status: 'GET /api/status - Check server status',
      health: 'GET /api/health - Health check (redirects to /api/status)',
      downloads: {
        facebook: 'POST /api/download/facebook',
        tiktok: 'POST /api/download/tiktok',
        youtube: 'POST /api/download/youtube',
        spotify: 'POST /api/download/spotify',
        threads: 'POST /api/download/threads',
        videy: 'POST /api/download/videy'
      }
    },
    usage: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        url: 'string (required)',
        quality: 'string (optional, youtube only)',
        type: 'string (optional, youtube only: video/audio)'
      }
    },
    documentation: 'https://github.com/yourusername/aio-downloader',
    support: 'email@example.com'
  });
});

// Download Routes
app.post('/api/download/facebook', facebook);
app.post('/api/download/tiktok', tiktok);
app.post('/api/download/youtube', youtube);
app.post('/api/download/spotify', spotify);
app.post('/api/download/threads', threads);
app.post('/api/download/videy', videy);

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.url} does not exist`,
    availableEndpoints: [
      'GET  /api - API information',
      'GET  /api/status - Server status',
      'GET  /api/health - Health check',
      'POST /api/download/facebook',
      'POST /api/download/tiktok',
      'POST /api/download/youtube',
      'POST /api/download/spotify',
      'POST /api/download/threads',
      'POST /api/download/videy'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║         🚀 AIO Downloader Server Started            ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📡 Server Information:');
  console.log(`   Local:        http://localhost:${PORT}`);
  console.log(`   Network:      http://0.0.0.0:${PORT}`);
  console.log(`   Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Node Version: ${process.version}`);
  console.log(`   Platform:     ${process.platform}`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log('   GET  /api              - API information');
  console.log('   GET  /api/status       - Server status dashboard');
  console.log('   GET  /api/health       - Health check');
  console.log('');
  console.log('   POST /api/download/facebook   - Facebook downloader');
  console.log('   POST /api/download/tiktok     - TikTok downloader');
  console.log('   POST /api/download/youtube    - YouTube downloader');
  console.log('   POST /api/download/spotify    - Spotify downloader');
  console.log('   POST /api/download/threads    - Instagram/Threads');
  console.log('   POST /api/download/videy      - Videy downloader');
  console.log('');
  console.log('🎯 Supported Platforms:');
  console.log('   📘 Facebook   🎵 TikTok     🎥 YouTube');
  console.log('   🎧 Spotify    📸 Threads    🎬 Videy');
  console.log('');
  console.log('✨ Server ready! Press Ctrl+C to stop');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;