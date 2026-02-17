
import { EthiopianEvent } from './types';

export const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 'Magabit', 'Miyazya', 'Gunbot', 'Sane', 'Hamle', 'Nehasse', 'Pagume'
];

export const ETHIOPIAN_MONTHS_AMHARIC = [
  'መስከረም', 'ጥቅምት', 'ሕዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
];

export const ETHIOPIAN_DAYS_AMHARIC = [
  'እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'
];

export const EVENTS_DATA: EthiopianEvent[] = [
  {
    id: '1',
    name: 'Timkat (Epiphany)',
    nameAmharic: 'ጥምቀት',
    ethDate: '11 Tir 2018',
    gregDate: '2026-01-19',
    location: 'Addis Ababa',
    description: 'Timkat is the Ethiopian Orthodox celebration of Epiphany, featuring colorful processions, rituals, and blessings of water.',
    imageUrl: 'https://picsum.photos/id/1048/800/600',
    category: 'Religious'
  },
  {
    id: '2',
    name: 'Adwa Victory Day',
    nameAmharic: 'አድዋ',
    ethDate: '23 Yekatit 2018',
    gregDate: '2026-03-02',
    location: 'Adwa',
    description: 'Commemorates Ethiopia’s victory over Italian forces at the Battle of Adwa in 1896, with parades and speeches.',
    imageUrl: 'https://picsum.photos/id/1053/800/600',
    category: 'Public'
  },
  {
    id: '3',
    name: 'Mariam Tsion (St. Mary’s Day)',
    nameAmharic: 'ማርያም ጽዮን',
    ethDate: '16 Yekatit 2018',
    gregDate: '2026-02-23',
    location: 'Axum',
    description: 'A religious festival honoring the Virgin Mary, celebrated with church services, prayers, and traditional songs.',
    imageUrl: 'https://picsum.photos/id/1019/800/600',
    category: 'Religious'
  },
  {
    id: '4',
    name: 'Fasika (Easter)',
    nameAmharic: 'ፋሲካ',
    ethDate: '23 Miyazya 2018',
    gregDate: '2026-04-19',
    location: 'Addis Ababa',
    description: 'Ethiopian Orthodox Easter celebration with church services, feasting, and family gatherings.',
    imageUrl: 'https://picsum.photos/id/1020/800/600',
    category: 'Religious'
  },
  {
    id: '5',
    name: 'Buhe',
    nameAmharic: 'ቡሄ',
    ethDate: '13 Nehasse 2018',
    gregDate: '2026-08-19',
    location: 'Rural Ethiopia',
    description: 'Traditional festival where children sing, dance, and go door-to-door asking for gifts, marking the Transfiguration of Jesus.',
    imageUrl: 'https://picsum.photos/id/1021/800/600',
    category: 'Cultural'
  },
  {
    id: '6',
    name: 'Enkutatash (New Year)',
    nameAmharic: 'እንቁጣጣሽ',
    ethDate: '1 Meskerem 2019',
    gregDate: '2026-09-11',
    location: 'Addis Ababa',
    description: 'Ethiopian New Year celebration with family gatherings, traditional meals, and gift exchanges.',
    imageUrl: 'https://picsum.photos/id/1018/800/600',
    category: 'Public'
  },
  {
    id: '7',
    name: 'Meskel (Finding of the True Cross)',
    nameAmharic: 'መስቀል',
    ethDate: '17 Meskerem 2019',
    gregDate: '2026-09-27',
    location: 'Addis Ababa',
    description: 'Religious festival marked by bonfires, processions, and prayers, celebrating the discovery of the True Cross.',
    imageUrl: 'https://picsum.photos/id/1043/800/600',
    category: 'Religious'
  },
  {
    id: '8',
    name: 'Id al-Fitr (Eid)',
    nameAmharic: 'ዒድ አል ፈጥር',
    ethDate: '10 Shawa 2018',
    gregDate: '2026-04-02',
    location: 'Addis Ababa',
    description: 'Islamic festival marking the end of Ramadan, celebrated with prayers, feasts, and community gatherings.',
    imageUrl: 'https://picsum.photos/id/1022/800/600',
    category: 'Religious'
  },
  {
    id: '9',
    name: 'Id al-Adha (Eid al-Adha)',
    nameAmharic: 'ዒድ አል አድሃ',
    ethDate: '10 Dul Hajj 2018',
    gregDate: '2026-06-29',
    location: 'Addis Ababa',
    description: 'Islamic festival commemorating the willingness of Ibrahim to sacrifice his son, observed with prayers and meat distribution.',
    imageUrl: 'https://picsum.photos/id/1023/800/600',
    category: 'Religious'
  },
  {
    id: '10',
    name: 'Genna (Ethiopian Christmas)',
    nameAmharic: 'ገና',
    ethDate: '29 Tahsas 2018',
    gregDate: '2026-01-07',
    location: 'Addis Ababa',
    description: 'Ethiopian Orthodox Christmas celebrated with church services, traditional meals, and family gatherings.',
    imageUrl: 'https://picsum.photos/id/1019/800/600',
    category: 'Religious'
  },
  {
    id: '11',
    name: 'Buhe / Filseta',
    nameAmharic: 'ፍልሰታ',
    ethDate: '14 Nehasse 2018',
    gregDate: '2026-08-20',
    location: 'Northern Ethiopia',
    description: 'Pilgrimage and celebration of the Transfiguration of Jesus, with singing and community rituals.',
    imageUrl: 'https://picsum.photos/id/1024/800/600',
    category: 'Religious'
  },
  {
    id: '12',
    name: 'Test Event',
    nameAmharic: 'ሙከራ',
    ethDate: '10 Yekatit 2018',
    gregDate: '2026-02-17',
    location: 'Addis Ababa',
    description: 'This is a test event to check the calendar and modal functionality.',
    imageUrl: 'https://picsum.photos/id/1025/800/600',
    category: 'Cultural'
  }
];
