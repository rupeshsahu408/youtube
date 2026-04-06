import { useState } from 'react'
import Header from './components/Header'
import HomePage from './components/HomePage'
import PlayerPage from './components/PlayerPage'
import SearchPage from './components/SearchPage'
import LandingPage from './components/LandingPage'
import './App.css'

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

export default function App() {
  const [showLanding, setShowLanding] = useState(!isStandalone)
  const [page, setPage] = useState({ type: 'home' })

  const goHome = () => setPage({ type: 'home' })
  const goPlay = (videoId, videoData = null) =>
    setPage({ type: 'player', videoId, videoData })
  const goSearch = (query) => setPage({ type: 'search', query })
  const enterApp = () => setShowLanding(false)

  if (showLanding) {
    return <LandingPage onEnter={enterApp} />
  }

  return (
    <div className="app">
      <Header
        onHome={goHome}
        onSearch={goSearch}
        searchQuery={page.type === 'search' ? page.query : ''}
      />
      <div className="app-content">
        {page.type === 'home' && <HomePage onPlay={goPlay} />}
        {page.type === 'player' && (
          <PlayerPage
            videoId={page.videoId}
            initialData={page.videoData}
            onPlay={goPlay}
          />
        )}
        {page.type === 'search' && (
          <SearchPage query={page.query} onPlay={goPlay} />
        )}
      </div>
    </div>
  )
}
