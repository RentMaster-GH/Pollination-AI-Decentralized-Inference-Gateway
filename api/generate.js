export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { prompt = 'test', type = 'video' } = req.method === 'GET' ? req.query : (req.body || {});
  const encoded = encodeURIComponent(prompt);
  const videoUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&model=turbo`;
  return res.status(200).json({ url: videoUrl, videoUrl, type, prompt });
}
