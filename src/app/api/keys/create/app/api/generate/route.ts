import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = 'flux', width = 1280, height = 720, duration = 5 } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 });
    const authHeader = req.headers.get('authorization') || '';
    const userKey = authHeader.replace('Bearer ', '').trim();
    const MASTER_KEY = process.env.POLLINATIONS_API_KEY;
    const safePrompt = prompt.trim();
    const isVideo = ['seedance', 'veo', 'wan', 'kling'].some(m => model.includes(m));
    if (isVideo) {
      const pollRes = await fetch('https://gen.pollinations.ai/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(MASTER_KEY ? { 'Authorization': `Bearer ${MASTER_KEY}` } : {}) },
        body: JSON.stringify({ prompt: safePrompt, model, width, height, duration, nologo: true })
      });
      if (!pollRes.ok) {
        const imgUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(safePrompt)}?model=flux&width=${width}&height=${height}&nologo=true&seed=${Date.now()}`;
        return NextResponse.json({ url: imgUrl, type: 'image', fallback: true });
      }
      const ct = pollRes.headers.get('content-type') || '';
      if (ct.includes('video') || ct.includes('octet-stream')) {
        const blob = await pollRes.blob();
        return new NextResponse(Buffer.from(await blob.arrayBuffer()), { headers: { 'Content-Type': 'video/mp4' } });
      }
      const data = await pollRes.json();
      return NextResponse.json({ url: data.url || data.videoUrl || data.imageUrl, type: 'video' });
    } else {
      const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(safePrompt)}?model=${model}&width=${width}&height=${height}&nologo=true&seed=${Date.now()}&enhance=false`;
      if (MASTER_KEY) {
        try {
          const imgRes = await fetch(imageUrl, { headers: { 'Authorization': `Bearer ${MASTER_KEY}` } });
          if (imgRes.ok) return new NextResponse(Buffer.from(await (await imgRes.blob()).arrayBuffer()), { headers: { 'Content-Type': 'image/jpeg' } });
        } catch {}
      }
      return NextResponse.json({ url: imageUrl, type: 'image' });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'POST with {prompt, model}' });
}