import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { RecommendationTrend } from '../types';

interface OverviewChartProps {
  chartData?: RecommendationTrend[];
}

export const OverviewChart: React.FC<OverviewChartProps> = ({ chartData = [] }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Format data tampilan bulanan beserta jumlah rekomendasi
  const displayData = chartData.map((d) => ({
    month: d.label,
    label: `${d.label}: ${d.count} Rekomendasi`,
    count: d.count
  }));

  // Hitung nilai maksimum untuk proporsi tinggi capsule (minimal 10 agar visual proporsional)
  const maxVal = displayData.length > 0 
    ? Math.max(...displayData.map(d => d.count), 10) 
    : 10;

  // Fungsi untuk menggulir kontainer chart ke kiri dan kanan pada perangkat mobile
  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 150;
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 150;
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display font-bold text-base text-white">Ikhtisar Rekomendasi</h3>
        </div>
        {/* Tombol navigasi slide prev/next pengganti volume indicator */}
        <div className="flex items-center gap-1.5 z-10">
          <button 
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
            title="Sebelumnya"
          >
            <ChevronLeft size={13} />
          </button>
          <button 
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
            title="Selanjutnya"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Scrollable Container (terutama berguna di mobile saat capsule diperlebar) */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth scrollbar-none pb-1"
      >
        {/* Kontainer dengan lebar minimum agar capsule tidak gepeng di mobile */}
        <div className="min-w-162.5 md:min-w-0">
          {/* Capsule Pipes Chart - Padding dikurangi, margin top dihilangkan, tinggi h-56 */}
          {/* Capsule Pipes Chart - Padding dikurangi, margin top dihilangkan, tinggi h-56, diselaraskan jaraknya */}
          <div className="flex justify-between items-end h-56 pt-2 px-0 relative gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {displayData.map((d, idx) => {
              const count = d.count;
              const percentage = maxVal > 0 ? (count / maxVal) * 100 : 0;
              
              return (
                <div key={idx} className="flex flex-col items-center flex-1 group/capsule relative h-full">
                  {/* Floating Tooltip */}
                  <div className="absolute -top-10 opacity-0 scale-95 group-hover/capsule:opacity-100 group-hover/capsule:scale-100 transition-all duration-200 z-20 pointer-events-none">
                    <div className="bg-slate-950 border border-white/10 px-3 py-1.5 rounded-xl shadow-2xl text-[10px] text-gray-200 font-bold whitespace-nowrap">
                      {d.label}
                    </div>
                  </div>

                  {/* Capsule Outer Container - Lebar desktop sedikit diperlebar (md:w-8 lg:w-9) agar visual mantap */}
                  <div 
                    className={`w-10 sm:w-11 md:w-8 lg:w-9 h-full rounded-full border transition-all duration-300 relative overflow-hidden flex flex-col justify-end bg-slate-900/60 shadow-inner ${
                      count > 0 
                        ? 'border-brand-primary/20 hover:border-brand-primary/45' 
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {count === 0 ? (
                      /* Hatched/striped background pattern representing no activity */
                      <div 
                        className="absolute inset-0 w-full h-full opacity-15"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15) 2px, transparent 2px, transparent 10px)'
                        }}
                      />
                    ) : (
                      <>
                        {/* Vertical Dashed Center Line (as in reference) */}
                        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px border-l border-dashed border-white/10 pointer-events-none" />
                        
                        {/* Brand primary/accent gradient fill from bottom up */}
                        <div 
                          className="w-full rounded-full bg-linear-to-t from-brand-primary/80 to-brand-accent shadow-[0_0_15px_rgba(163,230,53,0.25)] relative transition-all duration-700 ease-out flex items-end justify-center pb-2"
                          style={{ height: `${percentage}%` }}
                        >
                          {/* White indicator dot at the top of the fill (as in reference) */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff] z-10 animate-pulse" />
                          
                          {percentage > 18 && (
                            <span className="text-[8px] sm:text-[9px] font-black text-brand-bg select-none z-10 pb-0.5">
                              {count}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis labels - Padding dan gap diselaraskan dengan chart di atasnya */}
          <div className="flex justify-between items-center px-0 mt-4 text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {displayData.map((d, idx) => (
              <span key={idx} className="flex-1 text-center truncate">{d.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
