import { supabase } from '../../../utils/supabase';
import type { UserItem, UserFilters, UserResponse } from '../types';

export const userService = {
  /**
   * Mengambil data pengguna dari Supabase dengan filter, pencarian, pengurutan, dan paginasi
   */
  async getUsers(filters: UserFilters): Promise<UserResponse> {
    try {
      const { searchTerm, sortBy, page, limit } = filters;
      
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
        query = query.or(`full_name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%`);
      }

      // Selalu filter hanya peran 'user' saja, abaikan peran administrator
      query = query.eq('role', 'user');

      // Tambahkan pengurutan (sorting)
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'name-asc') {
        query = query.order('full_name', { ascending: true });
      } else if (sortBy === 'name-desc') {
        query = query.order('full_name', { ascending: false });
      }

      // Tambahkan batas paginasi (range)
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const mappedData: UserItem[] = (data || []).map((dbUser: any) => ({
        id_user: dbUser.user_id,
        nama_lengkap: dbUser.full_name || '',
        email: dbUser.email || '',
        role: dbUser.role,
        status_akun: dbUser.is_active,
        foto_profile: dbUser.avatar_url,
        created_at: dbUser.created_at,
        updated_at: dbUser.updated_at,
      }));

      return {
        data: mappedData,
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
        .eq('user_id', userId);

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
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

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
