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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const { streak, notifications, markNotificationRead, clearNotifications, checkReminders, profile, level } = useStudyStats();
  const { addMindMap } = useMindMaps();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    checkReminders();
  }, [checkReminders]);

  const getFrameStyle = (frameId?: string) => {
    if (frameId === 'frame_gold') return 'border-2 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]';
    return 'border border-brand-200';
  };

  const handleQuickMindMap = () => {
    const newMap = addMindMap('Quick Mind Map', [
      { id: 'root', text: 'New Idea', x: 400, y: 300, color: '#4f46e5', icon: '🧠' }
    ]);
    navigate(`/mindmap/${newMap.id}`);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-zinc-200 transition-all duration-500 sticky top-0 h-screen z-30",
          isSidebarOpen ? "w-72" : "w-24"
        )}
      >
        <div className="p-8 flex items-center justify-between">
          <Logo size="md" showText={isSidebarOpen} className={cn("transition-all duration-500", !isSidebarOpen && "justify-center")} />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 p-3.5 rounded-2xl transition-all group relative",
                isActive 
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-100 font-bold" 
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <item.icon size={22} className={cn("shrink-0 transition-transform group-hover:scale-110", isSidebarOpen ? "" : "mx-auto")} />
              {isSidebarOpen && <span className="tracking-tight">{item.label}</span>}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-bold uppercase tracking-widest">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-100">
          <NavLink 
            to="/profile"
            className={({ isActive }) => cn(
              "flex items-center gap-3 p-3.5 transition-all cursor-pointer rounded-2xl",
              isActive ? "bg-brand-50 text-brand-700 font-bold" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100",
              !isSidebarOpen && "justify-center"
            )}
          >
            <Settings size={22} />
            {isSidebarOpen && <span className="text-sm">Profile & Settings</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-zinc-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20">
          <div className="flex items-center justify-between w-full md:hidden">
             <div 
               onClick={() => navigate('/profile')}
               className={cn(
                 "w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold shadow-sm",
                 getFrameStyle(profile.selectedFrame)
               )}
             >
               {profile.avatar}
             </div>
             
             <div className="flex flex-col items-center">
               <span className="text-lg font-black tracking-tighter text-zinc-900">StudyX</span>
             </div>

             <div className="relative">
               <button 
                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                 className={cn(
                   "p-2.5 rounded-xl relative transition-all",
                   isNotificationsOpen ? "bg-brand-50 text-brand-600" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                 )}
               >
                 <Bell size={22} />
                 {unreadCount > 0 && (
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                 )}
               </button>
             </div>
          </div>

          <div className="hidden md:flex items-center bg-zinc-100/50 rounded-2xl px-4 py-2.5 w-full max-w-md border border-zinc-200/50 focus-within:bg-white focus-within:border-brand-200 transition-all">
            <Search size={18} className="text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 placeholder:text-zinc-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl border border-orange-100 font-bold text-xs uppercase tracking-widest">
              <Flame size={16} className="fill-orange-500" />
              <span>{streak} Day Streak</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "p-2.5 rounded-xl relative transition-all",
                  isNotificationsOpen ? "bg-brand-50 text-brand-600" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                )}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
                      className="absolute right-0 mt-2 w-80 bg-white rounded-[2rem] shadow-2xl border border-zinc-200 z-50 overflow-hidden"
                    >
                      <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <h3 className="font-bold text-zinc-900">Notifications</h3>
                        <button 
                          onClick={clearNotifications}
                          className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-brand-600 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => markNotificationRead(n.id)}
                              className={cn(
                                "p-4 border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer flex gap-3",
                                !n.read && "bg-brand-50/30"
                              )}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                n.type === 'achievement' ? "bg-amber-100 text-amber-600" : 
                                n.type === 'streak' ? "bg-orange-100 text-orange-600" :
                                "bg-brand-100 text-brand-600"
                              )}>
                                {n.type === 'achievement' ? <Trophy size={18} /> : 
                                 n.type === 'streak' ? <Flame size={18} /> : 
                                 <Bell size={18} />}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-bold text-zinc-900 mb-0.5">{n.title}</div>
                                <div className="text-[11px] text-zinc-500 leading-relaxed">{n.message}</div>
                                <div className="text-[9px] text-zinc-400 mt-1 font-medium">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              {!n.read && <div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5" />}
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
                              <Bell size={24} />
                            </div>
                            <p className="text-sm text-zinc-500 font-medium">No new notifications</p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-4 text-center bg-zinc-50/50">
                          <button className="text-[10px] font-bold text-brand-600 uppercase tracking-widest hover:underline">
                            View All Activity
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 pl-6 border-l border-zinc-200 cursor-pointer group"
            >
              <div className="text-right hidden lg:block">
                <div className="text-sm font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">{profile.name}</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Scholar Level {level}</div>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold shadow-sm group-hover:scale-105 transition-all",
                getFrameStyle(profile.selectedFrame)
              )}>
                {profile.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-around p-3 z-20 glass">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1",
                isActive ? "text-brand-600" : "text-zinc-400"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-40 md:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo size="md" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-500">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {desktopNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 p-4 rounded-xl transition-all",
                      isActive 
                        ? "bg-brand-50 text-brand-700 font-medium" 
                        : "text-zinc-500 hover:bg-zinc-100"
                    )}
                  >
                    <item.icon size={22} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
