/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Maximize2, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Music
} from 'lucide-react';
import { useFocusMusic } from '../../hooks/useFocusMusic';
import { MUSIC_MODES } from '../../constants/music';

interface FocusModeProps {
  timeLeft: number;
  formatTime: string;
  progress: number;
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onClose: () => void;
  mode: string;
}

export default function FocusMode({
  timeLeft,
  formatTime,
  progress,
  isActive,
  isPaused,
  onStart,
  onPause,
  onReset,
  onClose,
  mode
}: FocusModeProps) {
  const { activeMode, volume, isPlaying, setActiveMode, setVolume, togglePlay } = useFocusMusic();
  const [showMusicControls, setShowMusicControls] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-brand-900 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-900 rounded-full blur-[120px]"
        />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
            <Maximize2 size={20} />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight">Deep Focus Mode</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
              {mode === 'pomodoro' ? 'Focus Session' : 'Break Time'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10"
        >
          <X size={24} />
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        <div className="relative w-80 h-80 sm:w-[32rem] sm:h-[32rem] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 400 400">
            <circle
              cx="200"
              cy="200"
              r="180"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-white/5"
            />
            <motion.circle
              cx="200"
              cy="200"
              r="180"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-brand-500"
              initial={{ strokeDasharray: 1131, strokeDashoffset: 1131 }}
              animate={{ strokeDashoffset: 1131 - (progress / 100) * 1131 }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>

          <div className="text-center space-y-4">
            <motion.div
              key={timeLeft}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[8rem] sm:text-[12rem] font-mono font-bold tracking-tighter text-white leading-none"
            >
              {formatTime}
            </motion.div>
            <div className="flex items-center justify-center gap-4">
              <span className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border ${
                isActive ? (isPaused ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-brand-500/20 text-brand-400 border-brand-500/30') : 'bg-white/5 text-zinc-500 border-white/10'
              }`}>
                {isActive ? (isPaused ? 'Paused' : 'Focusing...') : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-12">
          <button
            onClick={onReset}
            className="p-6 bg-white/5 text-zinc-400 rounded-[2rem] hover:bg-white/10 hover:text-white transition-all border border-white/5"
          >
            <RotateCcw size={32} />
          </button>
          
          <button
            onClick={isActive && !isPaused ? onPause : onStart}
            className={`w-32 h-32 rounded-[3rem] flex items-center justify-center text-white shadow-2xl transition-all hover:scale-105 active:scale-95 ${
              isActive && !isPaused ? "bg-white text-zinc-950" : "bg-brand-600 shadow-brand-500/20"
            }`}
          >
            {isActive && !isPaused ? <Pause size={48} fill="currentColor" /> : <Play size={48} className="fill-white ml-2" />}
          </button>

          <button
            onClick={() => setShowMusicControls(!showMusicControls)}
            className={`p-6 rounded-[2rem] transition-all border ${
              isPlaying ? "bg-brand-500/20 text-brand-400 border-brand-500/30" : "bg-white/5 text-zinc-400 border-white/5"
            }`}
          >
            <Music size={32} />
          </button>
        </div>
      </div>

      {/* Music Controls Overlay */}
      <AnimatePresence>
        {showMusicControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] w-80 z-20"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-white font-bold text-sm">Focus Sounds</h4>
              <button 
                onClick={() => togglePlay()}
                className="w-10 h-10 bg-white text-zinc-950 rounded-full flex items-center justify-center"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {MUSIC_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all text-xl ${
                    activeMode === mode.id 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                  }`}
                  title={mode.name}
                >
                  {mode.icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <VolumeX size={16} className="text-zinc-500" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-brand-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
              <Volume2 size={16} className="text-zinc-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4 z-10">
        <p className="text-zinc-500 text-sm font-medium">Distractions are hidden. Stay focused.</p>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4
              }}
              className="w-1.5 h-1.5 bg-brand-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
