export type Node = { id:string; region:string; status:'online'|'offline'; latency:number; tier:number };
export type Consensus = { block:number; nodes:number; agreement:number };
export type VideoJob = { prompt:string; duration:number; aspect:string; status:string };
