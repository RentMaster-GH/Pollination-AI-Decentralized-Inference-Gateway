import React, { useState } from 'react';
import { ConsensusLog, DecentralizedNode } from '../types.ts';
import { Cpu, ShieldCheck, ArrowRight, Activity, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface ConsensusVisualizerProps {
  logs: ConsensusLog[];
  nodes: DecentralizedNode[];
  onTriggerSimulatedRequest: () => void;
  isSimulating: boolean;
}

export const ConsensusVisualizer: React.FC<ConsensusVisualizerProps> = ({
  logs,
  nodes,
  onTriggerSimulatedRequest,
  isSimulating,
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(logs[0]?.id || null);

  const activeLog = logs.find((l) => l.id === selectedLogId) || logs[0];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Load-Balanced Consensus & Routing Architecture
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Weighted-EWMA Scoring</span>
              <span aria-hidden="true">·</span>
              <span>Hedged Dual Dispatch</span>
              <span aria-hidden="true">·</span>
              <span>Quorum Attestation</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400">Zero-Downtime Failover</span>
            </div>
          </div>

          <button
            onClick={onTriggerSimulatedRequest}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Processing Quorum...' : 'Simulate Consensus Dispatch'}
          </button>
        </div>

        {/* 4-Stage Visual Pipeline Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-xs">
          {/* Stage 1 */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800/80">
                <span className="font-semibold text-slate-200">1. Ingestion & Privacy</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-slate-400 mt-2 leading-relaxed">
                Client prompt is HMAC-SHA256 authenticated. Payload is stripped of PII via zero-knowledge token hash before mesh distribution.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-300">
              Overhead: ~6ms
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800/80">
                <span className="font-semibold text-slate-200">2. Multi-Factor Scoring</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-slate-400 mt-2 leading-relaxed">
                Candidate nodes are ranked using EWMA latency (35%), reputation (25%), VRAM/concurrency headroom (20%), and zero-cost cloud tier (20%).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-300">
              Selection: Top 3 candidates
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800/80">
                <span className="font-semibold text-slate-200">3. Hedged Quorum</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-slate-400 mt-2 leading-relaxed">
                Dual dispatch to primary & secondary nodes. Output token attestation hash verified against Byzantine faults or edge hallucinations.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 font-mono text-[11px] text-emerald-400">
              Consensus: 3/3 verified
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800/80">
                <span className="font-semibold text-slate-200">4. Auto Failover</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-slate-400 mt-2 leading-relaxed">
                Socket timeout (&gt;1200ms) or 5xx instantly trips the circuit breaker to OPEN. Request switches to warm fallback in &lt;20ms.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 font-mono text-[11px] text-cyan-400">
              SLA Guarantee: 99.99%
            </div>
          </div>
        </div>
      </div>

      {/* Inspect Selected Log & Recent Real-Time Consensus Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Consensus Transactions Table */}
        <div className="lg:col-span-2 border border-slate-800 bg-slate-900/40 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Live Consensus Quorum Feed</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time decisions across decentralized nodes</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{logs.length} logged requests</span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 font-medium">Request ID</th>
                  <th className="pb-2 font-medium">Model</th>
                  <th className="pb-2 font-medium">Selected Node</th>
                  <th className="pb-2 font-medium text-right">Consensus Latency</th>
                  <th className="pb-2 font-medium text-right">Quorum</th>
                  <th className="pb-2 font-medium text-right">Failover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500 font-sans">
                      No requests logged yet. Click &quot;Simulate Consensus Dispatch&quot; or run a prompt in the API Playground.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isSelected = activeLog?.id === log.id;
                    const nodeObj = nodes.find((n) => n.id === log.primaryNodeId);
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLogId(log.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-cyan-950/30 text-cyan-200' : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 pr-2 font-medium">
                          {log.id.slice(0, 14)}...
                        </td>
                        <td className="py-2.5 pr-2 font-sans truncate max-w-[120px]">
                          {log.model}
                        </td>
                        <td className="py-2.5 pr-2 font-sans text-slate-200">
                          {nodeObj ? nodeObj.name : log.primaryNodeId}
                        </td>
                        <td className="py-2.5 pr-2 text-right tabular-nums text-slate-200">
                          {log.totalLatencyMs}ms
                        </td>
                        <td className="py-2.5 pr-2 text-right">
                          <span className="text-emerald-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 inline" />
                            {(log.quorumAgreementRatio * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          {log.failoverOccurred ? (
                            <span className="text-amber-400 font-semibold">Active</span>
                          ) : (
                            <span className="text-slate-400">Nominal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Deep-Dive Execution Breakdown */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-100 pb-3 border-b border-slate-800">
            Consensus Quorum Deep-Dive
          </h3>

          {activeLog ? (
            <div className="mt-3 space-y-4 text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">Request Identifier</div>
                <div className="font-mono text-slate-200 text-xs mt-0.5">{activeLog.id}</div>
                <div className="text-slate-400 text-[11px] mt-1 font-mono">
                  Origin: {activeLog.clientIp} · {new Date(activeLog.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* Latency Waterfall Breakdown */}
              <div>
                <div className="text-slate-400 text-[11px] mb-1.5">Latency Waterfall Breakdown</div>
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>1. Gateway Ingest & Hash:</span>
                    <span className="tabular-nums">{activeLog.gatewayOverheadMs}ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full"
                      style={{
                        width: `${Math.max(5, (activeLog.gatewayOverheadMs / activeLog.totalLatencyMs) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-300 mt-2">
                    <span>2. Edge Decentralized Inference:</span>
                    <span className="tabular-nums">{activeLog.inferenceLatencyMs}ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{
                        width: `${Math.max(10, (activeLog.inferenceLatencyMs / activeLog.totalLatencyMs) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-300 mt-2">
                    <span>3. Quorum Verification:</span>
                    <span className="tabular-nums">{activeLog.consensusVerificationMs}ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                    <div
                      className="bg-amber-500 h-full"
                      style={{
                        width: `${Math.max(5, (activeLog.consensusVerificationMs / activeLog.totalLatencyMs) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-100 font-semibold pt-2 border-t border-slate-800">
                    <span>Total Latency:</span>
                    <span className="tabular-nums text-cyan-400">{activeLog.totalLatencyMs}ms</span>
                  </div>
                </div>
              </div>

              {/* Candidate Scoring Ranking */}
              <div>
                <div className="text-slate-400 text-[11px] mb-1.5">Candidate Node Scoring Matrix</div>
                <div className="space-y-1 font-mono">
                  {activeLog.candidateNodes.map((c, i) => {
                    const node = nodes.find((n) => n.id === c.nodeId);
                    return (
                      <div
                        key={c.nodeId}
                        className={`p-2 rounded flex items-center justify-between ${
                          i === 0 ? 'bg-slate-800/80 text-cyan-300 border border-cyan-800/40' : 'bg-slate-950/40 text-slate-400'
                        }`}
                      >
                        <div className="truncate max-w-[150px]">
                          <span className="text-slate-400 mr-1">#{i + 1}</span>
                          <span className="font-sans text-xs">{node ? node.name : c.nodeId}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{c.score} score</span>
                          <span className="text-[10px] text-slate-400 ml-1.5">({c.latency}ms)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cryptographic Attestation */}
              <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded font-mono text-[11px] space-y-1">
                <div className="text-slate-400 text-[10px]">Zero-Knowledge Attestation Hash:</div>
                <div className="text-emerald-400 truncate">{activeLog.hashAttestation}6b498f219c00</div>
                <div className="text-slate-400 text-[10px] pt-1">
                  Failover Protocol: {activeLog.failoverOccurred ? 'Triggered' : 'Healthy (Nominal)'}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center text-slate-500 text-xs">
              Select a logged transaction to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
