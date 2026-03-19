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
import { GoogleGenAI, Type } from "@google/genai";

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
  const [error, setError] = useState<string | null>(null);

  const generateAIFlashcards = async (text: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a set of educational flashcards based on the following text or topic: "${text}". 
        The subject for these cards is "${subject}". 
        Provide clear questions and concise answers. 
        Return at least 5 flashcards.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "The question for the flashcard." },
                answer: { type: Type.STRING, description: "The answer for the flashcard." },
                subject: { type: Type.STRING, description: "The subject of the flashcard." }
              },
              required: ["question", "answer", "subject"]
            }
          }
        }
      });

      const jsonStr = response.text.trim();
      const cards = JSON.parse(jsonStr).map((c: any) => ({
        ...c,
        subject: (c.subject as Subject) || subject,
        masteryLevel: 0
      }));

      setGeneratedCards(cards);
      setStep('preview');
    } catch (err) {
      console.error("AI Generation failed:", err);
      setError("Failed to generate flashcards. Please try again with a different topic or more text.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (input.trim().length < 5) return;
    generateAIFlashcards(input);
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
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">AI Flashcard Generator</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Powered by Intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Paste your notes or topic</label>
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste a paragraph from your textbook, a lecture transcript, or just a topic like 'Photosynthesis'..."
                    className="w-full h-48 p-6 bg-white/5 border border-white/10 rounded-3xl focus:ring-2 focus:ring-brand-500 outline-none resize-none text-white font-medium placeholder:text-slate-600 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subject:</label>
                    <select 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as Subject)}
                      className="bg-white/5 border border-white/10 rounded-xl text-sm font-bold px-4 py-2 focus:ring-2 focus:ring-brand-500 text-white outline-none"
                    >
                      {SUBJECTS.filter(s => s !== 'All').map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || input.trim().length < 5}
                    className="flex items-center justify-center gap-2 bg-brand-500 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
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
                  <h3 className="text-sm font-bold text-white">Preview Generated Cards ({generatedCards.length})</h3>
                  <button 
                    onClick={() => setStep('input')}
                    className="text-xs font-bold text-brand-400 hover:text-brand-500 uppercase tracking-widest"
                  >
                    Edit Input
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {generatedCards.map((card, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                      <div className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Card {idx + 1}</div>
                      <div className="text-sm font-bold text-white">{card.question}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{card.answer}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => setStep('input')}
                    className="px-6 py-3 text-slate-400 hover:bg-white/5 rounded-2xl font-bold transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-brand-500 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20"
                  >
                    <CheckCircle2 size={18} />
                    Add to Deck
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex items-center gap-2">
          <AlertCircle size={14} className="text-slate-500" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            AI can make mistakes. Please review cards before saving.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

