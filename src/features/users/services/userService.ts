import { supabase } from '../../../utils/supabase';
import type { UserItem, UserFilters, UserResponse } from '../types';

export const userService = {
  /**
   * Mengambil data pengguna dari Supabase dengan filter, pencarian, pengurutan, dan paginasi
   */
  async getUsers(filters: UserFilters): Promise<UserResponse> {
    try {
      const { searchTerm, roleFilter, sortBy, page, limit } = filters;
      
      // Hitung offset paginasi
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Inisialisasi query Supabase
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Tambahkan filter pencarian (nama atau email)
      if (searchTerm.trim()) {
        const cleanSearch = searchTerm.trim();
        query = query.or(`nama_lengkap.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%`);
      }

      // Tambahkan filter peran
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      // Tambahkan pengurutan (sorting)
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'name-asc') {
        query = query.order('nama_lengkap', { ascending: true });
      } else if (sortBy === 'name-desc') {
        query = query.order('nama_lengkap', { ascending: false });
      }

      // Tambahkan batas paginasi (range)
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: (data as UserItem[]) || [],
        count: count || 0,
      };
    } catch (err) {
      console.error('[UserService] Gagal mengambil data pengguna:', err);
      throw err;
    }
  },

  /**
   * Menghapus akun pengguna dari database Supabase
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id_user', userId);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('[UserService] Gagal menghapus pengguna:', err);
      throw err;
    }
  },

  /**
   * Mengubah status aktif/tangguhkan akun pengguna
   */
  async toggleUserStatus(userId: string, currentStatus: boolean): Promise<boolean> {
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('users')
        .update({ status_akun: newStatus, updated_at: new Date().toISOString() })
        .eq('id_user', userId);

      if (error) {
        throw error;
      }

      return newStatus;
    } catch (err) {
      console.error('[UserService] Gagal memperbarui status pengguna:', err);
      throw err;
    }
  }
};
