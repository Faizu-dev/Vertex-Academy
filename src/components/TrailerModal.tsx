import React, { useState, useEffect } from 'react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onStartCourse?: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  title,
  onStartCourse,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(18);
  const totalDuration = 30;

  useEffect(() => {
    let interval: any;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= totalDuration ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const progressPercent = (currentTime / totalDuration) * 100;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2f3033]/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-[#efedf1] flex items-center justify-between border-b border-[#e3e2e6]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#005bbf] text-[22px]">smart_display</span>
            <h4 className="font-semibold text-[#1a1b1e] text-base truncate">
              {title} • AI Course Teaser
            </h4>
          </div>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e3e2e6] text-[#414754] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Video Player Emulation */}
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden group">
          <img
            className="w-full h-full object-cover opacity-80"
            alt="Trailer Video Frame"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_RFc2CENuu3Jdwc4YperO-smID1g4_bNWrtIzM3Pali2-WJ1E0pyIduvaecEfVA5xTTutYfTrqXdp_xhfcqVWM59LJbYwnsCdEHolO135xg1mgax4PloCcAyTlbReOgVDJYSGh3ttgcIJIqF5lQHmIM9PIc1_0lOohTA_Emij5erBKsJuchDS6ftqn-qEUejSvn9eenWcNyD48LRy3Wo6HqNnQePzlnRrRbyfWv8N8EM-mmUoAel2CQ"
          />

          {/* Top Overlays */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-medium">
              1080p 60fps • Gemini Video Synthesis
            </span>
            <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[11px] font-semibold tracking-wider">
              HD AUDIO
            </span>
          </div>

          {/* Center Play Button Overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-20 w-16 h-16 rounded-full bg-white/90 hover:bg-white text-[#005bbf] flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="material-symbols-outlined text-[36px] ml-0.5">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 z-10">
            {/* Scrubber */}
            <div
              className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setCurrentTime(Math.round(pos * totalDuration));
              }}
            >
              <div
                className="h-full bg-[#1a73e8] rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-white text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-[#adc7ff]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <span>
                  0:{currentTime < 10 ? `0${currentTime}` : currentTime} / 0:{totalDuration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Auto 60fps</span>
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
                <span className="material-symbols-outlined text-[18px]">fullscreen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info & Action Footer */}
        <div className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#e3e2e6]">
          <div className="flex flex-col text-xs text-[#414754]">
            <div className="flex items-center gap-1.5 text-[#006d3a] font-medium">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Synthesized by Gemini 1.5 Multi-Agent Engine</span>
            </div>
            <span className="text-[#727785] mt-0.5">
              Includes interactive voice companion, vector diagrams & micro-labs.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#efedf1] hover:bg-[#e3e2e6] text-[#1a1b1e] text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onClose();
                if (onStartCourse) onStartCourse();
              }}
              className="px-5 py-2 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>Start Course</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
