export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
