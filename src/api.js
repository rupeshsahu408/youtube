async function apiFetch(path) {
  const res = await fetch(path, { signal: AbortSignal.timeout(12000) })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export async function getTrending(category = '') {
  const params = new URLSearchParams()
  if (category) params.set('type', category)
  return apiFetch(`/api/trending?${params}`)
}

export async function searchVideos(query, page = 1) {
  const params = new URLSearchParams({ q: query, page })
  return apiFetch(`/api/search?${params}`)
}

export function formatViews(n) {
  if (!n) return ''
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B views`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`
  return `${n} views`
}

export function formatDuration(s) {
  if (!s) return ''
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function formatPublished(timestamp) {
  if (!timestamp) return ''
  const diff = Math.floor(Date.now() / 1000) - timestamp
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`
  return `${Math.floor(diff / 31536000)} years ago`
}

export function buildEmbedUrl(videoId) {
  const p = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    fs: '1',
    playsinline: '1',
    enablejsapi: '1',
    origin: window?.location?.origin || '',
  })
  return `https://www.youtube-nocookie.com/embed/${videoId}?${p}`
}

export function getBestThumbnail(thumbnails, videoId) {
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }
  if (!thumbnails || !thumbnails.length) return ''
  const pref = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default']
  for (const q of pref) {
    const t = thumbnails.find(t => t.quality === q)
    if (t) return t.url
  }
  return thumbnails[thumbnails.length - 1]?.url || ''
}
