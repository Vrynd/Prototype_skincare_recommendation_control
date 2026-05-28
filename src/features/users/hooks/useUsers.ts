import { useState, useEffect, useCallback } from 'react';
import type { UserItem, UserFilters } from '../types';
import { userService } from '../services/userService';

export const useUsers = () => {
  // State data pengguna
  const [users, setUsers] = useState<UserItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk filter dan kontrol paginasi
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Default limit per page

  // Efek Debounce untuk Pencarian (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset ke halaman pertama saat melakukan pencarian baru
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fungsi untuk memuat data pengguna dari service
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: UserFilters = {
        searchTerm: debouncedSearchQuery,
        roleFilter,
        sortBy,
        page,
        limit,
      };
      const response = await userService.getUsers(filters);
      setUsers(response.data);
      setTotalCount(response.count);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Gagal memuat data pengguna dari database.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, roleFilter, sortBy, page, limit]);

  // Muat ulang data ketika ada filter, sorting, pencarian, atau paginasi yang berubah
  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
    };
    loadData();
  }, [fetchUsers]);

  // Aksi Menghapus Pengguna
  const deleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      // Memuat ulang data pengguna dari database setelah berhasil dihapus agar hitungan total tetap akurat
      await fetchUsers();
      return true;
    } catch (err) {
      console.error('[useUsers] Gagal menghapus user:', err);
      const errorObj = err as Error;
      throw new Error(errorObj.message || 'Gagal menghapus akun pengguna.', { cause: err });
    }
  };

  // Aksi Mengubah Status Aktif/Tangguhkan Pengguna
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const newStatus = await userService.toggleUserStatus(userId, currentStatus);
      // Update state lokal untuk transisi instan
      setUsers(prev => 
        prev.map(u => u.id_user === userId ? { ...u, status_akun: newStatus } : u)
      );
      return newStatus;
    } catch (err) {
      console.error('[useUsers] Gagal mengubah status user:', err);
      const errorObj = err as Error;
      throw new Error(errorObj.message || 'Gagal memperbarui status aktif pengguna.', { cause: err });
    }
  };

  // Total Halaman
  const totalPages = Math.ceil(totalCount / limit);

  return {
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
    setLimit,
    totalPages,
    refresh: fetchUsers,
    deleteUser,
    toggleUserStatus,
  };
};
