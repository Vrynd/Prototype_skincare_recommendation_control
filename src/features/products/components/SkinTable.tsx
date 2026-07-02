import React, { useState } from 'react';
import type { SkinType, SkinConcern } from '../types';
import { Trash2, Pencil, Check, Loader2 } from 'lucide-react';

interface SkinTableProps {
  items: (SkinType | SkinConcern)[];
  type: 'types' | 'concerns';
  isLoading: boolean;
  searchTerm: string;
  onDelete: (id: string) => Promise<boolean>;
  onEdit?: (item: SkinType | SkinConcern) => void;
}

export const SkinTable: React.FC<SkinTableProps> = ({
  items,
  type,
  isLoading,
  searchTerm,
  onDelete,
  onEdit,
}) => {
  // State untuk menghapus data & modal konfirmasi
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(itemToDelete.id);
      setToast(`${type === 'types' ? 'Jenis kulit' : 'Masalah kulit'} "${itemToDelete.name}" berhasil dihapus.`);
      setItemToDelete(null);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('[SkinTable] Gagal menghapus item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 space-y-4 glass-card rounded-3xl border border-white/5 shadow-2xl">
        {/* Loading Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-brand-accent animate-spin" />
        <p className="text-xs text-gray-400 font-medium tracking-wide">
          Memuat data {type === 'types' ? 'jenis kulit' : 'masalah kulit'}...
        </p>
      </div>
    );
  }

  return (
    <div className={`relative glass-card rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
      items.length === 0 ? 'border border-dashed border-white/20' : 'border border-white/5'
    }`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-6 w-32">Kode</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-48">
                {type === 'types' ? 'Jenis Kulit' : 'Masalah Kulit'}
              </th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deskripsi</th>
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center pr-6 w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.length > 0 ? (
              items.map((item) => {
                // Type guards / dynamic fields extraction
                const isType = 'skin_type_code' in item;
                const code = isType ? (item as SkinType).skin_type_code : (item as SkinConcern).skin_concern_code;
                const name = isType ? (item as SkinType).skin_type_name : (item as SkinConcern).skin_concern_name;
                const id = isType ? (item as SkinType).skin_type_id : (item as SkinConcern).skin_concern_id;

                return (
                  <tr key={id} className="hover:bg-white/2 transition-colors duration-200">
                    {/* Kode */}
                    <td className="p-4 pl-6">
                      <span className="inline-block text-[10px] font-bold text-brand-accent uppercase tracking-wider bg-brand-accent/5 px-2.5 py-1 rounded-lg border border-brand-accent/10">
                        {code}
                      </span>
                    </td>

                    {/* Nama (kapitalisasi otomatis dan ganti underscore jika ada) */}
                    <td className="p-4 font-semibold text-xs text-white capitalize">
                      {name.replace('_', ' ')}
                    </td>

                    {/* Deskripsi Lengkap */}
                    <td className="p-4 text-xs text-gray-300 font-medium leading-relaxed">
                      {item.description}
                    </td>

                    {/* Tombol Aksi Edit & Hapus */}
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit?.(item)}
                          title={`Edit ${type === 'types' ? 'Jenis Kulit' : 'Masalah Kulit'}`}
                          className="p-2 text-gray-500 hover:text-brand-accent hover:bg-brand-primary/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setItemToDelete({ id, name: name.replace('_', ' ') })}
                          title={`Hapus ${type === 'types' ? 'Jenis Kulit' : 'Masalah Kulit'}`}
                          className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-12 text-center text-xs text-gray-400 font-medium">
                  {searchTerm ? (
                    <div className="flex flex-col items-center justify-center min-h-28 py-4 space-y-1">
                      <span className="text-sm font-semibold text-gray-300">Data Tidak Ditemukan</span>
                      <span className="text-gray-500">
                        Tidak ditemukan {type === 'types' ? 'jenis kulit' : 'masalah kulit'} yang cocok dengan pencarian "{searchTerm}".
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-28 py-4 space-y-2">
                      <span className="text-sm font-semibold text-gray-300">Data Tidak Tersedia</span>
                      <span className="text-gray-500 max-w-sm leading-relaxed">
                        Belum ada data {type === 'types' ? 'jenis kulit' : 'masalah kulit'} yang tersedia di database Supabase Anda.
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL KONFIRMASI HAPUS (Glassmorphism Popup) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300 bg-slate-950/80 backdrop-blur-md">
            <div className="p-6 text-center space-y-4">
              {/* Glowing Alert Icon */}
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/5">
                <Trash2 size={20} />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base text-white tracking-tight">
                  Hapus {type === 'types' ? 'Jenis Kulit' : 'Masalah Kulit'}?
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed px-2">
                  Apakah Anda yakin ingin menghapus {type === 'types' ? 'jenis kulit' : 'masalah kulit'} <span className="font-semibold text-white">"{itemToDelete.name}"</span>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 border-t border-white/5 pt-4 mt-6">
                <button 
                  onClick={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 hover:shadow-rose-500/25 transition-all duration-300 shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <span>Hapus</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SUCCESS NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check size={10} className="text-emerald-400" />
          </div>
          <span className="text-xs font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
};
export default SkinTable;
