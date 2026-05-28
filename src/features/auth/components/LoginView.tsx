import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { LoginForm } from './LoginForm';

export const LoginView: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Redirect ke halaman dasbor utama jika terdeteksi user sudah login dan aktif
  if (isAuthenticated && user?.role === 'admin') {
    const state = location.state as { from?: { pathname?: string } } | null;
    const from = state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="relative min-h-screen w-screen bg-brand-bg font-sans text-gray-100 flex items-center justify-center p-4 selection:bg-brand-accent selection:text-brand-bg overflow-hidden">
      {/* Background Animated Drifting Glow Spheres (Botanical Green Theme) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#4d7c0f]/5 blur-[120px] animate-float-slow-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#a3e635]/4 blur-[120px] animate-float-slow-2 pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="glass-card max-w-sm w-full rounded-3xl p-8 border border-white/5 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-500 bg-slate-950/40 backdrop-blur-xl">
        <LoginForm />
      </div>

      {/* Bottom Footer Credit */}
      <div className="absolute bottom-6 left-0 right-0 text-center select-none text-[9px] font-black tracking-widest text-gray-500 uppercase z-10">
        © 2026 Skincare Recommendation Control Panel
      </div>
    </div>
  );
};

export default LoginView;
