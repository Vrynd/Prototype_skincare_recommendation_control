export interface Product {
  product_id: string;
  product_code: string;
  brand_name: string;
  product_name: string;
  category: string;
  usage_time: 'Pagi' | 'Malam' | 'Pagi & Malam';
  is_active: boolean;
  spf_value?: number | null;
  pa_grade?: string | null;
  bpom_number: string;
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
