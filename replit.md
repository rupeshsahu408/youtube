# Youtubr – Ad-Free YouTube Browser

## Overview
A clean, minimal web app that lets users browse and watch YouTube videos completely ad-free, using YouTube's Privacy-Enhanced embed (`youtube-nocookie.com`). Designed as an installable PWA with both iOS and Android install flows.

## Tech Stack
- **Frontend:** React 18 + Vite 6
- **Backend:** Node.js + Express (API proxy on port 3001)
- **Language:** JavaScript (JSX)
- **Styling:** Plain CSS (no framework)
- **Runtime:** Node.js 20
- **PWA:** Service worker (`public/sw.js`) + Web App Manifest (`public/manifest.json`)

## Project Structure
```
/
├── index.html              # HTML entry point
├── vite.config.js          # Vite config (host 0.0.0.0, port 5000, allowedHosts: true)
├── package.json            # npm dependencies and scripts
├── server.js               # Express API proxy (port 3001 dev / 5000 prod)
├── public/
│   ├── manifest.json       # PWA manifest (display: standalone, dark theme)
│   ├── sw.js               # Service worker for offline caching
│   ├── icon-192.png        # PWA icons
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── youtubr.apk         # Place Android APK here to enable APK download
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx              # Root component (routing + standalone detection)
    ├── api.js               # Invidious API utils + embed URL builder
    └── components/
        ├── LandingPage.jsx  # Install flow (iOS guide, Android APK, PWA prompt)
        ├── Header.jsx       # Navigation and search
        ├── HomePage.jsx     # Trending videos grid
        ├── PlayerPage.jsx   # Video player with recommendations
        ├── SearchPage.jsx   # Search results
        └── VideoCard.jsx    # Reusable video card
```

## Install Flows

### iOS (iPhone/iPad)
- On iOS Safari (not standalone), the step-by-step guide **auto-appears after 2 seconds**
- Users can also tap "Add to Home Screen" button to open the guide manually
- Guide shows 3 steps: tap Share → tap "Add to Home Screen" → open the icon
- When launched from home screen (`display: standalone`), landing page is **skipped automatically**

### Android
- Primary CTA: green **"Download APK"** button → hits `/download/youtubr.apk`
- APK served from `public/youtubr.apk` with correct Content-Type headers
- If APK file is not present, user sees a friendly "not available yet" alert
- Secondary option: **"Add to Home Screen (PWA)"** shown when browser fires `beforeinstallprompt`
- Landing page skipped when opened in standalone mode

### Other Browsers
- If PWA installable, shows "Install App" button (triggers native prompt)
- Otherwise shows "Open App" to skip landing

## API & Routing
- External API: Invidious (`iv.melmac.space`) for trending and search data
- Vite proxies `/api/*` → Express on port 3001 (dev)
- Express serves `/api/trending`, `/api/search`, `/download/youtubr.apk`
- State-based router in App.jsx (home / player / search)

## Development
```bash
npm run dev    # Start both API proxy (3001) and Vite dev server (5000)
npm run build  # Build for production
npm run start  # Build + serve everything from Express on port 5000
```

## Adding the Android APK
Generate an APK using [PWABuilder](https://www.pwabuilder.com) or Android Studio (WebView wrapper), then place the file at:
```
public/youtubr.apk
```
The download button on the site will immediately start working.

## User Preferences
- Dark theme (#080808 background) matching YouTube's dark mode
- Full-screen standalone mode (no browser chrome)
- Invidious instance: `iv.melmac.space`
