import { useState, useEffect } from 'react'
import { searchVideos } from '../api'
import VideoCard from './VideoCard'
import './SearchPage.css'

export default function SearchPage({ query, onPlay }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setError(false)
    setVideos([])
    searchVideos(query)
      .then(data => setVideos(
        Array.isArray(data)
          ? data.filter(v => (v.type === 'video' || v.videoId))
          : []
      ))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="search-page">
      <p className="search-label">
        {loading ? `Searching for "${query}"…` : `Results for "${query}"`}
      </p>

      {loading && (
        <div className="search-list">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="sk-row-full">
              <div className="sk-thumb-full" />
              <div className="sk-lines-full">
                <div className="sk-line-f long" />
                <div className="sk-line-f short" />
                <div className="sk-line-f short" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="search-error">
          <p>⚠️ Couldn't fetch results. Please try again.</p>
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="search-empty">
          <p>No results found for "<strong>{query}</strong>"</p>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="search-list">
          {videos.map(v => (
            <VideoCard key={v.videoId} video={v} onClick={(id, data) => onPlay(id, data)} layout="search" />
          ))}
        </div>
      )}
    </div>
  )
}
