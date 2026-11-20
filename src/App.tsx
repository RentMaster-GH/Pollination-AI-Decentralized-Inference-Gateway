import { useState, useEffect } from 'react';
import { GatewayPlayground } from './components/GatewayPlayground';
import { RateLimiterKeys } from './components/RateLimiterKeys';
import { GeoMeshMap } from './components/GeoMeshMap';

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://pollination.credibleartisans.com'
    : 'http://localhost:3006');

export default function App() {
  const [health, setHealth] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-hp-elitebook');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [genPrompt, setGenPrompt] = useState('Cinematic futuristic skyline of Cape Coast Ghana at sunset');
  const [genType, setGenType] = useState<'image' | 'video'>('image');
  const [genResult, setGenResult] = useState<any>(null);
  const [genLoading, setGenLoading] = useState(false);

  const loadAll = async () => {
    setIsRefreshing(true);
    try {
      const [hRes, nRes, mRes, kRes] = await Promise.all([
        fetch(`${API_BASE}/api/health`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/api/v1/nodes`).then((r) => r.json()).catch(() => ({ nodes: [] })),
        fetch(`${API_BASE}/api/v1/models`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/api/v1/keys`).then((r) => r.json()).catch(() => ({ keys: [] })),
      ]);
      setHealth(hRes);
      setNodes(
        (nRes.nodes || []).map((n: any) => ({
          ...n,
          latency_ewma_ms: n.latencyMs || 14,
          gpu_type: `${n.vramTotalGb || 16}GB VRAM`,
          cpu_load: 18,
        }))
      );
      setModels(mRes.data || []);
      setApiKeys(
        (kRes.keys || []).map((k: any) => ({
          ...k,
          rate_limit_rpm: k.requestsPerMinuteLimit || 60,
          requests_used: k.totalRequests || 0,
        }))
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateKey = async (name: string, tier: string) => {
    await fetch(`${API_BASE}/api/keys/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tier, email: 'papastickle@gmail.com' }),
    });
    await loadAll();
  };

  const handleExecuteRequest = async (model: string, prompt: string, apiKey: string) => {
    const res = await fetch(`${API_BASE}/api/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    await loadAll();
    return data;
  };

  const handleMediaGenerate = async () => {
    setGenLoading(true);
    try {
      const activeKey = apiKeys[0]?.key || 'pk_live_pollination_mesh_9999sla_free';
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': activeKey,
        },
        body: JSON.stringify({
          prompt: genPrompt,
          type: genType,
          model: genType === 'video' ? 'flux' : 'turbo',
        }),
      });
      const data = await res.json();
      setGenResult(data);
      await loadAll();
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6">
      {/* Header */}
      <header className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-cyan-400">
            Pollination AI Decentralized Inference Gateway
          </h1>
          <p className="text-xs text-slate-400">
            Self-Hosted on HP EliteBook (PostgreSQL <code className="text-slate-200">pollination_db</code>) •{' '}
            <span className="font-mono text-cyan-300">{API_BASE}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span
            className={`px-3 py-1 rounded-full font-semibold border ${
              health?.status === 'ok'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
          >
            {health?.status === 'ok'
              ? `● HP Server Online (${health.keys || apiKeys.length} DB Keys)`
              : '● Connecting to HP Server...'}
          </span>
        </div>
      </header>

      {/* Media Generation Studio (Image & Video Proxy) */}
      <section className="border border-slate-800 bg-slate-900/50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-sm font-bold">Decentralized Media Generator (/api/generate)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setGenType('image')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                genType === 'image' ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Image (Turbo)
            </button>
            <button
              onClick={() => setGenType('video')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                genType === 'video' ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Video Frame (Flux)
            </button>
          </div>
          <textarea
            value={genPrompt}
            onChange={(e) => setGenPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs h-20"
          />
          <button
            onClick={handleMediaGenerate}
            disabled={genLoading}
            className="w-full bg-cyan-400 text-black py-2 rounded text-xs font-bold"
          >
            {genLoading ? 'Generating via HP Gateway...' : 'Generate Media (-1 Credit)'}
          </button>
        </div>

        <div className="bg-black border border-slate-800 rounded p-3 flex flex-col items-center justify-center min-h-[180px]">
          {genResult?.url ? (
            <div className="w-full space-y-2">
              <img
                src={genResult.url}
                alt={genResult.prompt}
                className="w-full max-h-60 object-cover rounded border border-slate-800"
              />
              <div className="text-[11px] font-mono text-emerald-300 flex justify-between">
                <span>Node: {genResult.node}</span>
                <span>Credits Left: {genResult.remainingCredits ?? 'Unlimited'}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500">Generated output preview will appear here</span>
          )}
        </div>
      </section>

      {/* OpenAI Compatible Chat Playground */}
      <GatewayPlayground models={models} apiKeys={apiKeys} onExecuteRequest={handleExecuteRequest} />

      {/* Persistent API Keys in PostgreSQL */}
      <RateLimiterKeys apiKeys={apiKeys} onCreateKey={handleCreateKey} onRefreshKeys={loadAll} />

      {/* Mesh Nodes */}
      <GeoMeshMap
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={(n: any) => setSelectedNodeId(n.id)}
        onRefresh={loadAll}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}
