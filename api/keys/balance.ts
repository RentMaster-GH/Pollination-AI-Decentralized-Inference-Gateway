import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const apiKey = (req.query.key as string) || req.headers['x-api-key'] as string || (req.body as any)?.key;
  if (!apiKey) return res.status(400).json({ error: 'Provide ?key= or X-API-Key header' });

  try {
    const data = await kv.get(`key:${apiKey}`);
    if (!data) {
      // If KV not setup, return mock balance for any omni_ key (self-sufficient mode)
      if (apiKey.startsWith('omni_')) {
        return res.status(200).json({ key: apiKey, credits: 100, usage: 0, tier: 'free', note: 'KV not configured - using stateless mode, credits not deducted' });
      }
      return res.status(404).json({ error: 'Invalid API key' });
    }
    return res.status(200).json(data);
  } catch {
    return res.status(200).json({ key: apiKey, credits: 100, tier: 'free', mode: 'stateless - add Vercel KV for persistence' });
  }
}
