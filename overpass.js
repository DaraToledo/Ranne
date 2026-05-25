// api/overpass.js — Proxy para Overpass API (evita CORS do browser)
export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];

  for (const ep of endpoints) {
    try {
      const response = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5min cache
        return res.status(200).json(data);
      }
    } catch (e) {
      console.warn('[overpass proxy] endpoint failed:', ep, e.message);
    }
  }

  return res.status(503).json({ error: 'Overpass unavailable' });
}
