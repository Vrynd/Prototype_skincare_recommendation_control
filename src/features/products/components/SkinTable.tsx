import React from 'react';
import type { SkinType, SkinConcern } from '../types';

interface SkinTableProps {
  items: (SkinType | SkinConcern)[];
  type: 'types' | 'concerns';
  isLoading: boolean;
  searchTerm: string;
}

export const SkinTable: React.FC<SkinTableProps> = ({
  items,
  type,
  isLoading,
  searchTerm,
}) => {
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
    <div className={`glass-card rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
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
              <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-6">Deskripsi</th>
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
                    <td className="p-4 text-xs text-gray-300 font-medium leading-relaxed pr-6">
                      {item.description}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="p-12 text-center text-xs text-gray-400 font-medium">
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
    </div>
  );
};
export default SkinTable;
