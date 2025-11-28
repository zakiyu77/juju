export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    const parsed = new URL(url);
    const id = parsed.searchParams.get('id');
    
    if (!id) {
      throw new Error('Invalid URL: missing id parameter');
    }
    
    const videoUrl = `https://cdn.videy.co/${id}.mp4`;
    return res.status(200).json({ success: true, data: { videoUrl, id } });
  } catch (error) {
    console.error('Videy Download Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}