
import React, { useState, useCallback, useRef } from 'react';
import { DEFAULT_SETS } from './constants';
import { GallerySet, SwipeDirection, GalleryItem } from './types';
import { GalleryGrid } from './components/GalleryGrid';
import { SwipeIndicator } from './components/SwipeIndicator';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop';

const App: React.FC = () => {
  const [sets, setSets] = useState<GallerySet[]>(DEFAULT_SETS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const startX = useRef(0);
  const startTime = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (sets.length <= 1) return;
    setIsAnimating(true);
    
    const offScreenX = direction === 'next' ? -window.innerWidth : window.innerWidth;
    setDragOffset(offScreenX);

    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (direction === 'next') return (prev + 1) % sets.length;
        return (prev - 1 + sets.length) % sets.length;
      });
      
      setDragOffset(direction === 'next' ? window.innerWidth : -window.innerWidth);
      setSwipeDirection(null);

      requestAnimationFrame(() => {
        setDragOffset(0);
        setTimeout(() => setIsAnimating(false), 500);
      });
    }, 300);
  }, [sets.length]);

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isAnimating) return;
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('video')) return;
    
    setIsDragging(true);
    startX.current = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    startTime.current = Date.now();
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const deltaX = currentX - startX.current;
    
    setDragOffset(deltaX);

    if (deltaX < -60) setSwipeDirection('left');
    else if (deltaX > 60) setSwipeDirection('right');
    else setSwipeDirection(null);
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentTime = Date.now();
    const duration = currentTime - startTime.current;
    const velocity = Math.abs(dragOffset) / duration;

    const shouldNavigate = Math.abs(dragOffset) > window.innerWidth / 4 || velocity > 0.6;

    if (shouldNavigate && dragOffset < 0 && sets.length > 1) {
      navigate('next');
    } else if (shouldNavigate && dragOffset > 0 && sets.length > 1) {
      navigate('prev');
    } else {
      setIsAnimating(true);
      setDragOffset(0);
      setSwipeDirection(null);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: GalleryItem[] = Array.from(files).map((file: File, idx: number) => ({
      id: `file-${Date.now()}-${idx}`,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      label: file.name
    }));

    const newSets: GallerySet[] = [];
    // Process all uploaded files into sets of 4
    for (let i = 0; i < newItems.length; i += 4) {
      const chunk = newItems.slice(i, i + 4);
      
      // Pad incomplete sets so they always have 4 items for the 2x2 grid
      while (chunk.length < 4) {
        chunk.push({
          id: `pad-${Date.now()}-${chunk.length}`,
          type: 'image',
          url: PLACEHOLDER_IMG,
          label: 'Placeholder'
        });
      }

      newSets.push({
        id: `set-${Date.now()}-${i}`,
        items: chunk
      });
    }

    if (newSets.length > 0) {
      const oldLen = sets.length;
      setSets(prev => [...prev, ...newSets]);
      // Immediately jump to the first new set
      setCurrentIndex(oldLen);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetGallery = () => {
    sets.forEach(set => {
      if (set.id.startsWith('set-')) {
         set.items.forEach(item => {
           if (item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
         });
      }
    });
    setSets(DEFAULT_SETS);
    setCurrentIndex(0);
  };

  const opacity = 1 - (Math.abs(dragOffset) / window.innerWidth);

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden touch-none select-none"
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Graphic */}
      <div className="absolute top-[-5%] left-[-5%] text-[55rem] font-black text-white/[0.04] select-none pointer-events-none leading-none z-0">
        A
      </div>

      {/* Main Screen-Filling Content */}
      <div 
        className={`absolute inset-0 z-10 ${isAnimating ? 'transition-all duration-500 cubic-bezier(0.2, 1, 0.3, 1)' : ''}`}
        style={{
          transform: `translateX(${dragOffset}px)`,
          opacity: opacity
        }}
      >
        <GalleryGrid set={sets[currentIndex]} />
      </div>

      {/* Overlay UI */}
      <header className="absolute top-10 inset-x-0 text-center z-40 pointer-events-none">
        <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] mb-2">ARTSYNC</h1>
        <div className="bg-black/60 backdrop-blur-2xl inline-block px-5 py-2 rounded-full border border-white/10 text-[11px] font-bold tracking-[0.3em] uppercase text-white/90 shadow-2xl">
          SET {currentIndex + 1} OF {sets.length}
        </div>
      </header>

      {/* Embossed Greyscale Controls (Desktop) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden sm:block">
        <button 
          onClick={resetGallery}
          className="group flex flex-col items-center gap-4 p-5 bg-zinc-800/90 hover:bg-zinc-700/90 backdrop-blur-xl rounded-3xl border border-zinc-600/40 shadow-[6px_6px_12px_rgba(0,0,0,0.6),-2px_-2px_10px_rgba(255,255,255,0.05)] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5)] transition-all active:scale-95"
        >
          <div className="text-zinc-400 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </div>
          <span className="[writing-mode:vertical-lr] rotate-180 text-[11px] font-black text-zinc-500 tracking-[0.2em] uppercase group-hover:text-zinc-300">Reset</span>
        </button>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:block">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="group flex flex-col items-center gap-4 p-5 bg-zinc-800/90 hover:bg-zinc-700/90 backdrop-blur-xl rounded-3xl border border-zinc-600/40 shadow-[6px_6px_12px_rgba(0,0,0,0.6),-2px_-2px_10px_rgba(255,255,255,0.05)] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5)] transition-all active:scale-95"
        >
          <span className="[writing-mode:vertical-lr] text-[11px] font-black text-zinc-500 tracking-[0.2em] uppercase group-hover:text-zinc-300">Upload</span>
          <div className="text-zinc-400 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
        </button>
      </div>

      {/* Mobile Controls */}
      <div className="sm:hidden absolute bottom-12 inset-x-0 flex justify-center gap-10 z-40">
        <button onClick={resetGallery} className="w-16 h-16 flex items-center justify-center bg-zinc-800/90 backdrop-blur-2xl border border-zinc-700 rounded-full text-zinc-400 shadow-2xl active:scale-90">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="w-16 h-16 flex items-center justify-center bg-zinc-100 backdrop-blur-2xl rounded-full text-zinc-900 shadow-2xl active:scale-90">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
        </button>
      </div>

      <SwipeIndicator direction={swipeDirection} />

      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*,video/*"
        onChange={handleFileUpload}
      />

      <footer className="absolute bottom-6 inset-x-0 text-white/10 text-[9px] uppercase tracking-[1.2em] font-black pointer-events-none text-center z-40">
        EXPLORE THE GALLERY
      </footer>
    </div>
  );
};

export default App;
