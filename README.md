# Hytale Username Checker

A beautiful, client-side web application for checking Hytale username availability in bulk.

🌐 **[Live Demo](https://yourusername.github.io/hytale)** *(Replace with your GitHub Pages URL)*

![Hytale Username Checker](https://img.shields.io/badge/status-active-success.svg)
![GitHub Pages](https://img.shields.io/badge/deployed-github%20pages-blue.svg)

## ✨ Features

- 🚀 **Bulk Checking** - Check multiple usernames at once
- ⚡ **Real-time Results** - See availability as checks complete
- 📊 **Live Statistics** - Track progress with detailed stats
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 💾 **Export Results** - Download available usernames as a text file
- 🔄 **Concurrent Requests** - Configurable parallel checking
- ⏸️ **Stop/Resume** - Pause checking at any time
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🌐 **Client-Side Only** - No server required, works on GitHub Pages

## 🚀 Quick Start

### Option 1: Use GitHub Pages (Recommended)

1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` → `/root`
   - Click Save
3. **Access your site** at `https://yourusername.github.io/hytale`

### Option 2: Run Locally

Simply open `index.html` in your web browser. No build process or server required!

## 📖 How to Use

1. **Enter Usernames**
   - Type or paste usernames into the text area (one per line)
   - Or use the Node.js script to generate a list

2. **Configure Settings** (Optional)
   - **Delay**: Time between batches in milliseconds (default: 200ms)
   - **Concurrent**: Number of simultaneous checks (default: 5)

3. **Start Checking**
   - Click "🚀 Start Checking"
   - Watch real-time progress and results

4. **View Results**
   - Switch between tabs: All, Available, Taken, Errors
   - See live statistics

5. **Export Available Usernames**
   - Click "💾 Export Available" to download a text file

## 🎮 Node.js Scripts (Optional)

The repository also includes Node.js scripts for advanced usage:

### Install Dependencies
```bash
npm install
```

### Run Username Checker (Node.js)
```bash
npm start
```

### Update Available Usernames
```bash
npm run update
```

## 📁 Project Structure

```
hytale/
├── index.html              # Main web application (GitHub Pages)
├── checker.js              # Node.js checker script
├── update_available.js     # Result consolidation script
├── package.json            # Node.js dependencies
├── README.md               # This file
├── QUICKSTART.md           # Quick reference
└── UPDATE_UTILITY.md       # Update utility docs
```

## 🎨 Features Breakdown

### Real-Time Progress
- Live progress bar
- Statistics dashboard
- Detailed logging console

### Tabbed Results
- **All Results**: Complete list
- **Available**: Only available usernames
- **Taken**: Unavailable usernames
- **Errors**: Failed checks

### Export Functionality
- Download available usernames as `.txt`
- Timestamped filenames
- One username per line

### Rate Limit Handling
- Automatic error detection
- Configurable delays
- Concurrent request limiting

## 🔧 Configuration

### Delay Between Batches
- **Default**: 200ms
- **Range**: 0-5000ms
- **Purpose**: Avoid rate limiting

### Concurrent Requests
- **Default**: 5
- **Range**: 1-10
- **Purpose**: Speed vs. stability

## 🌐 API

Uses the public Hytale Tools API:
```
https://api.hytl.tools/check/{username}
```

Response format:
```json
{
  "available": true/false
}
```

## 📝 Example Usage

### Check Game Character Names
```
mario
luigi
sonic
link
cloud
sephiroth
```

### Check Short Names
```
ace
sky
fox
neo
max
```

### Check Your List
Paste any list of usernames you want to check!

## 🚫 Rate Limiting

If you encounter rate limiting:
1. Increase the delay (e.g., 500ms or 1000ms)
2. Reduce concurrent requests (e.g., 3 or 2)
3. Check fewer usernames at once

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project however you'd like!

## ⭐ Show Your Support

If you find this tool useful, please consider giving it a star on GitHub!

## 🔗 Links

- [Hytale Official Website](https://hytale.com/)
- [Hytale Tools API](https://hytl.tools/)

---

Made with ❤️ for the Hytale community
