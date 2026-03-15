/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Timer,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardBattleProps {
  deck: Flashcard[];
  onFinish: (score: number, total: number) => void;
}

export default function FlashcardBattle({ deck, onFinish }: FlashcardBattleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);
  const [options, setOptions] = useState<string[]>([]);

  const currentCard = deck[currentIndex];

  useEffect(() => {
    if (currentCard) {
      // Generate options: correct answer + 3 random answers from other cards
      const otherAnswers = deck
        .filter(c => c.id !== currentCard.id)
        .map(c => c.answer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const allOptions = [currentCard.answer, ...otherAnswers]
        .sort(() => Math.random() - 0.5);
      
      setOptions(allOptions);
    }
  }, [currentIndex, deck]);

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer('');
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isFinished]);

  const handleAnswer = (selectedAnswer: string) => {
    const correct = selectedAnswer === currentCard.answer;
    setResults([...results, { id: currentCard.id, correct }]);
    if (correct) setScore(score + 1);

    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(10);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center text-center p-8"
      >
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-amber-100">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black text-zinc-900 mb-2">Battle Complete!</h2>
        <p className="text-zinc-500 mb-8 font-medium italic">"Victory belongs to the most persevering."</p>
        
        <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-12">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="text-3xl font-black text-brand-600">{score}</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Correct</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="text-3xl font-black text-zinc-900">{Math.round((score / deck.length) * 100)}%</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Accuracy</div>
          </div>
        </div>

        <button 
          onClick={() => onFinish(score, deck.length)}
          className="bg-brand-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-100 flex items-center gap-2"
        >
          Collect Rewards <ArrowRight size={20} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full py-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Zap size={24} className="fill-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Battle Mode</h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Card {currentIndex + 1} of {deck.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Score</div>
            <div className="text-xl font-black text-zinc-900">{score}</div>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 transition-colors ${
            timeLeft <= 3 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <Timer size={20} className={timeLeft <= 3 ? 'animate-pulse' : ''} />
            <span className="text-lg font-black">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full bg-white rounded-[3rem] border-2 border-zinc-100 shadow-xl p-12 text-center mb-12"
        >
          <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-8">Question</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">{currentCard.question}</h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {options.map((option, idx) => (
            <motion.button
              key={`${currentIndex}-${idx}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
              className="p-6 bg-white border-2 border-zinc-100 rounded-[2rem] text-zinc-900 font-bold hover:border-brand-600 hover:bg-brand-50 transition-all text-lg shadow-sm"
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 justify-center">
        {deck.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-8 bg-brand-600' : 
              i < currentIndex ? 'w-4 bg-emerald-500' : 'w-4 bg-zinc-200'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}
