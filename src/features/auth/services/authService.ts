import { supabase } from '../../../utils/supabase';
import type { User } from '../types';

export const authService = {
  /**
   * Mengambil profil pengguna dari tabel public.users berdasarkan id_user
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id_user, nama_lengkap, email, role, foto_profile')
        .eq('id_user', userId)
        .single();

      if (error) {
        console.error('[AuthService] Gagal mengambil profil user:', error);
        return null;
      }

      if (!data) return null;

      // Pemetaan data dari skema DB ke interface User di UI
      return {
        id: data.id_user,
        name: data.nama_lengkap || 'Admin',
        email: data.email || '',
        role: data.role as 'admin' | 'editor' | 'user',
        avatarUrl: data.foto_profile || undefined,
      };
    } catch (err) {
      console.error('[AuthService] Error saat mengambil profil:', err);
      return null;
    }
  },

  /**
   * Login menggunakan Email & Password via Supabase Auth
   * Memastikan pengguna memiliki peran 'admin' setelah berhasil masuk
   */
  async signIn(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Gagal mendapatkan data user setelah login.');
    }

    // Ambil profil user dari tabel database public.users
    const profile = await this.getUserProfile(authData.user.id);

    if (!profile) {
      // Jika profil tidak ditemukan, sign out paksa demi keamanan
      await supabase.auth.signOut();
      throw new Error('Profil akun administrator tidak ditemukan.');
    }

    // Validasi Peran (Hanya role admin yang diizinkan masuk ke panel admin)
    if (profile.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Akses Ditolak. Anda harus memiliki peran Administrator untuk masuk ke panel ini.');
    }

    return profile;
  },

  /**
   * Melakukan logout/sign out dari Supabase
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthService] Gagal melakukan logout:', error.message);
      throw error;
    }
  },

  /**
   * Mendapatkan sesi pengguna aktif saat ini dari client local storage
   */
  async getCurrentSessionUser(): Promise<User | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session || !session.user) {
      return null;
    }

    // Dapatkan profil database
    const profile = await this.getUserProfile(session.user.id);
    if (!profile || profile.role !== 'admin') {
      // Jika profile tidak valid atau bukan admin, bersihkan sesi
      await supabase.auth.signOut();
      return null;
    }

    return profile;
  }
};
