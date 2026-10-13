import React, { useState } from 'react';
import { X, Camera, ZoomIn, Check, Sparkles, RefreshCw } from 'lucide-react';
import { Animal, Language, PassportPhoto } from '../types';
import { soundManager } from '../utils/audio';

interface SafariCameraModalProps {
  animal: Animal | null;
  animals: Animal[];
  onClose: () => void;
  onPhotoSaved: (photo: PassportPhoto) => void;
  lang: Language;
}

export const SafariCameraModal: React.FC<SafariCameraModalProps> = ({
  animal: initialAnimal,
  animals,
  onClose,
  onPhotoSaved,
  lang,
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>(initialAnimal || animals[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFlashing, setIsFlashing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PassportPhoto | null>(null);

  const handleCapture = () => {
    soundManager.playCameraShutter();
    setIsFlashing(true);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newPhoto: PassportPhoto = {
      id: `photo-${Date.now()}`,
      animalId: selectedAnimal.id,
      animalName: selectedAnimal.name[lang],
      emoji: selectedAnimal.emoji,
      date: dateFormatted,
      imageUrl: selectedAnimal.imageUrl,
      caption:
        lang === 'id'
          ? `Momen safari bersama ${selectedAnimal.name.id} di Zoo Adventure.`
          : `Safari encounter with ${selectedAnimal.name.en} at Zoo Adventure.`,
    };

    setTimeout(() => {
      setIsFlashing(false);
      setCapturedPhoto(newPhoto);
      soundManager.playSuccessChime();
      onPhotoSaved(newPhoto);
    }, 450);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/50">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>{lang === 'id' ? 'Kamera Telefoto Safari' : 'Safari Telephoto Viewfinder'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder or Captured Polaroid View */}
        <div className="p-6">
          {!capturedPhoto ? (
            <div>
              {/* Target Animal Selector */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <label className="text-xs font-semibold text-stone-400 whitespace-nowrap">
                  {lang === 'id' ? 'Fokus Sasaran Satwa:' : 'Target Wildlife:'}
                </label>
                <select
                  value={selectedAnimal.id}
                  onChange={(e) => {
                    const found = animals.find((a) => a.id === e.target.value);
                    if (found) setSelectedAnimal(found);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-200 text-xs font-bold focus:outline-none focus:border-amber-400"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.emoji} {a.name[lang]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Viewfinder Screen */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-950 border-2 border-stone-700 select-none shadow-inner">
                {/* Animal Image with dynamic zoom */}
                <img
                  src={selectedAnimal.imageUrl}
                  alt={selectedAnimal.name[lang]}
                  referrerPolicy="no-referrer"
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="w-full h-full object-cover transition-transform duration-300"
                />

                {/* Viewfinder Overlays (Camera HUD) */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  {/* Top HUD: Battery, REC, Tele-distance */}
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-300 drop-shadow">
                    <span className="flex items-center gap-1.5 bg-stone-950/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      REC 4K
                    </span>
                    <span className="bg-stone-950/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      ISO 400 • F/2.8 • 1/1000s
                    </span>
                  </div>

                  {/* Center Target Bracket & Crosshairs */}
                  <div className="self-center flex flex-col items-center">
                    <div className="w-20 h-20 border border-amber-400/80 rounded-lg relative flex items-center justify-center">
                      <div className="w-2 h-2 bg-amber-400/90 rounded-full animate-pulse"></div>
                      <span className="absolute -top-3 text-[9px] font-mono text-amber-400 bg-stone-950/70 px-1 rounded">
                        AF-LOCK
                      </span>
                    </div>
                  </div>

                  {/* Bottom HUD: Animal Tag */}
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-stone-200">
                    <span className="bg-stone-950/70 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1.5">
                      <span>{selectedAnimal.emoji}</span>
                      <span>{selectedAnimal.name[lang]}</span>
                    </span>
                    <span className="bg-stone-950/70 px-2 py-0.5 rounded backdrop-blur-sm text-amber-300">
                      {zoomLevel}x OPTICAL
                    </span>
                  </div>
                </div>

                {/* Shutter White Flash effect */}
                {isFlashing && (
                  <div className="absolute inset-0 bg-white pointer-events-none z-30 animate-fade-out" />
                )}
              </div>

              {/* Controls: Zoom slider & Big Shutter Button */}
              <div className="mt-6 flex items-center justify-between gap-4">
                {/* Zoom Selector */}
                <div className="flex items-center gap-1.5 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
                  <ZoomIn className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-xs text-stone-400 mr-1">{lang === 'id' ? 'Lensa:' : 'Lens:'}</span>
                  {[1, 1.5, 2].map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoomLevel(z)}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                        zoomLevel === z ? 'bg-amber-400 text-stone-950' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>

                {/* Shutter Button */}
                <button
                  id="camera-shutter-btn"
                  onClick={handleCapture}
                  disabled={isFlashing}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-red-900/40 transition-all cursor-pointer ring-4 ring-red-600/30"
                >
                  <Camera className="w-4 h-4" />
                  <span>{lang === 'id' ? 'Jepret Foto Satwa' : 'Snap Photo'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Resulting Souvenir Polaroid Card */
            <div className="text-center animate-fade-in py-2">
              <div className="inline-block p-4 pb-6 bg-stone-100 text-stone-900 rounded-2xl shadow-2xl max-w-sm mx-auto border-4 border-white transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-stone-900 mb-3 shadow-inner relative">
                  <img
                    src={capturedPhoto.imageUrl}
                    alt={capturedPhoto.animalName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Golden stamp watermark */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[9px] uppercase tracking-wider shadow">
                    ★ Zoo Adventure
                  </div>
                </div>

                <div className="text-left px-1">
                  <div className="font-['Outfit',sans-serif] font-extrabold text-lg text-stone-950 flex items-center justify-between">
                    <span>{capturedPhoto.animalName}</span>
                    <span className="text-2xl">{capturedPhoto.emoji}</span>
                  </div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">{capturedPhoto.date}</div>
                  <p className="text-xs text-stone-700 italic mt-2 font-serif">
                    "{capturedPhoto.caption}"
                  </p>
                </div>
              </div>

              {/* Success Notification */}
              <div className="mt-5 flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold">
                <Check className="w-4 h-4" />
                <span>
                  {lang === 'id'
                    ? 'Foto berhasil dicap ke Paspor Safari Anda!'
                    : 'Photo stamped into your Safari Passport!'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Foto Satwa Lain' : 'Take Another'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold shadow-lg transition-colors"
                >
                  {lang === 'id' ? 'Lihat Paspor Saya' : 'Open Passport'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
