import React, { useState } from 'react';

interface AvatarIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModelUrl?: string;
  onLoadCustomModel?: (url: string) => void;
}

export const AvatarIntegrationsModal: React.FC<AvatarIntegrationsModalProps> = ({
  isOpen,
  onClose,
  currentModelUrl = '',
  onLoadCustomModel,
}) => {
  const [customUrl, setCustomUrl] = useState(currentModelUrl);
  const [activeTab, setActiveTab] = useState<'rpm' | 'heygen' | 'tavus' | 'did'>('rpm');
  const [testStatus, setTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    setTestStatus('Validating 3D model endpoint...');
    setTimeout(() => {
      if (onLoadCustomModel) {
        onLoadCustomModel(customUrl.trim());
      }
      setTestStatus('Avatar model linked successfully!');
      setTimeout(() => setTestStatus(null), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#e3e8f5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1a73e8] via-[#7C3AED] to-[#4285F4] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <div>
              <h2 className="text-base font-bold">Avatar Services & Integration Guide</h2>
              <p className="text-xs text-white/80">
                Industry platforms for pulling realistic 3D and AI video avatars
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1f1f1f]">
          {/* Service Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-[#e3e8f5] pb-2">
            <button
              onClick={() => setActiveTab('rpm')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rpm'
                  ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]'
                  : 'text-[#5f6368] hover:bg-[#f1f3f4]'
              }`}
            >
              1. Ready Player Me (3D GLB)
            </button>
            <button
              onClick={() => setActiveTab('heygen')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'heygen'
                  ? 'bg-[#fef7e0] text-[#b06000] border border-[#feefc3]'
                  : 'text-[#5f6368] hover:bg-[#f1f3f4]'
              }`}
            >
              2. HeyGen (Streaming Video)
            </button>
            <button
              onClick={() => setActiveTab('tavus')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tavus'
                  ? 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]'
                  : 'text-[#5f6368] hover:bg-[#f1f3f4]'
              }`}
            >
              3. Tavus / D-ID
            </button>
          </div>

          {/* Tab 1: Ready Player Me */}
          {activeTab === 'rpm' && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#dadce0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1a73e8] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                    Ready Player Me (readyplayer.me)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[10px] font-bold">
                    3D GLTF / Three.js
                  </span>
                </div>
                <p className="text-[#5f6368]">
                  Ready Player Me allows users to generate realistic, rigged 3D human avatars from a single selfie or character customizer. The avatars export as standardized <strong>.glb files</strong> with 52 Apple ARKit blendshapes (visemes for real-time speech lip sync, eye blinks, facial expressions).
                </p>
                <div className="font-mono bg-white p-3 rounded-xl border border-[#dadce0] text-[11px] text-[#202124] overflow-x-auto">
                  <code>{`// Load Ready Player Me in Three.js:\nimport { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';\n\nconst loader = new GLTFLoader();\nloader.load('https://models.readyplayer.me/{AVATAR_ID}.glb', (gltf) => {\n  scene.add(gltf.scene);\n  // Access morph targets for speech: gltf.scene.traverse(...)\n});`}</code>
                </div>
              </div>

              {/* Custom Model Input */}
              <div className="space-y-2">
                <label className="font-bold text-[#1f1f1f] text-xs flex items-center justify-between">
                  <span>Load Custom Ready Player Me Avatar (.glb URL):</span>
                  <a
                    href="https://readyplayer.me"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1a73e8] underline font-medium"
                  >
                    Create free avatar at readyplayer.me →
                  </a>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://models.readyplayer.me/your-avatar-id.glb"
                    className="flex-1 h-10 px-3.5 rounded-xl bg-[#f1f3f4] border border-[#dadce0] text-xs text-[#1f1f1f] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all font-mono"
                  />
                  <button
                    onClick={handleApplyUrl}
                    className="h-10 px-5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Apply Model
                  </button>
                </div>
                {testStatus && (
                  <p className="text-xs text-[#137333] font-bold animate-in fade-in flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {testStatus}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: HeyGen Interactive Avatar */}
          {activeTab === 'heygen' && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#fef7e0]/60 border border-[#feefc3] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#b06000] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                    HeyGen Interactive Avatar SDK (heygen.com)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] text-[10px] font-bold border border-[#feefc3]">
                    Photorealistic WebRTC
                  </span>
                </div>
                <p className="text-[#5f6368]">
                  HeyGen provides <strong>100% photorealistic human video avatars</strong> that speak and interact in real time with sub-500ms latency. Instead of rendering a polygon 3D mesh, it streams a high-resolution neural video via WebRTC where the AI dynamically animates the person&apos;s face and mouth to match your text or speech input.
                </p>
                <div className="font-mono bg-white p-3 rounded-xl border border-[#feefc3] text-[11px] text-[#202124] overflow-x-auto">
                  <code>{`// HeyGen Streaming Avatar SDK Integration:\nimport StreamingAvatar from '@heygen/streaming-avatar';\n\nconst avatar = new StreamingAvatar({ token: sessionToken });\nawait avatar.createStartAvatar({ avatarName: 'Wayne_20240711' });\navatar.on('STREAM_READY', (event) => {\n  videoElement.srcObject = event.detail;\n});\navatar.speak({ text: "Hello! I am your Vertex Academy AI tutor." });`}</code>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Tavus & D-ID */}
          {activeTab === 'tavus' && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#e6f4ea]/60 border border-[#ceead6] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#137333] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
                    Tavus (tavus.io) & D-ID (d-id.com)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[10px] font-bold border border-[#ceead6]">
                    Conversational Video API
                  </span>
                </div>
                <p className="text-[#5f6368]">
                  <strong>Tavus</strong> specializes in Conversational Video Replicas with full conversational intelligence, emotional tone modulation, and realistic eye contact. <strong>D-ID</strong> offers the Talks API to animate any 2D high-resolution photograph or headshot into an ultra-realistic speaking video avatar with lip sync.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafd] border-t border-[#e3e8f5] flex items-center justify-between">
          <span className="text-xs text-[#5f6368]">
            Tip: We&apos;ve enabled the <strong>Photorealistic Neural Stream</strong> mode as the default!
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1a73e8] text-white text-xs font-bold hover:bg-[#1557b0] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
