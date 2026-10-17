import React from 'react';

export type SkeletonVariant =
  | 'card'
  | 'metric'
  | 'table-row'
  | 'syllabus'
  | 'text'
  | 'avatar'
  | 'hero'
  | 'code'
  | 'graph'
  | 'custom';

export interface GoogleSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  lines?: number;
  className?: string;
  height?: string | number;
  width?: string | number;
  vibrant?: boolean;
  glowingBorder?: boolean;
  showBrandBadge?: boolean;
  message?: string;
  speed?: 'normal' | 'fast' | 'slow';
}

export const GoogleSkeleton: React.FC<GoogleSkeletonProps> = ({
  variant = 'card',
  count = 1,
  lines = 3,
  className = '',
  height,
  width,
  vibrant = false,
  glowingBorder = false,
  showBrandBadge = false,
  message = 'Fetching from Vertex AI...',
  speed = 'normal',
}) => {
  const items = Array.from({ length: Math.max(1, count) });
  const shimmerClass = vibrant ? 'google-skeleton-shimmer-vibrant' : 'google-skeleton-shimmer';
  const borderClass = glowingBorder ? 'google-skeleton-border' : '';
  const speedStyle =
    speed === 'fast'
      ? { animationDuration: '1.4s' }
      : speed === 'slow'
      ? { animationDuration: '3.2s' }
      : undefined;

  const renderSkeletonItem = (index: number) => {
    switch (variant) {
      case 'card':
        return (
          <div
            key={index}
            className={`glass-card rounded-3xl p-5 flex flex-col space-y-4 border border-[#e3e8f5] shadow-xs relative overflow-hidden ${borderClass} ${className}`}
          >
            {/* Top Media Thumbnail */}
            <div
              className={`relative w-full h-44 rounded-2xl ${shimmerClass} overflow-hidden`}
              style={speedStyle}
            >
              {/* Google 4-Color Floating Brand Pill */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md flex items-center gap-1.5 shadow-2xs border border-white/60">
                <span className="w-2 h-2 rounded-full bg-[#4285F4] google-dot-pulse"></span>
                <span
                  className="w-2 h-2 rounded-full bg-[#EA4335] google-dot-pulse"
                  style={{ animationDelay: '200ms' }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-[#FBBC04] google-dot-pulse"
                  style={{ animationDelay: '400ms' }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-[#34A853] google-dot-pulse"
                  style={{ animationDelay: '600ms' }}
                ></span>
                <span className="text-[10px] font-bold text-[#1a73e8] ml-0.5 tracking-tight">Vertex AI</span>
              </div>
            </div>

            {/* Meta & Title Lines */}
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-24 h-4 rounded-full ${shimmerClass}`}
                  style={speedStyle}
                ></div>
                <div
                  className={`w-16 h-4 rounded-full ${shimmerClass} opacity-75`}
                  style={speedStyle}
                ></div>
              </div>
              <div
                className={`w-11/12 h-5 rounded-lg ${shimmerClass}`}
                style={speedStyle}
              ></div>
              <div
                className={`w-4/5 h-3.5 rounded-lg ${shimmerClass} opacity-80`}
                style={speedStyle}
              ></div>
              <div
                className={`w-2/3 h-3.5 rounded-lg ${shimmerClass} opacity-70`}
                style={speedStyle}
              ></div>
            </div>

            {/* Instructor Footer & Action Buttons */}
            <div className="pt-3 border-t border-[#e3e8f5]/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${shimmerClass} shrink-0 ring-1 ring-[#4285F4]/20`}
                    style={speedStyle}
                  ></div>
                  <div className="space-y-1">
                    <div
                      className={`w-20 h-3 rounded-full ${shimmerClass}`}
                      style={speedStyle}
                    ></div>
                    <div
                      className={`w-14 h-2.5 rounded-full ${shimmerClass} opacity-70`}
                      style={speedStyle}
                    ></div>
                  </div>
                </div>
                <div
                  className={`w-16 h-5 rounded-full ${shimmerClass}`}
                  style={speedStyle}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div
                  className={`h-9 rounded-full ${shimmerClass}`}
                  style={speedStyle}
                ></div>
                <div
                  className={`h-9 rounded-full ${shimmerClass}`}
                  style={speedStyle}
                ></div>
              </div>
            </div>
          </div>
        );

      case 'metric':
        return (
          <div
            key={index}
            className={`p-6 rounded-3xl glass-card shadow-sm border border-[#e3e8f5] flex flex-col justify-between space-y-4 relative overflow-hidden ${borderClass} ${className}`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div
                  className={`w-28 h-3.5 rounded-full ${shimmerClass}`}
                  style={speedStyle}
                ></div>
                <div
                  className={`w-24 h-8 rounded-xl ${shimmerClass}`}
                  style={speedStyle}
                ></div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl ${shimmerClass} shrink-0 relative flex items-center justify-center`}
                style={speedStyle}
              >
                <div className="flex gap-0.5 opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]"></span>
                </div>
              </div>
            </div>

            {/* Bottom trend row */}
            <div className="pt-3 border-t border-[#e3e8f5] flex items-center justify-between">
              <div
                className={`w-32 h-3 rounded-full ${shimmerClass}`}
                style={speedStyle}
              ></div>
              <div
                className={`w-16 h-5 rounded-full ${shimmerClass}`}
                style={speedStyle}
              ></div>
            </div>
          </div>
        );

      case 'table-row':
        return (
          <tr key={index} className="border-b border-[#f1f3f4]">
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl ${shimmerClass} shrink-0`}
                  style={speedStyle}
                ></div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div
                    className={`w-48 h-3.5 rounded-md ${shimmerClass}`}
                    style={speedStyle}
                  ></div>
                  <div
                    className={`w-32 h-2.5 rounded-md ${shimmerClass} opacity-70`}
                    style={speedStyle}
                  ></div>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <div
                className={`w-16 h-5 rounded-full ${shimmerClass}`}
                style={speedStyle}
              ></div>
            </td>
            <td className="py-4 px-4">
              <div
                className={`w-28 h-3 rounded-md ${shimmerClass}`}
                style={speedStyle}
              ></div>
            </td>
            <td className="py-4 px-4">
              <div
                className={`w-24 h-3.5 rounded-md ${shimmerClass}`}
                style={speedStyle}
              ></div>
            </td>
            <td className="py-4 px-4">
              <div
                className={`w-20 h-5 rounded-full ${shimmerClass}`}
                style={speedStyle}
              ></div>
            </td>
            <td className="py-4 px-4 text-right">
              <div
                className={`w-16 h-7 rounded-full ${shimmerClass} ml-auto`}
                style={speedStyle}
              ></div>
            </td>
          </tr>
        );

      case 'syllabus':
        return (
          <div
            key={index}
            className={`p-4 rounded-2xl glass-card border border-[#e3e8f5] flex items-center justify-between gap-4 ${className}`}
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full ${shimmerClass} shrink-0 flex items-center justify-center font-bold text-xs`}
                style={speedStyle}
              ></div>
              <div className="space-y-1.5 flex-1">
                <div
                  className={`w-3/4 h-4 rounded-md ${shimmerClass}`}
                  style={speedStyle}
                ></div>
                <div
                  className={`w-1/2 h-3 rounded-md ${shimmerClass} opacity-75`}
                  style={speedStyle}
                ></div>
              </div>
            </div>
            <div
              className={`w-16 h-6 rounded-full ${shimmerClass} shrink-0`}
              style={speedStyle}
            ></div>
          </div>
        );

      case 'avatar':
        return (
          <div
            key={index}
            className={`relative rounded-full ${shimmerClass} p-1 ${className}`}
            style={{
              width: width || (height ? height : '48px'),
              height: height || (width ? width : '48px'),
              ...speedStyle,
            }}
          >
            <div className="w-full h-full rounded-full bg-white/70"></div>
          </div>
        );

      case 'text':
        return (
          <div key={index} className={`space-y-2.5 ${className}`}>
            {Array.from({ length: lines }).map((_, lIdx) => {
              const lineWidth =
                lIdx === 0
                  ? '100%'
                  : lIdx === lines - 1
                  ? '60%'
                  : `${Math.floor(75 + ((lIdx * 17) % 20))}%`;
              return (
                <div
                  key={lIdx}
                  className={`h-3.5 rounded-md ${shimmerClass}`}
                  style={{ width: lineWidth, ...speedStyle }}
                ></div>
              );
            })}
          </div>
        );

      case 'hero':
        return (
          <div
            key={index}
            className={`rounded-3xl p-8 ${shimmerClass} relative overflow-hidden space-y-4 border border-[#e3e8f5] ${borderClass} ${className}`}
            style={speedStyle}
          >
            <div className="w-48 h-6 rounded-full bg-white/60"></div>
            <div className="w-3/4 h-10 rounded-2xl bg-white/60"></div>
            <div className="w-1/2 h-4 rounded-xl bg-white/50"></div>
            <div className="flex gap-3 pt-3">
              <div className="w-36 h-9 rounded-full bg-white/60"></div>
              <div className="w-32 h-9 rounded-full bg-white/60"></div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div
            key={index}
            className={`rounded-2xl p-5 bg-[#1e2330] text-white/40 space-y-3 font-mono text-xs border border-white/10 ${className}`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EA4335]"></span>
                <span className="w-3 h-3 rounded-full bg-[#FBBC04]"></span>
                <span className="w-3 h-3 rounded-full bg-[#34A853]"></span>
              </div>
              <div className="w-28 h-3 rounded bg-white/20"></div>
            </div>
            <div className="space-y-2 pt-1">
              <div className="w-3/5 h-3.5 rounded bg-white/20"></div>
              <div className="w-4/5 h-3.5 rounded bg-white/15"></div>
              <div className="w-2/5 h-3.5 rounded bg-white/20"></div>
              <div className="w-5/6 h-3.5 rounded bg-white/15"></div>
              <div className="w-1/2 h-3.5 rounded bg-white/20"></div>
            </div>
          </div>
        );

      case 'graph':
        return (
          <div
            key={index}
            className={`relative rounded-3xl p-8 glass-card border border-[#e3e8f5] h-96 flex items-center justify-center overflow-hidden ${className}`}
          >
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 opacity-40 google-mesh-bg"></div>

            {/* Connecting Lines in Google Colors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="25%" y1="35%" x2="50%" y2="50%" stroke="#4285F4" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="75%" y1="35%" x2="50%" y2="50%" stroke="#EA4335" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="30%" y1="70%" x2="50%" y2="50%" stroke="#FBBC04" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="70%" y1="70%" x2="50%" y2="50%" stroke="#34A853" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Floating Nodes */}
            <div className="absolute top-[30%] left-[22%] w-16 h-16 rounded-2xl glass-card border border-[#4285F4] flex items-center justify-center shadow-md animate-pulse">
              <span className="w-4 h-4 rounded-full bg-[#4285F4]"></span>
            </div>
            <div className="absolute top-[30%] right-[22%] w-16 h-16 rounded-2xl glass-card border border-[#EA4335] flex items-center justify-center shadow-md animate-pulse" style={{ animationDelay: '300ms' }}>
              <span className="w-4 h-4 rounded-full bg-[#EA4335]"></span>
            </div>
            <div className="relative z-10 w-24 h-24 rounded-3xl glass-card border-2 border-[#1a73e8] flex flex-col items-center justify-center shadow-xl google-skeleton-border">
              <div className="flex gap-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#4285F4] google-dot-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-[#EA4335] google-dot-pulse" style={{ animationDelay: '200ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-[#FBBC04] google-dot-pulse" style={{ animationDelay: '400ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-[#34A853] google-dot-pulse" style={{ animationDelay: '600ms' }}></span>
              </div>
              <span className="text-[10px] font-bold text-[#1a73e8]">Vertex Graph</span>
            </div>
            <div className="absolute bottom-[25%] left-[26%] w-16 h-16 rounded-2xl glass-card border border-[#FBBC04] flex items-center justify-center shadow-md animate-pulse" style={{ animationDelay: '600ms' }}>
              <span className="w-4 h-4 rounded-full bg-[#FBBC04]"></span>
            </div>
            <div className="absolute bottom-[25%] right-[26%] w-16 h-16 rounded-2xl glass-card border border-[#34A853] flex items-center justify-center shadow-md animate-pulse" style={{ animationDelay: '900ms' }}>
              <span className="w-4 h-4 rounded-full bg-[#34A853]"></span>
            </div>
          </div>
        );

      case 'custom':
      default:
        return (
          <div
            key={index}
            className={`rounded-2xl ${shimmerClass} ${className}`}
            style={{ width: width || '100%', height: height || '120px', ...speedStyle }}
          ></div>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Brand Badge Overlay */}
      {showBrandBadge && (
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#c2e7ff] text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4285F4] google-dot-pulse"></span>
            <span
              className="w-2 h-2 rounded-full bg-[#EA4335] google-dot-pulse"
              style={{ animationDelay: '200ms' }}
            ></span>
            <span
              className="w-2 h-2 rounded-full bg-[#FBBC04] google-dot-pulse"
              style={{ animationDelay: '400ms' }}
            ></span>
            <span
              className="w-2 h-2 rounded-full bg-[#34A853] google-dot-pulse"
              style={{ animationDelay: '600ms' }}
            ></span>
          </div>
          <span className="text-[#1f1f1f]">{message}</span>
        </div>
      )}

      {/* Render Items */}
      {variant === 'table-row' ? (
        <tbody>{items.map((_, idx) => renderSkeletonItem(idx))}</tbody>
      ) : variant === 'card' && count > 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((_, idx) => renderSkeletonItem(idx))}
        </div>
      ) : variant === 'metric' && count > 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {items.map((_, idx) => renderSkeletonItem(idx))}
        </div>
      ) : variant === 'syllabus' && count > 1 ? (
        <div className="space-y-3">
          {items.map((_, idx) => renderSkeletonItem(idx))}
        </div>
      ) : (
        items.map((_, idx) => renderSkeletonItem(idx))
      )}
    </div>
  );
};

/* Convenience Subcomponents */
export const GoogleCardSkeleton: React.FC<{
  count?: number;
  className?: string;
  vibrant?: boolean;
}> = ({ count = 3, className = '', vibrant = false }) => (
  <GoogleSkeleton variant="card" count={count} className={className} vibrant={vibrant} />
);

export const GoogleMetricSkeleton: React.FC<{
  count?: number;
  className?: string;
  vibrant?: boolean;
}> = ({ count = 4, className = '', vibrant = false }) => (
  <GoogleSkeleton variant="metric" count={count} className={className} vibrant={vibrant} />
);

export const GoogleTableRowSkeleton: React.FC<{
  count?: number;
  vibrant?: boolean;
}> = ({ count = 4, vibrant = false }) => (
  <GoogleSkeleton variant="table-row" count={count} vibrant={vibrant} />
);

export const GoogleModuleListSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 4, className = '' }) => (
  <GoogleSkeleton variant="syllabus" count={count} className={className} />
);

export const GoogleTextSkeleton: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <GoogleSkeleton variant="text" lines={lines} className={className} />
);

export const GoogleHeroSkeleton: React.FC<{
  className?: string;
}> = ({ className = '' }) => <GoogleSkeleton variant="hero" className={className} />;

export const GoogleGraphSkeleton: React.FC<{
  className?: string;
}> = ({ className = '' }) => <GoogleSkeleton variant="graph" className={className} />;

export const GoogleCodeSkeleton: React.FC<{
  className?: string;
}> = ({ className = '' }) => <GoogleSkeleton variant="code" className={className} />;

export const GoogleAvatarSkeleton: React.FC<{
  size?: number | string;
  className?: string;
}> = ({ size = 48, className = '' }) => (
  <GoogleSkeleton variant="avatar" width={size} height={size} className={className} />
);

export const GoogleLoadingIndicator: React.FC<{
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  message = 'Loading from Vertex AI...',
  size = 'md',
  className = '',
}) => {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';
  const textSize = size === 'sm' ? 'text-[11px]' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#c2e7ff] shadow-sm ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`${dotSize} rounded-full bg-[#4285F4] google-dot-pulse`}></span>
        <span
          className={`${dotSize} rounded-full bg-[#EA4335] google-dot-pulse`}
          style={{ animationDelay: '200ms' }}
        ></span>
        <span
          className={`${dotSize} rounded-full bg-[#FBBC04] google-dot-pulse`}
          style={{ animationDelay: '400ms' }}
        ></span>
        <span
          className={`${dotSize} rounded-full bg-[#34A853] google-dot-pulse`}
          style={{ animationDelay: '600ms' }}
        ></span>
      </div>
      <span className={`${textSize} font-bold text-[#1f1f1f]`}>{message}</span>
    </div>
  );
};
