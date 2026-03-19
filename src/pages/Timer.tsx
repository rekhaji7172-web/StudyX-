/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Settings,
  Volume2,
  VolumeX,
  History,
  Target,
  Zap,
  Trophy,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useStudyStats } from '../hooks/useStudyData';
import { useFocusMusic } from '../hooks/useFocusMusic';
import TimerSettings from '../components/Timer/TimerSettings';
import FocusMode from '../components/Timer/FocusMode';
import FocusMusicPlayer from '../components/FocusMusicPlayer';

export default function TimerPage() {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [isDeepFocus, setIsDeepFocus] = useState(false);
  const [timerSettings, setTimerSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  });

  const { sessions, streak, xp, level, xpProgress, addSession } = useStudyStats();
  const { setIsPlaying } = useFocusMusic();

  const currentInitialMinutes = useMemo(() => {
    return timerSettings[mode];
  }, [mode, timerSettings]);

  const { 
    timeLeft, 
    isActive, 
    isPaused, 
    start, 
    pause, 
    reset, 
    formatTime, 
    progress 
  } = useTimer({ 
    initialMinutes: currentInitialMinutes,
    onComplete: () => {
      setIsPlaying(false);
      
      if (mode === 'pomodoro') {
        addSession(timerSettings.pomodoro, 'pomodoro');
        setShowXpPopup(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b']
        });
        setTimeout(() => setShowXpPopup(false), 3000);
      }
    }
  });

  const handleStart = () => {
    start();
    if (mode === 'pomodoro') {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = (mins?: number) => {
    reset(mins);
    setIsPlaying(false);
  };

  useEffect(() => {
    handleReset(currentInitialMinutes);
  }, [mode, timerSettings, currentInitialMinutes]);

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => new Date(s.timestamp).toISOString().split('T')[0] === today);
  const totalFocusMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const sessionCount = todaySessions.length;

  const radius = 150;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col space-y-8 pb-20">
      <section className="flex items-center justify-between premium-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Focus Arena</h1>
          <p className="text-zinc-500 mt-1">Level {level} • {xp} XP Earned</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={() => setIsDeepFocus(true)}
            className="hidden sm:flex items-center gap-2 px-6 py-3 action-button shadow-lg shadow-brand-100"
          >
            <Maximize2 size={18} /> Deep Focus
          </button>
          <div className="hidden sm:flex flex-col items-end mr-4">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">XP Progress</div>
            <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-brand-600 rounded-full"
              />
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-400 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm"
          >
            <Settings size={20} />
          </button>
        </div>
      </section>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 py-8 premium-card relative overflow-hidden">
        <AnimatePresence>
          {showXpPopup && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute z-50 flex flex-col items-center gap-2 pointer-events-none"
            >
              <div className="bg-amber-500 text-white p-4 rounded-full shadow-2xl">
                <Sparkles size={32} />
              </div>
              <div className="text-2xl font-black text-amber-600 drop-shadow-sm">+{timerSettings.pomodoro * 2} XP!</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Selector */}
        <div className="flex p-1.5 bg-zinc-100 rounded-3xl gap-1 relative z-10">
          {[
            { id: 'pomodoro', label: 'Focus', icon: Brain },
            { id: 'shortBreak', label: 'Short Break', icon: Coffee },
            { id: 'longBreak', label: 'Long Break', icon: Coffee },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                mode === m.id 
                  ? "bg-white text-brand-600 shadow-md" 
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <m.icon size={18} />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 400 400">
            <circle
              cx="200"
              cy="200"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-zinc-100"
            />
            <motion.circle
              cx="200"
              cy="200"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              className={`transition-colors duration-500 ${
                mode === 'pomodoro' ? "text-brand-600" : "text-emerald-500"
              }`}
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>

          <div className="text-center space-y-2 relative z-10">
            <motion.div 
              key={formatTime}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl sm:text-8xl font-mono font-bold tracking-tighter text-zinc-900"
            >
              {formatTime}
            </motion.div>
            <div className="flex items-center justify-center gap-2">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border ${
                isActive ? (isPaused ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-brand-50 text-brand-600 border-brand-100') : 'bg-zinc-50 text-zinc-400 border-zinc-100'
              }`}>
                {isActive ? (isPaused ? 'Paused' : 'Focusing...') : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8 relative z-10">
          <button 
            onClick={() => handleReset()}
            className="p-4 bg-zinc-50 text-zinc-400 rounded-2xl hover:bg-zinc-100 hover:text-zinc-900 transition-all hover:scale-110 active:scale-95 border border-zinc-100"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={isActive && !isPaused ? handlePause : handleStart}
            className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl transition-all hover:scale-105 active:scale-95 ${
              isActive && !isPaused ? "bg-zinc-900" : "bg-brand-600 shadow-brand-200"
            }`}
          >
            {isActive && !isPaused ? <Pause size={40} /> : <Play size={40} className="fill-white ml-2" />}
          </button>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-4 bg-zinc-50 text-zinc-400 rounded-2xl hover:bg-zinc-100 hover:text-zinc-900 transition-all hover:scale-110 active:scale-95 border border-zinc-100"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>

      <FocusMusicPlayer />

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="premium-card p-6 flex flex-col items-center text-center group hover:border-brand-200 transition-all">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Trophy size={24} />
          </div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Current Streak</div>
          <div className="text-2xl font-bold text-zinc-900">{streak} Days</div>
        </div>
        <div className="premium-card p-6 flex flex-col items-center text-center group hover:border-emerald-200 transition-all">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Target size={24} />
          </div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Sessions Today</div>
          <div className="text-2xl font-bold text-zinc-900">{sessionCount}</div>
        </div>
        <div className="premium-card p-6 flex flex-col items-center text-center group hover:border-blue-200 transition-all">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <History size={24} />
          </div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Focus Time</div>
          <div className="text-2xl font-bold text-zinc-900">
            {totalFocusMinutes >= 60 ? `${Math.floor(totalFocusMinutes / 60)}h ${totalFocusMinutes % 60}m` : `${totalFocusMinutes}m`}
          </div>
        </div>
        <div className="premium-card p-6 flex flex-col items-center text-center group hover:border-orange-200 transition-all">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap size={24} />
          </div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Daily Goal</div>
          <div className="text-2xl font-bold text-zinc-900">{Math.min(100, Math.round((totalFocusMinutes / 120) * 100))}%</div>
        </div>
      </section>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <TimerSettings 
            settings={timerSettings}
            onSave={(newSettings) => {
              setTimerSettings(newSettings);
              setShowSettings(false);
            }}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Deep Focus Mode Overlay */}
      <AnimatePresence>
        {isDeepFocus && (
          <FocusMode 
            timeLeft={timeLeft}
            formatTime={formatTime}
            progress={progress}
            isActive={isActive}
            isPaused={isPaused}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onClose={() => setIsDeepFocus(false)}
            mode={mode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

