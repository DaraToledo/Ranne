// api/overpass.js — Proxy para Overpass API
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try { body = await req.json(); } 
  catch { return new Response('Invalid JSON', { status: 400 }); }

  const { query } = body;
  if (!query) return new Response('Missing query', { status: 400 });

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
        signal: AbortSignal.timeout(14000)
      });

      if (response.ok) {
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300'
          }
        });
      }
    } catch (e) {
      console.warn('[overpass proxy] failed:', ep, e.message);
    }
  }

  return new Response(JSON.stringify({ error: 'Overpass unavailable', elements: [] }), {
    status: 503,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
