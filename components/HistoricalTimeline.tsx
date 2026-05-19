import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakAmharic } from '../services/geminiService';

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: 'Politics' | 'Culture' | 'Religion' | 'Warfare' | 'Innovation';
  imageUrl: string;
  stats: {
    impact: number; // 0-100
    legacy: number; // 0-100
    reach: number;  // 0-100
  };
  keyFigures: string[];
  location: string;
  milestones: string[];
}

const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: '1',
    year: 'c. 3.2M BC',
    title: 'Discovery of Lucy (Dinknesh)',
    description: 'The fossilized remains of Australopithecus afarensis, known as Lucy, lived in the Afar region, establishing Ethiopia as the cradle of humanity.',
    detailedDescription: 'Dinknesh (Lucy), discovered in 1974 by Donald Johanson in the Hadar region of the Afar Depression, revolutionized our understanding of human evolution. Dated to 3.2 million years ago, this nearly complete hominin skeleton of Australopithecus afarensis walked upright, proving that bipedalism preceded larger brain size in the evolutionary timeline, establishing Ethiopia as the undisputed cradle of humanity.',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800',
    stats: { impact: 98, legacy: 100, reach: 95 },
    keyFigures: ['Donald Johanson', 'Maurice Taieb', 'Alemayehu Asfaw'],
    location: 'Hadar, Afar Region (11.1444° N, 40.5833° E)',
    milestones: [
      '1974: Discovery of AL 288-1 remains',
      '1978: Scientific description as A. afarensis',
      '2007: Six-year public exhibition tour in USA'
    ]
  },
  {
    id: '2',
    year: 'c. 8th Century BC',
    title: 'Kingdom of Dʿmt & Temple of Yeha',
    description: 'The ancient kingdom of Dʿmt flourished in the north. The Great Temple of Yeha, built in the Sabaean style, remains the oldest standing structure in Ethiopia.',
    detailedDescription: 'The Kingdom of Dʿmt flourished in northern Ethiopia and Eritrea during the 10th to 5th centuries BC, establishing early trade, writing, and irrigation systems. The Great Temple of Yeha, constructed using massive, precisely dressed limestone blocks without mortar, served as the kingdom\'s religious and political epicenter, standing today as Sub-Saharan Africa\'s oldest intact standing structure.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1548651877-3e11400e930f?q=80&w=800',
    stats: { impact: 85, legacy: 90, reach: 70 },
    keyFigures: ['D\'mt Royalty', 'Sabaean Architects'],
    location: 'Yeha, Tigray Region (14.2833° N, 39.0167° E)',
    milestones: [
      'c. 800 BC: Construction of the Great Temple',
      'c. 500 BC: Rise of localized agricultural trade',
      '1960s: First modern archaeological excavations'
    ]
  },
  {
    id: '3',
    year: 'c. 100 AD',
    title: 'Rise of the Axumite Empire',
    description: 'Axum emerges as a major global naval and trading power, bridging the Roman Empire and ancient India from the highlands of modern Tigray.',
    detailedDescription: 'By the 1st century AD, Axum rose to become a dominant mercantile empire, controlling trade routes between the Roman Empire and India. Its power was marked by massive monolithic obelisks (stele) and its own gold, silver, and bronze coinage. The empire controlled the Red Sea port of Adulis, serving as a cosmopolitan crossroads of cultural exchange, philosophy, and wealth.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1620023414963-39da9b8f2cce?q=80&w=800',
    stats: { impact: 95, legacy: 98, reach: 92 },
    keyFigures: ['King Zoskales', 'Emperor Endubis', 'Adulis Port Governors'],
    location: 'Axum, Tigray Region (14.1333° N, 38.7167° E)',
    milestones: [
      'c. 100 AD: Axumite coinage system introduced',
      'c. 200 AD: Expansion of naval influence at Adulis',
      'c. 300 AD: Carving and erection of the giant stelae'
    ]
  },
  {
    id: '4',
    year: 'c. 330 AD',
    title: 'Adoption of Christianity',
    description: 'King Ezana adopts Christianity, making Axum one of the first polities to do so, deeply shaping the cultural fabric of the northern highlands.',
    detailedDescription: 'Under King Ezana in 330 AD, the Kingdom of Axum officially embraced Christianity, guided by the Syrian scholar Frumentius, who became the first Abuna (bishop). This monumental shift made Ethiopia one of the earliest Christian nations in the world, deeply integrating the Orthodox Tewahedo faith into the empire\'s administrative structure, art, architecture, and enduring national identity.',
    category: 'Religion',
    imageUrl: 'https://images.unsplash.com/photo-1651493638407-742bc54e2bc5?q=80&w=800',
    stats: { impact: 99, legacy: 100, reach: 88 },
    keyFigures: ['King Ezana', 'Saint Frumentius (Abba Selama)'],
    location: 'Saint Mary of Zion Cathedral, Axum (14.1306° N, 38.7194° E)',
    milestones: [
      'c. 330 AD: King Ezana\'s conversion and baptism',
      'c. 350 AD: Foundations of the first cathedral built',
      'c. 480 AD: Arrival of the Nine Saints to translate texts'
    ]
  },
  {
    id: '5',
    year: 'c. 500 AD',
    title: 'Development of Ge\'ez Script',
    description: 'The indigenous Ge\'ez script is fully developed and used for literature, administration, and religious texts.',
    detailedDescription: 'Originating from South Semitic scripts, the Ge\'ez language developed a unique abugida writing system in Axum, where consonants are modified by vowel symbols. This script became the bedrock of Ethiopian literature, liturgy, and administration. It is one of the very few indigenous African writing systems still actively used today for religious, historical, and literary purposes.',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1533414443058-293e62057639?q=80&w=800',
    stats: { impact: 92, legacy: 99, reach: 80 },
    keyFigures: ['Axumite Royal Scribes', 'Liturgy Scholars'],
    location: 'Imperial Scriptoria, Axum (14.1333° N, 38.7167° E)',
    milestones: [
      'c. 3rd Century: Vowel markers added to consonants',
      'c. 5th Century: Translation of scriptures from Greek',
      'Present Day: Primary liturgical standard of the EOTC'
    ]
  },
  {
    id: '6',
    year: '615 AD',
    title: 'First Hijra to Axum (Al Nejashi)',
    description: 'Seeking refuge from persecution in Mecca, early companions of the Prophet Muhammad were granted asylum by the Axumite King (Nejashi), establishing a deep-rooted Islamic history in Ethiopia.',
    detailedDescription: 'In 615 AD, early followers of the Prophet Muhammad fled persecution in Mecca and sought refuge across the Red Sea. The Christian Axumite Emperor, Armah (Al-Nejashi), welcomed them and refused bribes to return them, granting them freedom to practice their faith. This historic act of protection established a permanent bond of peace and coexistence between Islam and Ethiopia.',
    category: 'Religion',
    imageUrl: 'https://images.unsplash.com/photo-1588612143491-0fcf05a6efc1?q=80&w=800',
    stats: { impact: 94, legacy: 96, reach: 90 },
    keyFigures: ['King Armah (Al-Nejashi)', 'Ja\'far ibn Abi Talib', 'Ruqayyah bint Muhammad'],
    location: 'Negash, Tigray Region (13.8833° N, 39.6000° E)',
    milestones: [
      '615 AD: Arrival of the first group of Muslim refugees',
      '628 AD: Safe return of some companions to Medina',
      'Present Day: Al Nejashi Mosque stands as a historic sanctuary'
    ]
  },
  {
    id: '7',
    year: 'c. 1200 AD',
    title: 'Rock-Hewn Churches of Lalibela',
    description: 'King Lalibela of the Zagwe dynasty orders the construction of 11 monolithic churches carved entirely downward from living rock in the Amhara region.',
    detailedDescription: 'Following the decline of Axum, King Lalibela of the Zagwe dynasty sought to build a \'New Jerusalem\' in his capital. Eleven monolithic churches were carved entirely out of solid volcanic tuff rock, connected by deep trenches and tunnels. These architectural masterpieces remain active places of worship, representing a pinnacle of medieval engineering and spiritual devotion.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800',
    stats: { impact: 96, legacy: 98, reach: 85 },
    keyFigures: ['King Gebre Mesqel Lalibela', 'Zagwe Master Stonemasons'],
    location: 'Lalibela, Amhara Region (12.0333° N, 39.0417° E)',
    milestones: [
      'c. 1200: Construction begins on the central group',
      'c. 1220: Dedication of the iconic Bete Giyorgis',
      '1978: Inscribed as a UNESCO World Heritage site'
    ]
  },
  {
    id: '8',
    year: '13th Century',
    title: 'Establishment of the Gadaa System',
    description: 'The Oromo people formalize the Gadaa system, a highly complex, egalitarian, democratic socio-political and chronological system guiding religious and social life.',
    detailedDescription: 'The Gadaa system is a traditional, highly sophisticated democratic system of governance used by the Oromo people. It coordinates socio-political, economic, and religious activities through five rotating classes (Luba) that govern for eight-year terms. Promoting peace, gender roles, environmental stewardship, and social harmony, it is recognized by UNESCO as a masterpiece of intangible cultural heritage.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?q=80&w=800',
    stats: { impact: 90, legacy: 97, reach: 85 },
    keyFigures: ['Abbaa Gadaa Leaders', 'Council of Elders'],
    location: 'Oromia Region (Odaa Sacred Trees) (8.5411° N, 39.2689° E)',
    milestones: [
      '13th Century: Formalization of assemblies at Odaa councils',
      '16th Century: System guides the Oromo expansions',
      '2016: Inscribed as UNESCO Intangible Cultural Heritage'
    ]
  },
  {
    id: '9',
    year: '1529 - 1543',
    title: 'Ethiopian–Adal War (Ahmad Gragn)',
    description: 'A devastating war between the Christian Ethiopian Empire and the Muslim Adal Sultanate under Imam Ahmad ibn Ibrahim al-Ghazi, fundamentally altering the region\'s geopolitics.',
    detailedDescription: 'The conflict between the Christian Solomonic Empire and the Islamic Adal Sultanate, led by Imam Ahmad ibn Ibrahim al-Ghazi (Gragn), devastated the region from 1529 to 1543. Armed with Ottoman firearms, Adal forces conquered most of the highlands, prompting the Portuguese to intervene. The war ended with Ahmad\'s death in battle, leaving both empires depleted and altering geopolitics forever.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1624640166291-a1e621ec3694?q=80&w=800',
    stats: { impact: 91, legacy: 88, reach: 82 },
    keyFigures: ['Imam Ahmad ibn Ibrahim', 'Emperor Gelawdewos', 'Cristóvão da Gama'],
    location: 'Central Highlands and Harar Rift (9.3117° N, 42.1283° E)',
    milestones: [
      '1529: Battle of Shimbra Kure establishes Adal firepower',
      '1541: Portuguese military contingent lands under da Gama',
      '1543: Decisive Battle of Wayna Daga ends the campaign'
    ]
  },
  {
    id: '10',
    year: '1560s',
    title: 'Oromo Expansions',
    description: 'A massive migration and expansion of Oromo pastoralist communities across the Horn of Africa, profoundly changing the demographic and cultural map of Ethiopia.',
    detailedDescription: 'Beginning in the 16th century, the Oromo people initiated a large-scale migration and expansion from their southern homelands into the central, western, and northern highlands. Guided by the Gadaa system, this movement integrated the Oromo into the wider Ethiopian political landscape, introducing new agricultural practices, social systems, and creating a highly blended, multicultural society.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1616428236750-f8d2239d1b11?q=80&w=800',
    stats: { impact: 93, legacy: 95, reach: 89 },
    keyFigures: ['Oromo Clan Chiefs', 'Emperor Sarsa Dengel'],
    location: 'Central Highlands and Rift Valley (7.5000° N, 39.0000° E)',
    milestones: [
      'c. 1530: Initial scouts migrate northward via Rift Valley',
      'c. 1580: Integration of southern territories with highland clans',
      'c. 1650: Consolidating regional autonomous Gadaa domains'
    ]
  },
  {
    id: '11',
    year: '1636',
    title: 'Founding of Gondar',
    description: 'Emperor Fasilides establishes Gondar as the permanent capital of the Ethiopian Empire, launching a century of castle building and a cultural renaissance.',
    detailedDescription: 'In 1636, Emperor Fasilides established Gondar as the permanent capital of the Solomonic dynasty, ending the tradition of mobile royal camps. He built Fasil Ghebbi, a spectacular fortress city featuring stone castles, bridges, and libraries blending Axumite, Portuguese, and Indian architectural styles. Gondar became a vibrant center of art, music, religious philosophy, and commerce.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800',
    stats: { impact: 92, legacy: 96, reach: 80 },
    keyFigures: ['Emperor Fasilides', 'Empress Mentewab', 'Abuna Yohannes VII'],
    location: 'Fasil Ghebbi, Gondar (12.6075° N, 37.4697° E)',
    milestones: [
      '1636: Emperor Fasilides orders the first castle built',
      '1730s: Empress Mentewab builds her private palace complex',
      '1979: Inscribed as a UNESCO World Heritage site'
    ]
  },
  {
    id: '12',
    year: '1855',
    title: 'Rise of Emperor Tewodros II',
    description: 'Tewodros II ends the Era of the Princes (Zemene Mesafint) and centralizes power, beginning the modern reunification of the Ethiopian state.',
    detailedDescription: 'Emperor Tewodros II seized power in 1855, bringing an end to the chaotic \'Zemene Mesafint\' (Era of Princes). Driven by a vision of a modernized, unified Ethiopia, he centralist-governed the provinces, created a professional standing army, and attempted to manufacture domestic artillery. His dramatic reign laid the groundwork for the modern, centralized Ethiopian state structure.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1506505494950-8438ebccba56?q=80&w=800',
    stats: { impact: 94, legacy: 93, reach: 87 },
    keyFigures: ['Emperor Tewodros II (Kassa Hailu)', 'John Bell (Royal Advisor)'],
    location: 'Maqdala Fortress, Amhara Region (11.3783° N, 38.9850° E)',
    milestones: [
      'Feb 1855: Coronation at Derasge Maryam church',
      '1867: High tensions with Great Britain over hostage crisis',
      'Apr 1868: British expedition forces defeat and Tewodros suicide'
    ]
  },
  {
    id: '13',
    year: '1875 - 1876',
    title: 'Ethio-Egyptian War',
    description: 'Emperor Yohannes IV soundly defeats Egyptian invasion forces at the Battles of Gundet and Gura, halting Egyptian expansion into the Horn of Africa.',
    detailedDescription: 'Seeking control of the Blue Nile basin, the Khedivate of Egypt launched military invasions into northern Ethiopia in 1875. Emperor Yohannes IV mobilized a defensive force and crushed the modernized Egyptian armies at the Battles of Gundet and Gura. These decisive victories preserved Ethiopian sovereignty, secured vital border regions, and demonstrated the empire\'s unified military capabilities.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1532585227763-7e4b2d39df16?q=80&w=800',
    stats: { impact: 88, legacy: 86, reach: 80 },
    keyFigures: ['Emperor Yohannes IV', 'Ras Alula Engida (Guba Commander)', 'Khedive Ismail'],
    location: 'Gundet and Gura Basins (14.9000° N, 38.9000° E)',
    milestones: [
      'Nov 1875: Ethiopian forces completely destroy invader columns at Gundet',
      'Mar 1876: Decisive victory at Gura halts the Egyptian campaign',
      '1884: Hewett (Adwa) Treaty restores territories to Ethiopia'
    ]
  },
  {
    id: '14',
    year: '1887',
    title: 'Founding of Addis Ababa',
    description: 'Emperor Menelik II and Empress Taytu Betul found the city of Addis Ababa (New Flower) in the heart of Oromia/Shewa, moving the political center of gravity south.',
    detailedDescription: 'Empress Taytu Betul chose the site for the new capital in 1886, drawn by its hot springs and central location, naming it Addis Ababa (\'New Flower\'). Emperor Menelik II supported the transition, which consolidated imperial authority. The city grew rapidly, establishing modern infrastructure, hosting international embassies, and serving as the political and economic heart of the country.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800',
    stats: { impact: 97, legacy: 98, reach: 95 },
    keyFigures: ['Empress Taytu Betul', 'Emperor Menelik II'],
    location: 'Addis Ababa (Finfinnee) (9.0300° N, 38.7400° E)',
    milestones: [
      '1886: Settlement begins at the thermal springs of Finfinnee',
      '1889: Declared official imperial capital of unified Ethiopia',
      '1905: Establishment of the first state bank and modern mint'
    ]
  },
  {
    id: '15',
    year: '1887',
    title: 'Battle of Chelenqo',
    description: 'Menelik II\'s forces defeat the Emirate of Harar, bringing the ancient, walled Islamic commercial hub of Harar into the Ethiopian Empire.',
    detailedDescription: 'In January 1887, the forces of Negus Menelik of Shewa defeated the army of Emir Abdullahi of Harar at the Battle of Chelenqo. This swift military confrontation led to the incorporation of the historic city-state of Harar into the expanding Ethiopian state, integrating its lucrative trade routes and rich Islamic cultural heritage into the empire.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1550993510-9b0f48039600?q=80&w=800',
    stats: { impact: 85, legacy: 82, reach: 78 },
    keyFigures: ['Negus Menelik II', 'Emir Abdullahi II of Harar'],
    location: 'Chelenqo Plain, East Hararghe (9.4089° N, 41.5792° E)',
    milestones: [
      'Jan 6, 1887: Armed clash lasting under an hour on the plains',
      'Jan 9, 1887: Menelik enters the walled city of Harar',
      '1889: Menelik becomes Emperor, cementing Harar\'s trade alignment'
    ]
  },
  {
    id: '16',
    year: '1896',
    title: 'Battle of Adwa',
    description: 'A united Ethiopian force representing diverse ethnic groups crushes the invading Italian army, becoming a global symbol of Black independence and anti-colonial resistance.',
    detailedDescription: 'On March 1, 1896, a united Ethiopian army led by Emperor Menelik II and Empress Taytu Betul decisively defeated the invading Italian royal army at Adwa. By securing national sovereignty, this historic victory shattered myths of European colonial invincibility, inspired global anti-colonial struggles, and cemented Ethiopia as a beacon of freedom for African nations.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1620023414963-39da9b8f2cce?q=80&w=800',
    stats: { impact: 100, legacy: 100, reach: 100 },
    keyFigures: ['Emperor Menelik II', 'Empress Taytu Betul', 'Ras Alula Engida', 'Fitawrari Habte Giyorgis'],
    location: 'Adwa Mountains, Tigray Region (14.1667° N, 38.9000° E)',
    milestones: [
      'Oct 1889: Dispute over Italian/Amharic text of Treaty of Wuchale',
      'Mar 1, 1896: Decisive tactical defeat of Italian army at Adwa',
      'Oct 1896: Treaty of Addis Ababa signed, nullifying Italian claims'
    ]
  },
  {
    id: '17',
    year: '1897',
    title: 'Incorporation of Southern Kingdoms',
    description: 'The ancient kingdoms of Kaffa, Wolaytta, and Sidama are incorporated into the modern Ethiopian state following protracted military campaigns.',
    detailedDescription: 'During the late 19th and early 20th centuries, Emperor Menelik II\'s campaigns integrated the southern and southwestern kingdoms, including Kaffa, Wolaytta, and Sidama, into the centralized empire. While expanding state borders, it brought diverse ethnic groups, complex administrative structures, and rich agricultural resources into the modern political fabric of Ethiopia.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800',
    stats: { impact: 91, legacy: 89, reach: 85 },
    keyFigures: ['Kawo Tona Saga (Wolaytta)', 'King Gaki Sherocho (Kaffa)'],
    location: 'Southern Highlands (6.5000° N, 37.5000° E)',
    milestones: [
      '1894: Campaigns conclude the conquest of Wolaytta Kingdom',
      '1897: Annexation of the ancient Kaffa coffee kingdom',
      '1900s: Administrative integration under central imperial governors'
    ]
  },
  {
    id: '18',
    year: '1930',
    title: 'Coronation of Haile Selassie',
    description: 'Ras Tafari Makonnen is crowned Emperor Haile Selassie I. His reign brings modernization, the first written constitution, and global diplomatic prominence.',
    detailedDescription: 'Tafari Makonnen was crowned Emperor Haile Selassie I in 1930, embarking on a long reign focused on modernization, education, and international diplomacy. He introduced Ethiopia\'s first written constitution and secured membership in the League of Nations. He became a global symbol of sovereignty and is revered as a messianic figure in Rastafarianism.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1588612143491-0fcf05a6efc1?q=80&w=800',
    stats: { impact: 96, legacy: 97, reach: 98 },
    keyFigures: ['Emperor Haile Selassie I', 'Empress Menen Asfaw'],
    location: 'St. George Cathedral, Addis Ababa (9.0358° N, 38.7514° E)',
    milestones: [
      'Nov 2, 1930: Elaborate imperial coronation ceremony in capital',
      'July 1931: Promulgation of Ethiopia\'s first written constitution',
      'June 1936: Historic speech to the League of Nations in Geneva'
    ]
  },
  {
    id: '19',
    year: '1935 - 1941',
    title: 'Second Italo-Ethiopian War & Resistance',
    description: 'Fascist Italy invades Ethiopia. Ethiopian patriots from all regions mount a fierce guerrilla resistance for five years until liberation in 1941.',
    detailedDescription: 'Fascist Italy invaded Ethiopia in 1935, deploying chemical weapons in violation of international law. Emperor Haile Selassie went into exile to lobby the League of Nations, while internal guerrilla fighters, the Patriots (Arbegnoch), waged a relentless resistance. The joint efforts of the resistance and Allied forces led to liberation and the Emperor\'s return in 1941.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1533414443058-293e62057639?q=80&w=800',
    stats: { impact: 95, legacy: 94, reach: 92 },
    keyFigures: ['Ras Abebe Aregai', 'Jagama Kello (Patriot)', 'Sylvia Pankhurst (Activist)'],
    location: 'Mountain Ranges and Forests nationwide (9.0000° N, 39.0000° E)',
    milestones: [
      'Oct 1935: Italian troops cross Eritrean border starting war',
      'Feb 1937: Massive Graziani massacre in Addis Ababa triggers backlash',
      'May 5, 1941: Emperor re-enters capital; official liberation declared'
    ]
  },
  {
    id: '20',
    year: '1963',
    title: 'Creation of the OAU',
    description: 'Addis Ababa becomes the diplomatic capital of Africa as the Organization of African Unity (now AU) is founded, cementing Ethiopia\'s pan-African legacy.',
    detailedDescription: 'Under the leadership of Emperor Haile Selassie and other pan-African pioneers, thirty-two independent African states met in Addis Ababa in May 1963 to found the Organization of African Unity. The city was chosen as the permanent headquarters, establishing Ethiopia\'s diplomatic leadership and solidifying its status as the symbolic home of continental unity and cooperation.',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800',
    stats: { impact: 98, legacy: 99, reach: 98 },
    keyFigures: ['Emperor Haile Selassie I', 'Kwame Nkrumah', 'Gamal Abdel Nasser'],
    location: 'Africa Hall, Addis Ababa (9.0189° N, 38.7619° E)',
    milestones: [
      'May 25, 1963: Creation charter signed by 32 independent states',
      '1964: Addis Ababa declared permanent headquarters of OAU',
      'July 2002: Transition and relaunch as the African Union (AU)'
    ]
  },
  {
    id: '21',
    year: '1974',
    title: 'The Derg Revolution',
    description: 'A Marxist-Leninist military junta (the Derg) overthrows the monarchy, leading to massive social restructuring, the Red Terror, and civil war.',
    detailedDescription: 'Widespread famine, economic stagnation, and social unrest led to the overthrow of the Solomonic monarchy in 1974 by a Marxist-Leninist military committee known as the Derg. Led by Mengistu Haile Mariam, the regime implemented radical land reforms but also initiated the Red Terror, resulting in severe political repression and a prolonged civil war.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1624640166291-a1e621ec3694?q=80&w=800',
    stats: { impact: 94, legacy: 90, reach: 88 },
    keyFigures: ['Mengistu Haile Mariam', 'General Aman Andom', 'Emperor Haile Selassie I'],
    location: 'National Palace, Addis Ababa (9.0200° N, 38.7533° E)',
    milestones: [
      'Sep 12, 1974: Emperor Haile Selassie is formally deposed',
      '1977-1978: Red Terror (Qey Shibr) campaign suppresses dissidents',
      '1984: Establishment of the Workers\' Party of Ethiopia'
    ]
  },
  {
    id: '22',
    year: '1991',
    title: 'Fall of the Derg & Ethnic Federalism',
    description: 'A coalition of rebel forces (EPRDF) topples the Derg regime. Ethiopia adopts a new constitution based on ethnic federalism, reshaping the nation\'s identity.',
    detailedDescription: 'In 1991, the Ethiopian People\'s Revolutionary Democratic Front (EPRDF) captured Addis Ababa, toppling the Derg regime. The subsequent 1995 constitution reorganized the country into a federation of nine ethnically based regions, aimed at granting self-determination to diverse ethnic nationalities while fundamentally reshaping the national political and administrative landscape.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1616428236750-f8d2239d1b11?q=80&w=800',
    stats: { impact: 96, legacy: 92, reach: 90 },
    keyFigures: ['Meles Zenawi', 'Mengistu Haile Mariam'],
    location: 'Parliament Chambers, Addis Ababa (9.0311° N, 38.7525° E)',
    milestones: [
      'May 28, 1991: EPRDF forces capture the capital city',
      'Dec 1994: A new democratic federal constitution is ratified',
      'Aug 1995: The Federal Democratic Republic of Ethiopia is declared'
    ]
  },
  {
    id: '23',
    year: '2015',
    title: 'Fichee-Chambalaalla UNESCO Recognition',
    description: 'The Sidama New Year festival is officially inscribed as Intangible Cultural Heritage by UNESCO, highlighting Southern Ethiopia\'s rich cultural diversity.',
    detailedDescription: 'Fichee-Chambalaalla is the traditional New Year festival of the Sidama people, celebrating nature, community unity, and cultural heritage. Transmitted through generations, it emphasizes the sharing of local food, reconciliation, and respecting elders. Its inscription on the UNESCO Intangible Cultural Heritage list in 2015 highlighted the global value of Southern Ethiopian traditions.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?q=80&w=800',
    stats: { impact: 84, legacy: 92, reach: 75 },
    keyFigures: ['Sidama Elders', 'Cultural Historians'],
    location: 'Hawassa Gudumale, Sidama (7.0600° N, 38.4800° E)',
    milestones: [
      'Annual: Festival held based on lunar calculation by astrologers',
      'Dec 2015: Inscribed onto the UNESCO Intangible Heritage List',
      'Present Day: Serves as a major tourism and peace ambassador'
    ]
  },
  {
    id: '24',
    year: '2019',
    title: 'Nobel Peace Prize',
    description: 'Prime Minister Abiy Ahmed is awarded the Nobel Peace Prize for his efforts in resolving the border conflict with Eritrea and initiating democratic reforms.',
    detailedDescription: 'Prime Minister Abiy Ahmed was awarded the Nobel Peace Prize in 2019 for his decisive initiative to resolve the long-standing border conflict with neighboring Eritrea. The peace agreement ended twenty years of military standoff, reopened embassies, restored flights, and fostered hope for regional integration, economic cooperation, and political reforms across the Horn of Africa.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800',
    stats: { impact: 90, legacy: 88, reach: 93 },
    keyFigures: ['Prime Minister Abiy Ahmed', 'President Isaias Afwerki'],
    location: 'Oslo City Hall, Norway / Asmara, Eritrea (9.0200° N, 38.7400° E)',
    milestones: [
      'July 2018: Prime Minister Abiy visits Asmara, ending standoff',
      'Dec 10, 2019: Nobel Peace Prize awarded in Oslo',
      '2020: Resumption of regular commercial flights and phone lines'
    ]
  },
  {
    id: '25',
    year: '2020',
    title: 'The Grand Ethiopian Renaissance Dam',
    description: 'Ethiopia begins filling the GERD on the Blue Nile in the Benishangul-Gumuz region. It stands as the largest hydroelectric power plant in Africa.',
    detailedDescription: 'Constructed on the Blue Nile in the Benishangul-Gumuz region, the GERD is a massive infrastructure project designed to generate electricity for millions. As the largest hydroelectric plant in Africa, it symbolizes national self-reliance and economic ambition, though it remains a subject of complex geopolitical negotiations regarding water rights and regional resource sharing.',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1548651877-3e11400e930f?q=80&w=800',
    stats: { impact: 98, legacy: 95, reach: 92 },
    keyFigures: ['Dr. Simegnew Bekele (Chief Engineer)', 'Meles Zenawi'],
    location: 'Guba, Benishangul-Gumuz Region (11.2133° N, 35.0933° E)',
    milestones: [
      'Apr 2011: Groundbreaking ceremony and project launch',
      'July 2020: First water reservoir filling stage completed',
      'Feb 2022: First turbine begins commercial power generation'
    ]
  }
];

