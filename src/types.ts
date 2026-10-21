export type DecentralizedNode={id:string;name:string;region:string;provider:string;status:'healthy'|'degraded'|'offline';latency_ewma_ms:number;cpu_load:number;gpu_type:string;models_served:string[];last_heartbeat:string}
export type ApiKeyRecord={id:string;key:string;name:string;tier:string;created_at:string;requests_used:number;rate_limit_rpm:number}
export type ConsensusLog={id:string;timestamp:string;request_id:string;primary_node:string;quorum_nodes:string[];consensus_time_ms:number;agreement:string;failover_triggered:boolean}
export type VideoPrewarmState={id:string;name:string;status:'cold'|'warming'|'hot';cold_start_ms:number;hot_start_ms:number;prewarm_nodes:string[]}
export type GatewayModel={id:string;name:string;type:'text'|'video'|'image';context_length:number;provider:string}
export type FailoverEvent={id:string;timestamp:string;from_node:string;to_node:string;reason:string;failover_time_ms:number;success:boolean}
export type ClusterMetrics={uptime_percentage:number;monthly_downtime_budget_sec:number;downtime_consumed_sec:number;total_requests_served:number;automated_failovers_executed:number;failover_success_rate:string;average_consensus_agreement:string;average_total_latency_ms:number;estimated_cost_saved_usd:number;free_cloud_compute_share:string;zero_pii_hashes_attested:number}
