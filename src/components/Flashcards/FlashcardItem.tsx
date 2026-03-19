/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Flashcard } from '../../types';
import { useRevisionRadar } from '../../hooks/useStudyData';

interface FlashcardItemProps {
  card: Flashcard;
  onDelete: (id: string) => void;
}

export default function FlashcardItem({ card, onDelete }: FlashcardItemProps) {
  const { getFlashcardStatus } = useRevisionRadar();
  const status = getFlashcardStatus(card.lastReviewed);

  const statusConfig = {
    green: { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2, label: 'Fresh' },
    yellow: { color: 'text-amber-500', bg: 'bg-amber-50', icon: Clock, label: 'Fading' },
    red: { color: 'text-red-500', bg: 'bg-red-50', icon: AlertCircle, label: 'Critical' },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className="premium-card p-6 group relative transition-all hover:shadow-xl hover:border-brand-200 overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-lg">
            {card.subject}
          </span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight shadow-sm border ${config.bg} ${config.color} ${status === 'red' ? 'animate-pulse border-red-100' : 'border-transparent'}`}>
            <config.icon size={12} />
            {config.label}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-100">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i < card.masteryLevel 
                  ? 'bg-brand-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]' 
                  : 'bg-slate-200'
              }`} 
            />
          ))}
        </div>
      </div>
      
      <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors relative z-10 leading-tight">
        {card.question}
      </h3>
      <p className="text-slate-500 text-sm italic line-clamp-2 relative z-10 leading-relaxed">
        {card.answer}
      </p>
      
      <button 
        onClick={() => onDelete(card.id)}
        className="absolute top-4 right-4 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20"
      >
        <Trash2 size={18} />
      </button>
      
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-50 rounded-full opacity-0 group-hover:opacity-50 blur-2xl transition-opacity" />
    </motion.div>
  );
}
