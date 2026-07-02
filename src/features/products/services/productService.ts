import { supabase } from '../../../utils/supabase';
import type { Product, ProductDetail } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('product_id, brand_name, product_name, sunscreen_type, spf, pa_grade, bpom_number, is_active')
        .order('brand_name', { ascending: true });

      if (error) {
        console.error('[ProductService] Query error:', error.message, error.details);
        throw error;
      }
      return (data || []) as Product[];
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
  },

  /**
   * Mengambil detail lengkap sebuah produk termasuk jenis kulit dan masalah kulit
   * yang terhubung melalui junction tables. Digunakan untuk tampilan sidebar detail.
   */
  async getProductDetail(productId: string): Promise<ProductDetail | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_skin_types (
            skin_types ( skin_type_name )
          ),
          product_skin_concerns (
            skin_concerns ( skin_concern_name )
          )
        `)
        .eq('product_id', productId)
        .single();

      if (error) {
        console.error('[ProductService] Gagal mengambil detail produk:', error.message);
        return null;
      }
      return data as ProductDetail;
    } catch (error) {
      console.error('[ProductService] Error getProductDetail:', error);
      return null;
    }
  },
};
