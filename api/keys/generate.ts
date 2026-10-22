import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { randomUUID } from 'crypto';

// SELF-SUFFICIENT KEY GEN - No enter.pollinations.ai needed
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { email, name } = req.body || {};
    // Generate our OWN key - format: omni_ + uuid
    const apiKey = `omni_${randomUUID().replace(/-/g, '')}_${Date.now().toString(36)}`;
    const keyId = `key:${apiKey}`;

    const keyData = {
      key: apiKey,
      email: email || 'anonymous',
      name: name || 'free-user',
      credits: 100, // FREE CREDITS like Pollinations gives
      createdAt: new Date().toISOString(),
      usage: 0,
      tier: 'free',
      limits: {
        image: { cost: 1, limit: 100 },
        video: { cost: 10, limit: 10 }, // 10 free videos
      }
    };

    // Try Vercel KV, fallback to in-memory response if KV not setup
    try {
      await kv.set(keyId, keyData);
      await kv.set(`email:${email || 'anon'}`, apiKey);
    } catch (kvErr) {
      console.log('KV not configured, key generated stateless - will work but not persistent');
    }

    return res.status(200).json({
      success: true,
      apiKey,
      credits: 100,
      message: 'Your OmniCut Gateway Key - 100 free credits!',
      usage: {
        'POST /api/generate with header X-API-Key: YOUR_KEY': 'Uses credits',
        'GET /api/keys/balance?key=YOUR_KEY': 'Check balance'
      },
      endpoints: {
        generate: 'https://pollinationaidecentralizedinference.vercel.app/api/generate',
        video: 'https://pollinationaidecentralizedinference.vercel.app/api/video'
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
