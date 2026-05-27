export interface Product {
  product_id: string;
  brand_name: string;
  product_name: string;
  category: string;
  usage_time: 'Pagi' | 'Malam' | 'Pagi & Malam';
  is_active: boolean;
  spf_value?: number | null;
  pa_grade?: string | null;
  bpom_number: string;
}
