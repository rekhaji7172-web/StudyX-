/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { History, Zap, Clock, Trophy } from 'lucide-react';
import { useStudyStats } from '../hooks/useStudyData';

export default function StudyTimeline() {
  const { sessions } = useStudyStats();
  
  // Get last 5 sessions
  const recentSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  return (
    <div className="premium-card p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <History size={22} className="text-brand-600" />
          Study Timeline
        </h3>
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Last 5 Sessions</div>
      </div>

      <div className="space-y-6">
        {recentSessions.map((session, idx) => (
          <div key={session.id} className="relative pl-8 pb-2 group">
            {/* Timeline Line */}
            {idx !== recentSessions.length - 1 && (
              <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-zinc-100 group-hover:bg-brand-100 transition-colors" />
            )}
            
            {/* Timeline Dot */}
            <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
              session.type === 'battle' ? 'bg-purple-500' : 
              session.type === 'pomodoro' ? 'bg-brand-600' : 'bg-emerald-500'
            }`}>
              {session.type === 'battle' ? <Zap size={10} className="text-white fill-white" /> : 
               session.type === 'pomodoro' ? <Clock size={10} className="text-white" /> : 
               <Trophy size={10} className="text-white" />}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-zinc-900">
                  {session.type === 'battle' ? 'Flashcard Battle' : 
                   session.type === 'pomodoro' ? 'Focus Session' : 'Custom Study'}
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                  {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration} mins
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-brand-600">+{session.xpEarned || 0} XP</div>
                <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Earned</div>
              </div>
            </div>
          </div>
        ))}

        {recentSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <History size={24} className="text-zinc-200" />
            </div>
            <p className="text-sm font-medium text-zinc-400">No study activity yet today.</p>
          </div>
        )}
      </div>
    </div>
  );
}
