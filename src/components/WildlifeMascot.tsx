import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, X, ChevronDown, ChevronUp, Lightbulb, Volume2, Trophy, HelpCircle, Check, Compass } from 'lucide-react';
import { Language, Animal } from '../types';
import { soundManager } from '../utils/audio';

interface WildlifeMascotProps {
  lang: Language;
  selectedAnimal?: Animal | null;
  totalPhotos: number;
}

export const WildlifeMascot: React.FC<WildlifeMascotProps> = ({
  lang,
  selectedAnimal,
  totalPhotos,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState<string>('');
  const [speechCategory, setSpeechCategory] = useState<'intro' | 'reaction' | 'trivia' | 'quiz'>('intro');
  const [quizState, setQuizState] = useState<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    answered: number | null;
  } | null>(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  // List of fun trivia facts for Rimbo to share
  const TRIVIA_LIST = [
    {
      id: 'Tahukah kamu? Sidik jari koala sangat mirip dengan sidik jari manusia sampai-sampai pernah membingungkan tim forensik!',
      en: 'Did you know? Koala fingerprints are so identical to human fingerprints that they have baffled crime scene investigators!',
    },
    {
      id: 'Serigala arktik bisa bertahan hidup di suhu minus 53°C tanpa membeku berkat lapisan bulu ganda kedap angin.',
      en: 'Arctic wolves can survive in bone-chilling cold of -53°C thanks to a dense windproof double coat.',
    },
    {
      id: 'Orangutan Kalimantan membuat sarang tidur baru dari ranting di puncak kanopi pohon setiap sore!',
      en: 'Bornean Orangutans construct a fresh, comfortable sleeping nest in the tree canopy every single evening.',
    },
    {
      id: 'Mata elang memiliki penglihatan 8 kali lebih tajam dari manusia dan bisa melihat tupai dari ketinggian 1.000 meter.',
      en: 'An eagle has eyesight 8 times sharper than humans and can spot a small rodent from over 1,000 meters away.',
    },
    {
      id: 'Jantung paus bungkuk seukuran mobil mini dan detakannya bisa terdeteksi dari jarak jauh di dalam air!',
      en: 'A humpback whale\'s heart is the size of a compact car, beating slowly during epic ocean dives.',
    },
    {
      id: 'Rubah merah menggunakan medan magnet bumi sebagai panduan alami saat melompat menembus salju tebal.',
      en: 'Red foxes use Earth\'s magnetic field like a natural compass when pouncing through deep snowdrifts.',
    },
  ];

  // Quick animal mini quizzes
  const QUIZ_LIST = [
    {
      question: {
        id: 'Satwa manakah yang mampu melolong untuk memanggil kawanannya sejauh berkilo-kilometer?',
        en: 'Which animal howls to rally its pack mates across vast wilderness?',
      },
      options: {
        id: ['Serigala Arktik', 'Jerapah', 'Penyu Hijau'],
        en: ['Arctic Wolf', 'Giraffe', 'Green Sea Turtle'],
      },
      correctIndex: 0,
      explanation: {
        id: 'Tepat sekali! Lolongan serigala berfungsi sebagai mercusuar akustik penanda teritori dan panggilan kawanan.',
        en: 'Correct! A wolf\'s howl acts as an acoustic lighthouse to declare territory and rally the pack.',
      },
    },
    {
      question: {
        id: 'Hewan darat apakah yang memiliki akselerasi sprint tercepat di bumi (0-100 km/jam dalam 3 detik)?',
        en: 'Which land mammal has the fastest sprint acceleration on Earth (0-60 mph in 3 seconds)?',
      },
      options: {
        id: ['Gajah', 'Cheetah', 'Singa'],
        en: ['Elephant', 'Cheetah', 'Lion'],
      },
      correctIndex: 1,
      explanation: {
        id: 'Hebat! Cheetah memiliki tulang belakang fleksibel dan ekor kemudi aerodinamis untuk bermanuver kilat.',
        en: 'Awesome! Cheetahs have a flexible spine and an aerodynamic rudder tail for lightning maneuvers.',
      },
    },
    {
      question: {
        id: 'Kera besar tercerdas Asia yang menghabiskan 90% waktunya di atas puncak kanopi pohon adalah...',
        en: 'Asia\'s smartest great ape spending 90% of its life high in treetop canopies is...',
      },
      options: {
        id: ['Panda', 'Orangutan Kalimantan', 'Penguin'],
        en: ['Panda', 'Bornean Orangutan', 'Penguin'],
      },
      correctIndex: 1,
      explanation: {
        id: 'Benar sekali! Orangutan memiliki rentang tangan lebih dari 2 meter untuk bergelantungan bebas.',
        en: 'Spot on! Bornean Orangutans have an arm span exceeding 2 meters to swing through canopies.',
      },
    },
  ];

  // Default welcome speech
  useEffect(() => {
    setActiveSpeech(
      lang === 'id'
        ? 'Halo sahabat alam! Aku Rimbo, maskot penjelajah album satwa kamu! Klik aku untuk fakta unik & kuis seru ya! 🐾'
        : 'Hello wildlife explorer! I am Rimbo, your photo album ranger companion! Tap me for trivia & fun quizzes! 🐾'
    );
  }, [lang]);

  // Mascot reacts automatically when user plays an animal sound
  useEffect(() => {
    const removeListener = soundManager.addListener((soundType, isPlaying) => {
      if (!isPlaying) return;

      setIsWaving(true);
      setHasNewMessage(true);

      const reactions: Record<string, { id: string; en: string }> = {
        lion: {
          id: 'Auman Singa yang megah! Gemuruhnya bisa menggetarkan sabana hingga 8 km lho!',
          en: 'A mighty Lion\'s roar! Its thunderous call can rumble across 8 km of open savanna!',
        },
        tiger: {
          id: 'Suara Harimau yang berwibawa! Berbeda dengan kucing biasa, harimau sangat suka berenang!',
          en: 'An authoritative Tiger growl! Unlike common cats, tigers are passionate swimmers!',
        },
        wolf: {
          id: 'Lolongan Serigala Arktik yang memukau! Itu panggilan cinta untuk kawanannya di salju!',
          en: 'The haunting howl of the Arctic Wolf! An acoustic song calling the pack through snow!',
        },
        elephant: {
          id: 'Lengkingan belalai gajah yang menggelegar! Belalainya punya 40.000 otot kuat!',
          en: 'A booming Elephant trumpet! Their magnificent trunk packs over 40,000 muscles!',
        },
        monkey: {
          id: 'Suara riuh Orangutan di kanopi! Mereka kera besar dengan kecerdasan luar biasa!',
          en: 'Vocal calls from the Orangutan canopy! Incredible great apes with brilliant minds!',
        },
        dolphin: {
          id: 'Klik ekolokasi & siulan lumba-lumba! Tiap lumba-lumba punya siulan nama pribadi!',
          en: 'Dolphin clicks & signature whistles! Each dolphin possesses its own signature name call!',
        },
        eagle: {
          id: 'Pekikan tajam Elang sang penguasa langit! Cengkeraman cakarnya sangat tangguh!',
          en: 'Piercing raptor screech of the Eagle! Formidable hunters ruling the skies!',
        },
        bird: {
          id: 'Kicauan merdu burung liar! Melodi alami yang menyegarkan suasana hutan!',
          en: 'Melodic avian birdsong! Nature\'s orchestra filling the wilderness canopy!',
        },
        whale: {
          id: 'Nyanyian Paus Samudra yang sakral! Frekuensi rendahnya bisa mengarungi samudra!',
          en: 'Sacred Humpback Whale song! Low frequencies traveling thousands of miles underwater!',
        },
        owl: {
          id: 'Suara kukuk Burung Hantu Salju! Sayapnya bisa terbang 100% tanpa suara bising!',
          en: 'The resonant call of the Snowy Owl! Its feathered wings fly in 100% dead silence!',
        },
      };

      const matched = reactions[soundType];
      if (matched) {
        setActiveSpeech(matched[lang]);
        setSpeechCategory('reaction');
        setQuizState(null);
      }

      setTimeout(() => setIsWaving(false), 2000);
    });

    return () => removeListener();
  }, [lang]);

  // Give a random trivia
  const handleRandomTrivia = () => {
    soundManager.playMascotSpeech();
    const randomItem = TRIVIA_LIST[Math.floor(Math.random() * TRIVIA_LIST.length)];
    setActiveSpeech(randomItem[lang]);
    setSpeechCategory('trivia');
    setQuizState(null);
    setHasNewMessage(false);
  };

  // Start a mini quiz
  const handleStartQuiz = () => {
    soundManager.playMascotSpeech();
    const q = QUIZ_LIST[Math.floor(Math.random() * QUIZ_LIST.length)];
    setQuizState({
      question: q.question[lang],
      options: q.options[lang],
      correctIndex: q.correctIndex,
      explanation: q.explanation[lang],
      answered: null,
    });
    setSpeechCategory('quiz');
  };

  // Answer quiz
  const handleAnswerQuiz = (index: number) => {
    if (!quizState || quizState.answered !== null) return;
    setQuizState({ ...quizState, answered: index });
    if (index === quizState.correctIndex) {
      soundManager.playSuccessChime();
    } else {
      soundManager.playClick();
    }
  };

  const handleToggleOpen = () => {
    soundManager.playClick();
    if (!isOpen) {
      soundManager.playMascotSpeech();
      setHasNewMessage(false);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none flex flex-col items-end">
      {/* Speech Dialogue Box */}
      {isOpen && (
        <div className="mb-3 max-w-[320px] sm:max-w-sm w-full bg-stone-900/95 backdrop-blur-xl border border-amber-400/40 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80 animate-scale-up text-stone-100">
          {/* Header of Dialog */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 font-['Outfit',sans-serif]">
                  Rimbo si Ranger
                </h4>
                <p className="text-[10px] text-stone-400">
                  {lang === 'id' ? 'Maskot Pemandu Satwa' : 'Wildlife Companion'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
              title="Tutup dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dialogue Body */}
          <div className="py-3">
            {speechCategory !== 'quiz' || !quizState ? (
              <p className="text-xs sm:text-[13px] leading-relaxed text-stone-200">
                {activeSpeech}
              </p>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Kuis Tebak Hewan' : 'Animal Trivia Quiz'}</span>
                </div>
                <p className="text-xs font-semibold text-white">{quizState.question}</p>

                <div className="space-y-1.5 pt-1">
                  {quizState.options.map((opt, i) => {
                    const isAnswered = quizState.answered !== null;
                    const isSelected = quizState.answered === i;
                    const isCorrect = i === quizState.correctIndex;

                    let btnStyle = 'bg-stone-800/90 text-stone-200 hover:bg-stone-750 border-stone-700';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-600 text-white border-rose-400 font-bold';
                      } else {
                        btnStyle = 'bg-stone-850 text-stone-500 border-stone-800 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => handleAnswerQuiz(i)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {quizState.answered !== null && (
                  <p className="text-[11px] text-amber-200/90 italic pt-1 bg-amber-400/10 p-2 rounded-xl border border-amber-400/20">
                    💡 {quizState.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons inside Dialogue */}
          <div className="pt-2.5 border-t border-stone-800 flex items-center gap-2">
            <button
              onClick={handleRandomTrivia}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-[11px] font-bold border border-stone-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Lightbulb className="w-3 h-3" />
              <span>{lang === 'id' ? 'Fakta Acak' : 'Random Fact'}</span>
            </button>

            <button
              onClick={handleStartQuiz}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-[11px] font-extrabold shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-3 h-3" />
              <span>{lang === 'id' ? 'Kuis Satwa' : 'Quick Quiz'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mascot Avatar Button */}
      <button
        onClick={handleToggleOpen}
        className={`relative group flex items-center gap-2.5 p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-2 ${
          isOpen ? 'border-amber-400 shadow-amber-400/30' : 'border-stone-700 hover:border-amber-400'
        } shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95`}
        title={lang === 'id' ? 'Klik Rimbo si Maskot Penjelajah' : 'Click Rimbo the Wildlife Mascot'}
      >
        {/* Animated Custom Wildlife Mascot Character SVG */}
        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center ${isWaving ? 'animate-wiggle' : 'animate-float-gentle'}`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Sky / Sun */}
            <circle cx="50" cy="50" r="48" fill="#F59E0B" />
            <circle cx="50" cy="50" r="44" fill="#FBBF24" />

            {/* Left Ear */}
            <g className="animate-mascot-ear-left">
              <ellipse cx="28" cy="24" rx="8" ry="16" transform="rotate(-25 28 24)" fill="#92400E" />
              <ellipse cx="28" cy="24" rx="4" ry="10" transform="rotate(-25 28 24)" fill="#FCD34D" />
            </g>

            {/* Right Ear */}
            <g className="animate-mascot-ear-right">
              <ellipse cx="72" cy="24" rx="8" ry="16" transform="rotate(25 72 24)" fill="#92400E" />
              <ellipse cx="72" cy="24" rx="4" ry="10" transform="rotate(25 72 24)" fill="#FCD34D" />
            </g>

            {/* Ranger Safari Hat */}
            <path d="M22 36 C22 36, 50 20, 78 36 Z" fill="#78350F" />
            <ellipse cx="50" cy="38" rx="36" ry="7" fill="#B45309" />
            <path d="M32 37 C32 24, 68 24, 68 37 Z" fill="#92400E" />
            {/* Hat Ribbon */}
            <path d="M32 35 C42 33, 58 33, 68 35 L68 37 C58 35, 42 35, 32 37 Z" fill="#10B981" />
            {/* Hat Leaf Badge */}
            <circle cx="50" cy="31" r="3" fill="#34D399" />

            {/* Head Face */}
            <circle cx="50" cy="62" r="26" fill="#B45309" />
            <ellipse cx="50" cy="68" rx="19" ry="16" fill="#FDE68A" />

            {/* Eyes with Blink Animation */}
            <g className="animate-mascot-blink">
              <circle cx="39" cy="58" r="4" fill="#1C1917" />
              <circle cx="40.5" cy="56.5" r="1.5" fill="#FFFFFF" />
              <circle cx="61" cy="58" r="4" fill="#1C1917" />
              <circle cx="62.5" cy="56.5" r="1.5" fill="#FFFFFF" />
            </g>

            {/* Cute Rosy Cheeks */}
            <ellipse cx="33" cy="66" rx="4" ry="2.5" fill="#F87171" opacity="0.6" />
            <ellipse cx="67" cy="66" rx="4" ry="2.5" fill="#F87171" opacity="0.6" />

            {/* Little Deer/Kancil Nose & Smile */}
            <polygon points="50,65 46,62 54,62" fill="#451A03" />
            <path d="M47 67 Q50 71 53 67" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />

            {/* Little Safari Vest & Camera Strap */}
            <path d="M36 84 L50 77 L64 84 Z" fill="#047857" />
            <rect x="44" y="80" width="12" height="9" rx="2" fill="#1E293B" />
            <circle cx="50" cy="84.5" r="2.5" fill="#38BDF8" />
          </svg>
        </div>

        {/* Mascot Name Label on Desktop / Laptop */}
        <div className="hidden sm:flex flex-col text-left pr-2">
          <span className="text-xs font-black text-amber-400 leading-none">Rimbo</span>
          <span className="text-[10px] text-stone-400 font-medium">
            {isOpen ? (lang === 'id' ? 'Tutup Pemandu' : 'Close Guide') : (lang === 'id' ? 'Tanya Maskot' : 'Ask Mascot')}
          </span>
        </div>

        {/* Notification Bubble indicator */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce shadow-md">
            !
          </span>
        )}
      </button>
    </div>
  );
};
