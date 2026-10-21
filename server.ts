import { createServer } from 'http'

// Self-hosted mesh state - NO POLLINATION KEYS
const nodes = [
  { id:'node-hf-frankfurt', name:'HF-Frankfurt-01', provider:'HuggingFace ZeroGPU', region:'eu-central', location:'Frankfurt, DE', lat:50.11, lng:8.68, status:'healthy', circuitBreaker:'closed', latencyMs:34, reputation:0.98, activeRequests:12, maxConcurrency:32, vramTotalGb:16, vramUsedGb:8.2, modelsSupported:['pollination-core-v3'], costPerHour:0, uptimePercent:99.99, lastHeartbeat:Date.now(), failedConsecutive:0 },
  { id:'node-accra', name:'ACC-Accra-01', provider:'Fly.io Free VM', region:'af-south', location:'Accra, GH', lat:5.6, lng:-0.2, status:'healthy', circuitBreaker:'closed', latencyMs:18, reputation:0.99, activeRequests:3, maxConcurrency:16, vramTotalGb:8, vramUsedGb:2.1, modelsSupported:['pollination-core-v3'], costPerHour:0, uptimePercent:99.992, lastHeartbeat:Date.now(), failedConsecutive:0 },
  { id:'node-us-east', name:'US-East-01', provider:'Render Web Worker', region:'us-east', location:'Virginia, US', lat:39, lng:-77, status:'degraded', circuitBreaker:'half-open', latencyMs:112, reputation:0.84, activeRequests:28, maxConcurrency:32, vramTotalGb:24, vramUsedGb:21.4, modelsSupported:['pollination-core-v3'], costPerHour:0, uptimePercent:99.5, lastHeartbeat:Date.now(), failedConsecutive:2 },
]
let keys = [{ id:'k1', name:'Default Dev Key', key:'pk_live_pollination_mesh_9999sla_free', tier:'Free Community', tokensPerMinuteLimit:60000, tokensRemaining:54000, requestsPerMinuteLimit:60, requestsRemaining:58, lastRefillTime:Date.now(), createdAt:new Date().toISOString(), totalTokensUsed:18450, totalRequests:1845 }]

const json = (res:any, data:any) => {
  res.writeHead(200, { 'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'*', 'Access-Control-Allow-Methods':'*' })
  res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(200, { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'*', 'Access-Control-Allow-Methods':'*' }); return res.end() }
  const url = new URL(req.url || '', `http://${req.headers.host}`)

  if (url.pathname === '/api/v1/nodes') return json(res, { nodes })
  if (url.pathname === '/api/v1/models') return json(res, { data:[{ id:'pollination-core-v3', name:'Mesh Core v3 - Competitive', type:'llm', context_window:32000, consensus_nodes_available:3, cost_per_million_tokens:'$0.00', sla_tier:'Free Community', features:['consensus-routing'] }] })
  if (url.pathname === '/api/v1/keys') {
    if (req.method === 'POST') {
      let body=''; req.on('data', c=>body+=c); req.on('end', ()=>{ try{const {name,tier}=JSON.parse(body); const nk={ id:'k'+Date.now(), name, key:'pk_live_'+Math.random().toString(36).slice(2,18), tier, tokensPerMinuteLimit:60000, tokensRemaining:60000, requestsPerMinuteLimit:tier==='Enterprise 99.99% SLA'?1000:60, requestsRemaining:60, lastRefillTime:Date.now(), createdAt:new Date().toISOString(), totalTokensUsed:0, totalRequests:0 }; keys.push(nk); json(res,{success:true,key:nk})}catch{json(res,{success:false})} }); return
    }
    return json(res, { keys })
  }
  if (url.pathname === '/api/v1/consensus/logs') return json(res, { consensus_logs:[{ id:'log1', timestamp:new Date().toISOString(), model:'pollination-core-v3', clientIp:'0.0.0.0', algorithm:'Weighted-EWMA-Consensus', candidateNodes:[{nodeId:'node-accra',score:0.98,latency:18}], primaryNodeId:'node-accra', quorumVerified:true, quorumAgreementRatio:0.994, hashAttestation:'0xabc', failoverOccurred:false, gatewayOverheadMs:8, inferenceLatencyMs:42, consensusVerificationMs:22, totalLatencyMs:78, tokenCount:64 }], failover_events:[{ id:'f1', timestamp:new Date().toISOString(), nodeId:'node-us-east', nodeName:'US-East-01', reason:'Latency spike', actionTaken:'Failover to accra', failoverLatencyMs:18, recovered:true }] })
  if (url.pathname === '/api/v1/video/status') return json(res, { models:[{ modelId:'video-accel-v1', name:'VideoAccel V1', weightSizeGb:12.4, isPrewarmed:true, hotNodes:['node-accra'], coldStartTraditionalSec:4.2, pollinationFastStartSec:0.078, cachedLayers:28, totalLayers:28 }] })
  if (url.pathname === '/api/v1/analytics/metrics') return json(res, { uptime_percentage:99.992, monthly_downtime_budget_sec:260, downtime_consumed_sec:18, total_requests_served:1845, automated_failovers_executed:2, failover_success_rate:'100%', average_consensus_agreement:'99.4%', average_total_latency_ms:78, estimated_cost_saved_usd:6.45, free_cloud_compute_share:'100.0%', zero_pii_hashes_attested:1845 })
  if (url.pathname === '/api/v1/chat/completions' && req.method === 'POST') {
    let body=''; req.on('data', c=>body+=c); req.on('end', ()=>{ const {model,messages}=JSON.parse(body||'{}'); const p=messages?.[messages.length-1]?.content||'hello'; json(res,{ id:'chatcmpl_'+Date.now(), model:model||'pollination-core-v3', choices:[{message:{role:'assistant',content:`[Competitive Mesh] Node ACC-01 (18ms) | EWMA Verified | Prompt: ${p}`}}], pollination_telemetry:{node_name:'ACC-Accra-01',latency_breakdown:{total_ms:78}} }) }); return
  }
  if (url.pathname.startsWith('/api/v1/nodes/chaos') || url.pathname.startsWith('/api/v1/nodes/register') || url.pathname.startsWith('/api/v1/video/prewarm') || url.pathname.startsWith('/api/v1/generate')) return json(res, { success:true, message:'Mock success - competitive gateway' })

  // Serve static for local vite preview? just 404 for api
  res.writeHead(404); res.end('Not found: '+url.pathname)
})

server.listen(3000, () => console.log('✅ Decentralized Gateway mock API running on http://localhost:3000 - independent, no external keys'))