const CATEGORIES = ['All', 'Politics', 'Culture', 'Religion', 'Warfare', 'Innovation'] as const;

// Text scrambling effect component
const ScrambledText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let count = 0;
    const chars = 'A@B#C$D%E&F*G?H!J1K2L3M4N5P6Q7R8S9T0UVW';
    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < count) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });
      count += 1.5;
      if (count >= text.length + 5) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayText}</>;
};

const HistoricalTimeline: React.FC = () => {
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>('All');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  // Modal interior state variables
  const [activeTab, setActiveTab] = useState<'codex' | 'tactical' | 'stream'>('codex');
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number | null>(null);

  // Audio References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const filteredEvents = filter === 'All' 
    ? TIMELINE_DATA 
    : TIMELINE_DATA.filter(e => e.category === filter);

  // Clean up audio on event change or active tab change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsAudioPlaying(false);
    setAudioTime(0);
  }, [selectedEvent, activeTab]);

  // Decryption loading simulator
  useEffect(() => {
    if (selectedEvent) {
      setIsDecrypting(true);
      setDecryptProgress(0);
      setActiveTab('codex');
      setActiveMilestoneIndex(null);

      const interval = setInterval(() => {
        setDecryptProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsDecrypting(false);
            return 100;
          }
          return prev + 6 + Math.floor(Math.random() * 8);
        });
      }, 40);

      return () => clearInterval(interval);
    }
  }, [selectedEvent]);

  // Audio play/pause toggler
  const handleToggleAudio = async () => {
    if (!selectedEvent) return;

    // If currently playing, stop/pause immediately
    if (isAudioPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsAudioPlaying(false);
      return;
    }

    // If we already loaded the audio stream, but it was paused/stopped, play it again
    if (audioRef.current && audioUrl && !isAudioPlaying) {
      audioRef.current.play();
      setIsAudioPlaying(true);
      return;
    }

    setLoadingAudio(true);
    try {
      // 1. Attempt Gemini TTS
      const textToSpeak = `${selectedEvent.title}. ${selectedEvent.detailedDescription}`;
      const audioData = await speakAmharic(`[Speak as a deep database narrator] ${textToSpeak}`);
      
      if (audioData) {
        const blob = new Blob([audioData], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setIsAudioPlaying(false);
          setAudioTime(0);
        };

        audio.ontimeupdate = () => {
          setAudioTime(Math.floor(audio.currentTime));
        };

        audio.play();
        setIsAudioPlaying(true);
      } else {
        throw new Error("No audio data returned from Gemini TTS");
      }
    } catch (err) {
      console.warn("Gemini TTS failed or rate-limited. Falling back to browser SpeechSynthesis.", err);
      
      // 2. Fallback to Browser SpeechSynthesis (Web Speech API)
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(selectedEvent.detailedDescription);
        
        // Find a male voice
        const voices = window.speechSynthesis.getVoices();
        const maleVoiceNames = ['david', 'mark', 'george', 'male', 'google uk english male', 'microsoft david'];
        let maleVoice = null;
        
        for (const name of maleVoiceNames) {
          const found = voices.find(v => v.name.toLowerCase().includes(name) && v.lang.startsWith('en'));
          if (found) {
            maleVoice = found;
            break;
          }
        }
        if (!maleVoice) {
          // If no specific male voice match, try any english voice
          maleVoice = voices.find(v => v.lang.startsWith('en'));
        }
        if (maleVoice) {
          utterance.voice = maleVoice;
        }
        
        utterance.onend = () => {
          setIsAudioPlaying(false);
          setAudioTime(0);
        };

        // Estimate duration based on word count (~150 words per minute)
        const wordCount = selectedEvent.detailedDescription.split(' ').length;
        const estDuration = Math.ceil((wordCount / 150) * 60);

        window.speechSynthesis.speak(utterance);
        setIsAudioPlaying(true);
        
        // Simulating the time progress since speechSynthesis doesn't have an ontimeupdate in all browsers
        let elapsed = 0;
        const progressTimer = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(progressTimer);
            return;
          }
          elapsed += 1;
          setAudioTime(Math.min(elapsed, estDuration));
        }, 1000);
      } else {
        alert("Audio narration is not supported on this browser.");
      }
    } finally {
      setLoadingAudio(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6 lg:p-10 font-sans relative overflow-hidden">
      
      {/* Inject custom styled animations inside a style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        @keyframes sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-scanline {
          animation: scanline 3.5s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 0.8s ease-in-out infinite;
        }
        .animate-sweep {
          animation: sweep 8s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(12, 10, 9, 0.6);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.4);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.7);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />

      {/* Sci-Fi Grid Background - Light Mode */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#e7e5e4 1px, transparent 1px), linear-gradient(90deg, #e7e5e4 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-transparent to-stone-50 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header - Holographic Style */}
        <header className="mb-16 text-center pt-8">
          <div className="inline-block relative">
             <span className="absolute -inset-1 bg-amber-500/20 blur-lg rounded-full"></span>
             <span className="relative bg-white border border-amber-200 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block shadow-sm backdrop-blur-md">
               Animus Archive System
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter leading-none mb-4 uppercase drop-shadow-sm">
            Chronicles of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">Ethiopia</span>
          </h1>
          <p className="text-stone-500 text-base md:text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px]">
            Unlock the epic eras, legendary battles, and ancient secrets of the Horn of Africa.
          </p>
        </header>

        {/* HUD Filters - Light Mode */}
        <div className="flex flex-wrap justify-center gap-3 mb-20 relative z-20">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`relative overflow-hidden px-6 py-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-300 group shadow-sm ${
                filter === c 
                  ? 'bg-amber-500 text-white shadow-[0_4px_15px_rgba(245,158,11,0.3)] border border-amber-400' 
                  : 'bg-white border border-stone-200 text-stone-500 hover:border-amber-300 hover:text-amber-600'
              }`}
            >
              <span className="relative z-10">{c}</span>
            </button>
          ))}
        </div>

        {/* Tech Tree Timeline */}
        <div className="relative pb-24">
          {/* Glowing Central Power Line */}
          <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-stone-200 rounded-full overflow-hidden shadow-inner">
             <motion.div 
               className="w-full h-1/3 bg-gradient-to-b from-transparent via-amber-400 to-transparent blur-[2px]"
               animate={{ y: ["-100%", "300%"] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             ></motion.div>
          </div>

          <div className="space-y-16 md:space-y-24">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index % 2 === 0 ? 0 : 0.2 }}
                className={`relative flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-8 md:gap-0`}
              >
                {/* Content Card (Gaming Style - Light) */}
                <div className="w-full md:w-[42%] ml-16 md:ml-0 group perspective-1000">
                  <div 
                    className="relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl border border-stone-200 shadow-xl transition-all duration-500 cursor-pointer overflow-hidden transform-gpu group-hover:scale-[1.02] group-hover:border-amber-400 group-hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)]"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-stone-300 group-hover:border-amber-500 transition-colors"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-stone-300 group-hover:border-amber-500 transition-colors"></div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm font-black text-amber-600">{event.year}</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent"></div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-stone-50 border border-stone-200 text-stone-500 px-3 py-1.5 rounded-sm">
                        {event.category}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-stone-900 mb-3 tracking-tight group-hover:text-amber-600 transition-colors">{event.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed font-medium">{event.description}</p>
                    
                    <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 group-hover:text-amber-600 transition-colors">
                      <span>Access Archive</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                </div>

                {/* Cyberpunk Node - Light */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-[3px] border-white bg-stone-100 flex items-center justify-center shadow-md z-10 group cursor-pointer" onClick={() => setSelectedEvent(event)}>
                   <div className="w-3 h-3 bg-stone-300 rounded-full transition-all duration-300 group-hover:bg-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
                   <div className="absolute inset-0 rounded-full border border-amber-500/0 group-hover:border-amber-500/50 group-hover:animate-ping"></div>
                </div>

                {/* Empty space filler for alignment */}
                <div className="hidden md:block w-[42%]"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cinematic Gaming Interactive Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
            >
              {/* Dark transparent blur backdrop */}
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={() => setSelectedEvent(null)}></div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-full max-w-5xl bg-stone-950/90 text-stone-100 border border-stone-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col md:flex-row max-h-[92vh] z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Cyberpunk Grid scan effect */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Left Section: Image and Holographic Diagnostics */}
                <div className="w-full md:w-[45%] h-64 md:h-auto relative border-b md:border-b-0 md:border-r border-stone-800 overflow-hidden flex flex-col justify-end">
                  
                  {/* Event Image */}
                  <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] contrast-[1.25] saturate-[0.8]" />
                  
                  {/* Golden Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/30"></div>
                  
                  {/* Digital scanline animation */}
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_10px_#f59e0b] opacity-80 animate-scanline"></div>

                  {/* Diagnostic details on image */}
                  <div className="relative p-6 z-10 flex flex-col gap-4 font-mono">
                    <div className="flex items-center justify-between text-[10px] text-amber-500/80 uppercase tracking-widest border-b border-stone-800 pb-2">
                      <span>Database ID: {selectedEvent.id.padStart(4, '0')}</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        SYNCHRONIZED
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-stone-400 uppercase text-[9px] tracking-wider">GEO-LOCATION INTEGRITY</div>
                      <div className="text-stone-100 font-semibold">{selectedEvent.location}</div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-stone-400 uppercase text-[9px] tracking-wider">CHRONOLOGICAL NODE</div>
                      <div className="text-amber-500 font-bold text-lg">{selectedEvent.year}</div>
                    </div>

                    <div className="mt-2 pt-3 border-t border-stone-900/60 flex items-center justify-between">
                      <span className="text-[9px] text-stone-500 uppercase tracking-wider">System: Animus OS v4.8</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-3 bg-amber-500/30"></span>
                        <span className="w-1.5 h-3 bg-amber-500/50"></span>
                        <span className="w-1.5 h-3 bg-amber-500"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Core Interactive Panel */}
                <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col max-h-[92vh] md:max-h-none overflow-y-auto custom-scrollbar">
                  
                  {/* Close button */}
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-5 right-5 w-8 h-8 bg-stone-900 border border-stone-800 hover:border-amber-500 hover:text-amber-500 text-stone-400 rounded-full flex items-center justify-center transition-all z-20 font-mono text-sm"
                  >
                    ✕
                  </button>

                  {/* Header Title with Decryption Effect */}
                  <div className="mb-6 pr-6">
                    <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-[0.2em] bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded">
                      {selectedEvent.category} Records
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-stone-100 leading-tight mt-3 tracking-tight uppercase">
                      {isDecrypting ? (
                        <span className="font-mono text-stone-400 text-xl tracking-widest uppercase">
                          Decrypting Memory Log...
                        </span>
                      ) : (
                        <ScrambledText text={selectedEvent.title} />
                      )}
                    </h2>
                  </div>

                  {/* Decryption Screen Overlay if loading */}
                  <AnimatePresence mode="wait">
                    {isDecrypting ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col justify-center items-center py-16 font-mono text-stone-400"
                      >
                        <div className="relative w-48 h-1.5 bg-stone-900 border border-stone-800 rounded-full overflow-hidden mb-4">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-amber-500 to-rose-500" 
                            style={{ width: `${decryptProgress}%` }}
                          />
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-amber-500 animate-pulse">
                          INITIALIZING DNA STREAM RECONSTRUCTION ... {decryptProgress}%
                        </div>
                        <div className="text-[8px] text-stone-600 mt-2">
                          SYS.LOC.COGNITIVE_RECALL: CONNECTED TO CORE DATABANK
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 flex flex-col"
                      >
                        {/* Interactive Navigation HUD Tabs */}
                        <div className="flex border-b border-stone-900 gap-1 mb-6 font-mono text-xs">
                          <button
                            onClick={() => setActiveTab('codex')}
                            className={`px-4 py-2 border-b-2 transition-all uppercase tracking-wider ${
                              activeTab === 'codex'
                                ? 'border-amber-500 text-amber-500 bg-amber-500/[0.03]'
                                : 'border-transparent text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            Memory Codex
                          </button>
                          <button
                            onClick={() => setActiveTab('tactical')}
                            className={`px-4 py-2 border-b-2 transition-all uppercase tracking-wider ${
                              activeTab === 'tactical'
                                ? 'border-amber-500 text-amber-500 bg-amber-500/[0.03]'
                                : 'border-transparent text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            Milestones
                          </button>
                          <button
                            onClick={() => setActiveTab('stream')}
                            className={`px-4 py-2 border-b-2 transition-all uppercase tracking-wider ${
                              activeTab === 'stream'
                                ? 'border-amber-500 text-amber-500 bg-amber-500/[0.03]'
                                : 'border-transparent text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            Cognitive Sync
                          </button>
                        </div>

                        {/* Interactive Tab Area */}
                        <div className="flex-1 min-h-[220px]">
                          
                          {/* TAB 1: CODEX */}
                          {activeTab === 'codex' && (
                            <div className="space-y-6">
                              {/* Detailed narrative ( guaranteed 40+ words ) */}
                              <div className="relative p-4 bg-stone-900/40 border border-stone-900 rounded-xl">
                                <span className="absolute top-0 left-4 -translate-y-1/2 bg-stone-950 px-2 font-mono text-[9px] text-amber-500">HISTORICAL NARRATIVE // LORE</span>
                                <p className="text-stone-300 text-sm leading-relaxed font-medium pt-2">
                                  {selectedEvent.detailedDescription}
                                </p>
                              </div>

                              {/* Interactive Tactical Dials (Gauges) */}
                              <div>
                                <h4 className="font-mono text-[10px] text-stone-400 uppercase tracking-widest mb-3">SYSTEM INFLUENCE ANALYTICS</h4>
                                <div className="grid grid-cols-3 gap-3">
                                  
                                  {/* Metric 1 */}
                                  <div className="bg-stone-900/50 border border-stone-900 p-3 rounded-lg flex flex-col items-center justify-center relative group cursor-pointer hover:border-amber-500/30 transition-all">
                                    <span className="text-[9px] text-stone-400 font-mono uppercase mb-2">GEOPOLITICAL IMPACT</span>
                                    <div className="relative w-14 h-14 flex items-center justify-center">
                                      {/* SVG Circle meter */}
                                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-stone-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <motion.path 
                                          className="text-amber-500" 
                                          strokeWidth="2.5" 
                                          strokeDasharray={`${selectedEvent.stats.impact}, 100`} 
                                          strokeLinecap="round" 
                                          stroke="currentColor" 
                                          fill="none" 
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          initial={{ pathLength: 0 }}
                                          animate={{ pathLength: 1 }}
                                          transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                      </svg>
                                      <span className="absolute font-mono text-[11px] font-bold text-stone-200">{selectedEvent.stats.impact}%</span>
                                    </div>
                                  </div>

                                  {/* Metric 2 */}
                                  <div className="bg-stone-900/50 border border-stone-900 p-3 rounded-lg flex flex-col items-center justify-center relative group cursor-pointer hover:border-amber-500/30 transition-all">
                                    <span className="text-[9px] text-stone-400 font-mono uppercase mb-2">LEGACY DURATION</span>
                                    <div className="relative w-14 h-14 flex items-center justify-center">
                                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-stone-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <motion.path 
                                          className="text-orange-500" 
                                          strokeWidth="2.5" 
                                          strokeDasharray={`${selectedEvent.stats.legacy}, 100`} 
                                          strokeLinecap="round" 
                                          stroke="currentColor" 
                                          fill="none" 
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          initial={{ pathLength: 0 }}
                                          animate={{ pathLength: 1 }}
                                          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                                        />
                                      </svg>
                                      <span className="absolute font-mono text-[11px] font-bold text-stone-200">{selectedEvent.stats.legacy}%</span>
                                    </div>
                                  </div>

                                  {/* Metric 3 */}
                                  <div className="bg-stone-900/50 border border-stone-900 p-3 rounded-lg flex flex-col items-center justify-center relative group cursor-pointer hover:border-amber-500/30 transition-all">
                                    <span className="text-[9px] text-stone-400 font-mono uppercase mb-2">REGIONAL REACH</span>
                                    <div className="relative w-14 h-14 flex items-center justify-center">
                                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-stone-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <motion.path 
                                          className="text-rose-500" 
                                          strokeWidth="2.5" 
                                          strokeDasharray={`${selectedEvent.stats.reach}, 100`} 
                                          strokeLinecap="round" 
                                          stroke="currentColor" 
                                          fill="none" 
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          initial={{ pathLength: 0 }}
                                          animate={{ pathLength: 1 }}
                                          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                        />
                                      </svg>
                                      <span className="absolute font-mono text-[11px] font-bold text-stone-200">{selectedEvent.stats.reach}%</span>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          )}

                          {/* TAB 2: MILESTONES / PROCESS TREE */}
                          {activeTab === 'tactical' && (
                            <div className="space-y-4">
                              <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-2">
                                SELECT MILESTONE NODE TO RETRIEVE TACTICAL CORE LOGS
                              </p>
                              <div className="relative border-l border-stone-800 pl-6 ml-2 space-y-5">
                                {selectedEvent.milestones.map((milestone, idx) => {
                                  const parts = milestone.split(':');
                                  const title = parts[0];
                                  const text = parts[1] || '';
                                  const isActive = activeMilestoneIndex === idx;

                                  return (
                                    <div 
                                      key={idx} 
                                      onClick={() => setActiveMilestoneIndex(isActive ? null : idx)}
                                      className={`relative cursor-pointer transition-all duration-300 p-3 rounded-lg border ${
                                        isActive 
                                          ? 'bg-amber-500/10 border-amber-500/30' 
                                          : 'bg-stone-900/35 border-transparent hover:border-stone-800 hover:bg-stone-900/60'
                                      }`}
                                    >
                                      {/* Node Dot Indicator */}
                                      <div className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                                        isActive 
                                          ? 'border-amber-500 bg-stone-950 scale-110 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                                          : 'border-stone-700 bg-stone-900'
                                      }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-500' : 'bg-transparent'}`} />
                                      </div>

                                      <div className="flex justify-between items-center">
                                        <span className="font-mono text-xs font-bold text-amber-500">{title}</span>
                                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-mono">
                                          {isActive ? 'COLLAPSE LOG' : 'EXPAND LOG'}
                                        </span>
                                      </div>

                                      <AnimatePresence>
                                        {isActive && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden mt-2 text-stone-300 text-xs leading-relaxed"
                                          >
                                            <div className="h-px bg-stone-800 my-2" />
                                            {text.trim()}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* TAB 3: COGNITIVE SYNC (Audio log simulator) */}
                          {activeTab === 'stream' && (
                            <div className="bg-stone-900/30 border border-stone-900/60 p-4 rounded-xl flex flex-col justify-between items-center text-center space-y-4">
                              <div className="relative w-full max-w-xs aspect-video bg-stone-950/80 rounded-lg overflow-hidden border border-stone-800 flex items-center justify-center font-mono">
                                
                                {/* Futuristic radar grid circles */}
                                <div className="absolute w-24 h-24 border border-amber-500/10 rounded-full animate-pulse"></div>
                                <div className="absolute w-40 h-40 border border-amber-500/5 rounded-full"></div>
                                
                                {/* Sweeping Radar line */}
                                <div className="absolute w-40 h-40 border-r border-amber-500/20 rounded-full animate-sweep origin-center pointer-events-none"></div>

                                {isAudioPlaying ? (
                                  /* Animated Audio Waves */
                                  <div className="flex items-end justify-center gap-1 w-full px-6 h-12">
                                    {[...Array(12)].map((_, i) => (
                                      <div 
                                        key={i}
                                        className="w-1.5 bg-amber-500 rounded-full origin-bottom animate-bounce-slow"
                                        style={{ 
                                          height: `${30 + Math.random() * 70}%`, 
                                          animationDelay: `${i * 0.07}s`,
                                          animationDuration: `${0.5 + Math.random() * 0.5}s`
                                        }}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center p-3">
                                    <div className="text-[10px] text-stone-500 uppercase tracking-widest">COGNITIVE DECODER</div>
                                    <div className="text-[9px] text-amber-500/70 uppercase tracking-widest mt-1">TRANSMISSION STANDBY</div>
                                  </div>
                                )}
                              </div>

                              <div className="w-full flex items-center justify-between font-mono text-xs px-2 border-b border-stone-900 pb-3">
                                <div className="flex flex-col text-left">
                                  <span className="text-[10px] text-stone-500 uppercase">MEMORY CHANNEL</span>
                                  <span className="text-stone-300 font-semibold uppercase">{selectedEvent.category} FEED</span>
                                </div>
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] text-stone-500 uppercase">SYNC TIMELINE</span>
                                  <span className="text-amber-500 font-bold">
                                    {formatTime(audioTime)} / {audioRef.current ? formatTime(Math.floor(audioRef.current.duration)) : '00:45'}
                                  </span>
                                </div>
                              </div>

                              {/* Playback controls */}
                              <button 
                                onClick={handleToggleAudio}
                                disabled={loadingAudio}
                                className={`w-full py-3 px-4 font-mono text-xs uppercase tracking-widest font-bold rounded-lg border transition-all flex items-center justify-center gap-3 ${
                                  loadingAudio 
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500/50 cursor-wait'
                                    : isAudioPlaying 
                                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20' 
                                      : 'bg-amber-500 text-stone-950 border-amber-400 hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                }`}
                              >
                                {loadingAudio ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                    SYNCHRONIZING AI VOICE VOCALS...
                                  </>
                                ) : isAudioPlaying ? (
                                  <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                    PAUSE TRANSMISSION RECALL
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    INITIATE COGNITIVE AUDIO STREAM
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                        </div>

                        {/* Interactive Key Figures Sidebar Section */}
                        <div className="mt-8 pt-6 border-t border-stone-900 font-mono">
                          <h4 className="text-[9px] text-stone-500 uppercase tracking-widest mb-3">KEY ASSOCIATED IDENTITIES</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvent.keyFigures.map((figure, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center gap-2 bg-stone-900 border border-stone-800/80 px-3 py-1.5 rounded-md hover:border-amber-500/40 hover:bg-stone-900/80 transition-all cursor-help group relative"
                              >
                                <div className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-bold flex items-center justify-center border border-amber-500/20">
                                  {figure.charAt(0)}
                                </div>
                                <span className="text-[10px] text-stone-300 font-semibold">{figure}</span>
                                
                                {/* Hover interactive bio tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-stone-950 border border-stone-800 text-stone-300 text-[9px] p-2.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 leading-normal">
                                  <div className="font-bold text-amber-500 mb-1">{figure}</div>
                                  Verified catalog entity recorded inside the database logs for the {selectedEvent.title}.
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Modal Footer status log */}
                  <div className="mt-auto pt-6 border-t border-stone-900/60 flex items-center justify-between text-[9px] text-stone-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                      SECURE SIGNAL LINK // DATA STEADY
                    </span>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="text-amber-500/70 hover:text-amber-500 uppercase tracking-widest text-[9px] transition-colors"
                    >
                      DISCONNECT ARCHIVE CARD [-]
                    </button>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoricalTimeline;
