# 📥 AllDL - All-in-One Social Media Downloader

Website downloader video, audio, dan gambar dari berbagai platform social media dengan desain Pinterest-style yang elegant dan modern.

## ✨ Features

### 🎯 Platform Support
- **TikTok** - Video HD/SD & Slideshow Images
- **Facebook** - Video HD/SD Quality
- **Instagram/Threads** - Photos & Videos
- **Spotify** - Audio MP3 Downloads
- **Videy** - Video Downloads

### 🎨 UI/UX Features
- **Pinterest Masonry Layout** - Responsive grid dengan 1-6 kolom
- **Live Media Preview** - Play video & audio langsung di card
- **Google Dark Theme** - Toggle dark/light mode dengan localStorage
- **Settings Panel** - Customize experience (quality, columns, auto-download)
- **Direct Download** - Download langsung tanpa redirect menggunakan Blob API

### 📊 Metadata Display
- ⏱️ **Duration** - Durasi video/audio
- 📺 **Resolution** - Kualitas video
- 👁️ **Views** - Jumlah views (formatted)
- ❤️ **Likes** - Jumlah likes
- 💬 **Comments** - Jumlah komentar
- 👤 **Author** - Nama creator

### 🎵 Audio Player
- Custom audio player dengan play/pause
- Progress bar dengan seek functionality
- Real-time duration display

## 📁 Project Structure

```
alldl-downloader/
├── index.js           # Express server dengan API endpoints
├── package.json       # Dependencies
├── README.md          # Documentation
└── public/
    └── index.html     # Frontend (Pinterest-style UI)
```

## 🚀 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm atau yarn

### Steps

1. **Clone atau Download project**
```bash
git clone <your-repo-url>
cd alldl-downloader
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Run production server**
```bash
npm start
```

5. **Open browser**
```
http://localhost:3000
```

## 📡 API Endpoints

### POST `/api/download/tiktok`
Download TikTok video atau images
```json
{
  "url": "https://vt.tiktok.com/xxxxx"
}
```

### POST `/api/download/facebook`
Download Facebook video
```json
{
  "url": "https://facebook.com/xxxxx/videos/xxxxx"
}
```

### POST `/api/download/spotify`
Download Spotify track
```json
{
  "url": "https://open.spotify.com/track/xxxxx"
}
```

### POST `/api/download/threads`
Download Instagram/Threads media
```json
{
  "url": "https://www.threads.net/@username/post/xxxxx"
}
```

### POST `/api/download/videy`
Download Videy video
```json
{
  "url": "https://videy.co/v?id=xxxxx"
}
```

### GET `/api/health`
Health check endpoint
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🎨 Features Detail

### Pinterest Masonry Layout
- Responsive columns (5 → 4 → 3 → 2 → 1)
- Break-inside: avoid untuk masonry effect
- Hover scale animation
- Custom column count di settings

### Media Preview
- **Video**: HTML5 video player dengan controls & poster
- **Audio**: Custom player dengan play/pause & progress bar
- **Image**: Lazy loading dengan full width display

### Direct Download (No Redirect)
```javascript
async function directDownload(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
    
    window.URL.revokeObjectURL(blobUrl);
}
```

### Settings Panel
- **Default Video Quality**: HD atau SD
- **Auto Download**: Toggle otomatis download
- **Show Metadata**: Toggle tampilan metadata
- **Column Count**: Adjust jumlah kolom (1-6)

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **Axios** - HTTP client
- **Cheerio** - HTML parsing
- **Form-Data** - Multipart form data

### Frontend
- **Vanilla JavaScript** - No framework
- **CSS3** - Pinterest-style masonry
- **HTML5** - Video/Audio player
- **LocalStorage** - Settings persistence

## 🎯 Usage

1. **Paste URL** di search bar
2. **Click Download** button
3. **View Preview** di masonry grid:
   - Play video/audio langsung
   - Lihat metadata lengkap
   - Pilih quality (HD/SD)
4. **Download** file dengan 1 click

## ⚙️ Settings

### Dark Mode
- Toggle di header (🌙/☀️)
- Tersimpan di localStorage
- Google dark theme (#202124)

### Column Count
- Adjust di settings panel
- Range: 1-6 kolom
- Responsive breakpoints otomatis

### Auto Download
- Enable untuk otomatis download
- Skip preview step

### Show Metadata
- Toggle tampilan views/likes/comments
- Cleanup UI jika tidak perlu

## 🔥 Tips

- Gunakan **HD Quality** untuk video berkualitas tinggi
- Enable **Auto Download** untuk download cepat
- Adjust **Column Count** sesuai screen size
- **Dark Mode** untuk penggunaan malam hari

## 📝 License

MIT License - Free to use and modify

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## ⚠️ Disclaimer

Tool ini dibuat untuk keperluan edukasi. Harap gunakan dengan bijak dan hormati hak cipta konten creator.

---

Made with ❤️ for content creators