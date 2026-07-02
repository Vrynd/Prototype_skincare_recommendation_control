import { useState, useEffect, useCallback, useRef } from 'react';
import type { DashboardStats, RecommendationTrend, TopRecommendedProduct } from '../types';
import { dashboardService, getInitialCachedDashboard } from '../services/dashboardService';

const POLL_INTERVAL_MS = 60 * 1000; // Cek data baru setiap 60 detik

export const useDashboard = () => {
  // Inisialisasi synchronous dari cache agar tidak ada spinner saat berpindah menu
  const initialCache = getInitialCachedDashboard();

  const [stats, setStats] = useState<DashboardStats | null>(initialCache?.stats ?? null);
  const [chartData, setChartData] = useState<RecommendationTrend[]>(initialCache?.chartData ?? []);
  const [topProducts, setTopProducts] = useState<TopRecommendedProduct[]>(initialCache?.topProducts ?? []);
  // isLoading hanya true jika belum ada cache sama sekali (kunjungan pertama)
  const [isLoading, setIsLoading] = useState(!initialCache);
  const [error, setError] = useState<string | null>(null);
  // Indikator data baru terdeteksi dari database
  const [hasNewData, setHasNewData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    // Jika force refresh, invalidasi cache terlebih dahulu
    if (forceRefresh) {
      dashboardService.invalidateCache();
      setIsRefreshing(true);
    }

    // Cek apakah data sudah ada di state (dari cache sebelumnya), skip spinner
    const hasExistingData = statsRef.current !== null;
    if (!hasExistingData) {
      setIsLoading(true);
    }

    setError(null);
    try {
      const data = await dashboardService.getDashboardData();
      setStats(data.stats);
      setChartData(data.chartData);
      setTopProducts(data.topProducts);
      // Reset indikator data baru setelah berhasil refresh
      setHasNewData(false);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Gagal memuat data statistik dashboard.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Polling ringan di background untuk mendeteksi perubahan data di database
  useEffect(() => {
    const interval = setInterval(async () => {
      // Hanya cek jika sudah ada data cache sebagai acuan
      if (statsRef.current === null) return;
      try {
        const changed = await dashboardService.checkForNewData();
        if (changed) {
          setHasNewData(true);
        }
      } catch {
        // Abaikan error polling agar tidak mengganggu pengalaman pengguna
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stats,
    chartData,
    topProducts,
    isLoading,
    isRefreshing,
    hasNewData,
    error,
    refresh: () => fetchDashboardData(true),
  };
};
