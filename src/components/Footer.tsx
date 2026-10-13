import React from 'react';
import { Heart, Compass, Shield, Leaf, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
                🦁
              </div>
              <span className="font-extrabold text-xl text-white font-['Outfit',sans-serif]">
                Zoo Adventure
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              {lang === 'id'
                ? 'Pusat konservasi, edukasi satwa liar, dan petualangan safari interaktif berstandar global.'
                : 'Center for wildlife conservation, education, and global-standard interactive safari adventure.'}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Akreditasi WAZA Internasional' : 'WAZA Accredited Reserve'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'id' ? 'Navigasi Petualangan' : 'Adventure Navigation'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {lang === 'id' ? 'Beranda Utama' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {lang === 'id' ? 'Peta 6 Zona Habitat' : 'Interactive Safari Map'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('animals')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {lang === 'id' ? 'Ensiklopedia 12+ Satwa' : 'Animal Encyclopedia'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {lang === 'id' ? 'Jadwal Atraksi & Pakan' : 'Feeding Schedule'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {lang === 'id' ? 'Kuis Satwa Rimba' : 'Wildlife Quiz Challenge'}
                </button>
              </li>
            </ul>
          </div>

          {/* Conservation Pledge */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'id' ? 'Komitmen Konservasi' : 'Conservation Pledge'}</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              {lang === 'id'
                ? 'Sebesar 15% dari pendapatan operasional didonasikan langsung untuk program pelestarian satwa langka seperti Harimau Sumatra, Badak Jawa, dan Orangutan Kalimantan.'
                : '15% of all proceeds directly fund active conservation programs protecting endangered Bornean orangutans and Sumatran tigers.'}
            </p>
            <div className="text-[11px] text-amber-400/90 font-medium">
              #LindungiSatwa #SaveOurWildlife
            </div>
          </div>

          {/* Park Information */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'id' ? 'Jam Operasional & Tiket' : 'Hours & Visit Info'}
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-stone-300 font-bold block">{lang === 'id' ? 'Jam Buka:' : 'Opening Hours:'}</span>
                <span>08:30 - 17:30 WIB (Setiap Hari)</span>
              </div>
              <div>
                <span className="text-stone-300 font-bold block">{lang === 'id' ? 'Lokasi Kawasan:' : 'Location:'}</span>
                <span>Kawasan Hutan Konservasi Safari Hijau</span>
              </div>
              <div>
                <span className="text-stone-300 font-bold block">{lang === 'id' ? 'Layanan Pengunjung:' : 'Guest Helpline:'}</span>
                <span>+62 (021) 555-SAFARI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Zoo Adventure. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Dibuat dengan rasa cinta pada alam dan fauna</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
