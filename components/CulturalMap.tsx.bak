import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as topojson from 'topojson-client';

interface DetailItem {
  name: string;
  description: string;
  category?: string;
}

interface RegionData {
  id: string;
  name: string;
  capital: string;
  population: string;
  heritages: DetailItem[];
  traditions: DetailItem[];
  foods: DetailItem[];
  music: DetailItem[];
  clothing: DetailItem[];
  languages: string[];
  history: string;
  summary: string;
  images: string[];
  color: string;
  coordinates: [number, number]; // Latitude, Longitude
}

const REGIONS_DATA: Record<string, RegionData> = {
  tigray: {
    id: 'tigray',
    name: 'Tigray Region',
    capital: 'Mekelle',
    population: '7+ Million',
    coordinates: [13.4967, 39.4753],
    heritages: [
      { name: 'Aksum Obelisks', category: 'UNESCO World Heritage', description: 'Ancient monolithic stelae marking the tombs of Aksumite kings. The largest of these obelisks weighs over 500 tonnes and represents the architectural prowess of the ancient Aksumite Empire.' },
      { name: 'Rock-Hewn Churches of Gheralta', category: 'Historic Site', description: 'Spectacular ancient churches carved into sheer sandstone cliffs. Monks and pilgrims must scale vertical rock faces using carved handholds to reach these isolated sanctuaries.' },
      { name: 'Al Nejashi Mosque', category: 'Historic Site', description: 'One of the oldest mosques in Africa, marking the first migration of Muslims who fled persecution in Mecca and were granted refuge by the Aksumite King.' },
      { name: 'Debre Damo', category: 'Historic Site', description: 'A 6th-century monastery accessible only by climbing a 15-meter leather rope up a sheer cliff face. It houses some of the oldest illuminated manuscripts in Ethiopia.' }
    ],
    traditions: [
      { name: 'Ashenda Festival', description: 'A vibrant cultural festival celebrated by girls and young women in August, marking the end of the fasting period of Filseta. Women wear traditional dresses and perform songs.' },
      { name: 'Orthodox Christian Devotion', description: 'The region holds deep roots in Ethiopian Orthodox Christianity, with widespread fasting traditions and monastic lifestyles preserved for millennia.' }
    ],
    foods: [
      { name: 'Tihlo', description: 'A unique traditional dish made from roasted barley flour rolled into small balls, eaten by dipping them into a rich, spicy meat stew (sebhi) using a specialized wooden fork.' },
      { name: 'Mies (Honey Wine)', description: 'A traditional fermented honey wine, highly popular during weddings, holidays, and cultural gatherings.' }
    ],
    music: [
      { name: 'Guayla', description: 'A dynamic, highly energetic circular dance and music style characterized by rapid drum beats, rhythmic clapping, and intense shoulder movements.' }
    ],
    clothing: [
      { name: 'Tilfi', description: 'Elegant white cotton dresses adorned with intricate cross patterns and colorful embroidery at the borders, entirely handwoven by local artisans.' }
    ],
    languages: ['Tigrinya', 'Saho', 'Kunama'],
    history: 'Heart of the ancient Aksumite Empire. Home to the Ark of the Covenant according to Ethiopian Orthodox tradition. Tigray has historically been the epicenter of ancient Ethiopian civilization.',
    images: ['https://images.unsplash.com/photo-1548651877-3e11400e930f?q=80&w=800', 'https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800'],
    summary: 'The northernmost region of Ethiopia, rich in ancient history, majestic mountains, and the cradle of the Aksumite civilization.',
    color: '#F59E0B'
  },
  amhara: {
    id: 'amhara',
    name: 'Amhara Region',
    capital: 'Bahir Dar',
    population: '30+ Million',
    coordinates: [11.5936, 37.3908],
    heritages: [
      { name: 'Rock-Hewn Churches of Lalibela', category: 'UNESCO World Heritage', description: '11 medieval monolithic cave churches dubbed the "New Jerusalem", carved entirely downward out of solid volcanic rock by King Lalibela in the 12th century.' },
      { name: 'Fasil Ghebbi (Gondar)', category: 'UNESCO World Heritage', description: 'A fortress-city containing castles and palaces of Ethiopian emperors from the 17th and 18th centuries, blending Ethiopian, Indian, and Portuguese architectural styles.' },
      { name: 'Simien Mountains', category: 'UNESCO World Heritage', description: 'Spectacular landscapes with jagged mountain peaks and deep valleys. It is home to rare endemic wildlife such as the Gelada baboon, Walia ibex, and Ethiopian wolf.' },
      { name: 'Lake Tana Monasteries', category: 'Historic Site', description: 'Ancient, isolated monasteries located on the islands of Lake Tana, preserving medieval artifacts, royal crowns, and mummified remains of past emperors.' }
    ],
    traditions: [
      { name: 'Timkat (Epiphany)', description: 'A massive religious festival celebrating the baptism of Jesus. Replicas of the Ark of the Covenant (Tabots) are paraded through the streets to bodies of water.' },
      { name: 'Cotton Weaving', description: 'A deeply entrenched cultural practice where artisans hand-spin and weave pure cotton to create intricate traditional garments.' }
    ],
    foods: [
      { name: 'Doro Wat', description: 'The undisputed king of Ethiopian cuisine. A rich, heavily spiced chicken stew slow-cooked for hours with berbere, onions, and boiled eggs.' },
      { name: 'Tej', description: 'A sweet, potent honey wine flavored with indigenous hops called gesho, traditionally served in a rounded glass flask known as a berele.' }
    ],
    music: [
      { name: 'Eskista', description: 'A highly energetic, shoulder-focused dance music. The dance involves complex, rapid chest and shoulder shaking that requires immense physical control.' }
    ],
    clothing: [
      { name: 'Habesha Kemis', description: 'The iconic Ethiopian elegant white woven dress. It features a colorful, heavily embroidered border known as "Tibeb" and is paired with a matching shawl (Netela).' }
    ],
    languages: ['Amharic', 'Awngi', 'Oromo'],
    history: 'The historic center of the Solomonic dynasty. Features the medieval castles of Gondar and the source of the Blue Nile at Lake Tana.',
    images: ['https://images.unsplash.com/photo-1620023414963-39da9b8f2cce?q=80&w=800', 'https://images.unsplash.com/photo-1651493638407-742bc54e2bc5?q=80&w=800'],
    summary: 'A dramatic region characterized by high mountains, medieval castles, and deep Christian orthodox traditions.',
    color: '#3B82F6'
  },
  afar: {
    id: 'afar',
    name: 'Afar Region',
    capital: 'Semera',
    population: '2+ Million',
    coordinates: [11.7922, 41.0014],
    heritages: [
      { name: 'Lower Valley of the Awash', category: 'UNESCO World Heritage', description: 'One of the most important paleontological sites in the world. This is where the 3.2 million-year-old fossil of the famous hominid "Lucy" (Dinknesh) was discovered.' },
      { name: 'Erta Ale Volcano', category: 'Cultural Landscape', description: 'A continuously active basaltic shield volcano featuring a persistent lava lake, making it one of the most extreme and fascinating geological sites on Earth.' },
      { name: 'Danakil Depression', category: 'Cultural Landscape', description: 'One of the lowest and hottest places on Earth, famous for its neon-colored acid springs, vast salt pans, and brutal but mesmerizing landscape.' }
    ],
    traditions: [
      { name: 'Amolé Salt Mining', description: 'A centuries-old tradition where Afar nomads hack slabs of solid salt from the Danakil Depression, loading them onto massive camel caravans to trade in the highlands.' },
      { name: 'Pastoral Nomadism', description: 'The Afar people have maintained a resilient nomadic lifestyle for millennia, moving with their herds of camels and goats in search of water and grazing land.' }
    ],
    foods: [
      { name: 'Pastoral Diet', description: 'A diet heavily reliant on camel and goat milk, combined with meat. Due to the extreme heat, traditional food preservation methods like drying meat are common.' }
    ],
    music: [
      { name: 'Warrior Dances', description: 'High-energy, rhythmic dances historically performed by warriors. They feature chanting, rhythmic stepping, and the brandishing of the curved jile dagger.' }
    ],
    clothing: [
      { name: 'Sanafil & Jile', description: 'Traditional wraparound skirts (sanafil) suited for the extreme heat. Men famously carry the "Jile", a sharply curved, double-edged traditional dagger worn at the waist.' }
    ],
    languages: ['Afar'],
    history: 'The Danakil Depression is the cradle of humanity. Historically, the Afar people controlled the vital salt trade connecting the coast to the highlands.',
    images: ['https://images.unsplash.com/photo-1624640166291-a1e621ec3694?q=80&w=800', 'https://images.unsplash.com/photo-1533414443058-293e62057639?q=80&w=800'],
    summary: 'A land of extremes, featuring active volcanoes, neon acid lakes, salt flats, and the cradle of humanity.',
    color: '#EF4444'
  },
  benishangul: {
    id: 'benishangul',
    name: 'Benishangul-Gumuz',
    capital: 'Asosa',
    population: '1.2+ Million',
    coordinates: [10.0667, 34.5333],
    heritages: [
      { name: 'Grand Ethiopian Renaissance Dam', category: 'Modern Marvel', description: 'The largest hydroelectric dam in Africa, built on the Blue Nile. It is a symbol of modern Ethiopian engineering and national pride.' },
      { name: 'Blue Nile Gorge', category: 'Cultural Landscape', description: 'A massive, majestic canyon carved by the Blue Nile river. It is often compared to the Grand Canyon and acts as a massive natural barrier.' }
    ],
    traditions: [
      { name: 'Traditional Gold Mining', description: 'For centuries, locals in the region have panned for gold in the riverbeds, a tradition that predates modern commercial mining.' }
    ],
    foods: [
      { name: 'Sorghum & Root Crops', description: 'The staple diet consists heavily of sorghum-based dishes, yams, and root crops, adapted to the tropical lowland climate.' }
    ],
    music: [
      { name: 'Berta Music', description: 'Traditional music featuring long bamboo flutes (Waza) and gourd instruments, played in polyphonic harmony during communal gatherings.' }
    ],
    clothing: [
      { name: 'Lowland Fabrics', description: 'Colorful, lightweight fabrics designed for breathability in the humid, tropical climate of the western borderlands.' }
    ],
    languages: ['Berta', 'Gumuz', 'Amharic'],
    history: 'A historically significant region for gold mining. Now famous globally as the home of the monumental GERD project.',
    images: ['https://images.unsplash.com/photo-1624640166291-a1e621ec3694?q=80&w=800', 'https://images.unsplash.com/photo-1533414443058-293e62057639?q=80&w=800'],
    summary: 'A frontier region defined by the Blue Nile river, rich in gold and modern energy marvels.',
    color: '#F97316'
  },
  addis: {
    id: 'addis',
    name: 'Addis Ababa',
    capital: 'Addis Ababa',
    population: '5+ Million',
    coordinates: [9.0320, 38.7480],
    heritages: [
      { name: 'National Museum of Ethiopia', category: 'Historic Site', description: 'The premier museum in the country, home to the fossilized remains of "Lucy" and an extensive collection of ancient artifacts and modern art.' },
      { name: 'Holy Trinity Cathedral', category: 'Historic Site', description: 'A massive ornate cathedral built to commemorate Ethiopia\'s liberation from Italian occupation. It is the final resting place of Emperor Haile Selassie.' },
      { name: 'Mercato', category: 'Cultural Landscape', description: 'The largest open-air market in Africa, a sprawling, chaotic, and vibrant hub where absolutely everything can be bought or sold.' }
    ],
    traditions: [
      { name: 'Urban Coffee Culture', description: 'Addis is famous for its dense concentration of cafes and traditional coffee stands, acting as the primary social glue for the city\'s residents.' },
      { name: 'Meskel at Meskel Square', description: 'The massive annual bonfire celebration marking the finding of the True Cross, held in the city\'s central amphitheater plaza.' }
    ],
    foods: [
      { name: 'Modern Fusion', description: 'As the capital, Addis serves every regional Ethiopian dish perfectly, alongside a rapidly growing modern fusion and international culinary scene.' }
    ],
    music: [
      { name: 'Ethio-Jazz', description: 'A unique musical genre born in Addis Ababa in the 1960s, blending traditional Ethiopian pentatonic scales with jazz, funk, and soul.' }
    ],
    clothing: [
      { name: 'Urban & Traditional Blend', description: 'A mix of fast-paced modern urban wear during the week, switching dramatically to pristine traditional white Habesha clothing on Sundays and holidays.' }
    ],
    languages: ['Amharic', 'Oromo', 'English'],
    history: 'Founded in 1886 by Emperor Menelik II and Empress Taytu. It is the diplomatic capital of Africa, hosting the African Union headquarters.',
    images: ['https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800', 'https://images.unsplash.com/photo-1620023414963-39da9b8f2cce?q=80&w=800'],
    summary: 'The bustling capital city, acting as the diplomatic hub of Africa and a melting pot of all Ethiopian cultures.',
    color: '#64748B'
  },
  dire_dawa: {
    id: 'dire_dawa',
    name: 'Dire Dawa',
    capital: 'Dire Dawa',
    population: '500,000+',
    coordinates: [9.5931, 41.8661],
    heritages: [
      { name: 'Ethio-Djibouti Railway Station', category: 'Historic Site', description: 'The historic French-built railway station from 1902 that birthed the city. It features vintage locomotives and historic architecture.' },
      { name: 'Kefira Market', category: 'Cultural Landscape', description: 'A vibrant, colorful traditional market showcasing the deep fusion of Somali, Oromo, and Harari cultures and trading practices.' }
    ],
    traditions: [
      { name: 'Chewing Khat (Qat)', description: 'A highly social and deeply ingrained cultural tradition of chewing the stimulant leaf Khat in afternoon gatherings to discuss business and politics.' }
    ],
    foods: [
      { name: 'Street Food & Samosas', description: 'Known for its vibrant street food culture heavily influenced by Arab and Somali traders, particularly savory meat-filled pastries.' }
    ],
    music: [
      { name: 'Cultural Fusion Music', description: 'A vibrant blend of Somali melodies, Harari beats, and modern Ethiopian pop music.' }
    ],
    clothing: [
      { name: 'Macawiis & Dirac', description: 'Men frequently wear the comfortable, colorful Somali Macawiis (sarong), while women wear the elegant, flowing Dirac.' }
    ],
    languages: ['Oromo', 'Somali', 'Amharic'],
    history: 'Created directly as a result of the Addis Ababa-Djibouti railway bypassing Harar. It became Ethiopia\'s first modern planned city.',
    images: ['https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800', 'https://images.unsplash.com/photo-1506505494950-8438ebccba56?q=80&w=800'],
    summary: 'A vibrant, culturally diverse railway city born out of trade and modern transport.',
    color: '#84CC16'
  },
  harari: {
    id: 'harari',
    name: 'Harari Region',
    capital: 'Harar',
    population: '250,000+',
    coordinates: [9.3139, 42.1183],
    heritages: [
      { name: 'Harar Jugol', category: 'UNESCO World Heritage', description: 'The fortified historic walled city. It contains 82 mosques (three dating from the 10th century) and 102 shrines, packed into a tiny, colorful maze of alleyways.' },
      { name: 'Arthur Rimbaud House', category: 'Historic Site', description: 'A gorgeous wooden mansion turned museum dedicated to the famous French poet Arthur Rimbaud, who lived as a trader in Harar in the 1880s.' }
    ],
    traditions: [
      { name: 'Hyena Feeding', description: 'A unique nightly ritual where designated local "Hyena men" call wild hyenas from the hills and feed them meat by hand, or even mouth-to-mouth.' },
      { name: 'Islamic Scholarship', description: 'Harar is considered the fourth holiest city of Islam, with a deep, centuries-old tradition of Quranic scholarship and poetry.' }
    ],
    foods: [
      { name: 'Fatira & Harari Coffee', description: 'A popular street food of thin, flaky pastry served with honey or eggs, almost always accompanied by distinctively roasted Harari coffee.' }
    ],
    music: [
      { name: 'Kabaro & Chanting', description: 'Traditional Harari music relies heavily on rhythmic chanting accompanied by the Kabaro drum, often performed during weddings and religious holidays.' }
    ],
    clothing: [
      { name: 'Harari Garments', description: 'Women wear vibrantly colored, distinctly patterned garments often paired with elaborate gold jewelry.' }
    ],
    languages: ['Harari', 'Oromo', 'Amharic'],
    history: 'It served as a major commercial hub linking African and Islamic trade routes for centuries. Surrounded by walls built between the 13th and 16th centuries.',
    images: ['https://images.unsplash.com/photo-1588612143491-0fcf05a6efc1?q=80&w=800', 'https://images.unsplash.com/photo-1550993510-9b0f48039600?q=80&w=800'],
    summary: 'A small but historically massive region centered around the ancient, walled Islamic city of Harar.',
    color: '#EC4899'
  },
  gambela: {
    id: 'gambela',
    name: 'Gambela Region',
    capital: 'Gambela',
    population: '400,000+',
    coordinates: [8.2500, 34.5833],
    heritages: [
      { name: 'Gambela National Park', category: 'National Park', description: 'The largest national park in Ethiopia, famous for hosting the second largest antelope migration in Africa (the White-eared kob).' },
      { name: 'Baro River', category: 'Cultural Landscape', description: 'A massive, majestic river. Historically, it was the only navigable river in Ethiopia, serving as a major port for British trading ships.' }
    ],
    traditions: [
      { name: 'Riverine Lifestyle', description: 'The local ethnic groups, such as the Nuer and Anywaa, have a deep cultural connection to the river, relying on it for fishing, agriculture, and transport.' },
      { name: 'Body Scarification', description: 'A traditional practice of elaborate body scarification used as rites of passage and markers of beauty and tribal identity.' }
    ],
    foods: [
      { name: 'Fish & Sorghum', description: 'Due to the riverine ecosystem, fresh fish stews paired with sorghum or maize porridge form the core of the traditional diet.' }
    ],
    music: [
      { name: 'Drum and Dance', description: 'Highly rhythmic drum-based music accompanied by intense, synchronized group dances that reflect the community\'s bond.' }
    ],
    clothing: [
      { name: 'Minimalist Attire', description: 'Historically minimalist clothing suited for the extremely hot and humid lowland climate, often accented with intricate beadwork.' }
    ],
    languages: ['Nuer', 'Anywaa', 'Majang'],
    history: 'A lush, low-lying region that shares strong cultural and ecological ties with South Sudan. Historically a major river port.',
    images: ['https://images.unsplash.com/photo-1616428236750-f8d2239d1b11?q=80&w=800', 'https://images.unsplash.com/photo-1532585227763-7e4b2d39df16?q=80&w=800'],
    summary: 'A hot, lush lowland region famous for massive wildlife migrations and majestic rivers.',
    color: '#06B6D4'
  },
  oromiya: {
    id: 'oromiya',
    name: 'Oromia Region',
    capital: 'Finfinnee',
    population: '40+ Million',
    coordinates: [8.5000, 39.0000],
    heritages: [
      { name: 'Bale Mountains National Park', category: 'UNESCO World Heritage', description: 'A massive afro-alpine plateau, home to the highest road in Africa and the rare, endemic Ethiopian wolf.' },
      { name: 'Gadaa System', category: 'Intangible Heritage', description: 'An ancient indigenous democratic socio-political system of the Oromo people, recognized by UNESCO for its complexity and egalitarian nature.' },
      { name: 'Sof Omar Caves', category: 'Cultural Landscape', description: 'The longest cave system in Africa, an extraordinary natural marvel carved by the Weyib River, featuring massive limestone pillars.' }
    ],
    traditions: [
      { name: 'Irreechaa Festival', description: 'A massive thanksgiving festival celebrating peace and nature, where millions gather at lakes and rivers to offer grass to Waaqa (God).' },
      { name: 'Ateetee', description: 'A women-led peace-making ritual demonstrating the strong sociopolitical power women hold in traditional Oromo culture.' }
    ],
    foods: [
      { name: 'Chumbo & Anchote', description: 'Traditional thick breads and root crops (like Anchote, unique to the western Oromia region) served with rich, spiced butter and yogurt.' },
      { name: 'Besso', description: 'A highly nutritious drink and snack made from lightly roasted barley flour, historically fueling travelers and warriors.' }
    ],
    music: [
      { name: 'Shaggooyyee & Ragada', description: 'Vibrant dance styles requiring extreme flexibility, characterized by intricate, rapid neck and shoulder movements.' }
    ],
    clothing: [
      { name: 'Aadaa Oromoo', description: 'Distinctive traditional attire often featuring bold red, black, and white colors, completed with culturally significant wooden staffs and jewelry.' }
    ],
    languages: ['Afaan Oromoo'],
    history: 'Birthplace of Arabica coffee (Kaffa/Jimma regions). Home to the egalitarian Gadaa system, a framework that predates modern democracy.',
    images: ['https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800', 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?q=80&w=800'],
    summary: 'The largest and most populous region in Ethiopia, known for its diverse landscapes, the origin of coffee, and rich Gadaa heritage.',
    color: '#10B981'
  },
  somali: {
    id: 'somali',
    name: 'Somali Region',
    capital: 'Jigjiga',
    population: '6+ Million',
    coordinates: [6.3500, 43.8000],
    heritages: [
      { name: 'Karamara Mountains', category: 'Historic Site', description: 'A culturally and historically significant mountain range that has witnessed major historical events in the region.' },
      { name: 'Babile Elephant Sanctuary', category: 'National Park', description: 'A massive, semi-arid wildlife reserve home to the rare African savanna elephant, which have uniquely adapted to the harsh environment.' }
    ],
    traditions: [
      { name: 'Camel Pastoralism', description: 'Camels are deeply respected and represent wealth, survival, and cultural pride in the vast arid landscapes of the region.' },
      { name: 'Poetry & Oral History', description: 'The region has an immensely rich tradition of oral storytelling and complex poetry, used to record history and resolve disputes.' }
    ],
    foods: [
      { name: 'Bariis & Muqmad', description: 'Highly spiced fragrant rice served with Muqmad—small pieces of dried meat preserved in clarified butter for long desert journeys.' },
      { name: 'Camel Milk', description: 'A staple of the pastoral diet, revered for its high nutritional value and cultural significance.' }
    ],
    music: [
      { name: 'Dhaanto', description: 'A traditional folk dance and music style that historically mimics the gait of camels. It is highly energetic and performed collectively.' }
    ],
    clothing: [
      { name: 'Koofiyad & Dirac', description: 'Men wear the Koofiyad (traditional cap) with a Macawiis (sarong). Women wear the Dirac, a lightweight, brilliantly colored flowing dress.' }
    ],
    languages: ['Somali'],
    history: 'Historically part of vital ancient trade routes connecting the Horn of Africa to the Arabian peninsula. Known for deep Islamic heritage and poetic traditions.',
    images: ['https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800', 'https://images.unsplash.com/photo-1506505494950-8438ebccba56?q=80&w=800'],
    summary: 'An expansive, arid region dominated by pastoralist culture, camels, and vibrant trade history.',
    color: '#EAB308'
  },
  southern: {
    id: 'southern',
    name: 'Southern Ethiopia',
    capital: 'Hawassa / Arba Minch',
    population: '20+ Million',
    coordinates: [6.0504, 37.4768],
    heritages: [
      { name: 'Lower Valley of the Omo', category: 'UNESCO World Heritage', description: 'A prehistoric site crucial for understanding human evolution, and home to some of the most fascinating and diverse indigenous tribes in the world.' },
      { name: 'Konso Cultural Landscape', category: 'UNESCO World Heritage', description: 'A highly organized landscape of massive stone-walled terraces and fortified settlements built to combat soil erosion over centuries.' },
      { name: 'Tiya Megaliths', category: 'UNESCO World Heritage', description: 'Ancient standing stones adorned with mysterious carvings of swords and symbols, marking a prehistoric burial complex.' },
      { name: 'Nechisar National Park', category: 'National Park', description: 'Known as the "Bridge of Heaven", it is a stunning isthmus between Lake Abaya and Lake Chamo, teeming with crocodiles and zebras.' }
    ],
    traditions: [
      { name: 'Bull Jumping Ceremony', description: 'A rite of passage for the Hamer people where young men must run across the backs of a line of bulls to prove their manhood.' },
      { name: 'Fichee-Chambalaalla', description: 'The vibrant Sidama New Year festival, deeply tied to the lunar calendar and traditional astrology.' }
    ],
    foods: [
      { name: 'Kocho & Bulla', description: 'Staple foods created by harvesting, fermenting, and baking the pulp of the Enset plant (False Banana), providing absolute food security.' },
      { name: 'Kitfo', description: 'Originating from the Gurage people in this region, it is premium raw minced beef marinated in intensely spiced butter (Niter Kibbeh).' }
    ],
    music: [
      { name: 'Polyphonic Tribal Music', description: 'Highly rhythmic tribal music utilizing diverse instruments like the lyre, accompanied by complex polyphonic singing and jumping dances.' }
    ],
    clothing: [
      { name: 'Diverse Tribal Attire', description: 'Ranging from intricately woven cotton garments of the Dorze, to the spectacular beadwork and animal skin garments of the Omo Valley tribes.' }
    ],
    languages: ['Sidama', 'Wolaytta', 'Gurage', 'Hamer', '40+ others'],
    history: 'The most ethnically diverse region of Ethiopia, home to over 45 distinct ethnic groups, preserving ancient tribal customs and agro-pastoralist systems.',
    images: ['https://images.unsplash.com/photo-1616428236750-f8d2239d1b11?q=80&w=800', 'https://images.unsplash.com/photo-1532585227763-7e4b2d39df16?q=80&w=800'],
    summary: 'A melting pot of over 45 distinct ethnic groups, featuring ancient megaliths, the Great Rift Valley, and vibrant tribal cultures.',
    color: '#8B5CF6'
  }
};

const REGION_NAME_MAP: Record<string, string> = {
  'Benshangul-Gumaz': 'benishangul',
  'Addis Ababa': 'addis',
  'Harari People': 'harari',
  'Southern Nations, Nationalities and Peoples': 'southern',
  'Gambela Peoples': 'gambela',
  'Oromiya': 'oromiya',
  'Somali': 'somali',
  'Dire Dawa': 'dire_dawa',
  'Tigray': 'tigray',
  'Afar': 'afar',
  'Amhara': 'amhara'
};

const CulturalMap: React.FC = () => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('https://code.highcharts.com/mapdata/countries/et/et-all.topo.json')
      .then(res => res.json())
      .then(topo => {
        // Convert TopoJSON to GeoJSON
        const geojson = topojson.feature(topo, topo.objects.default);
        setGeoData(geojson);
      })
      .catch(err => console.error('Error loading map data:', err));
  }, []);
  const [selectedRegion, setSelectedRegion] = useState<string>('addis');
  const [activeTab, setActiveTab] = useState<'overview' | 'heritages' | 'culture' | 'gallery'>('overview');
  const [selectedDetail, setSelectedDetail] = useState<DetailItem | null>(null);

  const activeData = REGIONS_DATA[selectedRegion];

  useEffect(() => {
    if (selectedDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedDetail]);

  const renderDetailCard = (item: DetailItem, type: string) => (
    <div 
      onClick={() => setSelectedDetail({ ...item, category: item.category || type })}
      className="bg-stone-50 border border-stone-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col md:flex-row md:items-center gap-6"
    >
       <div className="flex-1">
         <div className="flex items-center gap-3 mb-2">
           <h4 className="text-lg font-black text-stone-100 group-hover:text-amber-600 transition-colors">{item.name}</h4>
           {item.category && item.category === 'UNESCO World Heritage' && (
             <span className="bg-amber-900/40 text-amber-800 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">UNESCO</span>
           )}
         </div>
         <p className="text-sm font-medium text-stone-400 leading-relaxed line-clamp-2">{item.description}</p>
       </div>
       <div className="md:w-48 text-right">
          <span className="inline-block text-center bg-stone-100 group-hover:bg-amber-50 border border-stone-100 group-hover:border-amber-200 text-stone-600 group-hover:text-amber-700 transition-colors text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
            View Detail &rarr;
          </span>
       </div>
    </div>
  );

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-icon',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      if (activeData) {
        map.flyTo(activeData.coordinates, 6, { duration: 1.5 });
      }
    }, [activeData, map]);
    return null;
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700 relative bg-stone-100">
      
      <AnimatePresence>
        {selectedDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md"
            onClick={() => setSelectedDetail(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-stone-50 rounded-[3rem] p-10 md:p-14 max-w-2xl w-full shadow-2xl relative border border-stone-200 overflow-hidden"
            >
              <button 
                onClick={() => setSelectedDetail(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-stone-800 text-stone-300 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors z-20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="relative z-10">
                <span className="bg-amber-900/40 text-amber-800 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block">
                  {selectedDetail.category || 'Cultural Detail'}
                </span>
                
                <h2 className="text-4xl md:text-5xl font-black text-stone-100 tracking-tighter leading-none mb-6">
                  {selectedDetail.name}
                </h2>
                
                <div className="w-20 h-1.5 bg-amber-900/200 rounded-full mb-8"></div>
                
                <p className="text-lg text-stone-600 font-medium leading-relaxed bg-stone-100 p-8 rounded-[2rem] border border-stone-100">
                  {selectedDetail.description}
                </p>

                <div className="mt-8 flex justify-end">
                  <button onClick={() => setSelectedDetail(null)} className="px-8 py-4 bg-stone-900 text-white rounded-2xl text-sm font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    Close Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid xl:grid-cols-12 gap-8 items-start">
        
        <div className="xl:col-span-5 bg-stone-50 rounded-[3rem] border border-stone-200 shadow-2xl relative sticky top-28 h-[85vh] overflow-hidden flex flex-col">
          <div className="p-8 absolute top-0 left-0 z-[400] w-full flex justify-between items-start pointer-events-none bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
            <div>
              <h3 className="text-xl font-black text-stone-100 tracking-tight">Interactive Map</h3>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Select a Region</p>
            </div>
            <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full shadow-sm border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">GPS Active</span>
            </div>
          </div>
          
          <div className="flex-1 w-full h-full relative z-0 min-h-[500px]">
             <MapContainer center={[9.145, 40.489]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
               <TileLayer
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
               />
               <MapController />
               
               {geoData && (
                 <GeoJSON 
                   key={`geojson-${selectedRegion}`}
                   data={geoData}
                   style={(feature: any) => {
                     const regionId = REGION_NAME_MAP[feature?.properties?.name || ''];
                     const isSelected = regionId === selectedRegion;
                     const regionData = regionId ? REGIONS_DATA[regionId] : null;
                     
                     return {
                       color: isSelected ? (regionData?.color || '#10B981') : '#d6d3d1',
                       weight: isSelected ? 2.5 : 1,
                       fillColor: regionData?.color || '#a8a29e',
                       fillOpacity: isSelected ? 0.5 : 0.1,
                       dashArray: isSelected ? '' : '4',
                     };
                   }}
                   onEachFeature={(feature, layer) => {
                     const regionId = REGION_NAME_MAP[feature?.properties?.name || ''];
                     if (regionId) {
                       layer.bindTooltip(`<div class="font-black text-xs uppercase tracking-widest">${REGIONS_DATA[regionId].name}</div>`, { sticky: true, className: 'bg-stone-50 border-none shadow-xl rounded-xl px-3 py-1' });
                       
                       layer.on({
                         click: () => {
                           setSelectedRegion(regionId);
                           setActiveTab('overview');
                         },
                         mouseover: (e) => {
                           const l = e.target;
                           if (regionId !== selectedRegion) {
                             l.setStyle({ fillOpacity: 0.3, weight: 2, color: '#a8a29e' });
                           }
                           l.bringToFront();
                         },
                         mouseout: (e) => {
                           const l = e.target;
                           if (regionId !== selectedRegion) {
                             l.setStyle({ fillOpacity: 0.1, weight: 1, color: '#d6d3d1', dashArray: '4' });
                           }
                         }
                       });
                     }
                   }}
                 />
               )}
             </MapContainer>
          </div>
        </div>

        <div className="xl:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-stone-50 rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden"
            >
              <div className="h-72 relative flex items-end p-10">
                 <div className="absolute inset-0 bg-stone-900">
                   <img src={activeData.images[0]} alt={activeData.name} className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
                   <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>
                 </div>
                 
                 <div className="relative z-10 w-full flex justify-between items-end">
                   <div>
                     <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block shadow-lg backdrop-blur-md border border-white/20" style={{ backgroundColor: activeData.color, color: '#fff' }}>
                       Territory Profile
                     </span>
                     <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none shadow-sm">{activeData.name}</h2>
                   </div>
                   <div className="hidden md:block text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Population</p>
                      <p className="text-2xl font-black text-white">{activeData.population}</p>
                   </div>
                 </div>
              </div>

              <div className="flex overflow-x-auto border-b border-stone-100 px-6 pt-2 bg-stone-100 custom-scrollbar">
                 {[
                   { id: 'overview', label: 'Overview' },
                   { id: 'heritages', label: 'All Heritages' },
                   { id: 'culture', label: 'Culture & Food' },
                   { id: 'gallery', label: 'Gallery' }
                 ].map(tab => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`px-6 py-5 text-xs font-black uppercase tracking-widest border-b-4 transition-colors whitespace-nowrap \${activeTab === tab.id ? 'border-stone-900 text-stone-100' : 'border-transparent text-stone-400 hover:text-stone-300'}`}
                   >
                     {tab.label}
                   </button>
                 ))}
              </div>

              <div className="p-8 md:p-10 min-h-[500px]">
                
                {activeTab === 'overview' && (
                  <div className="animate-in fade-in duration-500 space-y-8">
                     <p className="text-lg text-stone-600 font-medium leading-relaxed bg-stone-100 p-6 rounded-[2rem] border border-stone-100">{activeData.summary}</p>
                     
                     <div className="grid grid-cols-2 gap-6">
                       <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-100 shadow-sm flex items-center gap-4">
                         <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">🏛️</div>
                         <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Capital City</h4>
                           <p className="text-lg font-black text-stone-100 leading-none">{activeData.capital}</p>
                         </div>
                       </div>
                       <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-100 shadow-sm flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🗣️</div>
                         <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Languages</h4>
                           <p className="text-sm font-black text-stone-100 leading-tight">{activeData.languages.join(', ')}</p>
                         </div>
                       </div>
                     </div>

                     <div className="bg-stone-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-xl">
                       <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                       </div>
                       <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Historical Significance</h4>
                       <p className="text-base font-medium leading-relaxed relative z-10">{activeData.history}</p>
                     </div>
                  </div>
                )}

                {activeTab === 'heritages' && (
                  <div className="animate-in fade-in duration-500">
                    <div className="mb-6 flex items-center justify-between">
                       <h3 className="text-xl font-black text-stone-100">Exhaustive Heritage Index</h3>
                       <span className="bg-stone-800 text-stone-300 px-3 py-1 rounded-lg text-xs font-bold">{activeData.heritages.length} Official Sites</span>
                    </div>
                    
                    <div className="space-y-4">
                      {activeData.heritages.map((heritage, idx) => (
                        <div key={idx}>
                          {renderDetailCard(heritage, 'Heritage Site')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'culture' && (
                  <div className="animate-in fade-in duration-500 space-y-10">
                     
                     <div>
                       <h4 className="text-sm font-black text-stone-100 uppercase tracking-widest mb-4 flex items-center gap-3"><span className="text-2xl">🎪</span> Cultural Traditions</h4>
                       <div className="grid sm:grid-cols-2 gap-4">
                         {activeData.traditions.map((item, idx) => (
                            <div key={idx}>
                              {renderDetailCard(item, 'Cultural Tradition')}
                            </div>
                         ))}
                       </div>
                     </div>

                     <div>
                       <h4 className="text-sm font-black text-stone-100 uppercase tracking-widest mb-4 flex items-center gap-3"><span className="text-2xl">🍲</span> Culinary Heritage</h4>
                       <div className="grid sm:grid-cols-2 gap-4">
                         {activeData.foods.map((item, idx) => (
                            <div key={idx}>
                              {renderDetailCard(item, 'Culinary Heritage')}
                            </div>
                         ))}
                       </div>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-6">
                       <div>
                         <h4 className="text-sm font-black text-stone-100 uppercase tracking-widest mb-4 flex items-center gap-3"><span className="text-2xl">🎵</span> Music & Dance</h4>
                         <div className="space-y-4">
                           {activeData.music.map((item, idx) => (
                              <div key={idx}>
                                {renderDetailCard(item, 'Music & Dance')}
                              </div>
                           ))}
                         </div>
                       </div>
                       
                       <div>
                         <h4 className="text-sm font-black text-stone-100 uppercase tracking-widest mb-4 flex items-center gap-3"><span className="text-2xl">👗</span> Traditional Clothing</h4>
                         <div className="space-y-4">
                           {activeData.clothing.map((item, idx) => (
                              <div key={idx}>
                                {renderDetailCard(item, 'Traditional Attire')}
                              </div>
                           ))}
                         </div>
                       </div>
                     </div>
                     
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="animate-in fade-in duration-500 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {activeData.images.map((img, i) => (
                      <div key={i} className="group relative h-64 rounded-[2.5rem] overflow-hidden shadow-lg border border-stone-800">
                        <img src={img} alt={`${activeData.name} heritage`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                           <div>
                             <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest block mb-1">Archive View</span>
                             <span className="text-white text-lg font-bold">{activeData.name}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default CulturalMap;
