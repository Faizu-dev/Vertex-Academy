import React, { useState } from 'react';
import { api } from '../services/api';

interface BackendConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendConnectionModal: React.FC<BackendConnectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [backendUrl, setBackendUrl] = useState(
    import.meta.env.VITE_BACKEND_URL || window.location.origin + '/api'
  );
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'checking' | 'connected' | 'fallback'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setConnectionStatus('checking');
    setStatusMessage('Pinging backend health endpoint...');
    try {
      const res = await api.checkHealth();
      if (res.status === 'ok' || res.status === 'healthy') {
        setConnectionStatus('connected');
        setStatusMessage(`Connected! Backend version: ${res.version || 'v1.0'}`);
      } else {
        setConnectionStatus('fallback');
        setStatusMessage(
          'Using client fallback mode. Once Antigravity deploys your backend, paste the URL below!'
        );
      }
    } catch (_err) {
      setConnectionStatus('fallback');
      setStatusMessage('Backend endpoint unreachable. Ensure CORS is enabled on your backend server.');
    }
  };

  const handleCopyContract = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sampleExpressCode = `// Sample server.ts / Express backend for Antigravity:
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), version: '1.0.0' });
});

// 2. Gemini Live Tutor Chat
app.post('/api/tutor/chat', async (req, res) => {
  const { message, context } = req.body;
  // Call Gemini or your AI agent here
  res.json({ reply: \`AI Response to "\${message}"\` });
});

// 3. Asset Ingestion & Embeddings
app.post('/api/ingest', (req, res) => {
  res.json({ success: true, vectorsGenerated: 1248, status: 'indexed' });
});

// 4. Code Sandbox execution
app.post('/api/sandbox/execute', (req, res) => {
  res.json({ output: 'Execution result: 224x speedup with HNSW index', executionTimeMs: 38 });
});

app.listen(3001, () => console.log('Antigravity backend running on port 3001'));`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#e3e8f5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1a73e8] via-[#7C3AED] to-[#34A853] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">sync_alt</span>
            </div>
            <div>
              <h2 className="text-base font-bold">Integrate with Antigravity Backend</h2>
              <p className="text-xs text-white/80">
                Connect your Vertex Academy frontend to the backend Antigravity is creating
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
          {/* Quick Guide */}
          <div className="p-4 rounded-2xl bg-[#e8f0fe] border border-[#c2e7ff] text-xs leading-relaxed space-y-2">
            <span className="font-bold text-sm text-[#1a73e8] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">hub</span>
              How to Connect in 2 Steps:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-[#202124]">
              <li>
                <strong>Option A (URL):</strong> If Antigravity is running your backend on a separate URL (e.g. Cloud Run, port 3001, or FastAPI), paste the URL below.
              </li>
              <li>
                <strong>Option B (Code):</strong> If Antigravity created code files (Node.js or Python), you can paste the code right here in chat and we will add it to this repository as a full-stack server!
              </li>
            </ol>
          </div>

          {/* Backend URL Input & Ping */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-[#1f1f1f]">Backend Base URL / API Gateway:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="https://your-antigravity-backend.run.app/api or http://localhost:3001/api"
                className="flex-1 h-10 px-3.5 rounded-xl bg-[#f1f3f4] border border-[#dadce0] text-xs text-[#1f1f1f] font-mono outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white"
              />
              <button
                onClick={handleTestConnection}
                className="h-10 px-5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-sm transition-all shrink-0 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {connectionStatus === 'checking' ? 'sync' : 'network_check'}
                </span>
                <span>{connectionStatus === 'checking' ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 mt-2 ${
                  connectionStatus === 'connected'
                    ? 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]'
                    : 'bg-[#fef7e0] text-[#b06000] border border-[#feefc3]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {connectionStatus === 'connected' ? 'check_circle' : 'info'}
                </span>
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          {/* Expected API Endpoints Contract */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#1f1f1f]">
                Expected API Endpoints (Give this to Antigravity):
              </span>
              <button
                onClick={() => handleCopyContract(sampleExpressCode, 'endpoints')}
                className="text-[#1a73e8] hover:underline font-bold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedCode === 'endpoints' ? 'check' : 'content_copy'}
                </span>
                <span>{copiedCode === 'endpoints' ? 'Copied Template!' : 'Copy Backend Template'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] space-y-1">
                <span className="font-mono font-bold text-[#1a73e8]">GET /api/health</span>
                <p className="text-[11px] text-[#5f6368]">Returns {`{ status: "ok" }`} for health checks</p>
              </div>

              <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] space-y-1">
                <span className="font-mono font-bold text-[#137333]">POST /api/tutor/chat</span>
                <p className="text-[11px] text-[#5f6368]">Takes {`{ message }`}, returns {`{ reply }`}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] space-y-1">
                <span className="font-mono font-bold text-[#b06000]">POST /api/ingest</span>
                <p className="text-[11px] text-[#5f6368]">Multipart upload for course PDF/PPTX</p>
              </div>

              <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] space-y-1">
                <span className="font-mono font-bold text-[#c5221f]">POST /api/sandbox/execute</span>
                <p className="text-[11px] text-[#5f6368]">Executes Python code snippet in sandbox</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafd] border-t border-[#e3e8f5] flex items-center justify-between">
          <span className="text-xs text-[#5f6368]">
            Need help? Paste Antigravity&apos;s code or URL into the prompt!
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1a73e8] text-white text-xs font-bold hover:bg-[#1557b0] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
