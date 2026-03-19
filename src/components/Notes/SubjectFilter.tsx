/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Subject } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SUBJECTS: (Subject | 'All')[] = ['All', 'Math', 'Science', 'History', 'Languages', 'General'];

interface SubjectFilterProps {
  selected: Subject | 'All';
  onSelect: (subject: Subject | 'All') => void;
}

export default function SubjectFilter({ selected, onSelect }: SubjectFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {SUBJECTS.map((subject) => (
        <button
          key={subject}
          onClick={() => onSelect(subject)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
            selected === subject
              ? "bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-brand-500/30 hover:text-brand-400"
          )}
        >
          {subject}
        </button>
      ))}
    </div>
  );
}
