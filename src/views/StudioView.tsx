import React, { useState } from 'react';
import { IngestionFileItem } from '../types';
import { ViewChunksModal } from '../components/ViewChunksModal';
import { TrailerModal } from '../components/TrailerModal';
import { GoogleTableRowSkeleton, GoogleLoadingIndicator } from '../components/GoogleSkeleton';

interface StudioViewProps {
  onNavigateToPlayer?: () => void;
  onNavigateToLogs?: () => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  onNavigateToPlayer,
  onNavigateToLogs,
}) => {
  const [selectedFileForChunks, setSelectedFileForChunks] = useState<IngestionFileItem | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSyncingRegistry, setIsSyncingRegistry] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [sampleConfirmed, setSampleConfirmed] = useState(false);

  // In-flight queue files state
  const [files, setFiles] = useState<IngestionFileItem[]>([
    {
      id: 'doc-1',
      name: 'Vector_DB_Architecture.pdf',
      format: 'PDF',
      size: '14.2 MB',
      details: '14.2 MB • 42 Pages • 1,248 Chunks in pgvector',
      status: 'indexed',
      progress: 100,
      timestamp: 'Today, 10:42 AM',
      vectorsGenerated: '1,248 Vectors (text-embedding-004)',
    },
    {
      id: 'doc-2',
      name: 'Course_Syllabus.pptx',
      format: 'PPTX',
      size: '28.6 MB',
      details: '28.6 MB • 34 Slides • Synthesizing storyboard',
      status: 'processing',
      progress: 75,
      remainingTime: '42s remaining',
      timestamp: 'Today, 10:38 AM',
      vectorsGenerated: '840 Vectors • 34 Keyframes',
    },
    {
      id: 'doc-3',
      name: 'Lab_Exercises_Dataset.xlsx',
      format: 'XLSX',
      size: '4.8 MB',
      details: '4.8 MB • 1,500 Rows • Schema mapped & normalized',
      status: 'synced',
      progress: 100,
      timestamp: 'Today, 09:15 AM',
      vectorsGenerated: '1,500 Vectors (Normalized)',
    },
  ]);

  // Registry logs table
  const registryItems: IngestionFileItem[] = [
    {
      id: 'reg-1',
      name: 'Vector_DB_Architecture.pdf',
      format: 'PDF',
      size: '14.2 MB',
      details: '42 Pages',
      status: 'indexed',
      timestamp: 'Today, 10:42 AM',
      vectorsGenerated: '1,248 Vectors (text-embedding-004)',
    },
    {
      id: 'reg-2',
      name: 'Course_Syllabus.pptx',
      format: 'PPTX',
      size: '28.6 MB',
      details: '34 Slides',
      status: 'processing',
      progress: 75,
      timestamp: 'Today, 10:38 AM',
      vectorsGenerated: '840 Vectors • 34 Keyframes',
    },
    {
      id: 'reg-3',
      name: 'Neural_Search_DeepDive.pdf',
      format: 'PDF',
      size: '21.0 MB',
      details: '68 Pages',
      status: 'indexed',
      timestamp: 'Yesterday, 4:15 PM',
      vectorsGenerated: '3,410 Vectors',
    },
    {
      id: 'reg-4',
      name: 'Student_Assessment_Rubric.docx',
      format: 'DOCX',
      size: '2.4 MB',
      details: '12 Pages',
      status: 'indexed',
      timestamp: 'Yesterday, 2:30 PM',
      vectorsGenerated: '420 Vectors',
    },
    {
      id: 'reg-5',
      name: 'Benchmark_Results.csv',
      format: 'CSV',
      size: '8.1 MB',
      details: '12,400 Rows',
      status: 'indexed',
      timestamp: 'Oct 24, 2024',
      vectorsGenerated: '1,980 Vectors',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const extension = file.name.split('.').pop()?.toUpperCase() as any;
      const newFile: IngestionFileItem = {
        id: `upload-${Date.now()}`,
        name: file.name,
        format: extension || 'PDF',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        details: `${(file.size / (1024 * 1024)).toFixed(1)} MB • Extracted tokens • Vectorizing with text-embedding-004`,
        status: 'processing',
        progress: 45,
        remainingTime: '28s remaining',
        timestamp: 'Just now',
        vectorsGenerated: '640 Vectors in-progress',
      };
      setFiles([newFile, ...files]);
    }
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1500);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3500);
    }, 1200);
  };

  const exportRegistryCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Document Name,Format,Ingestion Timestamp,Embeddings Generated,Status']
        .concat(
          registryItems.map(
            (r) => `"${r.name}","${r.format}","${r.timestamp}","${r.vectorsGenerated}","${r.status}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'vertex_academy_vector_registry.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1560px] mx-auto">
      {/* GEMINI AURORA HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl p-6 lg:p-9 text-white shadow-lg bg-gradient-to-r from-[#1a73e8] via-[#7C3AED] via-[#D96570] to-[#FBBC04]">
        {/* Ambient atmospheric glow orbs */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-96 w-96 rounded-full bg-white/20 blur-3xl animate-pulse"></div>
        <div className="pointer-events-none absolute left-1/3 -bottom-24 h-72 w-72 rounded-full bg-[#FBBC04]/25 blur-3xl"></div>
        <div className="pointer-events-none absolute right-1/3 top-10 h-64 w-64 rounded-full bg-[#34A853]/20 blur-2xl"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-[#FBBC04]">
                auto_awesome
              </span>
              <span className="text-xs tracking-wider uppercase font-bold">
                Vertex Academy • Gemini 1.5 Multimodal Engine
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Course Content Ingestion & AI Pipeline
            </h1>
            <p className="text-sm lg:text-base text-white/90 leading-relaxed font-normal">
              Upload syllabus documents, lecture slides, datasets, or video transcripts. Vertex AI multi-agent orchestration extracts structured tokens, builds 1536-dimensional embeddings with <strong className="font-semibold text-white">text-embedding-004</strong>, and synthesizes 3D interactive learning companions.
            </p>
          </div>

          {/* Meta Badges Cluster */}
          <div className="flex flex-wrap xl:flex-col items-start xl:items-end gap-2.5 shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md text-white text-xs border border-white/15">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse"></span>
              <span>
                Engine: <strong className="font-bold text-[#82faab]">Gemini 1.5 Pro Active</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md text-white text-xs border border-white/15">
              <span className="material-symbols-outlined text-[16px] text-[#93c5fd]">hub</span>
              <span>
                Embeddings: <strong className="font-bold text-[#d8e2ff]">1536-dim (Vertex pgvector)</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md text-white text-xs border border-white/15">
              <span className="material-symbols-outlined text-[16px] text-[#FBBC04]">bolt</span>
              <span>
                Compute: <strong className="font-bold text-[#fef08a]">Cloud TPU v5e Cluster</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PRIMARY 2-COLUMN SECTION */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Ingestion & Vectorization (7 cols) */}
        <div className="xl:col-span-7 flex flex-col space-y-5 glass-card p-6 lg:p-7 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e3e8f5] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f] flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                </span>
                Drag & Drop Asset Ingestion
              </h2>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Multi-modal course documents, slides, code notebooks & tabular datasets
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#f1f3f4] text-[11px] text-[#5f6368] font-semibold border border-[#dadce0] self-start sm:self-auto">
              Max: 500 MB / batch
            </span>
          </div>

          {/* Drop Zone Container */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                const extension = file.name.split('.').pop()?.toUpperCase() as any;
                const newFile: IngestionFileItem = {
                  id: `drop-${Date.now()}`,
                  name: file.name,
                  format: extension || 'PDF',
                  size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                  details: `${(file.size / (1024 * 1024)).toFixed(1)} MB • Vectorizing`,
                  status: 'processing',
                  progress: 30,
                  remainingTime: '35s remaining',
                  timestamp: 'Just now',
                  vectorsGenerated: 'Pending embedding creation',
                };
                setFiles([newFile, ...files]);
              }
            }}
            className={`relative group cursor-pointer transition-all duration-300 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-3.5 border-2 border-dashed ${
              isDragging
                ? 'bg-[#e8f0fe]/60 border-[#1a73e8] scale-[1.01]'
                : 'bg-gradient-to-b from-[#f8fafd] to-[#f1f4f9] hover:bg-[#e8f0fe]/30 border-[#4285F4]/40 hover:border-[#4285F4]'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1a73e8] to-[#4285F4] flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md">
              <span className="material-symbols-outlined text-[32px]">upload_file</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#1f1f1f]">
                Drag and drop course assets here, or browse files
              </p>
              <p className="text-xs text-[#5f6368]">
                Supports PDF, PPTX, DOCX, XLSX, and CSV with automatic Vertex AI entity extraction
              </p>
            </div>
            <label className="mt-2 inline-flex items-center gap-2 px-6 h-10 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Browse Course Files</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.pptx,.docx,.xlsx,.csv"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Active Ingestion File Status List */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-[#5f6368] uppercase tracking-wider font-bold">
                In-Flight Queue & Verification
              </span>
              <span className="text-xs text-[#137333] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>{' '}
                {files.filter((f) => f.status === 'processing').length || 1} items processing
              </span>
            </div>

            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-2xl bg-[#f8fafd] hover:bg-[#f1f4f9] border border-[#e3e8f5] transition-all flex flex-col space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        file.format === 'PDF'
                          ? 'bg-[#fce8e6] text-[#c5221f]'
                          : file.format === 'PPTX'
                          ? 'bg-[#fef7e0] text-[#b06000]'
                          : file.format === 'XLSX' || file.format === 'CSV'
                          ? 'bg-[#e6f4ea] text-[#137333]'
                          : 'bg-[#e8f0fe] text-[#1a73e8]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {file.format === 'PDF'
                          ? 'picture_as_pdf'
                          : file.format === 'PPTX'
                          ? 'slideshow'
                          : file.format === 'XLSX' || file.format === 'CSV'
                          ? 'table_chart'
                          : 'description'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1f1f1f] truncate">{file.name}</p>
                      <p className="text-[11px] text-[#5f6368] truncate">{file.details}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {file.status === 'indexed' || file.status === 'synced' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e6f4ea] text-[#137333] text-xs font-bold border border-[#ceead6]">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Vectorized 100%
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold border border-[#c2e7ff]">
                          <span className="material-symbols-outlined text-[14px] animate-spin">
                            progress_activity
                          </span>
                          Video Gen In-Flight
                        </span>
                        <span className="text-[11px] text-[#5f6368] font-medium">
                          {file.remainingTime || '42s left'}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedFileForChunks(file)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#e3e8f5] transition-colors"
                      title="Inspect Chunks"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>

                {file.status === 'processing' && (
                  <div className="w-full bg-[#e3e8f5] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] transition-all duration-500 rounded-full"
                      style={{ width: `${file.progress || 75}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: AI Teaser Video Preview (5 cols) */}
        <div className="xl:col-span-5 flex flex-col space-y-5 glass-card p-6 lg:p-7 rounded-3xl">
          <div className="flex items-center justify-between border-b border-[#e3e8f5] pb-4">
            <h2 className="text-base font-bold text-[#1f1f1f] flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#fef7e0] text-[#b06000] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">smart_display</span>
              </span>
              AI Course Teaser
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef7e0] text-[#b06000] text-xs font-bold border border-[#feefc3]">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              Gemini Agent Generated
            </span>
          </div>

          {/* Embedded Video Preview Container */}
          <div
            onClick={() => setIsTrailerOpen(true)}
            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#202124] group shadow-md flex items-center justify-center cursor-pointer ring-1 ring-black/10"
          >
            <img
              alt="Video Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2C_PkRWa8ODGWHH7yeQDBi6aGXnyC90svcNrufe4mVfReSqoUsj_FBH_mWrxLkYNtqGOk_op4p_zoQl7eO390aayvZjeiC3MxZ-Gjax4CthdXaCSqtVsFxZC6WmBlQDuHvacMst9HvR9EQnNyB6pPNlnv8gKj2UEP4q_X8b6D7ARUwwBESX2N2krYyLyqKqhIlp11ntCvdz87Hwsp_49qV2nfT98-_k4_PlyxcOJbiemafuUwY9YloA"
            />
            {/* Tech title overlay on slide */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
              <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-medium">
                Trailer Preview • 1080p
              </span>
              <span className="material-symbols-outlined text-white drop-shadow text-[20px]">hd</span>
            </div>

            {/* Center Play Button */}
            <button
              className="relative z-20 w-16 h-16 rounded-full bg-white/90 hover:bg-white text-[#1a73e8] flex items-center justify-center shadow-xl transition-transform group-hover:scale-110 active:scale-95"
              aria-label="Play Trailer"
            >
              <span className="material-symbols-outlined text-[36px] ml-1">play_arrow</span>
            </button>

            {/* Video Player Bottom Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-1.5 z-10">
              <div className="w-full bg-white/40 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4285F4] to-[#34A853] w-[60%]"></div>
              </div>
              <div className="flex items-center justify-between text-white text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                  <span>0:18 / 0:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/30">
                    Auto 60fps
                  </span>
                  <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Metadata Details */}
          <div className="p-3.5 rounded-2xl bg-[#f8fafd] border border-[#e3e8f5] space-y-2 text-xs text-[#5f6368]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#1f1f1f] font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">
                  record_voice_over
                </span>
                Synthesized Voice:
              </span>
              <span>Alex AI (Vertex S2S Studio)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#1f1f1f] font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#b06000]">
                  music_note
                </span>
                Background Audio:
              </span>
              <span>Ambient Google Focus (Instrumental)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#1f1f1f] font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#137333]">verified</span>
                Pedagogical Alignment:
              </span>
              <span className="font-bold text-[#137333]">99.4% Match</span>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={() => setIsTrailerOpen(true)}
              className="flex-1 h-10 px-4 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#c2e7ff]"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Play 30s Trailer
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="h-10 px-4 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 border border-[#dadce0]"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isRegenerating ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          </div>

          {/* Primary Action CTA */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full h-11 px-6 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.98] disabled:opacity-60"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${isPublishing ? 'animate-spin' : ''}`}
            >
              {isPublishing ? 'progress_activity' : 'rocket_launch'}
            </span>
            <span>
              {isPublishing ? 'Validating & Publishing to Vertex Hub...' : 'Approve & Publish Course'}
            </span>
          </button>

          {publishSuccess && (
            <div className="p-3 rounded-2xl bg-[#e6f4ea] text-[#137333] border border-[#ceead6] text-xs font-medium flex items-center justify-between">
              <span>Course successfully approved and published to Vertex Academy!</span>
              <button
                onClick={onNavigateToPlayer}
                className="underline font-bold text-[#137333]"
              >
                Open in Player →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TERTIARY SECTION: Ingested Pipeline Logs & Embedding Registry */}
      <section className="glass-card p-6 lg:p-7 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e8f5] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#1f1f1f] flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#e6f4ea] text-[#137333] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">database</span>
              </span>
              Ingestion Pipeline Logs & Embedding Registry
            </h3>
            <p className="text-xs text-[#5f6368] mt-0.5">
              Persistent Vertex AI vector audit ledger for retrieval-augmented generation (RAG)
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIsSyncingRegistry(true);
                setTimeout(() => setIsSyncingRegistry(false), 1200);
              }}
              disabled={isSyncingRegistry}
              className="h-9 px-3.5 rounded-full bg-white hover:bg-[#e8f0fe] text-[#1a73e8] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#c2e7ff] shadow-2xs"
              title="Sync Vector Search Index"
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] google-dot-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] google-dot-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] google-dot-pulse" style={{ animationDelay: '300ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] google-dot-pulse" style={{ animationDelay: '450ms' }}></span>
              </div>
              <span>{isSyncingRegistry ? 'Syncing...' : 'Sync Index'}</span>
            </button>
            <span className="px-3 py-1 rounded-full bg-[#f1f3f4] text-xs text-[#5f6368] font-semibold border border-[#dadce0]">
              24 Files • 18,420 Vectors
            </span>
            <button
              onClick={exportRegistryCSV}
              className="h-9 px-3.5 rounded-full bg-white hover:bg-[#f1f3f4] text-[#202124] text-xs font-medium flex items-center gap-1.5 transition-colors border border-[#dadce0] shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
            <button
              onClick={onNavigateToLogs}
              className="h-9 px-3.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#d2e3fc] transition-colors border border-[#c2e7ff]"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              Agent Audit Logs
            </button>
          </div>
        </div>

        {/* Clean Google Material Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#dadce0]/70 shadow-2xs bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafd] text-[#5f6368] uppercase tracking-wider font-semibold border-b border-[#dadce0]">
              <tr>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Ingestion Timestamp</th>
                <th className="py-3 px-4">Embeddings Generated</th>
                <th className="py-3 px-4">Agent Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            {isSyncingRegistry ? (
              <GoogleTableRowSkeleton count={4} vibrant={true} />
            ) : (
            <tbody className="divide-y divide-[#f1f3f4] text-[#202124]">
              {registryItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8fafd] transition-colors">
                  <td className="py-3.5 px-4 font-medium flex items-center gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        item.format === 'PDF'
                          ? 'text-[#c5221f]'
                          : item.format === 'PPTX'
                          ? 'text-[#b06000]'
                          : 'text-[#137333]'
                      }`}
                    >
                      {item.format === 'PDF'
                        ? 'picture_as_pdf'
                        : item.format === 'PPTX'
                        ? 'slideshow'
                        : 'table_chart'}
                    </span>
                    <span className="font-bold text-xs truncate max-w-xs">{item.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        item.format === 'PDF'
                          ? 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]'
                          : item.format === 'PPTX'
                          ? 'bg-[#fef7e0] text-[#b06000] border-[#feefc3]'
                          : 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                      }`}
                    >
                      {item.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#5f6368]">{item.timestamp}</td>
                  <td className="py-3.5 px-4 font-medium text-[#202124]">{item.vectorsGenerated}</td>
                  <td className="py-3.5 px-4">
                    {item.status === 'indexed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-xs font-bold border border-[#ceead6]">
                        <span className="material-symbols-outlined text-[14px]">check</span> Indexed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold border border-[#c2e7ff]">
                        <span className="material-symbols-outlined text-[14px] animate-spin">
                          sync
                        </span>{' '}
                        Processing ({item.progress}%)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setSelectedFileForChunks(item)}
                        className="px-3 py-1 rounded-full text-[#1a73e8] hover:bg-[#e8f0fe] text-xs font-semibold transition-colors"
                      >
                        View Chunks
                      </button>
                      <button
                        onClick={() => setSelectedFileForChunks(item)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            )}
          </table>
        </div>
      </section>

      {/* Vector Chunks Inspector Modal */}
      <ViewChunksModal
        file={selectedFileForChunks}
        onClose={() => setSelectedFileForChunks(null)}
      />

      {/* 30s Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title="Vector Databases 101: HNSW vs KNN"
        onStartCourse={onNavigateToPlayer}
      />
    </div>
  );
};
