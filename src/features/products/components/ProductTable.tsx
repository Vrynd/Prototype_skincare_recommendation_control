import React from 'react';
import { Trash2, Pencil } from 'lucide-react';
import type { Product } from '../types';

interface ProductTableProps {
  currentItems: Product[];
  isDbEmpty: boolean;
  onToggleStatus: (id: string) => void;
  onDeleteClick: (product: Product) => void;
  onEditClick?: (product: Product) => void;
  onRowClick?: (product: Product) => void;
  selectedProductId?: string | null;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  currentItems,
  isDbEmpty,
  onToggleStatus,
  onDeleteClick,
  onEditClick,
  onRowClick,
  selectedProductId,
}) => {
  return (
    <div className={`glass-card rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
      currentItems.length === 0 ? 'border border-dashed border-white/20' : 'border border-white/5'
    }`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="p-4 pl-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand &amp; Produk</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SPF</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">PA</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. BPOM</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-4 pr-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <tr
                  key={product.product_id}
                  onClick={() => onRowClick?.(product)}
                  className={`transition-colors duration-200 cursor-pointer ${
                    selectedProductId === product.product_id
                      ? 'bg-brand-primary/10 border-l-2 border-l-brand-accent'
                      : 'hover:bg-white/2'
                  }`}
                >
                  {/* Brand & Produk */}
                  <td className="p-4 pl-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wide leading-none">
                        {product.brand_name}
                      </span>
                      <span className="text-xs text-white font-medium leading-snug line-clamp-2 max-w-[260px]">
                        {product.product_name}
                      </span>
                    </div>
                  </td>

                  {/* Kategori (sunscreen_type) */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      product.sunscreen_type === 'chemical'
                        ? 'text-violet-300 bg-violet-500/10 border-violet-500/20'
                        : product.sunscreen_type === 'physical'
                        ? 'text-amber-300 bg-amber-500/10 border-amber-500/20'
                        : 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20'
                    }`}>
                      {product.sunscreen_type === 'chemical' ? 'Chemical'
                        : product.sunscreen_type === 'physical' ? 'Physical'
                        : product.sunscreen_type === 'hybrid' ? 'Hybrid'
                        : product.sunscreen_type}
                    </span>
                  </td>

                  {/* SPF */}
                  <td className="p-4 text-xs text-white font-semibold">
                    {product.spf ? (
                      <span>SPF {product.spf}</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  {/* PA */}
                  <td className="p-4 text-xs font-bold text-brand-accent">
                    {product.pa_grade || <span className="text-gray-500 font-normal">—</span>}
                  </td>

                  {/* No. BPOM */}
                  <td className="p-4 text-xs text-gray-400 font-mono tracking-wide">
                    {product.bpom_number || <span className="text-gray-500">—</span>}
                  </td>

                  {/* Status — toggle aktif/nonaktif */}
                  <td className="p-4">
                    <button
                      onClick={() => onToggleStatus(product.product_id)}
                      title="Klik untuk ubah status"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        product.is_active
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {product.is_active ? 'Aktif' : 'Non-Aktif'}
                    </button>
                  </td>

                  {/* Aksi: Edit + Hapus */}
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-center gap-1">
                      {/* Tombol Edit */}
                      <button
                        onClick={() => onEditClick?.(product)}
                        title="Edit produk"
                        className="p-2 text-gray-500 hover:text-brand-accent hover:bg-brand-primary/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil size={14} />
                      </button>
                      {/* Tombol Hapus */}
                      <button
                        onClick={() => onDeleteClick(product)}
                        title="Hapus produk"
                        className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-xs text-gray-400 font-medium">
                  {isDbEmpty ? (
                    <div className="flex flex-col items-center justify-center min-h-20 py-4 space-y-2">
                      <span className="text-sm font-semibold text-gray-300">Data Tidak Tersedia</span>
                      <span className="text-gray-500 max-w-sm leading-relaxed">
                        Belum ada produk skincare yang tersedia di database. Silakan klik tombol &quot;Tambah Produk&quot; di atas untuk menambahkan produk baru.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-20 py-4 space-y-1">
                      <span className="text-sm font-semibold text-gray-300">Produk Tidak Ditemukan</span>
                      <span className="text-gray-500">
                        Tidak ditemukan produk skincare yang cocok dengan pencarian atau filter Anda.
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
