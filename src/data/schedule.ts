import { ShowSchedule } from '../types';

export const SHOW_SCHEDULES: ShowSchedule[] = [
  {
    id: 's1',
    time: '09:30',
    title: {
      id: 'Sarapan Bersama Jerapah Tinggi',
      en: 'Breakfast with the Towering Giraffes',
    },
    zoneId: 'sabana',
    location: {
      id: 'Platform Menara Sabana',
      en: 'Savanna Overlook Deck',
    },
    animalEmoji: '🦒',
    description: {
      id: 'Beri makan dedaunan akasia langsung dari tangan Anda ke jerapah ramah di platform pengamatan tinggi.',
      en: 'Hand-feed fresh acacia leaves directly to friendly giraffes from the elevated observation deck.',
    },
  },
  {
    id: 's2',
    time: '10:30',
    title: {
      id: 'Mandi Pagi & Interaksi Gajah',
      en: 'Morning Splash & Elephant Sanctuary',
    },
    zoneId: 'sabana',
    location: {
      id: 'Danau Lumpur Gajah',
      en: 'Elephant Oasis Pool',
    },
    animalEmoji: '🐘',
    description: {
      id: 'Saksikan kawanan gajah bermain air, mandi lumpur pelindung kulit, dan penjelasan edukasi dari pawang konservasi.',
      en: 'Watch the gentle giants play in cool water, coat in protective mud, accompanied by keeper insights.',
    },
  },
  {
    id: 's3',
    time: '11:15',
    title: {
      id: 'Waktu Makan Singa: Raja Rimba',
      en: 'Lion Feeding: Kings of the Plains',
    },
    zoneId: 'sabana',
    location: {
      id: 'Kubah Kaca Singa Afrika',
      en: 'Safari Pride Enclosure',
    },
    animalEmoji: '🦁',
    description: {
      id: 'Lihat ketangkasan singa melompat dan mendengar auman menggelegar saat sesi pengayaan makanan.',
      en: 'Witness explosive leaping strength and spine-chilling roars during the keeper enrichment session.',
    },
  },
  {
    id: 's4',
    time: '12:00',
    title: {
      id: 'Atraksi Lumba-Lumba Cerdas & Bahari',
      en: 'Intelligent Dolphins & Marine Theatre',
    },
    zoneId: 'ocean',
    location: {
      id: 'Amfiteater Samudra Biru',
      en: 'Blue Lagoon Amphitheatre',
    },
    animalEmoji: '🐬',
    description: {
      id: 'Lompatan akrobatik spektakuler, ekolokasi suara, dan pesan penting menjaga kebersihan terumbu karang laut.',
      en: 'Breathtaking acrobatic breaches, bio-sonar demos, and inspiring ocean conservation talks.',
    },
  },
  {
    id: 's5',
    time: '14:00',
    title: {
      id: 'Penguin Splash & Pesta Ikan Krill',
      en: 'Penguin Splash & Krill Feast',
    },
    zoneId: 'arctic',
    location: {
      id: 'Kubah Salju Arktik',
      en: 'Sub-Zero Frost Dome',
    },
    animalEmoji: '🐧',
    description: {
      id: 'Penguin kaisar meluncur di atas es dan berenang secepat torpedo menyambar ikan segar.',
      en: 'Emperor penguins belly-sliding across ice and diving like underwater torpedoes for fresh fish.',
    },
  },
  {
    id: 's6',
    time: '15:15',
    title: {
      id: 'Pesta Buah Orangutan & Pohon Kanopi',
      en: 'Orangutan Canopy Fruit Fiesta',
    },
    zoneId: 'rainforest',
    location: {
      id: 'Jembatan Gantung Kanopi',
      en: 'Canopy Canopy Skywalk',
    },
    animalEmoji: '🦧',
    description: {
      id: 'Aksi berayun lincah orangutan mencari buah tersembunyi dengan memecahkan teka-teki bambu buatan.',
      en: 'Intelligent foraging agility as orangutans solve puzzle-feeders in the towering rainforest trees.',
    },
  },
];
