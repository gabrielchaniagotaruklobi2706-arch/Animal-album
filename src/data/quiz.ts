import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    animalEmoji: '🦁',
    question: {
      id: 'Berapa jarak maksimal suara auman singa jantan dapat terdengar di padang rumput bebas?',
      en: 'What is the maximum distance a male lion\'s roar can be heard across open plains?',
    },
    options: {
      id: ['Sekitar 500 meter', 'Hingga 2 kilometer', 'Hingga 8 kilometer', 'Hingga 20 kilometer'],
      en: ['About 500 meters', 'Up to 2 kilometers', 'Up to 8 kilometers (5 miles)', 'Up to 20 kilometers'],
    },
    correctIndex: 2,
    explanation: {
      id: 'Auman singa jantan sangat menggelegar dan dapat terdengar hingga radius 8 km untuk menandai wilayah kekuasaan kelompoknya.',
      en: 'A male lion\'s roar can reach an astonishing 114 decibels and carry up to 8 kilometers (5 miles) to declare pride territory.',
    },
  },
  {
    id: 2,
    animalEmoji: '🦒',
    question: {
      id: 'Berapa rata-rata waktu tidur yang dibutuhkan oleh seekor jerapah dalam satu hari?',
      en: 'Approximately how much total sleep does a wild giraffe need per day?',
    },
    options: {
      id: ['Hanya sekitar 30 menit', 'Sekitar 8 jam', 'Sekitar 14 jam', 'Sekitar 20 jam'],
      en: ['Only about 30 minutes', 'Around 8 hours', 'Around 14 hours', 'Around 20 hours'],
    },
    correctIndex: 0,
    explanation: {
      id: 'Jerapah hanya tidur sekitar 30 menit per hari, biasanya dalam interval singkat 5 menit sambil tetap waspada terhadap predator!',
      en: 'Giraffes survive on as little as 30 minutes of sleep daily, divided into 5-minute micro-naps to remain alert against predators.',
    },
  },
  {
    id: 3,
    animalEmoji: '🐬',
    question: {
      id: 'Bagaimana cara unik lumba-lumba tidur di dalam air tanpa tenggelam?',
      en: 'How do dolphins uniquely sleep in the ocean without drowning?',
    },
    options: {
      id: [
        'Mengubur diri dalam pasir laut',
        'Mematikan setengah belahan otaknya secara bergantian',
        'Berhenti bernapas selama 8 jam',
        'Tidur di atas punggung penyu',
      ],
      en: [
        'Burying themselves in sand',
        'Shutting down one hemisphere of their brain at a time',
        'Holding their breath for 8 hours straight',
        'Riding on top of sea turtles',
      ],
    },
    correctIndex: 1,
    explanation: {
      id: 'Lumba-lumba mengalami "unihemispheric sleep", yaitu tidur dengan setengah otak beristirahat sementara setengahnya lagi tetap mengontrol pernapasan ke permukaan air.',
      en: 'Dolphins practice unihemispheric slow-wave sleep: one half of the brain sleeps while the other remains alert to swim and surface for oxygen.',
    },
  },
  {
    id: 4,
    animalEmoji: '🐼',
    question: {
      id: 'Berapa persen porsi makanan harian panda raksasa yang terdiri dari tanaman bambu?',
      en: 'What percentage of a giant panda\'s daily diet consists strictly of bamboo?',
    },
    options: {
      id: ['Sekitar 25%', 'Sekitar 50%', 'Sekitar 75%', 'Mencapai 99%'],
      en: ['About 25%', 'About 50%', 'About 75%', 'Almost 99%'],
    },
    correctIndex: 3,
    explanation: {
      id: 'Meskipun memiliki sistem pencernaan karnivora, 99% asupan makanan panda raksasa adalah bambu segar yang dikunyah selama 10-12 jam sehari.',
      en: 'Despite possessing a carnivore\'s digestive anatomy, 99% of a giant panda\'s dietary intake is bamboo, requiring 10-12 hours of chewing each day.',
    },
  },
  {
    id: 5,
    animalEmoji: '🐧',
    question: {
      id: 'Siapakah yang bertugas mengerami dan melindungi telur penguin kaisar selama musim dingin kutub?',
      en: 'Who incubates and warms the emperor penguin egg during harsh polar winter blizzards?',
    },
    options: {
      id: [
        'Penguin jantan mengeraminya di atas kakinya',
        'Penguin betina sendirian',
        'Telur diletakkan di dalam gua es hangat',
        'Kedua orang tua meninggalkannya di salju',
      ],
      en: [
        'The male penguin balances it on his feet',
        'The female penguin alone',
        'They leave it inside warm ice caverns',
        'Both parents bury it in soft snow',
      ],
    },
    correctIndex: 0,
    explanation: {
      id: 'Penguin kaisar jantan menjaga telur di atas kakinya dengan kantong kulit hangat khusus selama 2 bulan tanpa makan sama sekali di tengah badai!',
      en: 'The father emperor penguin incubates the single egg on top of his feet beneath a warm brood pouch for two grueling months without eating.',
    },
  },
];
