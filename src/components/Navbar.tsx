import React from 'react';
import {
  Home,
  BookOpen,
  Heart,
  Compass,
  Moon,
  Sparkles,
  CircleDot,
  Sun
} from 'lucide-react';

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
    { id: 'asmaul-husna' as AppPage, label: 'Asmaul Husna', icon: Sparkles },
    { id: 'kiblat' as AppPage, label: 'Arah Kiblat', icon: Compass },
    { id: 'puasa' as AppPage, label: 'Puasa Sunnah', icon: Moon },
    { id: 'tasbih' as AppPage, label: 'Tasbih', icon: CircleDot },
  ];

  return (
    <>
      {/* Top Main Navbar for Desktop & Tablet */}
      <header className="sticky top-0 z-40 bg-[#091310]/90 dark:bg-[#091310]/95 backdrop-blur-md border-b border-emerald-900/20 dark:border-emerald-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & App Brand */}
          <div
            onClick={() => setCurrentPage('beranda')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Elegant Minimalist Islamic Star / Crescent Brand Mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/50 group-hover:scale-105 transition-transform">
              <Moon className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  NOOR
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Islami
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Pendamping Ibadah Muslim
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
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : ''}`} />
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
              className="p-2 rounded-xl border border-emerald-900/40 bg-slate-900/40 text-slate-300 hover:text-amber-300 hover:border-amber-400/30 transition-colors"
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#091310]/95 backdrop-blur-lg border-t border-emerald-900/40 py-1.5 px-2">
        <div className="flex items-center justify-around overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center py-1 px-1.5 min-w-[50px] rounded-lg transition-colors ${
                  isActive ? 'text-brand-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-400" />
                  )}
                </div>
                <span className="text-[9px] mt-1 tracking-tight truncate max-w-[55px] text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
