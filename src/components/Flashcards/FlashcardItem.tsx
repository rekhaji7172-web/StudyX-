/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
    <div className="premium-card p-6 group relative transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
            {card.subject}
          </span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter ${config.bg} ${config.color}`}>
            <config.icon size={10} />
            {config.label}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i < card.masteryLevel ? 'bg-brand-500' : 'bg-zinc-200'}`} 
            />
          ))}
        </div>
      </div>
      <h3 className="font-medium text-zinc-900 mb-2 line-clamp-2">{card.question}</h3>
      <p className="text-zinc-400 text-sm italic line-clamp-2">{card.answer}</p>
      
      <button 
        onClick={() => onDelete(card.id)}
        className="absolute top-4 right-4 p-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
