import { tryInstances } from './_shared.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    const p = new URLSearchParams({ region: 'US' })
    if (req.query.type) p.set('type', req.query.type)
    const data = await tryInstances(`/api/v1/trending?${p}`)
    res.json(data)
  } catch (e) {
    res.status(502).json({ error: e.message })
  }
}
