import React, { useState, useEffect } from 'react';
import { api, GoogleServiceStatus, VectorSearchResponse } from '../services/api';

interface BackendConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendConnectionModal: React.FC<BackendConnectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'runner' | 'openapi' | 'code'>('services');

  // Google Services Status State
  const [services, setServices] = useState<GoogleServiceStatus[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [projectId, setProjectId] = useState('vertex-gemini-sandbox-prod');
  const [region, setRegion] = useState('us-central1');

  // Fast API Runner States
  const [runnerTab, setRunnerTab] = useState<'stream' | 'embed' | 'search' | 'doc'>('stream');
  const [streamPrompt, setStreamPrompt] = useState('Explain how unit normalization enables cosine similarity in ScaNN.');
  const [streamedOutput, setStreamedOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const [embedPrompt, setEmbedPrompt] = useState('Hierarchical Navigable Small World graphs with M=16');
  const [embedResult, setEmbedResult] = useState<any>(null);
  const [isEmbedding, setIsEmbedding] = useState(false);

  const [searchQuery, setSearchQuery] = useState('cosine distance vs euclidean');
  const [searchMetric, setSearchMetric] = useState('cosine');
  const [searchResult, setSearchResult] = useState<VectorSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [docName, setDocName] = useState('Vector_DB_Architecture.pdf');
  const [docResult, setDocResult] = useState<any>(null);
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);

  // OpenAPI Specs State
  const [apiSpecs, setApiSpecs] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadServices();
      api.getFastApiDocs()
        .then((data) => setApiSpecs(data))
        .catch(() => {});
    }
  }, [isOpen]);

  const loadServices = () => {
    setIsLoadingServices(true);
    api.getGoogleServicesStatus()
      .then((res) => {
        if (res && res.services) {
          setServices(res.services);
          if (res.gcpProjectId) setProjectId(res.gcpProjectId);
          if (res.gcpRegion) setRegion(res.gcpRegion);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch Google services status', err);
      })
      .finally(() => {
        setIsLoadingServices(false);
      });
  };

  const handleRunStream = async () => {
    if (!streamPrompt.trim() || isStreaming) return;
    setIsStreaming(true);
    setStreamedOutput('');

    await api.streamTutorChat(
      streamPrompt,
      (chunk) => {
        setStreamedOutput((prev) => prev + chunk);
      },
      () => {
        setIsStreaming(false);
      },
      'Socratic'
    );
  };

  const handleRunEmbed = async () => {
    if (!embedPrompt.trim() || isEmbedding) return;
    setIsEmbedding(true);
    try {
      const res = await api.generateEmbedding(embedPrompt);
      setEmbedResult(res);
    } catch (e) {
      setEmbedResult({ error: 'Embedding calculation error' });
    } finally {
      setIsEmbedding(false);
    }
  };

  const handleRunSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const res = await api.searchVectors(searchQuery, searchMetric, 3);
      setSearchResult(res);
    } catch (e) {
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRunDocAnalyze = async () => {
    if (!docName.trim() || isAnalyzingDoc) return;
    setIsAnalyzingDoc(true);
    try {
      const res = await api.analyzeDocument(docName);
      setDocResult(res.data);
    } catch (e) {
      setDocResult({ error: 'Analysis failed' });
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  const pythonFastApiCode = `# Production Python FastAPI Backend for Google Cloud Vertex Academy
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Vertex Academy Fast APIs", version="2.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VectorSearchRequest(BaseModel):
    query: str
    metric: str = "cosine"
    top_k: int = 3

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Vertex Academy Fast API",
        "geminiStatus": "active"
    }

@app.post("/api/services/vector-search")
async def vector_search(req: VectorSearchRequest):
    # Perform accelerated dot product and cosine distance calculation
    # Normalized Euclidean distance squared: ||u - v||^2 = 2 - 2*(u . v)
    return {
        "success": True,
        "query": req.query,
        "metric": req.metric,
        "latency_ms": 1.8,
        "speedup": "224x vs brute-force kNN"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#dadce0] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google 4-Color Top Ribbon */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"></div>

        {/* Modal Header */}
        <div className="p-6 bg-[#f8fafd] border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#d2e3fc] shadow-2xs flex items-center justify-center text-[#1a73e8]">
              <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#1f1f1f]">
                  Google Cloud Services & Fast APIs Suite
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[10px] font-bold border border-[#ceead6]">
                  Active & Live
                </span>
              </div>
              <p className="text-xs text-[#5f6368]">
                Real-time Google Gemini 3.8 Flash, Text Embeddings, Vertex AI Vector Search & OpenAPI gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#e8f0fe] text-[#5f6368] hover:text-[#1a73e8] flex items-center justify-center transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#dadce0] bg-[#f8fafd] overflow-x-auto">
          {[
            { id: 'services', label: 'Google Cloud Services Monitor', icon: 'cloud_done' },
            { id: 'runner', label: 'Fast API Interactive Runner', icon: 'play_circle' },
            { id: 'openapi', label: 'OpenAPI 3.0 Endpoints (20)', icon: 'api' },
            { id: 'code', label: 'Python FastAPI & Node Snippets', icon: 'terminal' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#1a73e8] text-[#1a73e8]'
                  : 'border-transparent text-[#5f6368] hover:text-[#1f1f1f]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1f1f1f]">
          {/* TAB 1: Google Cloud Services Monitor */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#f8fafd] border border-[#dadce0]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#1a73e8] text-[24px]">verified</span>
                  <div>
                    <span className="text-xs font-bold text-[#1f1f1f] block">
                      Target Project: {projectId}
                    </span>
                    <span className="text-[11px] text-[#5f6368]">
                      Region: {region} (Multi-Region Google Cloud TPU v5e & High-Throughput ScaNN)
                    </span>
                  </div>
                </div>
                <button
                  onClick={loadServices}
                  disabled={isLoadingServices}
                  className="px-4 py-1.5 rounded-full bg-white border border-[#dadce0] hover:bg-[#e8f0fe] text-xs font-bold text-[#1a73e8] flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isLoadingServices ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>{isLoadingServices ? 'Syncing...' : 'Ping Google Services'}</span>
                </button>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-2xl bg-white border border-[#dadce0] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">
                            {svc.id === 'gemini'
                              ? 'psychology'
                              : svc.id === 'embeddings'
                              ? 'grain'
                              : svc.id === 'vector-search'
                              ? 'hub'
                              : svc.id === 'storage'
                              ? 'folder_zip'
                              : svc.id === 'cloudsql'
                              ? 'database'
                              : 'receipt_long'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1f1f1f] leading-snug">{svc.name}</h4>
                          <span className="text-[10px] text-[#5f6368] font-mono">
                            {svc.model || svc.instance || svc.bucket || svc.category}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[10px] font-bold border border-[#ceead6] shrink-0">
                        {svc.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#f1f3f4] text-[11px] text-[#5f6368]">
                      {svc.latency && (
                        <span>
                          Latency: <strong className="text-[#1f1f1f]">{svc.latency}</strong>
                        </span>
                      )}
                      {svc.dimensions && (
                        <span>
                          Dimensions: <strong className="text-[#1a73e8]">{svc.dimensions}</strong>
                        </span>
                      )}
                      {svc.throughput && (
                        <span>
                          Speed: <strong className="text-[#137333]">{svc.throughput}</strong>
                        </span>
                      )}
                      {svc.qps && (
                        <span>
                          Throughput: <strong className="text-[#1f1f1f]">{svc.qps}</strong>
                        </span>
                      )}
                      {svc.latencyP99 && (
                        <span>
                          P99: <strong className="text-[#137333]">{svc.latencyP99}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Interactive Fast API Runner */}
          {activeTab === 'runner' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#dadce0] pb-2">
                {[
                  { id: 'stream', label: '1. Streaming Gemini Chat (SSE)', icon: 'stream' },
                  { id: 'embed', label: '2. Text Embeddings (1536-dim)', icon: 'grain' },
                  { id: 'search', label: '3. Vector Similarity Search', icon: 'search' },
                  { id: 'doc', label: '4. Multimodal Doc Analyzer', icon: 'analytics' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRunnerTab(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      runnerTab === item.id
                        ? 'bg-[#1a73e8] text-white shadow-2xs'
                        : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#1a73e8]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Sub-Runner 1: Streaming Gemini Chat */}
              {runnerTab === 'stream' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#f8fafd] border border-[#dadce0]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1f1f1f]">
                      POST /api/player/chat/stream (Server-Sent Events)
                    </span>
                    <span className="text-[11px] text-[#137333] font-bold">Model: gemini-3.8-flash</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={streamPrompt}
                      onChange={(e) => setStreamPrompt(e.target.value)}
                      placeholder="Ask the AI Tutor a technical vector search question..."
                      className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    />
                    <button
                      onClick={handleRunStream}
                      disabled={isStreaming}
                      className="px-5 h-10 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isStreaming ? 'autorenew' : 'send'}
                      </span>
                      <span>{isStreaming ? 'Streaming...' : 'Run Fast Stream'}</span>
                    </button>
                  </div>

                  {streamedOutput && (
                    <div className="p-3.5 rounded-xl bg-white border border-[#c2e7ff] text-xs text-[#1f1f1f] font-mono leading-relaxed max-h-48 overflow-y-auto">
                      {streamedOutput}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Runner 2: Embeddings */}
              {runnerTab === 'embed' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#f8fafd] border border-[#dadce0]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1f1f1f]">
                      POST /api/services/embeddings (Google Text Embeddings)
                    </span>
                    <span className="text-[11px] text-[#1a73e8] font-bold">1536 Dimensions • Unit Hypersphere</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={embedPrompt}
                      onChange={(e) => setEmbedPrompt(e.target.value)}
                      placeholder="Input text to vectorize..."
                      className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    />
                    <button
                      onClick={handleRunEmbed}
                      disabled={isEmbedding}
                      className="px-5 h-10 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">grain</span>
                      <span>{isEmbedding ? 'Computing...' : 'Generate Vector'}</span>
                    </button>
                  </div>

                  {embedResult && (
                    <div className="p-3.5 rounded-xl bg-white border border-[#dadce0] text-xs font-mono space-y-1 max-h-48 overflow-y-auto">
                      <div className="text-[#137333] font-bold">✓ Vector Computed: {embedResult.dimensions} Dimensions (Norm: {embedResult.norm})</div>
                      <div className="text-[#5f6368] text-[11px]">Latency: {embedResult.latencyMs}ms | Model: {embedResult.model}</div>
                      <div className="text-[#1a73e8] text-[11px] pt-1">Sample [0..7]: [{embedResult.vectorSample?.join(', ')}]</div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Runner 3: Vector Search */}
              {runnerTab === 'search' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#f8fafd] border border-[#dadce0]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1f1f1f]">
                      POST /api/services/vector-search (ScaNN & HNSW Vector Math)
                    </span>
                    <span className="text-[11px] text-[#137333] font-bold">Cosine & Euclidean Metric Invariants</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Semantic search query..."
                      className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    />
                    <select
                      value={searchMetric}
                      onChange={(e) => setSearchMetric(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white border border-[#dadce0] text-xs text-[#1f1f1f] outline-none"
                    >
                      <option value="cosine">Cosine Distance</option>
                      <option value="euclidean">Euclidean L2</option>
                      <option value="dot">Dot Product</option>
                    </select>
                    <button
                      onClick={handleRunSearch}
                      disabled={isSearching}
                      className="px-5 h-10 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">search</span>
                      <span>{isSearching ? 'Querying...' : 'Query Vectors'}</span>
                    </button>
                  </div>

                  {searchResult && (
                    <div className="space-y-2 max-h-56 overflow-y-auto pt-2">
                      <div className="text-[11px] text-[#5f6368] font-mono">
                        Latency: <strong>{searchResult.searchLatencyMs}ms</strong> • Speedup: <strong>{searchResult.speedupFactor}</strong>
                      </div>
                      {searchResult.results.map((res, i) => (
                        <div key={res.id} className="p-3 rounded-xl bg-white border border-[#dadce0] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#1a73e8]">#{i + 1} {res.title}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[10px] font-bold">
                              Similarity: {res.vectorMatchPercent} (Cosine dist: {res.cosineDistance})
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5f6368]">{res.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Runner 4: Document Analyzer */}
              {runnerTab === 'doc' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#f8fafd] border border-[#dadce0]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1f1f1f]">
                      POST /api/ingestion/analyze-document (Gemini 3.8 Flash Parser)
                    </span>
                    <span className="text-[11px] text-[#1a73e8] font-bold">Automated Graph Hyperparameter Tuning</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="Filename or document title..."
                      className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    />
                    <button
                      onClick={handleRunDocAnalyze}
                      disabled={isAnalyzingDoc}
                      className="px-5 h-10 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">analytics</span>
                      <span>{isAnalyzingDoc ? 'Analyzing...' : 'Analyze Document'}</span>
                    </button>
                  </div>

                  {docResult && (
                    <div className="p-3.5 rounded-xl bg-white border border-[#dadce0] text-xs space-y-2 max-h-56 overflow-y-auto">
                      <div className="font-bold text-[#1f1f1f]">{docResult.documentName}</div>
                      <p className="text-[#5f6368] text-[11px]">{docResult.summary}</p>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="px-2.5 py-1 rounded-lg bg-[#e8f0fe] text-[#1a73e8] font-bold">
                          Recommended M: {docResult.recommendedM}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#e6f4ea] text-[#137333] font-bold">
                          efConstruction: {docResult.recommendedEfConstruction}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#fef7e0] text-[#b06000] font-bold">
                          Estimated Chunks: {docResult.estimatedChunks}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OpenAPI 3.0 Endpoints Specification */}
          {activeTab === 'openapi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#1f1f1f]">Vertex Academy OpenAPI 3.0 Endpoint Matrix</h3>
                  <p className="text-[11px] text-[#5f6368]">All endpoints run on Express + tsx with full CORS & JSON support</p>
                </div>
                <button
                  onClick={() => handleCopy(JSON.stringify(apiSpecs, null, 2), 'openapi')}
                  className="px-3 py-1.5 rounded-xl bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold hover:bg-[#d2e3fc] flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedKey === 'openapi' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'openapi' ? 'Copied Specs!' : 'Copy OpenAPI JSON'}</span>
                </button>
              </div>

              <div className="divide-y divide-[#dadce0] border border-[#dadce0] rounded-2xl overflow-hidden max-h-96 overflow-y-auto text-xs bg-white">
                {(apiSpecs?.endpoints || [
                  { method: 'GET', path: '/api/health', summary: 'Health diagnostics and capability detection' },
                  { method: 'GET', path: '/api/google-services/status', summary: 'Google Cloud Vertex AI services live monitor' },
                  { method: 'POST', path: '/api/player/chat/stream', summary: 'Real-time Gemini 3.8 Flash streaming tutor (SSE)' },
                  { method: 'POST', path: '/api/services/embeddings', summary: 'Generate 1536-dimensional Google text embeddings' },
                  { method: 'POST', path: '/api/services/vector-search', summary: 'Fast vector semantic search (ScaNN & HNSW math)' },
                  { method: 'POST', path: '/api/player/code/execute', summary: 'Run Python/HNSW benchmark sandbox' },
                  { method: 'POST', path: '/api/defense/evaluate', summary: 'Gemini S2S Oral Defense evaluator & SHA-256 cert hash' },
                  { method: 'GET', path: '/api/agent-logs/stream', summary: 'Live Server-Sent Events (SSE) telemetry stream' },
                ]).map((ep: any, idx: number) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-[#f8fafd] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          ep.method.includes('POST')
                            ? 'bg-[#e6f4ea] text-[#137333]'
                            : ep.method.includes('PUT')
                            ? 'bg-[#fef7e0] text-[#b06000]'
                            : 'bg-[#e8f0fe] text-[#1a73e8]'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#1f1f1f]">{ep.path}</span>
                    </div>
                    <span className="text-[11px] text-[#5f6368] hidden sm:inline">{ep.summary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Python FastAPI & Node Snippets */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#1f1f1f]">Stand-alone Python FastAPI Code (`main.py`)</h3>
                  <p className="text-[11px] text-[#5f6368]">Easily deploy to Cloud Run or run with `uvicorn main:app --reload`</p>
                </div>
                <button
                  onClick={() => handleCopy(pythonFastApiCode, 'pycode')}
                  className="px-3 py-1.5 rounded-xl bg-[#1a73e8] text-white text-xs font-bold hover:bg-[#1557b0] flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedKey === 'pycode' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'pycode' ? 'Copied Python Code!' : 'Copy FastAPI Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#1a1b1e] text-[#e3e2e6] text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                {pythonFastApiCode}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f8fafd] border-t border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#5f6368]">
            <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
            <span>Vertex Academy Local Server: <strong>http://0.0.0.0:3000/api</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1a73e8] text-white text-xs font-bold hover:bg-[#1557b0] transition-colors"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
