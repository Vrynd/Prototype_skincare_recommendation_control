import { supabase } from '../../../utils/supabase';
import type { SkinType, SkinConcern } from '../types';

export const skinService = {
  /**
   * Mengambil semua daftar jenis kulit dari tabel `skin_types`
   * Diurutkan berdasarkan kode jenis kulit (skin_type_code) secara ascending
   */
  async getSkinTypes(): Promise<SkinType[]> {
    try {
      const { data, error } = await supabase
        .from('skin_types')
        .select('*')
        .order('skin_type_code', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[SkinService] Gagal mengambil data jenis kulit dari Supabase:', error);
      return [];
    }
  },

  /**
   * Mengambil semua daftar masalah kulit dari tabel `skin_concerns`
   * Diurutkan berdasarkan kode masalah kulit (skin_concern_code) secara ascending
   */
  async getSkinConcerns(): Promise<SkinConcern[]> {
    try {
      const { data, error } = await supabase
        .from('skin_concerns')
        .select('*')
        .order('skin_concern_code', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[SkinService] Gagal mengambil data masalah kulit dari Supabase:', error);
      return [];
    }
  }
};
export default skinService;
