export const Header=({activeTab,setActiveTab,onOpenRegisterModal}:any)=>{
 const tabs=['overview','consensus','playground','mesh','video','keys','sla'];
 return <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20 backdrop-blur"><div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap"><div className="font-bold text-cyan-400 text-sm mr-4">⚡ MESH GATEWAY</div>{tabs.map(t=><button key={t} onClick={()=>setActiveTab(t)} className={`px-3 py-1.5 rounded text-xs ${activeTab===t?'bg-cyan-400 text-black font-semibold':'bg-slate-800 text-slate-300'}`}>{t}</button>)}<button onClick={onOpenRegisterModal} className="ml-auto bg-emerald-400 text-black px-3 py-1.5 rounded text-xs font-bold">+ Register Node</button></div></header>
}
