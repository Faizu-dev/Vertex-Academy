import React, { useState } from 'react';
import { NavTab } from '../types';
import { VertexAcademyIcon } from '../components/VertexAcademyIcon';
import confetti from 'canvas-confetti';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'credentials' | 'curriculums' | 'activity' | 'cloud-settings'>('overview');
  const [selectedCert, setSelectedCert] = useState<{
    title: string;
    id: string;
    date: string;
    score: string;
    skills: string[];
    signer: string;
  } | null>(null);

  const [tutorPersonality, setTutorPersonality] = useState<'Socratic' | 'Concise' | 'Academic'>('Socratic');
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const handleCopyProjectId = () => {
    navigator.clipboard?.writeText('vertex-genai-prod-0824');
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleViewCert = (cert: {
    title: string;
    id: string;
    date: string;
    score: string;
    skills: string[];
    signer: string;
  }) => {
    setSelectedCert(cert);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1560px] mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & User Identity Card */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#dadce0] shadow-sm p-6 sm:p-8">
        {/* Google 4-Color Gradient Top Ribbon */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"></div>

        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#4285F4]/10 blur-3xl"></div>
        <div className="pointer-events-none absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-[#34A853]/10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User Bio & Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              {/* Google 4-color ring */}
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] shadow-md">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMP95u9S8IqP9YrRkB5HIrmrLcJcfnuS62beEkMyv6euWTbYd0ppj3kNnNU-6LvBh2hdj88HDYoEIgpxcYpzhiZLLv4OUtuN4-G5jAAOjFcPnCLwXji0Ny65TkS8Wzxcl8NBqSrjaa25_vDsHbL1NhnwoNzBdOX-kwV9bJScXO1qPyc7I5v9Ro6DpG6TKK7BkNLAEaQrXzJRTwFFwFchrxDavfK58-pNlyq2lxvlTLbNVwao-yOUhsNQ"
                  alt="Alex Rivera"
                  className="w-full h-full rounded-full object-cover bg-white ring-2 ring-white"
                />
              </div>
              <div
                className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-[#34A853] ring-2 ring-white flex items-center justify-center text-white"
                title="Active Google Cloud Session"
              >
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f1f1f] tracking-tight">
                  Alex Rivera
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold border border-[#c2e7ff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Vertex AI Fellow
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[11px] font-semibold border border-[#ceead6]">
                  Level 4 AI Governance Cleared
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#5f6368] font-medium max-w-2xl leading-relaxed">
                Senior Machine Learning Systems Architect • Alphabet / Google Cloud AI Infrastructure Group.
                Leading vector index topologies and autonomous agentic pipelines.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#5f6368]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#4285F4]">mail</span>
                  <span className="font-mono text-[11px]">alex.rivera@cloud.google.com</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#34A853]">location_on</span>
                  <span>us-central1 (Iowa TPU Cluster)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#FBBC04]">badge</span>
                  <span className="font-mono text-[11px]">ID: GCP-VAI-9402</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cloud Project Quick Status Bar */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0 bg-[#f8fafd] border border-[#e3e8f5] p-3.5 rounded-2xl">
            <div className="flex items-center gap-2">
              <VertexAcademyIcon size={24} />
              <div className="text-left">
                <span className="text-[10px] text-[#5f6368] uppercase font-bold tracking-wider block">
                  Active Cloud Workspace
                </span>
                <button
                  onClick={handleCopyProjectId}
                  className="font-mono text-xs font-semibold text-[#1a73e8] hover:underline flex items-center gap-1"
                  title="Click to copy Project ID"
                >
                  <span>vertex-genai-prod-0824</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {showCopyFeedback ? 'done' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#e3e8f5] w-full justify-between lg:justify-end text-[11px]">
              <span className="text-[#5f6368]">TPU v5e Pods:</span>
              <span className="font-bold text-[#137333] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
                Online (16 Nodes)
              </span>
            </div>
          </div>
        </div>

        {/* Home Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-[#e3e8f5] mt-6 pt-4 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview & Stats', icon: 'dashboard' },
            { id: 'credentials', label: 'Verifiable Credentials (3)', icon: 'workspace_premium' },
            { id: 'curriculums', label: 'Active Curriculums (4)', icon: 'auto_stories' },
            { id: 'activity', label: 'Audit & Agent Trail', icon: 'history' },
            { id: 'cloud-settings', label: 'AI Preferences & Keys', icon: 'tune' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id as any)}
              className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeProfileTab === tab.id
                  ? 'bg-[#1a73e8] text-white shadow-2xs font-bold'
                  : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#1a73e8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}

          <button
            onClick={() => onNavigate('settings')}
            className="ml-auto px-4 py-2 rounded-full border border-[#dadce0] bg-white hover:bg-[#e8f0fe] hover:border-[#1a73e8] text-[#1a73e8] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shadow-2xs"
            title="Open Account Settings & Security"
          >
            <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
            <span>Account Settings</span>
          </button>
        </div>
      </section>

      {/* Main Tab Content */}
      {activeProfileTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Google 4-Color Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Blue: Learning Time */}
            <div className="p-5 rounded-2xl bg-white border border-[#dadce0] shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#4285F4]"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                  Total Learning Hours
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1f1f1f]">48.5</span>
                <span className="text-xs font-semibold text-[#1a73e8]">Hours</span>
              </div>
              <div className="mt-2 text-xs text-[#5f6368] flex items-center gap-1">
                <span className="text-[#137333] font-bold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +6.2 hrs
                </span>
                <span>this month</span>
              </div>
            </div>

            {/* Red: Enrolled Courses */}
            <div className="p-5 rounded-2xl bg-white border border-[#dadce0] shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#EA4335]"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                  Active Curriculums
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#fce8e6] text-[#c5221f] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">auto_stories</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1f1f1f]">4</span>
                <span className="text-xs font-semibold text-[#c5221f]">In Progress</span>
              </div>
              <div className="mt-2 text-xs text-[#5f6368] flex items-center gap-1">
                <span>1 course at 92% completion</span>
              </div>
            </div>

            {/* Yellow: Defense Score */}
            <div className="p-5 rounded-2xl bg-white border border-[#dadce0] shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FBBC04]"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                  Oral Defense Average
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#fef7e0] text-[#b06000] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1f1f1f]">94.2%</span>
                <span className="text-xs font-bold text-[#b06000]">High Honors</span>
              </div>
              <div className="mt-2 text-xs text-[#5f6368] flex items-center gap-1">
                <span className="text-[#137333] font-bold">Top 2%</span>
                <span>among Google engineers</span>
              </div>
            </div>

            {/* Green: Embeddings & Chunks */}
            <div className="p-5 rounded-2xl bg-white border border-[#dadce0] shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#34A853]"></div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                  Vectors Synthesized
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">database</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1f1f1f]">18,420</span>
                <span className="text-xs font-semibold text-[#137333]">Embeddings</span>
              </div>
              <div className="mt-2 text-xs text-[#5f6368] flex items-center gap-1">
                <span>In us-central1 ScaNN cluster</span>
              </div>
            </div>
          </div>

          {/* Current Focus Course & Quick Resume */}
          <div className="rounded-3xl bg-gradient-to-br from-[#f8fafd] via-white to-[#f4f7fc] border border-[#dadce0] p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold border border-[#c2e7ff] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-ping"></span>
                    Currently In Progress
                  </span>
                  <span className="text-xs text-[#5f6368]">Last active 18 mins ago</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#1f1f1f]">
                  Advanced Vector Database Architectures: HNSW vs KNN
                </h2>

                <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
                  Next up: <strong className="text-[#1f1f1f]">Lesson 2.1 Understanding Indexes & Geometric Spaces</strong> with Dr. Kenneth Vance. Interactive Python micro-lab and Socratic 3D avatar enabled.
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1f1f1f]">Course Progress</span>
                    <span className="text-[#1a73e8]">40% Completed (2 of 5 modules)</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#e0e3e7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] rounded-full"
                      style={{ width: '40%' }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={() => onNavigate('learning-player')}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1a73e8] to-[#4285F4] hover:from-[#1557b0] hover:to-[#1a73e8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  <span>Resume Learning Player</span>
                </button>
                <button
                  onClick={() => onNavigate('oral-defense')}
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff] text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                  <span>Take Oral Defense Exam</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dual Column: Competency Radar & Quick Shortcuts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Competency Progress */}
            <div className="p-6 rounded-3xl bg-white border border-[#dadce0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">hub</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1f1f1f]">Knowledge Graph Mastery</h3>
                    <p className="text-[11px] text-[#5f6368]">82% Overall Curriculum Competency</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="text-xs text-[#1a73e8] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span>Explore Graph</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              <div className="space-y-3.5 pt-2">
                {[
                  { name: 'Vector DBs & Embeddings (HNSW / ScaNN)', level: '94%', color: 'bg-[#4285F4]', badge: 'Mastered' },
                  { name: 'Gemini Multimodal & Real-time S2S', level: '96%', color: 'bg-[#34A853]', badge: 'Mastered' },
                  { name: 'Autonomous Agentic Orchestration', level: '88%', color: 'bg-[#EA4335]', badge: 'Advanced' },
                  { name: 'Cloud TPU Infrastructure & XLA', level: '78%', color: 'bg-[#FBBC04]', badge: 'Proficient' },
                ].map((skill, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1f1f1f]">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f1f3f4] text-[#5f6368]">
                          {skill.badge}
                        </span>
                        <span className="font-bold text-[#1f1f1f] font-mono">{skill.level}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-[#f1f3f4] rounded-full overflow-hidden">
                      <div className={`h-full ${skill.color} rounded-full`} style={{ width: skill.level }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Learning OS Shortcuts */}
            <div className="p-6 rounded-3xl bg-white border border-[#dadce0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#fef7e0] text-[#b06000] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1f1f1f]">Quick Actions & Ingestion</h3>
                    <p className="text-[11px] text-[#5f6368]">One-click navigation into learning modules</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onNavigate('studio')}
                  className="p-3.5 rounded-2xl bg-[#f8fafd] hover:bg-[#e8f0fe] border border-[#e3e8f5] text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  </div>
                  <span className="text-xs font-bold text-[#1f1f1f] block">Ingest New Data</span>
                  <span className="text-[11px] text-[#5f6368]">Upload PDF/Docs for Gemini indexing</span>
                </button>

                <button
                  onClick={() => onNavigate('my-courses')}
                  className="p-3.5 rounded-2xl bg-[#f8fafd] hover:bg-[#fce8e6] border border-[#e3e8f5] text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#fce8e6] text-[#c5221f] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">explore</span>
                  </div>
                  <span className="text-xs font-bold text-[#1f1f1f] block">Explore Curriculums</span>
                  <span className="text-[11px] text-[#5f6368]">Synthesize new course with AI</span>
                </button>

                <button
                  onClick={() => onNavigate('oral-defense')}
                  className="p-3.5 rounded-2xl bg-[#f8fafd] hover:bg-[#e6f4ea] border border-[#e3e8f5] text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                  </div>
                  <span className="text-xs font-bold text-[#1f1f1f] block">Oral Defense Lab</span>
                  <span className="text-[11px] text-[#5f6368]">Live speech exam with Dr. Vance</span>
                </button>

                <button
                  onClick={() => onNavigate('agent-logs')}
                  className="p-3.5 rounded-2xl bg-[#f8fafd] hover:bg-[#fce8e6] border border-[#e3e8f5] text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#fce8e6] text-[#c5221f] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  </div>
                  <span className="text-xs font-bold text-[#1f1f1f] block">Audit Ledgers</span>
                  <span className="text-[11px] text-[#5f6368]">Inspect agent tool calls & latency</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credentials & Certifications Tab */}
      {activeProfileTab === 'credentials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1f1f1f]">Official Google Cloud Credentials</h2>
              <p className="text-xs text-[#5f6368]">Verifiable certificates earned through live oral defenses and lab evaluations.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold border border-[#c2e7ff]">
              3 Credentials Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Google Cloud Vertex AI Solution Architect',
                id: 'GCP-VAI-2026-881',
                date: 'October 12, 2026',
                score: '96 / 100',
                skills: ['HNSW Vector Indexing', 'Gemini 1.5 Pro S2S', 'Firestore Traces', 'Cloud TPU v5e'],
                signer: 'Dr. Kenneth Vance, Chief Systems Architect',
                color: 'from-[#4285F4] to-[#1a73e8]',
                badgeColor: 'bg-[#e8f0fe] text-[#1a73e8] border-[#c2e7ff]',
              },
              {
                title: 'Autonomous Multi-Agent Systems Engineer',
                id: 'GCP-AGT-2026-442',
                date: 'September 28, 2026',
                score: '94 / 100',
                skills: ['LangGraph Routing', 'Self-Healing Retries', 'Guardrail Audits', 'Function Calling'],
                signer: 'Elena Rostova, Lead AI Engineer',
                color: 'from-[#EA4335] to-[#c5221f]',
                badgeColor: 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]',
              },
              {
                title: 'High-Performance Vector Indexing (ScaNN & HNSW)',
                id: 'GCP-VEC-2026-109',
                date: 'August 15, 2026',
                score: '92 / 100',
                skills: ['Cosine vs Euclidean', 'Graph Traversals', 'Quantization', 'High Throughput'],
                signer: 'Prof. Marcus Chen, Vector Systems',
                color: 'from-[#34A853] to-[#188038]',
                badgeColor: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]',
              },
            ].map((cert, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#dadce0] shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-4 relative overflow-hidden group"
              >
                <div className={`h-2 absolute top-0 inset-x-0 bg-gradient-to-r ${cert.color}`}></div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#5f6368]">{cert.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cert.badgeColor}`}>
                      Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#1f1f1f] leading-snug group-hover:text-[#1a73e8] transition-colors">
                    {cert.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-[#5f6368]">
                    <span className="material-symbols-outlined text-[16px] text-[#34A853]">verified_user</span>
                    <span>Issued {cert.date}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {cert.skills.map((s, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-[#f1f3f4] text-[#5f6368]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e3e8f5] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1f1f1f]">Score: {cert.score}</span>
                  <button
                    onClick={() => handleViewCert(cert)}
                    className="px-3.5 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Curriculums Tab */}
      {activeProfileTab === 'curriculums' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1f1f1f]">Enrolled Curriculums & Tracks</h2>
              <p className="text-xs text-[#5f6368]">Your personalized AI syllabus tracks with active progress and tutors.</p>
            </div>
            <button
              onClick={() => onNavigate('my-courses')}
              className="px-4 py-2 rounded-full bg-[#1a73e8] text-white text-xs font-semibold hover:bg-[#1557b0] transition-colors shadow-2xs"
            >
              Browse All Courses
            </button>
          </div>

          <div className="divide-y divide-[#e3e8f5] bg-white border border-[#dadce0] rounded-3xl overflow-hidden shadow-sm">
            {[
              {
                title: 'Advanced Vector Database Architectures: HNSW vs KNN',
                progress: 40,
                instructor: 'Dr. Kenneth Vance',
                duration: '2.5 Hours',
                modules: '2 / 5 Modules',
                badge: 'In Progress',
                badgeClass: 'bg-[#e8f0fe] text-[#1a73e8]',
                tab: 'learning-player' as NavTab,
              },
              {
                title: 'Building Autonomous Multi-Agent RAG Pipelines',
                progress: 85,
                instructor: 'Elena Rostova',
                duration: '4.0 Hours',
                modules: '5 / 6 Modules',
                badge: 'Near Completion',
                badgeClass: 'bg-[#e6f4ea] text-[#137333]',
                tab: 'learning-player' as NavTab,
              },
              {
                title: 'Cloud TPU v5e Topology & High-Throughput Training',
                progress: 25,
                instructor: 'Dr. Marcus Chen',
                duration: '3.5 Hours',
                modules: '1 / 4 Modules',
                badge: 'In Progress',
                badgeClass: 'bg-[#e8f0fe] text-[#1a73e8]',
                tab: 'learning-player' as NavTab,
              },
              {
                title: 'Gemini 1.5 Pro Multimodal Speech-to-Speech Mastery',
                progress: 100,
                instructor: 'Alex AI (Vertex Tutor)',
                duration: '1.5 Hours',
                modules: '3 / 3 Modules',
                badge: 'Completed & Certified',
                badgeClass: 'bg-[#fef7e0] text-[#b06000]',
                tab: 'oral-defense' as NavTab,
              },
            ].map((course, idx) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f8fafd] transition-colors">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${course.badgeClass}`}>
                      {course.badge}
                    </span>
                    <span className="text-xs text-[#5f6368] font-medium">{course.duration} • {course.instructor}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1f1f1f] truncate">{course.title}</h3>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-1.5 w-32 bg-[#e0e3e7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1a73e8] rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="text-xs text-[#5f6368] font-mono">{course.progress}% ({course.modules})</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(course.tab)}
                  className="px-4 py-2 rounded-full bg-white hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#dadce0] text-xs font-semibold shrink-0 transition-colors shadow-2xs"
                >
                  Resume Track
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity & Agent Audit Trail Tab */}
      {activeProfileTab === 'activity' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1f1f1f]">Recent Learning & Agent Activity</h2>
              <p className="text-xs text-[#5f6368]">Full immutable audit ledger of agent runs, quiz submissions, and oral defenses.</p>
            </div>
            <button
              onClick={() => onNavigate('agent-logs')}
              className="text-xs font-semibold text-[#1a73e8] hover:underline flex items-center gap-1"
            >
              <span>View Full Audit System</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="p-6 bg-white border border-[#dadce0] rounded-3xl shadow-sm space-y-4">
            {[
              {
                time: '12 minutes ago',
                action: 'Oral Defense Exam Evaluated',
                detail: 'Scored 94% on High-Dimensional HNSW indexing with Dr. Vance.',
                agent: 'EvaluationAgent',
                status: 'Passed',
                statusClass: 'bg-[#e6f4ea] text-[#137333]',
              },
              {
                time: '45 minutes ago',
                action: 'Multimodal Vector Embeddings Generated',
                detail: '24 files ingested into 18,420 vectors across us-central1 cluster.',
                agent: 'RAGAgent',
                status: 'Indexed',
                statusClass: 'bg-[#e8f0fe] text-[#1a73e8]',
              },
              {
                time: '2 hours ago',
                action: 'Micro-Quiz 2 Completed',
                detail: 'Correctly proved Euclidean distance proportionality to cosine similarity.',
                agent: 'LearnerCompanion',
                status: '100% Score',
                statusClass: 'bg-[#fef7e0] text-[#b06000]',
              },
              {
                time: 'Yesterday',
                action: 'Autonomous Chunk Boundary Healed',
                detail: 'Auto-resolved 128-token chunk overlap on Pinecone architecture whitepaper.',
                agent: 'ArtifactAgent',
                status: 'Self-Healed',
                statusClass: 'bg-[#e6f4ea] text-[#137333]',
              },
            ].map((act, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b border-[#f1f3f4] last:border-b-0 last:pb-0">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] mt-1.5 shrink-0 ring-4 ring-[#e8f0fe]"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1f1f1f]">{act.action}</span>
                    <span className="text-[11px] text-[#5f6368] font-mono">{act.time}</span>
                  </div>
                  <p className="text-xs text-[#5f6368] mt-0.5">{act.detail}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                    <span className="font-mono text-[#1a73e8]">Agent: {act.agent}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${act.statusClass}`}>
                      {act.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cloud Settings & Preferences Tab */}
      {activeProfileTab === 'cloud-settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-[#1f1f1f]">AI Preferences & Cloud Quotas</h2>
            <p className="text-xs text-[#5f6368]">Configure your 3D avatar companion persona, Gemini engine settings, and Google Cloud project link.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar Persona Settings */}
            <div className="p-6 bg-white border border-[#dadce0] rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#1f1f1f] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a73e8]">smart_toy</span>
                <span>3D AI Tutor Personality</span>
              </h3>
              <p className="text-xs text-[#5f6368]">Select how the Gemini avatar companion coaches you during lessons.</p>

              <div className="space-y-2">
                {(['Socratic', 'Concise', 'Academic'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTutorPersonality(mode)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all ${
                      tutorPersonality === mode
                        ? 'border-[#1a73e8] bg-[#e8f0fe]/60 font-bold text-[#1a73e8]'
                        : 'border-[#dadce0] bg-white text-[#5f6368] hover:bg-[#f8fafd]'
                    }`}
                  >
                    <div>
                      <span className="block font-semibold">{mode} Mode</span>
                      <span className="text-[11px] text-[#5f6368]">
                        {mode === 'Socratic' && 'Guides with deep questions, analogies, and mathematical proofs.'}
                        {mode === 'Concise' && 'Gives fast, direct bulleted answers and code snippets.'}
                        {mode === 'Academic' && 'Cites formal ML research papers, theorems, and benchmarks.'}
                      </span>
                    </div>
                    {tutorPersonality === mode && (
                      <span className="material-symbols-outlined text-[18px] text-[#1a73e8]">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cloud Infrastructure Quotas */}
            <div className="p-6 bg-white border border-[#dadce0] rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#1f1f1f] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#34A853]">cloud</span>
                <span>Google Cloud Quotas & Limits</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span>Gemini 1.5 Pro Token Quota (TPM)</span>
                    <span className="text-[#137333]">92% Available</span>
                  </div>
                  <div className="h-2 w-full bg-[#e0e3e7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#34A853] rounded-full" style={{ width: '8%' }}></div>
                  </div>
                  <span className="text-[11px] text-[#5f6368] mt-0.5 block">160,000 / 2,000,000 TPM used</span>
                </div>

                <div>
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span>Firestore Realtime Vector Index Storage</span>
                    <span className="text-[#1a73e8]">18.4k / 100k Vectors</span>
                  </div>
                  <div className="h-2 w-full bg-[#e0e3e7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a73e8] rounded-full" style={{ width: '18.4%' }}></div>
                  </div>
                  <span className="text-[11px] text-[#5f6368] mt-0.5 block">Region: us-central1 (Low latency)</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#f8fafd] border border-[#e3e8f5] space-y-1">
                  <span className="font-bold text-[#1f1f1f]">Security Governance</span>
                  <p className="text-[11px] text-[#5f6368]">
                    All student queries and speech interactions are evaluated with Google AI Safety Guardrails and logged into an immutable Firestore audit ledger.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-[#e8f0fe] p-8 space-y-6 text-center animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Google 4-Color Accent Border */}
            <div className="h-2 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"></div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <VertexAcademyIcon size={36} />
                <span className="font-bold text-lg text-[#1f1f1f]">Google Cloud Vertex Academy</span>
              </div>
              <h2 id="cert-title" className="text-xl sm:text-2xl font-extrabold text-[#1a73e8]">
                Certificate of High Honors & Competency
              </h2>
              <p className="text-xs text-[#5f6368]">This certifies that</p>
              <h3 className="text-2xl font-bold text-[#1f1f1f]">Alex Rivera</h3>
              <p className="text-xs text-[#5f6368] max-w-md mx-auto">
                has successfully defended and mastered the curriculum:
              </p>
              <div className="p-3 rounded-2xl bg-[#f8fafd] border border-[#dadce0] font-bold text-sm text-[#1f1f1f]">
                {selectedCert.title}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-left bg-[#f8fafd] p-4 rounded-2xl border border-[#e3e8f5]">
              <div>
                <span className="text-[#5f6368] block">Credential ID</span>
                <span className="font-mono font-bold text-[#1f1f1f]">{selectedCert.id}</span>
              </div>
              <div>
                <span className="text-[#5f6368] block">Oral Defense Score</span>
                <span className="font-bold text-[#137333]">{selectedCert.score} (Verified)</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-[#e3e8f5]">
                <span className="text-[#5f6368] block">Authorized Signature</span>
                <span className="font-medium text-[#1f1f1f]">{selectedCert.signer}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-2 rounded-full bg-[#1a73e8] text-white text-xs font-semibold hover:bg-[#1557b0] transition-colors"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
