import React from 'react';
import { Volume2, VolumeX, Compass, BookOpen, Clock, Award, Camera, RefreshCw } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  lang: Language;
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleAudio: () => void;
  passportStampCount: number;
  totalAnimals: number;
  onOpenPassport: () => void;
  onReplayLoading: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  lang,
  onToggleLang,
  isMuted,
  onToggleAudio,
  passportStampCount,
  totalAnimals,
  onOpenPassport,
  onReplayLoading,
}) => {
  const navItems = [
    { id: 'home', label: lang === 'id' ? 'Beranda' : 'Home', icon: Compass },
    { id: 'map', label: lang === 'id' ? 'Peta Safari' : 'Safari Map', icon: Compass },
    { id: 'animals', label: lang === 'id' ? 'Ensiklopedia' : 'Animals', icon: BookOpen },
    { id: 'schedule', label: lang === 'id' ? 'Jadwal Atraksi' : 'Schedule', icon: Clock },
    { id: 'quiz', label: lang === 'id' ? 'Kuis Satwa' : 'Quiz', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
            🦁
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit',sans-serif] block leading-none">
              Zoo Adventure
            </span>
            <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
              {lang === 'id' ? 'Taman Safari Terpadu' : 'Wildlife Reserve'}
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Audio ambient toggle */}
          <button
            id="audio-toggle-btn"
            onClick={onToggleAudio}
            title={isMuted ? 'Nyalakan Suara Alam' : 'Matikan Suara Alam'}
            className={`p-2 rounded-lg border transition-all ${
              !isMuted
                ? 'bg-emerald-900/40 border-emerald-600/50 text-emerald-300'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Replay loading screen */}
          <button
            id="replay-loading-btn"
            onClick={onReplayLoading}
            title={lang === 'id' ? 'Putar Ulang Layar Pembuka' : 'Replay Intro Screen'}
            className="p-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-400 hover:text-amber-300 transition-colors hidden sm:flex"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Language Switch */}
          <button
            id="lang-toggle-btn"
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-bold text-stone-200 hover:border-stone-600 transition-colors flex items-center gap-1.5"
          >
            <span>{lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          </button>

          {/* Adventurer Passport Button */}
          <button
            id="passport-btn"
            onClick={onOpenPassport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-900/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4 text-stone-950" />
            <span className="hidden sm:inline">{lang === 'id' ? 'Paspor Safari' : 'Passport'}</span>
            <span className="bg-stone-950/20 text-stone-950 text-xs px-1.5 py-0.5 rounded-full font-extrabold">
              {passportStampCount}/{totalAnimals}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Subbar */}
      <div className="md:hidden flex items-center justify-around py-2 px-2 bg-stone-950/80 border-t border-stone-800 text-xs overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
              activeSection === item.id ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
