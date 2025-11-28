import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';

const fdown = {
  getToken: async () => {
    try {
      const response = await axios.get('https://fdown.net', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        }
      });
      const $ = cheerio.load(response.data);
      return {
        token_v: $('input[name="token_v"]').val(),
        token_c: $('input[name="token_c"]').val(),
        token_h: $('input[name="token_h"]').val()
      };
    } catch (error) {
      throw new Error(`Error fetching tokens: ${error.message}`);
    }
  },

  download: async (url) => {
    const { token_v, token_c, token_h } = await fdown.getToken();
    const data = qs.stringify({
      'URLz': url,
      'token_v': token_v,
      'token_c': token_c,
      'token_h': token_h
    });

    const response = await axios.post('https://fdown.net/download.php', data, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'referer': 'https://fdown.net/',
      }
    });

    const $ = cheerio.load(response.data);
    return {
      normalQualityLink: $('#sdlink').attr('href'),
      hdQualityLink: $('#hdlink').attr('href')
    };
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    const result = await fdown.download(url);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Facebook Download Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}