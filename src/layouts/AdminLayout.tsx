import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Activity,
  Users,
  User,
  Bell,
  Search,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../features/auth';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'Status', path: '/status', icon: Activity },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Account', path: '/account', icon: User },
  ];

  return (
    <div className="relative min-h-screen w-screen bg-brand-bg font-sans text-gray-100 selection:bg-brand-accent selection:text-brand-bg">
      {/* Background Animated Drifting Glow Spheres (Botanical Green) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#4d7c0f]/[0.05] blur-[120px] animate-float-slow-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#a3e635]/[0.04] blur-[120px] animate-float-slow-2 pointer-events-none" />



      {/* Fixed Floating Top Bar Container */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 max-w-6xl mx-auto">
        <header className="glass rounded-full px-4 py-2.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl bg-slate-950/50">
          {/* Brand/Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-linear-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent/20">
              <Sparkles size={15} className="text-brand-bg font-bold" />
            </div>
            <span className="font-display font-black text-xs text-white tracking-widest text-glow-accent hidden sm:block">AG.CORE</span>
          </div>

          {/* Navigation Links inside Nav Bar */}
          <nav className="flex items-center gap-1 sm:gap-2 px-1 py-1 rounded-full bg-white/3 border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `
                    relative px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 group
                    ${isActive
                      ? 'bg-linear-to-r from-brand-primary to-brand-accent text-brand-bg shadow-md shadow-brand-accent/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <Icon size={13} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden md:inline">{item.name}</span>

                  {/* Small Active Dot indicator for Mobile (since labels are hidden) */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-bg animate-pulse md:hidden" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Action Tools & User Profile dropdown */}
          <div className="flex items-center gap-3 shrink-0 relative">
            {/* Quick Search - Expandable */}
            <div className={`relative flex items-center h-8 rounded-full bg-white/5 border border-white/10 transition-all duration-300 ${isSearchExpanded ? 'w-40 sm:w-48 px-3' : 'w-8 justify-center cursor-pointer hover:border-brand-primary/50'}`}>
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className={`text-gray-400 hover:text-white transition-colors ${isSearchExpanded ? '' : 'absolute inset-0 flex items-center justify-center'}`}
                title="Search"
              >
                <Search size={13} />
              </button>
              {isSearchExpanded && (
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  onBlur={() => setIsSearchExpanded(false)}
                  className="bg-transparent text-[10px] text-white border-none outline-none w-full placeholder-gray-500 font-medium ml-2 animate-in fade-in duration-200"
                />
              )}
            </div>

            {/* Unified Notification & Avatar Capsule */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              {/* Notification Button */}
              <button className="relative w-6 h-6 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white cursor-pointer">
                <Bell size={13} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-accent bg-glow-accent animate-pulse" />
              </button>

              {/* Avatar Button */}
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-6 h-6 rounded-full overflow-hidden hover:ring-2 hover:ring-brand-accent/50 transition-all duration-300 cursor-pointer shrink-0"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>

            {/* User Dropdown */}
            {showUserDropdown && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowUserDropdown(false)} />
                <div className="absolute right-0 top-11 w-48 rounded-2xl glass border border-white/10 p-2 shadow-2xl z-30 animate-in fade-in slide-in-from-top-1 duration-200 bg-slate-950/85">
                  <div className="px-3 py-2 border-b border-white/5 text-left">
                    <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-[9px] text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>End Session</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Main Wide Canvas Panel */}
      <main className="max-w-6xl mx-auto pt-28 px-4 sm:px-6 pb-12 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Outlet />
      </main>
    </div>
  );
};
