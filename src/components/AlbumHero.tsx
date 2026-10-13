import React from 'react';
import { Camera, Compass, Play } from 'lucide-react';
import { Language } from '../types';

interface AlbumHeroProps {
  lang: Language;
  onExploreGallery: () => void;
  onStartSlideshow: () => void;
  totalPhotos: number;
}

export const AlbumHero: React.FC<AlbumHeroProps> = ({
  lang,
  onExploreGallery,
  onStartSlideshow,
  totalPhotos,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-850 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 shadow-lg mb-5 sm:mb-6 backdrop-blur-sm">
          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wide text-stone-200 uppercase font-['Outfit',sans-serif]">
            {lang === 'id' ? 'Koleksi Fotografi Satwa Liar Dunia' : 'World Wildlife Photographic Collection'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Main Display Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Outfit',sans-serif] tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
          {lang === 'id' ? (
            <>
              Album Visual <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">Satwa Liar</span> Dunia
            </>
          ) : (
            <>
              World <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">Wildlife</span> Photo Album
            </>
          )}
        </h1>

        {/* Subtitle / Description */}
        <p className="text-xs sm:text-base lg:text-lg text-stone-300 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
          {lang === 'id'
            ? 'Dokumentasi fotografi spektakuler satwa di habitat aslinya—mulai dari serigala putih di beku Arktik, orangutan Kalimantan, hingga predator sabana. Dilengkapi rekaman suara asli dan data teknis lensa.'
            : 'Spectacular photographic documentation of wildlife in their native biomes—from Arctic white wolves and Bornean orangutans to savanna apex predators, featuring authentic audio calls and camera specs.'}
        </p>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-8 sm:mb-12">
          <button
            onClick={onExploreGallery}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-stone-950" />
            <span>{lang === 'id' ? 'Jelajahi Semua Foto' : 'Explore All Photos'}</span>
          </button>

          <button
            onClick={onStartSlideshow}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-stone-800/90 hover:bg-stone-750 text-stone-100 hover:text-white font-bold text-xs sm:text-sm border border-stone-700 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{lang === 'id' ? 'Putar Slideshow Layar Penuh' : 'Play Fullscreen Slideshow'}</span>
          </button>
        </div>

        {/* Highlight Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-sm">
            <div className="text-amber-400 font-mono font-black text-lg sm:text-xl mb-0.5">{totalPhotos}+</div>
            <div className="text-[11px] sm:text-xs text-stone-400 font-medium">{lang === 'id' ? 'Spesies Terdokumentasi' : 'Documented Species'}</div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-sm">
            <div className="text-emerald-400 font-mono font-black text-lg sm:text-xl mb-0.5">100%</div>
            <div className="text-[11px] sm:text-xs text-stone-400 font-medium">{lang === 'id' ? 'Fotografi Alam Asli' : 'Real Wild Photography'}</div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-sm">
            <div className="text-teal-400 font-mono font-black text-lg sm:text-xl mb-0.5">AUDIO</div>
            <div className="text-[11px] sm:text-xs text-stone-400 font-medium">{lang === 'id' ? 'Suara Khas Satwa' : 'Animal Voice Audio'}</div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-sm">
            <div className="text-rose-400 font-mono font-black text-lg sm:text-xl mb-0.5">IUCN</div>
            <div className="text-[11px] sm:text-xs text-stone-400 font-medium">{lang === 'id' ? 'Status Konservasi' : 'Conservation Status'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
