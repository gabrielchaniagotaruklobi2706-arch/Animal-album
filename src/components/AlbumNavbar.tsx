import React from 'react';
import { Camera, Heart, BookOpen, Volume2, VolumeX, Globe, Plus, Image as ImageIcon } from 'lucide-react';
import { Language, ViewMode } from '../types';

interface AlbumNavbarProps {
  lang: Language;
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleAudio: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  activeTab: 'gallery' | 'scrapbook' | 'favorites';
  onChangeTab: (tab: 'gallery' | 'scrapbook' | 'favorites') => void;
  favoriteCount: number;
  totalPhotos: number;
  onOpenAddPhoto: () => void;
}

export const AlbumNavbar: React.FC<AlbumNavbarProps> = ({
  lang,
  onToggleLang,
  isMuted,
  onToggleAudio,
  activeTab,
  onChangeTab,
  favoriteCount,
  totalPhotos,
  onOpenAddPhoto,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-850 transition-all">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo / Brand */}
          <div
            onClick={() => onChangeTab('gallery')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-700 p-0.5 shadow-lg shadow-amber-950/40 group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-stone-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-amber-400">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white font-['Outfit',sans-serif] truncate">
                  Album Satwa
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-full font-mono">
                  {totalPhotos} Foto
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-400 -mt-0.5 tracking-wide hidden sm:block truncate">
                {lang === 'id' ? 'Galeri Fotografi & Arsip Fauna Dunia' : 'World Wildlife Photo & Species Archive'}
              </p>
            </div>
          </div>

          {/* Desktop/Tablet Center Mode Switcher Tabs */}
          <nav className="hidden md:flex items-center bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 shadow-inner">
            <button
              onClick={() => onChangeTab('gallery')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-extrabold scale-102'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Galeri Foto' : 'Photo Gallery'}</span>
            </button>

            <button
              onClick={() => onChangeTab('scrapbook')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'scrapbook'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-extrabold scale-102'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Buku Polaroid' : 'Polaroid Book'}</span>
            </button>

            <button
              onClick={() => onChangeTab('favorites')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'favorites'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-extrabold scale-102'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-stone-950' : 'text-red-400'}`} />
              <span>{lang === 'id' ? 'Favorit' : 'Favorites'}</span>
              {favoriteCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'favorites' ? 'bg-stone-950 text-amber-300' : 'bg-red-500 text-white'
                }`}>
                  {favoriteCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Tools: Add Photo, Audio Toggle, Lang Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Add Photo Button */}
            <button
              onClick={onOpenAddPhoto}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/30 transition-transform active:scale-95"
              title={lang === 'id' ? 'Tambah Foto Satwa ke Album' : 'Add Wildlife Photo to Album'}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'id' ? 'Tambah Foto' : 'Add Photo'}</span>
            </button>

            {/* Ambient Wildlife Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${
                isMuted
                  ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  : 'bg-emerald-950/90 border-emerald-700/60 text-emerald-400 shadow-sm shadow-emerald-900/40'
              }`}
              title={isMuted ? 'Nyalakan Suara Alam' : 'Matikan Suara Alam'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-200 transition-colors"
              title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase font-mono text-[11px] sm:text-xs">{lang}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar (for smartphones & mobile screens) */}
        <div className="md:hidden flex items-center justify-around px-2 py-1.5 border-t border-stone-850 bg-stone-950/98">
          <button
            onClick={() => onChangeTab('gallery')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gallery'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Galeri' : 'Gallery'}</span>
          </button>

          <button
            onClick={() => onChangeTab('scrapbook')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'scrapbook'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Polaroid</span>
          </button>

          <button
            onClick={() => onChangeTab('favorites')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeTab === 'favorites'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-stone-950' : 'text-rose-400'}`} />
            <span>{lang === 'id' ? 'Favorit' : 'Favorites'}</span>
            {favoriteCount > 0 && (
              <span className={`px-1 rounded-full text-[9px] font-mono font-bold ${
                activeTab === 'favorites' ? 'bg-stone-950 text-amber-300' : 'bg-red-500 text-white'
              }`}>
                {favoriteCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
