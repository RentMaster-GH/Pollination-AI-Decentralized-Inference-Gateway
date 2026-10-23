import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });

const THEME_PROMPTS = {
  jollof: "Ghanaian jollof rice cooking in large black pot, tomato stew, red oil, steam rising, person in red shirt stirring with wooden ladle, close-up, hands visible, cinematic food commercial, NOT bread, NOT burger, NOT cake",
  mafia: "luxury suit, dark cinematic, Rembrandt light, 85mm lens",
  ghana: "Accra Ghana kitchen, authentic, daylight, 35mm"
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { prompt, model="veo" } = req.body;
  console.log("FAL_KEY exists?", !!process.env.FAL_KEY);
  
  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: "FAL_KEY missing in Vercel - add it in Settings > Env Vars and redeploy" });
  }

  // Improved prompt for jollof
  let finalPrompt = prompt;
  if (prompt.toLowerCase().includes("jollof")) {
    finalPrompt = `${prompt}, ${THEME_PROMPTS.jollof}, 4K, food texture, tomato grains visible, realistic steam, Arri Alexa`;
  }

  try {
    const result = await fal.subscribe("fal-ai/veo3.1", {
      input: { 
        prompt: finalPrompt,
        duration: "5s",
        aspect_ratio: "16:9"
      },
    });
    return res.json({ videoUrl: result.data.video.url, model: "accra-v1 veo-3.1", prompt: finalPrompt, source: "fal" });
  } catch (e) {
    console.error("Fal error:", e);
    return res.status(500).json({ error: e.message, source: "fal-failed" });
  }
}
