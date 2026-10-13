import React, { useState } from 'react';
import { Search, Volume2, Camera, Sparkles, Utensils, Heart, CheckCircle2 } from 'lucide-react';
import { Animal, Language, DietType, ConservationStatus } from '../types';
import { ZOO_ZONES } from '../data/zones';
import { soundManager } from '../utils/audio';

interface AnimalDirectoryProps {
  animals: Animal[];
  selectedZoneFilter: string;
  onZoneFilterChange: (zoneId: string) => void;
  onSelectAnimal: (animal: Animal) => void;
  onTakePhoto: (animal: Animal) => void;
  stampedAnimalIds: string[];
  lang: Language;
}

export const AnimalDirectory: React.FC<AnimalDirectoryProps> = ({
  animals,
  selectedZoneFilter,
  onZoneFilterChange,
  onSelectAnimal,
  onTakePhoto,
  stampedAnimalIds,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fedAnimals, setFedAnimals] = useState<Record<string, number>>({});
  const [activeFeedingId, setActiveFeedingId] = useState<string | null>(null);

  // Filter animals logic
  const filteredAnimals = animals.filter((animal) => {
    // Zone filter
    if (selectedZoneFilter !== 'all' && animal.zoneId !== selectedZoneFilter) {
      return false;
    }
    // Diet filter
    if (dietFilter !== 'all' && animal.diet !== dietFilter) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'all' && animal.status !== statusFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName =
        animal.name.id.toLowerCase().includes(q) ||
        animal.name.en.toLowerCase().includes(q) ||
        animal.scientificName.toLowerCase().includes(q);
      if (!matchName) return false;
    }
    return true;
  });

  const handleFeedAnimal = (e: React.MouseEvent, animal: Animal) => {
    e.stopPropagation();
    soundManager.playFeedCrunch();
    setActiveFeedingId(animal.id);
    setFedAnimals((prev) => ({
      ...prev,
      [animal.id]: (prev[animal.id] || 0) + 1,
    }));

    setTimeout(() => {
      setActiveFeedingId(null);
    }, 1200);
  };

  const getStatusColor = (status: ConservationStatus) => {
    switch (status) {
      case 'CR':
        return 'bg-red-950/80 text-red-400 border-red-800';
      case 'EN':
        return 'bg-orange-950/80 text-orange-400 border-orange-800';
      case 'VU':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      case 'NT':
        return 'bg-yellow-950/80 text-yellow-400 border-yellow-800';
      case 'LC':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <section id="animals" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/40 border border-amber-600/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'id' ? 'Ensiklopedia Koleksi Satwa' : 'Wildlife Encyclopedia'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
          {lang === 'id' ? 'Koleksi Fauna & Satwa Langka' : 'Fauna & Endangered Species Gallery'}
        </h2>
        <p className="text-stone-300 mt-3 text-base">
          {lang === 'id'
            ? 'Kenali lebih dekat satwa dari berbagai belahan bumi, dengarkan suara aslinya, beri makan virtual, dan kumpulkan foto dalam paspor safari Anda.'
            : 'Get up close with animals from across the globe, listen to characteristic calls, feed them virtually, and collect photos in your passport.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 mb-10 shadow-lg backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              id="animal-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'id' ? 'Cari nama satwa atau spesies...' : 'Search animal or scientific name...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Habitat Filter Pills */}
          <div className="md:col-span-8 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => onZoneFilterChange('all')}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedZoneFilter === 'all'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
              }`}
            >
              {lang === 'id' ? 'Semua Habitat' : 'All Habitats'}
            </button>
            {ZOO_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onZoneFilterChange(zone.id)}
                className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedZoneFilter === zone.id
                    ? 'bg-amber-400 text-stone-950 font-bold shadow'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                }`}
              >
                <span>{zone.emoji}</span>
                <span>{zone.name[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters (Diet & Conservation Status) */}
        <div className="mt-4 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Diet filters */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-semibold">{lang === 'id' ? 'Pola Makan:' : 'Diet:'}</span>
            {[
              { id: 'all', label: lang === 'id' ? 'Semua' : 'All' },
              { id: 'carnivore', label: lang === 'id' ? '🥩 Karnivora' : '🥩 Carnivore' },
              { id: 'herbivore', label: lang === 'id' ? '🌿 Herbivora' : '🌿 Herbivore' },
              { id: 'omnivore', label: lang === 'id' ? '🍎 Omnivora' : '🍎 Omnivore' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDietFilter(d.id)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  dietFilter === d.id
                    ? 'bg-stone-800 text-amber-400 border-amber-400/40 font-bold'
                    : 'bg-stone-950/60 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-semibold">{lang === 'id' ? 'Status IUCN:' : 'IUCN Status:'}</span>
            {[
              { id: 'all', label: lang === 'id' ? 'Semua' : 'All' },
              { id: 'CR', label: 'CR (Kritis)' },
              { id: 'EN', label: 'EN (Terancam)' },
              { id: 'VU', label: 'VU (Rentan)' },
              { id: 'LC', label: 'LC (Aman)' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-2 py-1 rounded-lg border transition-colors ${
                  statusFilter === s.id
                    ? 'bg-stone-800 text-amber-400 border-amber-400/40 font-bold'
                    : 'bg-stone-950/60 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animal Grid */}
      {filteredAnimals.length === 0 ? (
        <div className="text-center py-16 bg-stone-900/40 rounded-3xl border border-stone-800">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-white mb-1">
            {lang === 'id' ? 'Tidak Ada Satwa Ditemukan' : 'No Animals Found'}
          </h3>
          <p className="text-stone-400 text-sm max-w-sm mx-auto mb-4">
            {lang === 'id' ? 'Coba ubah kata kunci pencarian atau reset filter habitat Anda.' : 'Try changing your search terms or resetting filters.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onZoneFilterChange('all');
              setDietFilter('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs"
          >
            {lang === 'id' ? 'Reset Semua Filter' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => {
            const isStamped = stampedAnimalIds.includes(animal.id);
            const feedCount = fedAnimals[animal.id] || 0;
            const isFeedingThis = activeFeedingId === animal.id;
            const zone = ZOO_ZONES.find((z) => z.id === animal.zoneId);

            return (
              <div
                key={animal.id}
                id={`animal-card-${animal.id}`}
                onClick={() => onSelectAnimal(animal)}
                className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-400/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Animal Photo with Gradient Overlay */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
                  <img
                    src={animal.imageUrl}
                    alt={animal.name[lang]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {/* Zone Badge */}
                    <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 shadow">
                      <span>{zone?.emoji}</span>
                      <span>{zone?.name[lang]}</span>
                    </span>

                    {/* Passport Stamped Indicator */}
                    {isStamped && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-stone-950 text-xs font-extrabold flex items-center gap-1 shadow-lg animate-bounce">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'id' ? 'Terstempel' : 'Stamped'}</span>
                      </span>
                    )}
                  </div>

                  {/* Feeding celebration heart animation */}
                  {isFeedingThis && (
                    <div className="absolute inset-0 bg-amber-900/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-20 animate-fade-in">
                      <div className="text-center transform scale-125 transition-transform">
                        <div className="text-5xl animate-bounce">😋 {animal.favoriteFood.icon}</div>
                        <div className="text-amber-300 font-extrabold text-sm mt-2 flex items-center justify-center gap-1">
                          <Heart className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
                          <span>{lang === 'id' ? 'Kenyang & Senang!' : 'Happy & Fed!'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Image Overlay: Name & Scientific */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-extrabold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                        <span>{animal.name[lang]}</span>
                        <span className="text-xl">{animal.emoji}</span>
                      </div>
                      <div className="text-xs text-amber-300/90 italic font-mono">
                        {animal.scientificName}
                      </div>
                    </div>

                    {/* IUCN Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[11px] font-black tracking-wider ${getStatusColor(
                        animal.status
                      )}`}
                    >
                      {animal.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed mb-4">
                    {animal.description[lang]}
                  </p>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-stone-950/60 border border-stone-800 text-[11px] mb-4">
                    <div className="text-center">
                      <div className="text-stone-400">{lang === 'id' ? 'Bobot' : 'Weight'}</div>
                      <div className="font-bold text-stone-200 truncate">{animal.weight}</div>
                    </div>
                    <div className="text-center border-x border-stone-800">
                      <div className="text-stone-400">{lang === 'id' ? 'Kecepatan' : 'Speed'}</div>
                      <div className="font-bold text-amber-400 truncate">{animal.speed}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-stone-400">{lang === 'id' ? 'Usia' : 'Lifespan'}</div>
                      <div className="font-bold text-stone-200 truncate">{animal.lifespan}</div>
                    </div>
                  </div>

                  {/* Interactive Action Toolbar */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800/80">
                    {/* Sound Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playAnimalSound(animal.soundType);
                      }}
                      title={lang === 'id' ? 'Dengarkan Suara Satwa' : 'Listen to Voice'}
                      className="py-2 px-2 rounded-xl bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'id' ? 'Suara' : 'Roar'}</span>
                    </button>

                    {/* Feed Button */}
                    <button
                      onClick={(e) => handleFeedAnimal(e, animal)}
                      title={lang === 'id' ? `Beri Makan (${animal.favoriteFood[lang]})` : `Feed (${animal.favoriteFood[lang]})`}
                      className="py-2 px-2 rounded-xl bg-stone-800 hover:bg-emerald-500 hover:text-stone-950 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors relative"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>{lang === 'id' ? 'Pakan' : 'Feed'}</span>
                      {feedCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-stone-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                          {feedCount}
                        </span>
                      )}
                    </button>

                    {/* Photo Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTakePhoto(animal);
                      }}
                      title={lang === 'id' ? 'Buka Kamera Safari & Ambil Foto' : 'Take Safari Photo'}
                      className="py-2 px-2 rounded-xl bg-stone-800 hover:bg-sky-400 hover:text-stone-950 text-sky-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{lang === 'id' ? 'Kamera' : 'Photo'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
