export default async function handler(req, res) {
  // CORS FIX - MUST BE FIRST
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Your existing generate logic here...
  const { prompt, type = 'video' } = req.method === 'GET' ? req.query : req.body;
  
  // Example: proxy to pollinations or return video URL
  const encoded = encodeURIComponent(prompt || 'test');
  const videoUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&model=turbo`;
  
  return res.status(200).json({ 
    url: videoUrl, 
    videoUrl: videoUrl,
    type: type,
    prompt: prompt 
  });
}
