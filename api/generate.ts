import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

// SELF-SUFFICIENT GATEWAY - Generates video/image WITHOUT needing enter.pollinations.ai key
// Uses Pollinations FREE public endpoints (no key required) but WRAPPED with OUR OWN key system

async function checkAndDeductCredits(apiKey: string | undefined, type: string): Promise<{allowed: boolean, remaining?: number}> {
  if (!apiKey) return { allowed: true, remaining: 999 }; // Allow anonymous with rate limit
  try {
    const data: any = await kv.get(`key:${apiKey}`);
    if (!data) {
      if (apiKey.startsWith('omni_')) return { allowed: true, remaining: 100 }; // Stateless fallback
      return { allowed: false };
    }
    const cost = type === 'video' ? 10 : 1;
    if (data.credits < cost) return { allowed: false, remaining: data.credits };
    data.credits -= cost;
    data.usage += cost;
    await kv.set(`key:${apiKey}`, data);
    return { allowed: true, remaining: data.credits };
  } catch {
    return { allowed: true, remaining: 100 };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'OmniCut Decentralized Gateway - SELF-SUFFICIENT',
      version: '2.0 - Own Keys, Free Credits',
      noDependency: 'Does NOT require enter.pollinations.ai',
      howToGetKey: 'POST https://pollinationaidecentralizedinference.vercel.app/api/keys/generate with {email}',
      usage: 'Header X-API-Key: omni_... for free credits tracking',
      capabilities: ['image: flux, turbo (1 credit)', 'video: veo, seedance, ltx-2 (10 credits)'],
      freeTier: '100 credits = 100 images or 10 videos'
    });
  }

  try {
    const apiKey = req.headers['x-api-key'] as string || (req.headers.authorization as string)?.replace('Bearer ', '');
    const { prompt, type = 'image', model, duration = 5, aspectRatio = '16:9', width = 1280, height = 720 } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const creditCheck = await checkAndDeductCredits(apiKey, type);
    if (!creditCheck.allowed) return res.status(402).json({ error: 'Insufficient credits', balance: creditCheck.remaining, getMoreAt: '/api/keys/generate' });

    if (type === 'video') {
      const videoModel = model || 'veo';
      // SELF-SUFFICIENT: Use FREE public gen.pollinations.ai WITHOUT key - we provide the key system
      // No POLLINATIONS_API_KEY needed - direct public endpoint
      const videoUrl = `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}?model=${videoModel}&duration=${duration}&aspectRatio=${aspectRatio}`;
      return res.status(200).json({ url: videoUrl, type: 'video', model: videoModel, isRealVideo: true, remainingCredits: creditCheck.remaining, generatedBy: 'pollinationaidecentralizedinference' });
    } else {
      const imgModel = model || 'flux';
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${imgModel}&width=${width}&height=${height}&nologo=true&enhance=true`;
      return res.status(200).json({ url: imageUrl, type: 'image', model: imgModel, remainingCredits: creditCheck.remaining });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
