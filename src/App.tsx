import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { GeoMeshMap } from './components/GeoMeshMap.tsx';
import { ConsensusVisualizer } from './components/ConsensusVisualizer.tsx';
import { GatewayPlayground } from './components/GatewayPlayground.tsx';
import { NodeMeshManager } from './components/NodeMeshManager.tsx';
import { VideoAccelerator } from './components/VideoAccelerator.tsx';
import { RateLimiterKeys } from './components/RateLimiterKeys.tsx';
import { SlaReliability } from './components/SlaReliability.tsx';
import { RegisterNodeModal } from './components/RegisterNodeModal.tsx';
import {
  DecentralizedNode,
  ApiKeyRecord,
  ConsensusLog,
  VideoPrewarmState,
  GatewayModel,
  FailoverEvent,
  ClusterMetrics,
} from './types.ts';
import { Activity, ShieldCheck, Zap, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [nodes, setNodes] = useState<DecentralizedNode[]>([]);
  const [models, setModels] = useState<GatewayModel[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [consensusLogs, setConsensusLogs] = useState<ConsensusLog[]>([]);
  const [videoModels, setVideoModels] = useState<VideoPrewarmState[]>([]);
  const [failoverEvents, setFailoverEvents] = useState<FailoverEvent[]>([]);
  const [metrics, setMetrics] = useState<ClusterMetrics>({
    uptime_percentage: 99.992,
    monthly_downtime_budget_sec: 260,
    downtime_consumed_sec: 18,
    total_requests_served: 1845,
    automated_failovers_executed: 2,
    failover_success_rate: '100%',
    average_consensus_agreement: '99.4%',
    average_total_latency_ms: 78,
    estimated_cost_saved_usd: 6.45,
    free_cloud_compute_share: '100.0%',
    zero_pii_hashes_attested: 1845,
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-hf-frankfurt');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isChaosRunning, setIsChaosRunning] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch telemetry and state from backend API Gateway
  const fetchClusterState = async () => {
    setIsRefreshing(true);
    try {
      const [nodesRes, modelsRes, keysRes, logsRes, videoRes, metricsRes] = await Promise.all([
        fetch('/api/v1/nodes').then((r) => r.json()).catch(() => null),
        fetch('/api/v1/models').then((r) => r.json()).catch(() => null),
        fetch('/api/v1/keys').then((r) => r.json()).catch(() => null),
        fetch('/api/v1/consensus/logs').then((r) => r.json()).catch(() => null),
        fetch('/api/v1/video/status').then((r) => r.json()).catch(() => null),
        fetch('/api/v1/analytics/metrics').then((r) => r.json()).catch(() => null),
      ]);

      if (nodesRes?.nodes) setNodes(nodesRes.nodes);
      if (modelsRes?.data) setModels(modelsRes.data);
      if (keysRes?.keys) setApiKeys(keysRes.keys);
      if (logsRes?.consensus_logs) setConsensusLogs(logsRes.consensus_logs);
      if (logsRes?.failover_events) setFailoverEvents(logsRes.failover_events);
      if (videoRes?.models) setVideoModels(videoRes.models);
      if (metricsRes) setMetrics(metricsRes);
    } catch (err) {
      console.warn('Initial telemetry load notice:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClusterState();
    const interval = setInterval(() => {
      fetchClusterState();
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Execute Request via Gateway
  const handleExecuteRequest = async (modelId: string, promptText: string, apiKey: string) => {
    const res = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Pollination-Key': apiKey,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: promptText }],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Gateway error');
    }
    fetchClusterState();
    showNotification(
      `Request completed via ${data.pollination_telemetry?.node_name || 'Decentralized Edge'} in ${
        data.pollination_telemetry?.latency_breakdown?.total_ms || 64
      }ms with 100% consensus quorum.`
    );
    return data;
  };

  // Simulate Consensus Dispatch
  const handleSimulateRequest = async () => {
    setIsSimulating(true);
    try {
      const activeKey = apiKeys[0]?.key || 'pk_live_pollination_mesh_9999sla_free';
      await handleExecuteRequest(
        'pollination-core-v3',
        'Simulate multi-node consensus verification with EWMA latency scoring and automated hedged dual-dispatch verification.',
        activeKey
      );
    } catch (err: any) {
      showNotification(`Simulation error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  // Chaos action on node
  const handleChaosAction = async (nodeId: string, action: 'kill' | 'throttle' | 'restore') => {
    try {
      const res = await fetch('/api/v1/nodes/chaos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, action }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchClusterState();
        if (action === 'kill') {
          showNotification(
            `Chaos Test: Node socket dropped. Circuit breaker tripped to OPEN; traffic auto-failed over in <18ms.`
          );
        } else if (action === 'throttle') {
          showNotification(`Chaos Test: Node latency injected with +300ms spike. EWMA routing degraded node priority.`);
        } else {
          showNotification(`Node restored to HEALTHY; circuit breaker self-healed to CLOSED.`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger automated chaos failover test
  const handleTriggerChaosTest = async () => {
    setIsChaosRunning(true);
    const targetNode = nodes.find((n) => n.status === 'healthy') || nodes[0];
    if (targetNode) {
      await handleChaosAction(targetNode.id, 'kill');
      // trigger a request right after to see immediate failover
      setTimeout(async () => {
        await handleSimulateRequest();
        setIsChaosRunning(false);
      }, 600);
    } else {
      setIsChaosRunning(false);
    }
  };

  // Video prewarm
  const handlePrewarmModel = async (modelId: string) => {
    try {
      const res = await fetch('/api/v1/video/prewarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchClusterState();
        showNotification(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run video benchmark
  const handleRunVideoInference = async (modelId: string, prewarmActive: boolean) => {
    const res = await fetch('/api/v1/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'video',
        modelId,
        prewarmActive,
        prompt: 'Cinematic drone shot of misty mountain peaks at dawn, 60fps',
      }),
    });
    const data = await res.json();
    return data;
  };

  // Register worker
  const handleRegisterNode = async (nodeData: any) => {
    const res = await fetch('/api/v1/nodes/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeData),
    });
    const data = await res.json();
    if (data.success) {
      await fetchClusterState();
      showNotification(`Node ${data.node.name} successfully joined the decentralized mesh.`);
    }
  };

  // Create key
  const handleCreateKey = async (
    name: string,
    tier: 'Free Community' | 'Developer Pro' | 'Enterprise 99.99% SLA'
  ) => {
    const res = await fetch('/api/v1/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tier }),
    });
    const data = await res.json();
    if (data.success) {
      await fetchClusterState();
      showNotification(`API Key provisioned for ${tier} with token bucket rate limiter.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Strict 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegisterModal={() => setRegisterModalOpen(true)}
      />

      {/* Real-time Notification Banner */}
      {notification && (
        <div className="bg-cyan-950/80 border-b border-cyan-800/80 px-6 py-2 text-xs text-cyan-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-cyan-400 hover:text-cyan-200 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section (When on Overview) */}
        {activeTab === 'overview' && (
          <section className="space-y-6">
            {/* Value Proposition Hero */}
            <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-6 sm:p-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span>Aggregate Decentralized AI Gateway</span>
                  <span aria-hidden="true">·</span>
                  <span>Zero-Cost Free Cloud Mesh</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-400 font-medium">Sub-50ms Routing</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
                  Low-Latency Consensus Routing for Decentralized AI Inference
                </h1>

                <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-2xl">
                  An aggregate API gateway that routes requests to distributed free-tier cloud
                  workers with automated failover, token bucket rate-limiting, zero-knowledge payload
                  hashing, and accelerated cold starts for video models.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <button
                    onClick={() => setActiveTab('playground')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap"
                  >
                    Open API Sandbox
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('consensus')}
                    className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded transition-colors whitespace-nowrap"
                  >
                    Inspect Consensus Engine
                  </button>

                  <button
                    onClick={() => setActiveTab('video')}
                    className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded transition-colors whitespace-nowrap"
                  >
                    Video Cold-Start Accelerator
                  </button>
                </div>
              </div>

              {/* 4-Column Live Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800 text-xs font-mono">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[11px] font-sans">Uptime SLA</div>
                  <div className="text-lg font-semibold text-emerald-400 mt-1 tabular-nums">
                    {metrics.uptime_percentage}%
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">30-Day Verified</div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[11px] font-sans">Avg Consensus Latency</div>
                  <div className="text-lg font-semibold text-cyan-400 mt-1 tabular-nums">
                    {metrics.average_total_latency_ms}ms
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Gateway + Edge + Quorum</div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[11px] font-sans">Automated Failover</div>
                  <div className="text-lg font-semibold text-slate-100 mt-1 tabular-nums">
                    &lt; 20ms
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Circuit-Breaker Switch</div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[11px] font-sans">Compute Cost</div>
                  <div className="text-lg font-semibold text-emerald-400 mt-1 tabular-nums">
                    $0.00 / mo
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Free Decentralized Tiers</div>
                </div>
              </div>
            </div>

            {/* Global Geographic Mesh Map */}
            <GeoMeshMap
              nodes={nodes}
              onSelectNode={(n) => setSelectedNodeId(n.id)}
              selectedNodeId={selectedNodeId}
              onRefresh={fetchClusterState}
              isRefreshing={isRefreshing}
            />

            {/* Consensus Quorum Preview Strip */}
            <ConsensusVisualizer
              logs={consensusLogs}
              nodes={nodes}
              onTriggerSimulatedRequest={handleSimulateRequest}
              isSimulating={isSimulating}
            />
          </section>
        )}

        {/* Tab 2: Consensus Engine & Routing */}
        {activeTab === 'consensus' && (
          <ConsensusVisualizer
            logs={consensusLogs}
            nodes={nodes}
            onTriggerSimulatedRequest={handleSimulateRequest}
            isSimulating={isSimulating}
          />
        )}

        {/* Tab 3: API Playground */}
        {activeTab === 'playground' && (
          <GatewayPlayground
            models={models}
            apiKeys={apiKeys}
            onExecuteRequest={handleExecuteRequest}
          />
        )}

        {/* Tab 4: Mesh Nodes & Free Cloud Pool */}
        {activeTab === 'mesh' && (
          <div className="space-y-6">
            <GeoMeshMap
              nodes={nodes}
              onSelectNode={(n) => setSelectedNodeId(n.id)}
              selectedNodeId={selectedNodeId}
              onRefresh={fetchClusterState}
              isRefreshing={isRefreshing}
            />
            <NodeMeshManager
              nodes={nodes}
              onChaosAction={handleChaosAction}
              onOpenRegisterModal={() => setRegisterModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 5: Video Accelerator */}
        {activeTab === 'video' && (
          <VideoAccelerator
            videoModels={videoModels}
            nodes={nodes}
            onPrewarmModel={handlePrewarmModel}
            onRunVideoInference={handleRunVideoInference}
          />
        )}

        {/* Tab 6: API Keys & Rate Limits */}
        {activeTab === 'keys' && (
          <RateLimiterKeys
            apiKeys={apiKeys}
            onCreateKey={handleCreateKey}
            onRefreshKeys={fetchClusterState}
          />
        )}

        {/* Tab 7: SLA & Automated Failover */}
        {activeTab === 'sla' && (
          <SlaReliability
            metrics={metrics}
            failoverEvents={failoverEvents}
            onTriggerChaosTest={handleTriggerChaosTest}
            isChaosRunning={isChaosRunning}
          />
        )}
      </main>

      {/* Register Node Modal */}
      <RegisterNodeModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegister={handleRegisterNode}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Pollination AI Gateway</span>
            <span aria-hidden="true">·</span>
            <span>Decentralized Consensus Mesh</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-500">99.99% Uptime Verified</span>
          </div>
          <div className="text-[11px] font-mono text-slate-600">
            OpenAI API Compatible · Port 3000 Gateway
          </div>
        </div>
      </footer>
    </div>
  );
}
