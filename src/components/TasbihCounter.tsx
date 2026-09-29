import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';

interface DzikirPreset {
  arabic: string;
  transliteration: string;
  meaning: string;
  defaultTarget: number;
}

const DZIKIR_PRESETS: DzikirPreset[] = [
  {
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "Subhanallah",
    meaning: "Maha Suci Allah",
    defaultTarget: 33
  },
  {
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    meaning: "Segala puji bagi Allah",
    defaultTarget: 33
  },
  {
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaning: "Allah Maha Besar",
    defaultTarget: 33
  },
  {
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "Laa ilaaha illallah",
    meaning: "Tiada Tuhan selain Allah",
    defaultTarget: 100
  },
  {
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    meaning: "Aku memohon ampun kepada Allah",
    defaultTarget: 100
  },
  {
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    transliteration: "Allahumma shalli 'ala Muhammad",
    meaning: "Ya Allah limpahkanlah shalawat atas Nabi Muhammad",
    defaultTarget: 100
  }
];

interface TasbihCounterProps {
  onNotify?: (msg: string) => void;
}

const TasbihCounter: React.FC<TasbihCounterProps> = ({ onNotify }) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalToday, setTotalToday] = useState(0);

  const currentPreset = DZIKIR_PRESETS[selectedPresetIndex];

  // Load saved state
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem('tasbih_count');
      const savedTotal = localStorage.getItem('tasbih_total_today');
      if (savedCount) setCount(parseInt(savedCount, 10));
      if (savedTotal) setTotalToday(parseInt(savedTotal, 10));
    } catch {
      // ignore
    }
  }, []);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }
    } catch {
      // ignore
    }
  };

  const handleIncrement = () => {
    playClickSound();
    // Gentle vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    const nextCount = count + 1;
    setCount(nextCount);
    const nextTotal = totalToday + 1;
    setTotalToday(nextTotal);

    try {
      localStorage.setItem('tasbih_count', nextCount.toString());
      localStorage.setItem('tasbih_total_today', nextTotal.toString());
    } catch {
      // ignore
    }

    // Check if target reached
    if (target > 0 && nextCount === target) {
      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
      if (onNotify) {
        onNotify(`Alhamdulillah, target ${target}x ${currentPreset.transliteration} tercapai!`);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    try {
      localStorage.setItem('tasbih_count', '0');
    } catch {
      // ignore
    }
  };

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setTarget(DZIKIR_PRESETS[index].defaultTarget);
    setCount(0);
  };

  const progressPercent = target > 0 ? Math.min(Math.round((count / target) * 100), 100) : 0;

  return (
    <div className="app-card p-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-900/20 dark:border-emerald-900/40">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Tasbih Digital
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Penghitung Dzikir & Shalawat harian</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              soundEnabled
                ? 'border-brand-500/40 text-brand-400 bg-brand-500/10'
                : 'border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Suara Aktif' : 'Suara Senyap'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
            title="Reset Hitungan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Pilihan Bacaan Dzikir
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DZIKIR_PRESETS.map((preset, idx) => (
            <button
              key={preset.transliteration}
              onClick={() => handleSelectPreset(idx)}
              className={`p-2.5 rounded-lg text-left border transition-all text-xs font-medium ${
                selectedPresetIndex === idx
                  ? 'border-brand-500 bg-brand-500/15 text-brand-300 font-semibold'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="truncate">{preset.transliteration}</div>
              <div className="text-[10px] text-slate-500 truncate">{preset.meaning}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Dzikir Display */}
      <div className="app-card-elevated p-5 text-center mb-6">
        <div className="font-arabic text-2xl sm:text-3xl text-amber-300 mb-2 leading-relaxed">
          {currentPreset.arabic}
        </div>
        <div className="font-semibold text-slate-200 text-sm mb-1">
          {currentPreset.transliteration}
        </div>
        <div className="text-xs text-slate-400">
          "{currentPreset.meaning}"
        </div>
      </div>

      {/* Target Selector */}
      <div className="flex items-center justify-between mb-6 px-1">
        <span className="text-xs text-slate-400 font-medium">Target Putaran:</span>
        <div className="flex gap-1.5">
          {[33, 99, 100, 0].map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                target === t
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 0 ? 'Bebas' : `${t}x`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Button with Progress Circle */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative flex items-center justify-center">
          {/* Circular progress SVG */}
          <svg className="w-56 h-56 transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              className="stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            {target > 0 && (
              <circle
                cx="112"
                cy="112"
                r="100"
                className="stroke-brand-500 transition-all duration-150"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 100}
                strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            )}
          </svg>

          {/* Big Tap Button */}
          <button
            onClick={handleIncrement}
            className="absolute w-44 h-44 rounded-full bg-gradient-to-b from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 active:scale-95 shadow-xl shadow-brand-950/50 flex flex-col items-center justify-center text-white transition-transform cursor-pointer border border-brand-400/30"
          >
            <span className="text-4xl font-extrabold tracking-tight font-mono">{count}</span>
            <span className="text-xs text-brand-200 mt-1 uppercase tracking-widest font-semibold">
              {target > 0 ? `/ ${target}` : 'Dzikir'}
            </span>
            <span className="text-[10px] text-brand-300/70 mt-2">Ketuk Layar</span>
          </button>
        </div>

        {target > 0 && count >= target && (
          <div className="flex items-center gap-1.5 text-xs text-brand-400 mt-4 font-medium animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            Target {target}x telah selesai!
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-900/20 dark:border-emerald-900/40 text-center">
        <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
          <div className="text-[11px] text-slate-400">Total Dzikir Hari Ini</div>
          <div className="text-base font-bold text-slate-100 font-mono mt-0.5">{totalToday}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
          <div className="text-[11px] text-slate-400">Kemajuan Putaran</div>
          <div className="text-base font-bold text-brand-400 font-mono mt-0.5">
            {target > 0 ? `${progressPercent}%` : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasbihCounter;
