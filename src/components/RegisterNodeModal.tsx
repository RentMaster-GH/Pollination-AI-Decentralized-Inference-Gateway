export const RegisterNodeModal=({isOpen,onClose,onRegister}:any)=>{
 const [name,setName]=useState('worker-accra-02');
 const [region,setRegion]=useState('af-south-1');
 if(!isOpen) return null;
 return <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"><div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md"><h3 className="text-sm font-bold mb-4">Register New Worker Node</h3><label className="text-xs text-slate-400">Name</label><input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs mt-1 mb-3"/><label className="text-xs text-slate-400">Region</label><input value={region} onChange={e=>setRegion(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs mt-1 mb-4"/><div className="flex gap-2"><button onClick={()=>{onRegister({name,region}); onClose();}} className="flex-1 bg-cyan-400 text-black py-2 rounded text-xs font-bold">Join Mesh</button><button onClick={onClose} className="flex-1 bg-slate-800 py-2 rounded text-xs">Cancel</button></div></div></div>
}
import {useState} from 'react';
