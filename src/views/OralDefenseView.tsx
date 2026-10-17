import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface OralDefenseViewProps {
  onBackToPlayer?: () => void;
}

export const OralDefenseView: React.FC<OralDefenseViewProps> = ({ onBackToPlayer }) => {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  const stepData: Record<
    number,
    {
      title: string;
      tag: string;
      question: string;
      score: string;
      transcript: string;
      feedback: string;
      rubric: { factual: string; terminology: string; clarity: string; edge: string };
    }
  > = {
    1: {
      title: 'DYNAMIC QUESTION 1 OF 3 (FOUNDATIONAL MASTERY)',
      tag: 'Vector Dimensionality & Density',
      question:
        'Define high-dimensional embedding spaces and analyze how sparsity impacts nearest-neighbor calculation complexity in non-indexed vector search.',
      score: 'Score: 98/100 • Flawless Precision',
      transcript:
        'Alex (Learner): "High-dimensional spaces suffer from the curse of dimensionality where distances between points converge, drastically reducing contrast. Without an index structure, brute-force kNN requires linear O(N·D) evaluations, creating unviable latency bottlenecks for real-time inference..."',
      feedback:
        'Exceptional mathematical accuracy. Highlighted dimensional divergence, linear O(N*D) cost curve, and memory bandwidth bounds with rigorous precision.',
      rubric: { factual: '10 / 10', terminology: '10 / 10', clarity: '9.8 / 10', edge: '9.5 / 10' },
    },
    2: {
      title: 'DYNAMIC QUESTION 2 OF 3 (ADAPTIVE DIFFICULTY)',
      tag: 'Vector Distance Formulations',
      question:
        'Explain in your own words how vector embeddings preserve semantic meaning in high-dimensional space and contrast Cosine vs Euclidean distance for normalized embeddings.',
      score: 'Score: 95/100 • High Depth',
      transcript:
        'Alex (Learner): "Vector embeddings map semantic relationships into high-dimensional geometric coordinates where related concepts share proximity. For unit-normalized vectors, Euclidean distance and Cosine similarity are monotonically equivalent because the dot product directly reflects angular alignment without magnitude distortion..."',
      feedback:
        'Strong conceptual grasp of metric equivalence and geometric vector properties. Noted precise distinction between cosine angle and L2 norm with accurate mathematical intuition.',
      rubric: { factual: '10 / 10', terminology: '10 / 10', clarity: '9 / 10', edge: '9.5 / 10' },
    },
    3: {
      title: 'DYNAMIC QUESTION 3 OF 3 (EDGE CASE & SCALE DEFENSE)',
      tag: 'Concurrency & Index Mutation',
      question:
        'Under heavy ingestion spikes with concurrent read queries, how do you prevent HNSW graph degradation without degrading recall guarantees?',
      score: 'Score: 96/100 • Architectural Rigor',
      transcript:
        'Alex (Learner): "We decouple insertion pipelines via two-phase buffered staging queues while dynamically adjusting efConstruction and M parameters. For reads, we utilize dual-buffered graph locks with copy-on-write pointer swaps so incoming query traversals navigate stable subgraphs..."',
      feedback:
        'Superb systems engineering defense. Demonstrated thorough mastery of two-phase concurrency, buffer queues, and lock-free graph read-paths.',
      rubric: { factual: '9.5 / 10', terminology: '10 / 10', clarity: '9.5 / 10', edge: '9.8 / 10' },
    },
  };

  const current = stepData[activeStep];

  const handleCopyHash = () => {
    navigator.clipboard.writeText('ALMS-VEC-884920-VERIFIED-HASH-8a3f7c19d9e1b204');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handleDownloadCertificate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    window.print();
  };

  const handleDownloadTranscript = () => {
    const text = `AGENTIC LMS - GEMINI ORAL DEFENSE AUDIT TRANSCRIPT\nLearner: Alex Rivera\nExam Date: October 24, 2024\nOverall Score: 96/100 (Distinction)\n\nStep 1: ${stepData[1].question}\n${stepData[1].transcript}\nFeedback: ${stepData[1].feedback}\n\nStep 2: ${stepData[2].question}\n${stepData[2].transcript}\nFeedback: ${stepData[2].feedback}\n\nStep 3: ${stepData[3].question}\n${stepData[3].transcript}\nFeedback: ${stepData[3].feedback}\n\nCryptographic Hash: ALMS-VEC-884920-VERIFIED-HASH-8a3f7c19d9e1b204`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'alex_rivera_oral_defense_transcript.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  return (
    <div className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-[1560px] mx-auto space-y-6">
      {/* GEMINI AURORA HEADER */}
      <section className="relative overflow-hidden rounded-3xl p-6 lg:p-8 text-white shadow-lg bg-gradient-to-r from-[#1a73e8] via-[#7C3AED] via-[#D96570] to-[#FBBC04]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl"></div>
        <div className="pointer-events-none absolute left-1/3 -bottom-20 h-64 w-64 rounded-full bg-[#FBBC04]/20 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-[#FBBC04]">workspace_premium</span>
              <span className="text-xs tracking-wider uppercase font-bold">
                Vertex Academy • Final Oral Defense & Certification
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Course Completion & Gemini AI Oral Defense
            </h1>
            <p className="text-sm lg:text-base text-white/90 leading-relaxed font-normal">
              Real-time speech-to-speech comprehension exam with multimodal evaluation, rubric scoring, and verifiable cryptographic graduation credentials.
            </p>
          </div>

          {/* Exam Status Pill */}
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white text-[#1f1f1f] shadow-md border border-[#dadce0] self-start md:self-auto shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#fef7e0] flex items-center justify-center text-[#b06000]">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5f6368] uppercase tracking-wider font-bold">
                Exam Status
              </span>
              <span className="text-xs font-bold text-[#1f1f1f] flex items-center gap-1.5">
                Defense Passed
                <span className="inline-block w-2 h-2 rounded-full bg-[#34A853]"></span>
                <span className="text-[#137333] font-extrabold">96/100 Honors</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN 1: AI Oral Examination Interactive Sandbox (7 Cols) */}
        <section className="lg:col-span-7 min-w-0 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e3e2e6]/50 flex flex-col gap-4">
            {/* Session Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#efedf1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#004493]">
                  <span className="material-symbols-outlined text-[24px]">graphic_eq</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-[#1a1b1e]">Live Gemini S2S Oral Examination</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#82faab] text-[#00522b] text-[11px] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006d3a]"></span> Verified
                    </span>
                  </div>
                  <span className="text-xs text-[#727785]">
                    Multi-turn autonomous rubric evaluator • Model: Gemini 1.5 Pro S2S
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#414754] bg-[#f4f3f7] px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-[16px] text-[#006d3a]">speed</span>
                <span>Latency: <strong>135ms</strong></span>
                <span className="text-[#c1c6d6]">|</span>
                <span>WebRTC: <strong>4m 12s</strong></span>
              </div>
            </div>

            {/* Exam Step Progression Pills */}
            <div className="grid grid-cols-3 gap-2 bg-[#f4f3f7] p-1.5 rounded-xl">
              {[
                { step: 1, label: 'Step 1: Recall', score: '98 / 100' },
                { step: 2, label: 'Step 2: Tradeoffs', score: '95 / 100' },
                { step: 3, label: 'Step 3: Defense', score: '96 / 100' },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
                    activeStep === s.step
                      ? 'bg-[#d8e2ff] text-[#004493] font-semibold shadow-xs'
                      : 'text-[#414754] hover:bg-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-[#006d3a]">
                    check_circle
                  </span>
                  <div className="text-center sm:text-left">
                    <span className="block text-[11px] leading-tight">{s.label}</span>
                    <span className="text-[11px] font-bold text-[#006d3a]">{s.score}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic Audio Waveform Canvas Box */}
            <div className="relative bg-[#f4f3f7] rounded-xl p-4 flex flex-col items-center justify-center gap-2 overflow-hidden border border-[#e3e2e6]/50">
              <div className="w-full flex items-center justify-between text-xs text-[#414754] mb-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#005bbf]">mic</span>
                  Audio Stream Analyzed: 4m 12s voice defense recorded via WebRTC
                </span>
                <span className="font-mono text-[#1a1b1e]">Bitrate: 48kHz Opus</span>
              </div>

              {/* 42 Dynamic Audio Wave Bars */}
              <div className="w-full h-20 bg-white rounded-lg px-4 flex items-center justify-between gap-1 shadow-inner relative overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 h-px bg-[#c1c6d6]/30 -translate-y-1/2"></div>
                {[
                  6, 10, 16, 12, 8, 14, 20, 14, 8, 18, 22, 12, 7, 16, 20, 14, 9, 15, 22, 16, 10,
                  18, 20, 14, 8, 16, 21, 15, 10, 19, 22, 14, 9, 17, 12, 7, 16, 21, 15, 11, 8, 5,
                ].map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'animate-pulse' : ''
                    } ${
                      i % 3 === 0
                        ? 'bg-[#005bbf]'
                        : i % 3 === 1
                        ? 'bg-[#006d3a]'
                        : 'bg-[#ffba45]'
                    }`}
                    style={{
                      height: `${height * 2.5}px`,
                      animationDelay: `${(i % 5) * 150}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Playhead Scrubbing Metadata Bar */}
              <div className="w-full flex items-center justify-between text-[#727785] text-xs font-mono">
                <span>00:00</span>
                <div className="flex items-center gap-1 text-[#005bbf] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#005bbf] animate-ping"></span>
                  <span>Active Anchor: 02:45 / 04:12</span>
                </div>
                <span>04:12</span>
              </div>
            </div>

            {/* Dynamic Adaptive Question Prompt Box */}
            <div className="bg-[#f4f3f7] rounded-xl p-4 flex flex-col gap-1.5 border border-[#e3e2e6]/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#005bbf] uppercase tracking-wider">
                  {current.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d8e2ff] text-[#004493] text-[11px] font-semibold">
                  {current.tag}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#1a1b1e] leading-snug">
                {current.question}
              </p>
            </div>

            {/* Spoken Transcript Box */}
            <div className="bg-white rounded-xl p-4 border border-[#e3e2e6]/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#727785]">
                    record_voice_over
                  </span>
                  <span className="text-xs font-semibold text-[#1a1b1e]">
                    Learner Spoken Response Transcript
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#82faab] text-[#00522b] text-[11px] font-semibold">
                  {current.score}
                </span>
              </div>

              <p className="text-xs text-[#414754] italic bg-[#f4f3f7] p-3 rounded-xl leading-relaxed">
                {current.transcript}
              </p>

              {/* AI Evaluator Feedback */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#d8e2ff]/25 border border-[#adc7ff]/40">
                <span className="material-symbols-outlined text-[20px] text-[#005bbf] shrink-0 mt-0.5">
                  psychology
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-[#004493] font-bold uppercase tracking-wider">
                    AI Evaluator Feedback
                  </span>
                  <p className="text-xs text-[#1a1b1e] leading-relaxed">{current.feedback}</p>
                </div>
              </div>

              {/* Rubric Criteria 4-Pillar Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#f4f3f7] flex flex-col items-center text-center">
                  <span className="text-[11px] text-[#727785]">Factual Accuracy</span>
                  <span className="text-sm font-bold text-[#006d3a]">{current.rubric.factual}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f4f3f7] flex flex-col items-center text-center">
                  <span className="text-[11px] text-[#727785]">Tech Terminology</span>
                  <span className="text-sm font-bold text-[#006d3a]">{current.rubric.terminology}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f4f3f7] flex flex-col items-center text-center">
                  <span className="text-[11px] text-[#727785]">Clarity & Delivery</span>
                  <span className="text-sm font-bold text-[#005bbf]">{current.rubric.clarity}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f4f3f7] flex flex-col items-center text-center">
                  <span className="text-[11px] text-[#727785]">Edge Case Defense</span>
                  <span className="text-sm font-bold text-[#006d3a]">{current.rubric.edge}</span>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="h-10 px-4 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isPlayingAudio ? 'Pause Replay' : 'Replay Audio Defense'}</span>
                </button>
                <button
                  onClick={() => setIsRubricOpen(!isRubricOpen)}
                  className="h-10 px-4 rounded-full bg-[#efedf1] hover:bg-[#e3e2e6] text-[#005bbf] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">checklist</span>
                  <span>View Evaluation Rubric</span>
                </button>
              </div>
              <button
                onClick={handleDownloadTranscript}
                className="h-10 px-4 rounded-full text-[#414754] hover:bg-[#efedf1] text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>Oral Transcript (.txt)</span>
              </button>
            </div>
          </div>

          {/* Cohort Telemetry Metric Mini-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e3e2e6]/50 flex flex-col">
              <span className="text-[11px] text-[#727785] uppercase font-semibold">
                Oral Exam Percentile
              </span>
              <span className="text-3xl font-bold text-[#1a1b1e] mt-1">
                97<span className="text-[#006d3a] text-lg">th</span>
              </span>
              <span className="text-xs text-[#006d3a] flex items-center gap-1 mt-0.5 font-medium">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> Top 3% of all global cohorts
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e3e2e6]/50 flex flex-col">
              <span className="text-[11px] text-[#727785] uppercase font-semibold">
                Reasoning Depth
              </span>
              <span className="text-3xl font-bold text-[#1a1b1e] mt-1">
                4.9<span className="text-[#727785] text-lg font-normal">/5</span>
              </span>
              <span className="text-xs text-[#727785] mt-0.5">
                Evaluated across 8 dimensions
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e3e2e6]/50 flex flex-col">
              <span className="text-[11px] text-[#727785] uppercase font-semibold">
                Integrity Score
              </span>
              <span className="text-3xl font-bold text-[#006d3a] mt-1">99.8%</span>
              <span className="text-xs text-[#727785] mt-0.5">
                Verified voiceprint & entropy
              </span>
            </div>
          </div>
        </section>

        {/* COLUMN 2: Unlocked Dynamic Certificate of Completion (5 Cols) */}
        <section className="lg:col-span-5 min-w-0 flex flex-col gap-4">
          {/* Celebratory Congratulatory Header Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e3e2e6]/50 relative overflow-hidden flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-[#a06d00]">stars</span>
                <span className="text-xs font-bold text-[#a06d00] tracking-wider uppercase">
                  Congratulations Alex Rivera!
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#82faab] text-[#00522b] text-[11px] font-semibold">
                Passed with Honors
              </span>
            </div>
            <p className="text-xs text-[#414754] leading-relaxed">
              You have satisfied all oral comprehension, algorithmic trade-off defense, and code
              sandbox criteria for full certification.
            </p>
          </div>

          {/* High-Fidelity Certificate Preview Card */}
          <div className="relative bg-white rounded-2xl p-6 shadow-md border-2 border-[#adc7ff]/50 flex flex-col gap-4 overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#ffddb0]/30 via-transparent to-transparent pointer-events-none"></div>

            {/* Certificate Top Crest & Brand Header */}
            <div className="relative flex items-center justify-between pb-3 border-b border-[#e3e2e6]/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#d8e2ff] flex items-center justify-center text-[#005bbf] shadow-xs">
                  <span className="material-symbols-outlined text-[28px]">school</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#005bbf] font-bold tracking-widest uppercase leading-none">
                    Agentic Learning OS
                  </span>
                  <span className="text-xs font-semibold text-[#1a1b1e] tracking-tight mt-0.5">
                    Google Cloud Authorized LMS
                  </span>
                </div>
              </div>

              {/* Golden Laurel Emblem */}
              <div
                className="w-10 h-10 rounded-full bg-[#ffddb0] flex items-center justify-center text-[#614000] shadow-xs"
                title="Cryptographically Validated"
              >
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
            </div>

            {/* Formal Certificate Typography Body */}
            <div className="relative flex flex-col items-center text-center py-2 gap-1">
              <span className="text-[11px] uppercase tracking-widest text-[#727785] font-semibold">
                Certificate of Verified Mastery
              </span>
              <span className="text-xs text-[#414754] mt-1">This certifies that</span>
              <h3 className="text-2xl font-bold tracking-tight text-[#005bbf] my-0.5">
                Alex Rivera
              </h3>
              <span className="text-xs text-[#414754] max-w-sm leading-relaxed">
                has successfully passed the rigorous AI Oral Defense and interactive algorithmic sandboxes for:
              </span>
              <div className="mt-2 px-4 py-2 rounded-xl bg-[#f4f3f7] max-w-md border border-[#e3e2e6]">
                <h4 className="text-xs font-bold text-[#1a1b1e] leading-snug">
                  Advanced Vector Database Architectures: HNSW, Indexing & High-Throughput Search
                </h4>
              </div>
            </div>

            {/* Metadata & Dual Signature Row */}
            <div className="relative grid grid-cols-2 gap-3 pt-2 text-xs border-t border-[#efedf1]">
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-[#727785] uppercase">Issue Date</span>
                <span className="font-semibold text-[#1a1b1e]">October 24, 2024</span>
                <span className="text-[10px] text-[#727785] font-mono mt-0.5">ID: ALMS-VEC-884920</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-[#727785] uppercase">Verified Authenticity</span>
                <span className="font-semibold text-[#1a1b1e]">Autonomous Evaluator</span>
                <span className="text-[10px] text-[#006d3a] font-mono mt-0.5">Hash: #8a3f...d9e1</span>
              </div>
            </div>

            {/* Cryptographic Hallmarks Bar */}
            <div className="relative flex items-center justify-between p-3 rounded-xl bg-[#ffddb0]/30 text-[#614000] text-xs">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#a06d00]">security</span>
                <span className="font-semibold">Google Cloud Verified • On-Chain Public Ledger</span>
              </div>
              <button
                onClick={handleCopyHash}
                className="text-[#a06d00] hover:underline font-bold flex items-center gap-1"
              >
                <span>{copiedHash ? 'Copied!' : 'Copy Hash'}</span>
                <span className="material-symbols-outlined text-[14px]">
                  {copiedHash ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDownloadCertificate}
              className="w-full h-11 rounded-full bg-[#005bbf] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#1a73e8] shadow-xs transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download PDF Certificate (High-Res 300DPI)</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => alert('Certificate credential badge ready for LinkedIn Profile Sync!')}
                className="h-10 px-3 rounded-full bg-[#f4f3f7] hover:bg-[#efedf1] text-[#1a1b1e] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0A66C2]">share</span>
                <span>Add to LinkedIn</span>
              </button>
              <button
                onClick={() => alert('Certificate Gist verified and committed to GitHub profile repository!')}
                className="h-10 px-3 rounded-full bg-[#f4f3f7] hover:bg-[#efedf1] text-[#1a1b1e] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span>Export to GitHub</span>
              </button>
            </div>
          </div>

          {/* Skill Competencies Verified Chip Set */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e3e2e6]/50 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1a1b1e]">Verified Skill Competencies</span>
              <span className="text-[#006d3a] font-medium">4 Mastery Badges</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Hierarchical Navigable Small World (HNSW)',
                'Vector Quantization (IVF-PQ)',
                'Cosine & Euclidean Metric Scaling',
                'Real-Time Semantic Retrieval',
              ].map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f3f7] text-[#1a1b1e] text-xs font-medium border border-[#e3e2e6]/60"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#006d3a]">check</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
