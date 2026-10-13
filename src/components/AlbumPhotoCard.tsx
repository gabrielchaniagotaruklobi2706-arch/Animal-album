import React, { useState } from 'react';
import { Heart, Volume2, MapPin, Camera } from 'lucide-react';
import { Animal, Language } from '../types';
import { soundManager } from '../utils/audio';

interface AlbumPhotoCardProps {
  animal: Animal;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectPhoto: (animal: Animal) => void;
}

export const AlbumPhotoCard: React.FC<AlbumPhotoCardProps> = ({
  animal,
  lang,
  isFavorite,
  onToggleFavorite,
  onSelectPhoto,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(animal.imageUrl);

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingSound(true);
    soundManager.playAnimalSound(animal.soundType);
    setTimeout(() => setIsPlayingSound(false), 2200);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    onToggleFavorite(animal.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CR':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'EN':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'VU':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'NT':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div
      onClick={() => onSelectPhoto(animal)}
      className="group relative bg-stone-900/90 rounded-3xl overflow-hidden border border-stone-850 hover:border-amber-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/20 flex flex-col cursor-pointer transform hover:-translate-y-1 active:translate-y-0"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-900 animate-pulse flex items-center justify-center">
            <Camera className="w-8 h-8 text-stone-700 animate-spin" />
          </div>
        )}

        <img
          src={imageSrc}
          alt={animal.name[lang]}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            // Graceful fallback to high-res wildlife image if URL ever fails
            setImageSrc('https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=85');
          }}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black tracking-wider uppercase border backdrop-blur-md ${getStatusBadge(
              animal.status
            )}`}
          >
            IUCN: {animal.status}
          </span>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Audio call button */}
            <button
              onClick={handlePlaySound}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                isPlayingSound
                  ? 'bg-amber-400 text-stone-950 border-amber-300 scale-110 shadow-lg shadow-amber-400/50'
                  : 'bg-stone-950/70 text-white border-white/10 hover:bg-stone-900 hover:text-amber-400'
              }`}
              title={lang === 'id' ? `Dengar suara asli ${animal.name[lang]}` : `Hear authentic ${animal.name[lang]} sound`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-400 scale-105'
                  : 'bg-stone-950/70 text-stone-300 border-white/10 hover:text-rose-400 hover:bg-stone-900'
              }`}
              title={isFavorite ? 'Hapus dari koleksi favorit' : 'Simpan ke koleksi favorit'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Audio Equalizer Wave Animation (appears when sound is playing) */}
        {isPlayingSound && (
          <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/40 flex items-center gap-1">
            <span className="w-1 bg-amber-400 rounded-full animate-sound-wave-1" />
            <span className="w-1 bg-amber-400 rounded-full animate-sound-wave-2" />
            <span className="w-1 bg-amber-400 rounded-full animate-sound-wave-3" />
            <span className="w-1 bg-amber-400 rounded-full animate-sound-wave-4" />
            <span className="text-[10px] text-amber-300 font-mono font-bold ml-1.5 uppercase">
              {lang === 'id' ? 'Suara Asli' : 'Authentic Call'}
            </span>
          </div>
        )}

        {/* Photographer watermark tag */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-sm text-[10px] text-stone-400 font-mono flex items-center gap-1 border border-white/5">
          <Camera className="w-3 h-3 text-stone-500" />
          <span className="truncate max-w-[120px]">{animal.photographer || 'Wildlife'}</span>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors font-['Outfit',sans-serif] truncate">
              {animal.name[lang]} {animal.emoji}
            </h3>
          </div>
          <p className="text-xs font-mono italic text-amber-400/80 mt-0.5 truncate">
            {animal.scientificName}
          </p>

          <p className="text-xs text-stone-400 line-clamp-2 mt-2 leading-relaxed">
            {animal.description[lang]}
          </p>
        </div>

        {/* Card Footer Meta */}
        <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-1 truncate max-w-[170px]">
            <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span className="truncate">
              {animal.photoLocation ? animal.photoLocation[lang] : animal.origin[lang]}
            </span>
          </div>

          <span className="text-stone-500 font-mono flex-shrink-0">
            {animal.photoYear || '2024'}
          </span>
        </div>
      </div>
    </div>
  );
};
