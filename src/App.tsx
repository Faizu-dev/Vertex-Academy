import React, { useState } from 'react';
import { NavTab } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StudioView } from './views/StudioView';
import { LearningPlayerView } from './views/LearningPlayerView';
import { DiscoveryView } from './views/DiscoveryView';
import { AnalyticsView } from './views/AnalyticsView';
import { OralDefenseView } from './views/OralDefenseView';
import { AgentLogsView } from './views/AgentLogsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('studio');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen google-mesh-bg text-[#1a1b1e] relative selection:bg-[#4285F4]/20 selection:text-[#1a73e8]">
      {/* Top Global Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Persistent Left Sidebar with 6 Google-colored items */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Routed Content Area */}
      <div className="pl-64 pt-[67px] min-h-screen flex flex-col">
        <main className="flex-1 w-full">
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
        </main>
      </div>
    </div>
  );
}
