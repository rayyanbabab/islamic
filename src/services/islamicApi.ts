import { PrayerData, QuranVerse, Surah, Ayah, QuranSearchResult } from '../types/islamic';

const ALADHAN_API = 'https://api.aladhan.com/v1';
const QURAN_API = 'https://api.alquran.cloud/v1';

// Predefined coordinates for major Indonesian cities for instant offline/reliable fallback
export const INDONESIAN_CITIES: Record<string, { lat: number; lng: number; name: string; province: string }> = {
  jakarta: { lat: -6.2088, lng: 106.8456, name: 'Jakarta', province: 'DKI Jakarta' },
  surabaya: { lat: -7.2575, lng: 112.7521, name: 'Surabaya', province: 'Jawa Timur' },
  bandung: { lat: -6.9175, lng: 107.6191, name: 'Bandung', province: 'Jawa Barat' },
  medan: { lat: 3.5952, lng: 98.6722, name: 'Medan', province: 'Sumatera Utara' },
  semarang: { lat: -6.9932, lng: 110.4203, name: 'Semarang', province: 'Jawa Tengah' },
  makassar: { lat: -5.1477, lng: 119.4327, name: 'Makassar', province: 'Sulawesi Selatan' },
  palembang: { lat: -2.9761, lng: 104.7754, name: 'Palembang', province: 'Sumatera Selatan' },
  yogyakarta: { lat: -7.7956, lng: 110.3695, name: 'Yogyakarta', province: 'DI Yogyakarta' },
  surakarta: { lat: -7.5666, lng: 110.8167, name: 'Solo / Surakarta', province: 'Jawa Tengah' },
  malang: { lat: -7.9666, lng: 112.6326, name: 'Malang', province: 'Jawa Timur' },
  denpasar: { lat: -8.6500, lng: 115.2167, name: 'Denpasar', province: 'Bali' },
  balikpapan: { lat: -1.2379, lng: 116.8529, name: 'Balikpapan', province: 'Kalimantan Timur' },
  samarinda: { lat: -0.5016, lng: 117.1265, name: 'Samarinda', province: 'Kalimantan Timur' },
  banjarmasin: { lat: -3.3194, lng: 114.5908, name: 'Banjarmasin', province: 'Kalimantan Selatan' },
  pontianak: { lat: -0.0263, lng: 109.3425, name: 'Pontianak', province: 'Kalimantan Barat' },
  manado: { lat: 1.4748, lng: 124.8421, name: 'Manado', province: 'Sulawesi Utara' },
  pekanbaru: { lat: 0.5071, lng: 101.4478, name: 'Pekanbaru', province: 'Riau' },
  padang: { lat: -0.9471, lng: 100.4172, name: 'Padang', province: 'Sumatera Barat' },
  bandar_lampung: { lat: -5.4297, lng: 105.2625, name: 'Bandar Lampung', province: 'Lampung' },
  serang: { lat: -6.1104, lng: 106.1640, name: 'Serang', province: 'Banten' },
  tangerang: { lat: -6.1783, lng: 106.6319, name: 'Tangerang', province: 'Banten' },
  bekasi: { lat: -6.2383, lng: 106.9756, name: 'Bekasi', province: 'Jawa Barat' },
  depok: { lat: -6.4025, lng: 106.7942, name: 'Depok', province: 'Jawa Barat' },
  bogor: { lat: -6.5971, lng: 106.8060, name: 'Bogor', province: 'Jawa Barat' },
  aceh: { lat: 5.5483, lng: 95.3238, name: 'Banda Aceh', province: 'Aceh' },
  mataram: { lat: -8.5768, lng: 116.0999, name: 'Mataram', province: 'NTB' },
  kupang: { lat: -10.1772, lng: 123.6070, name: 'Kupang', province: 'NTT' },
  ambon: { lat: -3.6547, lng: 128.1906, name: 'Ambon', province: 'Maluku' },
  jayapura: { lat: -2.5916, lng: 140.6690, name: 'Jayapura', province: 'Papua' }
};

// Clean time format like "04:35 (WIB)" -> "04:35"
const cleanTime = (timeStr?: string): string => {
  if (!timeStr) return '--:--';
  return timeStr.split(' ')[0].slice(0, 5);
};

