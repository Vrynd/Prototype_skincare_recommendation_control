import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { supabase } from '../../../utils/supabase';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ref untuk menyimpan status user terkini agar menghindari stale closure di event listener
  const currentUserRef = React.useRef<User | null>(null);

  useEffect(() => {
    currentUserRef.current = user;
  }, [user]);

  // Efek untuk memuat sesi awal dan memantau perubahan status autentikasi Supabase secara real-time
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentSessionUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('[AuthProvider] Gagal inisialisasi sesi awal:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Berlangganan (subscribe) ke event status auth Supabase secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log(`[Supabase Auth Event]: ${event}`);

      if (event === 'SIGNED_IN' && session?.user) {
        // Jika user yang sama sudah ter-load di context, abaikan event focus/re-auth tab
        if (currentUserRef.current && currentUserRef.current.id === session.user.id) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        try {
          const profile = await authService.getUserProfile(session.user.id);
          if (profile && profile.role === 'admin') {
            setUser(profile);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('[AuthProvider] Error saat memuat profil signed in:', err);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Token diperbarui, pastikan profil sinkron jika user-nya berbeda atau belum ter-load
        if (currentUserRef.current && currentUserRef.current.id === session.user.id) {
          return;
        }
        try {
          const profile = await authService.getUserProfile(session.user.id);
          if (profile && profile.role === 'admin') {
            setUser(profile);
          }
        } catch (err) {
          console.error('[AuthProvider] Error token refresh profile:', err);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const adminUser = await authService.signIn(email, password);
      setUser(adminUser);
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      console.error('[AuthProvider] Gagal sign out:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
