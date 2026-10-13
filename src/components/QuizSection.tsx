import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { soundManager } from '../utils/audio';

interface QuizSectionProps {
  lang: Language;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ lang }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      soundManager.playSuccessChime();
    } else {
      soundManager.playClick();
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      soundManager.playSuccessChime();
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <section id="quiz" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-600/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>{lang === 'id' ? 'Tantangan Pengetahuan Satwa' : 'Wildlife Quiz Challenge'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
          {lang === 'id' ? 'Kuis Cerdas Cermat Penjelajah' : 'Safari Explorer Trivia'}
        </h2>
        <p className="text-stone-300 mt-2 text-sm">
          {lang === 'id'
            ? 'Uji wawasan Anda seputar fakta unik dunia fauna dan dapatkan lencana penghargaan penjelajah!'
            : 'Test your wildlife knowledge with remarkable facts and earn your explorer certificate!'}
        </p>
      </div>

      {/* Quiz Card */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {!isFinished ? (
          <div>
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800 text-xs font-bold">
              <span className="text-stone-400">
                {lang === 'id' ? 'Pertanyaan' : 'Question'} {currentIdx + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-amber-400 font-mono">
                {lang === 'id' ? 'Skor Saat Ini:' : 'Current Score:'} {score}
              </span>
            </div>

            {/* Question Box */}
            <div className="flex items-start gap-4 mb-8">
              <span className="text-4xl p-3 bg-stone-800 rounded-2xl border border-stone-700">
                {currentQ.animalEmoji}
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit',sans-serif] leading-snug">
                  {currentQ.question[lang]}
                </h3>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options[lang].map((option, idx) => {
                let btnStyle = 'bg-stone-800/80 border-stone-700 text-stone-200 hover:border-amber-400 hover:bg-stone-750';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/40';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-red-950 border-red-500 text-red-200 font-bold';
                  } else {
                    btnStyle = 'bg-stone-950/50 border-stone-800 text-stone-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answer */}
            {isAnswered && (
              <div className="mb-6 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 animate-fade-in">
                <div className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Tahukah Anda?' : 'Did You Know?'}</span>
                </div>
                <p className="leading-relaxed">{currentQ.explanation[lang]}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-900/30 transition-all transform hover:scale-105"
                >
                  {currentIdx + 1 < QUIZ_QUESTIONS.length
                    ? (lang === 'id' ? 'Pertanyaan Selanjutnya →' : 'Next Question →')
                    : (lang === 'id' ? 'Lihat Hasil Akhir ★' : 'See Results ★')}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="text-center py-8 animate-scale-up">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-extrabold text-white font-['Outfit',sans-serif] mb-2">
              {score >= 4
                ? (lang === 'id' ? 'Luar Biasa, Anda Ahli Zoologi!' : 'Magnificent, Master Zoologist!')
                : (lang === 'id' ? 'Bagus Sekali, Penjelajah Hebat!' : 'Great Job, Wildlife Explorer!')}
            </h3>
            <p className="text-stone-300 text-sm max-w-md mx-auto mb-6">
              {lang === 'id'
                ? `Anda berhasil menjawab ${score} dari ${QUIZ_QUESTIONS.length} pertanyaan dengan tepat!`
                : `You successfully answered ${score} out of ${QUIZ_QUESTIONS.length} questions correctly!`}
            </p>

            {/* Score Ring / Pill */}
            <div className="inline-block px-6 py-3 rounded-2xl bg-stone-950 border border-amber-400/40 text-amber-400 font-extrabold text-xl font-mono mb-8">
              {Math.round((score / QUIZ_QUESTIONS.length) * 100)}% AKURASI
            </div>

            <div>
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs sm:text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'id' ? 'Ulangi Kuis' : 'Play Again'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
