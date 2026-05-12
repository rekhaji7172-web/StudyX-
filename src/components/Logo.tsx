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
    sm: { icon: 16, text: 'text-xl' },
    md: { icon: 24, text: 'text-2xl' },
    lg: { icon: 32, text: 'text-4xl' },
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`
        relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-xl shadow-brand-900/40
        ${size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'}
      `}>
        <div className="absolute inset-0 bg-white/10 rounded-2xl blur-[1px]" />
        <span className={`font-black tracking-tighter relative z-10 ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-3xl'}`}>
          V
        </span>
        <div className="absolute -top-1 -right-1 z-20">
          <Sparkles size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} className="text-amber-300 fill-amber-300 animate-pulse" />
        </div>
      </div>
      {showText && (
        <span className={`font-black tracking-tight text-white ${sizes[size].text}`}>
          VIBE<span className="text-brand-500">STUDY</span>
        </span>
      )}
    </div>
  );
}
