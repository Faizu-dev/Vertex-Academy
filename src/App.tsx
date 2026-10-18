import React, { useState } from 'react';
import { NavTab } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SkeletonShowcaseModal } from './components/SkeletonShowcaseModal';
import { NotificationsModal } from './components/NotificationsModal';
import { HelpCenterModal } from './components/HelpCenterModal';
import { HomeView } from './views/HomeView';
import { StudioView } from './views/StudioView';
import { LearningPlayerView } from './views/LearningPlayerView';
import { DiscoveryView } from './views/DiscoveryView';
import { AnalyticsView } from './views/AnalyticsView';
import { OralDefenseView } from './views/OralDefenseView';
import { AgentLogsView } from './views/AgentLogsView';
import { AccountSettingsView } from './views/AccountSettingsView';
import { BackendConnectionModal } from './components/BackendConnectionModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSkeletonModalOpen, setIsSkeletonModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFastApisOpen, setIsFastApisOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen google-mesh-bg text-[#1a1b1e] relative selection:bg-[#4285F4]/20 selection:text-[#1a73e8] overflow-x-hidden">
      {/* Top Global Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSkeletonShowcase={() => setIsSkeletonModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenFastApis={() => setIsFastApisOpen(true)}
      />

      {/* Google Cloud Services & Fast APIs Suite Hub Modal */}
      <BackendConnectionModal
        isOpen={isFastApisOpen}
        onClose={() => setIsFastApisOpen(false)}
      />

      {/* Notifications Drawer / Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={setActiveTab}
      />

      {/* Help & Documentation Modal */}
      <HelpCenterModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Unified Google Skeleton Showcase Modal */}
      <SkeletonShowcaseModal
        isOpen={isSkeletonModalOpen}
        onClose={() => setIsSkeletonModalOpen(false)}
      />

      {/* Persistent Left Sidebar with 7 Google-colored items & Collapse Toggle */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Routed Content Area with dynamic responsive padding */}
      <div
        className={`${
          isSidebarCollapsed ? 'pl-20' : 'pl-64'
        } pt-[67px] min-h-screen flex flex-col w-full max-w-full overflow-x-hidden transition-all duration-300`}
      >
        <main className="flex-1 w-full max-w-full min-w-0">
          {activeTab === 'home' && (
            <HomeView onNavigate={setActiveTab} />
          )}

          {activeTab === 'studio' && (
            <StudioView
              onNavigateToPlayer={() => setActiveTab('learning-player')}
              onNavigateToLogs={() => setActiveTab('agent-logs')}
            />
          )}

          {activeTab === 'my-courses' && (
            <DiscoveryView
              onSelectCourse={(_courseId) => setActiveTab('learning-player')}
              onOpenIngestionStudio={() => setActiveTab('studio')}
            />
          )}

          {activeTab === 'learning-player' && (
            <LearningPlayerView
              onBackToCourses={() => setActiveTab('my-courses')}
              onNavigateToOralDefense={() => setActiveTab('oral-defense')}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              onNavigateToPlayer={() => setActiveTab('learning-player')}
              onNavigateToOralDefense={() => setActiveTab('oral-defense')}
            />
          )}

          {activeTab === 'oral-defense' && (
            <OralDefenseView onBackToPlayer={() => setActiveTab('learning-player')} />
          )}

          {activeTab === 'agent-logs' && (
            <AgentLogsView onReplayInSandbox={() => setActiveTab('learning-player')} />
          )}

          {activeTab === 'settings' && (
            <AccountSettingsView onNavigate={setActiveTab} />
          )}
        </main>
      </div>
    </div>
  );
}
