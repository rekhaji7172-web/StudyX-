/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar,
  AlertCircle,
  Edit2
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
    <div className={cn(
      "group flex items-center gap-4 p-4 bg-white rounded-2xl border transition-all hover:shadow-md",
      task.completed ? "border-zinc-100 opacity-60" : "border-zinc-200"
    )}>
      <button 
        onClick={() => onToggle(task.id)}
        className={cn(
          "shrink-0 transition-colors",
          task.completed ? "text-emerald-500" : "text-zinc-300 hover:text-brand-500"
        )}
      >
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "font-bold text-sm truncate",
            task.completed ? "text-zinc-400 line-through" : "text-zinc-900"
          )}>
            {task.title}
          </h3>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-400">
          <span className="flex items-center gap-1">
            <AlertCircle size={12} /> {task.subject}
          </span>
          {task.deadline && (
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(task)}
          className="p-2 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
