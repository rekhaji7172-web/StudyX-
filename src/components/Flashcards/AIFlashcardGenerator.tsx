/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Subject, Flashcard } from '../../types';
import { SUBJECTS } from '../../constants';

interface AIFlashcardGeneratorProps {
  onClose: () => void;
  onGenerate: (cards: Omit<Flashcard, 'id' | 'lastReviewed'>[]) => void;
}

export default function AIFlashcardGenerator({ onClose, onGenerate }: AIFlashcardGeneratorProps) {
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState<Subject>('General');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Omit<Flashcard, 'id' | 'lastReviewed'>[]>([]);
  const [step, setStep] = useState<'input' | 'preview'>('input');

  const simulateAIGeneration = async (text: string) => {
    setIsGenerating(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock logic to extract "concepts" from text
    // In a real app, this would call Gemini API
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const mockCards = sentences.slice(0, 5).map(s => ({
      question: `What is the key concept in: "${s.trim().substring(0, 30)}..."?`,
      answer: s.trim(),
      subject,
      masteryLevel: 0
    }));

    setGeneratedCards(mockCards);
    setIsGenerating(false);
    setStep('preview');
  };

  const handleGenerate = () => {
    if (input.trim().length < 10) return;
    simulateAIGeneration(input);
  };

  const handleSave = () => {
    onGenerate(generatedCards);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-100">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">AI Flashcard Generator</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Powered by Intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'input' ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Paste your notes or topic</label>
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste a paragraph from your textbook, a lecture transcript, or just a topic like 'Photosynthesis'..."
                    className="w-full h-48 p-6 bg-zinc-50 border border-zinc-200 rounded-3xl focus:ring-2 focus:ring-brand-500 outline-none resize-none text-zinc-900 font-medium placeholder:text-zinc-300 transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Subject:</label>
                    <select 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as Subject)}
                      className="bg-zinc-100 border-none rounded-xl text-sm font-bold px-4 py-2 focus:ring-2 focus:ring-brand-500"
                    >
                      {SUBJECTS.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || input.trim().length < 10}
                    className="flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Cards
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900">Preview Generated Cards ({generatedCards.length})</h3>
                  <button 
                    onClick={() => setStep('input')}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                  >
                    Edit Input
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {generatedCards.map((card, idx) => (
                    <div key={idx} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                      <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Card {idx + 1}</div>
                      <div className="text-sm font-bold text-zinc-900">{card.question}</div>
                      <div className="text-xs text-zinc-500 leading-relaxed">{card.answer}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button 
                    onClick={() => setStep('input')}
                    className="px-6 py-3 text-zinc-500 hover:bg-zinc-100 rounded-2xl font-bold transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-brand-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
                  >
                    <CheckCircle2 size={18} />
                    Add to Deck
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2">
          <AlertCircle size={14} className="text-zinc-400" />
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            AI can make mistakes. Please review cards before saving.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
