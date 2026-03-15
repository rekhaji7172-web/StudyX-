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

  const stats = [
    { label: 'Notes', value: notes.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', path: '/notes' },
    { label: 'Flashcards', value: `${masteredFlashcards}/${flashcards.length}`, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50', path: '/flashcards' },
    { label: 'Mind Maps', value: mindMaps.length, icon: Share2, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/mindmap' },
    { label: 'Study Plans', value: plans.length, icon: CalendarIcon, color: 'text-brand-600', bg: 'bg-brand-50', path: '/planner' },
    { label: 'Study Time', value: totalFocusMinutes >= 60 ? `${Math.floor(totalFocusMinutes / 60)}h ${totalFocusMinutes % 60}m` : `${totalFocusMinutes}m`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', path: '/timer' },
  ];

  const quickActions = [
    { label: 'Study Planner', icon: CalendarIcon, color: 'text-brand-600', bg: 'bg-brand-50', path: '/planner' },
    { label: 'Focus Timer', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', path: '/timer' },
    { label: 'Notes', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', path: '/notes' },
    { label: 'Flashcards', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50', path: '/flashcards' },
    { label: 'Revision Radar', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', path: '/timer' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSessions = plans.flatMap(p => p.sessions.filter(s => s.date === todayStr && !s.completed));
  const hasData = notes.length > 0 || flashcards.length > 0 || tasks.length > 0 || plans.length > 0;

  return (
    <div className="flex flex-col space-y-6 pb-24">
      {/* Welcome Section */}
      {!hasData ? (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-600 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-brand-100"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2">Welcome to StudyX 👋</h1>
            <p className="text-brand-100 text-sm mb-6 leading-relaxed">
              Start your study journey by creating your first study plan. We'll help you stay organized and focused.
            </p>
            <button 
              onClick={() => navigate('/planner')}
              className="bg-white text-brand-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-brand-50 transition-colors"
            >
              Create Study Plan
            </button>
          </div>
        </motion.section>
      ) : (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative z-10 flex-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold tracking-tight text-zinc-900"
            >
              Welcome back, {profile.name.split(' ')[0]}! 👋
            </motion.h1>
            <p className="text-zinc-500 mt-1">You're doing great. Level {level} reached!</p>
            
            <div 
              className="mt-8 max-w-md cursor-pointer group/xp"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest group-hover/xp:text-brand-600 transition-colors">Level {level}</span>
                </div>
                <span className="text-xs font-bold text-zinc-900">{xp} / {xpForNextLevel} XP</span>
              </div>
              <div className="h-3 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full shadow-lg shadow-brand-100"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center justify-center bg-orange-50 text-orange-700 w-24 h-24 rounded-[2rem] border border-orange-100 font-bold shadow-sm"
            >
              <Flame size={28} className="fill-orange-500 text-orange-500 mb-1" />
              <span className="text-xl">{streak}</span>
              <span className="text-[8px] uppercase tracking-widest">Streak</span>
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/notes')}
              className="flex flex-col items-center justify-center bg-brand-600 text-white w-24 h-24 rounded-[2rem] hover:bg-brand-700 transition-all font-bold shadow-lg shadow-brand-100"
            >
              <Plus size={28} />
              <span className="text-[8px] uppercase tracking-widest mt-1">New Note</span>
            </motion.button>
          </div>
        </motion.section>
      )}

      {/* Daily Goal Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
            <Target size={24} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">Today's Goal</h3>
            <p className="text-zinc-500 text-sm">
              {todaysSessions.length > 0 
                ? `Complete ${todaysSessions.length} study sessions.` 
                : "Start your first study session."}
            </p>
          </div>
        </div>
        <ArrowRight size={20} className="text-zinc-300" />
      </motion.section>

      {/* Quick Actions Grid */}
      <section>
        <h2 className="text-lg font-bold mb-4 px-2">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, i) => (
            <motion.button 
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 + 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-[2rem] border border-zinc-200 shadow-sm hover:border-brand-200 transition-all group"
            >
              <div className={`w-12 h-12 ${action.bg} ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon size={24} />
              </div>
              <span className="text-xs font-bold text-zinc-700">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Progress & Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Task Progress */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckSquare size={22} className="text-emerald-600" />
              Daily Progress
            </h2>
          </div>
          
          {totalTasks > 0 ? (
            <div className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-5xl font-bold text-zinc-900">{progress}%</div>
                  <div className="text-sm font-medium text-zinc-500 mt-2">Tasks completed</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-zinc-900">{completedTasks} of {totalTasks}</div>
                </div>
              </div>
              
              <div className="h-4 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-zinc-300">
                <CheckSquare size={32} />
              </div>
              <p className="text-sm text-zinc-500 font-medium px-4">
                Your progress will appear here once you start studying.
              </p>
            </div>
          )}
        </motion.section>

        {/* Weekly Activity */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp size={22} className="text-brand-600" />
                Weekly Activity
              </h2>
            </div>
          </div>
          {totalFocusMinutes > 0 ? (
            <WeeklyActivityChart />
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-zinc-300">
                <Clock size={32} />
              </div>
              <p className="text-sm text-zinc-500 font-medium">
                Complete your first study session to unlock achievements.
              </p>
            </div>
          )}
        </motion.section>
      </div>

      {/* Recent Achievements */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            Badges
          </h3>
          <Link to="/profile" className="text-xs font-bold text-brand-600 hover:underline">View All</Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {unlockedAchievements.length > 0 ? (
            unlockedAchievements.slice(0, 6).map((id) => {
              const achievement = achievements.find(a => a.id === id);
              return (
                <div 
                  key={id} 
                  className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-2xl border border-zinc-100 shadow-sm hover:scale-110 transition-transform cursor-help"
                  title={achievement?.title}
                >
                  {achievement?.icon}
                </div>
              );
            })
          ) : (
            <div className="w-full py-4 text-center">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No badges yet</p>
              <p className="text-[10px] text-zinc-400 mt-1">Start studying to earn your first badge!</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
