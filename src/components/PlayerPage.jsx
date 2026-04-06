import { useEffect, useState, useRef, useCallback } from 'react'
import { searchVideos, buildEmbedUrl, formatViews, formatPublished } from '../api'
import VideoCard from './VideoCard'
import './PlayerPage.css'

const YT_ERRORS = {
  2: 'Invalid video ID.',
  5: 'This video cannot be played in an embedded player.',
  100: 'This video has been removed or is private.',
  101: 'The video owner does not allow it to be played in embedded players.',
  150: 'The video owner does not allow it to be played in embedded players.',
  153: 'This video cannot be embedded — the owner has disabled it.',
}

export default function PlayerPage({ videoId, initialData, onPlay }) {
  const [recommended, setRecommended] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [embedError, setEmbedError] = useState(null)
  const iframeRef = useRef(null)

  const video = initialData

  const handleMessage = useCallback((event) => {
    if (!event.origin.includes('youtube')) return
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      if (data?.event === 'onError') {
        const code = data.info
        setEmbedError({
          code,
          message: YT_ERRORS[code] || `Playback error (code ${code}).`,
        })
      }
      if (data?.event === 'onStateChange' && data?.info >= 0) {
        setEmbedError(null)
      }
    } catch {}
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  useEffect(() => {
    setEmbedError(null)
    setLoadingRecs(true)
    setRecommended([])
    setExpanded(false)

    const query = video?.title
      ? video.title.split(' ').slice(0, 5).join(' ')
      : 'popular videos'

    searchVideos(query)
      .then(data => {
        const results = Array.isArray(data)
          ? data.filter(v => v.videoId && v.videoId !== videoId).slice(0, 20)
          : []
        setRecommended(results)
      })
      .catch(() => {})
      .finally(() => setLoadingRecs(false))

    window.scrollTo({ top: 0 })
  }, [videoId])

  const embedUrl = buildEmbedUrl(videoId)

  return (
    <div className="player-page">
      <div className="player-main">
        <div className="player-wrap">
          <iframe
            ref={iframeRef}
            key={videoId}
            className="player-iframe"
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="YouTube Video Player"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          {embedError && (
            <div className="embed-error-overlay">
              <div className="embed-error-box">
                <div className="embed-error-icon">⚠️</div>
                <p className="embed-error-title">Can't play this video</p>
                <p className="embed-error-msg">{embedError.message}</p>
                <a
                  className="watch-on-yt-btn"
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube ↗
                </a>
                {recommended.length > 0 && (
                  <button
                    className="skip-btn"
                    onClick={() => onPlay(recommended[0].videoId, recommended[0])}
                  >
                    Play next video instead
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {video && (
          <div className="player-info">
            <h1 className="player-title">{video.title}</h1>
            <div className="player-meta-row">
              <div className="player-channel">
                <div className="player-avatar">
                  {(video.author || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="player-author">{video.author}</p>
                </div>
              </div>
              <div className="player-stats">
                {video.viewCount > 0 && (
                  <div className="stat-pill">
                    <span>👁</span>
                    <span>{formatViews(video.viewCount)}</span>
                  </div>
                )}
                {video.likeCount > 0 && (
                  <div className="stat-pill">
                    <span>👍</span>
                    <span>{formatViews(video.likeCount)}</span>
                  </div>
                )}
                <div className="stat-pill shield-stat">
                  <span>🛡️</span>
                  <span>Ad-Free</span>
                </div>
              </div>
            </div>

            {video.description && (
              <div className="player-desc-wrap">
                <div className={`player-desc ${expanded ? 'expanded' : ''}`}>
                  {video.description}
                </div>
                {video.description.length > 200 && (
                  <button
                    className="desc-toggle"
                    onClick={() => setExpanded(e => !e)}
                  >
                    {expanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}

            {video.published && (
              <p className="player-published">{formatPublished(video.published)}</p>
            )}
          </div>
        )}
      </div>

      <div className="player-sidebar">
        <h3 className="sidebar-title">Up next</h3>
        {loadingRecs ? (
          <div className="sidebar-skeleton">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="sk-row">
                <div className="sk-thumb" />
                <div className="sk-lines">
                  <div className="sk-line long" />
                  <div className="sk-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sidebar-list">
            {recommended.map(v => (
              <VideoCard key={v.videoId} video={v} onClick={(id, data) => onPlay(id, data)} layout="row" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
