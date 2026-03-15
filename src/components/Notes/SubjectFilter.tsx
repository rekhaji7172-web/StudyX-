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
            "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
            selected === subject
              ? "bg-brand-600 text-white shadow-md shadow-brand-100"
              : "bg-white border border-zinc-200 text-zinc-500 hover:border-brand-200 hover:text-brand-600"
          )}
        >
          {subject}
        </button>
      ))}
    </div>
  );
}
