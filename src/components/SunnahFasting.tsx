import React, { useState } from 'react';
import { Moon, Calendar, Sparkles, BookOpen } from 'lucide-react';
import { getSunnahFastingList } from '../data/sunnahFasting';
import { SunnahFasting as SunnahFastingType } from '../types/islamic';

type FastingFilterType = 'all' | 'sunnah' | 'wajib' | 'mustahab';

const SunnahFasting: React.FC = () => {
  const [fastingList] = useState<SunnahFastingType[]>(getSunnahFastingList());
  const [selectedFilter, setSelectedFilter] = useState<FastingFilterType>('all');

  const filteredList = fastingList.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'wajib':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'sunnah':
        return 'badge-brand';
      case 'mustahab':
        return 'badge-gold';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const filterTabs: { id: FastingFilterType; label: string }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'sunnah', label: 'Sunnah' },
    { id: 'mustahab', label: 'Mustahab' },
    { id: 'wajib', label: 'Wajib' }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Overview Card */}
      <div className="app-card p-6 shadow-soft bg-gradient-to-br from-[#0c1e19] via-[#091512] to-[#0c1a16] border-emerald-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/30">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Moon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-100">Jadwal & Panduan Puasa Sunnah</h3>
              <p className="text-xs text-slate-400">Amalan mulia untuk mendekatkan diri kepada Allah Ta'ala</p>
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex gap-1.5 self-start sm:self-auto">
            {filterTabs.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-brand-500/25 border-brand-500 text-brand-300 font-semibold'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Highlights / Pro-tip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-emerald-900/20 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block mb-0.5">Rutin Mingguan</strong>
              <p className="text-slate-400 leading-relaxed">
                Puasa Senin & Kamis dibuka pintu-pintu surga dan amalan dilaporkan.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-emerald-900/20 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block mb-0.5">Rutin Bulanan (Ayyamul Bidh)</strong>
              <p className="text-slate-400 leading-relaxed">
                Tanggal 13, 14, 15 setiap bulan Hijriah senilai pahala puasa setahun.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* List of Fastings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((fasting, index) => (
          <div
            key={index}
            className="app-card p-5 flex flex-col justify-between hover:border-emerald-700/40 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-sm font-bold text-slate-100">{fasting.title}</h4>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${getBadgeStyle(
                    fasting.type
                  )}`}
                >
                  {fasting.type}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>{fasting.date}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {fasting.description}
              </p>
            </div>

            {fasting.hadith && (
              <div className="p-3 rounded-lg bg-slate-900/60 border border-emerald-900/20 text-[11px] text-slate-400 italic leading-relaxed">
                <BookOpen className="w-3.5 h-3.5 text-brand-400 inline mr-1.5" />
                {fasting.hadith}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SunnahFasting;