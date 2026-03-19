/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  CreditCard, 
  Timer, 
  CheckSquare, 
  Share2, 
  Menu, 
  X, 
  Search,
  Settings,
  Bell,
  Flame,
  Trophy,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStudyStats, useMindMaps } from '../hooks/useStudyData';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: CreditCard, label: 'Cards', path: '/flashcards' },
  { icon: BookOpen, label: 'Notes', path: '/notes' },
  { icon: Timer, label: 'Timer', path: '/timer' },
];

const desktopNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CalendarIcon, label: 'Study Planner', path: '/planner' },
  { icon: BookOpen, label: 'Notes', path: '/notes' },
  { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
  { icon: Timer, label: 'Study Timer', path: '/timer' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Share2, label: 'Mind Map', path: '/mindmap' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { streak, notifications, markNotificationRead, clearNotifications, checkReminders, profile, level } = useStudyStats();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    checkReminders();
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkReminders]);

  const getFrameStyle = (frameId?: string) => {
    if (frameId === 'frame_gold') return 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900';
    return 'ring-1 ring-white/10 ring-offset-1 ring-offset-slate-900';
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] font-sans selection:bg-brand-500/30 selection:text-white overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 sticky top-0 h-screen z-30",
          isSidebarOpen ? "w-72" : "w-24"
        )}
      >
        <div className="h-24 flex items-center px-8">
          <Logo size="sm" showText={isSidebarOpen} />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {desktopNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-brand-500/10 text-brand-400 font-bold" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={22} className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300")} />
                {isSidebarOpen && <span className="text-sm tracking-tight">{item.label}</span>}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 font-bold uppercase tracking-widest shadow-xl border border-white/10">
                    {item.label}
                  </div>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1.5 h-8 bg-brand-500 rounded-r-full shadow-[0_0_12px_rgba(92,103,232,0.5)]"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className={cn(
            "bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/5 transition-all",
            !isSidebarOpen && "justify-center px-0"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold shadow-sm shrink-0",
              getFrameStyle(profile.selectedFrame)
            )}>
              {profile.avatar}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{profile.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lvl {level}</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all group"
          >
            <Menu size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            {isSidebarOpen && <span className="text-sm font-bold">Collapse Menu</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={cn(
          "h-20 md:h-24 flex items-center justify-between px-6 md:px-12 sticky top-0 z-20 transition-all duration-500",
          scrolled ? "bg-slate-900/80 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"
        )}>
          {/* Mobile Header Content */}
          <div className="flex items-center justify-between w-full md:hidden">
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">StudyX</span>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center relative transition-all active:scale-90 border border-white/10 shadow-lg",
                    isNotificationsOpen ? "bg-brand-500/20 text-brand-400 border-brand-500/30" : "bg-white/5 text-slate-400 hover:text-white"
                  )}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse shadow-sm"></span>
                  )}
                </button>
              </div>

              <div 
                onClick={() => navigate('/profile')}
                className={cn(
                  "w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 font-bold shadow-lg transition-all active:scale-90",
                  getFrameStyle(profile.selectedFrame)
                )}
              >
                {profile.avatar}
              </div>
            </div>
          </div>

          {/* Desktop Header Content */}
          <div className="hidden md:flex flex-1 items-center gap-8">
            <div className="flex items-center bg-white/5 rounded-2xl px-5 py-3 w-full max-lg border border-white/5 shadow-inner focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-500/30 transition-all group">
              <Search size={18} className="text-slate-500 group-focus-within:text-brand-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search your study universe..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full ml-3 placeholder:text-slate-500 font-semibold text-white"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2.5 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-2xl border border-orange-500/20 font-bold text-xs shadow-lg">
              <Flame size={18} className="fill-orange-500 animate-pulse" />
              <span>{streak} Day Streak</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center relative transition-all border border-white/10 shadow-lg",
                  isNotificationsOpen ? "bg-brand-500/20 text-brand-400 border-brand-500/30" : "bg-white/5 text-slate-400 hover:text-white hover:border-brand-500/30"
                )}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse shadow-sm"></span>
                )}
              </button>
            </div>

            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-4 pl-8 border-l border-white/5 cursor-pointer group"
            >
              <div className="text-right hidden lg:block">
                <div className="text-sm font-extrabold text-white group-hover:text-brand-400 transition-colors">{profile.name}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scholar Level {level}</div>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 font-bold shadow-lg group-hover:scale-110 group-hover:shadow-brand-500/20 transition-all",
                getFrameStyle(profile.selectedFrame)
              )}>
                {profile.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Shared Notification Dropdown */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsNotificationsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="fixed md:absolute top-20 md:top-auto md:right-12 mt-4 w-[calc(100%-3rem)] md:w-96 left-6 md:left-auto bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 z-50 overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                  <h3 className="text-base font-bold text-white">Notifications</h3>
                  <button 
                    onClick={clearNotifications}
                    className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-brand-500/20 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-[420px] overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          markNotificationRead(n.id);
                          setIsNotificationsOpen(false);
                        }}
                        className={cn(
                          "p-5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-4 group",
                          !n.read && "bg-brand-500/5"
                        )}
                      >
                        <div className={cn(
                          "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform",
                          n.type === 'achievement' ? "bg-amber-500/20 text-amber-400" : 
                          n.type === 'streak' ? "bg-orange-500/20 text-orange-400" :
                          "bg-brand-500/20 text-brand-400"
                        )}>
                          {n.type === 'achievement' ? <Trophy size={20} /> : 
                           n.type === 'streak' ? <Flame size={20} /> : 
                           <Bell size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white mb-0.5">{n.title}</div>
                          <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">{n.message}</div>
                          <div className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 shadow-[0_0_8px_rgba(92,103,232,0.5)]" />}
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-700">
                        <Bell size={32} />
                      </div>
                      <p className="text-sm text-slate-400 font-bold">All caught up!</p>
                      <p className="text-xs text-slate-500 mt-1">No new notifications for now.</p>
                    </div>
                  )}
                </div>
                <button className="w-full py-4 text-center text-xs font-bold text-brand-400 hover:bg-white/5 transition-colors border-t border-white/5">
                  View Notification History
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-4 z-40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all relative group",
                  isActive ? "text-brand-400" : "text-slate-500"
                )}
              >
                <item.icon size={22} className={cn("transition-all duration-300", isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-slate-300")} />
                <span className={cn("text-[10px] font-bold mt-1 uppercase tracking-widest transition-all", isActive ? "opacity-100" : "opacity-0 scale-50")}>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNavMobile"
                    className="absolute -bottom-1 w-1 h-1 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(92,103,232,0.8)]"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
