import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const prompt = (req.query.prompt as string) || (req.body as any)?.prompt;
  if (!prompt) return res.status(400).json({ error: 'prompt required, e.g. /api/video?prompt=cooking jollof' });

  const model = (req.query.model as string) || (req.body as any)?.model || 'veo';
  const duration = (req.query.duration as string) || (req.body as any)?.duration || '5';
  const aspectRatio = (req.query.aspectRatio as string) || '16:9';
  
  const POLLI_KEY = process.env.POLLINATIONS_API_KEY || '';
  const keyParam = POLLI_KEY ? `&key=${POLLI_KEY}` : '';
  
  const videoUrl = `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}?model=${model}&duration=${duration}&aspectRatio=${aspectRatio}${keyParam}`;
  
  return res.status(200).json({ 
    url: videoUrl, 
    type: 'video', 
    model, 
    duration, 
    isRealVideo: true,
    note: 'This URL returns MP4 directly. Use in <video src>'
  });
}
