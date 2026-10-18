import React, { useState } from 'react';
import { ThreeAvatar } from '../components/ThreeAvatar';
import { NotesDrawer } from '../components/NotesDrawer';
import { CodeSandboxModal } from '../components/CodeSandboxModal';
import { GoogleTextSkeleton, GoogleLoadingIndicator } from '../components/GoogleSkeleton';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

interface LearningPlayerViewProps {
  onBackToCourses?: () => void;
  onNavigateToOralDefense?: () => void;
}

export const LearningPlayerView: React.FC<LearningPlayerViewProps> = ({
  onBackToCourses,
  onNavigateToOralDefense,
}) => {
  // Interactive state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState('2.1');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [isSubHeaderVisible, setIsSubHeaderVisible] = useState(true);


  // Avatar state
  const [isMuted, setIsMuted] = useState(false);
  const [personality, setPersonality] = useState<'Socratic' | 'Concise' | 'Academic'>('Socratic');
  const [dialogueMessages, setDialogueMessages] = useState<
    { sender: 'student' | 'tutor'; text: string; time: string }[]
  >([
    {
      sender: 'student',
      text: 'Can you explain the difference again between cosine distance and Euclidean distance when vectors are normalized?',
      time: '1 min ago',
    },
    {
      sender: 'tutor',
      text: 'Certainly, Alex! When vectors are normalized to unit length, Euclidean distance squared is directly proportional to 2 minus 2 times the cosine similarity. So ranking nearest neighbors by cosine similarity yields identical results to Euclidean distance, but avoids costly square root computations!',
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(true);

  // Micro-Quiz Question 2 state
  const [q2Answer, setQ2Answer] = useState<string>('');
  const [q2Submitted, setQ2Submitted] = useState<boolean>(false);
  const [q2IsCorrect, setQ2IsCorrect] = useState<boolean>(false);

  // Concept Map zoom state
  const [conceptZoom, setConceptZoom] = useState(1);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg = { sender: 'student' as const, text: userText, time: 'Just now' };
    setDialogueMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    setIsAvatarSpeaking(true);

    let accumulatedText = '';
    let hasAddedTutor = false;

    try {
      await api.streamTutorChat(
        userText,
        (chunk) => {
          accumulatedText += chunk;
          if (!hasAddedTutor) {
            hasAddedTutor = true;
            setDialogueMessages((prev) => [
              ...prev,
              { sender: 'tutor' as const, text: accumulatedText, time: 'Just now' },
            ]);
          } else {
            setDialogueMessages((prev) =>
              prev.map((msg, i) =>
                i === prev.length - 1 ? { ...msg, text: accumulatedText } : msg
              )
            );
          }
        },
        () => {
          setIsAvatarSpeaking(false);
        },
        personality,
        activeLesson
      );
      return;
    } catch (err) {
      console.warn('Streaming error, falling back', err);
    }

    // Graceful fallback
    let reply =
      "Excellent question! In HNSW graphs, the efSearch parameter sets the size of the dynamic candidate list during query time. Higher values yield higher recall with logarithmic latency tradeoffs.";
    if (userText.toLowerCase().includes('python') || userText.toLowerCase().includes('code')) {
      reply =
        "I've initialized the Python Sandbox with the cosine vs L2 test matrix for you. Click 'Run Python Benchmark' to see the 224x speedup!";
    } else if (userText.toLowerCase().includes('oral') || userText.toLowerCase().includes('defense') || userText.toLowerCase().includes('exam')) {
      reply =
        "You've mastered Module 2! You can now take the Gemini Live S2S Oral Defense to certify your credentials.";
    }
    setDialogueMessages((prev) => [
      ...prev,
      { sender: 'tutor' as const, text: reply, time: 'Just now' },
    ]);
    setIsAvatarSpeaking(false);
  };

  const handleQuizSubmit = () => {
    if (!q2Answer) return;
    setQ2Submitted(true);
    const correct = q2Answer === 'opt-1';
    setQ2IsCorrect(correct);
    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCopyCode = () => {
    const code = `import hnswlib\nimport numpy as np\n\ndim = 1536\nnum_elements = 250_000\n\np = hnswlib.Index(space='cosine', dim=dim)\np.init_index(max_elements=num_elements, ef_construction=200, M=16)\np.set_ef(64)\nlabels, distances = p.knn_query(query_vector, k=5)`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Learner Sub-Header / App Bar (collapsible) */}
      {isSubHeaderVisible ? (
        <section className="glass-card shadow-sm z-30 sticky top-[67px] px-4 sm:px-6 lg:px-8 py-3 border-b border-[#e3e8f5] animate-in fade-in duration-200">
          <div className="max-w-[1680px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Navigation & Course Context */}
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                onClick={onBackToCourses}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#1a73e8] border border-[#dadce0] transition-all shadow-2xs shrink-0"
                title="Back to Courses"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm sm:text-base text-[#1f1f1f] truncate">
                    Vector Databases 101: HNSW vs KNN
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-bold border border-[#c2e7ff]">
                    Module 2
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] text-[11px] font-bold border border-[#feefc3] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                    3D Tutor Active
                  </span>
                </div>
                <span className="text-[11px] text-[#5f6368] truncate">
                  Instructor: Dr. K. Vance • High-Dimensional Geometry
                </span>
              </div>
            </div>

            {/* Center: Progress Indicator */}
            <div className="flex items-center gap-3 bg-white/90 border border-[#dadce0] px-3.5 py-1.5 rounded-full shadow-2xs shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                  <span className="text-[#1f1f1f]">Module 2/5</span>
                  <span className="text-[#1a73e8]">40%</span>
                </div>
                <div className="w-28 sm:w-36 h-1.5 bg-[#e8eaed] rounded-full overflow-hidden mt-0.5">
                  <div className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#5f6368] pl-2 border-l border-[#dadce0] text-xs">
                <span className="material-symbols-outlined text-[15px] text-[#34A853]">schedule</span>
                <span>18m left</span>
              </div>
            </div>

            {/* Right: Action Bar & Hide Bar Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsSandboxOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f0fe] border border-[#c2e7ff] text-[#1a73e8] hover:bg-[#d2e3fc] transition-all text-xs font-semibold shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                <span>Python Lab</span>
              </button>
              <button
                onClick={() => setIsNotesOpen(true)}
                className="relative inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#dadce0] text-[#1f1f1f] hover:bg-[#f1f3f4] transition-all text-xs font-medium shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Notes</span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-[9px] font-bold">
                  3
                </span>
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                aria-label="Bookmark Lesson"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isBookmarked ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]' : 'text-[#5f6368] hover:bg-[#f1f3f4] border border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isBookmarked ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>

              {/* Hide bar toggle button */}
              <button
                onClick={() => setIsSubHeaderVisible(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#fce8e6] hover:text-[#c5221f] transition-colors ml-1 border border-transparent hover:border-[#fad2cf]"
                title="Hide this bar to maximize screen area"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Floating pill to restore bar */
        <div className="max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex justify-end">
          <button
            onClick={() => setIsSubHeaderVisible(true)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-2xs border border-[#dadce0] text-[#5f6368] hover:text-[#1a73e8] hover:border-[#4285F4] flex items-center gap-1.5 transition-all"
            title="Restore course outline header bar"
          >
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>Show Course Bar</span>
          </button>
        </div>
      )}

      {/* Main Learning Workspace */}
      <main className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: Syllabus & Module Navigation (3 cols) */}
          <aside className="lg:col-span-3 min-w-0 space-y-4">
            {/* Syllabus Container Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e3e2e6]/50 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e3e2e6]/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005bbf] text-[20px]">
                    menu_book
                  </span>
                  <span className="font-semibold text-sm text-[#1a1b1e]">Course Outline</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Search Syllabus"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#727785] hover:bg-[#f4f3f7]"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                  </button>
                </div>
              </div>

              {/* Module 1 */}
              <div className="rounded-xl bg-[#f4f3f7] p-2.5">
                <div className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-[#1a1b1e] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006d3a] text-[16px]">
                      check_circle
                    </span>
                    Module 1: Foundations
                  </span>
                  <span className="text-xs text-[#006d3a] font-bold">3/3</span>
                </div>
              </div>

              {/* Module 2: Active Module */}
              <div className="rounded-xl bg-white space-y-1">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#efedf1] text-xs font-semibold text-[#1a1b1e]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#005bbf] text-[18px]">
                      account_tree
                    </span>
                    <span>Module 2: Indexing Algorithms</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#727785]">
                    expand_more
                  </span>
                </div>

                {/* Lessons Sub-list */}
                <div className="space-y-1 pt-1 pl-1.5">
                  {/* Active Lesson 2.1 */}
                  <div
                    onClick={() => setActiveLesson('2.1')}
                    className={`relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                      activeLesson === '2.1'
                        ? 'bg-[#d8e2ff]/50'
                        : 'hover:bg-[#f4f3f7] text-[#414754]'
                    }`}
                  >
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#005bbf] rounded-r"></div>
                    <div className="flex flex-col pl-2 min-w-0">
                      <span className="text-xs font-semibold text-[#004493] truncate">
                        2.1 Understanding Indexes
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-[#005bbf] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#005bbf] animate-ping"></span>
                          Now Playing
                        </span>
                        <span className="text-[11px] text-[#727785]">6 min</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#005bbf] text-[18px]">
                      volume_up
                    </span>
                  </div>

                  {/* Lesson 2.2 */}
                  <div
                    onClick={() => setActiveLesson('2.2')}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                      activeLesson === '2.2'
                        ? 'bg-[#d8e2ff]/40 text-[#004493] font-semibold'
                        : 'hover:bg-[#f4f3f7] text-[#414754]'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-[#1a1b1e] truncate">2.2 HNSW Graphs</span>
                      <span className="text-[11px] text-[#727785]">12 min • Deep dive</span>
                    </div>
                    <span className="material-symbols-outlined text-[#727785] text-[18px]">
                      play_circle
                    </span>
                  </div>

                  {/* Lesson 2.3 */}
                  <div
                    onClick={() => setActiveLesson('2.3')}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                      activeLesson === '2.3'
                        ? 'bg-[#d8e2ff]/40 text-[#004493] font-semibold'
                        : 'hover:bg-[#f4f3f7] text-[#414754]'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-[#1a1b1e] truncate">2.3 Exact vs Approx KNN</span>
                      <span className="text-[11px] text-[#727785]">8 min • Micro-lab</span>
                    </div>
                    <span className="material-symbols-outlined text-[#727785] text-[18px]">
                      play_circle
                    </span>
                  </div>

                  {/* Lesson 2.4 Locked */}
                  <div className="flex items-center justify-between p-2 rounded-lg text-[#727785] opacity-60">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs truncate">2.4 Product Quantization (PQ)</span>
                      <span className="text-[11px]">Locked (Requires Quiz)</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                  </div>
                </div>
              </div>

              {/* Module 3 & 4 Upcoming */}
              <div className="rounded-xl bg-[#f4f3f7] p-2.5 flex items-center justify-between text-[#414754] text-xs">
                <span>Module 3: Distance Metrics</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
              <div className="rounded-xl bg-[#f4f3f7] p-2.5 flex items-center justify-between text-[#414754] text-xs">
                <span>Module 4: Latency Profiling</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </div>

            {/* Retention Widget */}
            <div className="bg-gradient-to-br from-white to-[#f4f3f7] rounded-2xl p-4 shadow-sm border border-[#e3e2e6]/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#82faab] flex items-center justify-center text-[#00522b]">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                </div>
                <div>
                  <span className="text-xs text-[#1a1b1e] font-semibold block leading-tight">
                    Course Mastery
                  </span>
                  <span className="text-[11px] text-[#006d3a] font-bold">
                    78% Retention Predicted
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#414754] mb-3 leading-relaxed">
                AI Tutor recommends taking the Micro-Quiz below to reinforce HNSW routing before
                proceeding to Oral Defense.
              </p>
              <div className="w-full bg-[#e3e2e6] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#006d3a] h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            {/* Instructor Profile Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e3e2e6]/50 flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full object-cover shrink-0"
                alt="Dr. Kenneth Vance"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYj5vRfv9rTv0auMuZtgFKtgKkLuCbnX_aqQ1-EBOGYxCx6WSp3YdzuZ2cuSHbmha-agZMfhKFHuJv3YykFzHzDL7Cg-3jYxCXnrM5aOAiyEw4rNa5eS91ijoF3jIPHTfRKCwl49qmkEEJpARffrpBf-iJfaibvcOqhgSmCsBbkv4XHJO7Wg2soRLzFsFh6pZTBbmlMe-6-Q9g6eswUZXedNsUsOHzPzj909E-cHYeyYQHtv2UOAoHsw"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#1a1b1e] truncate">Dr. Kenneth Vance</span>
                <span className="text-[11px] text-[#414754] truncate">Senior Vector Systems Architect</span>
              </div>
            </div>
          </aside>

          {/* CENTER VIEW: Theory, Concept Map & Micro-Quiz (5 cols on xl) */}
          <section className="lg:col-span-5 xl:col-span-5 min-w-0 space-y-6">
            {/* TOP LESSON ARTICLE CARD */}
            <article className="bg-white rounded-2xl shadow-sm border border-[#e3e2e6]/50 p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d8e2ff] text-[#004493] text-[11px] font-semibold">
                    Core Theory
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#7ff8a8] text-[#00723d] text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                    Gemini Multimodal Summary
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#efedf1] text-[#414754] text-[11px] flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[13px]">graphic_eq</span>
                    Audio Synced
                  </span>
                  <button
                    onClick={() => {
                      setIsGeneratingExplanation(true);
                      setTimeout(() => setIsGeneratingExplanation(false), 1000);
                    }}
                    disabled={isGeneratingExplanation}
                    className="ml-auto px-2.5 py-0.5 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] text-[11px] font-semibold flex items-center gap-1 border border-[#c2e7ff] transition-all"
                    title="Regenerate theory explanation with Gemini"
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] google-dot-pulse"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] google-dot-pulse" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] google-dot-pulse" style={{ animationDelay: '300ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] google-dot-pulse" style={{ animationDelay: '450ms' }}></span>
                    </div>
                    <span>{isGeneratingExplanation ? 'Regenerating...' : 'Regenerate'}</span>
                  </button>
                </div>
                <h1 className="text-xl font-bold text-[#1a1b1e] mt-1">
                  2.1 Understanding Vector Indexes: Navigable Graphs & Hierarchies
                </h1>
              </div>

              {isGeneratingExplanation ? (
                <div className="py-2 space-y-3">
                  <GoogleLoadingIndicator message="Synthesizing personalized pedagogy with Gemini..." size="sm" />
                  <GoogleTextSkeleton lines={5} className="py-2" />
                </div>
              ) : (
                <div className="space-y-3 text-sm text-[#414754] leading-relaxed">
                  <p>
                    In production machine learning pipelines, embedding models convert unstructured
                    modalities—such as natural language queries, audio spectrograms, and dense vision
                    tokens—into coordinates within high-dimensional vector spaces (R^D, where D in
                    [768, 3072]). Locating the closest semantic neighbor requires measuring vector
                    divergence via Euclidean distance (L2) or Cosine similarity.
                  </p>
                  <p>
                    A naive, exhaustive brute-force search (<code className="px-1.5 py-0.5 rounded bg-[#efedf1] text-[#1a1b1e] font-mono text-xs font-semibold">Exact Flat KNN</code>)
                    computes pairwise distance queries across all stored points. While 100% accurate,
                    its linear time complexity of <span className="font-mono font-medium text-[#1a1b1e]">O(N · D)</span> collapses throughput once N scales into millions of document chunks.
                  </p>
                </div>
              )}

              {/* Pedagogical Principle Callout Box */}
              <div className="bg-[#d8e2ff]/25 rounded-xl p-4 flex items-start gap-3 border border-[#adc7ff]/40">
                <div className="w-8 h-8 rounded-full bg-[#005bbf] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#004493]">
                    Key Pedagogical Principle
                  </span>
                  <p className="text-xs text-[#1a1b1e] leading-relaxed">
                    To overcome the curse of dimensionality, <strong>HNSW (Hierarchical Navigable Small World)</strong> constructs multi-layered graphs inspired by probabilistic skip-lists. Searches traverse long-range skip vectors at upper sparse layers before descending to dense local clusters—slashing lookups to <span className="font-mono text-[#005bbf] font-bold">O(log N)</span> latency.
                  </p>
                </div>
              </div>
            </article>

            {/* MIDDLE SECTION: AI Generated Concept Map */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#e3e2e6]/50 p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#e3e2e6]/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005bbf] text-[20px]">hub</span>
                    <span className="font-semibold text-sm text-[#1a1b1e]">
                      AI Concept Map: HNSW Layer Hierarchy
                    </span>
                  </div>
                  <span className="text-[11px] text-[#727785] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px] text-[#805600]">
                      psychology
                    </span>
                    Synthesized via Gemini 1.5 Vector Reasoning Engine
                  </span>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <div className="flex items-center bg-[#f4f3f7] rounded-full px-1 py-0.5">
                    <button
                      onClick={() => setConceptZoom((z) => Math.min(z + 0.1, 1.4))}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#414754] hover:bg-[#efedf1]"
                      title="Zoom In"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                    <button
                      onClick={() => setConceptZoom((z) => Math.max(z - 0.1, 0.8))}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#414754] hover:bg-[#efedf1]"
                      title="Zoom Out"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <button
                      onClick={() => setConceptZoom(1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#414754] hover:bg-[#efedf1]"
                      title="Reset View"
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setIsSandboxOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#efedf1] text-[#1a1b1e] text-xs font-medium hover:bg-[#e3e2e6] transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">terminal</span>
                    Code
                  </button>
                </div>
              </div>

              {/* Dynamic SVG Architecture Schematic */}
              <div className="relative w-full rounded-xl bg-[#f4f3f7] p-4 overflow-hidden flex flex-col items-center">
                {/* Inspection Pill Overlay */}
                <div className="self-start mb-2 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                  <span className="font-mono text-xs text-[#1a1b1e] font-medium">
                    Query Vector: q = [0.82, -0.41, 0.19, +0.64]
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#efedf1] text-[#414754] text-[10px] font-bold">
                    k=3
                  </span>
                </div>

                {/* Vector Diagram Canvas */}
                <div
                  className="w-full max-w-full overflow-x-auto transition-transform duration-200"
                  style={{ transform: `scale(${conceptZoom})`, transformOrigin: 'top center' }}
                >
                  <svg className="w-full h-auto" viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="layer2Grad" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="#005bbf" stopOpacity="0.15"></stop>
                        <stop offset="100%" stopColor="#1a73e8" stopOpacity="0.05"></stop>
                      </linearGradient>
                      <linearGradient id="layer1Grad" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="#006d3a" stopOpacity="0.12"></stop>
                        <stop offset="100%" stopColor="#7ff8a8" stopOpacity="0.05"></stop>
                      </linearGradient>
                      <linearGradient id="layer0Grad" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="#805600" stopOpacity="0.12"></stop>
                        <stop offset="100%" stopColor="#ffddb0" stopOpacity="0.05"></stop>
                      </linearGradient>
                      <marker id="arrow" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="5" refY="5" viewBox="0 0 10 10">
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ba1a1a"></path>
                      </marker>
                    </defs>

                    {/* Layer 2 */}
                    <rect fill="url(#layer2Grad)" height="60" rx="8" width="620" x="40" y="20"></rect>
                    <text fill="#005bbf" fontSize="12" fontWeight="700" x="55" y="42">
                      LAYER 2 (Expressway Graph - High Skip Radius)
                    </text>
                    <line stroke="#adc7ff" strokeDasharray="4,4" strokeWidth="2" x1="160" x2="360" y1="55" y2="55"></line>
                    <line stroke="#adc7ff" strokeDasharray="4,4" strokeWidth="2" x1="360" x2="560" y1="55" y2="55"></line>
                    <circle cx="160" cy="55" fill="#005bbf" r="9"></circle>
                    <text fill="#ffffff" fontSize="9" fontWeight="bold" x="156" y="58">v0</text>
                    <circle cx="360" cy="55" fill="#005bbf" r="9"></circle>
                    <text fill="#ffffff" fontSize="9" fontWeight="bold" x="356" y="58">v3</text>
                    <circle cx="560" cy="55" fill="#005bbf" r="9"></circle>
                    <text fill="#ffffff" fontSize="9" fontWeight="bold" x="556" y="58">v7</text>
                    <path d="M 360 64 L 360 115" markerEnd="url(#arrow)" stroke="#ba1a1a" strokeDasharray="3,3" strokeWidth="2"></path>

                    {/* Layer 1 */}
                    <rect fill="url(#layer1Grad)" height="65" rx="8" width="620" x="40" y="105"></rect>
                    <text fill="#006d3a" fontSize="12" fontWeight="700" x="55" y="125">
                      LAYER 1 (Intermediate Routing Graph)
                    </text>
                    <line stroke="#7ff8a8" strokeWidth="2" x1="160" x2="260" y1="145" y2="145"></line>
                    <line stroke="#7ff8a8" strokeWidth="2" x1="260" x2="360" y1="145" y2="145"></line>
                    <line stroke="#7ff8a8" strokeWidth="2" x1="360" x2="480" y1="145" y2="145"></line>
                    <line stroke="#7ff8a8" strokeWidth="2" x1="480" x2="560" y1="145" y2="145"></line>
                    <circle cx="160" cy="145" fill="#006d3a" r="8"></circle>
                    <circle cx="260" cy="145" fill="#006d3a" r="8"></circle>
                    <circle cx="360" cy="145" fill="#ba1a1a" r="9"></circle>
                    <circle cx="480" cy="145" fill="#006d3a" r="8"></circle>
                    <circle cx="560" cy="145" fill="#006d3a" r="8"></circle>
                    <path d="M 480 154 L 480 205" markerEnd="url(#arrow)" stroke="#ba1a1a" strokeDasharray="3,3" strokeWidth="2"></path>

                    {/* Layer 0 */}
                    <rect fill="url(#layer0Grad)" height="75" rx="8" width="620" x="40" y="195"></rect>
                    <text fill="#805600" fontSize="12" fontWeight="700" x="55" y="215">
                      LAYER 0 (Dense Vector Neighborhood Ground Truth)
                    </text>
                    <line stroke="#ffba45" strokeWidth="1.5" x1="120" x2="160" y1="245" y2="245"></line>
                    <line stroke="#ffba45" strokeWidth="1.5" x1="160" x2="210" y1="245" y2="245"></line>
                    <line stroke="#ffba45" strokeWidth="1.5" x1="210" x2="260" y1="245" y2="245"></line>
                    <line stroke="#ffba45" strokeWidth="1.5" x1="260" x2="310" y1="245" y2="245"></line>
                    <line stroke="#ffba45" strokeWidth="1.5" x1="310" x2="360" y1="245" y2="245"></line>
                    <line stroke="#ffba45" strokeWidth="1.5" x1="360" x2="420" y1="245" y2="245"></line>
                    <line stroke="#ba1a1a" strokeWidth="2" x1="420" x2="480" y1="245" y2="245"></line>
                    <line stroke="#ba1a1a" strokeWidth="2" x1="480" x2="520" y1="245" y2="245"></line>
                    <circle cx="120" cy="245" fill="#a06d00" r="7"></circle>
                    <circle cx="160" cy="245" fill="#a06d00" r="7"></circle>
                    <circle cx="210" cy="245" fill="#a06d00" r="7"></circle>
                    <circle cx="260" cy="245" fill="#a06d00" r="7"></circle>
                    <circle cx="310" cy="245" fill="#a06d00" r="7"></circle>
                    <circle cx="360" cy="245" fill="#a06d00" r="7"></circle>
                    <circle cx="420" cy="245" fill="#a06d00" r="7"></circle>
                    <circle cx="480" cy="245" fill="#ba1a1a" r="9"></circle>
                    <circle cx="520" cy="245" fill="#006d3a" r="10" stroke="#7ff8a8" strokeWidth="2"></circle>
                    <text fill="#ffffff" fontSize="9" fontWeight="bold" x="515" y="248">NN</text>
                    <circle cx="560" cy="245" fill="#a06d00" r="7"></circle>
                    <circle cx="610" cy="245" fill="#a06d00" r="7"></circle>
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-[#c1c6d6]/20 w-full text-[#414754] text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#005bbf]"></span> Layer 2 Entry
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006d3a]"></span> Intermediate Hops
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span> Greedy Ray
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7ff8a8] border border-[#006d3a]"></span> Converged NN (k=1)
                  </span>
                </div>
              </div>
            </section>

            {/* BOTTOM SECTION: Interactive Micro-Quiz */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#e3e2e6]/50 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006d3a] text-[22px]">quiz</span>
                  <h2 className="text-base font-semibold text-[#1a1b1e]">Interactive Micro-Quiz</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#7ff8a8] text-[#00723d] text-xs font-semibold">
                  Instant Knowledge Check • Adaptive Difficulty
                </span>
              </div>

              {/* Question 1: Answered */}
              <div className="rounded-xl bg-[#f4f3f7] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-[#1a1b1e]">
                    1. Why does HNSW exhibit logarithmic search time complexity O(log N) compared to brute-force KNN O(N)?
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#82faab] text-[#00522b] text-[11px] font-bold shrink-0">
                    Correct +20 pts
                  </span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex flex-col p-3 rounded-lg bg-white shadow-xs border border-[#7ff8a8]">
                    <div className="flex items-center justify-between text-[#006d3a]">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <span className="w-5 font-bold">B</span>
                        <span>
                          It constructs multi-layer hierarchical skip-list graphs where upper layers act as expressways.
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#efedf1] text-[11px] text-[#414754] flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[#006d3a] text-[15px] shrink-0 mt-0.5">
                        verified
                      </span>
                      <span>
                        <strong>Gemini Tutor Feedback:</strong> Spot on! Similar to a skip-list, HNSW skips massive non-relevant vector volumes at Layer 2 before pinpointing neighbors at Layer 0.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 2: Interactive */}
              <div className="rounded-xl bg-[#f4f3f7] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-[#1a1b1e]">
                    2. When would you prefer exact Flat L2 (KNN) search over HNSW indexing in production?
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                    q2Submitted
                      ? q2IsCorrect
                        ? 'bg-[#82faab] text-[#00522b]'
                        : 'bg-[#ffdad6] text-[#93000a]'
                      : 'bg-[#efedf1] text-[#414754]'
                  }`}>
                    {q2Submitted ? (q2IsCorrect ? 'Correct +20 pts' : 'Review Concept') : 'Pending'}
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      id: 'opt-1',
                      text: 'When the dataset size is small (< 10,000 vectors) and 100% precision recall is strictly required.',
                    },
                    {
                      id: 'opt-2',
                      text: 'When memory usage must be minimized on billion-scale clusters.',
                    },
                    {
                      id: 'opt-3',
                      text: 'When queries contain multi-modal audio and video tokens simultaneously.',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border ${
                        q2Answer === opt.id
                          ? 'bg-[#d8e2ff]/30 border-[#005bbf]'
                          : 'bg-white border-[#e3e2e6]/50 hover:bg-[#efedf1]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q2"
                        value={opt.id}
                        checked={q2Answer === opt.id}
                        onChange={() => setQ2Answer(opt.id)}
                        disabled={q2Submitted}
                        className="w-4 h-4 text-[#005bbf] focus:ring-[#005bbf]"
                      />
                      <span className="text-xs text-[#1a1b1e]">{opt.text}</span>
                    </label>
                  ))}
                </div>

                {q2Submitted && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                    q2IsCorrect ? 'bg-[#7ff8a8]/40 text-[#00522b]' : 'bg-[#ffdad6]/60 text-[#93000a]'
                  }`}>
                    {q2IsCorrect ? (
                      <span>
                        <strong>Gemini Feedback:</strong> Exact! At &lt;10k items, linear matrix multiplication is cache-friendly and runs in milliseconds without the memory overhead of maintaining multi-layer graph skip-lists.
                      </span>
                    ) : (
                      <span>
                        <strong>Gemini Feedback:</strong> Not quite. Flat KNN stores uncompressed raw vectors in memory and scans all points sequentially. For billion-scale clusters, quantized IVF-PQ is preferred.
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-[#727785]">
                    {q2Submitted ? 'Completed' : 'Select best option to evaluate'}
                  </span>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={!q2Answer || q2Submitted}
                    className="px-5 py-2 rounded-full bg-[#005bbf] text-white text-xs font-semibold shadow-xs hover:bg-[#1a73e8] transition-all disabled:opacity-40"
                  >
                    {q2Submitted ? 'Evaluated' : 'Submit Answer'}
                  </button>
                </div>
              </div>
            </section>
          </section>

          {/* RIGHT PERSISTENT 3D TALKING AVATAR COMPANION (4 cols on xl) */}
          <aside className="lg:col-span-4 xl:col-span-4 min-w-0 sticky top-24 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-[#005bbf]/20 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#005bbf]">
                    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[#1a1b1e] leading-tight">
                      Gemini Live Tutor
                    </span>
                    <span className="text-[11px] text-[#005bbf] font-medium">Autonomous Companion</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#82faab] text-[#00522b] text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#006d3a] animate-pulse"></span>
                  <span>Live Voice: Active</span>
                </div>
              </div>

              {/* Central AI Avatar Stage */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/20">
                <ThreeAvatar
                  isSpeaking={isAvatarSpeaking}
                  isMuted={isMuted}
                  personality={personality}
                />
              </div>

              {/* Sub-avatar Status Pill */}
              <div className="p-2.5 rounded-xl bg-[#f4f3f7] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#005bbf] text-[18px] shrink-0">
                    record_voice_over
                  </span>
                  <span className="text-xs text-[#1a1b1e] truncate font-medium">
                    Speaking & Lip-Synced • Subtle Gestures
                  </span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0 h-3.5">
                  <span className="w-1 bg-[#005bbf] rounded-full animate-pulse h-3"></span>
                  <span className="w-1 bg-[#005bbf] rounded-full animate-pulse h-4" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 bg-[#005bbf] rounded-full animate-pulse h-2" style={{ animationDelay: '300ms' }}></span>
                  <span className="w-1 bg-[#005bbf] rounded-full animate-pulse h-3.5" style={{ animationDelay: '75ms' }}></span>
                </div>
              </div>

              {/* Avatar Action Controls */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs transition-colors gap-1 ${
                    isMuted ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#efedf1] hover:bg-[#e3e2e6] text-[#1a1b1e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isMuted ? 'mic_off' : 'mic'}
                  </span>
                  <span>{isMuted ? 'Unmute' : 'Mute Mic'}</span>
                </button>

                <button
                  onClick={() =>
                    setPersonality((p) =>
                      p === 'Socratic' ? 'Concise' : p === 'Concise' ? 'Academic' : 'Socratic'
                    )
                  }
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#efedf1] hover:bg-[#e3e2e6] text-[#1a1b1e] text-xs transition-colors gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span>{personality}</span>
                </button>

                <button
                  onClick={() => setIsNotesOpen(true)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#d8e2ff] text-[#004493] hover:bg-[#adc7ff] text-xs transition-colors gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>Study Deck</span>
                </button>
              </div>

              {/* Live Dialogue Stream */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#727785] font-semibold uppercase tracking-wider">
                    Live Dialogue Stream
                  </span>
                  <span className="text-[#005bbf] font-medium">142ms latency</span>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {dialogueMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === 'student' ? 'self-end max-w-[90%]' : 'self-start max-w-[95%]'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          msg.sender === 'student'
                            ? 'bg-[#005bbf] text-white rounded-br-sm'
                            : 'bg-[#f4f3f7] text-[#1a1b1e] rounded-tl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-[#727785] mt-0.5 px-1 self-end">
                        {msg.sender === 'student' ? 'Alex' : 'Gemini 1.5 Pro'} • {msg.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Input prompt bar */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask Gemini tutor a question..."
                    className="flex-1 h-9 px-3 rounded-full bg-[#f4f3f7] text-xs text-[#1a1b1e] placeholder:text-[#727785] outline-none focus:ring-2 focus:ring-[#005bbf]"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-full bg-[#005bbf] text-white flex items-center justify-center hover:bg-[#1a73e8] shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </form>
              </div>

              {/* Delegate to specialized agents */}
              <div className="pt-2 border-t border-[#e3e2e6]/50 flex flex-col gap-1.5">
                <span className="text-[11px] text-[#414754] font-medium">
                  Classroom Sub-Agents:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setIsSandboxOpen(true)}
                    className="px-2.5 py-1 rounded-full bg-[#efedf1] hover:bg-[#d8e2ff] hover:text-[#004493] text-[#1a1b1e] text-[11px] font-medium transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                    Run Python Benchmark
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage('Explain the math behind cosine similarity and L2 normalization.');
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#efedf1] hover:bg-[#d8e2ff] hover:text-[#004493] text-[#1a1b1e] text-[11px] font-medium transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">functions</span>
                    Explain with Math
                  </button>
                  <button
                    onClick={onNavigateToOralDefense}
                    className="px-2.5 py-1 rounded-full bg-[#7ff8a8] hover:bg-[#82faab] text-[#00723d] text-[11px] font-semibold transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                    Take Oral Exam Defense
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Notes Drawer */}
      <NotesDrawer isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />

      {/* Python Code Benchmark Sandbox */}
      <CodeSandboxModal isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} />
    </div>
  );
};
