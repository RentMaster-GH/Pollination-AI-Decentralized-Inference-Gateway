import React from 'react';
import { ClusterMetrics, FailoverEvent } from '../types.ts';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, RefreshCw, Zap } from 'lucide-react';

interface SlaReliabilityProps {
  metrics: ClusterMetrics;
  failoverEvents: FailoverEvent[];
  onTriggerChaosTest: () => void;
  isChaosRunning: boolean;
}

export const SlaReliability: React.FC<SlaReliabilityProps> = ({
  metrics,
  failoverEvents,
  onTriggerChaosTest,
  isChaosRunning,
}) => {
  const allowedDowntimeSec = metrics.monthly_downtime_budget_sec || 260;
  const consumedSec = metrics.downtime_consumed_sec || 18;
  const budgetRemainingPercent = Math.round(
    ((allowedDowntimeSec - consumedSec) / allowedDowntimeSec) * 100
  );

  return (
    <div className="space-y-6">
      {/* SLA Metrics Header */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Guaranteed 99.99% Uptime SLA & Error Budget</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Automated Circuit Breaker</span>
              <span aria-hidden="true">·</span>
              <span>Sub-25ms Failover Rerouting</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Zero In-Flight Packet Drop</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerChaosTest}
              disabled={isChaosRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap"
            >
              <Zap className={`w-3.5 h-3.5 ${isChaosRunning ? 'animate-spin' : ''}`} />
              {isChaosRunning ? 'Simulating Socket Failure...' : 'Trigger Chaos Failover Test'}
            </button>
          </div>
        </div>

        {/* 4 SLA KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans">Current 30-Day Uptime</div>
            <div className="text-lg font-semibold text-emerald-400 mt-1 tabular-nums">
              {metrics.uptime_percentage}%
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">SLA Target: 99.990%</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans">Error Budget Remaining</div>
            <div className="text-lg font-semibold text-slate-100 mt-1 tabular-nums">
              {budgetRemainingPercent}%
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Consumed: {consumedSec}s of {allowedDowntimeSec}s
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans">Automated Failovers</div>
            <div className="text-lg font-semibold text-cyan-400 mt-1 tabular-nums">
              {metrics.automated_failovers_executed}
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">Success Rate: 100%</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans">Zero-Cost Cloud Savings</div>
            <div className="text-lg font-semibold text-emerald-400 mt-1 tabular-nums">
              ${metrics.estimated_cost_saved_usd.toFixed(2)}
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">vs Centralized Cloud</div>
          </div>
        </div>

        {/* Error Budget Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Monthly Uptime Error Budget (Max 4m 20s permitted downtime):</span>
            <span className="text-emerald-400 font-semibold">{budgetRemainingPercent}% Available</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${budgetRemainingPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Automated Failover Protocols & State Machine */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-slate-100 pb-3 border-b border-slate-800">
          Automated Failover Protocol Specification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs font-mono">
          <div className="p-3.5 bg-slate-950 border border-emerald-900/40 rounded">
            <div className="flex items-center justify-between text-emerald-400 font-sans font-semibold">
              <span>State: CLOSED</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-slate-400 font-sans text-xs mt-1.5 leading-relaxed">
              Nominal status. Requests flow based on optimal EWMA latency and quorum scoring. Health probes ping every 8s.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-red-900/40 rounded">
            <div className="flex items-center justify-between text-red-400 font-sans font-semibold">
              <span>State: OPEN (Tripped)</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-slate-400 font-sans text-xs mt-1.5 leading-relaxed">
              Triggered immediately upon 2 consecutive timeouts (&gt;1200ms) or 5xx socket closure. Traffic instantly re-routed to hot backup.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-amber-900/40 rounded">
            <div className="flex items-center justify-between text-amber-400 font-sans font-semibold">
              <span>State: HALF-OPEN (Canary)</span>
              <RefreshCw className="w-4 h-4" />
            </div>
            <p className="text-slate-400 font-sans text-xs mt-1.5 leading-relaxed">
              After a 20s cooldown, gateway injects synthetic canary pings. If 3 consecutive canaries succeed, breaker self-heals to CLOSED.
            </p>
          </div>
        </div>
      </div>

      {/* Failover Events Incident Audit Log */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Automated Failover Incident & Self-Healing Audit Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous mitigation events with zero user interruption
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {failoverEvents.length} events logged
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {failoverEvents.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No failover events recorded. All nodes operating normally within SLA.
            </div>
          ) : (
            failoverEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded text-xs space-y-1.5 font-mono"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">{evt.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-200">{evt.nodeName}</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-2">
                    <span>Reroute Latency: {evt.failoverLatencyMs}ms</span>
                    <span>·</span>
                    <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="text-slate-300 font-sans text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Cause: </span>
                  {evt.reason}
                </div>

                <div className="text-emerald-400 font-sans text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Action: </span>
                  {evt.actionTaken}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
