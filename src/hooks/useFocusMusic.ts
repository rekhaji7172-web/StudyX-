/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FocusMusicState {
  activeMode: string | null;
  volume: number;
  isPlaying: boolean;
  setActiveMode: (mode: string | null) => void;
  setVolume: (volume: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
}

export const useFocusMusic = create<FocusMusicState>()(
  persist(
    (set) => ({
      activeMode: 'calm',
      volume: 0.5,
      isPlaying: false,
      setActiveMode: (mode) => set({ activeMode: mode }),
      setVolume: (volume) => set({ volume }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    }),
    {
      name: 'studyx-focus-music',
    }
  )
);
