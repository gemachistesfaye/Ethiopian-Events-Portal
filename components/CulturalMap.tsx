import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heritage {
  name: string;
  type: 'UNESCO World Heritage' | 'National Park' | 'Historic Site' | 'Intangible Heritage' | 'Cultural Landscape' | 'Modern Marvel';
  description: string;
}

interface RegionData {
  id: string;
  name: string;
  capital: string;
  population: string;
  heritages: Heritage[];
  traditions: string[];
  festivals: string[];
  foods: string[];
  languages: string[];
  clothing: string;
  history: string;
  music: string;
  summary: string;
  images: string[];
  color: string;
}

const REGIONS_DATA: Record<string, RegionData> = {
  tigray: {
    id: 'tigray',
    name: 'Tigray Region',
    capital: 'Mekelle',
    population: '7+ Million',
    heritages: [
      { name: 'Aksum Obelisks', type: 'UNESCO World Heritage', description: 'Ancient monolithic stelae marking the tombs of Aksumite kings.' },
      { name: 'Rock-Hewn Churches of Gheralta', type: 'Historic Site', description: 'Spectacular ancient churches carved into sheer sandstone cliffs.' },
      { name: 'Al Nejashi Mosque', type: 'Historic Site', description: 'One of the oldest mosques in Africa, marking the first migration of Muslims.' },
      { name: 'Debre Damo Monastery', type: 'Historic Site', description: 'A 6th-century monastery accessible only by climbing a 15-meter leather rope.' },
      { name: 'Temple of Yeha', type: 'Historic Site', description: 'The oldest standing structure in Ethiopia, dating back to 700 BC.' }
    ],
    traditions: ['Ashenda Festival', 'Traditional coffee ceremony', 'Deep Orthodox Christian heritage'],
    festivals: ['Ashenda (Girls\' Festival)', 'Timkat in Axum', 'Mariam Tsion'],
    foods: ['Tihlo', 'Injera with Sebhi', 'Himbasha', 'Mies (Honey wine)'],
    languages: ['Tigrinya', 'Saho', 'Kunama'],
    clothing: 'Tilfi (Embroidered white cotton dresses with intricate cross patterns)',
    history: 'Heart of the ancient Aksumite Empire. Home to the Ark of the Covenant according to Ethiopian Orthodox tradition.',
    music: 'Guayla (dynamic, circular dance music with rapid drum beats and shoulder movements)',
    images: ['https://images.unsplash.com/photo-1548651877-3e11400e930f?q=80&w=800', 'https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800'],
    summary: 'The northernmost region of Ethiopia, rich in ancient history, majestic mountains, and the cradle of the Aksumite civilization.',
    color: '#F59E0B'
  },
  amhara: {
    id: 'amhara',
    name: 'Amhara Region',
    capital: 'Bahir Dar',
    population: '30+ Million',
    heritages: [
      { name: 'Rock-Hewn Churches of Lalibela', type: 'UNESCO World Heritage', description: '11 medieval monolithic cave churches dubbed the "New Jerusalem".' },
      { name: 'Fasil Ghebbi (Gondar)', type: 'UNESCO World Heritage', description: 'A fortress-city containing castles and palaces of Ethiopian emperors.' },
      { name: 'Simien Mountains National Park', type: 'UNESCO World Heritage', description: 'Spectacular landscapes with jagged mountain peaks and endemic wildlife.' },
      { name: 'Lake Tana Monasteries', type: 'Historic Site', description: 'Ancient isolated monasteries located on the islands of Lake Tana.' },
      { name: 'Blue Nile Falls (Tis Abay)', type: 'Cultural Landscape', description: 'The majestic waterfall on the Blue Nile river.' }
    ],
    traditions: ['Eskista dance', 'Intricate cotton weaving', 'Religious fasting traditions'],
    festivals: ['Genna (Christmas) in Lalibela', 'Timkat (Epiphany) in Gondar', 'Fasilides Bath celebrations'],
    foods: ['Doro Wat', 'Tibs', 'Tej (Honey Wine)', 'Gomen'],
    languages: ['Amharic', 'Awngi', 'Oromo'],
    clothing: 'Habesha Kemis (Elegant white woven dresses with colorful borders)',
    history: 'The historic center of the Solomonic dynasty. Features the medieval castles of Gondar and the source of the Blue Nile at Lake Tana.',
    music: 'Eskista (highly energetic, shoulder-focused dance music)',
    images: ['https://images.unsplash.com/photo-1620023414963-39da9b8f2cce?q=80&w=800', 'https://images.unsplash.com/photo-1651493638407-742bc54e2bc5?q=80&w=800'],
    summary: 'A dramatic region characterized by high mountains, medieval castles, and deep Christian orthodox traditions.',
    color: '#3B82F6'
  },
  oromiya: {
    id: 'oromiya',
    name: 'Oromia Region',
    capital: 'Finfinnee (Addis Ababa)',
    population: '40+ Million',
    heritages: [
      { name: 'Bale Mountains National Park', type: 'UNESCO World Heritage', description: 'A massive afro-alpine plateau, home to the endemic Ethiopian wolf.' },
      { name: 'Gadaa System', type: 'Intangible Heritage', description: 'An ancient indigenous democratic socio-political system of the Oromo people.' },
      { name: 'Sof Omar Caves', type: 'Cultural Landscape', description: 'The longest cave system in Africa, carved by the Weyib River.' },
      { name: 'Awash National Park', type: 'National Park', description: 'Spectacular gorge and falls, rich in wildlife and arid landscapes.' },
      { name: 'Irreechaa Festival', type: 'Intangible Heritage', description: 'A massive thanksgiving festival celebrating peace and nature.' }
    ],
    traditions: ['Gadaa System', 'Irreechaa thanksgiving', 'Ateetee women\'s peace rituals'],
    festivals: ['Irreechaa', 'Ayyana', 'Gubaa'],
    foods: ['Chumbo', 'Anchote', 'Marqaa', 'Besso'],
    languages: ['Afaan Oromoo'],
    clothing: 'Aadaa Oromoo attire (Waaqoo, Kuandee, Ruufa)',
    history: 'Birthplace of Arabica coffee (Kaffa/Jimma regions). Home to the egalitarian Gadaa system, a framework that predates modern democracy.',
    music: 'Ragada and Shaggooyyee dance styles with intricate shoulder and neck movements',
    images: ['https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800', 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?q=80&w=800'],
    summary: 'The largest and most populous region in Ethiopia, known for its diverse landscapes, the origin of coffee, and rich Gadaa heritage.',
    color: '#10B981'
  },
  afar: {
    id: 'afar',
    name: 'Afar Region',
    capital: 'Semera',
    population: '2+ Million',
    heritages: [
      { name: 'Lower Valley of the Awash', type: 'UNESCO World Heritage', description: 'Paleontological site where the 3.2 million-year-old hominid "Lucy" was discovered.' },
      { name: 'Erta Ale Volcano', type: 'Cultural Landscape', description: 'A continuously active basaltic shield volcano featuring a persistent lava lake.' },
      { name: 'Danakil Depression', type: 'Cultural Landscape', description: 'One of the lowest and hottest places on Earth, famous for its neon acid springs.' },
      { name: 'Dallol', type: 'Cultural Landscape', description: 'A stunning hydrothermal field with bright yellow and green sulfur springs.' }
    ],
    traditions: ['Nomadic desert lifestyle', 'Traditional salt mining caravans (Amolé)'],
    festivals: ['Islamic holidays', 'Tribal leadership gatherings'],
    foods: ['Milk and meat-based pastoral diet', 'Salt-cured provisions'],
    languages: ['Afar'],
    clothing: 'Sanafil (distinctive wraparound skirts) and curved jile daggers',
    history: 'The Danakil Depression is the cradle of humanity. Historically, the Afar people controlled the vital salt trade connecting the coast to the highlands.',
    music: 'High-energy warrior dances with chanting and rhythmic stepping',
    images: ['https://images.unsplash.com/photo-1624640166291-a1e621ec3694?q=80&w=800', 'https://images.unsplash.com/photo-1533414443058-293e62057639?q=80&w=800'],
    summary: 'A land of extremes, featuring active volcanoes, neon acid lakes, salt flats, and the cradle of humanity.',
    color: '#EF4444'
  },
  somali: {
    id: 'somali',
    name: 'Somali Region',
    capital: 'Jigjiga',
    population: '6+ Million',
    heritages: [
      { name: 'Karamara Mountains', type: 'Historic Site', description: 'A culturally and historically significant mountain range.' },
      { name: 'Babile Elephant Sanctuary', type: 'National Park', description: 'A massive wildlife reserve home to the rare African savanna elephant.' },
      { name: 'Taleex Historic Architecture', type: 'Historic Site', description: 'Ancient structures reflecting deep Islamic trade history.' }
    ],
    traditions: ['Nomadic pastoralism', 'Camel herding culture', 'Deep oral storytelling and poetry'],
    festivals: ['Eid al-Fitr', 'Eid al-Adha', 'Traditional clan gatherings'],
    foods: ['Bariis (Spiced Rice with meat)', 'Muqmad (Dried meat)', 'Camel milk', 'Xalwo (Halwa)'],
    languages: ['Somali'],
    clothing: 'Koofiyad and Macawiis for men, colorful Dirac for women',
    history: 'Historically part of vital ancient trade routes connecting the Horn of Africa to the Arabian peninsula. Known for deep Islamic heritage and poetic traditions.',
    music: 'Dhaanto (traditional folk dance and music mimicking camel gaits)',
    images: ['https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800', 'https://images.unsplash.com/photo-1506505494950-8438ebccba56?q=80&w=800'],
    summary: 'An expansive, arid region dominated by pastoralist culture, camels, and vibrant trade history.',
    color: '#EAB308'
  },
  southern: {
    id: 'southern',
    name: 'Southern Ethiopia (SNNPR, Sidama, SWEPR)',
    capital: 'Hawassa / Arba Minch',
    population: '20+ Million',
    heritages: [
      { name: 'Lower Valley of the Omo', type: 'UNESCO World Heritage', description: 'A prehistoric site crucial for understanding human evolution, and home to diverse indigenous tribes.' },
      { name: 'Konso Cultural Landscape', type: 'UNESCO World Heritage', description: 'A highly organized landscape of walled terraces and fortified settlements.' },
      { name: 'Tiya Megaliths', type: 'UNESCO World Heritage', description: 'Ancient standing stones adorned with mysterious carvings of swords and symbols.' },
      { name: 'Nechisar National Park', type: 'National Park', description: 'The "Bridge of Heaven", a stunning isthmus between Lake Abaya and Lake Chamo.' },
      { name: 'Fichee-Chambalaalla', type: 'Intangible Heritage', description: 'The Sidama people\'s New Year festival.' }
    ],
    traditions: ['Body painting (Omo Valley tribes)', 'Terraced agriculture (Konso)', 'Bull jumping ceremony (Hamer)'],
    festivals: ['Fichee-Chambalaalla', 'Evangadi (Night dancing)'],
    foods: ['Kocho (False banana bread)', 'Bulla', 'Kitfo (Gurage)'],
    languages: ['Sidama', 'Wolaytta', 'Gurage', 'Hamer', '40+ others'],
    clothing: 'Diverse tribal wear, ranging from woven cotton to intricate beadwork and animal skins.',
    history: 'The most ethnically diverse region of Ethiopia, home to over 45 distinct ethnic groups, preserving ancient tribal customs and agro-pastoralist systems.',
    music: 'Highly rhythmic tribal music using diverse instruments like the lyre and polyphonic singing.',
    images: ['https://images.unsplash.com/photo-1616428236750-f8d2239d1b11?q=80&w=800', 'https://images.unsplash.com/photo-1532585227763-7e4b2d39df16?q=80&w=800'],
    summary: 'A melting pot of over 45 distinct ethnic groups, featuring ancient megaliths, the Great Rift Valley, and vibrant tribal cultures.',
    color: '#8B5CF6'
  },
  harari: {
    id: 'harari',
    name: 'Harari Region',
    capital: 'Harar',
    population: '250,000+',
    heritages: [
      { name: 'Harar Jugol', type: 'UNESCO World Heritage', description: 'The fortified historic walled city of Harar, featuring 82 mosques.' },
      { name: 'Arthur Rimbaud House', type: 'Historic Site', description: 'A museum dedicated to the French poet who lived in Harar in the 1880s.' },
      { name: 'Hyena Feeding Tradition', type: 'Intangible Heritage', description: 'A unique nightly ritual where local "Hyena men" feed wild hyenas by hand.' }
    ],
    traditions: ['Hyena feeding', 'Coffee roasting ceremonies', 'Islamic scholarship'],
    festivals: ['Eid al-Fitr', 'Shuwal Eid (A unique post-Ramadan celebration)'],
    foods: ['Fatira', 'Hulbet', 'Harari Coffee'],
    languages: ['Harari', 'Oromo', 'Amharic'],
    clothing: 'Vibrant, brightly colored garments and traditional Harari woven textiles.',
    history: 'Harar is considered the fourth holiest city of Islam. It served as a major commercial hub linking African and Islamic trade routes for centuries.',
    music: 'Traditional Harari songs accompanied by the Kabaro drum.',
    images: ['https://images.unsplash.com/photo-1588612143491-0fcf05a6efc1?q=80&w=800', 'https://images.unsplash.com/photo-1550993510-9b0f48039600?q=80&w=800'],
    summary: 'A small but historically massive region centered around the ancient, walled Islamic city of Harar.',
    color: '#EC4899'
  },
  addis: {
    id: 'addis',
    name: 'Addis Ababa',
    capital: 'Addis Ababa (Chartered City)',
    population: '5+ Million',
    heritages: [
      { name: 'National Museum of Ethiopia', type: 'Historic Site', description: 'Home to the fossilized remains of "Lucy" (Dinknesh).' },
      { name: 'Holy Trinity Cathedral', type: 'Historic Site', description: 'A massive ornate cathedral, the final resting place of Emperor Haile Selassie.' },
      { name: 'Addis Ababa Mercato', type: 'Cultural Landscape', description: 'The largest open-air market in Africa.' },
      { name: 'Entoto Mountains', type: 'National Park', description: 'The eucalyptus-covered mountains offering panoramic views of the city.' }
    ],
    traditions: ['Urban coffee culture', 'Diverse cultural integration'],
    festivals: ['Meskel at Meskel Square', 'Great Ethiopian Run', 'Timkat at Jan Meda'],
    foods: ['All Ethiopian cuisines', 'Shiro', 'Tibs', 'Modern fusion'],
    languages: ['Amharic', 'Oromo', 'English', 'All national languages'],
    clothing: 'A mix of modern urban wear and traditional Habesha clothing on holidays.',
    history: 'Founded in 1886 by Emperor Menelik II and Empress Taytu. It is the diplomatic capital of Africa, hosting the African Union headquarters.',
    music: 'Ethio-Jazz (originating in the city), modern pop, and traditional fusion.',
    images: ['https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800', 'https://images.unsplash.com/photo-1620023414963-39da9b8f2cce?q=80&w=800'],
    summary: 'The bustling capital city, acting as the diplomatic hub of Africa and a melting pot of all Ethiopian cultures.',
    color: '#64748B'
  },
  gambela: {
    id: 'gambela',
    name: 'Gambela Region',
    capital: 'Gambela',
    population: '400,000+',
    heritages: [
      { name: 'Gambela National Park', type: 'National Park', description: 'The largest national park in Ethiopia, famous for the massive White-eared kob antelope migration.' },
      { name: 'Baro River', type: 'Cultural Landscape', description: 'A major river and historically the only navigable river in Ethiopia.' }
    ],
    traditions: ['Riverine lifestyle', 'Fishing traditions', 'Unique body scarification'],
    festivals: ['Local harvest festivals'],
    foods: ['Fish-based dishes', 'Sorghum and maize'],
    languages: ['Nuer', 'Anywaa', 'Majang'],
    clothing: 'Light clothing suited for the hot, humid lowland climate.',
    history: 'A lush, low-lying region that shares strong cultural and ecological ties with South Sudan. Historically a major river port.',
    music: 'Rhythmic drum-based music and synchronized dances.',
    images: ['https://images.unsplash.com/photo-1616428236750-f8d2239d1b11?q=80&w=800', 'https://images.unsplash.com/photo-1532585227763-7e4b2d39df16?q=80&w=800'],
    summary: 'A hot, lush lowland region famous for massive wildlife migrations and majestic rivers.',
    color: '#06B6D4'
  },
  benishangul: {
    id: 'benishangul',
    name: 'Benishangul-Gumuz',
    capital: 'Asosa',
    population: '1.2+ Million',
    heritages: [
      { name: 'Grand Ethiopian Renaissance Dam (GERD)', type: 'Modern Marvel', description: 'The largest hydroelectric dam in Africa, built on the Blue Nile.' },
      { name: 'Blue Nile Gorge', type: 'Cultural Landscape', description: 'Often compared to the Grand Canyon, carved by the majestic Blue Nile.' }
    ],
    traditions: ['Traditional gold mining', 'Berta music and dance'],
    festivals: ['Local cultural celebrations'],
    foods: ['Sorghum', 'Root crops', 'Forest honey'],
    languages: ['Berta', 'Gumuz', 'Amharic'],
    clothing: 'Colorful, lightweight fabrics suitable for the tropical climate.',
    history: 'A historically significant region for gold mining. Now famous globally as the home of the monumental GERD project.',
    music: 'Berta traditional music featuring long bamboo flutes and gourds.',
    images: ['https://images.unsplash.com/photo-1624640166291-a1e621ec3694?q=80&w=800', 'https://images.unsplash.com/photo-1533414443058-293e62057639?q=80&w=800'],
    summary: 'A frontier region defined by the Blue Nile river, rich in gold and modern energy marvels.',
    color: '#F97316'
  },
  dire_dawa: {
    id: 'dire_dawa',
    name: 'Dire Dawa',
    capital: 'Dire Dawa (Chartered City)',
    population: '500,000+',
    heritages: [
      { name: 'Ethio-Djibouti Railway Station', type: 'Historic Site', description: 'The historic railway station that birthed the city in the early 20th century.' },
      { name: 'Kefira Market', type: 'Cultural Landscape', description: 'A vibrant, colorful traditional market showcasing the fusion of cultures.' },
      { name: 'Legedadi Cave Paintings', type: 'Historic Site', description: 'Prehistoric rock art found near the city.' }
    ],
    traditions: ['Trade and commerce', 'Chewing Khat (Qat) socially'],
    festivals: ['Islamic and Christian holidays'],
    foods: ['Camel meat', 'Samosas', 'Vibrant street food'],
    languages: ['Oromo', 'Somali', 'Amharic'],
    clothing: 'Urban fusion of Somali Macawiis, Harari fabrics, and modern wear.',
    history: 'Created directly as a result of the Addis Ababa-Djibouti railway bypassing Harar. It became Ethiopia\'s first modern planned city.',
    music: 'A fusion of Somali, Harari, and modern Ethiopian music.',
    images: ['https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800', 'https://images.unsplash.com/photo-1506505494950-8438ebccba56?q=80&w=800'],
    summary: 'A vibrant, culturally diverse railway city born out of trade and modern transport.',
    color: '#84CC16'
  }
};

const CulturalMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('amhara');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'heritages' | 'culture' | 'gallery'>('overview');

  const filteredRegions = useMemo(() => {
    return Object.values(REGIONS_DATA).filter(region => 
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.heritages.some(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const activeData = REGIONS_DATA[selectedRegion];

  return (
    <div className="min-h-screen p-4 lg:p-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="mb-10 text-center lg:text-left bg-stone-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform scale-150 translate-x-10 -translate-y-10">
           <svg className="w-64 h-64" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block backdrop-blur-sm border border-amber-500/20">All 11 Regions Included</span>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">Cultural <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">Atlas</span></h1>
        <p className="text-stone-400 text-lg font-medium max-w-2xl">A comprehensive database of all Ethiopian regional states, chartered cities, and their exhaustive heritage sites.</p>
        
        <div className="relative mt-8 max-w-xl z-20">
          <input 
            type="text"
            placeholder="Search all 11 regions or specific heritage sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-stone-800/80 backdrop-blur-md border border-stone-700 rounded-2xl px-14 text-sm font-bold text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all shadow-inner"
          />
          <svg className="w-5 h-5 absolute left-5 top-4.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </header>

      <div className="grid xl:grid-cols-12 gap-8 items-start">
        
        <div className="xl:col-span-4 bg-white p-6 rounded-[3rem] border border-stone-200 shadow-2xl relative sticky top-28 h-[80vh] overflow-hidden flex flex-col">
          <div className="mb-6 px-4 pt-2">
            <h3 className="text-xl font-black text-stone-900 tracking-tight">Atlas Navigator</h3>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Select a Territory</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {(searchQuery ? filteredRegions : Object.values(REGIONS_DATA)).map((region) => (
              <button
                key={region.id}
                onClick={() => { setSelectedRegion(region.id); setActiveTab('overview'); }}
                className={`w-full text-left p-5 rounded-[2rem] transition-all duration-300 border-2 ${
                  selectedRegion === region.id 
                    ? 'bg-stone-900 border-stone-900 shadow-xl scale-[1.02]' 
                    : 'bg-stone-50 border-stone-100 hover:bg-stone-100 hover:border-stone-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${region.color}20` }}>
                     <div className="w-4 h-4 rounded-full" style={{ backgroundColor: region.color }}></div>
                  </div>
                  <div>
                    <h4 className={`text-base font-black ${selectedRegion === region.id ? 'text-white' : 'text-stone-900'}`}>{region.name}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedRegion === region.id ? 'text-stone-400' : 'text-stone-500'}`}>
                      {region.heritages.length} Heritages
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="xl:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden"
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

              <div className="flex overflow-x-auto border-b border-stone-100 px-6 pt-2 bg-stone-50 custom-scrollbar">
                 {[
                   { id: 'overview', label: 'Overview' },
                   { id: 'heritages', label: 'All Heritages' },
                   { id: 'culture', label: 'Culture & Food' },
                   { id: 'gallery', label: 'Gallery' }
                 ].map(tab => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`px-6 py-5 text-xs font-black uppercase tracking-widest border-b-4 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
                   >
                     {tab.label}
                   </button>
                 ))}
              </div>

              <div className="p-8 md:p-10 min-h-[500px]">
                
                {activeTab === 'overview' && (
                  <div className="animate-in fade-in duration-500 space-y-8">
                     <p className="text-lg text-stone-600 font-medium leading-relaxed bg-stone-50 p-6 rounded-[2rem] border border-stone-100">{activeData.summary}</p>
                     
                     <div className="grid grid-cols-2 gap-6">
                       <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm flex items-center gap-4">
                         <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">🏛️</div>
                         <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Capital City</h4>
                           <p className="text-lg font-black text-stone-900 leading-none">{activeData.capital}</p>
                         </div>
                       </div>
                       <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🗣️</div>
                         <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Languages</h4>
                           <p className="text-sm font-black text-stone-900 leading-tight">{activeData.languages.join(', ')}</p>
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
                       <h3 className="text-xl font-black text-stone-900">Exhaustive Heritage Index</h3>
                       <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-lg text-xs font-bold">{activeData.heritages.length} Official Sites</span>
                    </div>
                    
                    <div className="space-y-4">
                      {activeData.heritages.map((heritage, idx) => (
                        <div key={idx} className="bg-white border border-stone-200 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center gap-6">
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <h4 className="text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors">{heritage.name}</h4>
                               {heritage.type === 'UNESCO World Heritage' && (
                                 <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">UNESCO</span>
                               )}
                             </div>
                             <p className="text-sm font-medium text-stone-500 leading-relaxed">{heritage.description}</p>
                           </div>
                           <div className="md:w-48">
                              <span className="block text-center bg-stone-50 border border-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                                {heritage.type}
                              </span>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'culture' && (
                  <div className="animate-in fade-in duration-500 space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                       <div className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100">
                         <h4 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6 flex items-center gap-3"><span className="text-2xl">🎪</span> Traditions</h4>
                         <ul className="space-y-4">
                           {activeData.traditions.map((t, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm font-bold text-stone-700">
                               <span className="text-amber-500 mt-0.5">●</span> {t}
                             </li>
                           ))}
                         </ul>
                       </div>

                       <div className="space-y-8">
                         <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                           <h4 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-3"><span className="text-2xl">🍲</span> Culinary Heritage</h4>
                           <div className="flex flex-wrap gap-2">
                             {activeData.foods.map((f, i) => (
                               <span key={i} className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl">{f}</span>
                             ))}
                           </div>
                         </div>

                         <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                           <h4 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-3"><span className="text-2xl">🎵</span> Music & Dance</h4>
                           <p className="text-sm font-medium text-stone-600 leading-relaxed">{activeData.music}</p>
                         </div>
                       </div>
                     </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="animate-in fade-in duration-500 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {activeData.images.map((img, i) => (
                      <div key={i} className="group relative h-64 rounded-[2.5rem] overflow-hidden shadow-lg border border-stone-200">
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
