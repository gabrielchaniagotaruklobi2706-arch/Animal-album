import React, { useState } from 'react';
import { Heart, Volume2, MapPin, Camera } from 'lucide-react';
import { Animal, Language } from '../types';
import { soundManager } from '../utils/audio';

interface AlbumScrapbookViewProps {
  animals: Animal[];
  lang: Language;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectPhoto: (animal: Animal) => void;
}

export const AlbumScrapbookView: React.FC<AlbumScrapbookViewProps> = ({
  animals,
  lang,
  favorites,
  onToggleFavorite,
  onSelectPhoto,
}) => {
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

  const tilts = [
    '-rotate-1 hover:rotate-0',
    'rotate-1.5 hover:rotate-0',
    '-rotate-2 hover:rotate-0',
    'rotate-1 hover:rotate-0',
    '-rotate-1.5 hover:rotate-0',
    'rotate-2 hover:rotate-0',
  ];

  const tapeColors = [
    'bg-amber-200/70 border-amber-300/60',
    'bg-emerald-200/60 border-emerald-300/60',
    'bg-rose-200/60 border-rose-300/60',
    'bg-sky-200/60 border-sky-300/60',
  ];

  const handlePlaySound = (e: React.MouseEvent, animal: Animal) => {
    e.stopPropagation();
    setActiveSoundId(animal.id);
    soundManager.playAnimalSound(animal.soundType);
    setTimeout(() => setActiveSoundId(null), 2200);
  };

  return (
    <div className="py-4 sm:py-8">
      {/* Scrapbook Album Intro Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 px-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono uppercase tracking-wider">
          {lang === 'id' ? 'Koleksi Cetak Polaroid Satwa' : 'Polaroid Wildlife Scrapbook'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-100 font-['Outfit',sans-serif] mt-3">
          {lang === 'id' ? 'Buku Album Ekspedisi Satwa' : 'Wildlife Expedition Scrapbook'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-2">
          {lang === 'id'
            ? 'Potret polaroid klasik dengan catatan tulisan tangan dari berbagai ekspedisi suaka dan cagar alam di seluruh penjuru bumi.'
            : 'Classic polaroid snapshots with handwritten expedition notes gathered from sanctuaries across the globe.'}
        </p>
      </div>

      {/* Polaroid Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        {animals.map((animal, idx) => {
          const isFav = favorites.includes(animal.id);
          const tiltClass = tilts[idx % tilts.length];
          const tapeColor = tapeColors[idx % tapeColors.length];
          const isSoundPlaying = activeSoundId === animal.id;

          return (
            <div
              key={animal.id}
              onClick={() => onSelectPhoto(animal)}
              className={`relative bg-stone-100 text-stone-900 rounded-sm p-3.5 sm:p-4 pt-5 pb-6 shadow-2xl shadow-black/80 transition-all duration-300 transform ${tiltClass} hover:scale-104 hover:z-20 cursor-pointer group select-none border border-stone-300`}
            >
              {/* Washi Masking Tape on top */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 ${tapeColor} border backdrop-blur-[2px] shadow-sm transform -rotate-1 pointer-events-none opacity-85`}
              />

              {/* Polaroid Photo Frame */}
              <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden rounded-[2px] shadow-inner mb-3.5 sm:mb-4">
                <img
                  src={animal.imageUrl}
                  alt={animal.name[lang]}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=85';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Status Stamp on Photo corner */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-sm bg-stone-950/85 text-amber-300 text-[10px] font-mono font-bold tracking-widest uppercase border border-amber-400/40">
                  {animal.status}
                </div>

                {/* Sound Call Button */}
                <button
                  onClick={(e) => handlePlaySound(e, animal)}
                  className={`absolute bottom-2 left-2 p-2 rounded-full border shadow-md backdrop-blur-sm transition-all ${
                    isSoundPlaying
                      ? 'bg-amber-400 text-stone-950 border-amber-300 scale-110 shadow-lg'
                      : 'bg-stone-900/80 text-white hover:text-amber-400 border-white/20'
                  }`}
                  title={lang === 'id' ? 'Dengar Suara' : 'Listen Sound'}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {/* Heart Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    onToggleFavorite(animal.id);
                  }}
                  className={`absolute bottom-2 right-2 p-2 rounded-full border shadow-md backdrop-blur-sm transition-all ${
                    isFav
                      ? 'bg-rose-500 text-white border-rose-400 scale-105'
                      : 'bg-stone-900/80 text-white hover:text-rose-400 border-white/20'
                  }`}
                  title={isFav ? 'Hapus favorit' : 'Tambah favorit'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                </button>

                {/* Audio Playing ripple */}
                {isSoundPlaying && (
                  <div className="absolute inset-0 bg-amber-400/10 pointer-events-none flex items-center justify-center animate-pulse" />
                )}
              </div>

              {/* Handwritten Style Caption on Polaroid bottom */}
              <div className="space-y-1.5 px-1 font-['Outfit',sans-serif]">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm sm:text-base text-stone-900 tracking-tight">
                    {animal.name[lang]} {animal.emoji}
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-stone-500">
                    #{idx + 1}
                  </span>
                </div>

                <p className="text-[11px] font-mono italic text-stone-600 truncate">
                  {animal.scientificName}
                </p>

                <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-600 font-mono">
                  <div className="flex items-center gap-1 truncate max-w-[140px]">
                    <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                    <span className="truncate">
                      {animal.photoLocation ? animal.photoLocation[lang] : animal.origin[lang]}
                    </span>
                  </div>

                  <span className="text-stone-500 flex-shrink-0">
                    📷 {animal.photographer ? animal.photographer.split(' ')[0] : 'Wild'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
