import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, SlidersHorizontal, Sparkles } from 'lucide-react';

interface ProductHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Search tool */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 w-full sm:w-80 focus-within:border-brand-primary/50 transition-all duration-300">
        <Search size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari produk atau brand..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent text-xs text-white border-none outline-none w-full placeholder-gray-500 font-medium"
        />
      </div>

      {/* Filters & Actions Group */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Toggle Filter Modal Button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
            selectedCategory !== 'Semua'
              ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/20'
              : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
          }`}
          title="Filter Kategori"
        >
          <SlidersHorizontal size={16} />
        </button>

        {/* Manage Skin Types & Concerns Button */}
        <button
          onClick={() => navigate('/products/skin')}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg shadow-black/10 shrink-0"
        >
          <Sparkles size={14} className="text-brand-accent" />
          <span>Jenis & Masalah Kulit</span>
        </button>

        {/* Add Product Button */}
        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-brand-bg bg-brand-accent rounded-xl hover:bg-white hover:shadow-brand-accent/25 transition-all duration-300 shadow-lg shadow-brand-accent/20 cursor-pointer shrink-0">
          <Plus size={16} />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* CATEGORY FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-xs rounded-2xl border border-white/10 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-brand-accent" />
                <span>Filter Kategori</span>
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {[
                { value: 'Semua', label: 'Semua Tipe' },
                { value: 'chemical', label: 'Chemical' },
                { value: 'physical', label: 'Physical' },
                { value: 'hybrid', label: 'Hybrid' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    onCategoryChange(value);
                    setIsFilterModalOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    selectedCategory === value
                      ? 'bg-brand-accent text-brand-bg shadow-md shadow-brand-accent/20 font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
