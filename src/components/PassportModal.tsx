import React, { useState } from 'react';
import { X, Award, Camera, CheckCircle2, Sparkles, User, ShieldCheck } from 'lucide-react';
import { Animal, Language, PassportPhoto } from '../types';
import { soundManager } from '../utils/audio';

interface PassportModalProps {
  animals: Animal[];
  stampedAnimalIds: string[];
  photos: PassportPhoto[];
  onClose: () => void;
  lang: Language;
}

export const PassportModal: React.FC<PassportModalProps> = ({
  animals,
  stampedAnimalIds,
  photos,
  onClose,
  lang,
}) => {
  const [visitorName, setVisitorName] = useState<string>('Petualang Safari');
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeTab, setActiveTab] = useState<'stamps' | 'photos' | 'badges'>('stamps');

  const stampCount = stampedAnimalIds.length;
  const totalCount = animals.length;
  const progressPercent = Math.round((stampCount / totalCount) * 100);

  // Determine Rank
  let rankTitle = lang === 'id' ? 'Penjelajah Pemula' : 'Novice Explorer';
  let rankBadge = '🥉';
  if (stampCount >= 10) {
    rankTitle = lang === 'id' ? 'Master Zoologis Kehormatan' : 'Master Zoologist';
    rankBadge = '🏆';
  } else if (stampCount >= 6) {
    rankTitle = lang === 'id' ? 'Penjaga Rimba Senior' : 'Senior Ranger';
    rankBadge = '🥇';
  } else if (stampCount >= 3) {
    rankTitle = lang === 'id' ? 'Pengamat Satwa Liar' : 'Wildlife Observer';
    rankBadge = '🥈';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Passport Header styled like a gold-embossed leather booklet */}
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-emerald-950 px-6 py-5 border-b border-amber-600/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-2xl font-extrabold shadow-lg">
              🦁
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black">
                REPUBLIK SAFARI • PASPOR RESMI
              </div>
              <h3 className="text-xl font-extrabold text-white font-['Outfit',sans-serif]">
                {lang === 'id' ? 'Paspor Petualang Satwa' : 'Wildlife Explorer Passport'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Identity Card strip */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
          {/* Traveler Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-stone-400 text-[10px] uppercase font-bold">
                {lang === 'id' ? 'Nama Penjelajah' : 'Explorer Name'}
              </div>
              {isEditingName ? (
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                  className="bg-stone-900 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400 text-xs focus:outline-none"
                />
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="font-bold text-white cursor-pointer hover:text-amber-300 transition-colors flex items-center gap-1"
                  title="Klik untuk ubah nama"
                >
                  <span>{visitorName}</span>
                  <span className="text-[10px] text-stone-500">✎</span>
                </div>
              )}
            </div>
          </div>

          {/* Explorer Rank */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{rankBadge}</span>
            <div>
              <div className="text-stone-400 text-[10px] uppercase font-bold">
                {lang === 'id' ? 'Tingkat Gelar' : 'Ranger Rank'}
              </div>
              <div className="font-extrabold text-amber-400">{rankTitle}</div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-300 mb-1">
              <span>{lang === 'id' ? 'Koleksi Cap Satwa' : 'Stamps Collected'}</span>
              <span className="text-emerald-400 font-mono">
                {stampCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-900 text-xs font-bold">
          <button
            onClick={() => setActiveTab('stamps')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'stamps'
                ? 'border-amber-400 text-amber-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{lang === 'id' ? 'Cap Satwa' : 'Stamps'} ({stampCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'photos'
                ? 'border-amber-400 text-amber-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{lang === 'id' ? 'Galeri Foto' : 'Photo Album'} ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'badges'
                ? 'border-amber-400 text-amber-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{lang === 'id' ? 'Lencana Prestasi' : 'Badges'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'stamps' && (
            <div>
              <p className="text-xs text-stone-400 mb-4">
                {lang === 'id'
                  ? 'Setiap satwa yang Anda jepret dengan kamera atau beri makan akan mendapatkan cap emas resmi di lembar paspor ini.'
                  : 'Every animal you photograph or feed earns an official golden seal in this passport book.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {animals.map((animal) => {
                  const isStamped = stampedAnimalIds.includes(animal.id);

                  return (
                    <div
                      key={animal.id}
                      onClick={() => {
                        if (isStamped) {
                          soundManager.playAnimalSound(animal.soundType);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                        isStamped
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 cursor-pointer hover:scale-105 shadow'
                          : 'bg-stone-950/40 border-stone-800 text-stone-600 opacity-60'
                      }`}
                    >
                      <div className="text-3xl mb-1 filter drop-shadow">
                        {isStamped ? animal.emoji : '❓'}
                      </div>
                      <div className="font-bold text-xs truncate w-full">
                        {isStamped ? animal.name[lang] : 'Belum Dijumpai'}
                      </div>
                      <div className="text-[10px] mt-1 font-mono uppercase font-bold text-amber-400">
                        {isStamped ? '✓ TERVERIFIKASI' : 'TERKUNCI'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              {photos.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs">
                  <Camera className="w-10 h-10 mx-auto mb-2 opacity-40 text-stone-400" />
                  <p>{lang === 'id' ? 'Belum ada foto safari yang diambil.' : 'No safari photos snapped yet.'}</p>
                  <p className="mt-1 text-stone-400">
                    {lang === 'id' ? 'Gunakan tombol kamera pada ensiklopedia satwa!' : 'Use the camera button in the animal encyclopedia!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="p-3 bg-stone-100 text-stone-900 rounded-xl shadow-lg border-2 border-white"
                    >
                      <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-stone-900 relative">
                        <img
                          src={photo.imageUrl}
                          alt={photo.animalName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-amber-400 text-stone-950 text-[9px] font-black">
                          {photo.date}
                        </div>
                      </div>
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{photo.animalName}</span>
                        <span>{photo.emoji}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 italic mt-1 font-serif">
                        "{photo.caption}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-3">
              {[
                {
                  id: 'b1',
                  title: lang === 'id' ? 'Langkah Pertama Penjelajah' : 'First Step Ranger',
                  desc: lang === 'id' ? 'Ambil foto atau cap satwa pertama Anda' : 'Capture your first animal stamp',
                  unlocked: stampCount >= 1,
                  emoji: '🌱',
                },
                {
                  id: 'b2',
                  title: lang === 'id' ? 'Penguasa Sabana' : 'Savanna Explorer',
                  desc: lang === 'id' ? 'Kumpulkan 3 cap satwa dari padang Sabana Afrika' : 'Collect 3 animals from the African Savanna',
                  unlocked: stampCount >= 3,
                  emoji: '🦁',
                },
                {
                  id: 'b3',
                  title: lang === 'id' ? 'Fotografer Liar Handal' : 'Wildlife Photo Pro',
                  desc: lang === 'id' ? 'Abadikan 5 satwa berbeda dalam album paspor' : 'Capture 5 different species in your album',
                  unlocked: photos.length >= 5,
                  emoji: '📸',
                },
                {
                  id: 'b4',
                  title: lang === 'id' ? 'Penjaga Bumi Sejati' : 'Earth Guardian',
                  desc: lang === 'id' ? 'Kumpulkan semua 12 cap satwa di Zoo Adventure' : 'Collect all 12 animal stamps across all habitats',
                  unlocked: stampCount >= 12,
                  emoji: '👑',
                },
              ].map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    badge.unlocked
                      ? 'bg-stone-850 border-amber-500/50 text-white'
                      : 'bg-stone-950/40 border-stone-800 text-stone-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-stone-900 border border-stone-800">
                      {badge.emoji}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-stone-100">{badge.title}</div>
                      <div className="text-xs text-stone-400">{badge.desc}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      badge.unlocked
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {badge.unlocked ? (lang === 'id' ? 'Tercapai ★' : 'Unlocked ★') : (lang === 'id' ? 'Terkunci' : 'Locked')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
