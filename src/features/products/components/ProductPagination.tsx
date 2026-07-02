import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  filteredCount,
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  onPageChange,
}) => {
  if (totalPages <= 0) return null;

  return (
    <div className="glass-card rounded-2xl border border-white/5 shadow-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/1 select-none">
      {/* Left Side: Long rounded pill containing the showing page counts */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-semibold tracking-wide shadow-inner">
          Menampilkan{' '}
          <span className="text-[#84cc16] mx-1">
            {filteredCount > 0 ? indexOfFirstItem + 1 : 0}
          </span>{' '}
          -{' '}
          <span className="text-[#84cc16] mx-1">
            {indexOfLastItem > filteredCount ? filteredCount : indexOfLastItem}
          </span>{' '}
          dari{' '}
          <span className="text-[#84cc16] mx-1">{filteredCount}</span>{' '}
          produk
        </div>
      </div>

      {/* Right Side: Two distinct rounded pill-buttons side-by-side (Sebelumnya & Selanjutnya) */}
      <div className="flex items-center justify-center gap-3">
        {/* Prev Button: Rounded capsule/pill */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-[#84cc16] hover:bg-[#84cc16]/5 hover:border-[#84cc16]/30 hover:shadow-[0_0_12px_rgba(132,204,22,0.15)] transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
          title="Halaman Sebelumnya"
        >
          <ChevronLeft size={14} />
          Sebelumnya
        </button>

        {/* Next Button: Rounded capsule/pill */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-[#84cc16] hover:bg-[#84cc16]/5 hover:border-[#84cc16]/30 hover:shadow-[0_0_12px_rgba(132,204,22,0.15)] transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
          title="Halaman Selanjutnya"
        >
          Selanjutnya
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
