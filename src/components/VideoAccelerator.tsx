import React, { useState } from 'react';
import { VideoPrewarmState, DecentralizedNode } from '../types.ts';
import { Play, Sparkles, Zap, Layers, RefreshCw, CheckCircle2, Film } from 'lucide-react';

interface VideoAcceleratorProps {
  videoModels: VideoPrewarmState[];
  nodes: DecentralizedNode[];
  onPrewarmModel: (modelId: string) => Promise<void>;
  onRunVideoInference: (modelId: string, prewarmActive: boolean) => Promise<any>;
}

export const VideoAccelerator: React.FC<VideoAcceleratorProps> = ({
  videoModels,
  nodes,
  onPrewarmModel,
  onRunVideoInference,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(videoModels[0]?.modelId || '');
  const [isPrewarming, setIsPrewarming] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<any | null>(null);

  const activeModel = videoModels.find((m) => m.modelId === selectedModelId) || videoModels[0];

  const handlePrewarm = async () => {
    if (!activeModel || isPrewarming) return;
    setIsPrewarming(true);
    try {
      await onPrewarmModel(activeModel.modelId);
    } finally {
      setIsPrewarming(false);
    }
  };

  const handleTestInference = async (prewarm: boolean) => {
    if (!activeModel || isGenerating) return;
    setIsGenerating(true);
    setBenchmarkResult(null);
    try {
      const res = await onRunVideoInference(activeModel.modelId, prewarm);
      setBenchmarkResult(res);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>Video Model Cold-Start Accelerator & Tensor Cache</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Zero-to-First-Frame Optimization</span>
              <span aria-hidden="true">·</span>
              <span>Layer-wise Safetensor Paging</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">94.2% Cold-Start Latency Reduction</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrewarm}
              disabled={isPrewarming || activeModel?.isPrewarmed}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeModel?.isPrewarmed
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-800/40 cursor-default'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPrewarming ? 'animate-spin' : ''}`} />
              {isPrewarming
                ? 'Streaming Weights...'
                : activeModel?.isPrewarmed
                ? 'Weights Pre-Warmed'
                : 'Pre-Warm Tensor Cache'}
            </button>
          </div>
        </div>

        {/* Technical Explainer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Problem: Heavy Weight Cold Starts
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
              Diffusion video models (10GB–24GB) take 25s–45s to load weights from disk into GPU VRAM on traditional cloud instances.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Solution: Decentralized Layer Streaming
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
              Pollination keeps hot layer memory partitions pinned across the mesh. Video latents start rendering within 800ms while remaining frames stream.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <div className="text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Result: Sub-2s First Frame
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
              Cold-start latency drops from 28.6 seconds down to 1.4 seconds, unlocking interactive real-time video generation pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* Model Selector & Benchmarking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Model Selection & Cache Status */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-100 pb-3 border-b border-slate-800">
            Select Video Model
          </h3>

          <div className="mt-3 space-y-2">
            {videoModels.map((vm) => {
              const isSelected = vm.modelId === selectedModelId;
              return (
                <div
                  key={vm.modelId}
                  onClick={() => setSelectedModelId(vm.modelId)}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-700/60 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{vm.name}</span>
                    {vm.isPrewarmed ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        HOT
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">COLD</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5 font-mono">
                    <span>{vm.weightSizeGb} GB</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Layers: {vm.cachedLayers}/{vm.totalLayers}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-cyan-400">{vm.pollinationFastStartSec}s Fast</span>
                  </div>
                </div>
              );
            })}
          </div>

          {activeModel && (
            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs space-y-2">
              <div className="text-slate-400 text-[11px]">Allocated Hot Standby Nodes:</div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {activeModel.hotNodes.map((nId) => {
                  const nObj = nodes.find((n) => n.id === nId);
                  return (
                    <span
                      key={nId}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-cyan-300"
                    >
                      {nObj ? nObj.name : nId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Comparative Cold-Start Latency Benchmark */}
        <div className="lg:col-span-2 border border-slate-800 bg-slate-900/40 rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Cold-Start Benchmark: Traditional vs Pollination Accelerator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Model: {activeModel?.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTestInference(false)}
                disabled={isGenerating}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded transition-colors"
              >
                Run Uncached (Cold)
              </button>
              <button
                onClick={() => handleTestInference(true)}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Pollination Fast-Track
              </button>
            </div>
          </div>

          {/* Visual Latency Bar Comparison */}
          {activeModel && (
            <div className="mt-5 space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Traditional Cloud Cold Start (Full checkpoint load):</span>
                  <span className="text-red-400 font-semibold tabular-nums">
                    {activeModel.coldStartTraditionalSec}s
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded overflow-hidden border border-slate-800">
                  <div
                    className="bg-red-500/80 h-full transition-all duration-500"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Pollination Decentralized Layer Cache (Pre-warmed):</span>
                  <span className="text-emerald-400 font-semibold tabular-nums">
                    {activeModel.pollinationFastStartSec}s
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-500"
                    style={{
                      width: `${(activeModel.pollinationFastStartSec / activeModel.coldStartTraditionalSec) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded text-emerald-300 flex items-center justify-between">
                <span>Total Latency Reduction:</span>
                <span className="font-semibold text-sm tabular-nums">
                  {(
                    ((activeModel.coldStartTraditionalSec - activeModel.pollinationFastStartSec) /
                      activeModel.coldStartTraditionalSec) *
                    100
                  ).toFixed(1)}
                  % Faster (-
                  {(activeModel.coldStartTraditionalSec - activeModel.pollinationFastStartSec).toFixed(1)}s)
                </span>
              </div>
            </div>
          )}

          {/* Benchmark Execution Result Box */}
          {benchmarkResult && (
            <div className="mt-5 p-4 bg-slate-950 border border-slate-800 rounded space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Inference Benchmark Completed: {benchmarkResult.model}
                </span>
                <span className="font-mono text-cyan-400">
                  Latency: {benchmarkResult.latency_sec}s
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Mode: {benchmarkResult.acceleration_mode} · Output: {benchmarkResult.resolution} @{' '}
                {benchmarkResult.fps}fps
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1">
                {benchmarkResult.sample_video_frames?.map((frame: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-cyan-400">▶</span>
                    <span>{frame}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
