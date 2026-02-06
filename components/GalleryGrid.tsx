
import React, { useState } from 'react';
import { GallerySet, GalleryItem } from '../types';

interface GalleryGridProps {
  set: GallerySet;
}

const GridItem: React.FC<{ item: GalleryItem }> = ({ item }) => {
  const [error, setError] = useState(false);

  const containerClasses = "relative w-full h-full overflow-hidden bg-zinc-950 flex items-center justify-center border-[0.5px] border-white/10";

  if (error) {
    return (
      <div className={containerClasses}>
        <span className="text-zinc-600 text-[10px] uppercase font-black text-center px-4 tracking-tighter">Media Error</span>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {item.type === 'image' ? (
        <img 
          src={item.url} 
          alt={item.label}
          className="w-full h-full object-cover select-none pointer-events-none"
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <video 
          src={item.url}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
          loop
          onError={() => setError(true)}
          onPointerDown={(e) => e.stopPropagation()} 
        />
      )}
    </div>
  );
};

export const GalleryGrid: React.FC<GalleryGridProps> = ({ set }) => {
  if (!set || !set.items) return null;
  
  return (
    <div className="grid grid-cols-2 grid-rows-2 w-full h-full bg-black">
      {set.items.map((item) => (
        <GridItem key={item.id} item={item} />
      ))}
    </div>
  );
};
