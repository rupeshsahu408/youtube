import { useState, useEffect } from 'react'
import './LandingPage.css'

export default function LandingPage({ onEnter }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installable, setInstallable] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setInstallable(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setInstallable(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setInstalled(true)
        setInstallable(false)
      }
      setDeferredPrompt(null)
    }
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-icon">▶</span>
          <span className="landing-logo-text">Youtubr</span>
        </div>
        <button className="landing-nav-btn" onClick={onEnter}>
          Open App
        </button>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-badge">100% Ad-Free · Privacy First</div>
        <h1 className="landing-hero-title">
          YouTube,<br />
          <span className="landing-hero-accent">without the ads.</span>
        </h1>
        <p className="landing-hero-sub">
          Browse trending videos, search, and watch — completely free of ads and trackers.
          Install as an app on your phone for the best experience.
        </p>

        <div className="landing-cta-group">
          {!isStandalone && installable && (
            <button className="landing-cta-primary" onClick={handleInstall}>
              <span className="cta-icon">⬇</span>
              {installed ? 'App Installed!' : 'Install App'}
            </button>
          )}
          {!isStandalone && isIOS && (
            <div className="landing-ios-hint">
              <span className="cta-icon">📲</span>
              Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong> in Safari to install
            </div>
          )}
          <button className="landing-cta-secondary" onClick={onEnter}>
            {isStandalone ? 'Open Youtubr' : 'Open in Browser →'}
          </button>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-feature">
          <div className="feature-icon">🛡️</div>
          <h3>Zero Ads</h3>
          <p>Every video streams through YouTube's privacy-enhanced mode. No pre-rolls, no mid-rolls, no banners.</p>
        </div>
        <div className="landing-feature">
          <div className="feature-icon">🔒</div>
          <h3>Privacy First</h3>
          <p>No tracking, no personalized ads, no Google cookies. Just the content you want to watch.</p>
        </div>
        <div className="landing-feature">
          <div className="feature-icon">📱</div>
          <h3>Install as App</h3>
          <p>Android users can install directly. iPhone users can add to home screen via Safari in one tap.</p>
        </div>
        <div className="landing-feature">
          <div className="feature-icon">⚡</div>
          <h3>Fast & Clean</h3>
          <p>No bloat, no distractions. A minimal interface that gets out of the way and lets you watch.</p>
        </div>
        <div className="landing-feature">
          <div className="feature-icon">🔍</div>
          <h3>Full Search</h3>
          <p>Search all of YouTube and browse trending videos across Music, Gaming, News, and Movies.</p>
        </div>
        <div className="landing-feature">
          <div className="feature-icon">📡</div>
          <h3>Works Offline</h3>
          <p>The app shell loads instantly even without a connection, thanks to service worker caching.</p>
        </div>
      </section>

      <section className="landing-mockup">
        <div className="mockup-frame">
          <div className="mockup-bar">
            <span className="mockup-dot" />
            <span className="mockup-dot" />
            <span className="mockup-dot" />
            <span className="mockup-url">youtubr.replit.app</span>
          </div>
          <div className="mockup-screen">
            <div className="mockup-header">
              <span className="mockup-logo">▶ Youtubr</span>
              <span className="mockup-badge">🛡️ Ad-Free</span>
            </div>
            <div className="mockup-tabs">
              <span className="mockup-tab active">All</span>
              <span className="mockup-tab">Music</span>
              <span className="mockup-tab">Gaming</span>
              <span className="mockup-tab">News</span>
            </div>
            <div className="mockup-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mockup-card">
                  <div className="mockup-thumb" />
                  <div className="mockup-meta">
                    <div className="mockup-line long" />
                    <div className="mockup-line short" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-install-section">
        <h2 className="landing-install-title">Ready to watch ad-free?</h2>
        <p className="landing-install-sub">Install the app or open it right in your browser — no account needed.</p>
        <div className="landing-cta-group">
          {!isStandalone && installable && (
            <button className="landing-cta-primary" onClick={handleInstall}>
              <span className="cta-icon">⬇</span>
              Install App
            </button>
          )}
          {!isStandalone && isIOS && (
            <div className="landing-ios-hint">
              <span className="cta-icon">📲</span>
              Tap <strong>Share</strong> → <strong>"Add to Home Screen"</strong> in Safari
            </div>
          )}
          <button className="landing-cta-secondary" onClick={onEnter}>
            {isStandalone ? 'Open Youtubr' : 'Open in Browser →'}
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-logo">
          <span className="landing-logo-icon">▶</span>
          <span className="landing-logo-text">Youtubr</span>
        </div>
        <p className="landing-footer-note">
          Not affiliated with YouTube or Google. Built for ad-free browsing using open APIs.
        </p>
      </footer>
    </div>
  )
}
