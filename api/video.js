export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const prompt = req.query.prompt || req.body?.prompt || 'person cooking jollof in ghana cinematic';
  const encoded = encodeURIComponent(prompt);
  
  // Return redirect to actual video/image generator - no CORS issue for <video> tag
  const videoUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&enhance=true&model=flux`;
  
  // For video tag, redirect
  if (req.query.redirect === 'true') {
    return res.redirect(302, videoUrl);
  }
  
  return res.status(200).json({ url: videoUrl, videoUrl, type: 'video' });
}
