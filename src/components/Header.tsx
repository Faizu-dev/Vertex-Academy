import React, { useState, useRef, useEffect } from 'react';
import { NavTab } from '../types';
import { VertexAcademyIcon } from './VertexAcademyIcon';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSkeletonShowcase?: () => void;
  onOpenNotifications?: () => void;
  onOpenHelp?: () => void;
  onOpenFastApis?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenSkeletonShowcase,
  onOpenNotifications,
  onOpenHelp,
  onOpenFastApis,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_12px_rgba(66,133,244,0.08)] border-b border-[#e3e8f5]">
      {/* Google 4-Color Signature Top Accent Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"></div>

      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Lockup: Vertex Academy with custom new icon */}
        <div
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
          onClick={() => onTabChange('home')}
          title="Go to Learner Home"
        >
          {/* Custom Google 4-Color Vertex Academy Icon */}
          <div className="p-1 rounded-xl bg-gradient-to-br from-[#f8fafd] to-[#e8f0fe] border border-[#d2e3fc] shadow-2xs group-hover:shadow-sm group-hover:scale-105 transition-all">
            <VertexAcademyIcon size={32} animated />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#1f1f1f] group-hover:text-[#1a73e8] transition-colors">
                Vertex
              </span>
              <span className="font-normal text-sm text-[#5f6368]">Academy</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#e8f0fe] text-[#1a73e8] text-[10px] font-bold tracking-wider uppercase border border-[#c2e7ff]">
                Pro
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#5f6368]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#34A853]"></span>
              <span>Gemini 2.5 Active</span>
              <span className="text-[#dadce0]">•</span>
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar with Google Material Styling */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5f6368] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search concepts, vector indexes, or oral defense scenarios..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 pl-11 pr-4 rounded-full bg-[#f1f3f4] border border-transparent text-[#202124] placeholder:text-[#5f6368] text-xs focus:ring-2 focus:ring-[#1a73e8] focus:bg-white focus:border-[#1a73e8] outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & User Account Menu */}
        <div className="flex items-center gap-3 shrink-0">
          {onOpenSkeletonShowcase && (
            <button
              onClick={onOpenSkeletonShowcase}
              className="h-8 px-3 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] border border-[#c2e7ff] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
              title="Preview Google-Themed Skeleton Loading Animations"
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] google-dot-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] google-dot-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] google-dot-pulse" style={{ animationDelay: '300ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] google-dot-pulse" style={{ animationDelay: '450ms' }}></span>
              </div>
              <span className="hidden md:inline">Skeleton Feedback</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            {/* Google Services & Fast APIs Suite Hub Button */}
            <button
              onClick={onOpenFastApis}
              aria-label="Google Services and Fast APIs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#e8f0fe] via-[#f8fafd] to-[#e6f4ea] hover:from-[#d2e3fc] hover:to-[#ceead6] text-[#1a73e8] border border-[#c2e7ff] text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
              title="Google Cloud Services & Fast APIs Suite"
            >
              <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">cloud_sync</span>
              <span className="hidden sm:inline">Google Services & Fast APIs</span>
              <span className="sm:hidden">APIs</span>
            </button>

            {/* Bell Icon for Notifications */}
            <button
              onClick={onOpenNotifications}
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#1a73e8] transition-colors"
              title="View Notifications & Agent Updates"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EA4335] ring-2 ring-white"></span>
            </button>

            {/* Help and Documentation */}
            <button
              onClick={onOpenHelp}
              aria-label="Help and Documentation"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#1a73e8] transition-colors"
              title="Help, Guides & Diagnostics"
            >
              <span className="material-symbols-outlined text-[22px]">help_outline</span>
            </button>
          </div>

          <div className="h-7 w-px bg-[#dadce0] hidden sm:block"></div>

          {/* User profile: Opens Account Settings & Profile Popover */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full transition-all text-left group ${
                isProfileMenuOpen || activeTab === 'settings'
                  ? 'bg-[#e8f0fe] ring-2 ring-[#1a73e8]'
                  : 'hover:bg-[#f1f3f4]'
              }`}
              title="Account Menu & Settings"
            >
              <div className="relative shrink-0">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1a73e8]/30 group-hover:ring-[#1a73e8] transition-all"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMP95u9S8IqP9YrRkB5HIrmrLcJcfnuS62beEkMyv6euWTbYd0ppj3kNnNU-6LvBh2hdj88HDYoEIgpxcYpzhiZLLv4OUtuN4-G5jAAOjFcPnCLwXji0Ny65TkS8Wzxcl8NBqSrjaa25_vDsHbL1NhnwoNzBdOX-kwV9bJScXO1qPyc7I5v9Ro6DpG6TKK7BkNLAEaQrXzJRTwFFwFchrxDavfK58-pNlyq2lxvlTLbNVwao-yOUhsNQ"
                />
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34A853] ring-2 ring-white"
                  title="Active"
                ></span>
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#202124] group-hover:text-[#1a73e8] leading-tight transition-colors">
                  Alex Rivera
                </span>
                <span className="text-[11px] text-[#5f6368] leading-none">Vertex AI Lead</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#5f6368] group-hover:text-[#1a73e8] transition-colors hidden sm:inline">
                {isProfileMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
            </button>

            {/* Interactive Google Account Settings Popover Card */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-92 rounded-3xl bg-white shadow-2xl border border-[#dadce0] p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Popover Header */}
                <div className="flex flex-col items-center text-center pb-4 border-b border-[#e3e8f5]">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] shadow-md">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMP95u9S8IqP9YrRkB5HIrmrLcJcfnuS62beEkMyv6euWTbYd0ppj3kNnNU-6LvBh2hdj88HDYoEIgpxcYpzhiZLLv4OUtuN4-G5jAAOjFcPnCLwXji0Ny65TkS8Wzxcl8NBqSrjaa25_vDsHbL1NhnwoNzBdOX-kwV9bJScXO1qPyc7I5v9Ro6DpG6TKK7BkNLAEaQrXzJRTwFFwFchrxDavfK58-pNlyq2lxvlTLbNVwao-yOUhsNQ"
                        alt="Alex Rivera"
                        className="w-full h-full rounded-full object-cover ring-2 ring-white"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#34A853] ring-2 ring-white"></span>
                  </div>

                  <h3 className="text-sm font-bold text-[#202124]">Alex Rivera</h3>
                  <p className="text-xs text-[#5f6368] font-mono mt-0.5">alex.rivera@vertex-cloud.dev</p>

                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Google Cloud Fellow • Vertex Lead
                  </div>

                  {/* Primary CTA: Open Account Settings */}
                  <button
                    onClick={() => {
                      onTabChange('settings');
                      setIsProfileMenuOpen(false);
                    }}
                    className="mt-3.5 w-full py-2.5 px-4 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                    Manage Account & Settings
                  </button>
                </div>

                {/* Quick Navigation Links */}
                <div className="py-2.5 space-y-1">
                  <button
                    onClick={() => {
                      onTabChange('home');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f3f4] text-xs font-medium text-[#3c4043] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-[#1a73e8]">person</span>
                      <span>View Learner Home & Bio</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-[#5f6368]">chevron_right</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('settings');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f3f4] text-xs font-medium text-[#3c4043] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-[#34A853]">cloud_sync</span>
                      <span>Google Cloud & Gemini Keys</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-[#5f6368]">chevron_right</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onOpenHelp) onOpenHelp();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f3f4] text-xs font-medium text-[#3c4043] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-[#FBBC04]">help_outline</span>
                      <span>Help & Documentation</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-[#5f6368]">chevron_right</span>
                  </button>
                </div>

                {/* Footer / Sign Out */}
                <div className="pt-3 border-t border-[#e3e8f5] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#5f6368]">GCP Tier: Enterprise</span>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onTabChange('settings');
                    }}
                    className="text-[#1a73e8] font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">settings</span>
                    All Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
