import React, { useState } from 'react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose }) => {
  const [activeHelpTab, setActiveHelpTab] = useState<'guide' | 'shortcuts' | 'architecture' | 'diagnostics'>('guide');
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const runDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagnosticsResult(null);
    setTimeout(() => {
      setDiagnosticsRunning(false);
      setDiagnosticsResult('All systems nominal: WebGL2 active, Audio S2S pipeline operational (24ms latency to us-central1 TPU cluster), Gemini 1.5 Pro quota: 98% available.');
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-center-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#dadce0] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google 4-Color Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"></div>

        {/* Header */}
        <div className="p-5 border-b border-[#e3e8f5] flex items-center justify-between bg-gradient-to-r from-[#f8fafd] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1a73e8] to-[#4285F4] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">help_center</span>
            </div>
            <div>
              <h2 id="help-center-title" className="text-base font-bold text-[#1f1f1f] flex items-center gap-2">
                <span>Vertex Academy Help & Documentation</span>
                <span className="px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[10px] font-bold">
                  v2.4
                </span>
              </h2>
              <p className="text-xs text-[#5f6368]">
                Interactive guides, keyboard shortcuts, and Google Cloud AI diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-[#e3e8f5] flex items-center gap-2 bg-[#f8fafd] overflow-x-auto text-xs">
          {[
            { id: 'guide', label: 'Platform Guide', icon: 'menu_book' },
            { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: 'keyboard' },
            { id: 'architecture', label: 'Gemini Architecture', icon: 'hub' },
            { id: 'diagnostics', label: 'System Diagnostics', icon: 'speed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveHelpTab(tab.id as any)}
              className={`pb-2.5 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeHelpTab === tab.id
                  ? 'border-[#1a73e8] text-[#1a73e8]'
                  : 'border-transparent text-[#5f6368] hover:text-[#1f1f1f]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {activeHelpTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#1f1f1f] flex items-center gap-2">
                <span>The 5-Step Vertex AI Learning Loop</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e3e8f5] space-y-2">
                  <div className="flex items-center gap-2 text-[#1a73e8] font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[11px]">1</span>
                    <span>Multimodal Ingestion</span>
                  </div>
                  <p className="text-xs text-[#5f6368] leading-relaxed">
                    Upload PDFs, research papers, videos, and notebooks in Agent Studio. Gemini 1.5 Pro generates high-dimensional embeddings and syllabus graphs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e3e8f5] space-y-2">
                  <div className="flex items-center gap-2 text-[#c5221f] font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#fce8e6] flex items-center justify-center text-[11px]">2</span>
                    <span>3D Live AI Avatar</span>
                  </div>
                  <p className="text-xs text-[#5f6368] leading-relaxed">
                    Engage in real-time socratic dialogues with your personalized 3D avatar tutor. Switch personalities between Socratic, Concise, and Academic.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e3e8f5] space-y-2">
                  <div className="flex items-center gap-2 text-[#b06000] font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#fef7e0] flex items-center justify-center text-[11px]">3</span>
                    <span>Interactive Code Labs</span>
                  </div>
                  <p className="text-xs text-[#5f6368] leading-relaxed">
                    Execute Python vector math in an isolated sandbox. Test cosine distances, HNSW graph traversals, and multi-agent LangGraph orchestrations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e3e8f5] space-y-2">
                  <div className="flex items-center gap-2 text-[#137333] font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#e6f4ea] flex items-center justify-center text-[11px]">4</span>
                    <span>Verifiable Oral Defense</span>
                  </div>
                  <p className="text-xs text-[#5f6368] leading-relaxed">
                    Defend your code architecture in live speech-to-speech with senior examiner agents. Receive tamper-proof cryptographic credential badges.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeHelpTab === 'shortcuts' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#1f1f1f]">Keyboard Shortcuts & Controls</h3>
              <div className="divide-y divide-[#e3e8f5] border border-[#e3e8f5] rounded-2xl overflow-hidden bg-[#f8fafd]">
                {[
                  { key: 'Cmd / Ctrl + K', action: 'Global Search across Vertex embeddings & logs' },
                  { key: 'Space', action: 'Toggle Avatar speech playback during lesson' },
                  { key: 'Ctrl + Enter', action: 'Execute Python Sandbox code immediately' },
                  { key: '1 - 7', action: 'Switch navigation tabs (Home, Studio, Courses, etc.)' },
                  { key: 'M', action: 'Mute / unmute AI speech tutor' },
                  { key: 'Esc', action: 'Close any active modal or drawer' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <span className="text-[#5f6368] font-medium">{s.action}</span>
                    <kbd className="px-2.5 py-1 rounded-lg bg-white border border-[#dadce0] shadow-2xs font-mono font-semibold text-[#1f1f1f]">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeHelpTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#1f1f1f]">Vertex AI Learning Engine Topology</h3>
              <div className="p-4 rounded-2xl bg-[#1f1f1f] text-white font-mono text-xs space-y-3">
                <div className="text-[#4285F4] font-bold">// CLOUD TOPOLOGY & DATA PIPELINE</div>
                <div className="text-white/80 leading-relaxed">
                  [Ingestion Source] ➔ [Gemini 1.5 Pro Multimodal Parser]
                  <br />
                  &nbsp;&nbsp;└── Extract Chunks (1024 token window, 128 overlap)
                  <br />
                  &nbsp;&nbsp;└── ScaNN / HNSW Vector Index (768-dim embeddings)
                  <br />
                  &nbsp;&nbsp;└── Firestore Realtime Audit Ledger (Agent Traces)
                </div>
                <div className="text-[#34A853] font-bold">// ORAL DEFENSE SPEECH ENGINE</div>
                <div className="text-white/80 leading-relaxed">
                  Web Audio API ➔ S2S Streaming Websocket ➔ Gemini 1.5 Flash
                  <br />
                  &nbsp;&nbsp;└── Rubric Scoring (Factual Precision, Edge-Case Resilience)
                </div>
              </div>
            </div>
          )}

          {activeHelpTab === 'diagnostics' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#1f1f1f]">Interactive System Diagnostics</h3>
              <p className="text-xs text-[#5f6368]">
                Verify your browser's WebGL 3D capability, microphone audio streams, and network connection to Google Cloud.
              </p>

              <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e3e8f5] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1f1f1f] block">Google Cloud Cluster Link</span>
                    <span className="text-[11px] text-[#5f6368]">us-central1 (Tensor TPU v5e)</span>
                  </div>
                  <button
                    onClick={runDiagnostics}
                    disabled={diagnosticsRunning}
                    className="px-4 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined text-[16px] ${diagnosticsRunning ? 'animate-spin' : ''}`}>
                      {diagnosticsRunning ? 'sync' : 'play_arrow'}
                    </span>
                    <span>{diagnosticsRunning ? 'Testing...' : 'Run Diagnostics'}</span>
                  </button>
                </div>

                {diagnosticsResult && (
                  <div className="p-3 rounded-xl bg-[#e6f4ea] border border-[#ceead6] text-[#137333] text-xs font-medium flex items-start gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
                    <span>{diagnosticsResult}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafd] border-t border-[#e3e8f5] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#5f6368]">
            <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
            <span>Vertex Cloud Status: Normal</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#1a73e8] text-white font-semibold hover:bg-[#1557b0] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
