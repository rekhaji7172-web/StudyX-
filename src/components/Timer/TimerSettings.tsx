/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, Save } from 'lucide-react';

interface TimerSettingsProps {
  settings: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  };
  onSave: (settings: { pomodoro: number; shortBreak: number; longBreak: number }) => void;
  onClose: () => void;
}

export default function TimerSettings({ settings, onSave, onClose }: TimerSettingsProps) {
  const [tempSettings, setTempSettings] = React.useState(settings);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-100"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-zinc-900">Timer Settings</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Focus Duration (min)</label>
            <input 
              type="number" 
              value={tempSettings.pomodoro}
              onChange={(e) => setTempSettings({ ...tempSettings, pomodoro: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-zinc-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Short Break</label>
              <input 
                type="number" 
                value={tempSettings.shortBreak}
                onChange={(e) => setTempSettings({ ...tempSettings, shortBreak: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-zinc-900 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Long Break</label>
              <input 
                type="number" 
                value={tempSettings.longBreak}
                onChange={(e) => setTempSettings({ ...tempSettings, longBreak: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-zinc-900 font-bold"
              />
            </div>
          </div>

          <button 
            onClick={() => onSave(tempSettings)}
            className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 flex items-center justify-center gap-2 mt-4"
          >
            <Save size={20} /> Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}
