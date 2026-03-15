/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Radar, AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRevisionRadar } from '../hooks/useStudyData';

export default function RevisionRadar() {
  const navigate = useNavigate();
  const { getRadarData } = useRevisionRadar();
  const data = getRadarData();

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden relative flex flex-col">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-50 rounded-full opacity-50 blur-3xl" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Radar size={22} className="text-brand-600" />
          Revision Radar
        </h3>
        {data.needsReview && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-100">
            <AlertCircle size={12} />
            Review Needed
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Fresh</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{data.total - data.redCount - data.yellowCount}</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Fading</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{data.yellowCount}</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Critical</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{data.redCount}</div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-100 relative z-10 flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-zinc-900">Overall Mastery</span>
          <span className="text-sm font-bold text-brand-600">
            {Math.round(((data.total - data.redCount) / (data.total || 1)) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((data.total - data.redCount) / (data.total || 1)) * 100}%` }}
            className="h-full bg-brand-600 rounded-full"
          />
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <button 
          onClick={() => navigate('/flashcards?filter=critical')}
          className="w-full bg-brand-600 text-white py-3 rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-100"
        >
          Revise Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-1">
          <CheckCircle2 size={12} className="text-emerald-500" />
          {data.total} Items Tracked
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-brand-500" />
          Updated Just Now
        </div>
      </div>
    </div>
  );
}
