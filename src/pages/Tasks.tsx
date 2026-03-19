/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Filter,
  ListTodo
} from 'lucide-react';
import { useTasks } from '../hooks/useStudyData';
import { Task, Subject } from '../types';
import TaskItem from '../components/Tasks/TaskItem';
import TaskForm from '../components/Tasks/TaskForm';
import SubjectFilter from '../components/Notes/SubjectFilter';

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || (filter === 'active' ? !t.completed : t.completed);
      const matchesSubject = selectedSubject === 'All' || t.subject === selectedSubject;
      return matchesSearch && matchesFilter && matchesSubject;
    });
  }, [tasks, search, filter, selectedSubject]);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Task Manager</h1>
          <p className="text-zinc-500 mt-1">Stay on top of your study schedule.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-brand-700 transition-all font-bold shadow-lg shadow-brand-100"
        >
          <Plus size={20} /> Add New Task
        </button>
      </section>

      {/* Progress Section */}
      <section className="premium-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Overall Progress</div>
              <div className="text-2xl font-bold text-zinc-900">{progress}% Completed</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-zinc-900">{completedCount} of {totalCount} tasks</div>
            <div className="text-xs text-zinc-400">Keep up the great work!</div>
          </div>
        </div>
        <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none w-full shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-2xl">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
          <Filter size={14} /> Subject:
        </div>
        <SubjectFilter selected={selectedSubject} onSelect={setSelectedSubject} />
      </div>

      {/* Tasks List */}
      <section className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-4 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TaskItem 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask}
                onEdit={setEditingTask}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 premium-card border-2 border-dashed border-zinc-200 bg-transparent shadow-none">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
              <ListTodo size={40} className="text-zinc-200" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No tasks found</h3>
            <p className="text-zinc-500 max-w-xs text-center">
              {search || filter !== 'all' || selectedSubject !== 'All'
                ? "Try adjusting your filters to find what you're looking for." 
                : "Your task list is empty. Add a task to start organizing your studies!"}
            </p>
          </div>
        )}
      </section>

      {/* Task Form Modal */}
      <AnimatePresence>
        {(isAdding || editingTask) && (
          <TaskForm 
            task={editingTask}
            onSave={addTask}
            onUpdate={updateTask}
            onClose={() => {
              setIsAdding(false);
              setEditingTask(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

