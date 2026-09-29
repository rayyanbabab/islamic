import React, { useState, useEffect } from 'react';
import { Compass, Navigation, ExternalLink, Info, Search } from 'lucide-react';
import { getQiblaDirection, INDONESIAN_CITIES } from '../services/islamicApi';

interface QiblaFinderProps {
  onNotify?: (msg: string) => void;
}

const QiblaFinder: React.FC<QiblaFinderProps> = ({ onNotify }) => {
  const [cityName, setCityName] = useState(() => {
    return localStorage.getItem('user_city') || 'Jakarta';
  });
  const [searchInput, setSearchInput] = useState('');
  const [bearing, setBearing] = useState<number>(295);
  const [distanceKm, setDistanceKm] = useState<number>(7925);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isSensorActive, setIsSensorActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate qibla for initial or selected city
  useEffect(() => {
    calculateQiblaForCity(cityName);
  }, [cityName]);

  const calculateQiblaForCity = (name: string) => {
    const key = name.toLowerCase().trim();
    const cityInfo = INDONESIAN_CITIES[key] || INDONESIAN_CITIES['jakarta'];
    const result = getQiblaDirection(cityInfo.lat, cityInfo.lng);
    setBearing(result.bearing);
    setDistanceKm(result.distanceKm);
    setMapUrl(result.url);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    const key = searchInput.toLowerCase().trim();
    if (INDONESIAN_CITIES[key]) {
      setCityName(INDONESIAN_CITIES[key].name);
      setSearchInput('');
      setError('');
    } else {
      setCityName(searchInput.trim());
      calculateQiblaForCity(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung browser ini.');
      return;
    }
    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const result = getQiblaDirection(latitude, longitude);
        setBearing(result.bearing);
        setDistanceKm(result.distanceKm);
        setMapUrl(result.url);
        setCityName('Lokasi Anda (GPS)');
        setLoading(false);
        if (onNotify) onNotify('Arah kiblat disesuaikan dengan GPS');
      },
      () => {
        setError('Gagal mengakses GPS. Pastikan izin lokasi aktif.');
        setLoading(false);
      }
    );
  };

  // Device orientation / compass sensor
  const toggleDeviceCompass = () => {
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DeviceOrientation?.requestPermission === 'function') {
      // iOS 13+ permission
      DeviceOrientation.requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            startCompassListener();
          } else {
            setError('Izin sensor kompas ditolak');
          }
        })
        .catch(() => setError('Gagal mengaktifkan sensor kompas'));
    } else {
      // Android or standard browsers
      startCompassListener();
    }
  };

  const startCompassListener = () => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = null;
      const webkitHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      if (webkitHeading !== undefined) {
        // iOS
        heading = webkitHeading;
      } else if (e.alpha !== null) {
        // Android
        heading = 360 - e.alpha;
      }

      if (heading !== null) {
        setDeviceHeading(heading);
        setIsSensorActive(true);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    setIsSensorActive(true);
    if (onNotify) onNotify('Sensor kompas perangkat aktif');
  };

  // Relative needle angle if device heading is active
  const needleAngle = deviceHeading !== null ? bearing - deviceHeading : bearing;

  const popularCities = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar', 'Yogyakarta'];

  return (
    <div className="app-card p-6 shadow-soft max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-900/20 dark:border-emerald-900/30">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Compass className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-100">Penunjuk Arah Kiblat</h3>
            <p className="text-xs text-slate-400">Arah presisi menuju Ka'bah di Makkah Al-Mukarramah</p>
          </div>
        </div>

        <button
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-medium border border-emerald-700/50 transition-colors"
          title="Deteksi Lokasi GPS"
        >
          <Navigation className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>GPS</span>
        </button>
      </div>

      {/* Search Input & Quick Chips */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Cari kota untuk arah kiblat..."
            className="w-full pl-9 pr-20 py-2 bg-slate-900/60 dark:bg-[#0c1815] border border-emerald-900/40 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-lg font-medium"
          >
            Cari
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Lokasi:</span>
          <span className="text-xs font-bold text-brand-300 capitalize">{cityName}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {popularCities.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCityName(c);
                setError('');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                cityName.toLowerCase() === c.toLowerCase()
                  ? 'bg-brand-500/20 border-brand-500 text-brand-300 font-semibold'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Compass Dial */}
      <div className="flex flex-col items-center justify-center my-6">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Compass Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-800/40 bg-gradient-to-b from-slate-900/80 to-[#0b1b16] shadow-2xl flex items-center justify-center">
            {/* Cardinal Marks */}
            <span className="absolute top-2 text-xs font-bold text-amber-400 tracking-wider">U (0°)</span>
            <span className="absolute right-3 text-xs font-bold text-slate-400">T (90°)</span>
            <span className="absolute bottom-2 text-xs font-bold text-slate-400">S (180°)</span>
            <span className="absolute left-3 text-xs font-bold text-slate-400">B (270°)</span>

            {/* Subtle Degree Ticks */}
            <div className="w-48 h-48 rounded-full border border-dashed border-emerald-900/50 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-emerald-800/20" />
            </div>
          </div>

          {/* Rotating Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out pointer-events-none"
            style={{ transform: `rotate(${needleAngle}deg)` }}
          >
            {/* Kaaba indicator on top */}
            <div className="absolute top-6 flex flex-col items-center">
              <div className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-md mb-1 uppercase tracking-wider">
                Ka'bah
              </div>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[18px] border-b-amber-400" />
            </div>

            {/* Needle Line */}
            <div className="w-1.5 h-44 bg-gradient-to-t from-slate-600 via-emerald-400 to-amber-400 rounded-full shadow-lg" />

            {/* Bottom Tail */}
            <div className="absolute bottom-7 w-2.5 h-2.5 rounded-full bg-slate-600" />
          </div>

          {/* Center Pivot */}
          <div className="relative z-10 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Readout stats */}
        <div className="mt-4 text-center">
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {Math.round(bearing)}° <span className="text-base font-semibold text-amber-300">Barat Laut</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Jarak ke Ka'bah: <strong className="text-slate-200">{distanceKm.toLocaleString('id-ID')} km</strong>
          </p>
        </div>
      </div>

      {/* Sensor toggle button if on mobile / device */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={toggleDeviceCompass}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-colors ${
            isSensorActive
              ? 'bg-brand-500/20 border-brand-500 text-brand-300'
              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>{isSensorActive ? 'Sensor Kompas Aktif' : 'Aktifkan Kompas HP'}</span>
        </button>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Rute di Maps</span>
          </a>
        )}
      </div>

      {/* Guidance Note */}
      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-emerald-900/30 text-[11px] text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Posisikan perangkat Anda secara horizontal di permukaan datar, jauhkan dari benda logam atau medan magnet untuk akurasi optimal.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default QiblaFinder;