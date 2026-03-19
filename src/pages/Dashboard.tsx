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
  History
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotes, useFlashcards, useTasks, useStudyStats, useMindMaps, useStudyPlanner } from '../hooks/useStudyData';
import RevisionRadar from '../components/RevisionRadar';
import StudyTimeline from '../components/StudyTimeline';
import WeeklyActivityChart from '../components/Dashboard/WeeklyActivityChart';
import MasteryChart from '../components/Dashboard/MasteryChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const { notes } = useNotes();
  const { flashcards } = useFlashcards();
  const { tasks } = useTasks();
  const { mindMaps } = useMindMaps();
  const { plans } = useStudyPlanner();
  const { streak, sessions, xp, level, xpProgress, xpForNextLevel, achievements, unlockedAchievements, profile } = useStudyStats();

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const masteredFlashcards = flashcards.filter(c => c.masteryLevel >= 3).length;
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

  const quickActions = [
    { label: 'Study Planner', icon: CalendarIcon, color: 'text-brand-600', bg: 'bg-brand-50', path: '/planner', desc: 'Schedule sessions' },
    { label: 'Focus Timer', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', path: '/timer', desc: 'Start deep work' },
    { label: 'Notes', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', path: '/notes', desc: 'Review concepts' },
    { label: 'Flashcards', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50', path: '/flashcards', desc: 'Active recall' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSessions = plans.flatMap(p => p.sessions.filter(s => s.date === todayStr && !s.completed));
  const hasData = notes.length > 0 || flashcards.length > 0 || tasks.length > 0 || plans.length > 0;

  return (
    <div className="flex flex-col space-y-8 pb-32">
      {/* Hero Welcome Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-6 md:p-8 text-white shadow-2xl shadow-slate-200"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          <div className="max-w-md text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-300 mb-4"
            >
              <Sparkles size={12} />
              <span>Your Daily Overview</span>
            </motion.div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              {hasData ? `Keep it up, ${profile.name.split(' ')[0]}!` : "Ready to start, Scholar?"}
            </h1>
            <p className="mt-3 text-slate-400 text-xs md:text-sm leading-relaxed">
              {hasData 
                ? `You've reached Level ${level} with ${streak} days streak. Your focus is improving every day.`
                : "StudyX is your professional control center for academic excellence. Let's organize your first session."}
            </p>
            
            <div className="mt-6 md:mt-8 flex flex-wrap justify-center md:justify-start gap-3">
              <button 
                onClick={() => navigate('/timer')}
                className="action-button flex items-center gap-2 px-6 py-2.5 md:py-3"
              >
                <Clock size={18} />
                <span>Start Session</span>
              </button>
              {!hasData && (
                <button 
                  onClick={() => navigate('/planner')}
                  className="secondary-button !bg-white/5 !text-white !border-white/10 hover:!bg-white/10 px-6 py-2.5 md:py-3"
                >
                  Create Plan
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 md:w-36 md:h-36 -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-white/10 fill-none"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-brand-500 fill-none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 1000" }}
                  animate={{ strokeDasharray: `${xpProgress * 2.8} 1000` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-black text-white">{level}</span>
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-brand-300">Level</span>
              </div>
              
              {/* Floating XP Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg border-2 border-slate-900"
              >
                {xp} XP
              </motion.div>
            </div>

            <div className="hidden sm:flex flex-col items-center justify-center h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all cursor-default">
              <Flame size={28} className="text-orange-500 fill-orange-500/20 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xl md:text-2xl font-black">{streak}</span>
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-slate-400">Streak</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Today's Focus Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Target size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Today's Focus</h3>
            <p className="text-slate-500 text-sm font-medium">
              {todaysSessions.length > 0 
                ? `You have ${todaysSessions.length} sessions scheduled for today.` 
                : "No sessions scheduled. Take a moment to plan your day."}
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/planner')}
          className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:gap-3 transition-all"
        >
          <span>Go to Planner</span>
          <ArrowRight size={18} />
        </button>
      </motion.section>

      {/* Quick Actions Grid */}
      <section>
        <div className="flex items-center justify-between mb-5 px-1">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Control Center</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Access</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action, i) => (
            <motion.button 
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 + 0.3 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="premium-card p-4 md:p-5 flex flex-col items-center text-center group premium-card-hover"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 ${action.bg} ${action.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                <action.icon size={24} className="md:w-7 md:h-7" />
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-900 mb-1">{action.label}</span>
              <span className="text-[9px] md:text-[10px] font-medium text-slate-400">{action.desc}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Analytics & Progress */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revision Radar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RevisionRadar />
        </motion.div>

        {/* Weekly Activity */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 premium-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-600" />
              Weekly Activity
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                <Clock size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  {totalFocusMinutes}m Focus
                </span>
              </div>
            </div>
          </div>
          {totalFocusMinutes > 0 ? (
            <div className="h-[240px]">
              <WeeklyActivityChart />
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <History size={32} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">No Activity Data</p>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                Complete your first focus session to see your weekly performance chart.
              </p>
            </div>
          )}
        </motion.section>
      </div>

      {/* Task Progress & Timeline */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Task Progress */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="premium-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CheckSquare size={20} className="text-emerald-600" />
              Task Progress
            </h2>
            <Link to="/tasks" className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <ArrowRight size={18} />
            </Link>
          </div>
          
          {totalTasks > 0 ? (
            <div className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-5xl font-black text-slate-900 tracking-tighter">{progress}%</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Completion Rate</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{completedTasks}/{totalTasks}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks Done</div>
                </div>
              </div>
              
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <CheckSquare size={32} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">No Tasks Yet</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Add your first task to start tracking your daily progress.
              </p>
              <button 
                onClick={() => navigate('/tasks')}
                className="mt-6 text-xs font-bold text-brand-600 hover:underline"
              >
                + Create Task
              </button>
            </div>
          )}
        </motion.section>

        {/* Study Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <StudyTimeline />
        </motion.div>
      </div>

      {/* Bottom Row: Achievements & Recent */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="premium-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              Recent Badges
            </h3>
            <Link to="/profile" className="text-xs font-bold text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.slice(0, 6).map((id) => {
                const achievement = achievements.find(a => a.id === id);
                return (
                  <motion.div 
                    key={id} 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100 shadow-sm cursor-help"
                    title={achievement?.title}
                  >
                    {achievement?.icon}
                  </motion.div>
                );
              })
            ) : (
              <div className="w-full py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No badges earned yet</p>
                <p className="text-[10px] text-slate-400 mt-1">Keep studying to unlock rewards!</p>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="premium-card p-8 bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none shadow-xl shadow-brand-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Study Tip</h3>
              <p className="text-brand-100 text-xs font-medium">Boost your productivity</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-brand-50 italic">
            "The best way to learn is to teach. Try explaining a concept you've just studied to someone else, or even to yourself out loud."
          </p>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-600 bg-brand-400 flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-brand-600 bg-brand-800 flex items-center justify-center text-[10px] font-bold">
                +12
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-200">Join the community</span>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
