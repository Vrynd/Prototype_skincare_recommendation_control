export interface UserItem {
  id_user: string;
  nama_lengkap: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  status_akun: boolean;
  foto_profile: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  searchTerm: string;
  roleFilter: 'all' | 'admin' | 'user';
  sortBy: 'newest' | 'oldest' | 'name-asc' | 'name-desc';
  page: number;
  limit: number;
}

export interface UserResponse {
  data: UserItem[];
  count: number;
}
