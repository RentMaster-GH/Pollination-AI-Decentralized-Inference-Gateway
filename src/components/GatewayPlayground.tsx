import {useState} from 'react';
export const GatewayPlayground=({models,apiKeys,onExecuteRequest}:any)=>{
 const [prompt,setPrompt]=useState('Explain decentralized consensus routing in 2 sentences');
 const [model,setModel]=useState(models[0]?.id||'pollination-core-v3');
 const [result,setResult]=useState('');
 const [loading,setLoading]=useState(false);
 const run=async()=>{
  setLoading(true);setResult('');
  try{
   const data=await onExecuteRequest(model,prompt,apiKeys[0]?.key||'pk_live_test');
   setResult(JSON.stringify(data,null,2));
  }catch(e:any){setResult('Error: '+e.message)}finally{setLoading(false)}
 };
 return <div className="border border-slate-800 bg-slate-900/50 rounded-lg p-4 grid md:grid-cols-2 gap-4"><div><h3 className="text-sm font-bold mb-3">API Playground (OpenAI Compatible)</h3><label className="text-xs text-slate-400">Model</label><select value={model} onChange={e=>setModel(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs mt-1 mb-3">{models.map((m:any)=><option key={m.id} value={m.id}>{m.name}</option>)}<option value="pollination-core-v3">pollination-core-v3 (your mesh)</option></select><label className="text-xs text-slate-400">Prompt</label><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs mt-1 h-24"/><button onClick={run} disabled={loading} className="w-full mt-3 bg-cyan-400 text-black py-2 rounded text-xs font-bold">{loading?'Routing via mesh...':'Execute via Gateway'}</button><div className="text-[10px] text-slate-500 mt-2">Endpoint: POST /api/v1/chat/completions</div></div><div className="bg-black border border-slate-800 rounded p-3"><div className="text-xs text-slate-400 mb-2">Response</div><pre className="text-[11px] text-emerald-300 whitespace-pre-wrap overflow-auto max-h-96">{result||'No request yet'}</pre></div></div>
}
