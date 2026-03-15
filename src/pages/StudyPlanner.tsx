/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Clock,
  Target,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useStudyPlanner } from '../hooks/useStudyData';
import { StudyPlan, PlannerSession } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function StudyPlanner() {
  const { plans, addPlan, updatePlan, deletePlan, toggleSession } = useStudyPlanner();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    examDate: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    dailyHours: 2
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const selectedPlan = useMemo(() => plans.find(p => p.id === selectedPlanId) || plans[0], [plans, selectedPlanId]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.examDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(formData.examDate);
    examDate.setHours(0, 0, 0, 0);

    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      alert("Exam date must be in the future!");
      return;
    }

    const sessions: PlannerSession[] = [];
    for (let i = 0; i <= diffDays; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Basic topic generation logic
      let topic = '';
      if (i === diffDays) {
        topic = 'Final Review & Exam Day';
      } else if (i === diffDays - 1) {
        topic = 'Mock Exam & Weak Areas';
      } else if (i === 0) {
        topic = 'Introduction & Planning';
      } else {
        const progress = i / diffDays;
        if (progress < 0.3) topic = `Fundamentals & Core Concepts (Part ${i})`;
        else if (progress < 0.7) topic = `Advanced Topics & Applications (Part ${i - Math.floor(0.3 * diffDays)})`;
        else topic = `Intensive Practice & Revision (Part ${i - Math.floor(0.7 * diffDays)})`;
      }

      sessions.push({
        id: crypto.randomUUID(),
        date: dateStr,
        topic,
        duration: formData.dailyHours,
        completed: false
      });
    }

    const newPlan = addPlan({
      ...formData,
      sessions
    });

    setSelectedPlanId(newPlan.id);
    setIsAdding(false);
    setFormData({ subject: '', examDate: '', difficulty: 'Medium', dailyHours: 2 });
  };

  const calculateProgress = (plan: StudyPlan) => {
    const completed = plan.sessions.filter(s => s.completed).length;
    return Math.round((completed / plan.sessions.length) * 100);
  };

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTopicValue, setEditTopicValue] = useState('');

  const handleEditTopic = (sessionId: string, currentTopic: string) => {
    setEditingSessionId(sessionId);
    setEditTopicValue(currentTopic);
  };

  const saveTopicEdit = (planId: string, sessionId: string) => {
    if (!editTopicValue.trim()) return;
    updatePlan(planId, {
      sessions: selectedPlan.sessions.map(s => 
        s.id === sessionId ? { ...s, topic: editTopicValue } : s
      )
    });
    setEditingSessionId(null);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Smart Study Planner</h1>
          <p className="text-zinc-500 mt-1">Automatically generated study schedules for your exams.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-brand-700 transition-all font-bold shadow-lg shadow-brand-100"
        >
          <Plus size={20} /> Create New Plan
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-xl"
          >
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Subject Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="e.g. Advanced Mathematics"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Exam Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.examDate}
                      onChange={e => setFormData({ ...formData, examDate: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Difficulty Level</label>
                    <div className="flex gap-2">
                      {['Easy', 'Medium', 'Hard'].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, difficulty: level as any })}
                          className={cn(
                            "flex-1 py-3 rounded-2xl text-sm font-bold border transition-all",
                            formData.difficulty === level 
                              ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-100" 
                              : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Daily Study Hours</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="12"
                      value={formData.dailyHours}
                      onChange={e => setFormData({ ...formData, dailyHours: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 text-zinc-500 hover:bg-zinc-100 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-zinc-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2"
                >
                  <Sparkles size={18} /> Generate Plan
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {plans.length > 0 ? (
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar: Plan List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2">Your Plans</h3>
            <div className="space-y-2">
              {plans.map(plan => (
                <motion.div
                  key={plan.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "p-4 rounded-2xl border cursor-pointer transition-all group",
                    selectedPlan?.id === plan.id 
                      ? "bg-white border-brand-200 shadow-md ring-1 ring-brand-100" 
                      : "bg-white/50 border-zinc-200 hover:border-zinc-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                      plan.difficulty === 'Hard' ? "bg-red-50 text-red-600" :
                      plan.difficulty === 'Medium' ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    )}>
                      {plan.difficulty}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="font-bold text-zinc-900 truncate">{plan.subject}</h4>
                  <div className="mt-3 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-500 transition-all duration-1000" 
                      style={{ width: `${calculateProgress(plan)}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main: Plan Details */}
          <div className="lg:col-span-3 space-y-6">
            {selectedPlan && (
              <motion.div
                key={selectedPlan.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-zinc-900">{selectedPlan.subject}</h2>
                      <span className="bg-brand-50 text-brand-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        {selectedPlan.sessions.length} Days Plan
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-500 text-sm">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={16} />
                        Exam: {new Date(selectedPlan.examDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        {selectedPlan.dailyHours}h / day
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-3xl font-bold text-brand-600">{calculateProgress(selectedPlan)}%</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Completion</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Target size={14} /> Study Schedule
                    </h3>
                    <div className="flex bg-zinc-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setViewMode('list')}
                        className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all", viewMode === 'list' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400")}
                      >
                        List
                      </button>
                      <button 
                        onClick={() => setViewMode('calendar')}
                        className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all", viewMode === 'calendar' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400")}
                      >
                        Calendar
                      </button>
                    </div>
                  </div>

                  {viewMode === 'list' ? (
                    <div className="grid gap-3">
                      {selectedPlan.sessions.map((session, idx) => {
                        const isToday = session.date === new Date().toISOString().split('T')[0];
                        return (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                              session.completed ? "bg-zinc-50 border-zinc-100 opacity-60" : 
                              isToday ? "bg-brand-50/30 border-brand-100 ring-1 ring-brand-50" : "bg-white border-zinc-100"
                            )}
                          >
                            <button 
                              onClick={() => toggleSession(selectedPlan.id, session.id)}
                              className={cn(
                                "shrink-0 transition-all",
                                session.completed ? "text-emerald-500" : "text-zinc-300 hover:text-brand-500"
                              )}
                            >
                              {session.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                  {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                {isToday && (
                                  <span className="bg-brand-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                                    Today
                                  </span>
                                )}
                              </div>
                              {editingSessionId === session.id ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <input 
                                    autoFocus
                                    value={editTopicValue}
                                    onChange={e => setEditTopicValue(e.target.value)}
                                    onBlur={() => saveTopicEdit(selectedPlan.id, session.id)}
                                    onKeyDown={e => e.key === 'Enter' && saveTopicEdit(selectedPlan.id, session.id)}
                                    className="flex-1 bg-white border border-brand-200 rounded-lg px-2 py-1 text-sm font-bold outline-none"
                                  />
                                </div>
                              ) : (
                                <div 
                                  onClick={() => handleEditTopic(session.id, session.topic)}
                                  className={cn("font-bold text-zinc-900 cursor-text hover:text-brand-600 transition-colors", session.completed && "line-through")}
                                >
                                  {session.topic}
                                </div>
                              )}
                            </div>
                            <div className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-lg">
                              {session.duration}h
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest py-2">
                          {d}
                        </div>
                      ))}
                      {selectedPlan.sessions.map((session, idx) => {
                        const isToday = session.date === new Date().toISOString().split('T')[0];
                        return (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            onClick={() => toggleSession(selectedPlan.id, session.id)}
                            className={cn(
                              "aspect-square p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all",
                              session.completed ? "bg-emerald-50 border-emerald-100" : 
                              isToday ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-100" : "bg-white border-zinc-100 hover:border-brand-200"
                            )}
                          >
                            <div className="text-[10px] font-bold opacity-60">
                              {new Date(session.date).getDate()}
                            </div>
                            {session.completed && <CheckCircle2 size={12} className="self-end" />}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-zinc-200">
          <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon size={48} className="text-zinc-200" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">No study plans yet</h3>
          <p className="text-zinc-500 max-w-sm text-center">
            Enter your exam details and let our AI-powered planner create a custom study schedule for you.
          </p>
          <button 
            onClick={() => setIsAdding(true)}
            className="mt-8 bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl flex items-center gap-3"
          >
            <Plus size={24} /> Create Your First Plan
          </button>
        </div>
      )}
    </div>
  );
}
