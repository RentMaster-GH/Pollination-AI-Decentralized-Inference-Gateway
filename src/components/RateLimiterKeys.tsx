import React, { useState } from 'react';
import { ApiKeyRecord } from '../types.ts';
import { Key, Shield, Plus, Copy, Check, RefreshCw, Zap, Lock } from 'lucide-react';

interface RateLimiterKeysProps {
  apiKeys: ApiKeyRecord[];
  onCreateKey: (name: string, tier: 'Free Community' | 'Developer Pro' | 'Enterprise 99.99% SLA') => Promise<void>;
  onRefreshKeys: () => void;
}

export const RateLimiterKeys: React.FC<RateLimiterKeysProps> = ({
  apiKeys,
  onCreateKey,
  onRefreshKeys,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyTier, setNewKeyTier] = useState<'Free Community' | 'Developer Pro' | 'Enterprise 99.99% SLA'>('Developer Pro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onCreateKey(newKeyName.trim(), newKeyTier);
      setNewKeyName('');
      setShowCreateModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>API Gateway Rate Limiting & Access Keys</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Token Bucket Algorithm</span>
              <span aria-hidden="true">·</span>
              <span>HMAC-SHA256 Payload Attestation</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400">Custom SLA Tiers</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Generate API Key
            </button>
          </div>
        </div>

        {/* Tier Specification Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="font-semibold text-slate-200">Free Community Tier</div>
            <div className="text-slate-400 text-[11px] mt-1 font-mono">
              30 req/min · 15,000 tokens/min
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Best for hackathons, open-source testing, and hobbyist bots on decentralized cloud workers.
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-cyan-900/50 rounded">
            <div className="font-semibold text-cyan-300">Developer Pro Tier</div>
            <div className="text-cyan-400 text-[11px] mt-1 font-mono">
              120 req/min · 50,000 tokens/min
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Multi-region dual-dispatch routing with automatic fallback across all 8 mesh providers.
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-emerald-900/50 rounded">
            <div className="font-semibold text-emerald-300">Enterprise 99.99% SLA</div>
            <div className="text-emerald-400 text-[11px] mt-1 font-mono">
              600 req/min · 100,000 tokens/min
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Dedicated warm worker pools, zero-cold start video channels, and hedged quorum consensus.
            </div>
          </div>
        </div>
      </div>

      {/* Active Keys List */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Active API Keys</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pass via <code className="text-cyan-400 font-mono">Authorization: Bearer &lt;key&gt;</code> or{' '}
              <code className="text-cyan-400 font-mono">X-Pollination-Key</code>
            </p>
          </div>
          <button
            onClick={onRefreshKeys}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {apiKeys.map((keyRecord) => {
            const reqPercent = Math.round(
              (keyRecord.requestsRemaining / keyRecord.requestsPerMinuteLimit) * 100
            );
            const tokenPercent = Math.round(
              (keyRecord.tokensRemaining / keyRecord.tokensPerMinuteLimit) * 100
            );

            return (
              <div
                key={keyRecord.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-xs text-slate-200">{keyRecord.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      [{keyRecord.tier}]
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-300">
                      {keyRecord.key.slice(0, 14)}...{keyRecord.key.slice(-6)}
                    </code>
                    <button
                      onClick={() => handleCopy(keyRecord.id, keyRecord.key)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                      title="Copy Key"
                    >
                      {copiedKeyId === keyRecord.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Token Bucket Usage Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Requests Bucket */}
                  <div>
                    <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                      <span>Requests Remaining (this min):</span>
                      <span className="text-slate-200 tabular-nums">
                        {keyRecord.requestsRemaining} / {keyRecord.requestsPerMinuteLimit} ({reqPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
                      <div
                        className="bg-cyan-500 h-full transition-all"
                        style={{ width: `${reqPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Tokens Bucket */}
                  <div>
                    <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                      <span>Tokens Remaining (this min):</span>
                      <span className="text-slate-200 tabular-nums">
                        {keyRecord.tokensRemaining.toLocaleString()} /{' '}
                        {keyRecord.tokensPerMinuteLimit.toLocaleString()} ({tokenPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${tokenPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <div>
                    Total Invocations: {keyRecord.totalRequests.toLocaleString()} requests ·{' '}
                    {keyRecord.totalTokensUsed.toLocaleString()} tokens used
                  </div>
                  <div>Refill interval: 60s sliding window</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-sm text-slate-100">Provision New API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Key Description Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production Mobile App"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">SLA Tier</label>
                <select
                  value={newKeyTier}
                  onChange={(e) => setNewKeyTier(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Free Community">Free Community (30 req/min · 15k tokens)</option>
                  <option value="Developer Pro">Developer Pro (120 req/min · 50k tokens)</option>
                  <option value="Enterprise 99.99% SLA">Enterprise 99.99% SLA (600 req/min · 100k tokens)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 font-medium rounded text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  {isSubmitting ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
