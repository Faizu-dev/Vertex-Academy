import React from 'react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  clusterLatency?: string;
  clusterStatus?: string;
}

interface GoogleTabItem {
  id: NavTab;
  colorName: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
  hoverBg: string;
  label: string;
  icon: string;
  badge?: string;
}

const SIDEBAR_TABS: GoogleTabItem[] = [
  {
    id: 'studio',
    colorName: 'blue',
    iconBg: 'bg-[#e8f0fe]',
    iconColor: 'text-[#1a73e8]',
    borderColor: 'border-[#4285F4]',
    activeBg: 'bg-[#e8f0fe]',
    activeText: 'text-[#1a73e8]',
    activeBorder: 'border-l-[#4285F4]',
    hoverBg: 'hover:bg-[#e8f0fe]/60',
    label: 'Agent Studio',
    icon: 'smart_toy',
  },
  {
    id: 'my-courses',
    colorName: 'red',
    iconBg: 'bg-[#fce8e6]',
    iconColor: 'text-[#c5221f]',
    borderColor: 'border-[#EA4335]',
    activeBg: 'bg-[#fce8e6]',
    activeText: 'text-[#c5221f]',
    activeBorder: 'border-l-[#EA4335]',
    hoverBg: 'hover:bg-[#fce8e6]/60',
    label: 'Course Discovery',
    icon: 'auto_stories',
  },
  {
    id: 'learning-player',
    colorName: 'yellow',
    iconBg: 'bg-[#fef7e0]',
    iconColor: 'text-[#b06000]',
    borderColor: 'border-[#FBBC04]',
    activeBg: 'bg-[#fef7e0]',
    activeText: 'text-[#b06000]',
    activeBorder: 'border-l-[#FBBC04]',
    hoverBg: 'hover:bg-[#fef7e0]/60',
    label: 'Learning Player',
    icon: 'record_voice_over',
    badge: '3D Live',
  },
  {
    id: 'analytics',
    colorName: 'blue',
    iconBg: 'bg-[#e8f0fe]',
    iconColor: 'text-[#1a73e8]',
    borderColor: 'border-[#4285F4]',
    activeBg: 'bg-[#e8f0fe]',
    activeText: 'text-[#1a73e8]',
    activeBorder: 'border-l-[#4285F4]',
    hoverBg: 'hover:bg-[#e8f0fe]/60',
    label: 'Knowledge Graph',
    icon: 'hub',
  },
  {
    id: 'oral-defense',
    colorName: 'green',
    iconBg: 'bg-[#e6f4ea]',
    iconColor: 'text-[#137333]',
    borderColor: 'border-[#34A853]',
    activeBg: 'bg-[#e6f4ea]',
    activeText: 'text-[#137333]',
    activeBorder: 'border-l-[#34A853]',
    hoverBg: 'hover:bg-[#e6f4ea]/60',
    label: 'Oral Defense & Exam',
    icon: 'workspace_premium',
    badge: 'Gemini S2S',
  },
  {
    id: 'agent-logs',
    colorName: 'red',
    iconBg: 'bg-[#fce8e6]',
    iconColor: 'text-[#c5221f]',
    borderColor: 'border-[#EA4335]',
    activeBg: 'bg-[#fce8e6]',
    activeText: 'text-[#c5221f]',
    activeBorder: 'border-l-[#EA4335]',
    hoverBg: 'hover:bg-[#fce8e6]/60',
    label: 'Audit & System Logs',
    icon: 'receipt_long',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  clusterLatency = '24.8 ms latency',
  clusterStatus = 'Optimal',
}) => {
  return (
    <aside className="fixed left-0 top-[67px] bottom-0 w-64 bg-white/95 backdrop-blur-md z-40 flex flex-col py-4 shadow-[1px_0_12px_rgba(66,133,244,0.06)] border-r border-[#e3e8f5]">
      {/* Category Header */}
      <div className="px-4 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#5f6368] uppercase tracking-wider font-bold">
            Platform Modules
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]"></span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1.5 overflow-y-auto">
        {SIDEBAR_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left border-l-4 ${
                isActive
                  ? `${tab.activeBg} ${tab.activeText} ${tab.activeBorder} shadow-xs font-bold`
                  : `border-l-transparent text-[#414754] ${tab.hoverBg} hover:text-[#202124]`
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Google Colored Icon Container (no letter text) */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${tab.iconBg} ${tab.iconColor}`}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {tab.icon}
                  </span>
                </div>

                {/* Label */}
                <span className="truncate">{tab.label}</span>
              </div>

              {/* Optional Chip / Badge */}
              {tab.badge && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight shrink-0 ${
                    isActive
                      ? 'bg-white/90 shadow-2xs'
                      : 'bg-[#f1f3f4] text-[#5f6368]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Google Cloud Infrastructure Status Widget */}
      <div className="px-3 pt-3 border-t border-[#e3e8f5]">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#f8fafd] to-[#f1f4f9] border border-[#dadce0] flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
              <span className="text-[11px] font-bold text-[#202124]">Vertex AI Region</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[10px] font-bold border border-[#ceead6]">
              {clusterStatus}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5f6368]">
            <span>us-central1 (Tensor TPU)</span>
            <span className="font-medium text-[#1a73e8]">{clusterLatency}</span>
          </div>

          <div className="w-full bg-[#e0e3e7] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"
              style={{ width: '88%' }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
