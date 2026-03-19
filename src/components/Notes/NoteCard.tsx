/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trash2, BookOpen, Clock } from 'lucide-react';
import { Note } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  return (
    <motion.div
      layoutId={note.id}
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="premium-card p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-brand-200 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-50 blur-2xl transition-opacity" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="px-2.5 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-brand-100">
          {note.subject}
        </div>
        <button 
          onClick={onDelete}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900 group-hover:text-brand-600 transition-colors relative z-10">
        {note.title || 'Untitled Note'}
      </h3>
      
      <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed relative z-10">
        {note.content || 'No content yet...'}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <Clock size={12} />
          {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
          <BookOpen size={14} />
        </div>
      </div>
    </motion.div>
  );
}
