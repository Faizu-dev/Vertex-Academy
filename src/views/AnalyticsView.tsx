import React, { useState } from 'react';
import { SkillNode } from '../types';
import { CodeSandboxModal } from '../components/CodeSandboxModal';
import { GoogleMetricSkeleton, GoogleGraphSkeleton, GoogleLoadingIndicator } from '../components/GoogleSkeleton';

interface AnalyticsViewProps {
  onNavigateToPlayer?: () => void;
  onNavigateToOralDefense?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onNavigateToPlayer,
  onNavigateToOralDefense,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'vectors' | 'agentic' | 'infra'>('all');
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


  const nodes: SkillNode[] = [
    {
      id: 'node-py',
      name: 'Python Async & uvloop',
      category: 'infra',
      status: 'mastered',
      percentage: 100,
      x: 30,
      y: 50,
      subtitle: 'Asynchronous event loops & GIL bypassing',
      threshold: '100 / 100 Pts',
      verifiedList: [
        'uvloop custom event loop policy',
        'asyncio.gather() error boundary isolation',
        'SIMD vectorized batch slicing',
      ],
    },
    {
      id: 'node-emb',
      name: 'Text Embeddings (004)',
      category: 'vectors',
      status: 'mastered',
      percentage: 100,
      x: 30,
      y: 220,
      subtitle: 'Vertex AI 1536-dimensional embeddings',
      threshold: '100 / 100 Pts',
      verifiedList: [
        'L2 unit hypersphere normalization',
        'Chunk tokenization windowing (512 tokens)',
        'Cosine vs Dot Product equivalence',
      ],
    },
    {
      id: 'node-cos',
      name: 'Cosine & Euclidean',
      category: 'vectors',
      status: 'mastered',
      percentage: 100,
      x: 230,
      y: 220,
      subtitle: 'High-dimensional geometric distance metric',
      threshold: '100 / 100 Pts',
      verifiedList: [
        'Metric monotonicity proof',
        'Angular divergence calculation',
        'Zero-length vector guards',
      ],
    },
    {
      id: 'node-knn',
      name: 'Exact Flat KNN',
      category: 'vectors',
      status: 'mastered',
      percentage: 100,
      x: 420,
      y: 170,
      subtitle: 'Brute-force pairwise distance matrix scan',
      threshold: '100 / 100 Pts',
      verifiedList: [
        'Linear time O(N*D) complexity bound',
        'Matrix multiplication with BLAS',
        'Ground-truth recall baseline calibration',
      ],
    },
    {
      id: 'node-hnsw',
      name: 'HNSW Skip-List Graphs',
      category: 'vectors',
      status: 'in-progress',
      percentage: 65,
      x: 620,
      y: 130,
      subtitle: 'Hierarchical Navigable Small World Indexing',
      threshold: '65 / 100 Pts',
      verifiedList: [
        'Layer-0 multi-hop routing heuristics',
        'M-parameter & efConstruction tradeoffs',
        'Python Vector benchmark vs brute force KNN',
      ],
      pendingRequirement:
        'Pass Question 2 of Interactive Micro-Quiz & evaluate query recall rate in Python Sandbox.',
    },
    {
      id: 'node-ivf',
      name: 'Inverted File Index (IVF)',
      category: 'vectors',
      status: 'in-progress',
      percentage: 40,
      x: 620,
      y: 270,
      subtitle: 'Voronoi partition cluster search',
      threshold: '40 / 100 Pts',
      verifiedList: ['nlist centroid computation', 'nprobe traversal balancing'],
      pendingRequirement: 'Complete Lab 3.2 Voronoi Partitioning.',
    },
    {
      id: 'node-lang',
      name: 'LangGraph Multi-Agent',
      category: 'agentic',
      status: 'in-progress',
      percentage: 25,
      x: 260,
      y: 110,
      subtitle: 'Stateful actor graph orchestration',
      threshold: '25 / 100 Pts',
      verifiedList: ['StateGraph conditional routing'],
      pendingRequirement: 'Deploy EnrollmentAgent check.',
    },
    {
      id: 'node-pq',
      name: 'Product Quantization (PQ)',
      category: 'vectors',
      status: 'locked',
      percentage: 0,
      x: 820,
      y: 70,
      subtitle: '8-bit vector sub-space codebooks',
      threshold: '0 / 100 Pts',
      verifiedList: [],
      pendingRequirement: 'Prerequisite: Master HNSW Skip-List Graphs.',
    },
    {
      id: 'node-vllm',
      name: 'vLLM & PagedAttention',
      category: 'infra',
      status: 'recommended',
      percentage: 0,
      x: 820,
      y: 250,
      subtitle: 'Non-contiguous KV-cache memory management',
      threshold: '0 / 100 Pts',
      verifiedList: [],
      pendingRequirement: 'Recommended next after Vector DBs 101.',
    },
  ];

