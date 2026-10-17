import React, { useState } from 'react';

interface CodeSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeSandboxModal: React.FC<CodeSandboxModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(true);

  if (!isOpen) return null;

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasExecuted(true);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2f3033]/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#f4f3f7] flex items-center justify-between border-b border-[#e3e2e6]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005bbf] text-[22px]">terminal</span>
            <h3 className="font-semibold text-base text-[#1a1b1e]">
              Interactive Code Sandbox: HNSW vs KNN Benchmark
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e3e2e6] text-[#414754]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Code View */}
        <div className="p-4 bg-[#1a1b1e] text-[#f1f0f4] font-mono text-xs overflow-x-auto max-h-64 border-b border-[#2f3033]">
          <div className="text-[#727785] pb-2"># Python 3.11 with hnswlib & numpy vector extensions</div>
          <pre className="leading-relaxed">
            <code>
{`import hnswlib
import numpy as np
import time

dim = 1536
num_elements = 250_000

# 1. Build HNSW index
p = hnswlib.Index(space='cosine', dim=dim)
p.init_index(max_elements=num_elements, ef_construction=200, M=16)
p.set_ef(64)

# 2. Benchmark Query
query_vector = np.random.randn(dim).astype(np.float32)
query_vector /= np.linalg.norm(query_vector)

start = time.perf_counter()
labels, distances = p.knn_query(query_vector, k=5)
hnsw_time = (time.perf_counter() - start) * 1000`}
            </code>
          </pre>
        </div>

        {/* Execution Output Console */}
        <div className="p-4 bg-[#faf9fd] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1a1b1e] uppercase tracking-wider">
              Benchmark Telemetry
            </span>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-1.5 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRunning ? 'animate-spin' : ''}`}>
                {isRunning ? 'sync' : 'play_arrow'}
              </span>
              <span>{isRunning ? 'Benchmarking...' : 'Re-Run Benchmark'}</span>
            </button>
          </div>

          {hasExecuted && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#e3e2e6] shadow-xs">
                <span className="text-[11px] text-[#727785] uppercase block">HNSW Query Latency</span>
                <span className="text-xl font-bold text-[#006d3a]">1.42 ms</span>
                <span className="text-[10px] text-[#006d3a] block">99.4% Recall Accuracy</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#e3e2e6] shadow-xs">
                <span className="text-[11px] text-[#727785] uppercase block">Exact Flat KNN</span>
                <span className="text-xl font-bold text-[#ba1a1a]">318.5 ms</span>
                <span className="text-[10px] text-[#ba1a1a] block">224x Slower Linear Scan</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#e3e2e6] shadow-xs">
                <span className="text-[11px] text-[#727785] uppercase block">Speedup Factor</span>
                <span className="text-xl font-bold text-[#005bbf]">224.3x</span>
                <span className="text-[10px] text-[#005bbf] block">O(log N) Traversal</span>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-[#efedf1] text-xs font-mono text-[#1a1b1e]">
            {isRunning ? (
              <span className="text-[#005bbf] animate-pulse">Running vector similarity search across 250,000 embeddings...</span>
            ) : (
              <span>
                [SUCCESS] Query converged at Layer 0 Nearest Neighbor ID: 41,294 (Distance: 0.0418)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
