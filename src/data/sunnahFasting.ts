import { SunnahFasting } from '../types/islamic';

export const getSunnahFastingList = (): SunnahFasting[] => {
  return [
    {
      date: 'Setiap Hari Senin & Kamis',
      title: 'Puasa Sunnah Senin - Kamis',
      description: 'Amalan para nabi dan hari di mana amalan manusia diperlihatkan kepada Allah Ta\'ala.',
      type: 'sunnah',
      hadith: 'Dari Abu Hurairah, Rasulullah SAW bersabda: "Pintu-pintu surga dibuka pada hari Senin dan Kamis..." (HR. Muslim no. 2565)'
    },
    {
      date: 'Tanggal 13, 14, 15 Setiap Bulan Hijriah',
      title: 'Puasa Ayyamul Bidh (Hari-hari Putih)',
      description: 'Puasa pada pertengahan bulan saat rembulan bersinar penuh. Pahalanya seperti berpuasa sepanjang tahun.',
      type: 'sunnah',
      hadith: 'Rasulullah SAW berpesan: "Jika engkau berpuasa tiga hari tiap bulan, maka berpuasalah pada tanggal 13, 14, dan 15." (HR. Tirmidzi no. 761)'
    },
    {
      date: '9 Dzulhijjah (Menjelang Idul Adha)',
      title: 'Puasa Hari Arafah',
      description: 'Sangat dianjurkan bagi yang tidak sedang menunaikan ibadah haji di padang Arafah.',
      type: 'sunnah',
      hadith: '"Puasa Arafah dapat menghapuskan dosa setahun yang lalu dan setahun yang akan datang." (HR. Muslim no. 1162)'
    },
    {
      date: '9 & 10 Muharram',
      title: 'Puasa Tasu\'a & Asyura',
      description: 'Puasa pada hari Asyura menghapuskan dosa setahun yang lalu, disunnahkan berpuasa hari ke-9 untuk membedakan diri dari kaum Yahudi.',
      type: 'sunnah',
      hadith: '"Puasa hari Asyura, aku berharap kepada Allah dapat menghapuskan dosa setahun sebelumnya." (HR. Muslim no. 1162)'
    },
    {
      date: '6 Hari di Bulan Syawwal',
      title: 'Puasa 6 Hari Syawwal',
      description: 'Berpuasa 6 hari setelah Idul Fitri (boleh berturut-turut atau terpisah). Menyempurnakan puasa Ramadhan seperti puasa setahun penuh.',
      type: 'sunnah',
      hadith: '"Barangsiapa berpuasa Ramadhan kemudian mengikutinya dengan 6 hari di bulan Syawwal, maka pahalanya seperti puasa setahun." (HR. Muslim)'
    },
    {
      date: 'Bulan Sya\'ban',
      title: 'Puasa Sunnah Bulan Sya\'ban',
      description: 'Memperbanyak puasa di bulan Sya\'ban sebagai persiapan menyambut bulan suci Ramadhan.',
      type: 'mustahab',
      hadith: 'Aisyah RA berkata: "Aku tidak pernah melihat Rasulullah berpuasa sebulan penuh kecuali Ramadhan, dan tidak melihat beliau berpuasa lebih banyak daripada di bulan Sya\'ban." (HR. Bukhari)'
    },
    {
      date: '1 - 29/30 Ramadhan',
      title: 'Puasa Wajib Ramadhan',
      description: 'Kewajiban rukun Islam bagi setiap Muslim yang baligh dan berakal.',
      type: 'wajib',
      hadith: '"Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang sebelum kamu agar kamu bertakwa." (QS. Al-Baqarah: 183)'
    }
  ];
};

export const getSunnahFastingForMonth = (): SunnahFasting[] => {
  return getSunnahFastingList();
};