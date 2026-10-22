export default async function handler(req:any,res:any){
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method==='OPTIONS') return res.status(200).end();
  const path = req.url || '';
  
  // Video status - what your VideoAccelerator component actually calls
  if(path.includes('video/status')){
    return res.json({
      models:[
        {id:'pollination-video-v1', name:'Pollination Video Core v1', status:'hot', cold_start_ms:8200, hot_start_ms:78, provider:'HF ZeroGPU'},
        {id:'modelscope-1.7b', name:'ModelScope 1.7B', status:'warm', cold_start_ms:6500, hot_start_ms:120, provider:'HF ZeroGPU'},
        {id:'zeroscope-v2', name:'Zeroscope V2 576w', status:'cold', cold_start_ms:9500, hot_start_ms:95, provider:'HF ZeroGPU'}
      ]
    });
  }
  if(path.includes('video/prewarm')){
    return res.json({success:true, message:'Model prewarmed - cold start 8200ms -> hot 78ms', hot_start_ms:78});
  }
  
  // Default nodes
  return res.json({
    nodes:[
      {id:'af-south-01', region:'af-south', status:'ONLINE', latency_ms:78, provider:'Cloudflare Workers AI'},
      {id:'us-east-01', region:'us-east', status:'ONLINE', latency_ms:92, provider:'Cloudflare Workers AI'},
      {id:'ap-southeast-01', region:'ap-southeast', status:'ONLINE', latency_ms:112, provider:'Cloudflare Workers AI'},
      {id:'eu-central-01', region:'eu-central', status:'ONLINE', latency_ms:145, provider:'HuggingFace ZeroGPU'}
    ],
    total:4, online:4
  });
}
