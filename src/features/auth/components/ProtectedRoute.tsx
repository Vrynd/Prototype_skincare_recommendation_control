import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Loading Screen Glassmorphic Mewah saat verifikasi sesi sedang berlangsung
  if (isLoading) {
    return (
      <div className="relative w-screen h-screen min-h-screen bg-brand-bg flex flex-col items-center justify-center font-sans text-gray-100 overflow-hidden">
        {/* Background Animated Drifting Glow Spheres (Botanical Green) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#4d7c0f]/5 blur-[120px] animate-float-slow-1 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#a3e635]/4 blur-[120px] animate-float-slow-2 pointer-events-none" />

        <div className="glass rounded-3xl p-10 border border-white/10 flex flex-col items-center justify-center space-y-6 shadow-2xl backdrop-blur-2xl bg-slate-950/40 relative z-10 max-w-sm w-full mx-4">
          <div className="relative">
            {/* Outer Spinning Ring */}
            <div className="w-16 h-16 rounded-full border-2 border-brand-accent/20 border-t-brand-accent animate-spin" />
            {/* Center Glowing Logo */}
            <div className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-linear-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent/20 animate-pulse">
              <Sparkles size={18} className="text-brand-bg font-bold" />
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase text-glow-accent">AG.CORE</h4>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">Mengamankan Sesi Administrator...</p>
          </div>
        </div>
      </div>
    );
  }

  // Jika tidak terautentikasi atau bukan bertipe admin, lemparkan ke halaman login
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
