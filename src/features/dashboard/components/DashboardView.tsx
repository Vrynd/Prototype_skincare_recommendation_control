import React from 'react';
import { StatsCard } from './StatsCard';
import { OverviewChart } from './OverviewChart';
import { RecentActivities } from './RecentActivities';
import { 
  Package, 
  PackageCheck, 
  ThumbsUp, 
  Users,
  Shield 
} from 'lucide-react';
import { useAuth } from '../../auth';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner - Redesigned Premium */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/8 shadow-2xl group transition-all duration-500 hover:border-brand-primary/30">
        {/* Background gradient overlay with glow */}
        <div className="absolute inset-0 bg-linear-to-r from-brand-primary/15 via-brand-accent/5 to-transparent opacity-80" />
        <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-brand-primary/10 blur-[80px] pointer-events-none group-hover:bg-brand-primary/15 transition-all duration-500" />
        
        {/* Abstract SVG Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay">
          <svg width="100%" height="100%">
            <pattern id="banner-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#banner-grid)" />
          </svg>
        </div>

        {/* Text Contents */}
        <div className="relative z-10 text-center sm:text-left space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold font-display bg-linear-to-r from-white via-slate-100 to-brand-accent bg-clip-text text-transparent tracking-tight text-glow-accent select-none">
            Selamat datang kembali, {user?.name || 'Administrator'}!
          </h2>
          <p className="text-xs text-gray-400 font-medium max-w-xl leading-relaxed">
            Berikut adalah ringkasan sistem Anda hari ini. Seluruh database dan API tersinkronisasi dengan baik.
          </p>
        </div>

        {/* Tech-glowing Status Pill */}
        <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 shadow-lg shadow-brand-primary/5 backdrop-blur-md shrink-0 text-brand-accent">
          <Shield size={12} className="animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Akses: {user?.role || 'Admin'}</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Produk" 
          value="1,420" 
          change="8.2%" 
          isPositive={true} 
          icon={Package} 
          glowColor="bg-[#4d7c0f]" 
          iconColor="text-[#a3e635] bg-[#4d7c0f]/15 border-[#4d7c0f]/30"
        />
        <StatsCard 
          title="Produk Aktif" 
          value="1,280" 
          change="12.4%" 
          isPositive={true} 
          icon={PackageCheck} 
          glowColor="bg-zinc-700" 
          iconColor="text-zinc-300 bg-white/5 border-white/10"
        />
        <StatsCard 
          title="Total Rekomendasi" 
          value="456" 
          change="15.3%" 
          isPositive={true} 
          icon={ThumbsUp} 
          glowColor="bg-[#4d7c0f]" 
          iconColor="text-[#a3e635] bg-[#4d7c0f]/10 border-[#4d7c0f]/20"
        />
        <StatsCard 
          title="Total Pengguna" 
          value="2,350" 
          change="18.2%" 
          isPositive={true} 
          icon={Users} 
          glowColor="bg-zinc-800" 
          iconColor="text-zinc-400 bg-white/5 border-white/5"
        />
      </div>

      {/* Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};
