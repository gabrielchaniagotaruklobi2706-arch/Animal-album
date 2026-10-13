import React, { useState } from 'react';
import { X, Volume2, Camera, Utensils, Heart, Globe, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { Animal, Language } from '../types';
import { ZOO_ZONES } from '../data/zones';
import { soundManager } from '../utils/audio';

interface AnimalModalProps {
  animal: Animal | null;
  onClose: () => void;
  onTakePhoto: (animal: Animal) => void;
  lang: Language;
}

export const AnimalModal: React.FC<AnimalModalProps> = ({
  animal,
  onClose,
  onTakePhoto,
  lang,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasFed, setHasFed] = useState(false);

  if (!animal) return null;

  const zone = ZOO_ZONES.find((z) => z.id === animal.zoneId);

  const handlePlaySound = () => {
    setIsPlayingAudio(true);
    soundManager.playAnimalSound(animal.soundType);
    setTimeout(() => setIsPlayingAudio(false), 2200);
  };

  const handleFeed = () => {
    soundManager.playFeedCrunch();
    setHasFed(true);
    setTimeout(() => setHasFed(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-scale-up"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/70 border border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Section */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950 shrink-0">
          <img
            src={animal.imageUrl}
            alt={animal.name[lang]}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />

          {/* Habitat Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow">
              <span>{zone?.emoji}</span>
              <span>{zone?.name[lang]}</span>
            </span>
          </div>

          {/* Animal Name Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-3xl sm:text-4xl font-extrabold text-white font-['Outfit',sans-serif]">
                <span>{animal.name[lang]}</span>
                <span>{animal.emoji}</span>
              </div>
              <div className="text-sm text-amber-400 italic font-mono mt-0.5">
                {animal.scientificName}
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-stone-700 text-xs font-bold text-stone-200">
              {animal.statusLabel[lang]}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handlePlaySound}
              className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                isPlayingAudio
                  ? 'bg-amber-400 text-stone-950 scale-105 shadow-lg shadow-amber-400/30 ring-2 ring-amber-300'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? (lang === 'id' ? 'Memutar...' : 'Playing...') : (lang === 'id' ? 'Dengar Suara' : 'Hear Sound')}</span>
            </button>

            <button
              onClick={handleFeed}
              className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                hasFed
                  ? 'bg-emerald-500 text-stone-950 scale-105'
                  : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-stone-700'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>{hasFed ? (lang === 'id' ? 'Kenyang! 💖' : 'Fed! 💖') : (lang === 'id' ? 'Beri Makan' : 'Feed Animal')}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTakePhoto(animal);
              }}
              className="py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>{lang === 'id' ? 'Foto Satwa' : 'Snap Photo'}</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              {lang === 'id' ? 'Tentang Satwa' : 'About This Species'}
            </h4>
            <p className="text-stone-200 text-sm leading-relaxed">
              {animal.description[lang]}
            </p>
          </div>

          {/* Biological Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
              <div className="text-[11px] text-stone-400 flex items-center gap-1 mb-1">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'id' ? 'Asal Daerah' : 'Origin'}</span>
              </div>
              <div className="text-xs font-bold text-white">{animal.origin[lang]}</div>
            </div>

            <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
              <div className="text-[11px] text-stone-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'id' ? 'Jadwal Makan' : 'Feeding Time'}</span>
              </div>
              <div className="text-xs font-bold text-white">{animal.feedingTime}</div>
            </div>

            <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
              <div className="text-[11px] text-stone-400 flex items-center gap-1 mb-1">
                <Utensils className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'id' ? 'Pakan Favorit' : 'Favorite Food'}</span>
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{animal.favoriteFood.icon}</span>
                <span className="truncate">{animal.favoriteFood[lang]}</span>
              </div>
            </div>

            <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
              <div className="text-[11px] text-stone-400 flex items-center gap-1 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>{lang === 'id' ? 'Status IUCN' : 'IUCN Status'}</span>
              </div>
              <div className="text-xs font-bold text-amber-400">{animal.status}</div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-stone-950/40 p-4 rounded-2xl border border-stone-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'id' ? 'Fakta Unik & Menakjubkan' : 'Remarkable Fun Facts'}</span>
            </h4>
            <ul className="space-y-2.5">
              {animal.funFacts[lang].map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
