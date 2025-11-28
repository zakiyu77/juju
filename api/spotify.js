import axios from 'axios';

async function spotifyDown(url) {
  const BASEURL = "https://api.fabdl.com";
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36"
  };

  try {
    const { data: info } = await axios.get(`${BASEURL}/spotify/get?url=${url}`, { headers });
    const { gid, id } = info.result;

    const { data: download } = await axios.get(`${BASEURL}/spotify/mp3-convert-task/${gid}/${id}`, { headers });
    
    return {
      downloadUrl: download.result.download_url ? `${BASEURL}${download.result.download_url}` : null,
      name: info.result.name,
      artist: info.result.artists,
      ...info.result
    };
  } catch (error) {
    throw new Error('Spotify download failed: ' + error.message);
  }
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
    
    const result = await spotifyDown(url);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Spotify Download Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}