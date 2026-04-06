import { useState, useEffect } from 'react'
import { getTrending } from '../api'
import VideoCard from './VideoCard'
import './HomePage.css'

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Music', value: 'music' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'News', value: 'news' },
  { label: 'Movies', value: 'movies' },
]

export default function HomePage({ onPlay }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeCategory, setActiveCategory] = useState('')

  const load = async (category) => {
    setLoading(true)
    setError(false)
    try {
      const data = await getTrending(category)
      setVideos(Array.isArray(data) ? data.filter(v => v.videoId) : [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(activeCategory) }, [activeCategory])

  const handleCategory = (cat) => {
    setActiveCategory(cat)
  }

  return (
    <div className="home-page">
      <div className="category-bar">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            className={`category-chip ${activeCategory === c.value ? 'active' : ''}`}
            onClick={() => handleCategory(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="video-grid">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-thumb" />
              <div className="skeleton-meta">
                <div className="skeleton-avatar" />
                <div className="skeleton-lines">
                  <div className="skeleton-line long" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="home-error">
          <div className="error-icon">⚠️</div>
          <h3>Couldn't load videos</h3>
          <p>Check your connection and try again.</p>
          <button className="retry-btn" onClick={() => load(activeCategory)}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="video-grid">
          {videos.map(v => (
            <VideoCard key={v.videoId} video={v} onClick={(id, data) => onPlay(id, data)} layout="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
