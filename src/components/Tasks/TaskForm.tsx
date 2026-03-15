/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Plus, 
  Save, 
  Calendar, 
  Tag, 
  Flag 
} from 'lucide-react';
import { Task, Subject } from '../../types';
import { SUBJECTS, PRIORITIES } from '../../constants';

interface TaskFormProps {
  task?: Task | null;
  onSave: (task: Omit<Task, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onClose: () => void;
}

export default function TaskForm({ task, onSave, onUpdate, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    deadline: '',
    completed: false,
    subject: 'General',
    priority: 'medium'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        deadline: task.deadline || '',
        completed: task.completed,
        subject: task.subject,
        priority: task.priority
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (task) {
      onUpdate(task.id, formData);
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-100"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-zinc-900">
            {task ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Task Title</label>
            <input 
              autoFocus
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-zinc-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Tag size={12} /> Subject
              </label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value as Subject })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Flag size={12} /> Priority
              </label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof PRIORITIES[number] })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={12} /> Deadline
            </label>
            <input 
              type="date" 
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3.5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 flex items-center justify-center gap-2"
            >
              {task ? <><Save size={18} /> Update</> : <><Plus size={18} /> Create</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
