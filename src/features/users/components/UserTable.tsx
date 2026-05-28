import React, { useState } from 'react';
import { 
  Search, 
  Shield, 
  Mail, 
  Trash2, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import type { UserItem } from '../types';

export const UserTable: React.FC = () => {
  const {
    users,
    totalCount,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    limit,
    totalPages,
    deleteUser,
    toggleUserStatus,
  } = useUsers();

  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(id);
      setToast(`Pengguna "${userToDelete.nama_lengkap}" berhasil dihapus dari database.`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      const errorObj = err as Error;
      setToast(`Gagal menghapus pengguna: ${errorObj.message}`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setStatusUpdatingId(id);
    try {
      const newStatus = await toggleUserStatus(id, currentStatus);
      setToast(`Status akun berhasil diubah menjadi ${newStatus ? 'Aktif' : 'Ditangguhkan'}.`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      const errorObj = err as Error;
      setToast(`Gagal mengubah status: ${errorObj.message}`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const formatIndonesianDate = (dateStr: string) => {
    try {
      if (!dateStr) return '-';
      let cleaned = dateStr.trim();
      if (cleaned.includes(' ')) {
        cleaned = cleaned.replace(' ', 'T').replace(' UTC', 'Z');
      }
      
      const date = new Date(cleaned);
      if (isNaN(date.getTime())) {
        return dateStr;
      }

      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      const dayName = days[date.getDay()];
      const day = date.getDate();
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${dayName}, ${day} ${monthName} ${year} • ${hours}:${minutes} WIB`;
    } catch {
      return dateStr;
    }
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      if (!dateStr) return '';
      let cleaned = dateStr.trim();
      if (cleaned.includes(' ')) {
        cleaned = cleaned.replace(' ', 'T').replace(' UTC', 'Z');
      }
      const date = new Date(cleaned);
      if (isNaN(date.getTime())) return '';

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      if (diffDays === 1) return 'Kemarin';
      if (diffDays < 30) return `${diffDays} hari yang lalu`;
      
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) return `${diffMonths} bulan yang lalu`;
      
      return `${Math.floor(diffMonths / 12)} tahun yang lalu`;
    } catch {
      return '';
    }
  };



  return (
    <div className="space-y-6">
      {/* Sub-Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 w-full md:w-80 focus-within:border-[#84cc16]/50 transition-all duration-300">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white border-none outline-none w-full placeholder-gray-500 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-gray-500 hover:text-white cursor-pointer px-1"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Filter Peran */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
            <SlidersHorizontal size={12} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as 'all' | 'admin' | 'user');
                setPage(1);
              }}
              className="bg-transparent text-xs text-white outline-none border-none cursor-pointer pr-2 font-medium select-custom-icon"
            >
              <option value="all" className="bg-slate-950 text-white">Semua Peran</option>
              <option value="admin" className="bg-slate-950 text-white">Administrator</option>
              <option value="user" className="bg-slate-950 text-white">Pengguna</option>
            </select>
          </div>

          {/* Urutkan Berdasarkan */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
            <ArrowUpDown size={12} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'newest' | 'oldest' | 'name-asc' | 'name-desc');
                setPage(1);
              }}
              className="bg-transparent text-xs text-white outline-none border-none cursor-pointer pr-2 font-medium select-custom-icon"
            >
              <option value="newest" className="bg-slate-950 text-white">Terbaru</option>
              <option value="oldest" className="bg-slate-950 text-white">Terlama</option>
              <option value="name-asc" className="bg-slate-950 text-white">Nama A - Z</option>
              <option value="name-desc" className="bg-slate-950 text-white">Nama Z - A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <AlertTriangle size={16} />
          <span>{error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="ml-auto underline font-semibold hover:text-white"
          >
            Muat Ulang
          </button>
        </div>
      )}

      {/* Users Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
        {/* Loading overlay when refreshing or performing operations */}
        {isLoading && users.length > 0 && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all duration-300">
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
              <Loader2 size={16} className="text-[#84cc16] animate-spin" />
              <span className="text-xs text-gray-300 font-semibold">Memperbarui data...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-162.5">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-6">Pengguna</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peran</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terdaftar Pada</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && users.length === 0 ? (
                // Skeleton loading rows for elite botanic feel
                Array.from({ length: limit }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5" />
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-white/10 rounded" />
                          <div className="h-2.5 w-36 bg-white/5 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-20 bg-white/5 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-16 bg-white/5 rounded-full" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-32 bg-white/5 rounded" />
                    </td>
                    <td className="p-4 text-center pr-6">
                      <div className="h-8 w-8 bg-white/5 rounded-lg mx-auto" />
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id_user} className="hover:bg-white/2 transition-colors duration-200">
                    {/* User profile details */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.foto_profile || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={user.nama_lengkap}
                          className="w-9 h-9 rounded-lg object-cover ring-2 ring-white/5 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                          }}
                        />
                        <div>
                          <h4 className="font-semibold text-xs text-white">{user.nama_lengkap}</h4>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail size={10} />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-300">
                        <Shield size={12} className={user.role === 'admin' ? 'text-[#84cc16]' : 'text-gray-400'} />
                        <span className="font-medium capitalize">{user.role === 'admin' ? 'Administrator' : 'Pengguna'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <button 
                        disabled={statusUpdatingId === user.id_user}
                        onClick={() => handleToggleStatus(user.id_user, user.status_akun)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${
                          user.status_akun
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
                        } disabled:opacity-50`}
                      >
                        {statusUpdatingId === user.id_user ? (
                          <Loader2 size={8} className="animate-spin text-white" />
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status_akun ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        )}
                        {user.status_akun ? 'Aktif' : 'Ditangguhkan'}
                      </button>
                    </td>

                    {/* Human readable Date */}
                    <td className="p-4 text-xs text-gray-300 font-medium">
                      <div>{formatIndonesianDate(user.created_at)}</div>
                      {getRelativeTime(user.created_at) && (
                        <div className="text-[10px] text-gray-500 font-normal mt-1">
                          {getRelativeTime(user.created_at)}
                        </div>
                      )}
                    </td>

                    {/* Delete Action Button */}
                    <td className="p-4 text-center pr-6">
                      <button 
                        onClick={() => setUserToDelete(user)}
                        title="Hapus Pengguna"
                        className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                      {/* Big Rounded Pill Container (Visual Placeholder in Wireframe) */}
                      <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-display font-semibold text-xs tracking-wider inline-flex items-center gap-2 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        Pencarian Tidak Ditemukan
                      </div>
                      
                      {/* Subtitle/Text Line */}
                      <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                        Tidak ditemukan pengguna yang cocok dengan kriteria pencarian atau filter "{searchQuery}".
                      </p>

                      {/* Small CTA Pill/Button */}
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setRoleFilter('all');
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#84cc16]/10 border border-[#84cc16]/20 text-[10px] font-bold text-[#84cc16] hover:bg-[#84cc16]/20 hover:border-[#84cc16]/40 transition-all duration-300 shadow-md shadow-[#84cc16]/5 cursor-pointer uppercase tracking-wider"
                      >
                        Atur Ulang Pencarian
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEPARATE PAGINATION FOOTER CARD - DESIGNED EXACTLY LIKE THE WIREFRAME */}
      {totalPages > 0 && (
        <div className="glass-card rounded-2xl border border-white/5 shadow-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/1">
          {/* Left Side: Long rounded pill containing the showing page counts */}
          <div className="flex items-center justify-center sm:justify-start">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-semibold tracking-wide shadow-inner">
              Menampilkan <span className="text-[#84cc16] mx-1">{(page - 1) * limit + 1}</span> - <span className="text-[#84cc16] mx-1">{Math.min(page * limit, totalCount)}</span> dari <span className="text-[#84cc16] mx-1">{totalCount}</span> pengguna
            </div>
          </div>

          {/* Right Side: Two distinct rounded pill-buttons side-by-side (Sebelumnya & Selanjutnya) */}
          <div className="flex items-center justify-center gap-3">
            {/* Prev Button: Rounded capsule/pill */}
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-[#84cc16] hover:bg-[#84cc16]/5 hover:border-[#84cc16]/30 hover:shadow-[0_0_12px_rgba(132,204,22,0.15)] transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft size={14} />
              Sebelumnya
            </button>

            {/* Next Button: Rounded capsule/pill */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-[#84cc16] hover:bg-[#84cc16]/5 hover:border-[#84cc16]/30 hover:shadow-[0_0_12px_rgba(132,204,22,0.15)] transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
              title="Halaman Selanjutnya"
            >
              Selanjutnya
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS (Glassmorphism Popup) */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 text-center space-y-4">
              {/* Glowing Alert Icon */}
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/5">
                {isDeleting ? (
                  <Loader2 size={20} className="animate-spin text-rose-400" />
                ) : (
                  <Trash2 size={20} />
                )}
              </div>
              
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base text-white tracking-tight">Hapus Pengguna?</h3>
                <p className="text-xs text-gray-400 leading-relaxed px-2">
                  Apakah Anda yakin ingin menghapus pengguna <span className="font-semibold text-white">"{userToDelete.nama_lengkap}"</span>? Tindakan ini bersifat permanen dan akan menghapusnya dari database.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 border-t border-white/5 pt-4 mt-6">
                <button 
                  disabled={isDeleting}
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={() => handleDelete(userToDelete.id_user)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 hover:shadow-rose-500/25 transition-all duration-300 shadow-md shadow-rose-500/10 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting && <Loader2 size={12} className="animate-spin" />}
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST NOTIFICATION */}
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
