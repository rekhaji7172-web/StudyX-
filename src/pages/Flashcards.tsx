/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  CreditCard, 
  Play,
  Shuffle,
  Filter,
  AlertCircle,
  Sparkles,
  Zap,
  X,
  Share2
} from 'lucide-react';
import { useFlashcards, useStudyStats, useRevisionRadar, useMindMaps } from '../hooks/useStudyData';
import { Flashcard, Subject, MindMapNode, MindMapEdge } from '../types';
import { useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import FlashcardItem from '../components/Flashcards/FlashcardItem';
import FlashcardQuiz from '../components/Flashcards/FlashcardQuiz';
import FlashcardBattle from '../components/Flashcards/FlashcardBattle';
import AIFlashcardGenerator from '../components/Flashcards/AIFlashcardGenerator';
import SubjectFilter from '../components/Notes/SubjectFilter';

export default function FlashcardsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get('filter');

  const { flashcards, addFlashcard, addFlashcards, updateFlashcard, deleteFlashcard } = useFlashcards();
  const { addMindMap } = useMindMaps();
  const { addSession } = useStudyStats();
  const { getFlashcardStatus } = useRevisionRadar();
  
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [newCard, setNewCard] = useState({ question: '', answer: '', subject: 'General' as Subject });
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [studyDeck, setStudyDeck] = useState<Flashcard[]>([]);
  const [showOnlyCritical, setShowOnlyCritical] = useState(initialFilter === 'critical');

  const filteredFlashcards = useMemo(() => {
    return flashcards.filter(c => {
      const matchesSearch = c.question.toLowerCase().includes(search.toLowerCase()) || 
                           c.answer.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || c.subject === selectedSubject;
      
      if (showOnlyCritical) {
        const status = getFlashcardStatus(c.lastReviewed);
        return matchesSearch && matchesSubject && (status === 'red' || status === 'yellow');
      }
      
      return matchesSearch && matchesSubject;
    });
  }, [flashcards, search, selectedSubject, showOnlyCritical]);

  const handleAdd = () => {
    if (newCard.question && newCard.answer) {
      addFlashcard({ ...newCard, masteryLevel: 0 });
      setNewCard({ question: '', answer: '', subject: 'General' });
      setIsAdding(false);
    }
  };

  const startStudy = (shuffle = false, battle = false) => {
    let deck = [...filteredFlashcards];
    if (shuffle || battle) {
      deck = deck.sort(() => Math.random() - 0.5);
    }
    setStudyDeck(deck);
    if (battle) {
      setIsBattleMode(true);
    } else {
      setIsStudyMode(true);
    }
  };

  const handleBattleFinish = (score: number, total: number) => {
    // Earn XP based on performance
    addSession(Math.ceil(total / 2), 'battle');
    setIsBattleMode(false);
  };

  const handleMasteryUpdate = (id: string, levelChange: number) => {
    const card = flashcards.find(c => c.id === id);
    if (card) {
      const newLevel = Math.min(5, Math.max(0, card.masteryLevel + levelChange));
      updateFlashcard(id, { masteryLevel: newLevel });
    }
  };

  const handleGenerateMindMap = () => {
    if (filteredFlashcards.length === 0) return;
    
    const subject = selectedSubject === 'All' ? 'General' : selectedSubject;
    const nodes: MindMapNode[] = [
      { id: 'root', text: `${subject} Overview`, x: 400, y: 300, color: '#4f46e5', icon: '🧠' }
    ];
    const edges: MindMapEdge[] = [];
    
    filteredFlashcards.slice(0, 10).forEach((card, i) => {
      const nodeId = `card-${i}`;
      nodes.push({
        id: nodeId,
        text: card.question.slice(0, 30) + (card.question.length > 30 ? '...' : ''),
        x: 400 + Math.cos(i) * 250,
        y: 300 + Math.sin(i) * 250,
        color: '#8b5cf6',
        icon: '💡'
      });
      edges.push({
        id: `edge-${i}`,
        from: 'root',
        to: nodeId
      });
    });

    const newMap = addMindMap(`${subject} Mind Map`, nodes, edges);
    navigate(`/mindmap/${newMap.id}`);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <AnimatePresence mode="wait">
        {!isStudyMode ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Flashcards</h1>
                <p className="text-slate-400 mt-1">Master your subjects with active recall.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setIsAIGenerating(true)}
                  className="bg-brand-500/10 text-brand-400 px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-brand-500/20 transition-all font-bold shadow-lg shadow-brand-500/5 border border-brand-500/20"
                >
                  <Sparkles size={18} /> AI Generate
                </button>
                <button 
                  onClick={handleGenerateMindMap}
                  disabled={filteredFlashcards.length === 0}
                  className="bg-indigo-500/10 text-indigo-400 px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-indigo-500/20 transition-all font-bold shadow-lg shadow-indigo-500/5 border border-indigo-500/20 disabled:opacity-50"
                >
                  <Share2 size={18} /> Mind Map
                </button>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-bold shadow-sm"
                >
                  <Plus size={20} /> Add Card
                </button>
                <button 
                  disabled={filteredFlashcards.length < 4}
                  onClick={() => startStudy(true, true)}
                  className="bg-purple-500/10 text-purple-400 px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-purple-500/20 transition-all font-bold shadow-lg shadow-purple-500/5 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} className="fill-purple-400" /> Battle Mode
                </button>
                <div className="flex items-center p-1 bg-brand-500 rounded-2xl shadow-lg shadow-brand-500/20">
                  <button 
                    disabled={filteredFlashcards.length === 0}
                    onClick={() => startStudy(false)}
                    className="bg-brand-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-600 transition-all font-bold disabled:opacity-50"
                  >
                    <Play size={18} className="fill-white" /> Start
                  </button>
                  <div className="w-[1px] h-6 bg-white/20 mx-1" />
                  <button 
                    disabled={filteredFlashcards.length === 0}
                    onClick={() => startStudy(true)}
                    className="bg-brand-500 text-white p-2 rounded-xl hover:bg-brand-600 transition-all disabled:opacity-50"
                    title="Shuffle and Start"
                  >
                    <Shuffle size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search cards..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none w-full shadow-sm transition-all text-white placeholder:text-slate-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <Filter size={14} /> Filter:
                </div>
                <SubjectFilter selected={selectedSubject} onSelect={setSelectedSubject} />
                <button 
                  onClick={() => setShowOnlyCritical(!showOnlyCritical)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    showOnlyCritical 
                      ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-lg shadow-red-500/5" 
                      : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  Critical Only
                </button>
              </div>
            </div>

            {/* Add Card Form */}
            <AnimatePresence>
              {isAdding && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="premium-card p-8 border border-white/10 shadow-xl space-y-6 bg-slate-900/60 backdrop-blur-xl"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Question</label>
                      <textarea 
                        autoFocus
                        value={newCard.question}
                        onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none resize-none h-32 text-white font-medium transition-all placeholder:text-slate-600"
                        placeholder="What is the concept you want to learn?"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Answer</label>
                      <textarea 
                        value={newCard.answer}
                        onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none resize-none h-32 text-white font-medium transition-all placeholder:text-slate-600"
                        placeholder="The explanation or answer..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subject:</label>
                      <select 
                        value={newCard.subject}
                        onChange={(e) => setNewCard({ ...newCard, subject: e.target.value as Subject })}
                        className="bg-white/5 border border-white/10 rounded-xl text-sm font-bold px-4 py-2 focus:ring-2 focus:ring-brand-500 text-white outline-none"
                      >
                        {SUBJECTS.filter(s => s !== 'All').map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setIsAdding(false)} className="px-6 py-2.5 rounded-xl text-slate-400 font-bold hover:bg-white/5 transition-all">Cancel</button>
                      <button onClick={handleAdd} className="bg-brand-500 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20">Save Card</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlashcards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FlashcardItem 
                    card={card} 
                    onDelete={deleteFlashcard} 
                  />
                </motion.div>
              ))}
            </div>

            {filteredFlashcards.length === 0 && !isAdding && (
              <div className="flex flex-col items-center justify-center py-32 premium-card border-2 border-dashed border-white/5 bg-transparent shadow-none">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <CreditCard size={40} className="text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No flashcards found</h3>
                <p className="text-slate-400 max-w-xs text-center">
                  {search || selectedSubject !== 'All' 
                    ? "Try adjusting your search or filters to find your cards." 
                    : "Active recall is the best way to learn. Start by creating your first card!"}
                </p>
                {!search && selectedSubject === 'All' && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="mt-8 bg-brand-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20"
                  >
                    Create First Card
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ) : isBattleMode ? (
          <motion.div 
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-8">
              <button 
                onClick={() => setIsBattleMode(false)}
                className="flex items-center gap-2 text-slate-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
              >
                <X size={16} /> Quit Battle Mode
              </button>
            </div>
            <FlashcardBattle 
              deck={studyDeck} 
              onFinish={handleBattleFinish}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-8">
              <button 
                onClick={() => setIsStudyMode(false)}
                className="flex items-center gap-2 text-slate-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
              >
                <AlertCircle size={16} /> Quit Study Session
              </button>
            </div>
            <FlashcardQuiz 
              deck={studyDeck} 
              onFinish={() => setIsStudyMode(false)}
              onMastery={handleMasteryUpdate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAIGenerating && (
          <AIFlashcardGenerator 
            onClose={() => setIsAIGenerating(false)}
            onGenerate={(cards) => addFlashcards(cards)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
