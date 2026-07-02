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
  },

  /**
   * Menghapus jenis kulit dari tabel `skin_types` berdasarkan skin_type_id
   */
  async deleteSkinType(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('skin_types')
        .delete()
        .eq('skin_type_id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('[SkinService] Gagal menghapus jenis kulit:', error);
      throw error;
    }
  },

  /**
   * Menghapus masalah kulit dari tabel `skin_concerns` berdasarkan skin_concern_id
   */
  async deleteSkinConcern(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('skin_concerns')
        .delete()
        .eq('skin_concern_id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('[SkinService] Gagal menghapus masalah kulit:', error);
      throw error;
    }
  },

  /**
   * Menambahkan jenis kulit baru ke tabel `skin_types`
   */
  async addSkinType(code: string, name: string, description: string): Promise<SkinType> {
    try {
      const { data, error } = await supabase
        .from('skin_types')
        .insert({
          skin_type_code: code,
          skin_type_name: name,
          description: description
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[SkinService] Gagal menambahkan jenis kulit:', error);
      throw error;
    }
  },

  /**
   * Memperbarui jenis kulit di tabel `skin_types`
   */
  async updateSkinType(id: string, code: string, name: string, description: string): Promise<SkinType> {
    try {
      const { data, error } = await supabase
        .from('skin_types')
        .update({
          skin_type_code: code,
          skin_type_name: name,
          description: description,
          updated_at: new Date().toISOString()
        })
        .eq('skin_type_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[SkinService] Gagal memperbarui jenis kulit:', error);
      throw error;
    }
  },

  /**
   * Menambahkan masalah kulit baru ke tabel `skin_concerns`
   */
  async addSkinConcern(code: string, name: string, description: string): Promise<SkinConcern> {
    try {
      const { data, error } = await supabase
        .from('skin_concerns')
        .insert({
          skin_concern_code: code,
          skin_concern_name: name,
          description: description
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[SkinService] Gagal menambahkan masalah kulit:', error);
      throw error;
    }
  },

  /**
   * Memperbarui masalah kulit di tabel `skin_concerns`
   */
  async updateSkinConcern(id: string, code: string, name: string, description: string): Promise<SkinConcern> {
    try {
      const { data, error } = await supabase
        .from('skin_concerns')
        .update({
          skin_concern_code: code,
          skin_concern_name: name,
          description: description,
          updated_at: new Date().toISOString()
        })
        .eq('skin_concern_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[SkinService] Gagal memperbarui masalah kulit:', error);
      throw error;
    }
  }
};
export default skinService;
