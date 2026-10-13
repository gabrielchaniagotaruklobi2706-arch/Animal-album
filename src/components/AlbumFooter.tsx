import React from 'react';
import { Camera, Heart, ArrowUp, Globe, Shield } from 'lucide-react';
import { Language } from '../types';

interface AlbumFooterProps {
  lang: Language;
  totalPhotos: number;
}

export const AlbumFooter: React.FC<AlbumFooterProps> = ({ lang, totalPhotos }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-850 pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-850 text-center md:text-left">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-450/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-lg font-['Outfit',sans-serif]">
                Album Satwa Liar
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              {lang === 'id'
                ? 'Sebuah inisiatif galeri visual untuk mengapresiasi keanekaragaman hayati satwa liar bumi dan menggaungkan pentingnya konservasi habitat alami.'
                : 'A visual gallery initiative dedicated to celebrating Earth’s wildlife biodiversity and raising awareness for native habitat conservation.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
            <div className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">
              <span className="text-amber-400 font-bold">{totalPhotos}</span> {lang === 'id' ? 'Foto Satwa' : 'Wildlife Photos'}
            </div>
            <div className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>IUCN Red List Data</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            {lang === 'id'
              ? '© 2025 Album Satwa Liar • Dirancang untuk pecinta satwa dan fotografi alam'
              : '© 2025 World Wildlife Album • Designed for animal enthusiasts and nature photographers'}
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-amber-400 transition-colors group cursor-pointer"
          >
            <span>{lang === 'id' ? 'Kembali ke Atas' : 'Back to Top'}</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
