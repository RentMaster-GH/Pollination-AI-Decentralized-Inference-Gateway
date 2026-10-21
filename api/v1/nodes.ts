export default function handler(req:any,res:any){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.json({nodes:[
  {id:'node-hf-frankfurt',name:'HF-Frankfurt-01',provider:'HuggingFace ZeroGPU',region:'eu-central',location:'Frankfurt, DE',lat:50.11,lng:8.68,status:'healthy',circuitBreaker:'closed',latencyMs:34,reputation:0.98,activeRequests:12,maxConcurrency:32,vramTotalGb:16,vramUsedGb:8.2,modelsSupported:['pollination-core-v3'],costPerHour:0,uptimePercent:99.99,lastHeartbeat:Date.now(),failedConsecutive:0},
  {id:'node-accra',name:'ACC-Accra-01',provider:'Fly.io Free VM',region:'af-south',location:'Accra, GH',lat:5.6,lng:-0.2,status:'healthy',circuitBreaker:'closed',latencyMs:18,reputation:0.99,activeRequests:3,maxConcurrency:16,vramTotalGb:8,vramUsedGb:2.1,modelsSupported:['pollination-core-v3'],costPerHour:0,uptimePercent:99.992,lastHeartbeat:Date.now(),failedConsecutive:0},
  {id:'node-us-east',name:'US-East-01',provider:'Render Web Worker',region:'us-east',location:'Virginia, US',lat:39.0,lng:-77.0,status:'degraded',circuitBreaker:'half-open',latencyMs:112,reputation:0.84,activeRequests:28,maxConcurrency:32,vramTotalGb:24,vramUsedGb:21.4,modelsSupported:['pollination-core-v3'],costPerHour:0,uptimePercent:99.5,lastHeartbeat:Date.now(),failedConsecutive:2},
 ]});
}
