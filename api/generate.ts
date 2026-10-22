import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ 
    status: 'ok', 
    capabilities: ['image', 'video', 'video-models: veo, seedance, ltx-2, wan'],
    usage: 'POST {prompt, type: "image"|"video", model, duration, aspectRatio}' 
  });

  try {
    const { prompt, type = 'image', model, duration = 5, aspectRatio = '16:9', width = 1280, height = 720 } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const POLLI_KEY = process.env.POLLINATIONS_API_KEY; // Add in Vercel env, optional for free tier
    const keyParam = POLLI_KEY ? `&key=${POLLI_KEY}` : '';

    if (type === 'video') {
      // TRUE MOTION - Luma style
      const videoModel = model || 'veo'; // veo = Google Veo, seedance = ByteDance, ltx-2 = Lightricks
      const videoUrl = `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}?model=${videoModel}&duration=${duration}&aspectRatio=${aspectRatio}${keyParam}`;
      
      // Proxy the video or return URL for client to fetch directly
      return res.status(200).json({ 
        url: videoUrl,
        type: 'video',
        model: videoModel,
        prompt,
        duration,
        isRealVideo: true
      });
    } else {
      // IMAGE (existing)
      const imgModel = model || 'flux';
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${imgModel}&width=${width}&height=${height}&nologo=true&enhance=true`;
      return res.status(200).json({ url: imageUrl, type: 'image', prompt });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
