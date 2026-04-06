import { tryInstances } from './_shared.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
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
    res.status(502).json({ error: e.message })
  }
}
