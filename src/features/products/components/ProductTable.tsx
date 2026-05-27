import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Product } from '../types';

interface ProductTableProps {
  currentItems: Product[];
  isDbEmpty: boolean;
  onToggleStatus: (id: string) => void;
  onDeleteClick: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  currentItems,
  isDbEmpty,
  onToggleStatus,
  onDeleteClick,
}) => {
  return (
    <div className={`glass-card rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
      currentItems.length === 0 ? 'border border-dashed border-white/20' : 'border border-white/5'
    }`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-6">Brand & Produk</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waktu Pakai</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proteksi</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. BPOM</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center pr-6">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <tr key={product.product_id} className="hover:bg-white/2 transition-colors duration-200">
                  {/* Brand & Produk */}
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wide">{product.brand_name}</span>
                      <h4 className="font-semibold text-xs text-white mt-0.5 line-clamp-1">{product.product_name}</h4>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="p-4 text-xs text-gray-300 font-medium">
                    {product.category}
                  </td>

                  {/* Waktu Pakai */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      product.usage_time === 'Pagi & Malam' 
                        ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' 
                        : product.usage_time === 'Pagi'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                    }`}>
                      {product.usage_time}
                    </span>
                  </td>

                  {/* Proteksi */}
                  <td className="p-4 text-xs text-gray-300 font-medium">
                    {product.spf_value ? (
                      <div className="flex items-center gap-1">
                        <span className="text-white font-semibold">SPF {product.spf_value}</span>
                        {product.pa_grade && <span className="text-[10px] text-brand-accent font-bold">({product.pa_grade})</span>}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  {/* No. BPOM */}
                  <td className="p-4 text-xs text-gray-400 font-mono">
                    {product.bpom_number}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <button 
                      onClick={() => onToggleStatus(product.product_id)}
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

                  {/* Aksi (Hanya Hapus Saja) */}
                  <td className="p-4 text-center pr-6">
                    <button 
                      onClick={() => onDeleteClick(product)}
                      title="Hapus"
                      className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-xs text-gray-400 font-medium">
                  {isDbEmpty ? (
                    <div className="flex flex-col items-center justify-center min-h-20 py-4 space-y-2">
                      <span className="text-sm font-semibold text-gray-300">Data Tidak Tersedia</span>
                      <span className="text-gray-500 max-w-sm leading-relaxed">Belum ada produk skincare yang tersedia di database. Silakan klik tombol "Tambah Produk" di atas untuk menambahkan produk baru.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-20 py-4 space-y-1">
                      <span className="text-sm font-semibold text-gray-300">Produk Tidak Ditemukan</span>
                      <span className="text-gray-500">Tidak ditemukan produk skincare yang cocok dengan pencarian atau filter Anda.</span>
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
