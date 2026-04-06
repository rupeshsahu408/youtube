import { useState, useEffect, useRef } from 'react'
import './LandingPage.css'

function useInView(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        obs.disconnect()
      }
    }, options)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isSafari = isIOS && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

export default function LandingPage({ onEnter }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installable, setInstallable] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)

  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 })
  const [mockupRef, mockupInView] = useInView({ threshold: 0.15 })
  const [bottomRef, bottomInView] = useInView({ threshold: 0.2 })

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setInstallable(true)
    }
    const onInstalled = () => {
      setInstalled(true)
      setInstallable(false)
      setTimeout(onEnter, 1200)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [onEnter])

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setInstallable(false)
    }
    setDeferredPrompt(null)
  }

  const renderInstallCTA = (size = 'large') => {
    if (isStandalone) {
      return (
        <button className={`cta-primary cta-${size}`} onClick={onEnter}>
          Open Youtubr
        </button>
      )
    }
    if (installed) {
      return (
        <div className="cta-success">
          <span className="cta-success-icon">✓</span>
          App Installed! Opening…
        </div>
      )
    }
    if (installable) {
      return (
        <button className={`cta-primary cta-${size}`} onClick={handleAndroidInstall}>
          <span className="cta-dl-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </span>
          Install App
        </button>
      )
    }
    if (isSafari) {
      return (
        <button className={`cta-primary cta-${size} cta-ios`} onClick={() => setShowIOSModal(true)}>
          <span className="cta-dl-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v13m0-13l-4 4m4-4l4 4"/>
              <rect x="2" y="14" width="20" height="8" rx="2"/>
            </svg>
          </span>
          Add to Home Screen
        </button>
      )
    }
    return (
      <button className={`cta-primary cta-${size}`} onClick={onEnter}>
        Open App
      </button>
    )
  }

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-icon">▶</span>
          <span className="landing-logo-text">Youtubr</span>
        </div>
        <button className="landing-nav-open" onClick={onEnter}>
          Open App
        </button>
      </nav>

      <section className="landing-hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            100% Ad-Free · Privacy First
          </div>
          <h1 className="hero-title">
            YouTube,<br />
            <span className="hero-accent">without the ads.</span>
          </h1>
          <p className="hero-sub">
            Browse trending videos, search, and watch — completely free of ads and trackers.
            Install as an app for a true native experience.
          </p>

          <div className="hero-cta">
            {renderInstallCTA('large')}
            {!isStandalone && !installed && (
              <button className="cta-ghost" onClick={onEnter}>
                Open in Browser →
              </button>
            )}
          </div>

          <div className="hero-platforms">
            <div className="platform-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341a4.98 4.98 0 01-2.36.591c-2.756 0-4.99-2.235-4.99-4.99 0-1.372.556-2.614 1.453-3.52A8.94 8.94 0 003 15.941 8.94 8.94 0 0012 21c2.178 0 4.18-.776 5.748-2.059l-.225-.6zM12 3a9 9 0 00-7.938 13.26A6.978 6.978 0 0112 12.94a6.978 6.978 0 017.938 3.32A9 9 0 0012 3z"/></svg>
              Android
            </div>
            <div className="platform-pill">
              <svg width="14" height="14" viewBox="0 0 814 1000" fill="currentColor"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.4-150.3-109.2C87.3 737.9 32 620.6 32 510.7c0-194.3 125.4-297.5 248.3-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2z"/></svg>
              iOS Safari
            </div>
          </div>
        </div>
        <div className="hero-glow" />
      </section>

      <section
        ref={featuresRef}
        className={`landing-features ${featuresInView ? 'in-view' : ''}`}
      >
        {[
          { icon: '🛡️', title: 'Zero Ads', desc: "Every video streams through YouTube's privacy-enhanced mode. No pre-rolls, no mid-rolls, no banners — ever." },
          { icon: '🔒', title: 'Privacy First', desc: 'No tracking, no personalized ads, no Google cookies following you around. Just the content you chose.' },
          { icon: '📱', title: 'Install as App', desc: 'Android users install in one tap. iPhone users add to home screen via Safari — works exactly like a native app.' },
          { icon: '⚡', title: 'Blazing Fast', desc: 'No heavy UI frameworks, no analytics bloat. Pages load instantly and videos start immediately.' },
          { icon: '🔍', title: 'Full Search', desc: 'Search all of YouTube and browse trending videos across Music, Gaming, News, and Movies in real time.' },
          { icon: '📡', title: 'Offline Ready', desc: 'The app shell loads instantly even without a network connection, thanks to intelligent service worker caching.' },
        ].map((f, i) => (
          <div key={f.title} className="feature-card" style={{ '--delay': `${i * 80}ms` }}>
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>

      <section
        ref={mockupRef}
        className={`landing-mockup ${mockupInView ? 'in-view' : ''}`}
      >
        <div className="mockup-wrap">
          <div className="mockup-label">What it looks like inside</div>
          <div className="mockup-frame">
            <div className="mockup-bar">
              <span className="mockup-dot red" />
              <span className="mockup-dot yellow" />
              <span className="mockup-dot green" />
              <span className="mockup-url">youtubr.app</span>
            </div>
            <div className="mockup-screen">
              <div className="mockup-header">
                <span className="mockup-logo">▶ Youtubr</span>
                <span className="mockup-shield">🛡️ Ad-Free</span>
              </div>
              <div className="mockup-chips">
                {['All', 'Music', 'Gaming', 'News', 'Movies'].map((t, i) => (
                  <span key={t} className={`mockup-chip${i === 0 ? ' active' : ''}`}>{t}</span>
                ))}
              </div>
              <div className="mockup-grid">
                {[
                  { w: '80%' }, { w: '65%' },
                  { w: '90%' }, { w: '70%' },
                  { w: '75%' }, { w: '85%' },
                ].map((c, i) => (
                  <div key={i} className="mockup-card">
                    <div className="mockup-thumb" style={{ '--hue': `${i * 40}deg` }} />
                    <div className="mockup-info">
                      <div className="mockup-avatar" />
                      <div className="mockup-lines">
                        <div className="mockup-line" style={{ width: c.w }} />
                        <div className="mockup-line short" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={bottomRef}
        className={`landing-bottom ${bottomInView ? 'in-view' : ''}`}
      >
        <div className="bottom-inner">
          <h2 className="bottom-title">Ready to watch ad-free?</h2>
          <p className="bottom-sub">No account needed. Works on any device. Free forever.</p>
          <div className="bottom-cta">
            {renderInstallCTA('large')}
            {!isStandalone && !installed && (
              <button className="cta-ghost" onClick={onEnter}>Open in Browser →</button>
            )}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-logo">
          <span className="landing-logo-icon">▶</span>
          <span className="landing-logo-text">Youtubr</span>
        </div>
        <p className="footer-note">
          Not affiliated with YouTube or Google. Built for ad-free browsing.
        </p>
      </footer>

      {showIOSModal && (
        <div className="ios-overlay" onClick={() => setShowIOSModal(false)}>
          <div className="ios-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ios-sheet-handle" />
            <div className="ios-sheet-header">
              <div className="ios-app-icon">▶</div>
              <div>
                <div className="ios-app-name">Youtubr</div>
                <div className="ios-app-sub">Add to your home screen</div>
              </div>
            </div>
            <div className="ios-steps">
              <div className="ios-step">
                <div className="ios-step-num">1</div>
                <div className="ios-step-body">
                  <div className="ios-step-title">
                    Tap the Share button
                    <span className="ios-share-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </span>
                  </div>
                  <div className="ios-step-desc">Tap the share icon in Safari's toolbar at the bottom of your screen</div>
                </div>
              </div>
              <div className="ios-step-divider" />
              <div className="ios-step">
                <div className="ios-step-num">2</div>
                <div className="ios-step-body">
                  <div className="ios-step-title">Tap "Add to Home Screen"</div>
                  <div className="ios-step-desc">Scroll down in the share sheet and tap <strong>"Add to Home Screen"</strong>, then tap <strong>Add</strong></div>
                </div>
              </div>
            </div>
            <div className="ios-arrow-hint">
              <div className="ios-arrow-line" />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              <div className="ios-arrow-label">Safari toolbar is down here</div>
            </div>
            <button className="ios-close" onClick={() => setShowIOSModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
