import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';

interface SkinHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: 'types' | 'concerns';
  onTabChange: (tab: 'types' | 'concerns') => void;
  onBack: () => void;
}

export const SkinHeader: React.FC<SkinHeaderProps> = ({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  onBack,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Kiri: Tombol Kembali, Breadcrumb & Judul Halaman */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer shadow-md"
          title="Kembali ke Produk"
        >
          <ArrowLeft size={15} />
        </button>
        <div className="flex flex-col">
          {/* Breadcrumb di atas judul (satu warna muted uniform) */}
          <div className="flex items-center gap-1 text-[8px] text-gray-500/50 font-medium tracking-widest uppercase mb-1 select-none">
            <span className="hover:text-gray-400 transition-colors cursor-pointer" onClick={onBack}>Produk</span>
            <span>/</span>
            <span>Kondisi Kulit</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none mt-0.5">
            Kondisi Kulit
          </h2>
        </div>
      </div>

      {/* Kanan: Tab Selector & Pencarian Sejajar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        {/* Dynamic Glass Tabs for Types vs Concerns */}
        <div className="flex p-1 rounded-xl bg-white/3 border border-white/5 gap-1 shrink-0">
          <button
            onClick={() => onTabChange('types')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === 'types'
                ? 'bg-brand-accent text-brand-bg font-bold shadow-md shadow-brand-accent/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Jenis Kulit
          </button>
          <button
            onClick={() => onTabChange('concerns')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === 'concerns'
                ? 'bg-brand-accent text-brand-bg font-bold shadow-md shadow-brand-accent/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Masalah Kulit
          </button>
        </div>

        {/* Premium Search Box */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 w-full sm:w-64 focus-within:border-brand-primary/50 transition-all duration-300">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari kode, nama, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-xs text-white border-none outline-none w-full placeholder-gray-500 font-medium"
          />
        </div>
      </div>
    </div>
  );
};
