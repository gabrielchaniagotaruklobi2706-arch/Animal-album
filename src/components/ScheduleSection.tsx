import React, { useState } from 'react';
import { Clock, MapPin, Bell, Check, Sparkles } from 'lucide-react';
import { ShowSchedule, Language } from '../types';
import { SHOW_SCHEDULES } from '../data/schedule';
import { soundManager } from '../utils/audio';

interface ScheduleSectionProps {
  lang: Language;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ lang }) => {
  const [reminders, setReminders] = useState<string[]>([]);

  const toggleReminder = (id: string) => {
    soundManager.playClick();
    setReminders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="schedule" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/50 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{lang === 'id' ? 'Agenda Harian Safari' : 'Daily Safari Agenda'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
          {lang === 'id' ? 'Jadwal Atraksi & Waktu Makan Satwa' : 'Feeding Shows & Ranger Presentations'}
        </h2>
        <p className="text-stone-300 mt-3 text-base">
          {lang === 'id'
            ? 'Jangan lewatkan momen seru saat para pawang memberi makan dan berinteraksi langsung dengan satwa liar hari ini.'
            : 'Don\'t miss the thrilling moments when animal caretakers conduct public feedings and educational talks today.'}
        </p>
      </div>

      {/* Schedule Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOW_SCHEDULES.map((item) => {
          const isReminded = reminders.includes(item.id);

          return (
            <div
              key={item.id}
              className="bg-stone-900/90 border border-stone-800 hover:border-amber-400/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                {/* Top Badge: Time & Animal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-xl bg-amber-400 text-stone-950 font-black text-sm tracking-wider font-mono shadow">
                    {item.time} WIB
                  </span>
                  <span className="text-3xl p-1 rounded-lg bg-stone-800 border border-stone-700">
                    {item.animalEmoji}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {item.title[lang]}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.location[lang]}</span>
                </div>

                {/* Description */}
                <p className="text-stone-300 text-xs leading-relaxed">
                  {item.description[lang]}
                </p>
              </div>

              {/* Reminder Action */}
              <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {lang === 'id' ? 'Gratis Tanpa Biaya Tiket' : 'Included with Ticket'}
                </span>

                <button
                  onClick={() => toggleReminder(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isReminded
                      ? 'bg-emerald-500 text-stone-950'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700'
                  }`}
                >
                  {isReminded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'id' ? 'Pengingat Aktif' : 'Reminded'}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      <span>{lang === 'id' ? 'Ingatkan Saya' : 'Set Reminder'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
