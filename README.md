# 🖥️ Laptop Builder

An AI-powered laptop configuration tool that helps users find the perfect laptop by browsing specs first. Instead of being overwhelmed by laptop models, users select the specifications they want (CPU, RAM, Display, etc.) and the app shows compatible laptops that already have or can be upgraded to those specs.

**Live Demo:** https://laptop-builder.netlify.app

## ✨ Features

- **Spec-First Selection** — Browse CPUs, GPUs, RAM, Storage, Displays, and WiFi options first
- **Smart Laptop Matching** — Shows laptops that have your specs built-in (✅) or can be upgraded (🔧)
- **AI Assistant** — Chat with a Gemini-powered assistant for configuration advice
- **Build Persistence** — Save multiple named builds to compare later
- **Review Screen** — Detailed specs breakdown before purchase
- **One-Click Purchase** — Redirects to manufacturer website with your configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
npm run build
```

The built files are in the `dist/` folder.

## 🔑 AI Features (Optional)

To enable the AI chat assistant:

1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Restart the dev server

Without an API key, the app works in demo mode with mock AI responses.

## 📁 Project Structure

```
├── App.tsx           # Main application component
├── types.ts          # TypeScript interfaces
├── constants.tsx     # Laptop and parts data
├── services/
│   └── geminiService.ts  # AI integration
├── public/
│   └── assets/images/    # Product images
└── index.html        # Entry point
```

## 🛠️ Tech Stack

- **React 19** + TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Google Gemini API** for AI features

## 📦 Deployment

Configured for Netlify deployment:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 📄 License

MIT