export const getPrayerTimes = async (cityName: string): Promise<PrayerData | null> => {
  const normalizedKey = cityName.toLowerCase().trim();
  const cacheKey = `prayer_times_${normalizedKey}_${new Date().toISOString().slice(0, 10)}`;
  
  // Try local cache first for instant speed
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore cache error
  }

  try {
    const cityInfo = INDONESIAN_CITIES[normalizedKey];
    let url = `${ALADHAN_API}/timingsByCity?city=${encodeURIComponent(cityName)}&country=Indonesia&method=11`; // Method 11 = Majlis Ugama Islam Singapura / Kemenag friendly

    if (cityInfo) {
      url = `${ALADHAN_API}/timings?latitude=${cityInfo.lat}&longitude=${cityInfo.lng}&method=11`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200 && data.data) {
      const timings = data.data.timings;
      const hijri = data.data.date.hijri;
      const hijriFormatted = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;

      const result: PrayerData = {
        city: cityInfo ? cityInfo.name : cityName,
        times: {
          Imsak: cleanTime(timings.Imsak),
          Fajr: cleanTime(timings.Fajr),
          Sunrise: cleanTime(timings.Sunrise),
          Dhuhr: cleanTime(timings.Dhuhr),
          Asr: cleanTime(timings.Asr),
          Sunset: cleanTime(timings.Sunset),
          Maghrib: cleanTime(timings.Maghrib),
          Isha: cleanTime(timings.Isha),
        },
        date: data.data.date.readable,
        hijriDate: hijriFormatted
      };

      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        // Ignore cache write error
      }

      return result;
    }
    return null;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
};

