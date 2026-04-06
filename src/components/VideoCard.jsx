import { getBestThumbnail, formatViews, formatDuration, formatPublished } from '../api'
import './VideoCard.css'

export default function VideoCard({ video, onClick, layout = 'grid' }) {
  const isSearch = layout === 'search'
  const effectiveLayout = isSearch ? 'search' : layout
  if (!video) return null

  const thumb = getBestThumbnail(video.videoThumbnails, video.videoId)
  const duration = formatDuration(video.lengthSeconds)
  const views = formatViews(video.viewCount)
  const published = formatPublished(video.published)
  const isLive = video.liveNow || (!video.lengthSeconds && video.lengthSeconds !== undefined)

  return (
    <div className={`video-card ${effectiveLayout}`} onClick={() => onClick(video.videoId, video)}>
      <div className="video-thumb-wrap">
        <img
          className="video-thumb"
          src={thumb}
          alt={video.title}
          loading="lazy"
          onError={e => { e.target.style.background = '#272727' }}
        />
        {isLive
          ? <span className="video-live-badge">● LIVE</span>
          : duration && <span className="video-duration">{duration}</span>
        }
      </div>
      <div className="video-meta">
        <div className="video-channel-avatar">
          {(video.author || 'C').charAt(0).toUpperCase()}
        </div>
        <div className="video-info">
          <p className="video-title">{video.title}</p>
          <p className="video-channel">{video.author}</p>
          <p className="video-stats">
            {views}{views && published ? ' · ' : ''}{published}
          </p>
        </div>
      </div>
    </div>
  )
}
