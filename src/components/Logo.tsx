/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 16, text: 'text-lg' },
    md: { icon: 24, text: 'text-2xl' },
    lg: { icon: 32, text: 'text-4xl' },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`
        relative flex items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-200
        ${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-14 h-14'}
      `}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
        <span className={`font-black tracking-tighter ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl'}`}>
          S
        </span>
        <div className="absolute -top-1 -right-1">
          <Sparkles size={size === 'sm' ? 10 : size === 'md' ? 14 : 18} className="text-amber-300 fill-amber-300" />
        </div>
      </div>
      {showText && (
        <span className={`font-black tracking-tight text-zinc-900 ${sizes[size].text}`}>
          Study<span className="text-brand-600">X</span>
        </span>
      )}
    </div>
  );
}
