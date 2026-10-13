import React, { useState } from 'react';
import { Compass, Thermometer, Footprints, Volume2, ArrowRight } from 'lucide-react';
import { ZooZone, Animal, Language } from '../types';
import { soundManager } from '../utils/audio';

interface ZooMapProps {
  zones: ZooZone[];
  animals: Animal[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  onSelectAnimal: (animal: Animal) => void;
  onFilterByZone: (zoneId: string) => void;
  lang: Language;
}

export const ZooMap: React.FC<ZooMapProps> = ({
  zones,
  animals,
  selectedZoneId,
  onSelectZone,
  onSelectAnimal,
  onFilterByZone,
  lang,
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const activeZone = zones.find((z) => z.id === (hoveredZone || selectedZoneId || 'sabana')) || zones[0];
  const activeZoneAnimals = animals.filter((a) => a.zoneId === activeZone.id);

  const handlePinClick = (animal: Animal) => {
    soundManager.playClick();
    soundManager.playAnimalSound(animal.soundType);
    onSelectZone(animal.zoneId);
  };

  return (
    <section id="map" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>{lang === 'id' ? 'Peta Interaktif Safari' : 'Interactive Safari Map'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
          {lang === 'id' ? 'Jelajahi 6 Zona Ekosistem Satwa' : 'Explore 6 Wildlife Ecosystem Zones'}
        </h2>
        <p className="text-stone-300 mt-3 text-base">
          {lang === 'id'
            ? 'Pilih titik lokasi pada peta satwa untuk mendengarkan suara khas, memeriksa suhu iklim habitat, dan melihat satwa penghuninya.'
            : 'Click waypoints on the safari map to hear characteristic animal sounds, check habitat climates, and inspect species.'}
        </p>
      </div>

      {/* Map + Detail Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Map Canvas Container */}
        <div className="lg:col-span-8 bg-stone-950 border border-stone-800 rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
          {/* Top Bar on Map */}
          <div className="flex items-center justify-between mb-4 border-b border-stone-800/80 pb-3 text-xs text-stone-400">
            <span className="flex items-center gap-1.5 font-bold text-amber-400">
              <Footprints className="w-4 h-4 text-emerald-400" />
              {lang === 'id' ? 'Jalur Eksplorasi Safari (Klik Pin Hewan)' : 'Safari Trail (Click Animal Pins)'}
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-full border border-stone-700 text-[11px]">
              Luas Area: 45 Hektar
            </span>
          </div>

          {/* Illustrated Terrain Background */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950/60 border border-emerald-900/40 select-none shadow-inner">
            {/* Soft biome regions */}
            <div className="absolute top-0 left-0 w-[45%] h-[55%] bg-amber-600/15 rounded-br-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-600/20 rounded-bl-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[45%] h-[55%] bg-cyan-600/20 rounded-tl-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-[25%] w-[45%] h-[45%] bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* SVG Safari Path connecting the zones */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-400/40" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>
              <path
                d="M 28% 35% Q 42% 20%, 55% 25% T 75% 18% T 78% 48% T 42% 75% T 18% 68% Z"
                fill="none"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                className="animate-[dash_20s_linear_infinite]"
              />
            </svg>

            {/* Zone Boundaries Labels */}
            {zones.map((zone) => {
              const isSelected = activeZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  style={{ left: `${zone.mapCoordinates.x}%`, top: `${zone.mapCoordinates.y}%` }}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectZone(zone.id);
                  }}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group`}
                >
                  {/* Glowing Radar Pulse if Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                  )}

                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold shadow-xl transition-all transform ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 border-amber-300 scale-110 ring-4 ring-amber-400/30'
                        : 'bg-stone-900/85 text-stone-200 border-stone-700 hover:border-amber-400/70 hover:scale-105'
                    }`}
                  >
                    <span className="text-base">{zone.emoji}</span>
                    <span className="hidden sm:inline font-['Outfit',sans-serif]">
                      {zone.name[lang]}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Animal specific pins on the map */}
            {animals.map((animal, idx) => {
              // Offset animal coordinates around zone center
              const zone = zones.find((z) => z.id === animal.zoneId);
              if (!zone) return null;
              const angle = (idx * 1.8) + (animal.name.en.length * 0.7);
              const radius = 9 + (idx % 3) * 3;
              const posX = Math.max(8, Math.min(92, zone.mapCoordinates.x + Math.cos(angle) * radius));
              const posY = Math.max(12, Math.min(88, zone.mapCoordinates.y + Math.sin(angle) * radius * 0.7));

              return (
                <button
                  key={animal.id}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  onClick={() => handlePinClick(animal)}
                  title={`${animal.name[lang]} (${animal.scientificName})`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-stone-900/90 border border-stone-700 hover:border-amber-400 hover:bg-stone-800 text-xl shadow-lg transition-transform hover:scale-130 active:scale-95 group"
                >
                  <span className="block transform group-hover:scale-110 transition-transform">
                    {animal.emoji}
                  </span>
                  {/* Tooltip on hover */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-stone-950 text-amber-300 text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-amber-500/30 shadow-lg">
                    {animal.name[lang]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 pt-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                {lang === 'id' ? 'Zona Terpilih' : 'Selected Zone'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                {lang === 'id' ? 'Titik Satwa' : 'Species Waypoint'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 border-b-2 border-dashed border-amber-400/80"></span>
                {lang === 'id' ? 'Jalur Pejalan Kaki' : 'Walking Safari Path'}
              </span>
            </div>
            <span className="text-[11px] text-stone-500">
              {lang === 'id' ? 'Sentuh pin untuk mendengar suara satwa' : 'Tap pin to hear animal voice'}
            </span>
          </div>
        </div>

        {/* Zone Detail Sidebar Card */}
        <div className="lg:col-span-4 bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl p-3 bg-stone-800 rounded-2xl border border-stone-700">
              {activeZone.emoji}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
              <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
              {activeZone.temperature}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            {activeZone.name[lang]}
          </h3>
          <p className="text-amber-400 text-xs font-semibold tracking-wide uppercase mt-1">
            {activeZone.tagline[lang]}
          </p>

          <p className="text-stone-300 text-sm mt-3 leading-relaxed">
            {activeZone.description[lang]}
          </p>

          {/* Animals in this zone */}
          <div className="mt-6 pt-5 border-t border-stone-800">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              {lang === 'id' ? 'Satwa di Zona Ini' : 'Animals In This Habitat'} ({activeZoneAnimals.length})
            </h4>

            <div className="space-y-2.5">
              {activeZoneAnimals.map((animal) => (
                <div
                  key={animal.id}
                  onClick={() => {
                    soundManager.playAnimalSound(animal.soundType);
                    onSelectAnimal(animal);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-750 border border-stone-700/60 hover:border-amber-400/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{animal.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                        {animal.name[lang]}
                      </div>
                      <div className="text-[11px] text-stone-400 italic">
                        {animal.scientificName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playAnimalSound(animal.soundType);
                      }}
                      title="Putar Suara"
                      className="p-1.5 rounded-lg bg-stone-700 text-amber-400 hover:bg-amber-400 hover:text-stone-950 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explore all button for this zone */}
          <button
            onClick={() => onFilterByZone(activeZone.id)}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-amber-300 font-bold text-xs border border-stone-700 flex items-center justify-center gap-2 transition-colors"
          >
            <span>{lang === 'id' ? 'Buka Koleksi Lengkap Zona Ini' : 'View Full Habitat Catalog'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
