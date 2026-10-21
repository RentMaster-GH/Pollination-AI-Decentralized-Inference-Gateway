import React, { useState } from 'react';
import { DecentralizedNode } from '../types.ts';
import { Server, Zap, Shield, Cpu, Activity, AlertOctagon, CheckCircle2, RotateCcw, Search, Sparkles } from 'lucide-react';

interface NodeMeshManagerProps {
  nodes: DecentralizedNode[];
  onChaosAction: (nodeId: string, action: 'kill' | 'throttle' | 'restore') => Promise<void>;
  onOpenRegisterModal: () => void;
}

export const NodeMeshManager: React.FC<NodeMeshManagerProps> = ({
  nodes,
  onChaosAction,
  onOpenRegisterModal,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.region.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesProvider =
      providerFilter === 'all' || node.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const handleAction = async (nodeId: string, action: 'kill' | 'throttle' | 'restore') => {
    setLoadingNodeId(nodeId);
    try {
      await onChaosAction(nodeId, action);
    } finally {
      setLoadingNodeId(null);
    }
  };

  const providers = Array.from(new Set(nodes.map((n) => n.provider)));

  return (
    <div className="space-y-6">
      {/* Top Banner & Free Compute Stats */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Decentralized Free Cloud Computing Pool
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>HuggingFace ZeroGPU</span>
              <span aria-hidden="true">·</span>
              <span>Kaggle T4</span>
              <span aria-hidden="true">·</span>
              <span>Google Colab</span>
              <span aria-hidden="true">·</span>
              <span>Fly.io Edge</span>
              <span aria-hidden="true">·</span>
              <span>Oracle ARM Free</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRegisterModal}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap"
            >
              + Register Worker Node
            </button>
          </div>
        </div>

        {/* Free Compute Resource Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Aggregate VRAM Pool
            </div>
            <div className="text-lg font-semibold text-slate-100 mt-1 tabular-nums">
              {nodes.reduce((acc, n) => acc + n.vramTotalGb, 0)} GB
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Used: {nodes.reduce((acc, n) => acc + n.vramUsedGb, 0).toFixed(1)} GB
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Compute Expenditure
            </div>
            <div className="text-lg font-semibold text-emerald-400 mt-1 tabular-nums">
              $0.00 / hr
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              100% Free Tier Cloud Harvest
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Healthy Node Quorum
            </div>
            <div className="text-lg font-semibold text-slate-100 mt-1 tabular-nums">
              {nodes.filter((n) => n.status === 'healthy').length} / {nodes.length}
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Available Capacity: 88%
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Failover Protocol
            </div>
            <div className="text-lg font-semibold text-emerald-400 mt-1 tabular-nums">
              &lt; 20ms
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Circuit-Breaker Autonomous
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search nodes by name, region, or location..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Providers ({nodes.length})</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Decentralized Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNodes.map((node) => {
          const isBusy = loadingNodeId === node.id;
          const isOffline = node.status === 'offline';
          const isDegraded = node.status === 'degraded';

          return (
            <div
              key={node.id}
              className={`p-4 bg-slate-900/40 border rounded-lg transition-all ${
                isOffline
                  ? 'border-red-900/60 bg-red-950/10'
                  : isDegraded
                  ? 'border-amber-900/60 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100">{node.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">({node.region})</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {node.provider} · {node.location}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-mono font-semibold ${
                      node.status === 'healthy'
                        ? 'text-emerald-400'
                        : node.status === 'degraded'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {node.status.toUpperCase()}
                  </span>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Breaker: {node.circuitBreaker.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 my-3 text-xs font-mono">
                <div className="p-2 bg-slate-950/60 border border-slate-800/60 rounded">
                  <div className="text-slate-400 text-[10px] font-sans">EWMA Ping</div>
                  <div className="font-semibold text-slate-200 mt-0.5 tabular-nums">
                    {node.latencyMs}ms
                  </div>
                </div>

                <div className="p-2 bg-slate-950/60 border border-slate-800/60 rounded">
                  <div className="text-slate-400 text-[10px] font-sans">VRAM Load</div>
                  <div className="font-semibold text-slate-200 mt-0.5 tabular-nums">
                    {node.vramUsedGb}/{node.vramTotalGb}GB
                  </div>
                </div>

                <div className="p-2 bg-slate-950/60 border border-slate-800/60 rounded">
                  <div className="text-slate-400 text-[10px] font-sans">Uptime SLA</div>
                  <div className="font-semibold text-emerald-400 mt-0.5 tabular-nums">
                    {node.uptimePercent}%
                  </div>
                </div>
              </div>

              {/* Chaos Engineering & Failover Controls */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 font-sans">
                  Chaos Testing:
                </div>

                <div className="flex items-center gap-1.5">
                  {node.status === 'healthy' ? (
                    <>
                      <button
                        disabled={isBusy}
                        onClick={() => handleAction(node.id, 'throttle')}
                        className="px-2 py-1 text-[11px] font-medium bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 rounded transition-colors"
                      >
                        Throttle (+300ms)
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => handleAction(node.id, 'kill')}
                        className="px-2 py-1 text-[11px] font-medium bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded transition-colors"
                      >
                        Kill Socket (Test Failover)
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={isBusy}
                      onClick={() => handleAction(node.id, 'restore')}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 rounded transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore Node
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
