import React from 'react';
import { StatsCard } from './StatsCard';
import { OverviewChart } from './OverviewChart';
import { RecentActivities } from './RecentActivities';
import { 
  Package, 
  PackageCheck, 
  ThumbsUp, 
  Users,
  Shield,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useDashboard } from '../hooks/useDashboard';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const { stats, chartData, topProducts, isLoading, isRefreshing, hasNewData, error, refresh } = useDashboard();

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-brand-accent animate-spin" />
        <span className="text-xs text-gray-400 font-semibold">Memuat statistik dashboard...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
        <AlertTriangle size={16} />
        <span>Gagal memuat statistik: {error || 'Data tidak ditemukan'}</span>
        <button 
          onClick={() => window.location.reload()} 
          className="ml-auto underline font-semibold hover:text-white"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // Format number to Indonesian format
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

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
        <div className="relative z-10 flex items-center gap-2 shrink-0">
          {/* Refresh Button dengan Indikator Data Baru */}
          <div className="relative">
            <button
              onClick={refresh}
              disabled={isRefreshing}
              title={hasNewData ? 'Ada data baru! Klik untuk memperbarui' : 'Perbarui data dashboard'}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                hasNewData
                  ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-accent shadow-[0_0_20px_rgba(163,230,53,0.25)] hover:bg-brand-primary/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <RefreshCw 
                size={11} 
                className={isRefreshing ? 'animate-spin' : hasNewData ? 'animate-bounce' : ''} 
              />
              <span>{isRefreshing ? 'Memperbarui...' : hasNewData ? 'Perbarui Data' : 'Sinkronisasi'}</span>

              {/* Badge indikator data baru */}
              {hasNewData && !isRefreshing && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-accent" />
                </span>
              )}
            </button>
          </div>

          {/* Status Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 shadow-lg shadow-brand-primary/5 backdrop-blur-md text-brand-accent">
            <Shield size={12} className="animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Akses: {user?.role || 'Admin'}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Produk" 
          value={formatNumber(stats.totalProducts)} 
          change={stats.totalProductsChange} 
          isPositive={!stats.totalProductsChange.startsWith('-')} 
          icon={Package} 
          glowColor="bg-[#4d7c0f]" 
          iconColor="text-[#a3e635] bg-[#4d7c0f]/15 border-[#4d7c0f]/30"
        />
        <StatsCard 
          title="Produk Aktif" 
          value={formatNumber(stats.activeProducts)} 
          change={stats.activeProductsChange} 
          isPositive={!stats.activeProductsChange.startsWith('-')} 
          icon={PackageCheck} 
          glowColor="bg-zinc-700" 
          iconColor="text-zinc-300 bg-white/5 border-white/10"
        />
        <StatsCard 
          title="Total Rekomendasi" 
          value={formatNumber(stats.totalRecommendations)} 
          change={stats.totalRecommendationsChange} 
          isPositive={!stats.totalRecommendationsChange.startsWith('-')} 
          icon={ThumbsUp} 
          glowColor="bg-[#4d7c0f]" 
          iconColor="text-[#a3e635] bg-[#4d7c0f]/10 border-[#4d7c0f]/20"
        />
        <StatsCard 
          title="Total Pengguna" 
          value={formatNumber(stats.totalUsers)} 
          change={stats.totalUsersChange} 
          isPositive={!stats.totalUsersChange.startsWith('-')} 
          icon={Users} 
          glowColor="bg-zinc-800" 
          iconColor="text-zinc-400 bg-white/5 border-white/5"
        />
      </div>

      {/* Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewChart chartData={chartData} />
        </div>
        <div>
          <RecentActivities topProducts={topProducts} />
        </div>
      </div>
    </div>
  );
};
