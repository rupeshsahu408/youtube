import { useState } from 'react'
import './Header.css'

export default function Header({ onSearch, onHome, searchQuery }) {
  const [input, setInput] = useState(searchQuery || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) onSearch(input.trim())
  }

  const handleHome = () => {
    setInput('')
    onHome()
  }

  return (
    <header className="yt-header">
      <div className="yt-header-left">
        <button className="yt-logo-btn" onClick={handleHome}>
          <span className="yt-logo-icon">▶</span>
          <span className="yt-logo-text">Youtubr</span>
        </button>
      </div>

      <form className="yt-search-form" onSubmit={handleSubmit}>
        <div className="yt-search-bar">
          <input
            className="yt-search-input"
            type="text"
            placeholder="Search"
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
          />
          <button className="yt-search-btn" type="submit">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20.87 20.17l-5.59-5.59A7.97 7.97 0 0017 10a8 8 0 10-8 8 7.97 7.97 0 004.58-1.42l5.59 5.59.7-.7zM4 10a6 6 0 1112 0A6 6 0 014 10z"/>
            </svg>
          </button>
        </div>
      </form>

      <div className="yt-header-right">
        <div className="yt-shield">
          <span>🛡️</span>
          <span>Ad-Free</span>
        </div>
      </div>
    </header>
  )
}
