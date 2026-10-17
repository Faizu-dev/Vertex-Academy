import React, { useState } from 'react';
import { IngestionFileItem } from '../types';

interface ViewChunksModalProps {
  file: IngestionFileItem | null;
  onClose: () => void;
}

export const ViewChunksModal: React.FC<ViewChunksModalProps> = ({ file, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChunkId, setSelectedChunkId] = useState<string>('chk-001');

  if (!file) return null;

  const mockChunks = [
    {
      id: 'chk-001',
      page: 1,
      tokens: 284,
      score: 0.964,
      text: 'Hierarchical Navigable Small World (HNSW) graphs solve high-dimensional approximate nearest neighbor search by constructing multi-layer geometric skip-lists. Upper sparse layers maintain long-distance highway shortcuts across disjointed vector clusters, slashing lookups to logarithmic O(log N) latency.',
      vectorPreview: [0.0342, -0.0812, 0.4912, -0.1204, 0.7712, -0.0441, 0.3129, 0.0984],
    },
    {
      id: 'chk-002',
      page: 2,
      tokens: 312,
      score: 0.932,
      text: 'Euclidean distance (L2 norm) versus Cosine similarity in normalized hyperspherical coordinates. When all vector embeddings are unit-normalized to length ||v|| = 1, Euclidean distance squared directly equals 2 * (1 - cosine(u, v)), rendering both metrics topologically monotonic.',
      vectorPreview: [-0.1245, 0.3421, 0.0892, 0.5512, -0.0911, 0.6124, -0.2291, 0.1412],
    },
    {
      id: 'chk-003',
      page: 3,
      tokens: 245,
      score: 0.898,
      text: 'M parameter and efConstruction trade-offs in pgvector and Annoy index builders. Higher efConstruction ensures denser inter-neighborhood bridge connectivity at insertion time, increasing index construction RAM but locking in >99.4% recall at 100k QPS.',
      vectorPreview: [0.2104, -0.0091, -0.4129, 0.1983, 0.6512, -0.3201, 0.0412, 0.4901],
    },
    {
      id: 'chk-004',
      page: 5,
      tokens: 198,
      score: 0.871,
      text: 'Vector Quantization (IVF-PQ) compression strategies. Combining coarse inverted-file centroids with 8-bit product quantization codes yields 16x memory footprint reductions on billion-scale tensor databases without retraining the foundational embedding encoder.',
      vectorPreview: [-0.0412, 0.1892, 0.3921, -0.5102, 0.1192, 0.0812, -0.6312, 0.2014],
    },
  ];

  const filteredChunks = mockChunks.filter((c) =>
    c.text.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChunk = mockChunks.find((c) => c.id === selectedChunkId) || mockChunks[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2f3033]/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#f4f3f7] flex items-center justify-between border-b border-[#e3e2e6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d8e2ff] text-[#005bbf] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">database</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-[#1a1b1e]">{file.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#7ff8a8] text-[#00723d] text-xs font-semibold">
                  100% Vectorized
                </span>
              </div>
              <p className="text-xs text-[#414754]">
                {file.details} • 1,536 Dimensions (text-embedding-004)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e3e2e6] text-[#414754]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="p-3 bg-white border-b border-[#e3e2e6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727785] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter chunks by semantic keywords, page, or ID..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#f4f3f7] border-0 text-xs text-[#1a1b1e] placeholder:text-[#727785] outline-none focus:ring-2 focus:ring-[#005bbf]"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#414754] font-medium shrink-0">
            <span className="px-2.5 py-1 rounded bg-[#efedf1]">
              Index: <strong className="text-[#005bbf]">HNSW Cosine</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#efedf1]">
              Top-K: <strong className="text-[#005bbf]">4 Chunks</strong>
            </span>
          </div>
        </div>

        {/* Content Body: Split view of Chunks list and Vector float inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Chunks List */}
          <div className="md:col-span-7 border-r border-[#e3e2e6] overflow-y-auto p-3 space-y-2 max-h-[500px]">
            {filteredChunks.map((chunk) => (
              <div
                key={chunk.id}
                onClick={() => setSelectedChunkId(chunk.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedChunkId === chunk.id
                    ? 'bg-[#d8e2ff]/40 border-[#005bbf] shadow-sm'
                    : 'bg-[#f4f3f7] border-transparent hover:bg-[#efedf1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#005bbf]">{chunk.id}</span>
                    <span className="text-xs text-[#727785]">Page {chunk.page} • {chunk.tokens} tokens</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#7ff8a8] text-[#00723d] text-[11px] font-semibold">
                    Sim: {(chunk.score * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-[#1a1b1e] line-clamp-3 leading-relaxed">
                  {chunk.text}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Chunk Vector Detail Inspector */}
          <div className="md:col-span-5 p-4 bg-[#faf9fd] overflow-y-auto space-y-3 max-h-[500px]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#005bbf] uppercase tracking-wider">
                Selected Chunk Inspector
              </span>
              <h4 className="text-sm font-semibold text-[#1a1b1e]">{selectedChunk.id}</h4>
              <p className="text-xs text-[#414754] leading-relaxed bg-white p-2.5 rounded-lg border border-[#e3e2e6]">
                "{selectedChunk.text}"
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#1a1b1e]">
                High-Dimensional Vector Preview (First 8 of 1536 Floats)
              </span>
              <div className="p-2.5 rounded-lg bg-[#2f3033] text-[#f1f0f4] font-mono text-[11px] leading-relaxed overflow-x-auto">
                <span className="text-[#64dd91]">[</span>
                {selectedChunk.vectorPreview.map((v, i) => (
                  <span key={i} className="text-[#adc7ff]">
                    {v.toFixed(4)}
                    {i < selectedChunk.vectorPreview.length - 1 ? ', ' : ''}
                  </span>
                ))}
                <span className="text-[#727785]">, ... +1,528 dimensions</span>
                <span className="text-[#64dd91]">]</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-[#e3e2e6] space-y-1 text-xs text-[#414754]">
              <div className="flex justify-between">
                <span>Norm:</span>
                <span className="font-mono font-semibold text-[#1a1b1e]">1.0000 (Unit Sphere)</span>
              </div>
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="font-medium text-[#005bbf]">text-embedding-004</span>
              </div>
              <div className="flex justify-between">
                <span>Partition Layer:</span>
                <span className="font-medium text-[#006d3a]">HNSW Layer 0 (Ground Truth)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f4f3f7] flex items-center justify-between border-t border-[#e3e2e6]">
          <span className="text-xs text-[#727785]">
            Verified against Vertex AI Embeddings Vector API
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#005bbf] text-white text-xs font-semibold hover:bg-[#1a73e8] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
