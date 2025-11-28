import axios from 'axios';

async function threadsDownload(url) {
  const { data } = await axios.get('https://www.abella.icu/dl-threads?url=' + encodeURIComponent(url));
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    const result = await threadsDownload(url);
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    console.error('Threads Download Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}