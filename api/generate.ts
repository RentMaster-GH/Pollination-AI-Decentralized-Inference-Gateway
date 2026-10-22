export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ status: 'ok', message: 'POST with {prompt, model}' });

  try {
    const { prompt, model = 'flux', width = 1280, height = 720 } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model}&width=${width}&height=${height}&nologo=true&enhance=true`;
    
    // Return direct URL - Pollinations generates on GET
    return res.status(200).json({ url: pollinationsUrl, prompt });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
