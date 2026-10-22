import type { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    name: 'Pollination AI Decentralized Inference Gateway',
    version: '2.0 SELF-SUFFICIENT',
    description: 'Own API keys, own free credits - no enter.pollinations.ai dependency',
    endpoints: {
      'POST /api/keys/generate': 'Generate your own API key with 100 free credits - body {email}',
      'GET /api/keys/balance?key=omni_xxx': 'Check your credits',
      'POST /api/generate': 'Generate image/video - header X-API-Key: omni_xxx',
      'GET /api/video?prompt=...': 'Direct video MP4'
    },
    example: "curl -X POST https://pollinationaidecentralizedinference.vercel.app/api/keys/generate -H 'Content-Type: application/json' -d '{\"email\":\"you@gmail.com\"}'"
  });
}
