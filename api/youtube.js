import axios from 'axios';
import yts from 'yt-search';

class Youtubers {
  constructor() {
    this.hex = "C5D58EF67A7584E4A29F6C35BBC4EB12";
  }

  async uint8(hex) {
    const pecahan = hex.match(/[\dA-F]{2}/gi);
    if (!pecahan) throw new Error("Format tidak valid");
    return new Uint8Array(pecahan.map(h => parseInt(h, 16)));
  }

  b64Byte(b64) {
    const bersih = b64.replace(/\s/g, "");
    const biner = Buffer.from(bersih, 'base64');
    return new Uint8Array(biner);
  }

  async key() {
    const raw = await this.uint8(this.hex);
    return await crypto.subtle.importKey("raw", raw, { name: "AES-CBC" }, false, ["decrypt"]);
  }

  async Data(base64Terenkripsi) {
    const byteData = this.b64Byte(base64Terenkripsi);
    if (byteData.length < 16) throw new Error("Data terlalu pendek");

    const iv = byteData.slice(0, 16);
    const data = byteData.slice(16);

    const kunci = await this.key();
    const hasil = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, kunci, data);

    const teks = new TextDecoder().decode(new Uint8Array(hasil));
    return JSON.parse(teks);
  }

  async getCDN() {
    let retries = 5;
    while (retries--) {
      try {
        const res = await axios.get("https://media.savetube.me/api/random-cdn");
        if (res.data?.cdn) return res.data.cdn;
      } catch {}
    }
    throw new Error("Gagal ambil CDN setelah 5 percobaan");
  }

  async infoVideo(linkYoutube) {
    const cdn = await this.getCDN();
    const res = await axios.post(
      `https://${cdn}/v2/info`,
      { url: linkYoutube },
      { headers: { "Content-Type": "application/json" }}
    );

    if (!res.data.status) throw new Error(res.data.message || "Gagal ambil data video");

    const isi = await this.Data(res.data.data);

    return {
      judul: isi.title,
      durasi: isi.durationLabel,
      thumbnail: isi.thumbnail,
      kode: isi.key
    };
  }

  async getDownloadLink(kodeVideo, kualitas) {
    let retries = 5;
    while (retries--) {
      try {
        const cdn = await this.getCDN();
        const res = await axios.post(
          `https://${cdn}/download`,
          { downloadType: 'video', quality: kualitas, key: kodeVideo },
          { headers: { "Content-Type": "application/json" }}
        );

        if (res.data?.status && res.data?.data?.downloadUrl) {
          return res.data.data.downloadUrl;
        }
      } catch {}
    }
    throw new Error("Gagal ambil link unduh setelah 5 percobaan");
  }

  async downloadVideo(linkYoutube, kualitas = '360') {
    try {
      const data = await this.infoVideo(linkYoutube);
      const url = await this.getDownloadLink(data.kode, kualitas);
      return { status: true, ...data, url };
    } catch (err) {
      return { status: false, pesan: err.message };
    }
  }
}

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) throw new Error('Format tidak didukung');

    const response = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }}
    );

    if (!response.data?.success) throw new Error("Gagal mengambil detail video.");

    return await ddownr.cekProgress(response.data.id);
  },

  cekProgress: async (id) => {
    while (true) {
      const res = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`);
      if (res.data?.success && res.data?.progress === 1000) {
        return res.data.download_url;
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

const ytdlAudio = async(searchQuery) => {
  const search = await yts(searchQuery);
  const video = search.all[0];
  const downloadUrl = await ddownr.download(video.url, "mp3");
  return {
    title: video.title,
    url: downloadUrl,
    thumbnail: video.thumbnail,
    duration: video.timestamp
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { url, quality = '360', type = 'video' } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: "URL required" });
    }

    if (type === "audio") {
      const result = await ytdlAudio(url);
      return res.status(200).json({ success: true, data: { type, ...result }});
    }

    const yt = new Youtubers();
    const result = await yt.downloadVideo(url, quality);

    if (!result.status) {
      throw new Error(result.pesan);
    }

    return res.status(200).json({ success: true, data: { type: 'video', ...result }});

  } catch (error) {
    console.error('YouTube Download Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}