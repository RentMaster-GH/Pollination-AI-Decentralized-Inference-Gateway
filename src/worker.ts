export interface Env { AI: any }
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'*','Access-Control-Allow-Headers':'*'}})
    }
    try{
      const body:any = await request.json();
      const prompt = body.messages?.slice(-1)[0]?.content || 'Hello';
      const result:any = await env.AI.run('@cf/meta/llama-3.2-1b-instruct', {prompt});
      return new Response(JSON.stringify({
        id:'cf-accra-01',
        choices:[{message:{role:'assistant',content: result.response || result}}],
        pollination_telemetry:{node_name:'ACC-Accra-01-CF-Primary', region:'af-south', provider:'Cloudflare Workers AI'}
      }),{headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}})
    }catch(e:any){
      return new Response(JSON.stringify({error:e.message}),{status:500, headers:{'Access-Control-Allow-Origin':'*'}})
    }
  }
}
