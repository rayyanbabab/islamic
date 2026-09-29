export interface PrayerTimes {
  Imsak?: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset?: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string | undefined;
}

export interface PrayerData {
  city: string;
  times: PrayerTimes;
  date: string;
  hijriDate?: string;
}

export interface QuranVerse {
  text: string;
  translation: string;
  surah: string;
  ayah: number;
  surahName: string;
  surahEnglishName?: string;
  audioUrl?: string;
}

export interface Dua {
  id: string;
  title: string;
  category: 'pagi-petang' | 'sholat' | 'harian' | 'perlindungan' | 'makan-minum' | 'sakit-musibah';
  categoryLabel?: string;
  arabic: string;
  translation: string;
  transliteration: string;
  source?: string;
}

export interface SunnahFasting {
  date: string;
  title: string;
  description: string;
  type: 'wajib' | 'sunnah' | 'mustahab';
  hadith?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  numberInSurah?: number;
  text: string;
  translation?: string;
  audio?: string;
  surah?: {
    number: number;
    name: string;
    englishName: string;
  };
}

export interface QuranSearchResult {
  ayah: Ayah;
  matches: string[];
}