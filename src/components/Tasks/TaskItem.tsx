/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar,
  AlertCircle,
  Edit2,
  Check
} from 'lucide-react';
import { Task } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const priorityColors = {
    low: 'bg-blue-50 text-blue-600 border-blue-100',
    medium: 'bg-orange-50 text-orange-600 border-orange-100',
    high: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <motion.div
      layout
      whileHover={{ x: 4 }}
      className={cn(
        "group flex items-center gap-4 p-4 premium-card transition-all duration-300 hover:shadow-xl hover:border-brand-200 relative overflow-hidden",
        task.completed ? "opacity-60 grayscale-[0.5]" : "border-zinc-200"
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <button 
        onClick={() => onToggle(task.id)}
        className={cn(
          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0",
          task.completed 
            ? "bg-brand-500 border-brand-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]" 
            : "border-slate-200 hover:border-brand-400 bg-white"
        )}
      >
        {task.completed ? <Check size={14} strokeWidth={3} /> : null}
      </button>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "font-bold text-sm truncate transition-all duration-300",
            task.completed ? "text-slate-400 line-through" : "text-slate-900"
          )}>
            {task.title}
          </h3>
          <span className={cn(
            "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border shadow-sm",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            {task.subject}
          </span>
          {task.deadline && (
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
        <button 
          onClick={() => onEdit(task)}
          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-50 rounded-full opacity-0 group-hover:opacity-50 blur-2xl transition-opacity" />
    </motion.div>
  );
}
