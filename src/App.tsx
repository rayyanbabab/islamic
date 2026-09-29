import React, { useState, useEffect } from 'react';
import {
  Heart,
  Compass,
  Moon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Navbar, { AppPage } from './components/Navbar';
import PrayerTimes from './components/PrayerTimes';
import QuranVerse from './components/QuranVerse';
import DailyDua from './components/DailyDua';
import QiblaFinder from './components/QiblaFinder';
import SunnahFasting from './components/SunnahFasting';
import QuranReader from './components/QuranReader';
import TasbihCounter from './components/TasbihCounter';
import AsmaulHusna from './components/AsmaulHusna';
import Toast from './components/Toast';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('beranda');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme_preference') !== 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNotify = (msg: string) => {
    setToastMessage(msg);
  };

  const handleOpenSurah = (surahNumber: number) => {
    setSelectedSurahNumber(surahNumber);
    setCurrentPage('quran');
  };

  // ---------------- HOME OVERVIEW PAGE ----------------
  const renderHomePage = () => (
    <div className="space-y-6">
      {/* 1. Prayer Times Hero Bar */}
      <PrayerTimes onNotify={handleNotify} />

      {/* 2. Primary Inspiration Grid: Ayat of the Day & Doa of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuranVerse onNavigateToSurah={handleOpenSurah} onNotify={handleNotify} />
        
        {/* Quick Featured Daily Dua with link to see more */}
        <div className="app-card p-6 flex flex-col justify-between shadow-soft">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/20 dark:border-emerald-900/30">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Heart className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Doa Pilihan Hari Ini</h3>
                  <p className="text-[11px] text-slate-400">Sayyidul Istighfar</p>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('doa')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                Lihat Semua Doa
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="app-card-elevated p-4 mb-3">
              <p className="font-arabic text-xl sm:text-2xl text-slate-100 leading-loose text-right">
                اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-500/50 pl-3 py-1">
              "Ya Allah, Engkau adalah Tuhanku, tidak ada Tuhan yang berhak disembah selain Engkau. Engkaulah yang menciptakan aku dan aku adalah hamba-Mu..."
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-emerald-900/20 dark:border-emerald-900/30 flex items-center justify-between">
            <span className="text-[11px] text-amber-300/80 font-medium">
              HR. Bukhari no. 6306
            </span>
            <button
              onClick={() => setCurrentPage('doa')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/40 transition-colors"
            >
              Buka Kumpulan Doa
            </button>
          </div>
        </div>
      </div>

      {/* 3. Quick Utility Cards Row: Asmaul Husna, Kiblat, Puasa, & Tasbih */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Asmaul Husna Quick Card */}
        <div
          onClick={() => setCurrentPage('asmaul-husna')}
          className="app-card p-5 cursor-pointer hover:border-brand-500/50 transition-all hover:-translate-y-0.5 shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
            Asmaul Husna
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            99 Nama Indah Allah lengkap dengan arti, makna, & dalil Al-Quran
          </p>
        </div>

        {/* Kiblat Quick Card */}
        <div
          onClick={() => setCurrentPage('kiblat')}
          className="app-card p-5 cursor-pointer hover:border-brand-500/50 transition-all hover:-translate-y-0.5 shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
            Arah Kiblat Presisi
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Kompas visual Ka'bah ~295° dengan jarak ~7.925 km dari Indonesia
          </p>
        </div>

        {/* Puasa Quick Card */}
        <div
          onClick={() => setCurrentPage('puasa')}
          className="app-card p-5 cursor-pointer hover:border-brand-500/50 transition-all hover:-translate-y-0.5 shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-105 transition-transform">
              <Moon className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
            Jadwal Puasa Sunnah
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Panduan puasa Senin-Kamis, Ayyamul Bidh, dan dalil-dalil shahih
          </p>
        </div>

        {/* Tasbih Quick Card */}
        <div
          onClick={() => setCurrentPage('tasbih')}
          className="app-card p-5 cursor-pointer hover:border-brand-500/50 transition-all hover:-translate-y-0.5 shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
            Tasbih Digital
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Penghitung dzikir harian 33x/100x dengan suara & getaran santai
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen islamic-pattern-bg pb-24 md:pb-12 text-slate-100">
      {/* Toast Notification Container */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Modern Top Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          if (page === 'quran') setSelectedSurahNumber(null);
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {currentPage === 'beranda' && renderHomePage()}
        {currentPage === 'quran' && (
          <QuranReader
            initialSurah={selectedSurahNumber}
            onNotify={handleNotify}
          />
        )}
        {currentPage === 'doa' && <DailyDua onNotify={handleNotify} standalone />}
        {currentPage === 'asmaul-husna' && <AsmaulHusna onNotify={handleNotify} />}
        {currentPage === 'kiblat' && <QiblaFinder onNotify={handleNotify} />}
        {currentPage === 'puasa' && <SunnahFasting />}
        {currentPage === 'tasbih' && <TasbihCounter onNotify={handleNotify} />}
      </main>

      {/* Refined Footer */}
      <footer className="mt-16 border-t border-emerald-900/20 dark:border-emerald-900/40 text-center py-8 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">NOOR</span>
            <span>— Pendamping Ibadah Muslim Harian</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Data API: Aladhan & Alquran.cloud</span>
            <span>•</span>
            <span>Waktu Sholat Akurat Kemenag / MUIS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;