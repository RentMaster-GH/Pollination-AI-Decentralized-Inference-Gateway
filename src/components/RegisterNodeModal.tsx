import React, { useState } from 'react';
import { X, Server, Terminal, Copy, Check } from 'lucide-react';

interface RegisterNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (nodeData: any) => Promise<void>;
}

export const RegisterNodeModal: React.FC<RegisterNodeModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [nodeName, setNodeName] = useState('');
  const [provider, setProvider] = useState('HuggingFace ZeroGPU');
  const [region, setRegion] = useState('us-east-1');
  const [location, setLocation] = useState('New York, USA');
  const [vramTotalGb, setVramTotalGb] = useState('16');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedDaemon, setCopiedDaemon] = useState(false);

  if (!isOpen) return null;

  const daemonCommand = `curl -sSL https://get.pollination.ai/worker.sh | bash -s -- \\
  --mesh-id "pollination-global-v2" \\
  --provider "${provider}" \\
  --region "${region}" \\
  --max-vram ${vramTotalGb}GB`;

  const handleCopyDaemon = () => {
    navigator.clipboard.writeText(daemonCommand);
    setCopiedDaemon(true);
    setTimeout(() => setCopiedDaemon(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onRegister({
        name: nodeName.trim(),
        provider,
        region,
        location,
        vramTotalGb: Number(vramTotalGb) || 16,
        lat: 38.0 + (Math.random() - 0.5) * 20,
        lng: -90.0 + (Math.random() - 0.5) * 60,
        modelsSupported: ['pollination-core-v3', 'mistral-nemo-free'],
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-100">
              Register Node / Join Decentralized Mesh
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Daemon Run instructions */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Automated CLI Worker Daemon
            </span>
            <button
              onClick={handleCopyDaemon}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              {copiedDaemon ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Command
                </>
              )}
            </button>
          </div>
          <pre className="font-mono text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded overflow-x-auto">
            {daemonCommand}
          </pre>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Node Identifier / Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kaggle-T4-Community-01"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Provider Type</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="HuggingFace ZeroGPU">HuggingFace ZeroGPU</option>
                <option value="Kaggle P100/T4">Kaggle P100/T4</option>
                <option value="Colab Free Edge">Colab Free Edge</option>
                <option value="Fly.io Free VM">Fly.io Free VM</option>
                <option value="Render Web Worker">Render Web Worker</option>
                <option value="Oracle ARM Free">Oracle ARM Free</option>
                <option value="Local P2P Daemon">Local P2P Daemon</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Allocated VRAM (GB)</label>
              <input
                type="number"
                min="4"
                max="80"
                value={vramTotalGb}
                onChange={(e) => setVramTotalGb(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. eu-west-1"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Geographic Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Paris, France"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 font-medium rounded text-slate-950 bg-cyan-400 hover:bg-cyan-300"
            >
              {isSubmitting ? 'Registering...' : 'Register to Mesh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
