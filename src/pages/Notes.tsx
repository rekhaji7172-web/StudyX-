/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Filter,
  AlertCircle,
  Share2
} from 'lucide-react';
import { useNotes, useFlashcards, useMindMaps } from '../hooks/useStudyData';
import { Note, Subject, MindMapNode, MindMapEdge } from '../types';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/Notes/NoteCard';
import NoteEditor from '../components/Notes/NoteEditor';
import SubjectFilter from '../components/Notes/SubjectFilter';

export default function NotesPage() {
  const navigate = useNavigate();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { addFlashcard } = useFlashcards();
  const { addMindMap } = useMindMaps();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                           n.content.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [notes, search, selectedSubject]);

  const handleCreate = () => {
    const newNote = addNote({ 
      title: '', 
      content: '', 
      subject: selectedSubject === 'All' ? 'General' : selectedSubject 
    });
    setSelectedNote(newNote);
  };

  const handleDeleteConfirm = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
      setNoteToDelete(null);
      if (selectedNote?.id === noteToDelete) {
        setSelectedNote(null);
      }
    }
  };

  const handleConvertToFlashcards = (note: Note) => {
    // Simple logic: split by lines or paragraphs
    const lines = note.content.split('\n').filter(l => l.includes(':') || l.includes('?'));
    let count = 0;
    lines.forEach(line => {
      const parts = line.split(/[:?]/);
      if (parts.length >= 2) {
        addFlashcard({
          question: parts[0].trim(),
          answer: parts[1].trim(),
          subject: note.subject,
          masteryLevel: 0
        });
        count++;
      }
    });
    alert(`Generated ${count} flashcards from this note!`);
  };

  const handleConvertToMindMap = (note: Note) => {
    // Basic logic: Central node is the title, lines starting with '-' or '*' are child nodes
    const nodes: MindMapNode[] = [
      { id: 'root', text: note.title || 'Untitled Note', x: 400, y: 300, color: '#4f46e5', icon: '🧠' }
    ];
    const edges: MindMapEdge[] = [];
    
    const lines = note.content.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'));
    
    lines.forEach((line, i) => {
      const text = line.replace(/^[-*]\s*/, '').trim();
      if (text) {
        const nodeId = `node-${i}`;
        nodes.push({
          id: nodeId,
          text,
          x: 400 + Math.cos(i) * 250,
          y: 300 + Math.sin(i) * 250,
          color: '#10b981',
          icon: '💡'
        });
        edges.push({
          id: `edge-${i}`,
          from: 'root',
          to: nodeId
        });
      }
    });

    const newMap = addMindMap(note.title || 'New Mind Map', nodes, edges);
    navigate(`/mindmap/${newMap.id}`);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <AnimatePresence mode="wait">
        {!selectedNote ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">My Notes</h1>
                <p className="text-zinc-500 mt-1">Organize your thoughts and study materials.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none w-full md:w-80 shadow-sm transition-all"
                  />
                </div>
                <button 
                  onClick={handleCreate}
                  className="bg-brand-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-brand-700 transition-all font-bold shadow-lg shadow-brand-100"
                >
                  <Plus size={20} /> New Note
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                <Filter size={14} /> Filter by:
              </div>
              <SubjectFilter selected={selectedSubject} onSelect={setSelectedSubject} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onClick={() => setSelectedNote(note)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setNoteToDelete(note.id);
                  }}
                />
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-zinc-200">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <BookOpen size={40} className="text-zinc-200" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No notes found</h3>
                <p className="text-zinc-500 max-w-xs text-center">
                  {search || selectedSubject !== 'All' 
                    ? "Try adjusting your search or filters to find what you're looking for." 
                    : "Start your study journey by creating your first note today!"}
                </p>
                {!search && selectedSubject === 'All' && (
                  <button 
                    onClick={handleCreate}
                    className="mt-8 bg-zinc-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg"
                  >
                    Create First Note
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <NoteEditor 
            note={selectedNote}
            onBack={() => setSelectedNote(null)}
            onUpdate={updateNote}
            onConvertToFlashcards={() => handleConvertToFlashcards(selectedNote)}
            onConvertToMindMap={() => handleConvertToMindMap(selectedNote)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {noteToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-100"
            >
              <div className="flex items-center gap-4 text-red-600 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-2xl font-bold">Delete Note?</h3>
              </div>
              <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
                Are you sure you want to delete this note? This action cannot be undone and all content will be lost.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 px-6 py-3.5 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-6 py-3.5 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

