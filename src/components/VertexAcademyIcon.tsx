import React from 'react';

interface VertexAcademyIconProps {
  size?: number | string;
  className?: string;
  animated?: boolean;
}

export const VertexAcademyIcon: React.FC<VertexAcademyIconProps> = ({
  size = 36,
  className = '',
  animated = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="Vertex Academy"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-sm transition-transform ${
          animated ? 'hover:scale-110 duration-300' : ''
        }`}
      >
        <defs>
          {/* Google 4-Color Gradients with deep dimensional vertex lighting */}
          <linearGradient id="va-blue-grad" x1="6" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="100%" stopColor="#1a73e8" />
          </linearGradient>

          <linearGradient id="va-red-grad" x1="24" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EA4335" />
            <stop offset="100%" stopColor="#d93025" />
          </linearGradient>

          <linearGradient id="va-yellow-grad" x1="12" y1="6" x2="36" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBC04" />
            <stop offset="100%" stopColor="#f29900" />
          </linearGradient>

          <linearGradient id="va-green-grad" x1="16" y1="32" x2="32" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34A853" />
            <stop offset="100%" stopColor="#188038" />
          </linearGradient>

          <linearGradient id="va-core-prism" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#d8e2ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1a73e8" stopOpacity="0.2" />
          </linearGradient>

          <radialGradient id="va-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#4285F4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Prism Backing */}
        <polygon
          points="24,6 40,16 34,40 14,40 8,16"
          fill="#1f1f1f"
          fillOpacity="0.04"
        />

        {/* Vertex Left Wing (Google Blue #4285F4) */}
        <path
          d="M24 8L8 18L15 38L24 44L24 24Z"
          fill="url(#va-blue-grad)"
          fillOpacity="0.95"
        />

        {/* Vertex Right Wing (Google Red #EA4335) */}
        <path
          d="M24 8L40 18L33 38L24 44L24 24Z"
          fill="url(#va-red-grad)"
          fillOpacity="0.95"
        />

        {/* Vertex Top Facet (Google Yellow #FBBC04) */}
        <polygon
          points="24,8 40,18 24,24 8,18"
          fill="url(#va-yellow-grad)"
          fillOpacity="0.92"
        />

        {/* Vertex Bottom Keystone (Google Green #34A853) */}
        <polygon
          points="24,24 33,38 24,44 15,38"
          fill="url(#va-green-grad)"
          fillOpacity="0.96"
        />

        {/* Central Geometric Prism Core Reflex */}
        <polygon
          points="24,14 31,22 24,32 17,22"
          fill="url(#va-core-prism)"
        />

        {/* Vertex Nodes (The 4 Knowledge Vertices) */}
        {/* Top Node */}
        <circle cx="24" cy="8" r="3" fill="#ffffff" stroke="#FBBC04" strokeWidth="1.5" />
        {/* Left Node */}
        <circle cx="8" cy="18" r="3" fill="#ffffff" stroke="#4285F4" strokeWidth="1.5" />
        {/* Right Node */}
        <circle cx="40" cy="18" r="3" fill="#ffffff" stroke="#EA4335" strokeWidth="1.5" />
        {/* Bottom Apex Node */}
        <circle cx="24" cy="44" r="3.2" fill="#ffffff" stroke="#34A853" strokeWidth="1.5" />

        {/* Center Quantum Pulse Spark */}
        <circle cx="24" cy="24" r="2" fill="#ffffff" />
        <circle cx="24" cy="24" r="4" fill="url(#va-center-glow)" />
      </svg>
    </div>
  );
};
