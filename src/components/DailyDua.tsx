import React, { useState } from 'react';
import { Heart, Search, Copy, Check, BookMarked } from 'lucide-react';
import { dailyDuas } from '../data/duas';
import { Dua } from '../types/islamic';

interface DailyDuaProps {
  onNotify?: (msg: string) => void;
  standalone?: boolean;
}

const DailyDua: React.FC<DailyDuaProps> = ({ onNotify, standalone = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTransliteration, setShowTransliteration] = useState(true);

  const categories = [
    { id: 'all', label: 'Semua Doa' },
    { id: 'pagi-petang', label: 'Pagi & Petang' },
    { id: 'harian', label: 'Aktivitas Harian' },
    { id: 'makan-minum', label: 'Makan & Minum' },
    { id: 'sholat', label: 'Sholat & Masjid' },
    { id: 'perlindungan', label: 'Perlindungan' },
  ];

  const filteredDuas = dailyDuas.filter((dua) => {
    const matchCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCopy = (dua: Dua) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n"${dua.translation}"\n\nSumber: ${dua.source || 'Hadits Shahih'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    if (onNotify) onNotify(`Doa "${dua.title}" berhasil disalin`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`space-y-4 ${standalone ? 'max-w-4xl mx-auto' : ''}`}>
      {/* Top Card Controls */}
      <div className="app-card p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-emerald-900/20 dark:border-emerald-900/30">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Heart className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-100">Kumpulan Doa & Dzikir Shahih</h3>
              <p className="text-xs text-slate-400">Doa harian yang bersumber dari Al-Quran & Sunnah</p>
            </div>
          </div>

          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className="text-xs text-slate-400 hover:text-slate-200 self-start sm:self-auto px-2.5 py-1 rounded-md border border-slate-800 bg-slate-900/40"
          >
            {showTransliteration ? 'Sembunyikan Latin' : 'Tampilkan Latin'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari doa (misal: tidur, makan, istighfar, keselamatan)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/60 dark:bg-[#0c1815] border border-emerald-900/40 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-brand-500/20 border-brand-500 text-brand-300 font-semibold'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dua Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => {
            const isCopied = copiedId === dua.id;
            return (
              <div
                key={dua.id}
                className="app-card p-5 flex flex-col justify-between hover:border-emerald-700/50 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider block mb-1">
                        {dua.categoryLabel || 'Doa Harian'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{dua.title}</h4>
                    </div>
                    <button
                      onClick={() => handleCopy(dua)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-slate-800 transition-colors"
                      title="Salin Doa"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-brand-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="app-card-elevated p-4 mb-3">
                    <p className="font-arabic text-xl text-slate-100 leading-loose text-right">
                      {dua.arabic}
                    </p>
                  </div>

                  {/* Transliteration */}
                  {showTransliteration && (
                    <p className="text-xs text-brand-300/80 italic mb-2 leading-relaxed">
                      {dua.transliteration}
                    </p>
                  )}

                  {/* Indonesian Translation */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "{dua.translation}"
                  </p>
                </div>

                {/* Hadith Source Tag */}
                {dua.source && (
                  <div className="pt-3 mt-3 border-t border-emerald-900/20 dark:border-emerald-900/30 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-amber-300/80">
                      <BookMarked className="w-3 h-3" />
                      {dua.source}
                    </span>
                    <button
                      onClick={() => handleCopy(dua)}
                      className="text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      {isCopied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 app-card p-6">
            Tidak ditemukan doa yang sesuai dengan kata kunci "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyDua;