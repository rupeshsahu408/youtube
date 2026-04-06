import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, createReadStream, statSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

const INSTANCES = [
  'https://iv.melmac.space',
  'https://invidious.protokolla.fi',
  'https://invidious.darkness.services',
  'https://invidious.slipfox.xyz',
  'https://invidious.materialio.us',
  'https://invidious.perennialte.ch',
  'https://yewtu.be',
  'https://invidious.nerdvpn.de',
]

async function fetchInstance(baseUrl, path) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'User-Agent': 'Youtubr/1.0', Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${baseUrl}`)
  return res.json()
}

async function tryInstances(path) {
  return new Promise((resolve, reject) => {
    let failures = 0
    let resolved = false

    INSTANCES.forEach((inst) => {
      fetchInstance(inst, path)
        .then((data) => {
          if (!resolved) {
            resolved = true
            resolve(data)
          }
        })
        .catch(() => {
          failures++
          if (failures === INSTANCES.length && !resolved) {
            reject(new Error('All Invidious instances failed'))
          }
        })
    })
  })
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/api/trending', async (req, res) => {
  try {
    const p = new URLSearchParams({ region: 'US' })
    if (req.query.type) p.set('type', req.query.type)
    const data = await tryInstances(`/api/v1/trending?${p}`)
    res.json(data)
  } catch (e) {
    console.error('[trending]', e.message)
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
    const data = await tryInstances(`/api/v1/search?${p}`)
    res.json(data)
  } catch (e) {
    console.error('[search]', e.message)
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
  console.log(`Youtubr server → http://0.0.0.0:${PORT} (${INSTANCES.length} Invidious instances)`)
})
