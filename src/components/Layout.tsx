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
  { icon: CalendarIcon, label: 'Planner', path: '/planner' },
  { icon: Timer, label: 'Timer', path: '/timer' },
  { icon: BookOpen, label: 'Notes', path: '/notes' },
  { icon: Settings, label: 'Profile', path: '/profile' },
];

const desktopNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CalendarIcon, label: 'Study Planner', path: '/planner' },
  { icon: BookOpen, label: 'Notes', path: '/notes' },
  { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
  { icon: Timer, label: 'Study Timer', path: '/timer' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const { streak, notifications, markNotificationRead, clearNotifications, checkReminders, profile, level } = useStudyStats();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    checkReminders();
  }, [checkReminders]);

  const getFrameStyle = (frameId?: string) => {
    if (frameId === 'frame_gold') return 'ring-2 ring-amber-400 ring-offset-2';
    return 'ring-1 ring-slate-200 ring-offset-1';
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-500 sticky top-0 h-screen z-30",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-20 flex items-center px-6">
          <Logo size="sm" showText={isSidebarOpen} />
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {desktopNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-brand-50 text-brand-600 font-semibold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={20} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive ? "text-brand-600" : "text-slate-400")} />
                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-bold uppercase tracking-wider">
                    {item.label}
                  </div>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute right-0 w-1 h-6 bg-brand-600 rounded-l-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <Menu size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          {/* Mobile Header Content */}
          <div className="flex items-center justify-between w-full md:hidden">
             <div 
               onClick={() => navigate('/profile')}
               className={cn(
                 "w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold shadow-sm transition-transform active:scale-90",
                 getFrameStyle(profile.selectedFrame)
               )}
             >
               {profile.avatar}
             </div>
             
             <span className="text-lg font-bold tracking-tight text-slate-900">StudyX</span>

             <div className="flex items-center gap-2">
               <button 
                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                 className={cn(
                   "p-2 rounded-xl relative transition-all active:scale-90",
                   isNotificationsOpen ? "bg-brand-50 text-brand-600" : "text-slate-400 hover:text-slate-900"
                 )}
               >
                 <Bell size={20} />
                 {unreadCount > 0 && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                 )}
               </button>
             </div>
          </div>

          {/* Desktop Header Content */}
          <div className="hidden md:flex items-center bg-slate-100/50 rounded-xl px-4 py-2 w-full max-w-sm border border-slate-200/50 focus-within:bg-white focus-within:border-brand-200 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks, notes..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg border border-orange-100 font-bold text-[10px] uppercase tracking-wider">
              <Flame size={14} className="fill-orange-500" />
              <span>{streak} Day Streak</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "p-2 rounded-xl relative transition-all",
                  isNotificationsOpen ? "bg-brand-50 text-brand-600" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotificationsOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                        <button 
                          onClick={clearNotifications}
                          className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand-600 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="max-h-[360px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => markNotificationRead(n.id)}
                              className={cn(
                                "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3",
                                !n.read && "bg-brand-50/30"
                              )}
                            >
                              <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                n.type === 'achievement' ? "bg-amber-100 text-amber-600" : 
                                n.type === 'streak' ? "bg-orange-100 text-orange-600" :
                                "bg-brand-100 text-brand-600"
                              )}>
                                {n.type === 'achievement' ? <Trophy size={16} /> : 
                                 n.type === 'streak' ? <Flame size={16} /> : 
                                 <Bell size={16} />}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-900 mb-0.5">{n.title}</div>
                                <div className="text-[11px] text-slate-500 leading-relaxed">{n.message}</div>
                                <div className="text-[9px] text-slate-400 mt-1 font-medium">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              {!n.read && <div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5" />}
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                              <Bell size={24} />
                            </div>
                            <p className="text-xs text-slate-500 font-medium">No new notifications</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group"
            >
              <div className="text-right hidden lg:block">
                <div className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{profile.name}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scholar Level {level}</div>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold shadow-sm group-hover:scale-105 transition-all",
                getFrameStyle(profile.selectedFrame)
              )}>
                {profile.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl flex justify-around items-center px-2 z-20 shadow-lg shadow-slate-200/50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all active:scale-90",
                  isActive ? "text-brand-600 bg-brand-50/50" : "text-slate-400"
                )}
              >
                <item.icon size={20} className={isActive ? "scale-110" : ""} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
