/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trash2, BookOpen } from 'lucide-react';
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
      className="premium-card p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded">
          {note.subject}
        </div>
        <button 
          onClick={onDelete}
          className="p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <h3 className="font-bold text-lg mb-2 line-clamp-1 text-zinc-900">{note.title || 'Untitled Note'}</h3>
      <p className="text-zinc-500 text-sm line-clamp-3 mb-4">
        {note.content || 'No content yet...'}
      </p>
      <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
        <BookOpen size={12} />
        Last updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
      </div>
    </motion.div>
  );
}
