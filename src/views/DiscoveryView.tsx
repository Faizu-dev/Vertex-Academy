import React, { useState, useEffect } from 'react';
import { CourseItem } from '../types';
import { TrailerModal } from '../components/TrailerModal';
import { GoogleCardSkeleton, GoogleLoadingIndicator } from '../components/GoogleSkeleton';
import { api } from '../services/api';

interface DiscoveryViewProps {
  onSelectCourse: (courseId: string) => void;
  onOpenIngestionStudio: () => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  onSelectCourse,
  onOpenIngestionStudio,
}) => {
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [searchPrompt, setSearchPrompt] = useState('');
  const [selectedTrailerTitle, setSelectedTrailerTitle] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    api.getCourses()
      .then((data) => {
        if (data && data.length > 0) {
          setCourses(data);
        }
      })
      .catch((err) => console.log('Could not fetch courses from backend', err))
      .finally(() => setIsFetching(false));
  }, []);

  // Curated Courses matching the mockup exactly
  const [courses, setCourses] = useState<CourseItem[]>([
    {
      id: 'crs-vec-101',
      title: 'Advanced Vector Database Architectures: HNSW vs KNN',
      category: 'Vector DBs & Embeddings',
      badge: 'Vector Search • Advanced',
      badgeClass: 'bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]',
      modulesCount: 4,
      duration: 'Est. 2.5 Hours',
      description:
        'Master hierarchical graph indexing, distance metrics, and high-throughput vector querying in production clusters.',
      feature: 'AI Voice Tutor Enabled',
      techStack: 'Pinecone & Milvus',
      instructorName: 'Dr. Kenneth Vance',
      instructorRole: 'Senior Systems Architect',
      instructorInitial: 'K',
      imageSrc:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCNpXbrVClVAefTNZtteK7fNzbD83ETfKM036c5_vYSwp-NY5zkmlgKXAQXKur08NoCWvYUNeOuGVRLw2LcqIGCQRSe0bv7Lqwpy_ZN-SSx7-LhcVx-V5uGkQE-SaJyu9cXpMUrsKQ4pVQLYykS6oW5qMfWKfPXMdqfkEVa-w79EA5-hlAQeQT4WgkKqcRDeK0CSg3siDOkK4U1OF9S9FwqlCpDURaISG2REe6BRd0FaO5fTkVSCeFmHA',
    },
    {
      id: 'crs-rag-201',
      title: 'Building Autonomous Multi-Agent RAG Pipelines',
      category: 'Generative AI & Agentic Systems',
      badge: 'Agentic Systems',
      badgeClass: 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]',
      modulesCount: 6,
      duration: 'Est. 4 Hours',
      description:
        'Orchestrate Gemini 1.5 Pro agents with Firestore audit ledgers, dynamic function calling, and self-evaluating guardrails.',
      feature: 'Voice & Lab Sandboxes',
      techStack: 'Vertex + LangGraph',
      instructorName: 'Elena Rostova',
      instructorRole: 'Lead AI Engineer',
      instructorInitial: 'E',
      imageSrc:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB_N2TtU12PYmFCdvrT1cNHryIUrpOL7q813pEAaY6Lg9iqvKatIT7rKfxv42XL9rhRvhfgIDCmooo9TMxqno1Kxk_4mJDr7ztohdFg7o0d4FxskkPy7cAj7I_Z5SK04kEFm7bAhSfHcEAZEFCJkqQDYiBW7HDqs4zJCc1n_PS2gXK5i7LYfZWFrx1d0i7WaEysed96lX9_vOiOdlZKQYKaLRBwAwKNKdAGTd_XT8c-yaJbX83urxePfQ',
    },
    {
      id: 'crs-tune-301',
      title: 'Fine-Tuning & Quantization for Low-Latency LLMs',
      category: 'Generative AI & Agentic Systems',
      badge: 'Deep Learning',
      badgeClass: 'bg-[#fef7e0] text-[#b06000] border border-[#feefc3]',
      modulesCount: 5,
      duration: 'Est. 3.5 Hours',
      description:
        'Deploy quantized models with AWQ and bitsandbytes on cloud GPU clusters with strict latency SLAs.',
      feature: 'GPU Cluster Included',
      techStack: 'AWQ / 4-Bit GGUF',
      instructorName: 'Marcus Chen',
      instructorRole: 'MLOps Specialist',
      instructorInitial: 'M',
      imageSrc:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArjIv2df--dmVWDB8WJHYMW6gbyiIySxyBjvj9rsoUz6a3AbQV2LcCP_dwDZc9EN_wzLzNGGKMqBO3LK5jO1dkB8p4Se0OyGQF38_xysdWZGz-QdLaRfe0RafjKcXZrW02oN_G4ghIUIgm_JZ3WhZkijihWVQH9cx6vRAhvoMShHpvTa1zwQ0IQxmADzxi7VCka8EmqY03i3rj1CgKrHv3Ay-c5j5qUvOjnrZr81YSOWNOih6F-8y67Q',
    },
    {
      id: 'crs-cloud-401',
      title: 'Distributed Cloud Infrastructure on Vertex AI',
      category: 'Cloud Architecture & Vertex AI',
      badge: 'Cloud Architecture',
      badgeClass: 'bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]',
      modulesCount: 4,
      duration: 'Est. 3 Hours',
      description:
        'Design resilient microservices, auto-scaling inference endpoints, and enterprise VPC security perimeters.',
      feature: 'AI Voice Tutor Enabled',
      techStack: 'Vertex VPCs',
      instructorName: 'Sarah Jenkins',
      instructorRole: 'Principal Cloud Architect',
      instructorInitial: 'S',
      imageSrc:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDQaxR_jE_Uk0gAt_90U2JNnZfu6sVa7wvqZi4Yc77D2J2QuMtxcqoOxRSTNkzCYA3SrwauM3ffRHSoe_KYdlNE5iIye2Sx4pE4Yu9OoGpI1y7KmiWzatpYl__eGV5hP4k9InL05x5JNGO_-Nm5vD0V2uhOpRuowga3_MFQM9Hw59LUBszJ45piCj2krm6msPyTAtAJ9w1pFOM7GIXLNkqmUobOVJZ-ADrBb5NW8hitdgQErwCIXW6klA',
    },
    {
      id: 'crs-py-501',
      title: 'Python for Production AI: Async, Concurrency & Profiling',
      category: 'Hands-on Micro-Labs',
      badge: 'Python & Tooling',
      badgeClass: 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]',
      modulesCount: 3,
      duration: 'Est. 2 Hours',
      description:
        'Optimize high-load asynchronous Python pipelines with uvloop, memory profiling, and vector SIMD instructions.',
      feature: 'Interactive Sandboxes',
      techStack: 'AsyncIO & UV',
      instructorName: 'Alex Mercer',
      instructorRole: 'Technical Instructor',
      instructorInitial: 'A',
      imageSrc:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCqJLVBEluZeI7eW2Ob2rSTINDLTh9q-suWA-Lk7F2wvtUOwCJRZToblEV_KLcX7AL6JuwWffeabTKr8LRItU2RR96l04F9o9sfKkbneON9HtZjJGJpMFBHNo6HVcjYPowc8Oba65xopUfObFVa2FR9emJwhlx2UJt-WF22BMOdk8VbvY6E0owxYp-KcQyyXKRoyujX3Su8egAftF6_yurbFHAj1xl9zuMt58jv8UVW0yuRZPev_bDTDQ',
    },
    {
      id: 'crs-safe-601',
      title: 'Enterprise AI Safety, Guardrails & LLM Red-Teaming',
      category: 'Recommended for You',
      badge: 'AI Safety & Evals',
      badgeClass: 'bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]',
      modulesCount: 5,
      duration: 'Est. 3 Hours',
      description:
        'Implement semantic sanitization, prompt injection detection, and automated adversarial evaluation suites.',
      feature: 'Audit Ledger Integrated',
      techStack: 'LlamaGuard / NeMo',
      instructorName: 'Priya Sharma',
      instructorRole: 'AI Governance Director',
      instructorInitial: 'P',
      imageSrc:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCtkJYDxLWgk5XNglnCmXBNdBpcC2Uwqe7hsp2O3FPSKPc6kTQjYP0nVqSpyob6_v7IiWuC4AEiOuesnyUi9N1v8xS4QsLegmE6Rfx1nP4qbzDkAD7cSJtJmS2VfLATo80q190buTKXZkZaEF41eq7YS-2JVM3MzcEAtlCzuOS9i5tvqKaRYZIKyCtQFlYbVV4Li_DIf3wm5Lf-Abxbg6RR7rEWg0f132TP6gZyVCS-eQkmL0IisdFHWw',
    },
  ]);

  const handleSynthesizePath = () => {
    if (!searchPrompt.trim()) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      const newCourse: CourseItem = {
        id: `synth-${Date.now()}`,
        title: `Autonomous Curriculum: ${searchPrompt}`,
        category: 'Recommended for You',
        badge: 'Gemini Agent Synthesized',
        badgeClass: 'bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]',
        modulesCount: 5,
        duration: 'Est. 3.0 Hours',
        description: `Custom-generated curriculum focused on ${searchPrompt} with interactive code sandbox, audio companion, and oral exam.`,
        feature: 'Voice Companion + Lab',
        techStack: 'Python 3.11 + Gemini 1.5',
        instructorName: 'Gemini Autonomous Curriculum Agent',
        instructorRole: 'Pedagogical Lead',
        instructorInitial: 'G',
        imageSrc:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAwlUk-eu0qm1g-oSdr4WTsGNU8tvEXuO1Gy_xslazyN0atUo7KeW5HlFZLEZHzstbiU-ooPBZSsjOPdwDGf2spNiZwSi2tL_rG53Ay8-g8pIjfHnudurI8X9aEGHZMvad-Z-09cFdPeOck5CBpINXEmgtIkg-uLQhjvNB4os1xRtb-IblWbHeHxGUvdP12k9AJf0DBB-lhD_U1qjUmd5DrXUxQLeEhRs4-LDYK68A3fTFk1irYfjZo7A',
      };
      setCourses([newCourse, ...courses]);
      setSearchPrompt('');
    }, 1500);
  };

  const filteredCourses =
    activeCategory === 'All Courses'
      ? courses
      : courses.filter((c) => c.category === activeCategory || c.badge.includes(activeCategory));
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1560px] mx-auto space-y-8">
      {/* Hero / Title & Intelligent Synthesis Prompt Engine */}
      <section className="space-y-6">
        {/* Gemini Aurora Header Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 text-white shadow-lg bg-gradient-to-r from-[#1a73e8] via-[#7C3AED] via-[#D96570] to-[#FBBC04]">
          <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl"></div>
          <div className="pointer-events-none absolute left-1/3 -bottom-20 h-64 w-64 rounded-full bg-[#FBBC04]/20 blur-2xl"></div>

          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-[#FBBC04]">auto_awesome</span>
              <span className="text-xs tracking-wider uppercase font-bold">
                Vertex Academy • Adaptive Curriculums
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Explore Courses & Intelligent Learning Paths
            </h1>
            <p className="text-sm lg:text-base text-white/90 max-w-3xl leading-relaxed">
              Browse AI-synthesized curriculums with live Gemini voice companions, interactive code
              sandboxes, and instant 30-second video trailers.
            </p>
          </div>
        </div>

        {/* AI Prompt Bar & Command Input Container */}
        <div className="relative glass-card rounded-2xl shadow-sm p-3 focus-within:shadow-md transition-all border border-[#c2e7ff]/80">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex items-center gap-3 pl-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285F4] to-[#7C3AED] flex items-center justify-center text-white shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="Ask Gemini to synthesize a custom path (e.g., 'HNSW graph indexing in Python with Pinecone lab')..."
                className="w-full bg-transparent border-0 outline-none text-xs md:text-sm text-[#1f1f1f] placeholder:text-[#5f6368] py-2"
              />
            </div>
            <div className="flex items-center justify-end gap-2 shrink-0 pr-1">
              <button
                type="button"
                className="h-10 w-10 rounded-full bg-[#f1f3f4] hover:bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center transition-colors"
                title="Voice Query"
              >
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              <button
                type="button"
                onClick={handleSynthesizePath}
                disabled={isSynthesizing}
                className="h-10 px-6 rounded-full bg-gradient-to-r from-[#1a73e8] to-[#4285F4] hover:from-[#1557b0] hover:to-[#1a73e8] text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${isSynthesizing ? 'animate-spin' : ''}`}>
                  {isSynthesizing ? 'sync' : 'auto_awesome'}
                </span>
                <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Path'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            'All Courses',
            'Vector DBs & Embeddings',
            'Generative AI & Agentic Systems',
            'Cloud Architecture & Vertex AI',
            'Recommended for You',
            'Hands-on Micro-Labs',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setIsFetching(true);
                setTimeout(() => setIsFetching(false), 650);
              }}
              className={`shrink-0 h-9 px-4 rounded-full text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all ${
                activeCategory === cat
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'bg-white hover:bg-[#e8f0fe]/60 text-[#414754] border border-[#dadce0]'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Gemini Personalized Recommendation Banner */}
      <section className="relative overflow-hidden rounded-3xl p-6 lg:p-7 glass-card border-l-4 border-l-[#4285F4]">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#1a73e8] via-[#7C3AED] to-[#34A853] flex items-center justify-center shrink-0 shadow-sm text-white">
              <span className="material-symbols-outlined text-[26px]">neurology</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[10px] font-bold tracking-wider uppercase border border-[#c2e7ff]">
                  Gemini Personalized Recommendation
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#34A853]"></span>
                <span className="text-[11px] font-medium text-[#137333]">
                  98% Pedagogical Match
                </span>
              </div>
              <h2 className="text-base lg:text-lg font-bold text-[#1f1f1f] leading-snug">
                Based on your completed modules in Python & Vector DBs, we recommend “Building Multi-Agent RAG Pipelines with Vertex AI”
              </h2>
              <p className="text-xs text-[#5f6368]">
                Learners in your cohort achieved 94% retention on agent orchestration. Includes 4 auto-generated micro-labs and interactive execution tracing.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setSelectedTrailerTitle('Building Multi-Agent RAG Pipelines with Vertex AI')}
              className="h-10 px-4 rounded-full bg-white hover:bg-[#f8fafd] text-[#1a73e8] text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all border border-[#dadce0]"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Preview 30s Teaser</span>
            </button>
            <button
              onClick={() => onSelectCourse('crs-rag-201')}
              className="h-10 px-5 rounded-full bg-[#1a73e8] text-white hover:bg-[#1557b0] text-xs font-semibold flex items-center gap-2 shadow-xs hover:shadow transition-all"
            >
              <span>Start Learning Now</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Course Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1f1f1f] flex items-center gap-2">
            <span>Curated AI Engineering Curriculums</span>
            <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
          </h2>
          <p className="text-xs text-[#5f6368]">
            Production-grade courses synthesized and verified by Google Cloud instructional agents
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsFetching(true);
              setTimeout(() => setIsFetching(false), 1200);
            }}
            disabled={isFetching}
            className="h-8 px-3 rounded-full bg-white hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
            title="Fetch latest course modules from Vertex AI"
          >
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] google-dot-pulse"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] google-dot-pulse" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] google-dot-pulse" style={{ animationDelay: '300ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] google-dot-pulse" style={{ animationDelay: '450ms' }}></span>
            </div>
            <span>{isFetching ? 'Fetching from Vertex AI...' : 'Fetch Modules'}</span>
          </button>
          <div className="text-xs text-[#5f6368] font-medium hidden sm:block">
            <span>Showing {filteredCourses.length} of {courses.length} Modules</span>
          </div>
        </div>
      </div>

      {/* Course Grid or Google Skeleton Loading State */}
      {isFetching ? (
        <div className="space-y-4">
          <GoogleLoadingIndicator message="Fetching adaptive curriculums from Vertex AI..." />
          <GoogleCardSkeleton count={filteredCourses.length || 6} vibrant={true} />
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
          <article
            key={course.id}
            className="glass-card glass-card-hover rounded-3xl transition-all flex flex-col group overflow-hidden border border-[#e3e8f5]"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-48 overflow-hidden bg-[#f1f3f4]">
              <img
                src={course.imageSrc}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${course.badgeClass}`}>
                  {course.badge}
                </span>
              </div>
              <button
                onClick={() => setSelectedTrailerTitle(course.title)}
                className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 shadow-xs hover:bg-black transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] text-[#34A853]">play_arrow</span>
                <span>30s Preview</span>
              </button>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#5f6368]">
                  <span className="material-symbols-outlined text-[15px] text-[#1a73e8]">menu_book</span>
                  <span>{course.modulesCount} Modules</span>
                  <span>•</span>
                  <span className="material-symbols-outlined text-[15px] text-[#FBBC04]">schedule</span>
                  <span>{course.duration}</span>
                </div>
                <h3 className="font-bold text-sm text-[#1f1f1f] group-hover:text-[#1a73e8] transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-[#5f6368] line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Feature & Author Stack */}
              <div className="space-y-3 pt-2 border-t border-[#e3e8f5]/60">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#137333] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                    <span>{course.feature}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#f1f3f4] text-[#5f6368] text-[11px] font-medium">
                    {course.techStack}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] text-xs font-bold shrink-0 border border-[#c2e7ff]">
                    {course.instructorInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1f1f1f] truncate">{course.instructorName}</p>
                    <p className="text-[11px] text-[#5f6368] truncate">{course.instructorRole}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setSelectedTrailerTitle(course.title)}
                    className="h-9 px-3 rounded-full bg-[#f8fafd] hover:bg-[#e8f0fe] text-[#1a73e8] text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-[#c2e7ff]"
                  >
                    <span className="material-symbols-outlined text-[16px]">movie</span>
                    <span>Trailer</span>
                  </button>
                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="h-9 px-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs transition-colors"
                  >
                    <span>Enroll Now</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
      )}

      {/* Bottom Learning Pathway CTA Banner */}
      <section className="relative rounded-3xl glass-card p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden border border-[#e3e8f5]">
        <div className="flex items-start gap-5 max-w-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1a73e8] to-[#4285F4] flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[32px]">auto_stories</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#1f1f1f]">Can’t find your exact curriculum?</h3>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Vertex Academy can parse your company’s internal architectural PDFs, code repositories, or lecture videos and synthesize an interactive 5-module course in minutes.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <button
            onClick={onOpenIngestionStudio}
            className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-sm hover:shadow transition-all w-full md:w-auto"
          >
            <span>Open Content Ingestion Studio</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* 30s Video Trailer Modal */}
      <TrailerModal
        isOpen={Boolean(selectedTrailerTitle)}
        onClose={() => setSelectedTrailerTitle(null)}
        title={selectedTrailerTitle || 'Course Trailer'}
        onStartCourse={() => onSelectCourse('crs-vec-101')}
      />
    </div>
  );
};
