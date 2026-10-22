// api/generate.js - Universal Vercel Serverless Function
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'POST with {prompt, model}' });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { prompt, model = 'flux', width = 1280, height = 720 } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt required' });
    const MASTER_KEY = process.env.POLLINATIONS_API_KEY;
    const safePrompt = prompt.trim();
    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(safePrompt)}?model=${model}&width=${width}&height=${height}&nologo=true&seed=${Date.now()}&enhance=false`;
    if (MASTER_KEY) {
      try {
        const imgRes = await fetch(imageUrl, { headers: { 'Authorization': `Bearer ${MASTER_KEY}` } });
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          res.setHeader('Content-Type', 'image/jpeg');
          return res.status(200).send(buffer);
        }
      } catch {}
    }
    return res.status(200).json({ url: imageUrl, type: 'image' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
