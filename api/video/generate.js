import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let prompt = null;
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    prompt = url.searchParams.get('prompt');
  } catch {}
  if (!prompt) prompt = req.query?.prompt;
  if (!prompt && req.body) {
    try {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      prompt = b.prompt;
    } catch {}
  }

  if (!prompt) return res.status(400).json({ error: "prompt required", debug_url: req.url, has_fal: !!process.env.FAL_KEY });
  if (!process.env.FAL_KEY) return res.status(500).json({ error: "FAL_KEY missing" });

  const finalPrompt = prompt.toLowerCase().includes("jollof")
    ? `${prompt}, Ghanaian jollof rice in large black pot with tomato stew, steam, wooden ladle, authentic, NOT bread, NOT cake, cinematic 4K`
    : prompt;

  try {
    const result = await fal.subscribe("fal-ai/veo3.1", {
      input: { prompt: finalPrompt, duration: "5s", aspect_ratio: "16:9" }
    });
    return res.status(200).json({ videoUrl: result.data.video.url, url: result.data.video.url, source: "fal-veo3.1" });
  } catch (e) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
