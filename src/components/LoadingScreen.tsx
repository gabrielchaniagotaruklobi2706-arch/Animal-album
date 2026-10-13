import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  lang: 'id' | 'en';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, lang }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFading(true);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      id="loading"
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-700 select-none ${
        isFading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #163b25, #3d7045)',
      }}
    >
      {/* Falling Leaves matching user specification */}
      <div className="leaf-container absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute text-4xl animate-fall-1 left-[10%] opacity-80">🍃</span>
        <span className="absolute text-4xl animate-fall-2 left-[30%] opacity-80">🌿</span>
        <span className="absolute text-4xl animate-fall-3 left-[60%] opacity-80">🍂</span>
        <span className="absolute text-4xl animate-fall-4 left-[85%] opacity-80">🌱</span>
      </div>

      <div className="loader-content text-center text-white relative z-10 px-6 max-w-sm mx-auto">
        {/* Animated bouncing mascot */}
        <div className="text-7xl mb-4 inline-block animate-bounce filter drop-shadow-md">
          🦁
        </div>

        {/* Circular loader matching user spec */}
        <div className="w-24 h-24 border-[7px] border-white/20 border-t-white rounded-full mx-auto mb-4 animate-spin shadow-inner"></div>

        {/* Percentage Counter */}
        <div id="percent" className="text-2xl font-extrabold tracking-wider text-amber-300 font-mono">
          {progress}%
        </div>

        {/* Dynamic loading text */}
        <p className="mt-3 text-base text-emerald-100 font-medium tracking-wide">
          {lang === 'id' ? 'Menjelajahi dunia satwa...' : 'Exploring the wildlife world...'}
        </p>

        {/* Progress bar visual indicator */}
        <div className="w-48 h-1.5 bg-emerald-950/60 rounded-full mx-auto mt-4 overflow-hidden border border-emerald-700/50">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-300 transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
