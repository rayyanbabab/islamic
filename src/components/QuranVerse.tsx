import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, RefreshCw, Volume2, VolumeX, Copy, Check, ExternalLink } from 'lucide-react';
import { getRandomQuranVerse } from '../services/islamicApi';
import { QuranVerse as QuranVerseType } from '../types/islamic';

interface QuranVerseProps {
  onNavigateToSurah?: (surahNumber: number) => void;
  onNotify?: (msg: string) => void;
}

const QuranVerse: React.FC<QuranVerseProps> = ({ onNavigateToSurah, onNotify }) => {
  const [verse, setVerse] = useState<QuranVerseType | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchVerse = useCallback(async () => {
    // Stop current playing audio
    if (audioObj) {
      audioObj.pause();
      setIsPlaying(false);
    }

    setLoading(true);
    try {
      const data = await getRandomQuranVerse();
      setVerse(data);
    } catch (error) {
      console.error('Error fetching verse:', error);
    } finally {
      setLoading(false);
    }
  }, [audioObj]);

  useEffect(() => {
    fetchVerse();
    return () => {
      if (audioObj) audioObj.pause();
    };
  }, [audioObj, fetchVerse]);

  const handleToggleAudio = () => {
    if (!verse?.audioUrl) {
      if (onNotify) onNotify('Audio untuk ayat ini belum tersedia');
      return;
    }

    if (isPlaying && audioObj) {
      audioObj.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(verse.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        if (onNotify) onNotify('Gagal memutar audio ayat');
      };
      audio.play().then(() => {
        setIsPlaying(true);
        if (onNotify) onNotify(`Memutar QS. ${verse.surahName}:${verse.ayah}`);
      }).catch(() => setIsPlaying(false));
      setAudioObj(audio);
    }
  };

  const handleCopy = () => {
    if (!verse) return;
    const textToCopy = `${verse.text}\n\n"${verse.translation}"\n(QS. ${verse.surahName} [${verse.surah}]: ${verse.ayah})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onNotify) onNotify('Ayat berhasil disalin ke clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-card p-6 h-full flex flex-col justify-between shadow-soft">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/20 dark:border-emerald-900/30">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Ayat Hari Ini</h3>
              <p className="text-[11px] text-slate-400">Renungan & Hikmah Al-Quran</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={fetchVerse}
              disabled={loading}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
              title="Ambil ayat lain"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
            </button>
          </div>
        </div>

        {verse ? (
          <div className="space-y-4">
            {/* Surah & Ayah Badge */}
            <div className="flex items-center justify-between">
              <span className="badge-brand text-xs font-semibold px-2.5 py-1 rounded-full">
                QS. {verse.surahName} : Ayat {verse.ayah}
              </span>

              {onNavigateToSurah && (
                <button
                  onClick={() => onNavigateToSurah(parseInt(verse.surah, 10))}
                  className="text-[11px] text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  Baca Surah
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Arabic Verse Container */}
            <div className="app-card-elevated p-4 sm:p-5">
              <p className="font-arabic text-xl sm:text-2xl text-slate-100 leading-loose">
                {verse.text}
              </p>
            </div>

            {/* Indonesian Translation */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-brand-500/50 pl-3 py-1">
              "{verse.translation}"
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            {loading ? 'Memuat ayat pilihan...' : 'Gagal memuat ayat.'}
          </div>
        )}
      </div>

      {/* Action Footer */}
      {verse && (
        <div className="pt-4 mt-4 border-t border-emerald-900/20 dark:border-emerald-900/30 flex items-center justify-between">
          <button
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                : 'bg-slate-900/50 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPlaying ? 'Hentikan' : 'Dengarkan Murottal'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title="Salin Ayat & Terjemahan"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuranVerse;