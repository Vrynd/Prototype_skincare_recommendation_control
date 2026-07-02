export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalRecommendations: number;
  totalUsers: number;
  totalProductsChange: string;
  activeProductsChange: string;
  totalRecommendationsChange: string;
  totalUsersChange: string;
}

export interface RecommendationTrend {
  label: string;
  key: string;
  count: number;
}

export interface TopRecommendedProduct {
  brand: string;
  name: string;
  category: string;
  recsCount: number;
  trend: string;
  bpomNumber: string;
  isActive: boolean;
  spf?: number | null;
  paGrade?: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  chartData: RecommendationTrend[];
  topProducts: TopRecommendedProduct[];
}
