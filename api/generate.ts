import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok',
      message: 'OmniCut Gateway - Image + Video',
      capabilities: ['image: flux, turbo', 'video: veo, seedance, ltx-2, wan'],
      usage: 'POST {prompt, type: "image"|"video", model, duration}',
      endpoints: {
        'POST /api/generate': '{prompt, type, model, duration}',
        'GET /api/video?prompt=...': 'direct video'
      }
    });
  }

  try {
    const body = req.body || {};
    const { 
      prompt, 
      type = 'image', 
      model, 
      duration = 5, 
      aspectRatio = '16:9',
      width = 1280, 
      height = 720 
    } = body;

    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const POLLI_KEY = process.env.POLLINATIONS_API_KEY;
    const keyParam = POLLI_KEY ? `?key=${POLLI_KEY}` : '';
    const keyParamAmp = POLLI_KEY ? `&key=${POLLI_KEY}` : '';

    if (type === 'video') {
      const videoModel = model || 'veo';
      // gen.pollinations.ai is the official Pollinations video API (like Luma)
      // Models: veo (Google Veo 3), seedance (ByteDance best), ltx-2, wan, kling
      const videoUrl = `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}?model=${videoModel}&duration=${duration}&aspectRatio=${aspectRatio}${keyParamAmp}`;
      
      return res.status(200).json({ 
        url: videoUrl,
        type: 'video',
        model: videoModel,
        prompt,
        duration,
        aspectRatio,
        isRealVideo: true,
        gateway: 'pollinationaidecentralizedinference.vercel.app'
      });
    } else {
      const imgModel = model || 'flux';
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${imgModel}&width=${width}&height=${height}&nologo=true&enhance=true`;
      return res.status(200).json({ url: imageUrl, type: 'image', prompt, model: imgModel });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
