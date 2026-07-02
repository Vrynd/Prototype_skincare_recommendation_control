import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats, RecommendationTrend, TopRecommendedProduct } from '../types';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<RecommendationTrend[]>([]);
  const [topProducts, setTopProducts] = useState<TopRecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardData();
      setStats(data.stats);
      setChartData(data.chartData);
      setTopProducts(data.topProducts);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Gagal memuat data statistik dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    chartData,
    topProducts,
    isLoading,
    error,
    refresh: fetchDashboardData,
  };
};
