import React from 'react';
import { Search, LayoutGrid, BookOpen, List, X, Play } from 'lucide-react';
import { Language, AlbumCategory, ViewMode } from '../types';

interface AlbumFilterBarProps {
  lang: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: AlbumCategory;
  onSelectCategory: (cat: AlbumCategory) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onStartSlideshow: () => void;
  matchCount: number;
}

export const AlbumFilterBar: React.FC<AlbumFilterBarProps> = ({
  lang,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  viewMode,
  onChangeViewMode,
  onStartSlideshow,
  matchCount,
}) => {
  const categories: { id: AlbumCategory; label: { id: string; en: string }; emoji: string }[] = [
    { id: 'all', label: { id: 'Semua Satwa', en: 'All Wildlife' }, emoji: '🌍' },
    { id: 'sabana', label: { id: 'Sabana Afrika', en: 'African Savanna' }, emoji: '🦁' },
    { id: 'rainforest', label: { id: 'Hutan Hujan Tropis', en: 'Tropical Rainforest' }, emoji: '🦧' },
    { id: 'arctic', label: { id: 'Kutub Salju & Tundra', en: 'Arctic & Tundra' }, emoji: '❄️' },
    { id: 'ocean', label: { id: 'Samudra & Pesisir', en: 'Ocean & Coasts' }, emoji: '🐬' },
    { id: 'aviary', label: { id: 'Kubah Burung Langit', en: 'Birds & Aviary' }, emoji: '🦅' },
    { id: 'reptile', label: { id: 'Reptil Purba', en: 'Ancient Reptiles' }, emoji: '🐊' },
  ];

  const statuses = [
    { id: 'all', label: { id: 'Semua Status IUCN', en: 'All IUCN Status' } },
    { id: 'CR', label: { id: 'CR - Kritis Terancam Punah', en: 'CR - Critically Endangered' } },
    { id: 'EN', label: { id: 'EN - Terancam Punah', en: 'EN - Endangered' } },
    { id: 'VU', label: { id: 'VU - Rentan', en: 'VU - Vulnerable' } },
    { id: 'NT', label: { id: 'NT - Hampir Terancam', en: 'NT - Near Threatened' } },
    { id: 'LC', label: { id: 'LC - Risiko Rendah', en: 'LC - Least Concern' } },
  ];

  return (
    <div className="bg-stone-950/70 backdrop-blur-md border-b border-stone-850 py-4 sm:py-6 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3.5 sm:space-y-4">
        {/* Top Row: Search input + Status Dropdown + View Mode + Slideshow button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                lang === 'id'
                  ? 'Cari satwa, fotografer, habitat, spesies...'
                  : 'Search species, photographer, habitat...'
              }
              className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tools on Right: Status + View Mode + Slideshow */}
          <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto no-scrollbar py-0.5">
            {/* IUCN Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => onSelectStatus(e.target.value)}
              className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 focus:outline-none focus:border-amber-400 cursor-pointer flex-shrink-0"
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label[lang]}
                </option>
              ))}
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1 flex-shrink-0">
              <button
                onClick={() => onChangeViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={lang === 'id' ? 'Tampilan Grid Galeri' : 'Gallery Grid View'}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => onChangeViewMode('polaroid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'polaroid'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={lang === 'id' ? 'Tampilan Buku Polaroid' : 'Polaroid Scrapbook View'}
              >
                <BookOpen className="w-4 h-4" />
              </button>

              <button
                onClick={() => onChangeViewMode('compact')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={lang === 'id' ? 'Tampilan Daftar Padat' : 'Compact List View'}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Slideshow button */}
            <button
              onClick={onStartSlideshow}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-bold text-amber-300 transition-colors flex-shrink-0 active:scale-95"
              title={lang === 'id' ? 'Mulai Tayangan Salindia' : 'Start Slideshow'}
            >
              <Play className="w-3.5 h-3.5 fill-amber-300" />
              <span className="hidden sm:inline">{lang === 'id' ? 'Slideshow' : 'Slideshow'}</span>
            </button>
          </div>
        </div>

        {/* Categories Bar: Horizontal scrollable on mobile, flex on desktop */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-md scale-102 font-extrabold'
                      : 'bg-stone-900/90 text-stone-400 hover:text-stone-200 border border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span>{cat.label[lang]}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center text-xs text-stone-500 font-mono whitespace-nowrap">
            <span>{matchCount} {lang === 'id' ? 'foto ditemukan' : 'photos found'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
