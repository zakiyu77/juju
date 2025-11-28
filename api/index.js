export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    success: true,
    message: '👋 Welcome to AIO Downloader API!',
    version: '1.0.0',
    name: 'AIO Downloader',
    description: 'All-in-One Social Media Downloader API',
    
    endpoints: {
      system: {
        status: {
          method: 'GET',
          url: '/api/status',
          description: 'Detailed server status dashboard'
        },
        health: {
          method: 'GET',
          url: '/api/health',
          description: 'Simple health check'
        }
      },
      downloads: {
        facebook: {
          method: 'POST',
          url: '/api/download/facebook',
          description: 'Download Facebook videos',
          body: { url: 'string (required)' }
        },
        tiktok: {
          method: 'POST',
          url: '/api/download/tiktok',
          description: 'Download TikTok videos/images',
          body: { url: 'string (required)' }
        },
        youtube: {
          method: 'POST',
          url: '/api/download/youtube',
          description: 'Download YouTube videos/audio',
          body: { 
            url: 'string (required)',
            quality: 'string (optional: 360, 720, 1080)',
            type: 'string (optional: video, audio)'
          }
        },
        spotify: {
          method: 'POST',
          url: '/api/download/spotify',
          description: 'Download Spotify tracks',
          body: { url: 'string (required)' }
        },
        threads: {
          method: 'POST',
          url: '/api/download/threads',
          description: 'Download Instagram/Threads content',
          body: { url: 'string (required)' }
        },
        videy: {
          method: 'POST',
          url: '/api/download/videy',
          description: 'Download Videy videos',
          body: { url: 'string (required)' }
        }
      }
    },

    supported_platforms: [
      { name: 'Facebook', icon: '📘', active: true },
      { name: 'TikTok', icon: '🎵', active: true },
      { name: 'YouTube', icon: '🎥', active: true },
      { name: 'Spotify', icon: '🎧', active: true },
      { name: 'Instagram/Threads', icon: '📸', active: true },
      { name: 'Videy', icon: '🎬', active: true }
    ],

    usage_example: {
      curl: 'curl -X POST https://your-domain.vercel.app/api/download/tiktok -H "Content-Type: application/json" -d \'{"url":"https://tiktok.com/..."}\'',
      javascript: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://tiktok.com/...' })
      }
    },

    links: {
      documentation: 'https://github.com/yourusername/aio-downloader',
      repository: 'https://github.com/yourusername/aio-downloader',
      issues: 'https://github.com/yourusername/aio-downloader/issues',
      support: 'email@example.com'
    },

    timestamp: new Date().toISOString()
  });
}