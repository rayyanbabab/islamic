import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Copy,
  Check,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { asmaulHusnaList, AsmaulHusnaItem } from '../data/asmaulHusna';

interface AsmaulHusnaProps {
  onNotify?: (msg: string) => void;
}

const AsmaulHusna: React.FC<AsmaulHusnaProps> = ({ onNotify }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState<'all' | '1-33' | '34-66' | '67-99' | 'bookmarks'>('all');
  const [activeModalItem, setActiveModalItem] = useState<AsmaulHusnaItem | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [copiedNumber, setCopiedNumber] = useState<number | null>(null);

  // Load bookmarks
  useEffect(() => {
    try {
      const saved = localStorage.getItem('asmaul_husna_bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleBookmark = (number: number) => {
    const isSaved = bookmarks.includes(number);
    const updated = isSaved ? bookmarks.filter((n) => n !== number) : [...bookmarks, number];
    setBookmarks(updated);
    try {
      localStorage.setItem('asmaul_husna_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (onNotify) {
      onNotify(isSaved ? 'Dihapus dari nama tersimpan' : 'Nama Allah berhasil ditandai');
    }
  };

  const handleCopy = (item: AsmaulHusnaItem) => {
    const text = `${item.number}. ${item.latin} (${item.arabic})\nArti: ${item.translation}\nMakna: ${item.meaning}\nDalil: ${item.dalil}`;
    navigator.clipboard.writeText(text);
    setCopiedNumber(item.number);
    if (onNotify) onNotify(`Asmaul Husna "${item.latin}" disalin`);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredList = asmaulHusnaList.filter((item) => {
    const matchSearch =
      searchQuery.trim() === '' ||
      item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.number.toString() === searchQuery.trim();

    if (!matchSearch) return false;

    if (selectedRange === '1-33') return item.number >= 1 && item.number <= 33;
    if (selectedRange === '34-66') return item.number >= 34 && item.number <= 66;
    if (selectedRange === '67-99') return item.number >= 67 && item.number <= 99;
    if (selectedRange === 'bookmarks') return bookmarks.includes(item.number);
    return true;
  });

  const navigateModal = (direction: 'prev' | 'next') => {
    if (!activeModalItem) return;
    const nextNum = direction === 'next' ? activeModalItem.number + 1 : activeModalItem.number - 1;
    if (nextNum >= 1 && nextNum <= 99) {
      const found = asmaulHusnaList.find((i) => i.number === nextNum);
      if (found) setActiveModalItem(found);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="app-card p-6 shadow-soft bg-gradient-to-br from-[#0c1e19] via-[#091512] to-[#0c1a16] border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-900/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Asmaul Husna (99 Nama Allah)
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              "Hanya milik Allah asmaul-husna, maka bermohonlah kepada-Nya dengan menyebut asmaul-husna itu..." (QS. Al-A'raf: 180)
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, arti, atau nomor (1-99)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/70 border border-emerald-900/50 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {[
            { id: 'all' as const, label: `Semua (99)` },
            { id: '1-33' as const, label: '1 - 33' },
            { id: '34-66' as const, label: '34 - 66' },
            { id: '67-99' as const, label: '67 - 99' },
            { id: 'bookmarks' as const, label: `Tersimpan (${bookmarks.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedRange === tab.id
                  ? 'bg-brand-500/20 border-brand-500 text-brand-300 font-semibold'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 99 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredList.map((item) => {
          const isSaved = bookmarks.includes(item.number);
          const isCopied = copiedNumber === item.number;

          return (
            <div
              key={item.number}
              onClick={() => setActiveModalItem(item)}
              className="app-card p-4 hover:border-brand-500/50 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group flex flex-col justify-between"
            >
              {/* Card Top: Number & Actions */}
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-700/40 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center group-hover:bg-brand-500/20 group-hover:text-brand-300 transition-colors">
                  {item.number}
                </span>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleBookmark(item.number)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isSaved
                        ? 'text-amber-400'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                    title={isSaved ? 'Hapus penanda' : 'Tandai nama'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 text-xs transition-colors"
                    title="Salin Nama & Arti"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Card Middle: Arabic Calligraphy */}
              <div className="py-2 text-center">
                <div className="font-arabic text-2xl sm:text-3xl text-amber-300 group-hover:scale-105 transition-transform leading-relaxed">
                  {item.arabic}
                </div>
              </div>

              {/* Card Bottom: Latin & Translation */}
              <div className="pt-2 border-t border-emerald-900/20 dark:border-emerald-900/30 text-center">
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                  {item.latin}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.translation}
                </p>
                <div className="text-[10px] text-brand-400/80 mt-1.5 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Makna & Dalil</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 app-card p-6">
            Tidak ditemukan nama yang cocok dengan kata kunci "{searchQuery}".
          </div>
        )}
      </div>

      {/* Detail Modal / Drawer */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0f1d19] border border-emerald-700/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-bold font-mono flex items-center justify-center">
                  {activeModalItem.number}
                </span>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Asmaul Husna #{activeModalItem.number}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleBookmark(activeModalItem.number)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    bookmarks.includes(activeModalItem.number)
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tandai nama ini"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarks.includes(activeModalItem.number) ? 'fill-current' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleCopy(activeModalItem)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Salin"
                >
                  {copiedNumber === activeModalItem.number ? (
                    <Check className="w-4 h-4 text-brand-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Arabic Center Showcase */}
            <div className="app-card-elevated p-6 text-center bg-gradient-to-b from-slate-900/80 to-slate-900/40 border-emerald-900/30">
              <div className="font-arabic text-4xl sm:text-5xl text-amber-300 mb-2 leading-relaxed">
                {activeModalItem.arabic}
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                {activeModalItem.latin}
              </h3>
              <p className="text-xs font-semibold text-brand-300 mt-0.5">
                "{activeModalItem.translation}"
              </p>
            </div>

            {/* Meaning Explanation */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Makna & Penjelasan Mendalam:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-emerald-900/20">
                {activeModalItem.meaning}
              </p>
            </div>

            {/* Dalil Ayat Al-Quran */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Dalil Terkait:
              </span>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-900/20 text-xs text-amber-200/90 italic leading-relaxed">
                {activeModalItem.dalil}
              </div>
            </div>

            {/* Modal Bottom Prev / Next Nav */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-900/30">
              <button
                onClick={() => navigateModal('prev')}
                disabled={activeModalItem.number <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/60 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 border border-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </button>

              <span className="text-[11px] text-slate-500 font-mono">
                {activeModalItem.number} / 99
              </span>

              <button
                onClick={() => navigateModal('next')}
                disabled={activeModalItem.number >= 99}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/60 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 border border-slate-800 transition-colors"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsmaulHusna;
