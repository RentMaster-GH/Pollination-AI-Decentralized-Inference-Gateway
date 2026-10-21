export const config = { runtime: 'edge' }
export default async function handler(req: Request){
  const {messages} = await req.json() as any
  const prompt = messages?.slice(-1)[0]?.content || ''
  const r = await fetch('https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',{
    method:'POST',
    headers:{Authorization:`Bearer ${process.env.HF_TOKEN}`, 'Content-Type':'application/json'},
    body:JSON.stringify({inputs:prompt, parameters:{max_new_tokens:512}})
  })
  const j = await r.json() as any
  const text = Array.isArray(j) ? j[0]?.generated_text : j?.generated_text || JSON.stringify(j)
  return new Response(JSON.stringify({choices:[{message:{role:'assistant',content:text}}]}),{headers:{'Content-Type':'application/json'}})
}
