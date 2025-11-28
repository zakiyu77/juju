import axios from 'axios';
import FormData from 'form-data';
import * as cheerio from 'cheerio';

async function tiktokV1(query) {
  const encodedParams = new URLSearchParams();
  encodedParams.set('url', query);
  encodedParams.set('hd', '1');

  const { data } = await axios.post('https://tikwm.com/api/', encodedParams, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
    }
  });

  return data;
}

async function tiktokV2(query) {
  const form = new FormData();
  form.append('q', query);

  const { data } = await axios.post('https://savetik.co/api/ajaxSearch', form, {
    headers: {
      ...form.getHeaders(),
      'Accept': '*/*',
      'Origin': 'https://savetik.co',
      'Referer': 'https://savetik.co/en2',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  const rawHtml = data.data;
  const $ = cheerio.load(rawHtml);
  const title = $('.thumbnail .content h3').text().trim();
  const thumbnail = $('.thumbnail .image-tik img').attr('src');
  const video_url = $('video#vid').attr('data-src');

  const slide_images = [];
  $('.photo-list .download-box li').each((_, el) => {
    const imgSrc = $(el).find('.download-items__thumb img').attr('src');
    if (imgSrc) slide_images.push(imgSrc);
  });

  return { title, thumbnail, video_url, slide_images };
}

async function tiktokImageDownload(url) {
  const mainUrl = `https://dlpanda.com/id?url=${url}&token=G7eRpMaa`;
  const backupUrl = `https://dlpanda.com/id?url=${url}&token51=G32254GLM09MN89Maa`;

  try {
    let response = await axios.get(mainUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      }
    });

    const $ = cheerio.load(response.data);
    let imgSrc = [];

    $('div.col-md-12 > img').each((index, element) => {
      imgSrc.push($(element).attr('src'));
    });

    if (imgSrc.length === 0) {
      response = await axios.get(backupUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
        }
      });

      const $2 = cheerio.load(response.data);
      $2('div.col-md-12 > img').each((index, element) => {
        imgSrc.push($2(element).attr('src'));
      });
    }

    return imgSrc;
  } catch (error) {
    throw new Error('TikTok image download failed: ' + error.message);
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
    
    let result = await tiktokV1(url);
    
    // Fallback ke V2 jika V1 gagal
    if (!result?.data) {
      const v2Data = await tiktokV2(url);
      result = { data: v2Data };
    }

    // Cek jika ada slide images
    if (result.data && !result.data.play && !result.data.video_url) {
      const images = await tiktokImageDownload(url);
      if (images.length > 0) {
        result.data.images = images;
      }
    }

    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    console.error('TikTok Download Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}