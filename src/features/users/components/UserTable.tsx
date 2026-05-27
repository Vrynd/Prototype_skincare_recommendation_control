import React, { useState } from 'react';
import { Search, Shield, Mail, Trash2, SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

interface UserItem {
  id_user: string;
  nama_lengkap: string;
  email: string;
  role: 'admin' | 'user';
  status_akun: boolean;
  foto_profile: string | null;
  created_at: string;
  updated_at: string;
}

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([
    {
      id_user: 'a9edf4f2-5027-4c71-93a0-040c34327533',
      nama_lengkap: 'Salman Afif Alfarizi',
      email: 'salmanalfariz@gmail.com',
      role: 'admin',
      status_akun: true,
      foto_profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: '2026-05-19 06:24:07 UTC',
      updated_at: '2026-05-19 06:24:07 UTC',
    },
    {
      id_user: '8ec48d28-cf50-4286-bf58-99dd2c2f1b0c',
      nama_lengkap: 'Ardian Nugraha',
      email: 'ardian@gmail.com',
      role: 'user',
      status_akun: true,
      foto_profile: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      created_at: '2026-05-20 05:13:16 UTC',
      updated_at: '2026-05-20 05:13:16 UTC',
    },
    {
      id_user: '2abef9f9-c3e0-4126-9ca4-bb9d194ea9d7',
      nama_lengkap: 'Aditya Wahyu Nugraha',
      email: 'adit@gmail.com',
      role: 'user',
      status_akun: true,
      foto_profile: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      created_at: '2026-05-20 05:21:04 UTC',
      updated_at: '2026-05-20 05:21:04 UTC',
    },
    {
      id_user: '00b619de-569c-488b-a66e-79df7460475b',
      nama_lengkap: 'Lutfi Yatin Hidayah',
      email: 'lutfi@gmail.com',
      role: 'user',
      status_akun: true,
      foto_profile: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      created_at: '2026-05-20 15:32:45 UTC',
      updated_at: '2026-05-20 15:32:45 UTC',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = 
        roleFilter === 'all' ? true : user.role === roleFilter;
        
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.nama_lengkap.localeCompare(b.nama_lengkap);
      }
      if (sortBy === 'name-desc') {
        return b.nama_lengkap.localeCompare(a.nama_lengkap);
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at.replace(' UTC', 'Z')).getTime() - new Date(a.created_at.replace(' UTC', 'Z')).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at.replace(' UTC', 'Z')).getTime() - new Date(b.created_at.replace(' UTC', 'Z')).getTime();
      }
      return 0;
    });

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id_user !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id_user === id ? { ...u, status_akun: !u.status_akun } : u
    ));
  };

  const formatIndonesianDate = (dateStr: string) => {
    try {
      let cleaned = dateStr.trim();
      if (cleaned.includes(' ')) {
        cleaned = cleaned.replace(' ', 'T').replace(' UTC', 'Z');
      }
      
      const date = new Date(cleaned);
      if (isNaN(date.getTime())) {
        const parts = dateStr.split(' ')[0].split('-');
        if (parts.length !== 3) return dateStr;
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${day} ${months[monthIndex - 1]} ${year}`;
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
    } catch (e) {
      return dateStr;
    }
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      let cleaned = dateStr.trim();
      if (cleaned.includes(' ')) {
        cleaned = cleaned.replace(' ', 'T').replace(' UTC', 'Z');
      }
      const date = new Date(cleaned);
      if (isNaN(date.getTime())) return '';

      const now = new Date('2026-05-26T12:19:21+07:00');
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
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 w-full md:w-80 focus-within:border-brand-primary/50 transition-all duration-300">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-white border-none outline-none w-full placeholder-gray-500 font-medium"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Filter Peran */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
            <SlidersHorizontal size={12} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-transparent text-xs text-white outline-none border-none cursor-pointer pr-2 font-medium select-custom-icon"
            >
              <option value="all" className="bg-slate-900 text-white">Semua Peran</option>
              <option value="admin" className="bg-slate-900 text-white">Administrator</option>
              <option value="user" className="bg-slate-900 text-white">Pengguna</option>
            </select>
          </div>

          {/* Urutkan Berdasarkan */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
            <ArrowUpDown size={12} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-white outline-none border-none cursor-pointer pr-2 font-medium select-custom-icon"
            >
              <option value="newest" className="bg-slate-900 text-white">Terbaru</option>
              <option value="oldest" className="bg-slate-900 text-white">Terlama</option>
              <option value="name-asc" className="bg-slate-900 text-white">Nama A - Z</option>
              <option value="name-desc" className="bg-slate-900 text-white">Nama Z - A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id_user} className="hover:bg-white/2 transition-colors duration-200">
                    {/* User profile details */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.foto_profile || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={user.nama_lengkap}
                          className="w-9 h-9 rounded-lg object-cover ring-2 ring-white/5 flex-shrink-0"
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
                        <Shield size={12} className={user.role === 'admin' ? 'text-brand-accent' : 'text-gray-400'} />
                        <span className="font-medium capitalize">{user.role === 'admin' ? 'Administrator' : 'Pengguna'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleStatus(user.id_user)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${
                          user.status_akun
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status_akun ? 'bg-emerald-400' : 'bg-rose-400'}`} />
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
                  <td colSpan={5} className="p-8 text-center text-xs text-gray-500 font-medium">
                    Tidak ditemukan pengguna yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS (Glassmorphism Popup) */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 text-center space-y-4">
              {/* Glowing Alert Icon */}
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/5">
                <Trash2 size={20} />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base text-white tracking-tight">Hapus Pengguna?</h3>
                <p className="text-xs text-gray-400 leading-relaxed px-2">
                  Apakah Anda yakin ingin menghapus pengguna <span className="font-semibold text-white">"{userToDelete.nama_lengkap}"</span>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 border-t border-white/5 pt-4 mt-6">
                <button 
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-300 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    handleDelete(userToDelete.id_user);
                    setToast(`Pengguna "${userToDelete.nama_lengkap}" berhasil dihapus.`);
                    setUserToDelete(null);
                    setTimeout(() => setToast(null), 3000);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 hover:shadow-rose-500/25 transition-all duration-300 shadow-md shadow-rose-500/10 cursor-pointer"
                >
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
