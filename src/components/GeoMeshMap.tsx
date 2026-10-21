import React, { useState } from 'react';
import { DecentralizedNode } from '../types.ts';
import { Server, Zap, Shield, Cpu, Activity, RefreshCw } from 'lucide-react';

interface GeoMeshMapProps {
  nodes: DecentralizedNode[];
  onSelectNode: (node: DecentralizedNode) => void;
  selectedNodeId?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const GeoMeshMap: React.FC<GeoMeshMapProps> = ({
  nodes,
  onSelectNode,
  selectedNodeId,
  onRefresh,
  isRefreshing,
}) => {
  const [hoveredNode, setHoveredNode] = useState<DecentralizedNode | null>(null);

  // Map projection: Equirectangular projection into SVG canvas (1000 x 500)
  const mapCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
      {/* Header and metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Decentralized Compute Mesh & Peer Synchronization
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{nodes.length} Geographic Nodes</span>
            <span aria-hidden="true">·</span>
            <span>Gossip Sync: 120ms</span>
            <span aria-hidden="true">·</span>
            <span>Consensus Protocol: Raft-Quorum v2</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">Free Tier Compute: 100%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Mesh
          </button>
        </div>
      </div>

      {/* SVG Mesh Visualizer */}
      <div className="relative mt-4 bg-slate-950/80 rounded border border-slate-800/80 overflow-hidden">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-auto max-h-[460px] select-none"
        >
          {/* Subtle Geographic Latitude / Longitude Grid */}
          <g stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.5" strokeDasharray="3 3">
            {[100, 200, 300, 400].map((y) => (
              <line key={`lat-${y}`} x1="0" y1={y} x2="1000" y2={y} />
            ))}
            {[166, 333, 500, 666, 833].map((x) => (
              <line key={`lng-${x}`} x1={x} y1="0" x2={x} y2="500" />
            ))}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.8" />
          </g>

          {/* Continents Outline approximation for spatial reference */}
          <g fill="none" stroke="rgba(71, 85, 105, 0.35)" strokeWidth="1">
            {/* North America */}
            <path d="M 160 110 L 250 110 L 300 160 L 270 240 L 220 280 L 190 250 L 140 180 Z" />
            {/* South America */}
            <path d="M 280 300 L 360 330 L 330 440 L 290 440 L 270 340 Z" />
            {/* Europe */}
            <path d="M 480 120 L 580 120 L 590 190 L 520 210 L 460 170 Z" />
            {/* Africa */}
            <path d="M 480 230 L 590 230 L 600 360 L 540 420 L 470 310 Z" />
            {/* Asia */}
            <path d="M 600 110 L 840 120 L 880 220 L 760 300 L 620 230 Z" />
            {/* Australia */}
            <path d="M 780 340 L 890 340 L 880 430 L 790 420 Z" />
          </g>

          {/* Active Gossip Synchronization Arcs between nodes */}
          <g stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" fill="none">
            {nodes.map((node, i) => {
              const nextNode = nodes[(i + 1) % nodes.length];
              const p1 = mapCoords(node.lat, node.lng);
              const p2 = mapCoords(nextNode.lat, nextNode.lng);
              const midX = (p1.x + p2.x) / 2;
              const midY = Math.min(p1.y, p2.y) - 25;
              return (
                <path
                  key={`link-${node.id}-${nextNode.id}`}
                  d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                  strokeDasharray="4 4"
                />
              );
            })}
          </g>

          {/* Node Markers */}
          {nodes.map((node) => {
            const { x, y } = mapCoords(node.lat, node.lng);
            const isSelected = node.id === selectedNode?.id;
            const isOffline = node.status === 'offline';
            const isDegraded = node.status === 'degraded';
            const color = isOffline ? '#ef4444' : isDegraded ? '#f59e0b' : '#38bdf8';

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Ping wave animation for healthy nodes */}
                {!isOffline && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? '14' : '9'}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                )}

                {/* Center marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '6' : '4.5'}
                  fill={color}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />

                {/* Node Label */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : '#94a3b8'}
                  fontSize="9.5"
                  fontWeight={isSelected ? '600' : '400'}
                  className="pointer-events-none"
                >
                  {node.name} ({node.latencyMs}ms)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Quick Tooltip */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded text-xs space-y-0.5 pointer-events-none shadow-xl z-20">
            <div className="font-semibold text-slate-100">{hoveredNode.name}</div>
            <div className="text-slate-400">
              {hoveredNode.provider} · {hoveredNode.location}
            </div>
            <div className="text-cyan-400 font-mono">
              Latency: {hoveredNode.latencyMs}ms · VRAM: {hoveredNode.vramUsedGb}/{hoveredNode.vramTotalGb}GB
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Deep-Dive Panel */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-slate-950/60 border border-slate-800 rounded">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <div className="text-xs text-slate-400">Inspecting Selected Edge Node</div>
              <div className="text-sm font-semibold text-slate-100 mt-0.5 flex items-center gap-2">
                <span>{selectedNode.name}</span>
                <span className="text-xs font-mono text-slate-400">({selectedNode.id})</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">
                Status:{' '}
                <span
                  className={
                    selectedNode.status === 'healthy'
                      ? 'text-emerald-400 font-semibold'
                      : selectedNode.status === 'degraded'
                      ? 'text-amber-400 font-semibold'
                      : 'text-red-400 font-semibold'
                  }
                >
                  {selectedNode.status.toUpperCase()}
                </span>
              </span>
              <span className="text-slate-400">
                Breaker:{' '}
                <span
                  className={
                    selectedNode.circuitBreaker === 'closed'
                      ? 'text-emerald-400'
                      : selectedNode.circuitBreaker === 'half-open'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }
                >
                  {selectedNode.circuitBreaker.toUpperCase()}
                </span>
              </span>
              <span className="text-slate-400">
                Cost: <span className="text-emerald-400 font-semibold">$0.00/hr (Free Tier)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
            <div className="p-2.5 bg-slate-900/70 border border-slate-800/70 rounded">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                EWMA Ping
              </div>
              <div className="text-base font-semibold text-slate-100 font-mono tabular-nums mt-1">
                {selectedNode.latencyMs}ms
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Uptime: {selectedNode.uptimePercent}%</div>
            </div>

            <div className="p-2.5 bg-slate-900/70 border border-slate-800/70 rounded">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                VRAM Allocation
              </div>
              <div className="text-base font-semibold text-slate-100 font-mono tabular-nums mt-1">
                {selectedNode.vramUsedGb} / {selectedNode.vramTotalGb} GB
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Util: {Math.round((selectedNode.vramUsedGb / selectedNode.vramTotalGb) * 100)}%
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/70 border border-slate-800/70 rounded">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Reputation Score
              </div>
              <div className="text-base font-semibold text-slate-100 font-mono tabular-nums mt-1">
                {(selectedNode.reputation * 100).toFixed(0)}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Quorum Weight: 1.0</div>
            </div>

            <div className="p-2.5 bg-slate-900/70 border border-slate-800/70 rounded">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Concurrency
              </div>
              <div className="text-base font-semibold text-slate-100 font-mono tabular-nums mt-1">
                {selectedNode.activeRequests} / {selectedNode.maxConcurrency}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Available Slots: {selectedNode.maxConcurrency - selectedNode.activeRequests}</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-400">Supported Models:</span>
              <span className="text-slate-200 font-mono">{selectedNode.modelsSupported.join(' · ')}</span>
            </div>
            <div className="text-slate-400 font-mono">
              Provider: <span className="text-cyan-400">{selectedNode.provider}</span> ({selectedNode.location})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
