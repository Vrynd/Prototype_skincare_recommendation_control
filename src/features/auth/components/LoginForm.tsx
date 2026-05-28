import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Klien-side validasi dasar
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email dan Password wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error('[LoginForm] Gagal login:', err);
      const error = err as Error;
      // Terjemahan pesan error umum untuk user experience yang lebih ramah
      if (error.message?.includes('Invalid login credentials')) {
        setErrorMsg('Email atau password salah. Silakan coba lagi.');
      } else {
        setErrorMsg(error.message || 'Terjadi kesalahan sistem saat mencoba login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full text-left">
      {/* HEADER */}
      <div className="space-y-1 text-center sm:text-left select-none">
        <div className="flex justify-center sm:justify-start items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-linear-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent/20 animate-pulse">
            <Sparkles size={11} className="text-brand-bg font-bold" />
          </div>
          <span className="font-display font-black text-[10px] text-white tracking-widest text-glow-accent">AG.CORE CONTROL</span>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
          Selamat Datang Kembali
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Masuk untuk mengelola sistem rekomendasi skincare
        </p>
      </div>

      {/* ERROR ALERT */}
      {errorMsg && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/5 animate-in fade-in slide-in-from-top-1 duration-200">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* FORM INPUTS */}
      <div className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 select-none">
            Email Administrator
          </label>
          <div className="relative flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-brand-primary/50 focus-within:ring-1 focus-within:ring-brand-primary/20 transition-all duration-300">
            <Mail size={14} className="absolute left-3.5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              disabled={isSubmitting}
              className="bg-transparent text-xs text-white outline-none w-full py-3.5 pl-11 pr-4 placeholder-gray-600 font-medium disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 select-none">
            Kata Sandi
          </label>
          <div className="relative flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-brand-primary/50 focus-within:ring-1 focus-within:ring-brand-primary/20 transition-all duration-300">
            <Lock size={14} className="absolute left-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="bg-transparent text-xs text-white outline-none w-full py-3.5 pl-11 pr-11 placeholder-gray-600 font-medium disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
              className="absolute right-3.5 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title={showPassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl text-xs font-bold tracking-wide text-brand-bg bg-brand-accent hover:bg-white hover:shadow-brand-accent/25 transition-all duration-300 shadow-lg shadow-brand-accent/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin text-brand-bg" />
            <span>Memverifikasi Akun...</span>
          </>
        ) : (
          <span>Masuk Ke Panel</span>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
