import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  ArrowLeft,
  Bookmark,
  Play,
  Pause,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  BookOpen
} from 'lucide-react';
import { getAllSurahs, getSurahWithTranslation, searchQuran } from '../services/islamicApi';
import { Surah, Ayah, QuranSearchResult } from '../types/islamic';

interface QuranReaderProps {
  initialSurah?: number | null;
  onNotify?: (msg: string) => void;
}

const QuranReader: React.FC<QuranReaderProps> = ({ initialSurah, onNotify }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<{ arabic: Ayah[]; translation: Ayah[] } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<QuranSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [surahFilter, setSurahFilter] = useState<'all' | 'Makkiyah' | 'Madaniyah' | 'juz30' | 'bookmarks'>('all');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'read' | 'search'>('list');

  // Reader Customization State
  const [arabicFontSize, setArabicFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showTranslation, setShowTranslation] = useState(true);
  const [copiedAyahId, setCopiedAyahId] = useState<string | null>(null);

  // Audio Recitation State
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingAyahIndex(null);
    setIsPlayingFullSurah(false);
  }, []);

  const handleSurahSelect = useCallback(async (surahNumber: number) => {
    stopAudio();
    setLoading(true);
    setSelectedSurah(surahNumber);
    const data = await getSurahWithTranslation(surahNumber);
    setSurahData(data);
    setCurrentView('read');
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stopAudio]);

  useEffect(() => {
    loadSurahs();
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (initialSurah && surahs.length > 0) {
      handleSurahSelect(initialSurah);
    }
  }, [initialSurah, surahs, handleSurahSelect]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [currentView, selectedSurah, stopAudio]);

  const loadSurahs = async () => {
    setLoading(true);
    const data = await getAllSurahs();
    setSurahs(data);
    setLoading(false);
  };

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem('quran_bookmarks_v2');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  };

  const saveBookmarks = (newBookmarks: string[]) => {
    setBookmarks(newBookmarks);
    try {
      localStorage.setItem('quran_bookmarks_v2', JSON.stringify(newBookmarks));
    } catch {
      // ignore
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    const results = await searchQuran(searchQuery);
    setSearchResults(results);
    setCurrentView('search');
    setLoading(false);
  };

  const toggleBookmark = (ayahId: string) => {
    const isSaved = bookmarks.includes(ayahId);
    const updated = isSaved ? bookmarks.filter((id) => id !== ayahId) : [...bookmarks, ayahId];
    saveBookmarks(updated);
    if (onNotify) {
      onNotify(isSaved ? 'Ayat dihapus dari penanda' : 'Ayat berhasil ditandai (bookmark)');
    }
  };

  const handleCopyAyah = (arabicText: string, translationText: string, surahName: string, ayahNum: number) => {
    const text = `${arabicText}\n\n"${translationText}"\n(QS. ${surahName}: ${ayahNum})`;
    navigator.clipboard.writeText(text);
    const key = `${selectedSurah}:${ayahNum}`;
    setCopiedAyahId(key);
    if (onNotify) onNotify('Ayat berhasil disalin');
    setTimeout(() => setCopiedAyahId(null), 2000);
  };

  // Play single ayah audio
  const handlePlayAyah = (index: number, audioUrl?: string) => {
    if (!audioUrl) {
      if (onNotify) onNotify('Audio ayat belum tersedia');
      return;
    }

    if (playingAyahIndex === index) {
      stopAudio();
      return;
    }

    stopAudio();
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAyahIndex(index);

    audio.onended = () => {
      // Auto-play next ayah if playing full surah
      if (isPlayingFullSurah && surahData && index + 1 < surahData.arabic.length) {
        handlePlayAyah(index + 1, surahData.arabic[index + 1].audio);
      } else {
        setPlayingAyahIndex(null);
        setIsPlayingFullSurah(false);
      }
    };

    audio.onerror = () => {
      stopAudio();
      if (onNotify) onNotify('Gagal memuat audio ayat');
    };

    audio.play().catch(() => stopAudio());
  };

  // Play full surah starting from beginning
  const handleToggleFullSurahAudio = () => {
    if (!surahData || surahData.arabic.length === 0) return;

    if (isPlayingFullSurah || playingAyahIndex !== null) {
      stopAudio();
    } else {
      setIsPlayingFullSurah(true);
      handlePlayAyah(0, surahData.arabic[0].audio);
      if (onNotify) onNotify('Memulai lantunan Murottal Surah...');
    }
  };

  // Navigate prev/next surah
  const navigateSurah = (direction: 'prev' | 'next') => {
    if (!selectedSurah) return;
    const nextNumber = direction === 'next' ? selectedSurah + 1 : selectedSurah - 1;
    if (nextNumber >= 1 && nextNumber <= 114) {
      handleSurahSelect(nextNumber);
    }
  };

  // Font size class mapping
  const arabicSizeClasses = {
    normal: 'text-xl sm:text-2xl',
    large: 'text-2xl sm:text-3xl',
    xlarge: 'text-3xl sm:text-4xl'
  };

  // Filtered surahs for the directory
  const filteredSurahs = surahs.filter((s) => {
    const matchSearch =
      searchQuery.trim() === '' ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery.trim();

    if (!matchSearch) return false;

    if (surahFilter === 'Makkiyah') return s.revelationType === 'Makkiyah';
    if (surahFilter === 'Madaniyah') return s.revelationType === 'Madaniyah';
    if (surahFilter === 'juz30') return s.number >= 78 && s.number <= 114;
    if (surahFilter === 'bookmarks') {
      return bookmarks.some((bm) => bm.startsWith(`${s.number}:`));
    }
    return true;
  });

  const selectedSurahInfo = surahs.find((s) => s.number === selectedSurah);

  // -------------------- RENDER: SURAH LIST --------------------
  const renderSurahList = () => (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="app-card p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Daftar Surah Al-Quran
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">114 Surah dengan teks Arab & terjemahan resmi Kemenag</p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Cari nama surah atau kata..."
              className="w-full pl-9 pr-16 py-2 bg-slate-900/60 dark:bg-[#0c1815] border border-emerald-900/40 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white text-[11px] rounded-lg font-medium"
            >
              Cari
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-emerald-900/20 dark:border-emerald-900/30 pt-3">
          {[
            { id: 'all' as const, label: `Semua (${surahs.length})` },
            { id: 'juz30' as const, label: 'Juz 30 (Juz Amma)' },
            { id: 'Makkiyah' as const, label: 'Makkiyah' },
            { id: 'Madaniyah' as const, label: 'Madaniyah' },
            { id: 'bookmarks' as const, label: `Ditandai (${bookmarks.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSurahFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                surahFilter === tab.id
                  ? 'bg-brand-500/20 border-brand-500 text-brand-300 font-semibold'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Surah Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSurahs.map((surah) => (
          <div
            key={surah.number}
            onClick={() => handleSurahSelect(surah.number)}
            className="app-card p-4 hover:border-brand-500/50 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {/* Surah Number Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-emerald-800/40 group-hover:border-brand-500/60 group-hover:bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-400 font-mono transition-colors">
                {surah.number}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                  {surah.englishName}
                </h4>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {surah.englishNameTranslation}
                </p>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {surah.numberOfAyahs} ayat • {surah.revelationType}
                </div>
              </div>
            </div>

            {/* Arabic Name */}
            <div className="font-arabic text-xl text-amber-300/90 group-hover:text-amber-300 transition-colors">
              {surah.name}
            </div>
          </div>
        ))}

        {filteredSurahs.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 app-card p-6">
            Tidak ditemukan surah yang cocok dengan pencarian "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );

  // -------------------- RENDER: SURAH READER --------------------
  const renderSurahReader = () => {
    if (!surahData || !selectedSurahInfo) return null;

    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Sticky Controls Header */}
        <div className="sticky top-2 z-20 app-card p-4 shadow-lg backdrop-blur-md bg-[#0f1d19]/95 border-emerald-800/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  stopAudio();
                  setCurrentView('list');
                }}
                className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                title="Kembali ke Daftar Surah"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">
                    {selectedSurahInfo.englishName}
                  </h3>
                  <span className="font-arabic text-lg text-amber-300">
                    {selectedSurahInfo.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Surah ke-{selectedSurahInfo.number} • {selectedSurahInfo.numberOfAyahs} ayat • {selectedSurahInfo.revelationType}
                </div>
              </div>
            </div>

            {/* Right: Audio Player & View Settings */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Play Murottal Full Surah */}
              <button
                onClick={handleToggleFullSurahAudio}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  isPlayingFullSurah || playingAyahIndex !== null
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border-emerald-700/50'
                }`}
              >
                {isPlayingFullSurah || playingAyahIndex !== null ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Murottal</span>
                  </>
                )}
              </button>

              {/* Font Size Selector */}
              <div className="flex items-center bg-slate-900/60 border border-slate-800 rounded-lg p-0.5 text-xs">
                {(['normal', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setArabicFontSize(size)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      arabicFontSize === size
                        ? 'bg-brand-500/20 text-brand-300'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>

              {/* Toggle Translation */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  showTranslation
                    ? 'border-brand-500/40 text-brand-300 bg-brand-500/10'
                    : 'border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Tampilkan/Sembunyikan Terjemahan"
              >
                Terjemah
              </button>
            </div>
          </div>
        </div>

        {/* Bismillah Banner (All surahs except Surah At-Tawbah [9]) */}
        {selectedSurah !== 9 && (
          <div className="app-card p-6 text-center bg-gradient-to-b from-slate-900/60 to-slate-900/20 border-emerald-900/30 my-4">
            <div className="font-arabic text-2xl sm:text-3xl text-amber-300 leading-relaxed">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
            <p className="text-xs text-slate-400 mt-2">
              "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang"
            </p>
          </div>
        )}

        {/* Ayahs Stream */}
        <div className="space-y-4">
          {surahData.arabic.map((ayah, index) => {
            const translation = surahData.translation[index];
            const ayahId = `${selectedSurah}:${ayah.numberInSurah}`;
            const isBookmarked = bookmarks.includes(ayahId);
            const isPlayingThisAyah = playingAyahIndex === index;

            return (
              <div
                key={ayah.numberInSurah}
                id={`ayah-${ayah.numberInSurah}`}
                className={`app-card p-6 transition-all ${
                  isPlayingThisAyah
                    ? 'border-amber-400/80 bg-amber-500/5 shadow-md shadow-amber-950/20'
                    : 'hover:border-emerald-800/50'
                }`}
              >
                {/* Ayah Header Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-900/20 dark:border-emerald-900/30">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-700/40 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center">
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Ayat {ayah.numberInSurah}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Play Audio Button */}
                    <button
                      onClick={() => handlePlayAyah(index, ayah.audio)}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        isPlayingThisAyah
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title={isPlayingThisAyah ? 'Hentikan Audio' : 'Dengarkan Ayat Ini'}
                    >
                      {isPlayingThisAyah ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(ayahId)}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        isBookmarked
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title={isBookmarked ? 'Hapus Penanda' : 'Tandai Ayat Ini'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() =>
                        handleCopyAyah(
                          ayah.text,
                          translation?.text || '',
                          selectedSurahInfo.englishName,
                          ayah.numberInSurah || index + 1
                        )
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors"
                      title="Salin Ayat"
                    >
                      {copiedAyahId === ayahId ? (
                        <Check className="w-4 h-4 text-brand-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="my-4 text-right">
                  <p
                    className={`font-arabic text-slate-100 ${arabicSizeClasses[arabicFontSize]} leading-loose tracking-wide`}
                  >
                    {ayah.text}
                    <span className="ayah-number-badge">۝ {ayah.numberInSurah}</span>
                  </p>
                </div>

                {/* Indonesian Translation */}
                {showTranslation && translation && (
                  <div className="pt-3 border-t border-emerald-900/10 dark:border-emerald-900/20 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {translation.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Between Surahs */}
        <div className="flex items-center justify-between p-4 app-card mt-6">
          <button
            onClick={() => navigateSurah('prev')}
            disabled={!selectedSurah || selectedSurah <= 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900/60 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Surah Sebelumnya
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium"
          >
            Kembali ke Atas ↑
          </button>

          <button
            onClick={() => navigateSurah('next')}
            disabled={!selectedSurah || selectedSurah >= 114}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900/60 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-800 transition-colors"
          >
            Surah Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // -------------------- RENDER: SEARCH RESULTS --------------------
  const renderSearchResults = () => (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="app-card p-6 shadow-soft flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentView('list')}
            className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Surah
          </button>
          <h3 className="text-base font-bold text-slate-100">
            Hasil Pencarian: "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Ditemukan {searchResults.length} ayat yang relevan</p>
        </div>
      </div>

      <div className="space-y-3">
        {searchResults.map((result, idx) => (
          <div key={idx} className="app-card p-5 hover:border-emerald-700/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="badge-brand text-xs font-semibold px-2.5 py-0.5 rounded-full">
                QS. {result.ayah.surah?.englishName} : Ayat {result.ayah.number}
              </span>
              <button
                onClick={() => {
                  if (result.ayah.surah?.number) {
                    handleSurahSelect(result.ayah.surah.number);
                  }
                }}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium"
              >
                Buka Surah →
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              "{result.ayah.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Memuat data Al-Quran...</p>
        </div>
      ) : (
        <>
          {currentView === 'list' && renderSurahList()}
          {currentView === 'read' && renderSurahReader()}
          {currentView === 'search' && renderSearchResults()}
        </>
      )}
    </div>
  );
};

export default QuranReader;