import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';
import { GoogleTableRowSkeleton, GoogleLoadingIndicator } from '../components/GoogleSkeleton';
import { api } from '../services/api';

interface AgentLogsViewProps {
  onReplayInSandbox?: () => void;
}

export const AgentLogsView: React.FC<AgentLogsViewProps> = ({ onReplayInSandbox }) => {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('All Agents');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');
  const [copiedJson, setCopiedJson] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState('log_771122');
  const [replaySuccess, setReplaySuccess] = useState(false);


  const initialLogs: LogEntry[] = [
    {
      id: 'log_771122',
      timestamp: '11:25:01.428',
      userId: 'usr_998822',
      agentName: 'EnrollmentAgent',
      actionExecuted: 'ENROLL_USER',
      toolCalled: 'Firestore.update()',
      status: 'SUCCESS',
      latency: '120ms',
      latencyBreakdown: { network: 14, reasoning: 88, storage: 18 },
      triggerSource: 'Gemini Live Speech Tutor',
      input: 'User verbally requested: "Enroll me in the hands-on lab"',
      output: 'Updated user doc. Provisioned sandbox container.',
      parameters: {
        courseId: 'crs_vector_101',
        labModule: '2.3_exact_vs_approx_knn',
        grantedTier: 'COMPUTE_SANDBOX_A100',
      },
      evalScore: {
        intentConfidence: 0.994,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771121',
      timestamp: '11:24:45.891',
      userId: 'usr_998822',
      agentName: 'ArtifactAgent',
      actionExecuted: 'GENERATE_DIAGRAM',
      toolCalled: 'Mermaid.render()',
      status: 'SUCCESS',
      latency: '450ms',
      latencyBreakdown: { network: 22, reasoning: 390, storage: 38 },
      triggerSource: 'Learning Canvas In-Line Query',
      input: 'User requested skip-list visualization for HNSW hierarchy',
      output: 'Rendered SVG vector skip-list flowchart asset.',
      parameters: {
        diagramType: 'HNSW_SKIP_LIST',
        layersCount: 3,
      },
      evalScore: {
        intentConfidence: 0.988,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771120',
      timestamp: '11:23:10.104',
      userId: 'usr_334411',
      agentName: 'RAGAgent',
      actionExecuted: 'VECTOR_SEARCH',
      toolCalled: 'VertexAI.VectorSearch()',
      status: 'SUCCESS',
      latency: '85ms',
      latencyBreakdown: { network: 10, reasoning: 65, storage: 10 },
      triggerSource: 'Prompt Engine Retrieval',
      input: 'Query vector embedding lookup for cosine vs euclidean',
      output: 'Retrieved 4 high-affinity chunks with >0.88 cosine score.',
      parameters: {
        indexName: 'hnsw-cosine-prod-01',
        topK: 4,
        vectorDimensions: 1536,
      },
      evalScore: {
        intentConfidence: 0.999,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771119',
      timestamp: '11:21:04.300',
      userId: 'usr_771249',
      agentName: 'RoutingAgent',
      actionExecuted: 'INTENT_CLASSIFY',
      toolCalled: 'Gemini1.5.classify()',
      status: 'SUCCESS',
      latency: '142ms',
      latencyBreakdown: { network: 15, reasoning: 115, storage: 12 },
      triggerSource: 'Voice Dialogue Stream',
      input: '"Can you explain how HNSW handles search?"',
      output: 'Routed to RAGAgent + Concept Visualizer.',
      parameters: {
        intentCategory: 'TECHNICAL_EXPLANATION',
        confidence: 0.992,
      },
      evalScore: {
        intentConfidence: 0.992,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771118',
      timestamp: '11:18:52.710',
      userId: 'usr_552109',
      agentName: 'EvaluationAgent',
      actionExecuted: 'RUBRIC_EVAL',
      toolCalled: 'EvalSuite.grade()',
      status: 'RETRY (2/3)',
      latency: '910ms',
      latencyBreakdown: { network: 45, reasoning: 820, storage: 45 },
      triggerSource: 'Oral Defense Step 2',
      input: 'Audio response evaluation for edge case defense',
      output: 'Retry attempt 2: Verified factual correctness rubric.',
      parameters: {
        rubricId: 'rbc_oral_defense_v2',
        retryReason: 'TRANSIENT_SOCKET_TIMEOUT',
      },
      evalScore: {
        intentConfidence: 0.961,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771117',
      timestamp: '11:15:33.018',
      userId: 'usr_110294',
      agentName: 'RAGAgent',
      actionExecuted: 'CHUNK_EMBEDDING',
      toolCalled: 'VertexAI.textEmbedding()',
      status: 'FAILED',
      latency: '3,100ms',
      latencyBreakdown: { network: 120, reasoning: 2900, storage: 80 },
      triggerSource: 'Document Ingestion Worker',
      input: 'Batch ingestion token extraction on corrupt PDF page',
      output: 'Rate limit / quota exceeded on concurrent embedding call.',
      parameters: {
        batchSize: 128,
        errorCode: 'RESOURCE_EXHAUSTED',
      },
      evalScore: {
        intentConfidence: 0.812,
        guardrailsPassed: false,
      },
    },
  ];

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  // Fetch initial logs from backend
  useEffect(() => {
    api.getAgentLogs()
      .then((backendLogs) => {
        if (backendLogs && backendLogs.length > 0) {
          setLogs(backendLogs);
        }
      })
      .catch((err) => console.log('Could not fetch initial agent logs', err));
  }, []);

  // Connect to live SSE Stream from backend
  useEffect(() => {
    if (!isLiveStreaming) return;

    const cleanup = api.subscribeAgentLogsStream(
      (newLog: LogEntry) => {
        setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
      },
      (error) => {
        console.warn('SSE stream error, continuing with fallback', error);
      }
    );

    return () => {
      cleanup();
    };
  }, [isLiveStreaming]);

  const selectedLog = logs.find((l) => l.id === selectedLogId) || logs[0];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleReplay = () => {
    setReplaySuccess(true);
    setTimeout(() => setReplaySuccess(false), 2500);
    if (onReplayInSandbox) onReplayInSandbox();
  };

  const exportAuditCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Log ID,Timestamp,User ID,Agent Name,Action Executed,Tool Called,Status,Latency']
        .concat(
          logs.map(
            (l) =>
              `"${l.id}","${l.timestamp}","${l.userId}","${l.agentName}","${l.actionExecuted}","${l.toolCalled}","${l.status}","${l.latency}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'agentic_audit_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchFilter === '' ||
      log.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.actionExecuted.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesAgent =
      selectedAgentFilter === 'All Agents' || log.agentName === selectedAgentFilter;

    const matchesStatus =
      selectedStatusFilter === 'All Statuses' ||
      (selectedStatusFilter === 'Success' && log.status === 'SUCCESS') ||
      (selectedStatusFilter === 'Processing' && log.status.includes('RETRY')) ||
      (selectedStatusFilter === 'Failed' && log.status === 'FAILED');

    return matchesSearch && matchesAgent && matchesStatus;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1560px] mx-auto space-y-6">
      {/* GEMINI AURORA HEADER */}
      <section className="relative overflow-hidden rounded-3xl p-6 lg:p-8 text-white shadow-lg bg-gradient-to-r from-[#1a73e8] via-[#7C3AED] via-[#D96570] to-[#FBBC04]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl"></div>
        <div className="pointer-events-none absolute left-1/3 -bottom-20 h-64 w-64 rounded-full bg-[#FBBC04]/20 blur-2xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-[#FBBC04]">receipt_long</span>
              <span className="text-xs tracking-wider uppercase font-bold">
                Vertex Academy • Telemetry Ledger
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Multi-Agent System Logs & Audit Operations
            </h1>
            <p className="text-xs lg:text-sm text-white/90 leading-relaxed font-normal">
              Real-time telemetry, tool invocation audits, and retrieval verification across distributed Gemini multi-agent pipelines.
            </p>
          </div>

          {/* Action Controls Group */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className="flex items-center gap-2 h-10 px-4 rounded-full bg-black/25 backdrop-blur-md hover:bg-black/35 text-white border border-white/20 transition-all text-xs font-bold shadow-xs"
            >
              <span className="relative flex h-2.5 w-2.5">
                {isLiveStreaming ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A853] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34A853]"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/60"></span>
                )}
              </span>
              <span>
                Stream: {isLiveStreaming ? 'Live' : 'Paused'}
              </span>
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>

            <button
              onClick={exportAuditCSV}
              className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-white text-[#1a73e8] hover:bg-[#f8fafd] transition-all text-xs font-bold shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">ios_share</span>
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setLogs(initialLogs)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shadow-xs"
              title="Flush Telemetry Ring Buffer"
            >
              <span className="material-symbols-outlined text-[18px]">layers_clear</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Google-Colored Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Google Blue (#4285F4) */}
        <div className="p-5 rounded-3xl glass-card shadow-sm border-t-4 border-t-[#4285F4] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5f6368] uppercase tracking-wider font-bold">
              Total Agent Actions
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-bold border border-[#c2e7ff] flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>+12%
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-[#1f1f1f] tracking-tight">1,420</span>
            <span className="text-xs text-[#5f6368]">invocations</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e3e8f5] text-xs text-[#5f6368]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#1a73e8]">speed</span>
              Avg latency: <strong className="text-[#1f1f1f]">184ms</strong>
            </span>
            <svg className="w-16 h-5 text-[#1a73e8]" fill="none" viewBox="0 0 64 20">
              <path
                d="M1 15 L12 11 L22 14 L34 6 L44 9 L54 3 L63 5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Google Green (#34A853) */}
        <div className="p-5 rounded-3xl glass-card shadow-sm border-t-4 border-t-[#34A853] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5f6368] uppercase tracking-wider font-bold">
              RAG Retrieval Accuracy
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[11px] font-bold border border-[#ceead6]">
              Optimal
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-[#1f1f1f] tracking-tight">98.4%</span>
            <span className="text-xs text-[#137333] font-bold">Cosine &gt; 0.88</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e3e8f5] text-xs text-[#5f6368]">
            <span className="truncate flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#137333]">database</span>
              Vertex text-embedding-004
            </span>
            <svg className="w-14 h-5 text-[#34A853]" fill="none" viewBox="0 0 56 20">
              <path
                d="M2 14 Q 15 16, 28 8 T 54 4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Google Yellow (#FBBC04) */}
        <div className="p-5 rounded-3xl glass-card shadow-sm border-t-4 border-t-[#FBBC04] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5f6368] uppercase tracking-wider font-bold">
              Live Voice Sessions
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] text-[11px] font-bold border border-[#feefc3] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b06000] animate-pulse"></span>
              Live S2S
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-[#1f1f1f] tracking-tight">340</span>
            <span className="text-xs font-bold text-[#137333]">Active</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e3e8f5] text-xs text-[#5f6368]">
            <span className="truncate flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#b06000]">mic</span>
              Gemini Live WebRTC stream
            </span>
            <span className="text-[#5f6368] font-mono text-[11px]">48kHz PCM</span>
          </div>
        </div>

        {/* Card 4: Google Red (#EA4335) */}
        <div className="p-5 rounded-3xl glass-card shadow-sm border-t-4 border-t-[#EA4335] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5f6368] uppercase tracking-wider font-bold">
              Firestore Log Writes
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fce8e6] text-[#c5221f] text-[11px] font-bold border border-[#fad2cf]">
              P99 18ms
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-[#1f1f1f] tracking-tight">4.2k</span>
            <span className="text-xs text-[#5f6368]">ops / min</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e3e8f5] text-xs text-[#5f6368]">
            <span className="font-mono text-[11px] text-[#5f6368] truncate">/agent_audit_ledger</span>
            <span className="material-symbols-outlined text-[16px] text-[#34A853]">cloud_done</span>
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#e3e2e6]/50 flex flex-col gap-3">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by User ID, Session Hash, or Execution ID (e.g., usr_998822)..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#f4f3f7] focus:bg-white text-xs text-[#1a1b1e] placeholder:text-[#727785] outline-none focus:ring-2 focus:ring-[#005bbf] transition-all"
            />
          </div>

          <div className="flex items-center justify-between xl:justify-end gap-3 shrink-0">
            <button className="h-10 px-4 rounded-xl bg-[#f4f3f7] hover:bg-[#efedf1] text-xs font-semibold text-[#1a1b1e] flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px] text-[#727785]">schedule</span>
              <span>Past 24 Hours</span>
              <span className="material-symbols-outlined text-[16px] text-[#727785]">expand_more</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f4f3f7] text-[11px] text-[#414754]">
              <span className="w-2 h-2 rounded-full bg-[#006d3a]"></span>
              <span>Auto-refreshing every 5s</span>
            </div>
          </div>
        </div>

        {/* Filter Chips Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#efedf1]">
          {/* Agent Type Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#727785] font-semibold uppercase tracking-wider mr-1">
              Agent:
            </span>
            {[
              'All Agents',
              'RoutingAgent',
              'RAGAgent',
              'EnrollmentAgent',
              'ArtifactAgent',
              'EvaluationAgent',
            ].map((agent) => (
              <button
                key={agent}
                onClick={() => setSelectedAgentFilter(agent)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedAgentFilter === agent
                    ? 'bg-[#005bbf] text-white shadow-xs'
                    : 'bg-[#f4f3f7] hover:bg-[#efedf1] text-[#1a1b1e]'
                }`}
              >
                {agent}
              </button>
            ))}
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#727785] font-semibold uppercase tracking-wider mr-1">
              Status:
            </span>
            {['All Statuses', 'Success', 'Processing', 'Failed'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedStatusFilter === st
                    ? 'bg-[#efedf1] text-[#1a1b1e] ring-2 ring-[#005bbf]'
                    : 'bg-[#f4f3f7] text-[#414754] hover:bg-[#efedf1]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split Main Workspace (Table / Payload Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: System Log Table (7.5 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col rounded-2xl bg-white shadow-sm border border-[#e3e2e6]/50 overflow-hidden">
          <div className="px-5 py-3 bg-[#f4f3f7] flex items-center justify-between border-b border-[#e3e2e6]/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#005bbf]">
                receipt_long
              </span>
              <span className="text-xs font-semibold text-[#1a1b1e]">Execution Event Log</span>
              <span className="px-2 py-0.5 rounded-full bg-[#efedf1] text-[10px] text-[#727785] font-medium">
                Live Feed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 1000);
                }}
                disabled={isRefreshing}
                className="h-7 px-2.5 rounded-full bg-white hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff] text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                title="Fetch latest log events from Vertex cluster"
              >
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] google-dot-pulse"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] google-dot-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] google-dot-pulse" style={{ animationDelay: '300ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] google-dot-pulse" style={{ animationDelay: '450ms' }}></span>
                </div>
                <span>{isRefreshing ? 'Fetching...' : 'Fetch'}</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-[#414754]">
                <span className="material-symbols-outlined text-[15px] text-[#006d3a]">sync</span>
                <span>Buffer: {filteredLogs.length} retained</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f4f3f7]/80 text-[#727785] uppercase tracking-wider font-semibold border-b border-[#efedf1]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-3">User ID</th>
                  <th className="py-3 px-3">Agent Name</th>
                  <th className="py-3 px-3">Action Executed</th>
                  <th className="py-3 px-3">Tool Called</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Latency</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              {isRefreshing ? (
                <GoogleTableRowSkeleton count={6} vibrant={true} />
              ) : (
              <tbody className="divide-y divide-[#efedf1] text-[#1a1b1e]">
                {filteredLogs.map((log) => {
                  const isSelected = selectedLogId === log.id;
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLogId(log.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#d8e2ff]/40' : 'hover:bg-[#f4f3f7]'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-[#005bbf]' : 'bg-transparent'
                            }`}
                          ></span>
                          <span>{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#efedf1]">
                          <span className="w-4 h-4 rounded-full bg-[#005bbf] text-white text-[10px] flex items-center justify-center font-bold">
                            U
                          </span>
                          <span className="font-mono text-[11px] text-[#1a1b1e] font-medium">
                            {log.userId}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-[#d8e2ff] text-[#004493] text-[11px] font-semibold">
                          {log.agentName}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] font-semibold text-[#005bbf]">
                        {log.actionExecuted}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-[#f4f3f7] font-mono text-[11px] text-[#414754]">
                          {log.toolCalled}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            log.status === 'SUCCESS'
                              ? 'bg-[#7ff8a8] text-[#00723d]'
                              : log.status.includes('RETRY')
                              ? 'bg-[#ffddb0] text-[#614000]'
                              : 'bg-[#ffdad6] text-[#93000a]'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] font-medium">
                        {log.latency}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLogId(log.id);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            isSelected
                              ? 'bg-[#005bbf] text-white shadow-xs'
                              : 'bg-[#f4f3f7] hover:bg-[#efedf1] text-[#005bbf]'
                          }`}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              )}
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-[#f4f3f7] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#e3e2e6]/60 text-xs text-[#727785]">
            <span>
              Showing <strong className="text-[#1a1b1e]">1-{filteredLogs.length}</strong> of{' '}
              <strong className="text-[#1a1b1e]">1,420</strong> entries
            </span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e3e2e6]">
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-[#005bbf] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#e3e2e6] flex items-center justify-center">
                2
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#e3e2e6] flex items-center justify-center">
                3
              </button>
              <span className="px-1">...</span>
              <button className="w-8 h-8 rounded-full hover:bg-[#e3e2e6] flex items-center justify-center">
                57
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e3e2e6]">
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Expandable Log Payload Drawer / Inspector (4.5 cols, sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-2xl bg-white shadow-sm border border-[#e3e2e6]/50 flex flex-col sticky top-20 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-[#f4f3f7] flex items-center justify-between border-b border-[#e3e2e6]/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#005bbf]">
                data_object
              </span>
              <div>
                <h2 className="text-xs font-bold text-[#1a1b1e] leading-tight">
                  Log Payload Inspector
                </h2>
                <p className="text-[11px] text-[#727785] leading-none">
                  Structured audit representation
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyJson}
              className="h-8 px-2.5 rounded-full bg-white hover:bg-[#efedf1] text-[#1a1b1e] text-[11px] font-semibold flex items-center gap-1 border border-[#e3e2e6] transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copiedJson ? 'check' : 'content_copy'}
              </span>
              <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* Metadata Chips Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#d8e2ff] text-[#004493] font-mono text-xs font-semibold">
                {selectedLog.id}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#f4f3f7] font-mono text-xs text-[#1a1b1e]">
                {selectedLog.timestamp} UTC
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#f4f3f7] font-mono text-xs text-[#727785]">
                ses_09fa88_alex
              </span>
            </div>

            {/* Execution Summary Card */}
            <div className="p-3.5 rounded-xl bg-[#f4f3f7] flex flex-col gap-2 border border-[#e3e2e6]/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#727785] font-medium uppercase text-[10px]">Trigger Source</span>
                <span className="font-semibold text-[#1a1b1e] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#005bbf]">
                    record_voice_over
                  </span>
                  {selectedLog.triggerSource}
                </span>
              </div>

              {/* Segmented Latency Breakdown */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#414754] font-medium">
                    Total Latency: {selectedLog.latency}
                  </span>
                  <span className="text-[#727785] text-[11px]">P50 Benchmark</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e3e2e6] overflow-hidden flex">
                  <div className="bg-[#005bbf] h-full" style={{ width: '12%' }} title="Network 14ms"></div>
                  <div className="bg-[#1a73e8] h-full" style={{ width: '73%' }} title="Reasoning 88ms"></div>
                  <div className="bg-[#006d3a] h-full" style={{ width: '15%' }} title="Store 18ms"></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#727785] font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#005bbf]"></span>Net 14ms
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1a73e8]"></span>Reason 88ms
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#006d3a]"></span>Store 18ms
                  </span>
                </div>
              </div>

              {/* Safety Filter Banner */}
              <div className="mt-1 p-2 rounded-lg bg-white flex items-center gap-2 text-xs border border-[#e3e2e6]/60">
                <span className="material-symbols-outlined text-[16px] text-[#006d3a]">verified_user</span>
                <span className="truncate text-[#1a1b1e]">
                  Safety Guardrail: <strong className="text-[#006d3a]">PASSED</strong> (Score:{' '}
                  {selectedLog.evalScore?.intentConfidence || '0.998'})
                </span>
              </div>
            </div>

            {/* Monospace JSON Code Container */}
            <div className="flex flex-col rounded-xl bg-[#2f3033] text-[#f1f0f4] p-3.5 overflow-hidden font-mono text-[11px] leading-relaxed shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#727785]/30 text-[#c1c6d6] text-[11px]">
                <span>audit_record.json</span>
                <span className="text-[#82faab]">VALID SCHEMA</span>
              </div>
              <pre className="overflow-x-auto max-h-56 select-text text-left">
                <code>
                  {JSON.stringify(
                    {
                      logId: selectedLog.id,
                      sessionId: 'ses_09fa88_alex',
                      timestamp: `2024-10-24T${selectedLog.timestamp}Z`,
                      agent: selectedLog.agentName,
                      action: selectedLog.actionExecuted,
                      tool: selectedLog.toolCalled,
                      status: selectedLog.status,
                      latency: selectedLog.latency,
                      trigger: selectedLog.triggerSource,
                      input: selectedLog.input,
                      parameters: selectedLog.parameters,
                      output: selectedLog.output,
                      evalScore: selectedLog.evalScore,
                    },
                    null,
                    2
                  )}
                </code>
              </pre>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleReplay}
                className="w-full h-10 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Replay Agent Turn in Sandbox</span>
              </button>

              {replaySuccess && (
                <div className="p-2 rounded-lg bg-[#7ff8a8]/60 text-[#00522b] text-[11px] font-semibold text-center">
                  Agent Turn replayed successfully in sandbox environment!
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={exportAuditCSV}
                  className="h-9 px-3 rounded-full bg-[#f4f3f7] hover:bg-[#efedf1] text-[#1a1b1e] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#727785]">
                    download
                  </span>
                  <span>Download Trace</span>
                </button>
                <button
                  onClick={() => alert('OpenTelemetry Span Trace traceId: 4bf92f3577b34da6a3ce929d0e0e4736')}
                  className="h-9 px-3 rounded-full bg-[#f4f3f7] hover:bg-[#efedf1] text-[#005bbf] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>OTel Span View</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
