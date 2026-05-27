import { supabase } from '../../../utils/supabase';
import type { Product } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('product_name', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[ProductService] Gagal mengambil data dari Supabase:', error);
      return [];
    }
  },

  async toggleProductStatus(productId: string, currentStatus: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('product_id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('[ProductService] Gagal memperbarui status di Supabase:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('[ProductService] Gagal menghapus produk di Supabase:', error);
      throw error;
    }
  }
};
