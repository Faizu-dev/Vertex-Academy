import React, { useState, useEffect } from 'react';
import { NavTab } from '../types';
import { api } from '../services/api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'defense' | 'ingestion' | 'skills' | 'cert' | 'system';
  unread: boolean;
  navTarget?: NavTab;
  badgeText: string;
  badgeClass: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Oral Defense Score Ready: 94 / 100',
    message: 'Dr. Kenneth Vance completed your S2S evaluation on High-Dimensional HNSW graphs. Grade: High Honors.',
    time: '12m ago',
    category: 'defense',
    unread: true,
    navTarget: 'oral-defense',
    badgeText: 'Oral Exam',
    badgeClass: 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]',
    icon: 'workspace_premium',
    iconColor: 'text-[#137333]',
    iconBg: 'bg-[#e6f4ea]',
  },
  {
    id: 'notif-2',
    title: 'Gemini 1.5 Pro Vector Ingestion Complete',
    message: '24 files processed into 18,420 multi-modal embeddings across us-central1 cluster.',
    time: '45m ago',
    category: 'ingestion',
    unread: true,
    navTarget: 'studio',
    badgeText: 'Vector DB',
    badgeClass: 'bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]',
    icon: 'auto_awesome',
    iconColor: 'text-[#1a73e8]',
    iconBg: 'bg-[#e8f0fe]',
  },
  {
    id: 'notif-3',
    title: 'Knowledge Graph Mastery Unlocked',
    message: 'You have mastered "Autonomous Multi-Agent Orchestration". Graph completion is now 82%.',
    time: '2h ago',
    category: 'skills',
    unread: true,
    navTarget: 'analytics',
    badgeText: 'Skill Graph',
    badgeClass: 'bg-[#fef7e0] text-[#b06000] border border-[#feefc3]',
    icon: 'hub',
    iconColor: 'text-[#b06000]',
    iconBg: 'bg-[#fef7e0]',
  },
  {
    id: 'notif-4',
    title: 'Self-Healing Retry Succeeded',
    message: 'EvaluationAgent automatically healed chunk overlap boundaries during ingestion test.',
    time: '4h ago',
    category: 'system',
    unread: false,
    navTarget: 'agent-logs',
    badgeText: 'Agent Trace',
    badgeClass: 'bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]',
    icon: 'receipt_long',
    iconColor: 'text-[#c5221f]',
    iconBg: 'bg-[#fce8e6]',
  },
  {
    id: 'notif-5',
    title: 'New Credential Issued: Vertex AI Architect',
    message: 'Official Google Cloud digital credential issued to Alex Rivera. Ready for verification ledger.',
    time: 'Yesterday',
    category: 'cert',
    unread: false,
    navTarget: 'home',
    badgeText: 'Credential',
    badgeClass: 'bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]',
    icon: 'verified',
    iconColor: 'text-[#1a73e8]',
    iconBg: 'bg-[#e8f0fe]',
  },
];

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: NavTab) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'defense' | 'ingestion'>('all');

  useEffect(() => {
    if (isOpen) {
      api.getNotifications()
        .then((data) => {
          if (data && data.length > 0) {
            setNotifications(data as AppNotification[]);
          }
        })
        .catch((err) => console.log('Could not fetch notifications from backend', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    api.markNotificationRead(notif.id).catch(() => {});
    if (notif.navTarget && onNavigate) {
      onNavigate(notif.navTarget);
      onClose();
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter === 'defense') return n.category === 'defense';
    if (filter === 'ingestion') return n.category === 'ingestion';
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-title"
      className="fixed inset-0 z-50 flex items-start justify-end sm:p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md sm:mt-16 sm:mr-6 bg-white sm:rounded-2xl shadow-2xl border border-[#dadce0] overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google 4-Color Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"></div>

        {/* Header */}
        <div className="p-4 border-b border-[#e3e8f5] flex items-center justify-between bg-gradient-to-r from-[#f8fafd] to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </div>
            <div>
              <h2 id="notifications-title" className="text-sm font-bold text-[#1f1f1f] flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#EA4335] text-white text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-[#5f6368]">Vertex AI Learning OS updates</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-[#1a73e8] hover:underline font-medium px-2 py-1 rounded hover:bg-[#e8f0fe]/50"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-[#f8fafd] border-b border-[#e3e8f5] flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'defense', label: 'Oral Exams' },
            { id: 'ingestion', label: 'Vector DB' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-[#1a73e8] text-white shadow-2xs'
                  : 'bg-white text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#1a73e8] border border-[#dadce0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f1f3f4]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center text-[#5f6368]">
              <div className="w-12 h-12 rounded-full bg-[#f1f3f4] flex items-center justify-center mb-2 text-[#727785]">
                <span className="material-symbols-outlined text-[24px]">notifications_off</span>
              </div>
              <span className="text-xs font-semibold text-[#1f1f1f]">No notifications</span>
              <span className="text-[11px] mt-1">All caught up! Check back after running new agent jobs.</span>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative group ${
                  item.unread ? 'bg-[#f4f8fe] hover:bg-[#ebf3fe]' : 'bg-white hover:bg-[#f8fafd]'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor} shadow-2xs`}
                >
                  <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        item.unread ? 'text-[#1a73e8] font-bold' : 'text-[#1f1f1f]'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#5f6368] shrink-0 font-mono">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-[#5f6368] leading-relaxed line-clamp-2">
                    {item.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${item.badgeClass}`}>
                      {item.badgeText}
                    </span>
                    {item.navTarget && (
                      <span className="text-[10px] font-semibold text-[#1a73e8] group-hover:underline flex items-center gap-0.5">
                        <span>Open</span>
                        <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Unread dot */}
                {item.unread && (
                  <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-[#1a73e8]"></span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-[#f8fafd] border-t border-[#e3e8f5] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#5f6368]">
              Cloud updates streamed in real-time
            </span>
            <button
              onClick={handleClearAll}
              className="text-[11px] text-[#c5221f] hover:underline font-semibold"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
