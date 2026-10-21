export interface DecentralizedNode {
  id: string;
  name: string;
  provider: 'HuggingFace ZeroGPU' | 'Kaggle P100/T4' | 'Colab Free Edge' | 'Render Web Worker' | 'Fly.io Free VM' | 'Oracle ARM Free' | 'Local P2P Daemon' | 'Cloudflare Worker';
  region: string;
  location: string;
  lat: number;
  lng: number;
  status: 'healthy' | 'degraded' | 'offline';
  circuitBreaker: 'closed' | 'open' | 'half-open';
  latencyMs: number;
  reputation: number; // 0.0 to 1.0
  activeRequests: number;
  maxConcurrency: number;
  vramTotalGb: number;
  vramUsedGb: number;
  modelsSupported: string[];
  costPerHour: number; // $0.00
  uptimePercent: number;
  lastHeartbeat: number;
  failedConsecutive: number;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  tier: 'Free Community' | 'Developer Pro' | 'Enterprise 99.99% SLA';
  tokensPerMinuteLimit: number;
  tokensRemaining: number;
  requestsPerMinuteLimit: number;
  requestsRemaining: number;
  lastRefillTime: number;
  createdAt: string;
  totalTokensUsed: number;
  totalRequests: number;
}

export interface ConsensusLog {
  id: string;
  timestamp: string;
  model: string;
  clientIp: string;
  algorithm: 'Weighted-EWMA-Consensus' | 'Hedged-Dual-Dispatch';
  candidateNodes: { nodeId: string; score: number; latency: number }[];
  primaryNodeId: string;
  quorumVerified: boolean;
  quorumAgreementRatio: number;
  hashAttestation: string;
  failoverOccurred: boolean;
  failoverReason?: string;
  failoverBackupNodeId?: string;
  gatewayOverheadMs: number;
  inferenceLatencyMs: number;
  consensusVerificationMs: number;
  totalLatencyMs: number;
  tokenCount: number;
}

export interface VideoPrewarmState {
  modelId: string;
  name: string;
  weightSizeGb: number;
  isPrewarmed: boolean;
  hotNodes: string[];
  coldStartTraditionalSec: number;
  pollinationFastStartSec: number;
  cachedLayers: number;
  totalLayers: number;
}

export interface GatewayModel {
  id: string;
  name: string;
  type: 'llm' | 'video' | 'vision';
  context_window: number;
  consensus_nodes_available: number;
  cost_per_million_tokens: string;
  sla_tier: string;
  features: string[];
}

export interface FailoverEvent {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeName: string;
  reason: string;
  actionTaken: string;
  failoverLatencyMs: number;
  recovered: boolean;
}

export interface ClusterMetrics {
  uptime_percentage: number;
  monthly_downtime_budget_sec: number;
  downtime_consumed_sec: number;
  total_requests_served: number;
  automated_failovers_executed: number;
  failover_success_rate: string;
  average_consensus_agreement: string;
  average_total_latency_ms: number;
  estimated_cost_saved_usd: number;
  free_cloud_compute_share: string;
  zero_pii_hashes_attested: number;
}
