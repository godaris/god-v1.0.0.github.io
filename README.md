# GOD v1.0.0 - Professional AI Assistant

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-stable-success?style=for-the-badge)

**A modern, professional AI assistant interface with Claude-inspired design**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [💬 Features](#-features) • [🛠️ Installation](#️-installation)

</div>

---

## ✨ Features

### 🎨 Professional UI/UX
- **Modern Claude-Style Design** - Clean, professional interface
- **Responsive Layout** - Works perfectly on all devices
- **Dark/Light Themes** - Easy on the eyes, day or night
- **Smooth Animations** - Professional transitions and effects

### 🔌 Dual Mode Support
- **☁️ Cloud Mode** - Use Anthropic's Claude API
- **💻 Local Mode** - Run with Ollama (100% private & offline)
- **Easy Switching** - Toggle between modes in settings

### 🎤 Voice Features
- **Speech-to-Text** - Voice input for messages
- **Text-to-Speech** - Hear responses aloud
- **Voice Mode** - Hands-free conversation
- **Adjustable Speed** - 0.5x to 2.0x playback

### 💬 Chat Management
- **Auto-Save History** - Never lose a conversation
- **Organized by Date** - Today, Yesterday, Last 7 Days
- **Search & Resume** - Pick up where you left off
- **Export Chats** - Save important conversations

### 🛡️ Privacy First
- **Local Storage** - All data stays on your device
- **No Tracking** - Zero analytics or telemetry
- **Open Source** - Fully transparent code
- **Secure** - API keys stored locally

---

## 🚀 Quick Start

### Option 1: GitHub Pages (Easiest - 2 Minutes!)

1. **Fork this repository**
2. Go to **Settings** → **Pages**
3. Source: **main** branch
4. **Done!** Your app is live at `https://yourusername.github.io/GOD-v1.0.0/`

### Option 2: Local (3 Minutes!)

```bash
# Download the repository
git clone https://github.com/yourusername/GOD-v1.0.0.git
cd GOD-v1.0.0

# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh

# Or Python directly
python server.py
```

Visit `http://localhost:8000` - that's it!

---

## 📦 Installation

### Prerequisites

- **Modern web browser** (Chrome, Firefox, Edge, Safari)
- **Python 3.7+** (for local server)
- **API Key** (Anthropic) OR **Ollama** (for local mode)

### Getting Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up / Log in
3. Go to API Keys
4. Create new key
5. Copy and save it

### Setting Up Ollama (Local Mode)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama
ollama serve

# Pull a model
ollama pull llama3.2

# You're ready!
```

---

## ⚙️ Configuration

### First Time Setup

1. Open the app
2. Click **Settings** (⚙️ icon)
3. Choose your mode:
   - **Cloud**: Enter your Anthropic API key
   - **Local**: Set Ollama URL (default: `http://localhost:11434`)
4. Select your model
5. Click **Save Settings**
6. Start chatting!

### Available Settings

| Setting | Options | Description |
|---------|---------|-------------|
| Mode | Cloud / Local | Choose API source |
| Theme | Dark / Light | Interface appearance |
| Streaming | On / Off | Real-time responses |
| Voice | On / Off | Enable voice features |
| Voice Speed | 0.5x - 2.0x | Playback speed |
| Save History | On / Off | Auto-save chats |

---

## 💡 Usage

### Basic Chat

1. Type your message in the input box
2. Press **Enter** or click **Send** button
3. AI responds automatically
4. Continue the conversation!

### Voice Input

1. Click the **microphone** icon
2. Speak your message
3. It converts to text automatically
4. Press send or edit before sending

### Voice Mode

1. Click the **microphone** icon in top nav
2. Icon turns blue = voice mode active
3. AI responses are spoken aloud
4. Perfect for hands-free use!

### Example Prompts

```
"Explain quantum computing in simple terms"
"Help me write a professional email"
"What are the latest trends in AI?"
"Create a study plan for learning Python"
```

---

## 🗂️ File Structure

```
GOD-v1.0.0/
├── index.html          # Main application
├── styles.css          # Professional styling
├── app.js              # Core functionality
├── manifest.json       # PWA configuration
├── server.py           # Development server
├── start.bat           # Windows launcher
├── start.sh            # Linux/Mac launcher
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

---

## 🛠️ Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/GOD-v1.0.0.git
cd GOD-v1.0.0

# Start development server
python server.py

# Make your changes
# Files auto-reload in browser
```

### Building for Production

1. Test locally first
2. Commit your changes
3. Push to GitHub
4. GitHub Pages deploys automatically!

### Customization

**Change Colors** (styles.css):
```css
:root {
    --color-accent: #6366F1; /* Your color */
    --color-bg-primary: #0F172A;
}
```

**Modify Models** (app.js):
```javascript
// For Anthropic
model: 'claude-sonnet-4-20250514'

// For Ollama
model: 'llama3.2' // or your preferred model
```

---

## 📱 Install as PWA

### Desktop (Chrome/Edge)

1. Look for install icon in address bar
2. Click "Install"
3. App opens in standalone window

### Mobile (Android/iOS)

**Android (Chrome):**
1. Menu → "Install app"
2. Confirm installation
3. App appears on home screen

**iOS (Safari):**
1. Share → "Add to Home Screen"
2. Confirm
3. App appears on home screen

---

## 🔒 Privacy & Security

### What We Store
- **Chat History** - Locally in browser (optional)
- **Settings** - Locally in browser
- **API Key** - Locally in browser (encrypted)

### What We DON'T Store
- ❌ No server-side data
- ❌ No analytics or tracking
- ❌ No third-party scripts
- ❌ No data collection

### Security Best Practices
- API keys stored in localStorage (browser encrypted)
- No external data transmission
- All processing client-side
- HTTPS recommended for production

---

## 🌐 Browser Compatibility

| Browser | Desktop | Mobile | Voice | Streaming |
|---------|---------|--------|-------|-----------|
| Chrome  | ✅ | ✅ | ✅ | ✅ |
| Edge    | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ⚠️ | ✅ |
| Safari  | ✅ | ✅ | ⚠️ | ✅ |

✅ Full Support | ⚠️ Partial Support

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot connect to API"**
- ✅ Check API key is correct
- ✅ Verify internet connection
- ✅ Check API credits/quota

**"Cannot connect to Ollama"**
- ✅ Ensure `ollama serve` is running
- ✅ Check URL: `http://localhost:11434`
- ✅ Verify model is downloaded

**Voice not working**
- ✅ Use Chrome or Edge
- ✅ Grant microphone permissions
- ✅ Check HTTPS or localhost

**Slow responses**
- ✅ Try smaller model (Ollama)
- ✅ Check internet speed (Cloud)
- ✅ Disable streaming if needed

---

## 🗺️ Roadmap

### v1.1.0 (Coming Soon)
- [ ] File upload support
- [ ] Image generation
- [ ] Code syntax highlighting
- [ ] Export conversations
- [ ] Multiple chat windows

### v1.2.0 (Future)
- [ ] Custom system prompts
- [ ] Plugin system
- [ ] Collaborative chats
- [ ] Mobile apps (React Native)
- [ ] Desktop apps (Electron)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

### Guidelines
- Follow existing code style
- Test on multiple browsers
- Update documentation
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 GOD v1.0.0 Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

See [LICENSE](LICENSE) file for full text.

---

## 🙏 Acknowledgments

- **Anthropic** - For Claude API
- **Ollama** - For local AI runtime
- **Claude.ai** - Design inspiration
- **Community** - Feedback and support

---

## 📞 Support

### Get Help
- 📖 [Documentation](#-documentation)
- 🐛 [Report Issues](https://github.com/yourusername/GOD-v1.0.0/issues)
- 💬 [Discussions](https://github.com/yourusername/GOD-v1.0.0/discussions)

### Resources
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Ollama Documentation](https://ollama.ai/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/GOD-v1.0.0?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/GOD-v1.0.0?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/GOD-v1.0.0)

---

<div align="center">

**Made with ❤️ for the AI community**

**v1.0.0** | [Changelog](CHANGELOG.md) | [Contributing](CONTRIBUTING.md)

[⬆ Back to Top](#god-v100---professional-ai-assistant)

</div>
