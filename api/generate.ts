import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase.js';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ status: 'SELF-SUFFICIENT', free_proxy: 'READY' });
  try {
    const apiKey = (req.headers['x-api-key'] as string) || (req.headers.authorization as string)?.replace('Bearer ','');
    const { prompt, type='image', model, duration=5, aspectRatio='16:9' } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt required' });
    let remaining = 999;
    if (apiKey?.startsWith('omni_')) {
      const { data } = await supabase.from('api_keys').select('*').eq('api_key', apiKey).single();
      if (data) {
        const cost = type === 'video' ? 10 : 1;
        if (data.credits < cost) return res.status(402).json({ error: 'Insufficient credits', balance: data.credits });
        remaining = data.credits - cost;
        await supabase.from('api_keys').update({ credits: remaining, usage: data.usage + cost }).eq('api_key', apiKey);
      }
    }
    if (type === 'video') {
      const videoUrl = `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}?model=${model||'veo'}&duration=${duration}&aspectRatio=${aspectRatio}&nologo=true`;
      return res.status(200).json({ url: videoUrl, type: 'video', remainingCredits: remaining });
    } else {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model||'flux'}&width=1280&height=720&nologo=true&enhance=true`;
      return res.status(200).json({ url: imageUrl, type: 'image', remainingCredits: remaining });
    }
  } catch (e:any) { return res.status(500).json({ error: e.message }); }
}
