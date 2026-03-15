/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Edit3, 
  Save, 
  CreditCard,
  Eye,
  Type,
  Share2
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Note, Subject } from '../../types';
import { SUBJECTS } from '../../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NoteEditorProps {
  note: Note;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onConvertToFlashcards: () => void;
  onConvertToMindMap: () => void;
}

export default function NoteEditor({ note, onBack, onUpdate, onConvertToFlashcards, onConvertToMindMap }: NoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Note>(note);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditData(note);
    setHasChanges(false);
  }, [note]);

  const handleSave = useCallback(() => {
    if (hasChanges) {
      onUpdate(note.id, {
        title: editData.title,
        content: editData.content,
        subject: editData.subject,
        updatedAt: Date.now()
      });
      setHasChanges(false);
    }
  }, [editData, note.id, onUpdate, hasChanges]);

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasChanges) handleSave();
    }, 2000);
    return () => clearTimeout(timer);
  }, [hasChanges, handleSave]);

  const handleChange = (updates: Partial<Note>) => {
    setEditData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-3xl border border-zinc-200 flex flex-col h-full overflow-hidden shadow-sm"
    >
      {/* Editor Header */}
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { handleSave(); onBack(); }}
            className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-4 w-[1px] bg-zinc-200" />
          <div className="flex items-center gap-2">
            <select 
              value={editData.subject}
              onChange={(e) => handleChange({ subject: e.target.value })}
              className="text-xs font-bold uppercase tracking-wider bg-zinc-100 px-2 py-1 rounded border-none focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {hasChanges && (
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest animate-pulse">
                Saving...
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onConvertToMindMap}
            className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors"
          >
            <Share2 size={16} /> Convert to Mind Map
          </button>
          <button 
            onClick={onConvertToFlashcards}
            className="flex items-center gap-2 px-3 py-1.5 text-brand-600 hover:bg-brand-50 rounded-lg text-sm font-medium transition-colors"
          >
            <CreditCard size={16} /> Convert to Flashcards
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              isEditing 
                ? "bg-zinc-900 text-white hover:bg-zinc-800" 
                : "bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50"
            )}
          >
            {isEditing ? <><Eye size={16} /> Preview</> : <><Edit3 size={16} /> Edit</>}
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          {isEditing ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 text-zinc-400">
                <Type size={24} />
                <input 
                  type="text" 
                  value={editData.title}
                  onChange={(e) => handleChange({ title: e.target.value })}
                  className="text-4xl font-bold w-full border-none focus:ring-0 p-0 placeholder:text-zinc-200 text-zinc-900"
                  placeholder="Note Title"
                />
              </div>
              <textarea 
                value={editData.content}
                onChange={(e) => handleChange({ content: e.target.value })}
                className="w-full h-[calc(100vh-25rem)] border-none focus:ring-0 p-0 text-lg text-zinc-700 resize-none font-mono placeholder:text-zinc-200"
                placeholder="Start typing your notes here (Markdown supported)..."
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-zinc-900">{editData.title || 'Untitled Note'}</h1>
              <div className="markdown-body prose prose-zinc prose-lg max-w-none">
                <Markdown>{editData.content || '*No content yet. Click Edit to start writing.*'}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
