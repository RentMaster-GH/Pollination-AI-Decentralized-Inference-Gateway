export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const key = `dc_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  return res.status(200).json({ api_key: key, credits: 100, gateway: 'https://pollinationaidecentralizedinference.vercel.app/api/generate' });
}
