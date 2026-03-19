/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  RotateCcw,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardQuizProps {
  deck: Flashcard[];
  onFinish: (results: { mastered: number; learning: number }) => void;
  onMastery: (id: string, levelChange: number) => void;
}

export default function FlashcardQuiz({ deck, onFinish, onMastery }: FlashcardQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState({ mastered: 0, learning: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = deck[currentIndex];

  const handleMastery = (difficulty: 'hard' | 'medium' | 'easy') => {
    let levelChange = 0;
    let isMastered = false;

    if (difficulty === 'easy') {
      levelChange = 2;
      isMastered = true;
    } else if (difficulty === 'medium') {
      levelChange = 1;
      isMastered = true;
    } else {
      levelChange = -1;
      isMastered = false;
    }

    onMastery(currentCard.id, levelChange);
    
    setResults(prev => ({
      ...prev,
      mastered: isMastered ? prev.mastered + 1 : prev.mastered,
      learning: !isMastered ? prev.learning + 1 : prev.learning,
    }));

    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 text-center shadow-2xl border border-white/10 max-w-lg mx-auto"
      >
        <div className="w-24 h-24 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-500/10">
          <Trophy size={48} className="text-brand-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Study Session Complete!</h2>
        <p className="text-slate-400 mb-10 text-lg">You've reviewed {deck.length} cards. Here's how you did:</p>
        
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <div className="text-emerald-400 font-bold text-3xl mb-1">{results.mastered}</div>
            <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Mastered</div>
          </div>
          <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20">
            <div className="text-red-400 font-bold text-3xl mb-1">{results.learning}</div>
            <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Still Learning</div>
          </div>
        </div>

        <button 
          onClick={() => onFinish(results)}
          className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-500/20"
        >
          Back to Deck <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Card {currentIndex + 1} of {deck.length}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
              className="h-full bg-brand-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Flashcard Flip Container */}
      <div 
        className="relative h-96 w-full perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-full h-full relative preserve-3d"
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-12 text-center">
            <div className="absolute top-6 left-6 text-[10px] font-bold text-brand-400 uppercase tracking-widest">Question</div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              {currentCard.question}
            </h2>
            <div className="mt-8 text-slate-500 text-sm animate-pulse">Click to reveal answer</div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-brand-500 text-white border border-brand-400 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-12 text-center"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute top-6 left-6 text-[10px] font-bold text-brand-200 uppercase tracking-widest">Answer</div>
            <h2 className="text-3xl font-bold leading-tight">
              {currentCard.answer}
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Study Controls */}
      <div className="flex flex-col items-center gap-6 min-h-[120px]">
        <div className="flex items-center gap-4 mb-4">
          <button 
            disabled={currentIndex === 0}
            onClick={() => { setCurrentIndex(currentIndex - 1); setIsFlipped(false); }}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            disabled={currentIndex === deck.length - 1}
            onClick={() => { setCurrentIndex(currentIndex + 1); setIsFlipped(false); }}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isFlipped ? (
            <motion.div 
              key="controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex items-center gap-4"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); handleMastery('hard'); }}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 transition-colors group shadow-sm"
              >
                <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <X size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Hard</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleMastery('medium'); }}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-amber-500/10 hover:border-amber-500/20 transition-colors group shadow-sm"
              >
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <RotateCcw size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Medium</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleMastery('easy'); }}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-colors group shadow-sm"
              >
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Check size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Easy</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 text-sm italic"
            >
              Think about the answer before flipping...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
