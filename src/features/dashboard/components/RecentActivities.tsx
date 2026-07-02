import React from 'react';
import { Sparkles, Flame, Crown, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TopRecommendedProduct } from '../types';

interface RecentActivitiesProps {
  topProducts?: TopRecommendedProduct[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ topProducts = [] }) => {
  const navigate = useNavigate();

  const defaultProducts = [
    {
      brand: 'Skintific',
      name: '5X Ceramide Barrier Moisture Gel',
      category: 'Moisturizer',
      recsCount: 142,
      trend: '+18%',
      icon: Crown,
      iconColor: 'text-[#a3e635] bg-[#4d7c0f]/15 border-[#4d7c0f]/30 shadow-md',
    },
    {
      brand: 'Anessa',
      name: 'Perfect UV Sunscreen Skincare Milk',
      category: 'Sunscreen',
      recsCount: 98,
      trend: '+12%',
      icon: Flame,
      iconColor: 'text-zinc-300 bg-white/5 border-white/8 shadow-md',
    },
    {
      brand: 'COSRX',
      name: 'Low pH Good Morning Gel Cleanser',
      category: 'Cleanser',
      recsCount: 85,
      trend: '+8%',
      icon: Sparkles,
      iconColor: 'text-zinc-400 bg-white/5 border-white/8 shadow-md',
    },
    {
      brand: 'Wardah',
      name: 'UV Shield Essential Sunscreen Gel',
      category: 'Sunscreen',
      recsCount: 64,
      trend: '+5%',
      icon: TrendingUp,
      iconColor: 'text-zinc-500 bg-white/5 border-white/5 shadow-md',
    },
  ];

  const displayProducts = topProducts && topProducts.length > 0
    ? topProducts.map((p, idx) => {
        const icons = [Crown, Flame, Sparkles, TrendingUp];
        const iconColors = [
          'text-[#a3e635] bg-[#4d7c0f]/15 border-[#4d7c0f]/30 shadow-md',
          'text-zinc-300 bg-white/5 border-white/8 shadow-md',
          'text-zinc-400 bg-white/5 border-white/8 shadow-md',
          'text-zinc-500 bg-white/5 border-white/5 shadow-md',
        ];
        return {
          ...p,
          icon: icons[idx] || Sparkles,
          iconColor: iconColors[idx] || 'text-zinc-400 bg-white/5 border-white/5 shadow-md',
        };
      })
    : defaultProducts;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display font-bold text-base text-white">Rekomendasi Terbanyak</h3>
          <p className="text-xs text-gray-400">Produk skincare paling sering direkomendasikan sistem</p>
        </div>
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-1 text-xs text-brand-accent hover:text-white transition-colors cursor-pointer"
        >
          <span>Kelola Produk</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="space-y-4.5">
        {displayProducts.map((prod, idx) => {
          const Icon = prod.icon;
          return (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`p-2.5 rounded-xl border ${prod.iconColor} shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-brand-accent uppercase tracking-wider block">{prod.brand}</span>
                  <h4 className="text-xs font-semibold text-white tracking-wide truncate mt-0.5">{prod.name}</h4>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5 capitalize">{prod.category}</span>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <span className="text-xs font-bold text-white block">{prod.recsCount} <span className="text-[10px] text-gray-400 font-normal">recs</span></span>
                <span className="inline-flex items-center text-[9px] font-bold text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2 py-0.5 rounded-full mt-1.5 animate-pulse">
                  {prod.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
