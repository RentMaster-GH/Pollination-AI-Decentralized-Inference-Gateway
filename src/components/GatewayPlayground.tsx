import React, { useState } from 'react';
import { GatewayModel, ApiKeyRecord } from '../types.ts';
import { Play, Copy, Check, Terminal, Zap, Shield, RefreshCw } from 'lucide-react';

interface GatewayPlaygroundProps {
  models: GatewayModel[];
  apiKeys: ApiKeyRecord[];
  onExecuteRequest: (modelId: string, prompt: string, apiKey: string) => Promise<any>;
}

export const GatewayPlayground: React.FC<GatewayPlaygroundProps> = ({
  models,
  apiKeys,
  onExecuteRequest,
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('pollination-core-v3');
  const [selectedKey, setSelectedKey] = useState<string>(apiKeys[0]?.key || '');
  const [prompt, setPrompt] = useState<string>(
    'Explain how decentralized consensus routing minimizes inference latency across heterogeneous free cloud GPU nodes.'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<any | null>(null);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const samplePresets = [
    {
      label: 'Consensus Latency',
      prompt: 'Explain how decentralized consensus routing minimizes inference latency across heterogeneous free cloud GPU nodes.',
    },
    {
      label: 'Automated Failover',
      prompt: 'Describe the circuit breaker transition from CLOSED to OPEN during a 1200ms node socket timeout, and how zero packet loss is guaranteed.',
    },
    {
      label: 'Zero-Cost Compute',
      prompt: 'How does Pollination aggregate free tiers from HuggingFace ZeroGPU, Kaggle T4, and Colab while maintaining 99.99% enterprise uptime SLAs?',
    },
  ];

  const handleRun = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setResponseOutput(null);
    try {
      const res = await onExecuteRequest(selectedModel, prompt, selectedKey);
      setResponseOutput(res);
    } catch (err: any) {
      setResponseOutput({
        error: err.message || 'Gateway routing request failed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const curlCommand = `curl -X POST "${window.location.origin}/api/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${selectedKey || 'pk_live_pollination_mesh_9999sla_free'}" \\
  -H "X-Pollination-Key: ${selectedKey || 'pk_live_pollination_mesh_9999sla_free'}" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [{"role": "user", "content": "${prompt.replace(/"/g, '\\"')}"}],
    "temperature": 0.7
  }'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const currentModelData = models.find((m) => m.id === selectedModel);

  return (
    <div className="space-y-6">
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="pb-4 border-b border-slate-800">
          <h2 className="text-base font-semibold text-slate-100">
            Interactive API Gateway Playground & cURL Generator
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>OpenAI Compatible: /api/v1/chat/completions</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Multi-Factor Consensus</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">Guaranteed 99.99% SLA</span>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
          {/* Model Selector */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Decentralized Target Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.consensus_nodes_available} Nodes Online · {m.cost_per_million_tokens})
                </option>
              ))}
            </select>
            {currentModelData && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                <span>Context: {currentModelData.context_window.toLocaleString()} tokens</span>
                <span aria-hidden="true">·</span>
                <span>SLA Tier: {currentModelData.sla_tier}</span>
                <span aria-hidden="true">·</span>
                <span>Type: {currentModelData.type.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* API Key Selector */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              API Authentication Key (Tier Rate-Limit)
            </label>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            >
              {apiKeys.map((k) => (
                <option key={k.id} value={k.key}>
                  {k.name} [{k.tier}] — {k.requestsRemaining} req remaining
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>Token bucket rate-limiting active with zero-knowledge header attestation</span>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4">
          <div className="text-xs text-slate-400 mb-1.5">Prompt Presets:</div>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setPrompt(preset.prompt)}
                className="text-xs bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-800/80 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Inference Prompt Payload</span>
            <span className="font-mono">{prompt.length} chars</span>
          </div>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type a prompt to distribute through the decentralized consensus gateway..."
            className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono resize-y"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hedged consensus dual-dispatch enabled</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyCurl}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded transition-colors"
            >
              {copiedCurl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied cURL
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy cURL
                </>
              )}
            </button>

            <button
              onClick={handleRun}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Routing Quorum...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Execute Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Response and Telemetry Inspection */}
      {responseOutput && (
        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Gateway Response & Consensus Telemetry</span>
                <span className="text-xs font-mono text-emerald-400">
                  {responseOutput.pollination_telemetry ? '200 OK' : 'ERROR'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Latency Breakdown: Gateway + Edge Worker + Consensus Verification
              </p>
            </div>

            {responseOutput.pollination_telemetry && (
              <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                <span>
                  Node:{' '}
                  <span className="text-cyan-400 font-semibold">
                    {responseOutput.pollination_telemetry.node_name}
                  </span>
                </span>
                <span>
                  Total:{' '}
                  <span className="text-cyan-400 font-semibold tabular-nums">
                    {responseOutput.pollination_telemetry.latency_breakdown.total_ms}ms
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Telemetry Metric Badges */}
          {responseOutput.pollination_telemetry && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                <div className="text-slate-400 text-[11px]">Gateway Ingest & Hash</div>
                <div className="text-base font-semibold text-slate-100 mt-1 tabular-nums">
                  {responseOutput.pollination_telemetry.latency_breakdown.gateway_overhead_ms}ms
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                <div className="text-slate-400 text-[11px]">Decentralized Inference</div>
                <div className="text-base font-semibold text-emerald-400 mt-1 tabular-nums">
                  {responseOutput.pollination_telemetry.latency_breakdown.inference_latency_ms}ms
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                <div className="text-slate-400 text-[11px]">Consensus Quorum</div>
                <div className="text-base font-semibold text-cyan-400 mt-1 tabular-nums">
                  {responseOutput.pollination_telemetry.latency_breakdown.consensus_verification_ms}ms
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                <div className="text-slate-400 text-[11px]">Tokens Generated</div>
                <div className="text-base font-semibold text-slate-100 mt-1 tabular-nums">
                  {responseOutput.usage?.completion_tokens || 42} tokens
                </div>
              </div>
            </div>
          )}

          {/* Assistant Text Output */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded">
            <div className="text-xs text-slate-400 font-medium mb-2 flex items-center justify-between">
              <span>Completion Text Output:</span>
              <span className="font-mono text-[11px] text-slate-400">
                Model: {responseOutput.model}
              </span>
            </div>
            <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {responseOutput.choices?.[0]?.message?.content ||
                JSON.stringify(responseOutput, null, 2)}
            </pre>
          </div>

          {/* Raw JSON Toggle / Curl Output */}
          <details className="text-xs">
            <summary className="cursor-pointer text-slate-400 hover:text-slate-200 select-none">
              View Raw JSON Response & Headers
            </summary>
            <div className="mt-2 p-3 bg-slate-950/90 border border-slate-800/80 rounded font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60">
              <pre>{JSON.stringify(responseOutput, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}

      {/* Code Integration Snippet */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Standard OpenAI Client Integration (Zero Code Migration)</span>
          </div>
          <button
            onClick={() => {
              const code = `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${window.location.origin}/api/v1',
  apiKey: '${selectedKey || 'pk_live_pollination_mesh_9999sla_free'}',
});

const response = await client.chat.completions.create({
  model: '${selectedModel}',
  messages: [{ role: 'user', content: 'Hello Pollination' }],
});

console.log(response.choices[0].message.content);`;
              navigator.clipboard.writeText(code);
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Copy TypeScript SDK Code
          </button>
        </div>

        <pre className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-300 overflow-x-auto">
{`import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${window.location.origin}/api/v1',
  apiKey: '${selectedKey || 'pk_live_pollination_mesh_9999sla_free'}',
});

const response = await client.chat.completions.create({
  model: '${selectedModel}',
  messages: [{ role: 'user', content: 'Hello Pollination' }],
});

console.log(response.choices[0].message.content);`}
        </pre>
      </div>
    </div>
  );
};
