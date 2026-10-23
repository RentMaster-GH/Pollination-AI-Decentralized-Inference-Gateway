import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  let prompt = null;
  try { const u = new URL(req.url, `https://${req.headers.host}`); prompt = u.searchParams.get('prompt'); } catch {}
  if (!prompt) prompt = req.query?.prompt;
  if (!prompt) return res.status(400).json({ error: "prompt required", url: req.url });
  try {
    const result = await fal.subscribe("fal-ai/veo3", { input: { prompt: prompt.toLowerCase().includes("jollof") ? `${prompt}, Ghanaian jollof rice in large black pot, tomato stew, steam, cinematic` : prompt, duration: "5s", aspect_ratio: "16:9" } });
    return res.json({ videoUrl: result.data.video.url, url: result.data.video.url, source: "fal-veo3" });
  } catch (e) { return res.status(500).json({ error: e.message, details: String(e).slice(0,800) }); }
}
