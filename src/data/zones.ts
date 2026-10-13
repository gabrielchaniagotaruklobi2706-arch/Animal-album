import { ZooZone } from '../types';

export const ZOO_ZONES: ZooZone[] = [
  {
    id: 'sabana',
    name: {
      id: 'Sabana Afrika',
      en: 'African Savanna',
    },
    emoji: '🦁',
    tagline: {
      id: 'Padang Rumput Luas Raja Rimba',
      en: 'Expansive Plains of the Lion King',
    },
    description: {
      id: 'Habitat padang rumput hangat tempat tinggal kawanan singa, gajah perkasa, jerapah menjulang, dan zebra berlari bebas.',
      en: 'Warm grassland habitat home to lion prides, mighty elephants, towering giraffes, and free-roaming zebras.',
    },
    color: 'from-amber-600 to-yellow-600',
    mapCoordinates: { x: 28, y: 35 },
    iconName: 'Sun',
    temperature: '32°C - Tropis Kering',
    animalCount: 4,
  },
  {
    id: 'rainforest',
    name: {
      id: 'Hutan Hujan Tropis',
      en: 'Tropical Rainforest',
    },
    emoji: '🌴',
    tagline: {
      id: 'Kanopi Rimbun & Satwa Endemik',
      en: 'Lush Canopies & Endemic Wildlife',
    },
    description: {
      id: 'Kawasan tropis lembap dengan pepohonan kanopi tinggi, rumah bagi harimau, orangutan cerdas, dan panda pemakan bambu.',
      en: 'Humid tropical sanctuary with towering canopy trees, home to tigers, intelligent orangutans, and bamboo-eating giant pandas.',
    },
    color: 'from-emerald-700 to-green-600',
    mapCoordinates: { x: 55, y: 25 },
    iconName: 'Trees',
    temperature: '26°C - Lembap Sejuk',
    animalCount: 3,
  },
  {
    id: 'ocean',
    name: {
      id: 'Samudra & Pesisir',
      en: 'Ocean & Coastlines',
    },
    emoji: '🐬',
    tagline: {
      id: 'Pesona Bawah Laut & Satwa Cerdas',
      en: 'Underwater Wonder & Intelligent Marine Life',
    },
    description: {
      id: 'Laguna air asin sebening kristal dengan terumbu karang buatan, menampilkan atraksi lumba-lumba lincah dan penyu laut.',
      en: 'Crystal clear saltwater lagoon with artificial reefs, featuring agile dolphins, sea turtles, and marine life.',
    },
    color: 'from-cyan-600 to-blue-700',
    mapCoordinates: { x: 78, y: 48 },
    iconName: 'Waves',
    temperature: '22°C - Suhu Air',
    animalCount: 2,
  },
  {
    id: 'arctic',
    name: {
      id: 'Kutub Salju Arktik',
      en: 'Arctic Tundra',
    },
    emoji: '❄️',
    tagline: {
      id: 'Negeri Es Abadi & Salju Putih',
      en: 'Eternal Ice & Frost Sanctuary',
    },
    description: {
      id: 'Kubah iklim es dingin khusus untuk kawanan penguin kaisar yang lucu dan serigala kutub berbulu putih salju.',
      en: 'Sub-zero climate dome tailored for playful emperor penguin colonies and thick-furred arctic wolves.',
    },
    color: 'from-sky-400 to-indigo-600',
    mapCoordinates: { x: 42, y: 75 },
    iconName: 'Snowflake',
    temperature: '-4°C - Kubah Es',
    animalCount: 2,
  },
  {
    id: 'aviary',
    name: {
      id: 'Kubah Burung Langit',
      en: 'Sanctuary Aviary',
    },
    emoji: '🦜',
    tagline: {
      id: 'Kicauan Merdu & Sayap Warna-Warni',
      en: 'Melodic Calls & Vibrant Wings',
    },
    description: {
      id: 'Kandang terbang raksasa bebas sangkar dengan pepohonan bunga, air terjun buatan, dan elang langka kebanggaan nusantara.',
      en: 'Huge walk-in flight aviary with flowering trees, cascading waterfalls, and majestic raptors like the Javan Hawk-eagle.',
    },
    color: 'from-teal-600 to-emerald-500',
    mapCoordinates: { x: 75, y: 18 },
    iconName: 'Feather',
    temperature: '27°C - Semilir',
    animalCount: 2,
  },
  {
    id: 'reptile',
    name: {
      id: 'Lembah Reptil Purba',
      en: 'Ancient Reptile Haven',
    },
    emoji: '🐊',
    tagline: {
      id: 'Sang Predator Zaman Purba',
      en: 'Predators from the Prehistoric Era',
    },
    description: {
      id: 'Rawa hangat dengan pulau berpasir untuk buaya raksasa, komodo naga purba, dan kura-kura raksasa aldabra.',
      en: 'Warm marshlands and sandbanks engineered for giant saltwater crocodiles, Komodo dragons, and Aldabra giant tortoises.',
    },
    color: 'from-amber-700 to-stone-700',
    mapCoordinates: { x: 18, y: 68 },
    iconName: 'Shield',
    temperature: '34°C - Hangat Tropis',
    animalCount: 2,
  },
];
