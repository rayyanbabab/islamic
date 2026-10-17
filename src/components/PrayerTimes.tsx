import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Search, Navigation, Volume2, VolumeX, Sun, Sunset, Moon } from 'lucide-react';
import { getPrayerTimes, getPrayerTimesByCoordinates } from '../services/islamicApi';
import { PrayerData } from '../types/islamic';

interface PrayerTimesProps {
  onNotify?: (msg: string) => void;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ onNotify }) => {
  const [city, setCity] = useState(() => {
    return localStorage.getItem('user_city') || 'Jakarta';
  });
  const [searchInput, setSearchInput] = useState('');
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; timeLeft: string } | null>(null);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Keep ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch prayer times whenever city changes
  useEffect(() => {
    fetchPrayerTimes(city);
  }, [city]);

  // Recalculate next prayer when prayerData or currentTime updates
  useEffect(() => {
    if (!prayerData) return;
    calculateNextPrayer(prayerData.times);
  }, [prayerData, currentTime]);

  const fetchPrayerTimes = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await getPrayerTimes(cityName);
      if (data) {
        setPrayerData(data);
        localStorage.setItem('user_city', cityName);
      } else {
        setError('Kota tidak ditemukan. Coba kota besar terdekat.');
      }
    } catch {
      setError('Gagal memuat jadwal sholat.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung browser Anda.');
      return;
    }
    setLoading(true);
    setShowCityPicker(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const data = await getPrayerTimesByCoordinates(latitude, longitude);
        if (data) {
          setPrayerData(data);
          setCity('Lokasi Anda (GPS)');
          if (onNotify) onNotify('Lokasi berhasil dideteksi lewat GPS');
        }
        setLoading(false);
      },
      () => {
        setError('Akses GPS ditolak atau tidak tersedia.');
        setLoading(false);
      }
    );
  };

  const calculateNextPrayer = (times: Record<string, string | undefined>) => {
    const prayerOrder = [
      { key: 'Fajr', name: 'Subuh' },
      { key: 'Sunrise', name: 'Terbit' },
      { key: 'Dhuhr', name: 'Dzuhur' },
      { key: 'Asr', name: 'Ashar' },
      { key: 'Maghrib', name: 'Maghrib' },
      { key: 'Isha', name: 'Isya' }
    ];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let foundNext: { name: string; time: string; timeLeft: string } | null = null;

    for (const item of prayerOrder) {
      const timeStr = times[item.key];
      if (!timeStr) continue;

      const [hours, minutes] = timeStr.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (prayerMinutes > currentMinutes) {
        const diffMinutes = prayerMinutes - currentMinutes;
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMin = diffMinutes % 60;
        const diffSecs = 59 - now.getSeconds();

        const formattedDiff = `${diffHours > 0 ? `${diffHours}j ` : ''}${remainingMin}m ${diffSecs}d`;

        foundNext = {
          name: item.name,
          time: timeStr,
          timeLeft: formattedDiff
        };
        break;
      }
    }

    // If past Isha, next prayer is Fajr tomorrow
    if (!foundNext && times.Fajr) {
      const [hours, minutes] = times.Fajr.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      const diffMinutes = 24 * 60 - currentMinutes + prayerMinutes;
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMin = diffMinutes % 60;

      foundNext = {
        name: 'Subuh (Besok)',
        time: times.Fajr,
        timeLeft: `${diffHours}j ${remainingMin}m`
      };
    }

    setNextPrayer(foundNext);
  };

  const toggleAdhanPreview = () => {
    if (isPlayingAdhan) {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setIsPlayingAdhan(false);
    } else {
      const audio = new Audio('https://cdn.islamic.network/audio/adhan/ar.alafasy.mp3');
      audio.onended = () => setIsPlayingAdhan(false);
      audio.onerror = () => {
        setIsPlayingAdhan(false);
        if (onNotify) onNotify('Tidak dapat memutar audio adzan saat ini');
      };
      audio.play().catch(() => setIsPlayingAdhan(false));
      setAudioElement(audio);
      setIsPlayingAdhan(true);
      if (onNotify) onNotify('Memutar lantunan Adzan...');
    }
  };

  const prayerCards = [
    { key: 'Imsak', name: 'Imsak', subtitle: 'Batas Sahur', icon: Moon },
    { key: 'Fajr', name: 'Subuh', subtitle: 'Sholat Wajib', icon: Sun },
    { key: 'Sunrise', name: 'Terbit', subtitle: 'Syuruq', icon: Sun },
    { key: 'Dhuhr', name: 'Dzuhur', subtitle: 'Sholat Wajib', icon: Sun },
    { key: 'Asr', name: 'Ashar', subtitle: 'Sholat Wajib', icon: Sunset },
    { key: 'Maghrib', name: 'Maghrib', subtitle: 'Sholat & Buka', icon: Sunset },
    { key: 'Isha', name: 'Isya', subtitle: 'Sholat Wajib', icon: Moon }
  ];

  const popularCities = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Yogyakarta', 'Makassar', 'Semarang', 'Palembang'];

  return (
    <div className="space-y-4">
      {/* Hero Prayer Highlight Card */}
      <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-emerald-950/90 via-[#0e211b] to-[#091512] text-white border border-emerald-500/25 relative overflow-hidden shadow-md">
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Location & Next Prayer */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                onClick={() => setShowCityPicker(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-emerald-100 text-xs font-medium transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-semibold">{prayerData?.city || city}</span>
                <span className="text-[10px] text-emerald-300/80 ml-1 underline">Ubah</span>
              </button>

              {prayerData?.hijriDate && (
                <span className="text-xs text-amber-200 font-medium bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
                  {prayerData.hijriDate}
                </span>
              )}

              {loading && (
                <span className="text-[11px] text-emerald-300 animate-pulse">Memuat...</span>
              )}
            </div>

            {nextPrayer ? (
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
                  Menuju Waktu Sholat Berikutnya
                </span>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {nextPrayer.name}
                  </h3>
                  <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                    {nextPrayer.time}
                  </span>
                </div>
                <div className="text-xs text-emerald-100/80 mt-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sisa waktu: <strong className="text-white font-mono">{nextPrayer.timeLeft}</strong></span>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white">Jadwal Sholat</h3>
                <p className="text-xs text-emerald-100/70 mt-1">Waktu sholat akurat untuk wilayah Indonesia</p>
              </div>
            )}
          </div>

          {/* Right: Live Clock & Adhan Preview Button */}
          <div className="flex flex-col sm:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            <div className="text-left sm:text-right">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xs text-emerald-100/70 mt-1">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            <button
              onClick={toggleAdhanPreview}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                isPlayingAdhan
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-semibold'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
              }`}
            >
              {isPlayingAdhan ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isPlayingAdhan ? 'Hentikan Adzan' : 'Dengarkan Adzan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {prayerCards.map((item) => {
          const time = prayerData?.times[item.key] || '--:--';
          const isNext = nextPrayer?.name.toLowerCase().includes(item.name.toLowerCase());
          const ItemIcon = item.icon;

          return (
            <div
              key={item.key}
              className={`p-3.5 rounded-xl border transition-all ${
                isNext
                  ? 'bg-brand-500/10 dark:bg-brand-500/20 border-brand-500/60 dark:border-brand-500 shadow-sm'
                  : 'app-card hover:border-brand-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-semibold ${isNext ? 'text-brand-600 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300'}`}>
                  {item.name}
                </span>
                <ItemIcon className={`w-3.5 h-3.5 ${isNext ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400'}`} />
              </div>
              <div className={`text-xl font-bold font-mono tracking-tight ${isNext ? 'text-brand-700 dark:text-amber-300' : 'text-slate-900 dark:text-white'}`}>
                {time}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {item.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* City Selector Modal */}
      {showCityPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#101c18] border border-slate-200 dark:border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                Pilih Kota atau Kabupaten
              </h4>
              <button
                onClick={() => setShowCityPicker(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs px-2 py-1 rounded-md"
              >
                Tutup
              </button>
            </div>

            {/* GPS Quick Button */}
            <button
              onClick={handleUseGPS}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              Gunakan Lokasi GPS Saya Saat Ini
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchInput.trim()) {
                    setCity(searchInput.trim());
                    setShowCityPicker(false);
                    setSearchInput('');
                  }
                }}
                placeholder="Ketik nama kota... (misal: Malang)"
                className="w-full pl-9 pr-20 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.1] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={() => {
                  if (searchInput.trim()) {
                    setCity(searchInput.trim());
                    setShowCityPicker(false);
                    setSearchInput('');
                  }
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-lg font-medium"
              >
                Pilih
              </button>
            </div>

            {/* Popular City Chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                Kota Populer:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularCities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCity(c);
                      setShowCityPicker(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      city.toLowerCase() === c.toLowerCase()
                        ? 'bg-brand-50 dark:bg-brand-500/20 border-brand-500 text-brand-700 dark:text-brand-300 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;