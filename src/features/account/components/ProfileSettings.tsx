import React, { useState } from 'react';
import { useAuth } from '../../auth';
import { Shield, Check, Loader2 } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  
  // Profile settings state
  const [name, setName] = useState(user?.name || 'Sarah Connor');
  const [email, setEmail] = useState(user?.email || 'sarah.connor@cyberdyne.com');
  const [role] = useState(user?.role || 'admin');
  
  // Form submission status
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Security credentials state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Clear password fields
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Overview Column */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="relative">
            <img 
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
              alt="Profile" 
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-primary/30 transition-transform duration-300"
            />
            <span className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-brand-bg bg-glow-accent" />
          </div>
          
          <h3 className="font-display font-bold text-base text-white mt-4">{name}</h3>
          <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider mt-0.5">{role === 'admin' ? 'Super Administrator' : 'Moderator'}</span>
          <p className="text-[11px] text-gray-400 mt-2">Cyberdyne Systems Security Core</p>

          <div className="w-full border-t border-white/5 pt-4 mt-5 space-y-3 text-left">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500">Security Clearance</span>
              <span className="text-white font-semibold flex items-center gap-1">
                <Shield size={12} className="text-brand-accent" />
                Level 4
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500">Node Location</span>
              <span className="text-white font-medium">US-West Mainframe</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500">Session Status</span>
              <span className="text-emerald-400 font-semibold">Active & Secured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Editing Form Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-bold text-base text-white">Account Details</h3>
              <p className="text-xs text-gray-400">Update your account settings and credentials</p>
            </div>
            
            {showSuccess && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-top-1 duration-200">
                <Check size={14} />
                <span>Changes Saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-primary/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-primary/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Password</label>
                <input 
                  type="password" 
                  placeholder="Leave blank to keep current"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-primary/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-primary/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-white/5 pt-4 mt-6">
              <button 
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 rounded-xl text-xs font-semibold text-brand-bg bg-brand-accent hover:bg-white hover:shadow-brand-accent/25 transition-all duration-300 shadow-md shadow-brand-accent/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
