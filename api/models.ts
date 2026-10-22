import type { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    image: ['flux', 'turbo', 'flux-realism', 'flux-anime'],
    video: [
      { id: 'veo', name: 'Google Veo 3', desc: 'Best quality, cinematic' },
      { id: 'seedance', name: 'ByteDance Seedance', desc: 'Best motion, fast' },
      { id: 'ltx-2', name: 'LTX-2', desc: 'Lightricks, 5s+ long' },
      { id: 'wan', name: 'Wan 2.1', desc: 'Alibaba, open source' },
      { id: 'kling', name: 'Kling', desc: 'Kuaishou' }
    ],
    gateway: 'pollinationaidecentralizedinference.vercel.app',
    genDocs: 'https://gen.pollinations.ai'
  });
}
