/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  BookOpen, 
  CreditCard, 
  CheckSquare, 
  Clock, 
  Flame, 
  ArrowRight,
  Plus,
  Zap,
  Target,
  Sparkles,
  Trophy,
  Calendar as CalendarIcon,
  Share2,
  History,
  Layout as LayoutIcon,
  BrainCircuit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotes, useFlashcards, useTasks, useStudyStats, useMindMaps, useStudyPlanner } from '../hooks/useStudyData';
import WeeklyActivityChart from '../components/Dashboard/WeeklyActivityChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const { notes } = useNotes();
  const { flashcards } = useFlashcards();
  const { tasks } = useTasks();
  const { plans } = useStudyPlanner();
  const { streak, xp, level, xpProgress, profile } = useStudyStats();

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const quickActions = [
    { label: 'Focus', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', path: '/timer' },
    { label: 'Task', icon: Plus, color: 'text-emerald-400', bg: 'bg-emerald-500/10', path: '/tasks' },
    { label: 'Notes', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', path: '/notes' },
    { label: 'Cards', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10', path: '/flashcards' },
    { label: 'Planner', icon: CalendarIcon, color: 'text-brand-400', bg: 'bg-brand-500/10', path: '/planner' },
    { label: 'MindMap', icon: BrainCircuit, color: 'text-pink-400', bg: 'bg-pink-500/10', path: '/mindmap' },
  ];

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex flex-col space-y-8 pb-32 max-w-lg mx-auto px-1">
      {/* 1. HERO SECTION */}
      <section className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              {greeting} <span className="animate-bounce-slow">👋</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Ready to level up today?</p>
          </div>
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-brand-500/30 shadow-lg shadow-brand-500/10 cursor-pointer"
          >
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Main Highlight Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group cursor-pointer"
          onClick={() => navigate(tasks.length > 0 ? '/tasks' : '/timer')}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>
          <div className="relative premium-card p-6 flex items-center justify-between overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={80} className="text-brand-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Current Status</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                {tasks.filter(t => !t.completed).length > 0 
                  ? `${tasks.filter(t => !t.completed).length} Tasks Pending` 
                  : "Start Focus Session"}
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                {tasks.filter(t => !t.completed).length > 0 
                  ? "Don't let them pile up! You got this." 
                  : "Time to get into the zone and crush it."}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={24} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. QUICK ACTION BAR */}
      <section className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-3 min-w-max pb-2">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full glass border-white/5 hover:bg-white/10 transition-all"
            >
              <div className={`p-1.5 rounded-lg ${action.bg} ${action.color}`}>
                <action.icon size={16} />
              </div>
              <span className="text-xs font-bold text-slate-200">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* 3. FEATURE CARDS */}
      <div className="grid grid-cols-1 gap-4">
        {/* Study Planner Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="premium-card p-5 group cursor-pointer"
          onClick={() => navigate('/planner')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                <CalendarIcon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Study Planner</h3>
                <p className="text-[10px] text-slate-500 font-medium">Your schedule for today</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-brand-400">{progress}%</span>
              <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-brand-500"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {tasks.slice(0, 2).map((task, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                <span className={`text-xs font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                  {task.title}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-4 text-slate-500 text-[10px] font-medium italic">
                No tasks planned for today.
              </div>
            )}
          </div>
        </motion.div>

        {/* Focus Timer Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="premium-card p-5 group cursor-pointer overflow-hidden relative"
          onClick={() => navigate('/timer')}
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Clock size={120} />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Focus Timer</h3>
                <p className="text-[10px] text-slate-500 font-medium">Deep work session</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
              25:00
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin-slow"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-orange-500 shadow-lg shadow-orange-500/40 flex items-center justify-center text-white">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {/* Notes Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="premium-card p-5 group cursor-pointer"
            onClick={() => navigate('/notes')}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3">
              <BookOpen size={20} />
            </div>
            <h3 className="text-sm font-bold mb-1">Notes</h3>
            <p className="text-[10px] text-slate-500 font-medium mb-4">{notes.length} saved notes</p>
            <div className="space-y-1.5">
              {notes.slice(0, 2).map((note, i) => (
                <div key={i} className="h-1 bg-slate-800 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-blue-500/50 w-3/4"></div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Flashcards Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="premium-card p-5 group cursor-pointer"
            onClick={() => navigate('/flashcards')}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
              <CreditCard size={20} />
            </div>
            <h3 className="text-sm font-bold mb-1">Revision</h3>
            <p className="text-[10px] text-slate-500 font-medium mb-4">{flashcards.length} flashcards</p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-[8px] font-bold">
                  {i}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. GAMIFICATION STATS */}
      <section className="grid grid-cols-2 gap-4">
        <div className="premium-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Flame size={20} />
          </div>
          <div>
            <span className="text-xl font-black text-white">{streak}</span>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Day Streak</p>
          </div>
        </div>
        <div className="premium-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
            <Trophy size={20} />
          </div>
          <div>
            <span className="text-xl font-black text-white">Lvl {level}</span>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{xp} Total XP</p>
          </div>
        </div>
      </section>

      {/* Weekly Activity Preview */}
      <section className="premium-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-400" />
            Activity
          </h3>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last 7 Days</span>
        </div>
        <div className="h-32">
          <WeeklyActivityChart />
        </div>
      </section>
    </div>
  );
}
