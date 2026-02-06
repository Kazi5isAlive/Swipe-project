
import React from 'react';
import { SwipeDirection } from '../types';

interface SwipeIndicatorProps {
  direction: SwipeDirection;
}

export const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ direction }) => {
  if (!direction) return null;

  return (
    <div className={`fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none px-10 py-6 rounded-3xl text-5xl font-black uppercase tracking-[0.2em] backdrop-blur-2xl border-4 transition-all duration-300 transform
      ${direction === 'left' 
        ? 'right-12 border-white/20 text-white/40 rotate-6 scale-110 shadow-2xl' 
        : 'left-12 border-white/20 text-white/40 -rotate-6 scale-110 shadow-2xl'}`}>
      {direction === 'left' ? 'NEXT' : 'PREV'}
    </div>
  );
};
