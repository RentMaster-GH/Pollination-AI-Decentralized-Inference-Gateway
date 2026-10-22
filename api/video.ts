import type { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  // Forward to generate as video type
  const prompt = (req.query.prompt as string) || (req.body as any)?.prompt;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });
  const model = (req.query.model as string) || 'veo';
  const duration = (req.query.duration as string) || '5';
  const POLLI_KEY = process.env.POLLINATIONS_API_KEY || '';
  const keyParam = POLLI_KEY ? `&key=${POLLI_KEY}` : '';
  const videoUrl = `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}?model=${model}&duration=${duration}&aspectRatio=16:9${keyParam}`;
  return res.status(200).json({ url: videoUrl, type: 'video', isRealVideo: true });
}
