import React from 'react';
import { ShieldCheck, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegisterModal,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'consensus', label: 'Consensus Engine' },
    { id: 'playground', label: 'API Playground' },
    { id: 'mesh', label: 'Mesh Nodes' },
    { id: 'video', label: 'Video Accelerator' },
    { id: 'keys', label: 'Keys & Rate Limits' },
    { id: 'sla', label: 'SLA & Failover' },
  ];

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="text-base font-semibold tracking-tight text-white whitespace-nowrap hover:text-cyan-400 transition-colors"
        >
          Pollination AI Gateway
        </a>
      </div>

      {/* Zone 2: Concise single-line navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap transition-colors py-1 ${
                isActive
                  ? 'text-cyan-400 border-b border-cyan-400 font-semibold'
                  : 'hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Single primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenRegisterModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          Join Mesh
        </button>
      </div>
    </header>
  );
};
