export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const email = req.body?.email || req.query?.email || 'test@test.com';
  const key = 'omni_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
  return res.status(200).json({ key, apiKey: key, email, credits: 100, balance: 100 });
}
