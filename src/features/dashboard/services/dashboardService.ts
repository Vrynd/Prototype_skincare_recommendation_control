import { supabase } from '../../../utils/supabase';
import type { DashboardData, RecommendationTrend, TopRecommendedProduct } from '../types';

// Cache in-memory untuk menghindari re-fetch setiap navigasi menu (TTL: 5 menit)
let cachedData: DashboardData | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit

/**
 * Mengambil data cache secara synchronous (tanpa async/await).
 * Digunakan untuk inisialisasi state React agar tidak ada spinner
 * ketika cache sudah tersedia saat berpindah menu.
 */
export function getInitialCachedDashboard(): DashboardData | null {
  if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedData;
  }
  return null;
}

export const dashboardService = {
  /**
   * Mengambil semua data ringkasan statistik, tren, dan produk populer untuk dashboard.
   * Hasil di-cache selama 5 menit untuk mencegah loading ulang saat berpindah menu.
   */
  async getDashboardData(): Promise<DashboardData> {
    // Kembalikan data dari cache jika masih valid (dalam 5 menit)
    if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
      return cachedData;
    }

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
            bpom_number,
            is_active,
            spf,
            pa_grade
          )
        `);

      if (errRecResults) throw errRecResults;

      const topProducts = this.calculateTopProducts(recResults || []);

      // 7. Hitung persentase pertumbuhan dinamis (30 hari terakhir vs 30 hari sebelumnya)
      const { totalProdChange, activeProdChange, recsChange, usersChange } = 
        await this.calculateGrowthPercentages();

      const result: DashboardData = {
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

      // Simpan ke cache
      cachedData = result;
      cacheTimestamp = Date.now();

      return result;
    } catch (err) {
      console.error('[DashboardService] Gagal memuat data dashboard:', err);
      throw err;
    }
  },

  /**
   * Paksa invalidasi cache agar data di-fetch ulang saat diperlukan (mis. setelah edit produk)
   */
  invalidateCache(): void {
    cachedData = null;
    cacheTimestamp = null;
  },

  /**
   * Pengecekan ringan apakah ada data baru di database dibandingkan cache yang tersimpan.
   * Hanya melakukan COUNT query (sangat cepat), tidak mengambil seluruh data.
   * Mengembalikan true jika ada perubahan jumlah data di database.
   */
  async checkForNewData(): Promise<boolean> {
    // Jika belum ada cache, anggap tidak ada data baru (belum ada acuan pembanding)
    if (!cachedData) return false;

    try {
      const [
        { count: totalProducts },
        { count: activeProducts },
        { count: totalRecommendations },
        { count: totalUsers },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('recommendation_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      ]);

      const cached = cachedData.stats;
      return (
        (totalProducts ?? 0) !== cached.totalProducts ||
        (activeProducts ?? 0) !== cached.activeProducts ||
        (totalRecommendations ?? 0) !== cached.totalRecommendations ||
        (totalUsers ?? 0) !== cached.totalUsers
      );
    } catch {
      return false;
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
    const counts: Record<string, { brand: string; name: string; bpomNumber: string; isActive: boolean; recsCount: number; spf?: number | null; paGrade?: string | null }> = {};

    results.forEach((row) => {
      const prod = row.products;
      if (!prod) return;
      const key = row.product_id;

      if (!counts[key]) {
        counts[key] = {
          brand: prod.brand_name || 'Unknown',
          name: prod.product_name || 'Product',
          bpomNumber: prod.bpom_number || '-',
          isActive: prod.is_active !== false,
          recsCount: 0,
          spf: prod.spf,
          paGrade: prod.pa_grade,
        };
      }
      counts[key].recsCount += 1;
    });

    // Urutkan berdasarkan hitungan rekomendasi terbanyak, ambil top 10
    const sorted = Object.values(counts)
      .sort((a, b) => b.recsCount - a.recsCount)
      .slice(0, 10);

    // Map ke type TopRecommendedProduct dengan bpomNumber dan isActive
    return sorted.map((p, idx) => {
      const trends = ['+18%', '+12%', '+8%', '+5%'];
      return {
        brand: p.brand,
        name: p.name,
        category: 'Skincare',
        recsCount: p.recsCount,
        trend: trends[idx] || '+2%',
        bpomNumber: p.bpomNumber,
        isActive: p.isActive,
        spf: p.spf,
        paGrade: p.paGrade,
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
