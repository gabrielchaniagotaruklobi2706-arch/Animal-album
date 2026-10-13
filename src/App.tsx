import React, { useState, useEffect, useMemo } from 'react';
import { AlbumNavbar } from './components/AlbumNavbar';
import { AlbumHero } from './components/AlbumHero';
import { AlbumFilterBar } from './components/AlbumFilterBar';
import { AlbumPhotoCard } from './components/AlbumPhotoCard';
import { AlbumScrapbookView } from './components/AlbumScrapbookView';
import { AlbumLightboxModal } from './components/AlbumLightboxModal';
import { AddPhotoModal } from './components/AddPhotoModal';
import { AlbumFooter } from './components/AlbumFooter';
import { WildlifeMascot } from './components/WildlifeMascot';
import { ANIMALS } from './data/animals';
import { Animal, Language, AlbumCategory, ViewMode } from './types';
import { soundManager } from './utils/audio';
import { Heart, Volume2, Camera, MapPin, Sparkles, Plus, Image as ImageIcon, BookOpen } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('id');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'scrapbook' | 'favorites'>('gallery');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<AlbumCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal and Lightbox States
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState<boolean>(false);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState<boolean>(false);

  // Favorites persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('album_animal_favorites');
      return saved ? JSON.parse(saved) : ['arctic_wolf', 'orangutan', 'lion'];
    } catch {
      return ['arctic_wolf', 'orangutan', 'lion'];
    }
  });

  // User uploaded custom photos persistence
  const [userPhotos, setUserPhotos] = useState<Animal[]>(() => {
    try {
      const saved = localStorage.getItem('custom_wildlife_photos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('album_animal_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Save custom photos
  useEffect(() => {
    try {
      localStorage.setItem('custom_wildlife_photos', JSON.stringify(userPhotos));
    } catch {}
  }, [userPhotos]);

  // Combine default and user photos
  const allAnimals: Animal[] = useMemo(() => {
    return [...ANIMALS, ...userPhotos];
  }, [userPhotos]);

  // Toggle favorite
  const handleToggleFavorite = (animalId: string) => {
    setFavorites((prev) => {
      if (prev.includes(animalId)) {
        return prev.filter((id) => id !== animalId);
      } else {
        return [...prev, animalId];
      }
    });
  };

  // Toggle Language
  const handleToggleLang = () => {
    soundManager.playClick();
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  // Toggle Audio
  const handleToggleAudio = () => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      soundManager.startAmbient();
    }
  };

  // Add new photo from user
  const handleAddAnimal = (newAnimal: Animal) => {
    setUserPhotos((prev) => [newAnimal, ...prev]);
    setSelectedAnimal(newAnimal);
  };

  // Filter animals based on active conditions
  const filteredAnimals = useMemo(() => {
    return allAnimals.filter((animal) => {
      // If Favorites tab is active, must be in favorites
      if (activeTab === 'favorites' && !favorites.includes(animal.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && animal.zoneId !== selectedCategory) {
        return false;
      }

      // IUCN Status filter
      if (selectedStatus !== 'all' && animal.status !== selectedStatus) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchNameId = animal.name.id.toLowerCase().includes(q);
        const matchNameEn = animal.name.en.toLowerCase().includes(q);
        const matchScientific = animal.scientificName.toLowerCase().includes(q);
        const matchPhotographer = animal.photographer?.toLowerCase().includes(q) || false;
        const matchLocation =
          animal.photoLocation?.id.toLowerCase().includes(q) ||
          animal.photoLocation?.en.toLowerCase().includes(q) ||
          animal.origin.id.toLowerCase().includes(q) ||
          false;
        const matchHabitat =
          animal.habitat.id.toLowerCase().includes(q) ||
          animal.habitat.en.toLowerCase().includes(q);

        if (!matchNameId && !matchNameEn && !matchScientific && !matchPhotographer && !matchLocation && !matchHabitat) {
          return false;
        }
      }

      return true;
    });
  }, [allAnimals, activeTab, favorites, selectedCategory, selectedStatus, searchQuery]);

  // Start slideshow handler
  const handleStartSlideshow = () => {
    soundManager.playClick();
    if (filteredAnimals.length > 0) {
      setSelectedAnimal(filteredAnimals[0]);
      setIsSlideshowActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-950 flex flex-col">
      {/* Sticky Top Navigation */}
      <AlbumNavbar
        lang={lang}
        onToggleLang={handleToggleLang}
        isMuted={isMuted}
        onToggleAudio={handleToggleAudio}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        favoriteCount={favorites.length}
        totalPhotos={allAnimals.length}
        onOpenAddPhoto={() => setIsAddPhotoOpen(true)}
      />

      {/* Hero Showcase (displayed in gallery & scrapbook view) */}
      {activeTab !== 'favorites' && (
        <AlbumHero
          lang={lang}
          onExploreGallery={() => {
            document.getElementById('album-content')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onStartSlideshow={handleStartSlideshow}
          totalPhotos={allAnimals.length}
        />
      )}

      {/* Filter & Controls Bar */}
      <div id="album-content">
        <AlbumFilterBar
          lang={lang}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onStartSlideshow={handleStartSlideshow}
          matchCount={filteredAnimals.length}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* If viewing Favorites and list is empty */}
        {activeTab === 'favorites' && filteredAnimals.length === 0 && (
          <div className="text-center py-20 px-4 bg-stone-900/40 rounded-3xl border border-stone-800/80 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white font-['Outfit',sans-serif] mb-2">
              {lang === 'id' ? 'Album Favorit Masih Kosong' : 'Your Favorites Album is Empty'}
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto mb-6">
              {lang === 'id'
                ? 'Klik ikon hati ❤️ pada foto satwa liar yang Anda sukai untuk mengumpulkannya di sini.'
                : 'Click the heart icon ❤️ on any wildlife photograph to curate your personal collection here.'}
            </p>
            <button
              onClick={() => setActiveTab('gallery')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold rounded-xl shadow-lg transition-colors"
            >
              {lang === 'id' ? 'Jelajahi Galeri Foto' : 'Explore Photo Gallery'}
            </button>
          </div>
        )}

        {/* If search/filter produces no results */}
        {filteredAnimals.length === 0 && activeTab !== 'favorites' && (
          <div className="text-center py-20 px-4 bg-stone-900/40 rounded-3xl border border-stone-800/80 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white font-['Outfit',sans-serif] mb-2">
              {lang === 'id' ? 'Tidak Ditemukan Foto Satwa' : 'No Wildlife Photos Found'}
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto mb-6">
              {lang === 'id'
                ? 'Coba sesuaikan kata kunci pencarian atau ubah filter kategori habitat.'
                : 'Try adjusting your search query or changing the habitat biome filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 text-xs font-bold rounded-xl transition-colors"
            >
              {lang === 'id' ? 'Reset Semua Filter' : 'Reset All Filters'}
            </button>
          </div>
        )}

        {/* 1. Scrapbook / Polaroid Mode */}
        {(activeTab === 'scrapbook' || viewMode === 'polaroid') && filteredAnimals.length > 0 && (
          <AlbumScrapbookView
            animals={filteredAnimals}
            lang={lang}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectPhoto={(animal) => setSelectedAnimal(animal)}
          />
        )}

        {/* 2. Standard Grid Gallery Mode */}
        {activeTab !== 'scrapbook' && viewMode === 'grid' && filteredAnimals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredAnimals.map((animal) => (
              <AlbumPhotoCard
                key={animal.id}
                animal={animal}
                lang={lang}
                isFavorite={favorites.includes(animal.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelectPhoto={(a) => setSelectedAnimal(a)}
              />
            ))}
          </div>
        )}

        {/* 3. Compact List Mode */}
        {activeTab !== 'scrapbook' && viewMode === 'compact' && filteredAnimals.length > 0 && (
          <div className="space-y-3">
            {filteredAnimals.map((animal) => {
              const isFav = favorites.includes(animal.id);
              return (
                <div
                  key={animal.id}
                  onClick={() => setSelectedAnimal(animal)}
                  className="bg-stone-900/80 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/50 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 transition-all cursor-pointer group shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={animal.imageUrl}
                      alt={animal.name[lang]}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=85';
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors truncate">
                          {animal.name[lang]} {animal.emoji}
                        </h4>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
                          {animal.status}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400/80 font-mono italic truncate">
                        {animal.scientificName}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1 truncate">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-500" />
                          <span className="truncate">
                            {animal.photoLocation ? animal.photoLocation[lang] : animal.origin[lang]}
                          </span>
                        </span>
                        <span className="hidden md:inline text-stone-500">•</span>
                        <span className="hidden md:inline text-stone-400">
                          📷 {animal.photographer || 'Wildlife Explorer'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions on Compact Item */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playAnimalSound(animal.soundType);
                      }}
                      className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 transition-colors"
                      title={lang === 'id' ? 'Dengar Suara' : 'Listen Sound'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playClick();
                        handleToggleFavorite(animal.id);
                      }}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        isFav
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-rose-400'
                      }`}
                      title={isFav ? 'Favorit' : 'Tambah Favorit'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Lightbox / Slideshow Fullscreen Modal */}
      {selectedAnimal && (
        <AlbumLightboxModal
          animal={selectedAnimal}
          animals={filteredAnimals.length > 0 ? filteredAnimals : allAnimals}
          lang={lang}
          isFavorite={favorites.includes(selectedAnimal.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => {
            setSelectedAnimal(null);
            setIsSlideshowActive(false);
          }}
          onSelectAnimal={(a) => setSelectedAnimal(a)}
          autoSlideshow={isSlideshowActive}
        />
      )}

      {/* Add Custom Wildlife Photo Modal */}
      {isAddPhotoOpen && (
        <AddPhotoModal
          lang={lang}
          onClose={() => setIsAddPhotoOpen(false)}
          onAddAnimal={handleAddAnimal}
        />
      )}

      {/* Interactive Wildlife Mascot Rimbo */}
      <WildlifeMascot
        lang={lang}
        selectedAnimal={selectedAnimal}
        totalPhotos={allAnimals.length}
      />

      {/* Album Footer */}
      <AlbumFooter lang={lang} totalPhotos={allAnimals.length} />
    </div>
  );
}