  const [selectedNode, setSelectedNode] = useState<SkillNode>(nodes[4]); // default HNSW

  const handleExportPDF = () => {
    setCopiedTranscript(true);
    window.print();
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1560px] mx-auto space-y-8">
      {/* GEMINI AURORA HEADER */}
      <section className="relative overflow-hidden rounded-3xl p-6 lg:p-8 text-white shadow-lg bg-gradient-to-r from-[#1a73e8] via-[#7C3AED] via-[#D96570] to-[#FBBC04]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl"></div>
        <div className="pointer-events-none absolute left-1/3 -bottom-20 h-64 w-64 rounded-full bg-[#FBBC04]/20 blur-2xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-[#FBBC04]">hub</span>
              <span className="text-xs tracking-wider uppercase font-bold">
                Vertex Academy • Learner Workspace
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Learner Analytics & Knowledge Graph
            </h1>
            <p className="text-sm lg:text-base text-white/90 leading-relaxed font-normal">
              Real-time concept mastery tracking, Gemini-synthesized skill lineage, and conversational voice tutor engagement telemetry.
            </p>
          </div>

          {/* Controls & Quick Status */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 1200);
              }}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 text-xs font-semibold transition-all shadow-xs"
              title="Fetch latest telemetry from Vertex AI"
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] google-dot-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] google-dot-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] google-dot-pulse" style={{ animationDelay: '300ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] google-dot-pulse" style={{ animationDelay: '450ms' }}></span>
              </div>
              <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/20 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse"></span>
              <span>Weekly Retention: 94%</span>
            </div>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#1a73e8] hover:bg-[#f8fafd] transition-all text-xs font-bold shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>{copiedTranscript ? 'Printing...' : 'Export Transcript (.pdf)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* METRIC BANNER (4 Google-Colored KPI Metric Cards or Skeleton) */}
      {isRefreshing ? (
        <div className="space-y-4">
          <GoogleLoadingIndicator message="Fetching telemetry metrics from Vertex AI cluster..." />
          <GoogleMetricSkeleton count={4} vibrant={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1: Google Blue (#4285F4) - Courses Enrolled */}
        <div className="rounded-3xl glass-card p-6 shadow-sm border-t-4 border-t-[#4285F4] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs text-[#5f6368] uppercase tracking-wider font-bold">
                Courses Enrolled
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1f1f1f]">3</span>
                <span className="text-xs font-bold text-[#1a73e8]">Active</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] shadow-xs">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e3e8f5] flex items-center justify-between text-xs">
            <span className="text-[#5f6368]">1 Completed, 2 in flight</span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-bold border border-[#c2e7ff]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>+1 mo
            </span>
          </div>
        </div>

        {/* Card 2: Google Green (#34A853) - Concepts Mastered */}
        <div className="rounded-3xl glass-card p-6 shadow-sm border-t-4 border-t-[#34A853] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs text-[#5f6368] uppercase tracking-wider font-bold">
                Concepts Mastered
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1f1f1f]">28</span>
                <span className="text-xs font-bold text-[#137333]">Topics</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#e6f4ea] flex items-center justify-center text-[#137333] shadow-xs">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e3e8f5] flex items-center justify-between text-xs">
            <span className="text-[#5f6368]">Verified via Code Sandboxes</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[11px] font-bold border border-[#ceead6]">
              Top 5% Cohort
            </span>
          </div>
        </div>

        {/* Card 3: Google Yellow (#FBBC04) - Voice Tutor Hours */}
        <div className="rounded-3xl glass-card p-6 shadow-sm border-t-4 border-t-[#FBBC04] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs text-[#5f6368] uppercase tracking-wider font-bold">
                Voice Tutor Hours
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1f1f1f]">4.2</span>
                <span className="text-xs font-bold text-[#b06000]">Hrs Spoken</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#fef7e0] flex items-center justify-center text-[#b06000] shadow-xs">
              <span className="material-symbols-outlined text-[24px]">mic</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e3e8f5] flex items-center justify-between text-xs">
            <span className="text-[#5f6368]">38 Gemini Live S2S turns</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] text-[11px] font-bold border border-[#feefc3]">
              140ms Latency
            </span>
          </div>
        </div>

        {/* Card 4: Google Red (#EA4335) - Next High-Yield Goal */}
        <div className="rounded-3xl glass-card p-6 shadow-sm border-t-4 border-t-[#EA4335] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#c5221f] font-bold uppercase tracking-wider">
                Next High-Yield Goal
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#fce8e6] text-[#c5221f] font-bold border border-[#fad2cf]">
                +250 XP
              </span>
            </div>
            <h2 className="text-sm font-bold text-[#1f1f1f] line-clamp-1">
              HNSW Skip-List Indexing Quiz
            </h2>
            <p className="text-xs text-[#5f6368] mt-0.5">Vector Databases 101 • 8 min</p>
          </div>
          <div className="mt-4 pt-2 flex items-center justify-between">
            <span className="text-xs text-[#137333] font-semibold">Unlocks Quantization</span>
            <button
              onClick={onNavigateToPlayer}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#c5221f] hover:bg-[#a51d24] text-white text-xs font-bold shadow-2xs transition-all"
            >
              <span>Resume</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* CENTERPIECE: GEMINI AUTONOMOUS KNOWLEDGE GRAPH */}
      <div className="rounded-3xl glass-card p-6 shadow-sm border border-[#e3e8f5] space-y-4">
        {/* Graph Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-[#e3e2e6]/50 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005bbf] text-[22px]">hub</span>
              <h2 className="text-lg font-bold text-[#1a1b1e]">
                Gemini Autonomous Skill Knowledge Graph
              </h2>
            </div>
            <p className="text-xs text-[#414754]">
              Dynamic semantic lineage mapping. Nodes update as code sandboxes, conversational voice
              prompts, and quizzes evaluate competency.
            </p>
          </div>

          {/* Graph Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#f4f3f7] rounded-full">
              {[
                { id: 'all', label: 'All Domains' },
                { id: 'vectors', label: 'Vectors & Search' },
                { id: 'agentic', label: 'Agentic Loops' },
                { id: 'infra', label: 'Infra & Cloud' },
              ].map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    selectedDomain === domain.id
                      ? 'bg-white text-[#005bbf] shadow-xs'
                      : 'text-[#414754] hover:text-[#1a1b1e]'
                  }`}
                >
                  {domain.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Graph Viewport + Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Interactive Node Graph Viewport (8 Cols) */}
          <div className="lg:col-span-8 bg-[#f4f3f7] rounded-3xl p-4 relative min-h-[460px] overflow-hidden flex flex-col justify-between border border-[#e3e8f5]">
            {/* Legend Bar */}
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-full self-start shadow-xs z-10 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]"></span>
                <span className="text-[#1f1f1f] font-semibold">Mastered (100%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] animate-pulse"></span>
                <span className="text-[#1f1f1f] font-semibold">In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c1c6d6]"></span>
                <span className="text-[#1f1f1f] font-medium">Recommended Next</span>
              </div>
            </div>

            {/* Scrollable Graph Canvas Wrapper to prevent clipping on expand/resize */}
            <div className="w-full overflow-x-auto overflow-y-hidden py-2 scrollbar-thin">
              <div className="relative min-w-[920px] h-[380px]">
                {/* SVG Visual Topology Connections Background */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="edgeGradMastered" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="#34A853" stopOpacity="0.6"></stop>
                        <stop offset="100%" stopColor="#34A853" stopOpacity="0.8"></stop>
                      </linearGradient>
                      <linearGradient id="edgeGradActive" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#34A853" stopOpacity="0.8"></stop>
                        <stop offset="100%" stopColor="#4285F4" stopOpacity="0.9"></stop>
                      </linearGradient>
                    </defs>
                    {/* Connection Bezier Curves */}
                    <path d="M 120 70 C 180 70, 240 120, 290 120" fill="none" stroke="#adc7ff" strokeDasharray="4 4" strokeWidth="2"></path>
                    <path d="M 140 240 C 190 240, 210 240, 250 240" fill="none" stroke="url(#edgeGradMastered)" strokeWidth="3"></path>
                    <path d="M 370 240 C 410 240, 420 190, 450 190" fill="none" stroke="url(#edgeGradMastered)" strokeWidth="3"></path>
                    <path d="M 540 190 C 580 190, 590 150, 640 150" fill="none" stroke="url(#edgeGradActive)" strokeWidth="3"></path>
                    <path d="M 740 150 C 780 150, 790 90, 830 90" fill="none" stroke="#727785" strokeDasharray="4 4" strokeWidth="2"></path>
                    <path d="M 540 190 C 580 190, 590 290, 640 290" fill="none" stroke="#adc7ff" strokeWidth="2"></path>
                    <path d="M 740 150 C 780 150, 790 270, 830 270" fill="none" stroke="#727785" strokeDasharray="4 4" strokeWidth="2"></path>
                  </svg>
                </div>

                {/* Interactive Nodes Layer */}
                <div className="relative w-full h-full z-10">
              {nodes
                .filter((n) => selectedDomain === 'all' || n.category === selectedDomain)
                .map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`absolute group cursor-pointer transition-all ${
                        isSelected ? 'scale-105 z-20' : 'hover:scale-102 z-10'
                      }`}
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    >
                      {node.status === 'mastered' ? (
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-xs transition-all border ${
                            isSelected ? 'border-[#006d3a] ring-2 ring-[#7ff8a8]' : 'border-[#e3e2e6]/60'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full bg-[#006d3a] flex items-center justify-center text-white text-[9px] font-bold">
                            ✓
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-[#1a1b1e]">{node.name}</span>
                            <span className="text-[10px] text-[#006d3a] font-medium">Mastered • 100%</span>
                          </div>
                        </div>
                      ) : node.status === 'in-progress' ? (
                        <div
                          className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full transition-all ${
                            isSelected
                              ? 'bg-[#005bbf] text-white shadow-md ring-4 ring-[#d8e2ff]'
                              : 'bg-white text-[#1a1b1e] shadow-xs border border-[#005bbf]/40'
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isSelected ? 'bg-white animate-pulse' : 'bg-[#005bbf]'
                            }`}
                          ></span>
                          <div className="flex flex-col text-left">
                            <span
                              className={`text-xs font-semibold ${
                                isSelected ? 'text-white' : 'text-[#1a1b1e]'
                              }`}
                            >
                              {node.name}
                            </span>
                            <span
                              className={`text-[10px] font-medium ${
                                isSelected ? 'text-[#d8e2ff]' : 'text-[#005bbf]'
                              }`}
                            >
                              In Progress • {node.percentage}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#efedf1] text-[#727785] shadow-xs border border-[#e3e2e6] ${
                            isSelected ? 'ring-2 ring-[#727785]' : ''
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {node.status === 'locked' ? 'lock' : 'arrow_forward'}
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-medium text-[#414754]">{node.name}</span>
                            <span className="text-[10px] text-[#727785]">
                              {node.status === 'locked' ? 'Locked Prereq' : 'Recommended'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
              </div>
            </div>

            {/* Bottom Ticker */}
            <div className="flex items-center justify-between text-[#727785] text-[11px] pt-2 border-t border-[#c1c6d6]/30">
              <span>Graph Source: Gemini-1.5-Pro Skill Deconstruction Pipeline</span>
              <span>Cluster Sync: 48 sec ago</span>
            </div>
          </div>

          {/* Node Deep Dive Inspector Panel (4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#f4f3f7] p-6 flex flex-col justify-between space-y-4 border border-[#e3e2e6]/60">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-[#005bbf] uppercase font-bold tracking-wider">
                    Concept Node Deep-Dive
                  </span>
                  <h3 className="text-lg font-bold text-[#1a1b1e] mt-0.5">{selectedNode.name}</h3>
                  <span className="text-xs text-[#414754]">{selectedNode.subtitle}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#d8e2ff] text-[#004493] text-xs font-bold">
                  {selectedNode.percentage}%
                </span>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#414754]">
                  <span>Mastery Threshold</span>
                  <span className="font-semibold text-[#1a1b1e]">{selectedNode.threshold}</span>
                </div>
                <div className="h-2 w-full bg-[#e3e2e6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#005bbf] rounded-full transition-all duration-500"
                    style={{ width: `${selectedNode.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Verified Micro-Competencies */}
              {selectedNode.verifiedList.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#1a1b1e]">
                    Verified by Automated Assessment:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#414754]">
                    {selectedNode.verifiedList.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006d3a] text-[16px]">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Remaining Requirement Card */}
              {selectedNode.pendingRequirement && (
                <div className="p-3.5 rounded-xl bg-white shadow-xs border border-[#e3e2e6] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#805600]">
                    <span className="material-symbols-outlined text-[16px]">flag</span>
                    <span className="text-xs font-semibold">Pending Requirement:</span>
                  </div>
                  <p className="text-xs text-[#1a1b1e] leading-relaxed">
                    {selectedNode.pendingRequirement}
                  </p>
                </div>
              )}
            </div>

            {/* Direct Action CTAs */}
            <div className="space-y-2 pt-2">
              <button
                onClick={onNavigateToPlayer}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
                <span>Launch Gemini Voice Review</span>
              </button>
              <button
                onClick={() => setIsSandboxOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-[#c1c6d6] text-[#1a1b1e] text-xs font-semibold hover:bg-[#efedf1] transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-[#727785]">code</span>
                <span>Open Code Sandbox Lab</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE ENROLLED COURSES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1a1b1e]">Active Learning Paths & Progress</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#d8e2ff] text-[#004493] text-xs font-semibold">
              2 In Flight
            </span>
          </div>
          <button
            onClick={onNavigateToPlayer}
            className="text-xs font-semibold text-[#005bbf] hover:underline flex items-center gap-1"
          >
            <span>View Full Syllabus</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Course 1 */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#e3e2e6]/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="w-16 h-16 rounded-xl bg-[#d8e2ff] shrink-0 overflow-hidden relative flex items-center justify-center">
                <img
                  className="object-cover w-full h-full"
                  alt="Vector DB"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwlUk-eu0qm1g-oSdr4WTsGNU8tvEXuO1Gy_xslazyN0atUo7KeW5HlFZLEZHzstbiU-ooPBZSsjOPdwDGf2spNiZwSi2tL_rG53Ay8-g8pIjfHnudurI8X9aEGHZMvad-Z-09cFdPeOck5CBpINXEmgtIkg-uLQhjvNB4os1xRtb-IblWbHeHxGUvdP12k9AJf0DBB-lhD_U1qjUmd5DrXUxQLeEhRs4-LDYK68A3fTFk1irYfjZo7A"
                />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#82faab] text-[#00522b] text-[11px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">graphic_eq</span>
                    Live Voice Companion
                  </span>
                  <span className="text-xs text-[#727785]">Prof. Kenneth Vance</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1a1b1e] truncate">
                  Vector Databases 101: HNSW vs Approximate Nearest Neighbors
                </h3>
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center justify-between text-xs text-[#414754]">
                    <span>Module 2 of 5: Graph Indexing Foundations</span>
                    <span className="font-semibold text-[#005bbf]">65% Completed</span>
                  </div>
                  <div className="h-1.5 bg-[#efedf1] rounded-full overflow-hidden">
                    <div className="h-full bg-[#005bbf] rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <button
                onClick={onNavigateToOralDefense}
                className="px-4 py-2 rounded-full bg-[#7ff8a8] hover:bg-[#82faab] text-[#00723d] text-xs font-semibold transition-colors"
              >
                Schedule Oral Defense
              </button>
              <button
                onClick={onNavigateToPlayer}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs transition-all"
              >
                <span>Continue Learning</span>
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT PEDAGOGICAL ACHIEVEMENTS BADGES ROW */}
      <div className="rounded-2xl bg-[#f4f3f7] p-6 border border-[#e3e2e6]/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#1a1b1e]">Recent Competency Badges & Hallmarks</h3>
            <p className="text-xs text-[#414754]">Verified on-chain via Agentic LMS Assessment Protocols.</p>
          </div>
          <span className="text-xs text-[#727785]">Cohort percentile: 95th</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white shadow-xs border border-[#e3e2e6]">
            <div className="w-10 h-10 rounded-full bg-[#ffddb0] flex items-center justify-center text-[#614000] shrink-0">
              <span className="material-symbols-outlined text-[22px]">military_tech</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#1a1b1e] block">Vector Apprentice (Gold)</span>
              <span className="text-[11px] text-[#414754]">4 Index Architectures Mastered</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white shadow-xs border border-[#e3e2e6]">
            <div className="w-10 h-10 rounded-full bg-[#82faab] flex items-center justify-center text-[#00522b] shrink-0">
              <span className="material-symbols-outlined text-[22px]">speech_to_text</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#1a1b1e] block">7-Day Voice Consistency</span>
              <span className="text-[11px] text-[#414754]">Daily Gemini S2S Dialog turns</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white shadow-xs border border-[#e3e2e6]">
            <div className="w-10 h-10 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#004493] shrink-0">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#1a1b1e] block">Zero-Hallucination Streak</span>
              <span className="text-[11px] text-[#414754]">100% Code Sandbox Run Success</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Sandbox Modal */}
      <CodeSandboxModal isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} />
    </div>
  );
};
