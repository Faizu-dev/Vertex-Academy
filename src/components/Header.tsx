import React from 'react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_12px_rgba(66,133,244,0.08)] border-b border-[#e3e8f5]">
      {/* Google 4-Color Signature Top Accent Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"></div>

      <div className="h-16 w-full px-6 flex items-center justify-between gap-6">
        {/* Brand Lockup: Vertex Academy */}
        <div
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
          onClick={() => onTabChange('studio')}
        >
          {/* Google Vertex AI Inspired Emblem */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a73e8] via-[#4285F4] to-[#7C3AED] shadow-sm text-white group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#34A853] ring-2 ring-white"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#1f1f1f] leading-tight tracking-tight flex items-center gap-1.5">
                Vertex Academy
              </span>
              {/* Google 4-color dots */}
              <div className="flex items-center gap-1" title="Google AI Infrastructure Online">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
                <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span>
                <span className="w-2 h-2 rounded-full bg-[#FBBC04]"></span>
                <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#5f6368] leading-none">
              <span className="font-medium text-[#1a73e8]">Google Cloud</span>
              <span>•</span>
              <span>AI Learning OS</span>
            </div>
          </div>
        </div>

        {/* Top Navigation Pill Group */}
        <nav className="hidden xl:flex items-center gap-1.5 px-2 py-1 bg-[#f1f3f4] rounded-full border border-[#dadce0]">
          <button
            onClick={() => onTabChange('studio')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'bg-white text-[#1a73e8] shadow-sm ring-1 ring-[#4285F4]/30'
                : 'text-[#5f6368] hover:bg-white/60 hover:text-[#202124]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
            <span>Studio</span>
          </button>
          <button
            onClick={() => onTabChange('my-courses')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-courses'
                ? 'bg-white text-[#d93025] shadow-sm ring-1 ring-[#EA4335]/30'
                : 'text-[#5f6368] hover:bg-white/60 hover:text-[#202124]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span>
            <span>Courses</span>
          </button>
          <button
            onClick={() => onTabChange('learning-player')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'learning-player'
                ? 'bg-white text-[#b06000] shadow-sm ring-1 ring-[#FBBC04]/50'
                : 'text-[#5f6368] hover:bg-white/60 hover:text-[#202124]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FBBC04]"></span>
            <span>Player</span>
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-white text-[#1a73e8] shadow-sm ring-1 ring-[#4285F4]/30'
                : 'text-[#5f6368] hover:bg-white/60 hover:text-[#202124]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
            <span>Knowledge Graph</span>
          </button>
          <button
            onClick={() => onTabChange('oral-defense')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'oral-defense'
                ? 'bg-white text-[#188038] shadow-sm ring-1 ring-[#34A853]/30'
                : 'text-[#5f6368] hover:bg-white/60 hover:text-[#202124]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
            <span>Oral Defense</span>
          </button>
          <button
            onClick={() => onTabChange('agent-logs')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'agent-logs'
                ? 'bg-white text-[#d93025] shadow-sm ring-1 ring-[#EA4335]/30'
                : 'text-[#5f6368] hover:bg-white/60 hover:text-[#202124]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span>
            <span>Audit Logs</span>
          </button>
        </nav>

        {/* Search, Notifications & Profile */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-64 lg:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5f6368] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Vertex embeddings, courses, agents..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-[#f1f3f4] border border-transparent text-[#202124] placeholder:text-[#5f6368] text-xs focus:ring-2 focus:ring-[#4285F4] focus:bg-white focus:border-[#4285F4] outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EA4335] ring-2 ring-white"></span>
            </button>
            <button
              aria-label="Help and Documentation"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">help_outline</span>
            </button>
          </div>

          <div className="h-8 w-px bg-[#dadce0] hidden sm:block"></div>

          {/* User profile */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="relative shrink-0">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#4285F4]/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMP95u9S8IqP9YrRkB5HIrmrLcJcfnuS62beEkMyv6euWTbYd0ppj3kNnNU-6LvBh2hdj88HDYoEIgpxcYpzhiZLLv4OUtuN4-G5jAAOjFcPnCLwXji0Ny65TkS8Wzxcl8NBqSrjaa25_vDsHbL1NhnwoNzBdOX-kwV9bJScXO1qPyc7I5v9Ro6DpG6TKK7BkNLAEaQrXzJRTwFFwFchrxDavfK58-pNlyq2lxvlTLbNVwao-yOUhsNQ"
              />
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34A853] ring-2 ring-white"
                title="Active"
              ></span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#202124] leading-tight">Alex Rivera</span>
              <span className="text-[11px] text-[#5f6368] leading-none">Vertex AI Lead</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
