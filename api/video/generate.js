import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { prompt } = req.body;
  const finalPrompt = prompt.toLowerCase().includes("jollof")
    ? `${prompt}, Ghanaian jollof rice in large black pot, tomato stew, red oil, steam rising, wooden ladle stirring, authentic Ghana kitchen, NOT bread, NOT burger, NOT cake, 4K food commercial`
    : prompt;

  try {
    const result = await fal.subscribe("fal-ai/veo3.1", {
      input: { prompt: finalPrompt, duration: "5s", aspect_ratio: "16:9" }
    });
    return res.json({ 
      videoUrl: result.data.video.url, 
      message: `Video ready! (Accra.ai - veo3.1)`,
      source: "fal" 
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
