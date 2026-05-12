import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export default function PWAInstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-32 left-6 right-6 z-[60] glass p-6 rounded-3xl flex items-center justify-between gap-4 md:left-auto md:w-96 md:bottom-12 md:right-12"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-900/40">
            <Download size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Install VIBESTUDY</h4>
            <p className="text-xs text-slate-400">Add to your home screen for the best experience.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={installApp}
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg"
          >
            Install
          </button>
          <button 
            onClick={() => setDismissed(true)}
            className="p-2 text-slate-500 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
