import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Product } from '../types';

interface ConfirmationModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  product,
  onClose,
  onConfirm,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center space-y-4">
          {/* Glowing Alert Icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/5">
            <Trash2 size={20} />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-base text-white tracking-tight">Hapus Produk Skincare?</h3>
            <p className="text-xs text-gray-400 leading-relaxed px-2">
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-white">"{product.product_name}"</span>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-white/5 pt-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-300 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={() => onConfirm(product.product_id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 hover:shadow-rose-500/25 transition-all duration-300 shadow-md shadow-rose-500/10 cursor-pointer"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
