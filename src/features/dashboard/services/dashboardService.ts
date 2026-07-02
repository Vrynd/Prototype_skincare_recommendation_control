import { supabase } from '../../../utils/supabase';
import type { DashboardData, RecommendationTrend, TopRecommendedProduct } from '../types';

export const dashboardService = {
  /**
   * Mengambil semua data ringkasan statistik, tren, dan produk populer untuk dashboard
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      // 1. Ambil hitungan total produk
      const { count: totalProductsCount, error: errTotalProd } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (errTotalProd) throw errTotalProd;

      // 2. Ambil hitungan produk aktif
      const { count: activeProductsCount, error: errActiveProd } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (errActiveProd) throw errActiveProd;

      // 3. Ambil hitungan sesi rekomendasi
      const { count: totalRecommendationsCount, error: errRec } = await supabase
        .from('recommendation_sessions')
        .select('*', { count: 'exact', head: true });

      if (errRec) throw errRec;

      // 4. Ambil hitungan pengguna (role = user)
      const { count: totalUsersCount, error: errUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user');

      if (errUsers) throw errUsers;

      // 5. Ambil data tren rekomendasi (7 bulan terakhir)
      const { data: sessions, error: errSessions } = await supabase
        .from('recommendation_sessions')
        .select('created_at');

      if (errSessions) throw errSessions;

      const chartData = this.calculateMonthlyTrend(sessions || []);

      // 6. Ambil produk yang paling banyak direkomendasikan
      const { data: recResults, error: errRecResults } = await supabase
        .from('recommendation_results')
        .select(`
          product_id,
          products (
            brand_name,
            product_name,
            texture
          )
        `);

      if (errRecResults) throw errRecResults;

      const topProducts = this.calculateTopProducts(recResults || []);

      // 7. Hitung persentase pertumbuhan dinamis (30 hari terakhir vs 30 hari sebelumnya)
      const { totalProdChange, activeProdChange, recsChange, usersChange } = 
        await this.calculateGrowthPercentages();

      return {
        stats: {
          totalProducts: totalProductsCount || 0,
          activeProducts: activeProductsCount || 0,
          totalRecommendations: totalRecommendationsCount || 0,
          totalUsers: totalUsersCount || 0,
          totalProductsChange: totalProdChange,
          activeProductsChange: activeProdChange,
          totalRecommendationsChange: recsChange,
          totalUsersChange: usersChange,
        },
        chartData,
        topProducts,
      };
    } catch (err) {
      console.error('[DashboardService] Gagal memuat data dashboard:', err);
      throw err;
    }
  },

  /**
   * Menghitung tren rekomendasi bulanan untuk seluruh 12 bulan di tahun berjalan
   */
  calculateMonthlyTrend(sessions: any[]): RecommendationTrend[] {
    const months: RecommendationTrend[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYear = new Date().getFullYear();

    // Buat daftar 12 bulan untuk tahun berjalan
    for (let m = 0; m < 12; m++) {
      months.push({
        label: monthNames[m],
        key: `${currentYear}-${String(m + 1).padStart(2, '0')}`,
        count: 0,
      });
    }

    // Kelompokkan sesi ke dalam bulan yang sesuai
    sessions.forEach((s) => {
      if (!s.created_at) return;
      const date = new Date(s.created_at);
      // Hanya masukkan jika tahunnya sama dengan tahun berjalan
      if (date.getFullYear() === currentYear) {
        const key = `${currentYear}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const found = months.find((m) => m.key === key);
        if (found) {
          found.count += 1;
        }
      }
    });

    return months;
  },

  /**
   * Menghitung produk yang paling banyak direkomendasikan
   */
  calculateTopProducts(results: any[]): TopRecommendedProduct[] {
    const counts: Record<string, { brand: string; name: string; category: string; recsCount: number }> = {};

    results.forEach((row) => {
      const prod = row.products;
      if (!prod) return;
      const key = row.product_id;

      if (!counts[key]) {
        counts[key] = {
          brand: prod.brand_name || 'Unknown',
          name: prod.product_name || 'Product',
          category: prod.texture || 'Skincare',
          recsCount: 0,
        };
      }
      counts[key].recsCount += 1;
    });

    // Urutkan berdasarkan hitungan rekomendasi terbanyak
    const sorted = Object.values(counts)
      .sort((a, b) => b.recsCount - a.recsCount)
      .slice(0, 4);

    // Map ke type TopRecommendedProduct dengan trend statis/semi-dinamis
    return sorted.map((p, idx) => {
      // Simulasikan tren penurunan/kenaikan berdasarkan peringkat
      const trends = ['+18%', '+12%', '+8%', '+5%'];
      return {
        brand: p.brand,
        name: p.name,
        category: p.category,
        recsCount: p.recsCount,
        trend: trends[idx] || '+2%',
      };
    });
  },

  /**
   * Menghitung persentase pertumbuhan dinamis (30 hari terakhir vs 30 hari sebelumnya)
   */
  async calculateGrowthPercentages() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

    try {
      // Pembantu untuk menghitung pertumbuhan
      const getGrowth = (current: number, previous: number): string => {
        if (previous === 0) {
          return current > 0 ? '+100%' : '+0%';
        }
        const pct = ((current - previous) / previous) * 100;
        const sign = pct >= 0 ? '+' : '';
        return `${sign}${pct.toFixed(1)}%`;
      };

      // 1. Pertumbuhan Rekomendasi
      const { data: recsNow } = await supabase
        .from('recommendation_sessions')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo);

      const { data: recsPrev } = await supabase
        .from('recommendation_sessions')
        .select('created_at')
        .gte('created_at', sixtyDaysAgo)
        .lt('created_at', thirtyDaysAgo);

      const recsChange = getGrowth(recsNow?.length || 0, recsPrev?.length || 0);

      // 2. Pertumbuhan Pengguna
      const { data: usersNow } = await supabase
        .from('users')
        .select('created_at')
        .eq('role', 'user')
        .gte('created_at', thirtyDaysAgo);

      const { data: usersPrev } = await supabase
        .from('users')
        .select('created_at')
        .eq('role', 'user')
        .gte('created_at', sixtyDaysAgo)
        .lt('created_at', thirtyDaysAgo);

      const usersChange = getGrowth(usersNow?.length || 0, usersPrev?.length || 0);

      // 3. Pertumbuhan Produk
      const { data: prodNow } = await supabase
        .from('products')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo);

      const { data: prodPrev } = await supabase
        .from('products')
        .select('created_at')
        .gte('created_at', sixtyDaysAgo)
        .lt('created_at', thirtyDaysAgo);

      const totalProdChange = getGrowth(prodNow?.length || 0, prodPrev?.length || 0);

      // 4. Pertumbuhan Produk Aktif
      const { data: actNow } = await supabase
        .from('products')
        .select('created_at')
        .eq('is_active', true)
        .gte('created_at', thirtyDaysAgo);

      const { data: actPrev } = await supabase
        .from('products')
        .select('created_at')
        .eq('is_active', true)
        .gte('created_at', sixtyDaysAgo)
        .lt('created_at', thirtyDaysAgo);

      const activeProdChange = getGrowth(actNow?.length || 0, actPrev?.length || 0);

      return {
        totalProdChange,
        activeProdChange,
        recsChange,
        usersChange,
      };
    } catch {
      // Fallback jika perhitungan gagal
      return {
        totalProdChange: '+0%',
        activeProdChange: '+0%',
        recsChange: '+0%',
        usersChange: '+0%',
      };
    }
  }
};
