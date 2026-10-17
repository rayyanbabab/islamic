import React from 'react';
import {
  Home,
  BookOpen,
  Heart,
  Compass,
  CalendarDays,
  Sun,
  Moon
} from 'lucide-react';
import { RubElHizbIcon, TasbihBeadsIcon, NoorBrandIcon } from './Icons';

export type AppPage = 'beranda' | 'quran' | 'doa' | 'asmaul-husna' | 'kiblat' | 'puasa' | 'tasbih';

interface NavbarProps {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  isDarkMode,
  toggleDarkMode,
}) => {
  const navItems = [
    { id: 'beranda' as AppPage, label: 'Beranda', icon: Home },
    { id: 'quran' as AppPage, label: 'Al-Quran', icon: BookOpen },
    { id: 'doa' as AppPage, label: 'Doa & Dzikir', icon: Heart },
    { id: 'asmaul-husna' as AppPage, label: 'Asmaul Husna', icon: RubElHizbIcon },
    { id: 'kiblat' as AppPage, label: 'Arah Kiblat', icon: Compass },
    { id: 'puasa' as AppPage, label: 'Puasa Sunnah', icon: CalendarDays },
    { id: 'tasbih' as AppPage, label: 'Tasbih', icon: TasbihBeadsIcon },
  ];

  return (
    <>
      {/* Top Main Navbar for Desktop & Tablet */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#09120f]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.07] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & App Brand */}
          <div
            onClick={() => setCurrentPage('beranda')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Clean minimalist brand emblem */}
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-emerald-950/60 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center transition-transform group-hover:scale-105">
              <NoorBrandIcon className="w-5 h-5 text-brand-600 dark:text-amber-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-sans">
                  NOOR
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block leading-none">
                Panduan Ibadah Harian
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30 dark:border-brand-500/40 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-400/30 transition-colors"
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#09120f]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-white/[0.08] py-1.5 px-2 transition-colors duration-200">
        <div className="flex items-center justify-around overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center py-1 px-1.5 min-w-[50px] rounded-lg transition-colors ${
                  isActive ? 'text-brand-600 dark:text-brand-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-amber-400' : ''}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-500" />
                  )}
                </div>
                <span className="text-[9px] mt-1 tracking-tight truncate max-w-[56px] text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
