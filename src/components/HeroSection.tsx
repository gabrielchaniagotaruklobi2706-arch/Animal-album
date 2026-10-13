import React from 'react';
import { Compass, Sparkles, MapPin, Volume2 } from 'lucide-react';
import { Language } from '../types';
import { soundManager } from '../utils/audio';

interface HeroSectionProps {
  lang: Language;
  onStartAdventure: () => void;
  onQuickExploreZone: (zoneId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onStartAdventure,
  onQuickExploreZone,
}) => {
  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    soundManager.playClick();
    soundManager.playAnimalSound('lion');
    onStartAdventure();
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center text-center px-4 overflow-hidden"
      style={{
        background: `
          linear-gradient(rgba(10, 18, 12, 0.45), rgba(15, 23, 16, 0.7)),
          url("https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=2000&q=85")
          center/cover no-repeat
        `,
      }}
    >
      {/* Subtle ambient lighting vignette */}
      <div className="absolute inset-0 bg-radial-at-c from-transparent via-stone-950/40 to-stone-950/80 pointer-events-none" />

      {/* Floating Safari Atmosphere particles */}
      <div className="absolute top-10 left-10 text-3xl opacity-30 select-none animate-pulse">🌿</div>
      <div className="absolute top-20 right-16 text-3xl opacity-30 select-none animate-pulse delay-700">🍃</div>
      <div className="absolute bottom-16 left-20 text-3xl opacity-30 select-none animate-pulse delay-1000">🌱</div>

      <div className="hero relative z-10 max-w-4xl mx-auto py-16">
        {/* Animated Animal Mascot Trio */}
        <div className="flex items-center justify-center gap-3 text-6xl sm:text-7xl mb-6 select-none animate-bounce">
          <span className="hover:scale-125 transition-transform cursor-pointer" onClick={() => soundManager.playAnimalSound('lion')} title="Auman Singa">
            🦁
          </span>
          <span className="hover:scale-125 transition-transform cursor-pointer" onClick={() => soundManager.playAnimalSound('elephant')} title="Terompet Gajah">
            🐘
          </span>
          <span className="hover:scale-125 transition-transform cursor-pointer" onClick={() => soundManager.playAnimalSound('bird')} title="Suara Jerapah & Alam">
            🦒
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-5 font-['Outfit',sans-serif] drop-shadow-lg">
          Zoo Adventure
        </h1>

        {/* Hero Subtitle */}
        <p className="text-xl sm:text-2xl text-stone-200 font-medium max-w-2xl mx-auto mb-8 drop-shadow leading-relaxed">
          {lang === 'id'
            ? 'Jelajahi dunia satwa dalam satu perjalanan.'
            : 'Explore the wonders of wildlife in a single unforgettable journey.'}
        </p>

        {/* Primary CTA button matching user design */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#map"
            id="start-adventure-btn"
            onClick={handleStart}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#f2c94c] hover:bg-[#ffda66] text-[#18351f] text-lg font-extrabold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-950/40 border border-amber-300"
          >
            <Compass className="w-5 h-5 text-[#18351f]" />
            <span>{lang === 'id' ? 'Mulai Petualangan' : 'Start Adventure'}</span>
          </a>

          <button
            onClick={() => {
              soundManager.playAnimalSound('lion');
            }}
            className="inline-flex items-center gap-2 px-6 py-4 bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-500/30 rounded-full font-bold text-sm backdrop-blur-md transition-all hover:border-amber-400"
          >
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'id' ? 'Dengar Auman Singa' : 'Hear Lion Roar'}</span>
          </button>
        </div>

        {/* Live Zoo Stats Pill Banner */}
        <div className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div
            onClick={() => onQuickExploreZone('sabana')}
            className="bg-stone-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5 hover:border-amber-400/50 cursor-pointer transition-all"
          >
            <div className="text-amber-400 font-extrabold text-xl">6 Zona</div>
            <div className="text-xs text-stone-300 font-medium">
              {lang === 'id' ? 'Habitat Alami Bebas' : 'Natural Habitats'}
            </div>
          </div>

          <div
            onClick={onStartAdventure}
            className="bg-stone-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5 hover:border-amber-400/50 cursor-pointer transition-all"
          >
            <div className="text-emerald-400 font-extrabold text-xl">12+ Satwa</div>
            <div className="text-xs text-stone-300 font-medium">
              {lang === 'id' ? 'Koleksi & Suara Riil' : 'Species & Audio'}
            </div>
          </div>

          <div className="bg-stone-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
            <div className="text-sky-300 font-extrabold text-xl">08:30 - 17:30</div>
            <div className="text-xs text-stone-300 font-medium">
              {lang === 'id' ? 'Buka Setiap Hari' : 'Open Everyday'}
            </div>
          </div>

          <div className="bg-stone-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
            <div className="text-amber-300 font-extrabold text-xl flex items-center gap-1">
              <span>28°C</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs text-stone-300 font-medium">
              {lang === 'id' ? 'Kondisi Cuaca Cerah' : 'Sunny Safari Day'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
