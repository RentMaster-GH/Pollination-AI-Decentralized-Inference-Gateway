import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'POST with {prompt, model}' }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, model = 'flux', width = 1280, height = 720 } = body;
    if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model}&width=${width}&height=${height}&nologo=true&enhance=true`;
    return NextResponse.json({ url, prompt }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
