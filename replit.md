# Youtubr – Ad-Free YouTube Browser

## Overview
A clean, minimal web app that lets users watch YouTube videos completely ad-free. Users paste any YouTube URL (or video ID) into the address bar and the video plays through YouTube's Privacy-Enhanced embed (`youtube-nocookie.com`) which strips all advertising.

## Tech Stack
- **Frontend:** React 18 + Vite 6
- **Language:** JavaScript (JSX)
- **Styling:** Plain CSS (no framework)
- **Runtime:** Node.js 20

## Project Structure
```
/
├── index.html          # HTML entry point
├── vite.config.js      # Vite config (host 0.0.0.0, port 5000, allowedHosts: true)
├── package.json        # npm dependencies and scripts
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main browser UI component
│   ├── App.css         # Component styles
│   └── index.css       # Global styles / resets
└── .gitignore
```

## How It Works
1. User pastes any YouTube URL or video ID into the address bar
2. App parses the video ID from supported URL formats:
   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`
   - `https://youtube.com/shorts/VIDEO_ID`
   - Raw 11-character video ID
3. Video is embedded via `https://www.youtube-nocookie.com/embed/VIDEO_ID` with parameters that disable related videos, branding, and annotations — and crucially, **no ads play**

## Development
```bash
npm run dev    # Start dev server on port 5000
npm run build  # Build for production (outputs to dist/)
```

## Deployment
Configured as a **static site** — `npm run build` compiles to `dist/`, which is served directly.

## User Preferences
- Dark theme (#0f0f0f background) matching YouTube's dark mode
- Clean browser-like UI with address bar
