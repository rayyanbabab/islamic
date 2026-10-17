# 🕌 NOOR - Islamic Companion Web App

<div align="center">

![NOOR Banner](https://raw.githubusercontent.com/rayyanbabab/islamic/main/public/vite.svg)

### **Aplikasi Web Muslim Terpadu untuk Menemani Ibadah Harian**

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-059669?style=for-the-badge&logo=vercel)](https://islamic-dev.netlify.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

**[🌐 Kunjungi Aplikasi Live](https://islamic-dev.netlify.app)** • **[✨ Fitur Utama](#-fitur-utama)** • **[🚀 Cara Menjalankan](#-panduan-instalasi--penggunaan)** • **[📂 Struktur Proyek](#-struktur-proyek)**

</div>

---

## 📖 Tentang Aplikasi

**NOOR** adalah platform web Islami modern yang dirancang untuk memudahkan umat Muslim dalam menjalankan ibadah harian. Dengan antarmuka yang bersih, elegan, dan responsif, NOOR menyatukan berbagai kebutuhan spiritual harian dalam satu tempat—mulai dari jadwal shalat yang akurat, pembaca Al-Quran digital 30 Juz dengan audio, penunjuk arah kiblat presisi, panduan doa & dzikir, 99 Asmaul Husna, kalender puasa sunnah, hingga tasbih digital interaktif.

Aplikasi ini dibangun menggunakan arsitektur modern berbasis **React 18**, **TypeScript**, dan **Tailwind CSS**, dengan optimasi performa tinggi via **Vite** serta dukungan **Dark Mode** dan **Light Mode** yang nyaman di mata.

---

## ✨ Fitur-Fitur Utama

### 1. 🕐 Jadwal Shalat Otomatis & Suara Adzan
- **Akurasi Berdasarkan Lokasi**: Menghitung waktu shalat presisi menggunakan koordinat GPS (Geolocation) atau pencarian kota di Indonesia dan dunia.
- **Waktu Lengkap**: Menampilkan waktu Subuh, Terbit, Dzuhur, Ashar, Maghrib, Isya, serta Imsak.
- **Countdown Shalat Berikutnya**: Penghitung waktu mundur interaktif menuju waktu shalat selanjutnya.
- **Audio Notifikasi Adzan**: Pengingat suara adzan dan nada pengingat ketika waktu shalat telah tiba.

### 2. 📖 Al-Quran Digital 30 Juz & Audio Murottal
- **Teks Arab Jernih**: Tipografi ayat Al-Quran menggunakan font standar Mushaf yang nyaman dibaca berharakat lengkap.
- **Terjemahan & Transliterasi**: Dilengkapi terjemahan resmi Bahasa Indonesia (Kemenag) dan teks latin pembantu bacaan.
- **Audio Murottal**: Dengarkan lantunan ayat per surah maupun per ayat dari qari ternama (Mishary Rashid Alafasy).
- **Pencarian Cepat**: Cari surah berdasarkan nama arab, latin, atau nomor surah dengan mudah.
- **Bookmark & Terakhir Dibaca**: Simpan ayat favorit dan lanjutkan membaca dari ayat terakhir yang disimpan di penyimpanan lokal (LocalStorage).

### 3. 🤲 Koleksi Doa & Dzikir Harian
- **Koleksi Lengkap**: Ratusan doa pilihan sehari-hari yang bersumber dari Al-Quran dan Hadits shahih (Bukhari, Muslim, Tirmidzi, dll.).
- **Kategori Terorganisir**: Dikelompokkan rapi (Doa Pagi & Petang, Shalat, Rumah Tangga, Perlindungan, dan Keseharian).
- **Teks Arab, Latin & Arti**: Memudahkan pemahaman makna doa yang dibaca.
- **Salin Cepat (Copy to Clipboard)**: Salin teks doa beserta terjemahannya hanya dengan satu klik untuk dibagikan ke keluarga dan kerabat.

### 4. 🌟 99 Asmaul Husna
- **Nama-Nama Agung Allah SWT**: Menampilkan 99 Asmaul Husna lengkap dengan teks Arab bergaya kaligrafi.
- **Makna & Penjelasan**: Dilengkapi pelafalan transliterasi serta penjabaran arti dalam Bahasa Indonesia.
- **Pencarian Cepat**: Temukan Asmaul Husna tertentu dengan fitur pencarian real-time.

### 5. 🧭 Penunjuk Arah Kiblat Interaktif (Qibla Compass)
- **Kompas Presisi**: Menghitung sudut derajat azimuth Ka'bah (Makkah) secara matematis berdasarkan koordinat pengguna.
- **Sensor Perangkat**: Terintegrasi dengan sensor kompas orientasi (DeviceOrientation API) pada smartphone / tablet.
- **Indikator Visual**: Tampilan kompas dinamis yang berputar secara real-time mengarahkan pengguna tepat ke kiblat.

### 6. 🌙 Kalender & Panduan Puasa Sunnah
- **Jadwal Puasa Terjadwal**: Informasi waktu puasa Senin & Kamis, Ayyamul Bidh (13, 14, 15 Hijriah), Asyura, Arafah, Puasa Syawal, dan lainnya.
- **Niat & Doa Buka Puasa**: Teks Arab, Latin, dan terjemahan niat puasa sunnah.
- **Fadhilah & Keutamaan**: Penjelasan dalil hadits mengenai keutamaan melaksanakan masing-masing puasa.

### 7. 📿 Tasbih Digital Interaktif
- **Penghitung Sentuh Cerdas**: Menghitung dzikir dengan animasi visual yang memuaskan dan feedback getar (Haptic Feedback) pada perangkat mobile.
- **Target Dzikir Fleksibel**: Pilihan target hitungan (33x, 99x, 100x, atau tanpa batas).
- **Pilihan Bacaan Dzikir**: Preset dzikir seperti *Subhanallah*, *Alhamdulillah*, *Allahu Akbar*, *Astaghfirullah*, dan *La ilaha illallah*.
- **Penyimpanan Riwayat**: Jumlah total dzikir harian tersimpan aman di browser.

### 8. 🌓 Tema Dinamis (Dark & Light Mode)
- **Dark Mode Islami**: Nuansa emerald gelap dipadu aksen emas mewah yang ramah untuk penggunaan malam hari.
- **Light Mode Segar**: Tampilan bersih, minimalis, dan kontras tinggi untuk penggunaan siang hari.
- **Penyimpanan Preferensi**: Tema otomatis diingat saat membuka aplikasi kembali.

---

## 🛠️ Arsitektur & Teknologi

| Bagian | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Library UI berbasis komponen fungsional modern |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safety, maintainability, dan penanganan bug dini |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utilitas CSS modern dengan variabel tema dan glassmorphism |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | Bundler kilat generasi terbaru dengan Fast Refresh (HMR) |
| **Icons** | [Lucide React](https://lucide.dev/) | Kumpulan ikon minimalis, konsisten, dan ringan |
| **APIs** | Aladhan & Quran Public API | Sumber data jadwal shalat akurat dan konten Al-Quran |
| **Deployment** | [Netlify](https://www.netlify.com/) / [Vercel](https://vercel.com/) | Hosting performa tinggi dengan CDN global |

---

## 🚀 Panduan Instalasi & Penggunaan

### Prasyarat
Pastikan komputer Anda sudah terpasang:
- **Node.js** (versi 18 ke atas disarankan)
- **npm** atau **yarn** / **pnpm**
- **Git**

### 1. Kloning Repositori
```bash
git clone https://github.com/rayyanbabab/islamic.git
cd islamic
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Buka browser dan akses alamat lokal yang muncul di terminal (biasanya `http://localhost:5173`).

### 4. Build untuk Lingkungan Produksi
```bash
# Menjalankan build optimasi
npm run build

# Menguji hasil build secara lokal
npm run preview
```

### 5. Pemeriksaan Kualitas Kode (Linting)
```bash
npm run lint
```

---

## 📂 Struktur Proyek

```text
dev-islamic/
├── public/                 # Aset publik statis (favicon, logo, manifest)
├── src/
│   ├── components/         # Komponen UI utama
│   │   ├── AsmaulHusna.tsx   # Modul daftar dan pencarian 99 Asmaul Husna
│   │   ├── DailyDua.tsx     # Modul kumpulan doa harian & dzikir
│   │   ├── Icons.tsx        # Ikon kustom SVG Islami (Noor, Tasbih, Rub El Hizb)
│   │   ├── Navbar.tsx       # Header navigasi desktop & bottom bar mobile
│   │   ├── PrayerTimes.tsx  # Jadwal shalat, hitung mundur & audio adzan
│   │   ├── QiblaFinder.tsx  # Kompas interaktif penunjuk kiblat
│   │   ├── QuranReader.tsx  # Pembaca Al-Quran 30 Juz & audio murottal
│   │   ├── QuranVerse.tsx   # Widget inspirasi ayat harian (Ayat of the Day)
│   │   ├── SunnahFasting.tsx# Kalender dan panduan puasa sunnah
│   │   ├── TasbihCounter.tsx# Penghitung tasbih digital interaktif
│   │   └── Toast.tsx        # Komponen pop-up notifikasi cepat
│   ├── data/               # Basis data lokal statis
│   │   ├── duas.ts          # Koleksi doa & sanad hadits
│   │   └── sunnahFasting.ts # Data panduan & tanggal puasa sunnah
│   ├── services/           # Logika interaksi API luar
│   │   └── islamicApi.ts    # Service pengambilan jadwal shalat & Quran
│   ├── types/              # Definisi interface & type TypeScript
│   │   └── islamic.ts       # Type definitions untuk doa, waktu shalat, dll.
│   ├── App.tsx             # Komponen utama & router halaman aplikasi
│   ├── main.tsx            # Entry point React
│   └── index.css           # Styling global & desain kustom Tailwind
├── index.html              # Template halaman HTML utama
├── package.json            # Daftar dependensi & script proyek
├── tailwind.config.js      # Konfigurasi Tailwind & warna kustom
├── tsconfig.json           # Konfigurasi TypeScript
└── vite.config.ts          # Konfigurasi bundler Vite
```

---

## 📱 Responsivitas & Desain Antarmuka

- **Mobile First**: Navigasi bawah (*Bottom Navigation Bar*) yang ramah jempol untuk kenyamanan penggunaan di smartphone.
- **Desktop & Tablet Optimized**: Tata letak grid elegan dengan *Top Header Navigation* yang luas dan informatif.
- **Glassmorphism & Micro-Interactions**: Efek bayangan halus, transisi mulus, dan kartu interaktif yang memanjakan mata tanpa mengorbankan kecepatan akses.

---

## 🤝 Berkontribusi

Kontribusi dari siapa pun selalu disambut baik dengan tangan terbuka! Jika Anda memiliki saran perbaikan, fitur baru, atau perbaikan bug:

1. **Fork** repositori ini
2. Buat branch baru untuk fitur Anda:
   ```bash
   git checkout -b fitur/fitur-baru-anda
   ```
3. Lakukan commit perubahan Anda:
   ```bash
   git commit -m "feat: menambahkan fitur baru yang bermanfaat"
   ```
4. Push branch ke akun GitHub Anda:
   ```bash
   git push origin fitur/fitur-baru-anda
   ```
5. Buat **Pull Request** di repositori utama

---

## 📄 Lisensi

Proyek ini didistribusikan di bawah lisensi **MIT License**. Silakan baca file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

## 🤲 Doa & Penutup

<div align="center">

> *"Barangsiapa yang menunjuki kepada kebaikan maka dia akan mendapatkan pahala seperti pahala orang yang mengerjakannya."*  
> **(HR. Muslim no. 1893)**

Semoga aplikasi **NOOR** ini dapat membawa manfaat yang luas bagi kita semua dalam meningkatkan kualitas ibadah dan mendekatkan diri kepada Allah Subhanahu Wa Ta'ala.

**Dibuat dengan segenap cinta & dedikasi untuk Ummat.**

[Kembali ke Atas ⬆️](#-noor---islamic-companion-web-app)

</div>
