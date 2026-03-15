/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play,
  Pause
} from 'lucide-react';
import { useFocusMusic } from '../hooks/useFocusMusic';
import { MUSIC_MODES } from '../constants/music';

export default function FocusMusicPlayer() {
  const { activeMode, volume, isPlaying, setActiveMode, setVolume, setIsPlaying, togglePlay } = useFocusMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle mode changes
  useEffect(() => {
    if (!audioRef.current) return;

    const mode = MUSIC_MODES.find(m => m.id === activeMode);
    if (mode && mode.url) {
      audioRef.current.src = mode.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [activeMode]);

  // Handle play/pause and volume
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
    
    if (isPlaying && activeMode !== 'silent') {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, volume, activeMode]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Music size={24} className="text-brand-600" />
            Focus Music
          </h3>
          <p className="text-zinc-500 text-sm mt-1">Enhance your concentration with offline sounds</p>
        </div>
        <button 
          onClick={() => togglePlay()}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-95 ${
            isPlaying ? 'bg-zinc-900 text-white' : 'bg-brand-600 text-white shadow-brand-100'
          }`}
        >
          {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {MUSIC_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setActiveMode(mode.id);
              if (mode.id === 'silent') {
                setIsPlaying(false);
              } else {
                setIsPlaying(true);
              }
            }}
            className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all border-2 ${
              activeMode === mode.id 
                ? 'bg-brand-50 border-brand-200 text-brand-700' 
                : 'bg-zinc-50 border-transparent text-zinc-500 hover:bg-zinc-100 hover:border-zinc-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
              activeMode === mode.id ? 'bg-white shadow-sm' : 'bg-zinc-200/50'
            }`}>
              {mode.icon}
            </div>
            <div className="text-center">
              <div className="text-sm font-bold">{mode.name}</div>
              <div className="text-[10px] opacity-60 font-medium uppercase tracking-wider mt-0.5">{mode.description}</div>
            </div>
            {activeMode === mode.id && isPlaying && mode.id !== 'silent' && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 16, 4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1 bg-brand-600 rounded-full"
                  />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-100 flex items-center gap-6">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => setVolume(0)}>
            {volume === 0 ? <VolumeX size={20} className="text-zinc-400" /> : <Volume2 size={20} className="text-zinc-400" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-brand-600 h-1.5 bg-zinc-100 rounded-full appearance-none cursor-pointer"
          />
          <div className="text-xs font-mono font-bold text-zinc-400 w-8">{Math.round(volume * 100)}%</div>
        </div>
      </div>
    </div>
  );
}
