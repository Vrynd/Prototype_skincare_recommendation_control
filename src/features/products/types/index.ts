export interface Product {
  product_id: string;
  product_code: string;
  brand_name: string;
  product_name: string;
  sunscreen_type: string;
  spf: number;
  pa_grade: string;
  bpom_number: string;
  is_active: boolean;
}

// Tipe lengkap untuk sidebar detail — memuat semua kolom + relasi
export interface ProductDetail extends Product {
  texture: string;
  finish: string;
  is_water_resistant: boolean;
  is_very_water_resistant: boolean;
  is_non_comedogenic: boolean;
  is_oil_free: boolean;
  created_at: string;
  updated_at: string;
  product_skin_types?: { skin_types: { skin_type_name: string } | null }[];
  product_skin_concerns?: { skin_concerns: { skin_concern_name: string } | null }[];
}

export interface SkinType {
  skin_type_id: string;
  skin_type_code: string;
  skin_type_name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface SkinConcern {
  skin_concern_id: string;
  skin_concern_code: string;
  skin_concern_name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}
