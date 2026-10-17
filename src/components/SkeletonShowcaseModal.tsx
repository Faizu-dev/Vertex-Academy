import React, { useState } from 'react';
import {
  GoogleSkeleton,
  GoogleCardSkeleton,
  GoogleMetricSkeleton,
  GoogleTableRowSkeleton,
  GoogleModuleListSkeleton,
  GoogleGraphSkeleton,
  GoogleCodeSkeleton,
  GoogleLoadingIndicator,
  SkeletonVariant,
} from './GoogleSkeleton';

interface SkeletonShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkeletonShowcaseModal: React.FC<SkeletonShowcaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeVariant, setActiveVariant] = useState<SkeletonVariant>('card');
  const [isVibrant, setIsVibrant] = useState(true);
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [glowingBorder, setGlowingBorder] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#c2e7ff]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1a73e8] via-[#4285F4] to-[#7C3AED] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Google Brand Skeleton Animations</h3>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#FBBC04]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
                </div>
              </div>
              <p className="text-xs text-white/80">
                Unified loading states and micro-interactions designed with Google Design System tokens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="p-4 bg-[#f8fafd] border-b border-[#e3e8f5] flex flex-wrap items-center justify-between gap-3">
          {/* Preset buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {(
              [
                { id: 'card', label: 'Course Cards', icon: 'grid_view' },
                { id: 'metric', label: 'KPI Metrics', icon: 'monitoring' },
                { id: 'table-row', label: 'Table / Ledgers', icon: 'table_rows' },
                { id: 'syllabus', label: 'Module Chapters', icon: 'format_list_bulleted' },
                { id: 'graph', label: 'Knowledge Graph', icon: 'hub' },
                { id: 'code', label: 'Code Sandbox', icon: 'terminal' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveVariant(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeVariant === item.id
                    ? 'bg-[#1a73e8] text-white shadow-xs'
                    : 'bg-white text-[#5f6368] hover:bg-white/80 border border-[#dadce0]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isVibrant}
                onChange={(e) => setIsVibrant(e.target.checked)}
                className="rounded text-[#1a73e8]"
              />
              <span className="font-medium text-[#414754]">Vibrant 4-Color Wave</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={glowingBorder}
                onChange={(e) => setGlowingBorder(e.target.checked)}
                className="rounded text-[#1a73e8]"
              />
              <span className="font-medium text-[#414754]">Glowing Border</span>
            </label>

            <div className="flex items-center gap-1 bg-white border border-[#dadce0] rounded-full p-0.5">
              {(['slow', 'normal', 'fast'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize transition-all ${
                    speed === s ? 'bg-[#1a73e8] text-white' : 'text-[#5f6368]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 google-mesh-bg">
          <div className="flex items-center justify-between">
            <GoogleLoadingIndicator
              message={`Simulating live Vertex AI module sync (${activeVariant})...`}
              size="md"
            />
            <span className="text-xs font-mono text-[#5f6368]">
              Variant: {activeVariant} • Speed: {speed} • Palette: Google Quad
            </span>
          </div>

          {activeVariant === 'card' && (
            <GoogleCardSkeleton count={3} vibrant={isVibrant} />
          )}

          {activeVariant === 'metric' && (
            <GoogleMetricSkeleton count={4} vibrant={isVibrant} />
          )}

          {activeVariant === 'table-row' && (
            <div className="glass-card rounded-2xl overflow-hidden border border-[#e3e8f5] shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafd] border-b border-[#e3e8f5] text-xs font-bold text-[#5f6368]">
                    <th className="py-3 px-4">MODULE / ASSET</th>
                    <th className="py-3 px-4">TYPE</th>
                    <th className="py-3 px-4">LATENCY</th>
                    <th className="py-3 px-4">VECTOR CHUNKS</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <GoogleTableRowSkeleton count={5} vibrant={isVibrant} />
              </table>
            </div>
          )}

          {activeVariant === 'syllabus' && (
            <GoogleModuleListSkeleton count={4} />
          )}

          {activeVariant === 'graph' && (
            <GoogleGraphSkeleton />
          )}

          {activeVariant === 'code' && (
            <GoogleCodeSkeleton />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f8fafd] border-t border-[#e3e8f5] flex items-center justify-between text-xs text-[#5f6368]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1a73e8]">Adaptive Design System:</span>
            <span>Content-Aware Loading States • Gemini Neural Motion</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
};