export const getPrayerTimesByCoordinates = async (lat: number, lng: number): Promise<PrayerData | null> => {
  try {
    const url = `${ALADHAN_API}/timings?latitude=${lat}&longitude=${lng}&method=11`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200 && data.data) {
      const timings = data.data.timings;
      const hijri = data.data.date.hijri;
      const hijriFormatted = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;

      return {
        city: 'Lokasi Anda (GPS)',
        times: {
          Imsak: cleanTime(timings.Imsak),
          Fajr: cleanTime(timings.Fajr),
          Sunrise: cleanTime(timings.Sunrise),
          Dhuhr: cleanTime(timings.Dhuhr),
          Asr: cleanTime(timings.Asr),
          Sunset: cleanTime(timings.Sunset),
          Maghrib: cleanTime(timings.Maghrib),
          Isha: cleanTime(timings.Isha),
        },
        date: data.data.date.readable,
        hijriDate: hijriFormatted
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching prayer times by coords:', error);
    return null;
  }
};

// Fallback curated inspirational verses
const FALLBACK_VERSES: QuranVerse[] = [
  {
    text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Maka sesungguhnya bersama kesulitan ada kemudahan, sesungguhnya bersama kesulitan ada kemudahan.",
    surah: "94",
    ayah: 5,
    surahName: "Al-Insyirah",
    surahEnglishName: "Ash-Sharh"
  },
  {
    text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
    surah: "2",
    ayah: 286,
    surahName: "Al-Baqarah",
    surahEnglishName: "Al-Baqarah"
  },
  {
    text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku adalah dekat. Aku mengabulkan permohonan orang yang berdoa apabila ia memohon kepada-Ku.",
    surah: "2",
    ayah: 186,
    surahName: "Al-Baqarah",
    surahEnglishName: "Al-Baqarah"
  },
  {
    text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    translation: "Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.",
    surah: "3",
    ayah: 173,
    surahName: "Ali 'Imran",
    surahEnglishName: "Aal-i-Imraan"
  }
];

export const getRandomQuranVerse = async (): Promise<QuranVerse> => {
  try {
    const randomSurah = Math.floor(Math.random() * 114) + 1;
    const surahResponse = await fetch(`${QURAN_API}/surah/${randomSurah}`);
    const surahData = await surahResponse.json();

    if (surahData.code === 200) {
      const totalAyahs = surahData.data.numberOfAyahs;
      const randomAyah = Math.floor(Math.random() * totalAyahs) + 1;

      const [arabicRes, translRes] = await Promise.all([
        fetch(`${QURAN_API}/ayah/${randomSurah}:${randomAyah}`),
        fetch(`${QURAN_API}/ayah/${randomSurah}:${randomAyah}/id.indonesian`)
      ]);

      const arabicData = await arabicRes.json();
      const translData = await translRes.json();

      if (arabicData.code === 200 && translData.code === 200) {
        return {
          text: arabicData.data.text,
          translation: translData.data.text,
          surah: randomSurah.toString(),
          ayah: randomAyah,
          surahName: arabicData.data.surah.englishName,
          surahEnglishName: arabicData.data.surah.englishName,
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${arabicData.data.number}.mp3`
        };
      }
    }
  } catch (error) {
    console.warn('Using fallback Quran verse:', error);
  }

  // Graceful fallback
  const fallback = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
  return fallback;
};

export const getAllSurahs = async (): Promise<Surah[]> => {
  const cacheKey = 'quran_all_surahs_v2';
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore cache error
  }

  try {
    const response = await fetch(`${QURAN_API}/surah`);
    const data = await response.json();

    if (data.code === 200) {
      const surahs: Surah[] = data.data.map((surah: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        numberOfAyahs: number;
        revelationType: string;
      }) => ({
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'
      }));

      try {
        localStorage.setItem(cacheKey, JSON.stringify(surahs));
      } catch {
        // Ignore cache write error
      }

      return surahs;
    }
    return [];
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
};

export const getSurahWithTranslation = async (surahNumber: number): Promise<{ arabic: Ayah[]; translation: Ayah[] } | null> => {
  const cacheKey = `quran_surah_${surahNumber}_v2`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore cache error
  }

  try {
    const [arabicRes, translRes] = await Promise.all([
      fetch(`${QURAN_API}/surah/${surahNumber}`),
      fetch(`${QURAN_API}/surah/${surahNumber}/id.indonesian`)
    ]);

    const arabicData = await arabicRes.json();
    const translData = await translRes.json();

    if (arabicData.code === 200 && translData.code === 200) {
      const result = {
        arabic: arabicData.data.ayahs.map((ayah: { number: number; numberInSurah: number; text: string }) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`
        })),
        translation: translData.data.ayahs.map((ayah: { number: number; numberInSurah: number; text: string }) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text
        }))
      };

      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        // Ignore cache write error
      }

      return result;
    }
    return null;
  } catch (error) {
    console.error('Error fetching surah details:', error);
    return null;
  }
};

export const searchQuran = async (query: string): Promise<QuranSearchResult[]> => {
  try {
    const response = await fetch(`${QURAN_API}/search/${encodeURIComponent(query)}/all/id.indonesian`);
    const data = await response.json();

    if (data.code === 200 && data.data && data.data.matches) {
      return data.data.matches.slice(0, 30).map((match: {
        numberInSurah: number;
        text: string;
        surah: { number: number; name: string; englishName: string };
        matches?: string[];
      }) => ({
        ayah: {
          number: match.numberInSurah,
          text: match.text,
          surah: {
            number: match.surah.number,
            name: match.surah.name,
            englishName: match.surah.englishName
          }
        },
        matches: match.matches ? match.matches : [match.text]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching Quran:', error);
    return [];
  }
};

export const getQiblaDirection = (
  latitude: number,
  longitude: number
): { url: string; bearing: number; distanceKm: number } => {
  // Kaaba coordinates (Masjidil Haram, Makkah)
  const kaabaLat = 21.422487;
  const kaabaLng = 39.826206;

  // Bearing calculation
  const dLng = ((kaabaLng - longitude) * Math.PI) / 180;
  const lat1 = (latitude * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  const qiblaDirection = (bearing + 360) % 360;

  // Haversine distance formula to Kaaba
  const R = 6371; // Earth radius in km
  const dLat = lat2 - lat1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return {
    url: `https://www.google.com/maps/dir/${latitude},${longitude}/${kaabaLat},${kaabaLng}`,
    bearing: qiblaDirection,
    distanceKm
  };
};