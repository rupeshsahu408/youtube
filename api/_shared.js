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

export async function tryInstances(path) {
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
