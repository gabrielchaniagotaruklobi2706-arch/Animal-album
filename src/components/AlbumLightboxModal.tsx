import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Volume2,
  Camera,
  MapPin,
  Download,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Shield,
  Utensils,
  Gauge,
  Clock,
  Zap,
  ImageIcon,
  FileText,
} from 'lucide-react';
import { Animal, Language } from '../types';
import { soundManager } from '../utils/audio';

interface AlbumLightboxModalProps {
  animal: Animal | null;
  animals: Animal[];
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectAnimal: (animal: Animal) => void;
  autoSlideshow?: boolean;
}

export const AlbumLightboxModal: React.FC<AlbumLightboxModalProps> = ({
  animal,
  animals,
  lang,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectAnimal,
  autoSlideshow = false,
}) => {
  if (!animal) return null;

  const currentIndex = animals.findIndex((a) => a.id === animal.id);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(autoSlideshow);
  const [progress, setProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'camera' | 'facts'>('info');
  const [mobileView, setMobileView] = useState<'photo' | 'details'>('photo');
  const [imgSrc, setImgSrc] = useState(animal.imageUrl);

  // Update image source when animal changes
  useEffect(() => {
    setImgSrc(animal.imageUrl);
    setIsZoomed(false);
  }, [animal]);

  const progressIntervalRef = useRef<number | null>(null);
  const SLIDE_DURATION = 5000;

  const handlePrev = () => {
    soundManager.playClick();
    const prevIdx = (currentIndex - 1 + animals.length) % animals.length;
    onSelectAnimal(animals[prevIdx]);
    setProgress(0);
  };

  const handleNext = () => {
    soundManager.playClick();
    const nextIdx = (currentIndex + 1) % animals.length;
    onSelectAnimal(animals[nextIdx]);
    setProgress(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlayingSlideshow((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, animals]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlayingSlideshow) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(0);
      return;
    }

    const step = 50;
    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (step / SLIDE_DURATION) * 100;
      });
    }, step);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlayingSlideshow, currentIndex]);

  const handlePlayVoice = () => {
    setIsPlayingAudio(true);
    soundManager.playAnimalSound(animal.soundType);
    setTimeout(() => setIsPlayingAudio(false), 2200);
  };

  const handleDownload = () => {
    soundManager.playCameraShutter();
    const link = document.createElement('a');
    link.href = animal.imageUrl;
    link.target = '_blank';
    link.download = `${animal.id}_wildlife.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CR':
        return { bg: 'bg-red-500/20 text-red-400 border-red-500/40', text: 'Critically Endangered (Kritis)' };
      case 'EN':
        return { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', text: 'Endangered (Terancam)' };
      case 'VU':
        return { bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', text: 'Vulnerable (Rentan)' };
      case 'NT':
        return { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/40', text: 'Near Threatened (Hampir Terancam)' };
      default:
        return { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', text: 'Least Concern (Risiko Rendah)' };
    }
  };

  const statusInfo = getStatusBadge(animal.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-fade-in">
      {/* Top Header Bar */}
      <div className="px-3 py-2.5 sm:px-6 sm:py-3.5 flex items-center justify-between border-b border-stone-850 bg-stone-950/90 z-20 gap-2">
        {/* Left: Counter & Species Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="font-mono text-xs font-bold text-amber-400 bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800 flex-shrink-0">
            {currentIndex + 1} / {animals.length}
          </span>
          <div className="min-w-0">
            <h2 className="text-white font-extrabold text-sm sm:text-base font-['Outfit',sans-serif] truncate">
              {animal.name[lang]} {animal.emoji}
            </h2>
            <p className="text-[11px] text-stone-400 italic font-mono hidden sm:block truncate">
              {animal.scientificName}
            </p>
          </div>
        </div>

        {/* Center: Mobile Segmented Control (Photo vs Details) */}
        <div className="lg:hidden flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5">
          <button
            onClick={() => setMobileView('photo')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mobileView === 'photo'
                ? 'bg-amber-400 text-stone-950 font-extrabold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Foto</span>
          </button>
          <button
            onClick={() => setMobileView('details')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mobileView === 'details'
                ? 'bg-amber-400 text-stone-950 font-extrabold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Info</span>
          </button>
        </div>

        {/* Desktop Slideshow Control */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              isPlayingSlideshow
                ? 'bg-amber-400 text-stone-950 font-black'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
            }`}
          >
            {isPlayingSlideshow ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>
              {isPlayingSlideshow
                ? lang === 'id' ? 'Jeda Slideshow' : 'Pause Slideshow'
                : lang === 'id' ? 'Putar Slideshow' : 'Auto Slideshow'}
            </span>
          </button>
        </div>

        {/* Right Tools: Favorite, Download, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite(animal.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isFavorite
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-rose-400'
            }`}
            title={isFavorite ? 'Hapus dari favorit' : 'Simpan favorit'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 transition-colors"
            title="Download Foto"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-colors ml-1"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slideshow Progress Bar */}
      {isPlayingSlideshow && (
        <div className="w-full bg-stone-900 h-1 z-30">
          <div
            className="bg-amber-400 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main Center Area: Photo Viewer + Side Dossier */}
      <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
        {/* Previous Navigation Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-stone-950/80 hover:bg-amber-400 hover:text-stone-950 text-white border border-white/10 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95"
          title="Previous Photo (←)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Navigation Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 lg:right-[380px] xl:right-[420px] top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-stone-950/80 hover:bg-amber-400 hover:text-stone-950 text-white border border-white/10 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95"
          title="Next Photo (→)"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* High-Resolution Photo Display */}
        <div
          className={`flex-1 relative bg-black flex items-center justify-center p-3 sm:p-6 overflow-hidden ${
            mobileView === 'details' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div
            className={`relative max-w-full max-h-full transition-transform duration-300 ${
              isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={imgSrc}
              alt={animal.name[lang]}
              onError={() => {
                setImgSrc('https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=85');
              }}
              className="max-w-full max-h-[75vh] lg:max-h-[84vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10 select-none"
            />
          </div>

          {/* Zoom toggle floating icon */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-white/10 backdrop-blur-md shadow-lg transition-colors"
            title={isZoomed ? 'Perkecil tampilan' : 'Perbesar foto'}
          >
            {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Species Dossier & Photography Specs Drawer / Sidebar */}
        <div
          className={`w-full lg:w-96 xl:w-[420px] bg-stone-950 border-t lg:border-t-0 lg:border-l border-stone-850 flex-col justify-between overflow-y-auto scrollbar-thin ${
            mobileView === 'photo' ? 'hidden lg:flex' : 'flex flex-1 lg:flex-none'
          }`}
        >
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Title & Scientific Name */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-3xl">{animal.emoji}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusInfo.bg}`}
                >
                  {statusInfo.text}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] mt-2">
                {animal.name[lang]}
              </h3>
              <p className="text-xs sm:text-sm font-mono italic text-amber-400/90">{animal.scientificName}</p>
            </div>

            {/* Audio Voice Player Callout with Realistic Synthesizer */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-stone-100">
                    {lang === 'id' ? 'Suara Satwa Asli' : 'Authentic Animal Call'}
                  </p>
                  {isPlayingAudio && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-stone-950 uppercase animate-pulse">
                      Playing
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {lang === 'id' ? 'Akustik alami rekaman vokal habitat asli' : 'Natural acoustic vocalization model'}
                </p>
              </div>

              <button
                onClick={handlePlayVoice}
                className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-stone-950 scale-105 shadow-lg shadow-amber-400/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                }`}
                title={lang === 'id' ? 'Dengarkan suara asli satwa' : 'Play authentic animal sound'}
              >
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </button>
            </div>

            {/* Sub Tabs: Profil Satwa (Info) | Info Fotografi (Camera) | Fakta Unik (Facts) */}
            <div className="flex items-center border-b border-stone-800 pb-2 gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-1 transition-colors ${
                  activeTab === 'info'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {lang === 'id' ? 'Profil Satwa' : 'Species Profile'}
              </button>
              <button
                onClick={() => setActiveTab('camera')}
                className={`pb-1 transition-colors ${
                  activeTab === 'camera'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {lang === 'id' ? 'Info Fotografi' : 'Camera Specs'}
              </button>
              <button
                onClick={() => setActiveTab('facts')}
                className={`pb-1 transition-colors ${
                  activeTab === 'facts'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {lang === 'id' ? 'Fakta Unik' : 'Fun Facts'}
              </button>
            </div>

            {/* Tab 1: Info & Habitat */}
            {activeTab === 'info' && (
              <div className="space-y-4 text-xs text-stone-300 animate-fade-in">
                <p className="leading-relaxed text-xs sm:text-sm text-stone-200">{animal.description[lang]}</p>

                {/* Biological stats grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80">
                    <div className="flex items-center gap-1 text-stone-400 mb-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'id' ? 'Rentang Hidup' : 'Lifespan'}</span>
                    </div>
                    <div className="font-bold text-stone-100">{animal.lifespan}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80">
                    <div className="flex items-center gap-1 text-stone-400 mb-0.5">
                      <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'id' ? 'Bobot Dewasa' : 'Adult Weight'}</span>
                    </div>
                    <div className="font-bold text-stone-100">{animal.weight}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80">
                    <div className="flex items-center gap-1 text-stone-400 mb-0.5">
                      <Zap className="w-3.5 h-3.5 text-teal-400" />
                      <span>{lang === 'id' ? 'Kecepatan' : 'Max Speed'}</span>
                    </div>
                    <div className="font-bold text-stone-100">{animal.speed}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80">
                    <div className="flex items-center gap-1 text-stone-400 mb-0.5">
                      <Utensils className="w-3.5 h-3.5 text-rose-400" />
                      <span>{lang === 'id' ? 'Makanan Utama' : 'Favorite Food'}</span>
                    </div>
                    <div className="font-bold text-stone-100 flex items-center gap-1">
                      <span>{animal.favoriteFood.icon}</span>
                      <span className="truncate">{animal.favoriteFood[lang]}</span>
                    </div>
                  </div>
                </div>

                {/* Habitat & Origin */}
                <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-stone-400">{lang === 'id' ? 'Habitat:' : 'Habitat:'}</span>
                    <span className="text-stone-200 font-semibold">{animal.habitat[lang]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-stone-400">{lang === 'id' ? 'Sebaran Asli:' : 'Native Origin:'}</span>
                    <span className="text-stone-200 font-semibold">{animal.origin[lang]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Photography & Camera Specs */}
            {activeTab === 'camera' && (
              <div className="space-y-4 text-xs animate-fade-in">
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Camera className="w-4 h-4" />
                    <span>{lang === 'id' ? 'Metadata Fotografi Alam' : 'Wildlife Shot Metadata'}</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-stone-300">
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">{lang === 'id' ? 'Fotografer' : 'Photographer'}</span>
                      <span className="font-bold text-white">{animal.photographer || 'Wildlife Explorer'}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">{lang === 'id' ? 'Lokasi Potret' : 'Location'}</span>
                      <span className="font-bold text-white text-right max-w-[65%]">
                        {animal.photoLocation ? animal.photoLocation[lang] : animal.origin[lang]}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">{lang === 'id' ? 'Tahun Dokumentasi' : 'Year'}</span>
                      <span className="font-mono text-amber-400">{animal.photoYear || '2024'}</span>
                    </div>

                    {animal.cameraDetails && (
                      <>
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Kamera</span>
                          <span className="font-mono text-stone-200">{animal.cameraDetails.camera}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-800">
                          <span className="text-stone-400">Lensa</span>
                          <span className="font-mono text-stone-200">{animal.cameraDetails.lens}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono">
                          <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                            <span className="block text-[9px] text-stone-500">SHUTTER</span>
                            <span className="text-amber-300 font-bold">{animal.cameraDetails.shutter}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                            <span className="block text-[9px] text-stone-500">APERTURE</span>
                            <span className="text-emerald-300 font-bold">{animal.cameraDetails.aperture}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                            <span className="block text-[9px] text-stone-500">ISO</span>
                            <span className="text-teal-300 font-bold">{animal.cameraDetails.iso}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Fun Facts */}
            {activeTab === 'facts' && (
              <div className="space-y-2.5 text-xs animate-fade-in">
                {animal.funFacts[lang].map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-stone-200 leading-relaxed">{fact}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Footer Note in Sidebar */}
          <div className="p-3 sm:p-4 border-t border-stone-800 bg-stone-900/40 text-center text-[10px] text-stone-500">
            {lang === 'id' ? 'Album Satwa Liar • Arsip Fotografi Alam' : 'Wildlife Album • Natural Photography Archive'}
          </div>
        </div>
      </div>
    </div>
  );
};
