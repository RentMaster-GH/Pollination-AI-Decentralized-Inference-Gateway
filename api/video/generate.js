import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });

const THEMES = {
  mafia: "luxury suit, dark cinematic, Rembrandt light, 85mm lens, Arri Alexa 65, volumetric",
  jollof: "Ghanaian kitchen, vibrant colors, steam rising, cinematic food commercial, 35mm",
  corporate: "CEO office, glass building, daylight, shallow depth, 50mm",
  fashion: "Vogue editorial, studio lighting, fabric physics, skin texture",
  street: "Accra street documentary, natural light, skin texture",
  cinematic: "cinematic, 4K, realistic weight, fabric physics, 24fps"
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { prompt, theme='cinematic', referenceImages=[], model='kling-3.0', duration=5 } = req.body;
  if (!process.env.FAL_KEY) return res.status(500).json({ error: 'FAL_KEY not set in Vercel' });

  const cinematicPrompt = `${prompt}, ${THEMES[theme] || THEMES.cinematic}, 4K, skin pore detail, volumetric light`;

  try {
    let result;
    if (model.includes('kling')) {
      result = await fal.subscribe("fal-ai/kling-video/v3.0/standard/text-to-video", {
        input: { prompt: cinematicPrompt, duration: duration.toString(), aspect_ratio: "9:16" },
        logs: false
      });
      return res.json({ videoUrl: result.data.video.url, model: 'accra-v1 (Kling 3.0)', prompt: cinematicPrompt });
    } else {
      result = await fal.subscribe("fal-ai/runway-gen4.5", {
        input: { prompt: cinematicPrompt, duration, ratio: "9:16" }
      });
      return res.json({ videoUrl: result.data.video.url, model: 'accra-v1 (Runway 4.5)', prompt: cinematicPrompt });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message, fallback: true });
  }
}
