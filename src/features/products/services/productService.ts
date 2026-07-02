import { supabase } from '../../../utils/supabase';
import type { Product, ProductDetail } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('product_id, product_code, brand_name, product_name, sunscreen_type, spf, pa_grade, bpom_number, is_active')
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
            skin_types ( skin_type_id, skin_type_name )
          ),
          product_skin_concerns (
            skin_concerns ( skin_concern_id, skin_concern_name )
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

  /**
   * Memperbarui detail produk di Supabase beserta relasi tabel hubungnya
   */
  async updateProduct(
    productId: string,
    productData: {
      brand_name: string;
      product_name: string;
      bpom_number: string;
      spf: number;
      pa_grade: string;
      sunscreen_type: string;
      texture: string;
      finish: string;
      is_water_resistant: boolean;
      is_very_water_resistant: boolean;
      is_non_comedogenic: boolean;
      is_oil_free: boolean;
      is_active: boolean;
    },
    skinTypes: string[],
    skinConcerns: string[]
  ): Promise<boolean> {
    try {
      // 1. Update data produk utama
      const { error: prodError } = await supabase
        .from('products')
        .update({
          brand_name: productData.brand_name,
          product_name: productData.product_name,
          bpom_number: productData.bpom_number,
          spf: productData.spf,
          pa_grade: productData.pa_grade,
          sunscreen_type: productData.sunscreen_type,
          texture: productData.texture,
          finish: productData.finish,
          is_water_resistant: productData.is_water_resistant,
          is_very_water_resistant: productData.is_very_water_resistant,
          is_non_comedogenic: productData.is_non_comedogenic,
          is_oil_free: productData.is_oil_free,
          is_active: productData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('product_id', productId);

      if (prodError) throw prodError;

      // 2. Update Relasi Jenis Kulit (Hapus data lama, masukkan data baru)
      const { error: delTypesError } = await supabase
        .from('product_skin_types')
        .delete()
        .eq('product_id', productId);
      if (delTypesError) throw delTypesError;

      if (skinTypes.length > 0) {
        const insertTypes = skinTypes.map(stId => ({
          product_id: productId,
          skin_type_id: stId
        }));
        const { error: insTypesError } = await supabase
          .from('product_skin_types')
          .insert(insertTypes);
        if (insTypesError) throw insTypesError;
      }

      // 3. Update Relasi Masalah Kulit (Hapus data lama, masukkan data baru)
      const { error: delConcernsError } = await supabase
        .from('product_skin_concerns')
        .delete()
        .eq('product_id', productId);
      if (delConcernsError) throw delConcernsError;

      if (skinConcerns.length > 0) {
        const insertConcerns = skinConcerns.map(scId => ({
          product_id: productId,
          skin_concern_id: scId
        }));
        const { error: insConcernsError } = await supabase
          .from('product_skin_concerns')
          .insert(insertConcerns);
        if (insConcernsError) throw insConcernsError;
      }

      return true;
    } catch (error) {
      console.error('[ProductService] Gagal memperbarui data produk:', error);
      throw error;
    }
  },

  /**
   * Menambahkan produk baru ke database Supabase beserta relasi tabel hubungnya
   */
  async addProduct(
    productData: {
      product_code: string;
      brand_name: string;
      product_name: string;
      bpom_number: string;
      spf: number;
      pa_grade: string;
      sunscreen_type: string;
      texture: string;
      finish: string;
      is_water_resistant: boolean;
      is_very_water_resistant: boolean;
      is_non_comedogenic: boolean;
      is_oil_free: boolean;
      is_active: boolean;
    },
    skinTypes: string[],
    skinConcerns: string[]
  ): Promise<boolean> {
    try {
      // 1. Insert data produk utama
      const { data, error: prodError } = await supabase
        .from('products')
        .insert({
          product_code: productData.product_code,
          brand_name: productData.brand_name,
          product_name: productData.product_name,
          bpom_number: productData.bpom_number,
          spf: productData.spf,
          pa_grade: productData.pa_grade,
          sunscreen_type: productData.sunscreen_type,
          texture: productData.texture,
          finish: productData.finish,
          is_water_resistant: productData.is_water_resistant,
          is_very_water_resistant: productData.is_very_water_resistant,
          is_non_comedogenic: productData.is_non_comedogenic,
          is_oil_free: productData.is_oil_free,
          is_active: productData.is_active
        })
        .select()
        .single();

      if (prodError) throw prodError;
      const newProductId = data.product_id;

      // 2. Insert Relasi Jenis Kulit
      if (skinTypes.length > 0) {
        const insertTypes = skinTypes.map(stId => ({
          product_id: newProductId,
          skin_type_id: stId
        }));
        const { error: insTypesError } = await supabase
          .from('product_skin_types')
          .insert(insertTypes);
        if (insTypesError) throw insTypesError;
      }

      // 3. Insert Relasi Masalah Kulit
      if (skinConcerns.length > 0) {
        const insertConcerns = skinConcerns.map(scId => ({
          product_id: newProductId,
          skin_concern_id: scId
        }));
        const { error: insConcernsError } = await supabase
          .from('product_skin_concerns')
          .insert(insertConcerns);
        if (insConcernsError) throw insConcernsError;
      }

      return true;
    } catch (error) {
      console.error('[ProductService] Gagal menambahkan produk baru:', error);
      throw error;
    }
  }
};
