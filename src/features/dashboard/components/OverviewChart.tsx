import React from 'react';

export const OverviewChart: React.FC = () => {
  // Chart coordinates representing data points over months (Nov 2025 - Mei 2026)
  const points = "0,140 133,120 266,135 400,95 533,75 666,45 800,20";
  const areaPoints = `0,200 ${points} 800,200`;

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display font-bold text-base text-white">Ikhtisar Rekomendasi</h3>
          <p className="text-xs text-gray-400">Tren volume rekomendasi produk skincare yang diberikan kepada pengguna</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary bg-glow-accent animate-pulse" />
            <span className="text-gray-300">Volume Rekomendasi</span>
          </div>
        </div>
      </div>

      {/* SVG Vector Chart */}
      <div className="w-full h-52 relative mt-4">
        <svg 
          viewBox="0 0 800 200" 
          className="w-full h-full overflow-visible" 
          preserveAspectRatio="none"
        >
          <defs>
            {/* Area Fading Gradient (Subtle Lime Green Fade) */}
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A3E635" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#A3E635" stopOpacity="0.00" />
            </linearGradient>
            
            {/* Line Gradient (Forest Green to Lime Green) */}
            <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4D7C0F" />
              <stop offset="100%" stopColor="#A3E635" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {/* Area under the chart line */}
          <polygon points={areaPoints} fill="url(#area-grad)" />

          {/* Glowing background line */}
          <polyline 
            fill="none" 
            stroke="url(#line-grad)" 
            strokeWidth="4" 
            points={points} 
            filter="url(#glow)"
            className="opacity-20"
          />

          {/* Sharp foreground line */}
          <polyline 
            fill="none" 
            stroke="url(#line-grad)" 
            strokeWidth="3.5" 
            points={points} 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Tooltip Dots */}
          {[
            { x: 0, y: 140, label: 'November: 120 Rekomendasi' },
            { x: 133, y: 120, label: 'Desember: 150 Rekomendasi' },
            { x: 266, y: 135, label: 'Januari: 130 Rekomendasi' },
            { x: 400, y: 95, label: 'Februari: 190 Rekomendasi' },
            { x: 533, y: 75, label: 'Maret: 220 Rekomendasi' },
            { x: 666, y: 45, label: 'April: 310 Rekomendasi' },
            { x: 800, y: 20, label: 'Mei: 380 Rekomendasi' }
          ].map((pt, idx) => (
            <g key={idx} className="group/dot cursor-pointer">
              <title>{pt.label}</title>
              <circle 
                cx={pt.x} 
                cy={pt.y} 
                r="7" 
                fill="#000000" 
                stroke="#A3E635" 
                strokeWidth="2.5"
                className="transition-all duration-300 group-hover/dot:r-9 group-hover/dot:stroke-white" 
              />
              <circle 
                cx={pt.x} 
                cy={pt.y} 
                r="3" 
                fill="#A3E635" 
              />
            </g>
          ))}
        </svg>
      </div>

      {/* X-Axis labels */}
      <div className="flex justify-between items-center px-2 mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
        <span>Nov</span>
        <span>Des</span>
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>Mei</span>
      </div>
    </div>
  );
};
