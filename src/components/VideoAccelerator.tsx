import { useState } from 'react'
export const VideoAccelerator = ({ videoModels = [], nodes = [], onPrewarmModel, onRunVideoInference }: any) => {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const models = videoModels?.length ? videoModels : [
    { id: 'pollination-video-v1', name: 'Pollination Video Core v1', status: 'hot', cold_start_ms: 8200, hot_start_ms: 78 },
    { id: 'modelscope-1.7b', name: 'ModelScope 1.7B', status: 'warm', cold_start_ms: 6500, hot_start_ms: 120 },
    { id: 'zeroscope-v2', name: 'Zeroscope V2 576w', status: 'cold', cold_start_ms: 9500, hot_start_ms: 95 },
  ]
  return (
    <div className="border border-slate-800 bg-slate-900/50 rounded-lg p-4">
      <h3 className="text-sm font-bold mb-1 text-white">Video Cold-Start Accelerator</h3>
      <p className="text-[11px] text-slate-400 mb-3">Mesh: {nodes.length || 4} nodes ONLINE - Pre-warming avoids 8s cold start</p>
      <div className="grid md:grid-cols-2 gap-3">
        {models.map((m: any) => (
          <div key={m.id} className="bg-slate-950 border border-slate-800 p-3 rounded">
            <div className="text-xs font-bold text-white">{m.name} <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${m.status==='hot'?'bg-emerald-900 text-emerald-300':'bg-slate-800 text-slate-400'}`}>{m.status}</span></div>
            <div className="text-[11px] text-slate-400 mt-1">Cold: {m.cold_start_ms}ms - Hot: {m.hot_start_ms}ms</div>
            <div className="flex gap-2 mt-2">
              <button disabled={loading===m.id} onClick={async()=>{ setLoading(m.id); try{ await onPrewarmModel?.(m.id)}finally{setLoading(null)} }} className="text-xs bg-cyan-900/40 text-cyan-300 px-2 py-1 rounded">Prewarm</button>
              <button disabled={loading===m.id} onClick={async()=>{ setLoading(m.id); try{ const d=await onRunVideoInference?.(m.id,m.status==='hot'); setResult(d)}finally{setLoading(null)} }} className="text-xs bg-slate-800 text-white px-2 py-1 rounded">Run Benchmark</button>
            </div>
          </div>
        ))}
      </div>
      {result && <pre className="mt-3 bg-black border border-slate-800 p-2 rounded text-[11px] text-cyan-200 overflow-auto max-h-64">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
