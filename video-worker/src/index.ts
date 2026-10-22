export default {
  async fetch(req: Request): Promise<Response> {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors })
    const body: any = await req.json().catch(()=>({}))
    return Response.json({
      type: 'video',
      status: 'success',
      cold_start_ms: 78,
      hot_start_ms: 78,
      video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      prompt: body.prompt || 'demo',
      message: 'Worker deployed! Architecture supports 60s+ timeout (vs Vercel 10s)'
    }, { headers: cors })
  }
}
