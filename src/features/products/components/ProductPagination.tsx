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
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs select-none">
      {/* Pagination details */}
      <div className="text-gray-400 text-center sm:text-left font-medium">
        Menampilkan <span className="text-white font-semibold">{filteredCount > 0 ? indexOfFirstItem + 1 : 0}</span> sampai{' '}
        <span className="text-white font-semibold">
          {indexOfLastItem > filteredCount ? filteredCount : indexOfLastItem}
        </span>{' '}
        dari <span className="text-white font-semibold">{filteredCount}</span> produk
      </div>

      {/* Action Button prev next */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:hover:border-white/10 transition-all duration-300 font-semibold cursor-pointer text-gray-300 hover:text-white"
        >
          <ChevronLeft size={14} />
          <span>Sebelumnya</span>
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:hover:border-white/10 transition-all duration-300 font-semibold cursor-pointer text-gray-300 hover:text-white"
        >
          <span>Selanjutnya</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
