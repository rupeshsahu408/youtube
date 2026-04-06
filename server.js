import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, createReadStream, statSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

const TRENDING_INSTANCES = [
  'https://iv.melmac.space',
]

const SEARCH_INSTANCES = [
  'https://iv.melmac.space',
]

async function tryInstances(instances, path) {
  for (const inst of instances) {
    try {
      const res = await fetch(`${inst}${path}`, {
        headers: { 'User-Agent': 'Youtubr/1.0', Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) continue
      return res.json()
    } catch {
      continue
    }
  }
  throw new Error('All instances failed')
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/api/trending', async (req, res) => {
  try {
    const p = new URLSearchParams({ region: 'US' })
    if (req.query.type) p.set('type', req.query.type)
    const data = await tryInstances(TRENDING_INSTANCES, `/api/v1/trending?${p}`)
    res.json(data)
  } catch (e) {
    res.status(502).json({ error: e.message })
  }
})

app.get('/api/search', async (req, res) => {
  try {
    const p = new URLSearchParams({
      q: req.query.q || '',
      type: 'video',
      sort_by: 'relevance',
      page: req.query.page || '1',
    })
    const data = await tryInstances(SEARCH_INSTANCES, `/api/v1/search?${p}`)
    res.json(data)
  } catch (e) {
    res.status(502).json({ error: e.message })
  }
})

app.get('/download/youtubr.apk', (req, res) => {
  const apkPath = join(__dirname, 'public', 'youtubr.apk')
  if (!existsSync(apkPath)) {
    return res.status(404).json({ error: 'APK not available yet. Place youtubr.apk in the public/ folder.' })
  }
  const stat = statSync(apkPath)
  res.setHeader('Content-Type', 'application/vnd.android.package-archive')
  res.setHeader('Content-Disposition', 'attachment; filename="Youtubr.apk"')
  res.setHeader('Content-Length', stat.size)
  createReadStream(apkPath).pipe(res)
})

const distPath = join(__dirname, 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 5000 : 3001)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Youtubr API proxy → http://0.0.0.0:${PORT}`)
})
