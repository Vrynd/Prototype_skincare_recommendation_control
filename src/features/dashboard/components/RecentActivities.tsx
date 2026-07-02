import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { TopRecommendedProduct } from '../types';

interface RecentActivitiesProps {
  topProducts?: TopRecommendedProduct[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ topProducts = [] }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedProduct, setSelectedProduct] = React.useState<TopRecommendedProduct | null>(null);

  const defaultProducts: TopRecommendedProduct[] = [
    {
      brand: 'ANESSA',
      name: 'Perfect UV Sunscreen Skincare Milk',
      category: 'Sunscreen',
      recsCount: 6,
      trend: '+18%',
      bpomNumber: 'NA22201700001',
      isActive: true,
      spf: 50,
      paGrade: 'PA++++',
    },
    {
      brand: 'BIORE',
      name: 'UV Aqua Rich Watery Essence',
      category: 'Sunscreen',
      recsCount: 6,
      trend: '+12%',
      bpomNumber: 'NA22201700002',
      isActive: true,
      spf: 50,
      paGrade: 'PA++++',
    },
    {
      brand: 'BANANA BOAT',
      name: 'Sport Ultra SPF50+',
      category: 'Sunscreen',
      recsCount: 5,
      trend: '+8%',
      bpomNumber: 'NA22201700003',
      isActive: true,
      spf: 50,
      paGrade: 'PA++++',
    },
    {
      brand: 'NEUTROGENA',
      name: 'Ultra Sheer Dry-Touch Sunscreen',
      category: 'Sunscreen',
      recsCount: 5,
      trend: '+5%',
      bpomNumber: 'NA22201700004',
      isActive: false,
      spf: 50,
      paGrade: 'PA+++',
    },
  ];

  const displayProducts = topProducts && topProducts.length > 0
    ? topProducts
    : defaultProducts;

  // Pagination Configuration: 2 products per page to match height of the overview chart
  const itemsPerPage = 2;
  const totalCount = displayProducts.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = displayProducts.slice(startIndex, startIndex + itemsPerPage);

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full min-h-90 shadow-lg border border-white/5">
        <div>
          {/* Header (Tanpa tombol Kelola Produk) */}
          <div className="flex justify-between items-center mb-5 shrink-0">
            <div>
              <h3 className="font-display font-bold text-base text-white">Rekomendasi Terbanyak</h3>
            </div>
          </div>

          {/* List of Products (Paginasi 2 item) */}
          <div className="space-y-4">
            {currentProducts.map((prod, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedProduct(prod)}
                className="flex flex-col p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-brand-primary/30 hover:bg-slate-900/80 transition-all duration-300 gap-2 min-w-0 cursor-pointer active:scale-[0.99] select-none"
              >
                {/* Baris Atas: Brand Name & Nomor BPOM */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <span className="text-[9px] font-bold text-brand-accent bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {prod.brand}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                    BPOM: {prod.bpomNumber}
                  </span>
                </div>

                {/* Baris Tengah: Nama Produk (Maksimal 2 baris dengan tinggi tetap agar tinggi kartu seimbang) */}
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide leading-snug line-clamp-2 h-10 flex items-center whitespace-normal wrap-break-word">
                  {prod.name}
                </h4>
              </div>
            ))}

            {currentProducts.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-500 font-semibold">
                Tidak ada data rekomendasi terbanyak
              </div>
            )}
          </div>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[11px] text-gray-400 shrink-0">
            <span>
              Halaman <span className="font-semibold text-white">{currentPage}</span> dari{" "}
              <span className="font-semibold text-white">{totalPages}</span>
            </span>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all cursor-pointer text-[10px] font-semibold"
              >
                Prev
              </button>
              <button 
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all cursor-pointer text-[10px] font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Detail Produk (Interactive Drawer rendered via React Portal in document.body) */}
      {selectedProduct && createPortal(
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-9999 transition-opacity duration-300"
            onClick={() => setSelectedProduct(null)}
          />

          {/* Sliding Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-95 bg-[#0f1410] border-l border-white/10 z-10000 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-md animate-in slide-in-from-right duration-300">
            {/* Decorative Background Glow */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-brand-primary/10 blur-[80px] pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                <h3 className="font-display font-bold text-lg text-white select-none">Detail Produk</h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center active:scale-95"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 scrollbar-none">
                {/* Brand & BPOM */}
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Informasi Umum</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-semibold text-brand-accent bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedProduct.brand}
                    </span>
                    <span className="text-[10px] font-medium text-gray-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      BPOM: {selectedProduct.bpomNumber}
                    </span>
                  </div>
                </div>

                {/* Product Name */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Nama Produk</span>
                  <h4 className="text-sm font-normal text-white leading-relaxed whitespace-normal wrap-break-word">
                    {selectedProduct.name}
                  </h4>
                </div>

                {/* Stats: Total Recommended & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Direkomendasikan</span>
                    <span className="text-lg font-bold text-white mt-2 block leading-none">
                      {selectedProduct.recsCount} <span className="text-xs text-gray-500 font-normal">kali</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Status Produk</span>
                    <span className={`inline-flex items-center justify-center text-[10px] font-medium px-2.5 py-0.5 rounded-md border mt-2 w-fit ${
                      selectedProduct.isActive 
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                        : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    }`}>
                      {selectedProduct.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>

                {/* SPF & PA */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Kadar SPF</span>
                    <span className="text-sm font-medium text-white mt-2 block">
                      {selectedProduct.spf ? `SPF ${selectedProduct.spf}` : '-'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Proteksi PA</span>
                    <span className="text-sm font-medium text-white mt-2 block">
                      {selectedProduct.paGrade || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Footer Button */}
            <div className="pt-4 border-t border-white/5 shrink-0">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer active:scale-98"
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      , document.body)}
    </>
  );
};
