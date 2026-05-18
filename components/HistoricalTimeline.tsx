import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'Politics' | 'Culture' | 'Religion' | 'Warfare' | 'Innovation';
  imageUrl: string;
}

const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: '1',
    year: 'c. 3.2M BC',
    title: 'Discovery of Lucy (Dinknesh)',
    description: 'The fossilized remains of Australopithecus afarensis, known as Lucy, lived in the Afar region, establishing Ethiopia as the cradle of humanity.',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800'
  },
  {
    id: '2',
    year: 'c. 8th Century BC',
    title: 'Kingdom of Dʿmt & Temple of Yeha',
    description: 'The ancient kingdom of Dʿmt flourished in the north. The Great Temple of Yeha, built in the Sabaean style, remains the oldest standing structure in Ethiopia.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1548651877-3e11400e930f?q=80&w=800'
  },
  {
    id: '3',
    year: 'c. 100 AD',
    title: 'Rise of the Axumite Empire',
    description: 'Axum emerges as a major global naval and trading power, bridging the Roman Empire and ancient India from the highlands of modern Tigray.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1620023414963-39da9b8f2cce?q=80&w=800'
  },
  {
    id: '4',
    year: 'c. 330 AD',
    title: 'Adoption of Christianity',
    description: 'King Ezana adopts Christianity, making Axum one of the first polities to do so, deeply shaping the cultural fabric of the northern highlands.',
    category: 'Religion',
    imageUrl: 'https://images.unsplash.com/photo-1651493638407-742bc54e2bc5?q=80&w=800'
  },
  {
    id: '5',
    year: 'c. 500 AD',
    title: 'Development of Ge\'ez Script',
    description: 'The indigenous Ge\'ez script is fully developed and used for literature, administration, and religious texts.',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1533414443058-293e62057639?q=80&w=800'
  },
  {
    id: '6',
    year: '615 AD',
    title: 'First Hijra to Axum (Al Nejashi)',
    description: 'Seeking refuge from persecution in Mecca, early companions of the Prophet Muhammad were granted asylum by the Axumite King (Nejashi), establishing a deep-rooted Islamic history in Ethiopia.',
    category: 'Religion',
    imageUrl: 'https://images.unsplash.com/photo-1588612143491-0fcf05a6efc1?q=80&w=800'
  },
  {
    id: '7',
    year: 'c. 1200 AD',
    title: 'Rock-Hewn Churches of Lalibela',
    description: 'King Lalibela of the Zagwe dynasty orders the construction of 11 monolithic churches carved entirely downward from living rock in the Amhara region.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800'
  },
  {
    id: '8',
    year: '13th Century',
    title: 'Establishment of the Gadaa System',
    description: 'The Oromo people formalize the Gadaa system, a highly complex, egalitarian, democratic socio-political and chronological system guiding religious and social life.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?q=80&w=800'
  },
  {
    id: '9',
    year: '1529 - 1543',
    title: 'Ethiopian–Adal War (Ahmad Gragn)',
    description: 'A devastating war between the Christian Ethiopian Empire and the Muslim Adal Sultanate under Imam Ahmad ibn Ibrahim al-Ghazi, fundamentally altering the region\'s geopolitics.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1624640166291-a1e621ec3694?q=80&w=800'
  },
  {
    id: '10',
    year: '1560s',
    title: 'Oromo Expansions',
    description: 'A massive migration and expansion of Oromo pastoralist communities across the Horn of Africa, profoundly changing the demographic and cultural map of Ethiopia.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1616428236750-f8d2239d1b11?q=80&w=800'
  },
  {
    id: '11',
    year: '1636',
    title: 'Founding of Gondar',
    description: 'Emperor Fasilides establishes Gondar as the permanent capital of the Ethiopian Empire, launching a century of castle building and a cultural renaissance.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800'
  },
  {
    id: '12',
    year: '1855',
    title: 'Rise of Emperor Tewodros II',
    description: 'Tewodros II ends the Era of the Princes (Zemene Mesafint) and centralizes power, beginning the modern reunification of the Ethiopian state.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1506505494950-8438ebccba56?q=80&w=800'
  },
  {
    id: '13',
    year: '1875 - 1876',
    title: 'Ethio-Egyptian War',
    description: 'Emperor Yohannes IV soundly defeats Egyptian invasion forces at the Battles of Gundet and Gura, halting Egyptian expansion into the Horn of Africa.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1532585227763-7e4b2d39df16?q=80&w=800'
  },
  {
    id: '14',
    year: '1887',
    title: 'Founding of Addis Ababa',
    description: 'Emperor Menelik II and Empress Taytu Betul found the city of Addis Ababa (New Flower) in the heart of Oromia/Shewa, moving the political center of gravity south.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800'
  },
  {
    id: '15',
    year: '1887',
    title: 'Battle of Chelenqo',
    description: 'Menelik II\'s forces defeat the Emirate of Harar, bringing the ancient, walled Islamic commercial hub of Harar into the Ethiopian Empire.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1550993510-9b0f48039600?q=80&w=800'
  },
  {
    id: '16',
    year: '1896',
    title: 'Battle of Adwa',
    description: 'A united Ethiopian force representing diverse ethnic groups crushes the invading Italian army, becoming a global symbol of Black independence and anti-colonial resistance.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1620023414963-39da9b8f2cce?q=80&w=800'
  },
  {
    id: '17',
    year: '1897',
    title: 'Incorporation of Southern Kingdoms',
    description: 'The ancient kingdoms of Kaffa, Wolaytta, and Sidama are incorporated into the modern Ethiopian state following protracted military campaigns.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800'
  },
  {
    id: '18',
    year: '1930',
    title: 'Coronation of Haile Selassie',
    description: 'Ras Tafari Makonnen is crowned Emperor Haile Selassie I. His reign brings modernization, the first written constitution, and global diplomatic prominence.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1588612143491-0fcf05a6efc1?q=80&w=800'
  },
  {
    id: '19',
    year: '1935 - 1941',
    title: 'Second Italo-Ethiopian War & Resistance',
    description: 'Fascist Italy invades Ethiopia. Ethiopian patriots from all regions mount a fierce guerrilla resistance for five years until liberation in 1941.',
    category: 'Warfare',
    imageUrl: 'https://images.unsplash.com/photo-1533414443058-293e62057639?q=80&w=800'
  },
  {
    id: '20',
    year: '1963',
    title: 'Creation of the OAU',
    description: 'Addis Ababa becomes the diplomatic capital of Africa as the Organization of African Unity (now AU) is founded, cementing Ethiopia\'s pan-African legacy.',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800'
  },
  {
    id: '21',
    year: '1974',
    title: 'The Derg Revolution',
    description: 'A Marxist-Leninist military junta (the Derg) overthrows the monarchy, leading to massive social restructuring, the Red Terror, and civil war.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1624640166291-a1e621ec3694?q=80&w=800'
  },
  {
    id: '22',
    year: '1991',
    title: 'Fall of the Derg & Ethnic Federalism',
    description: 'A coalition of rebel forces (EPRDF) topples the Derg regime. Ethiopia adopts a new constitution based on ethnic federalism, reshaping the nation\'s identity.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1616428236750-f8d2239d1b11?q=80&w=800'
  },
  {
    id: '23',
    year: '2015',
    title: 'Fichee-Chambalaalla UNESCO Recognition',
    description: 'The ancient Sidama New Year festival is officially inscribed as Intangible Cultural Heritage by UNESCO, highlighting Southern Ethiopia\'s rich cultural diversity.',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?q=80&w=800'
  },
  {
    id: '24',
    year: '2019',
    title: 'Nobel Peace Prize',
    description: 'Prime Minister Abiy Ahmed is awarded the Nobel Peace Prize for his efforts in resolving the border conflict with Eritrea and initiating democratic reforms.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1596700075591-9e2b92abf480?q=80&w=800'
  },
  {
    id: '25',
    year: '2020',
    title: 'The Grand Ethiopian Renaissance Dam',
    description: 'Ethiopia begins filling the GERD on the Blue Nile in the Benishangul-Gumuz region. It stands as the largest hydroelectric power plant in Africa.',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1548651877-3e11400e930f?q=80&w=800'
  }
];

const CATEGORIES = ['All', 'Politics', 'Culture', 'Religion', 'Warfare', 'Innovation'] as const;

const HistoricalTimeline: React.FC = () => {
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>('All');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const filteredEvents = filter === 'All' 
    ? TIMELINE_DATA 
    : TIMELINE_DATA.filter(e => e.category === filter);

  return (
    <div className="min-h-screen bg-stone-50 p-6 lg:p-10 font-sans relative overflow-hidden">
      
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
              {/* Scanline hover effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-stone-100/50 to-transparent -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite]"></span>
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

        {/* Cinematic Modal - Light Theme */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
            >
              <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" onClick={() => setSelectedEvent(null)}></div>
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.95, opacity: 0, rotateX: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-5xl bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Section */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                  <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900/60 md:from-transparent via-transparent to-transparent"></div>
                  
                  {/* Digital Glitch Overlay */}
                  <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiAvPgo8L3N2Zz4=')] mix-blend-overlay"></div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative overflow-y-auto custom-scrollbar">
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-6 right-6 w-10 h-10 bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full flex items-center justify-center transition-all z-20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-amber-600 font-black text-xl drop-shadow-sm">{selectedEvent.year}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-stone-50 text-amber-700 px-3 py-1 rounded border border-amber-200">
                      {selectedEvent.category} Database
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-8 tracking-tighter">
                    {selectedEvent.title}
                  </h2>
                  
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-transparent rounded-full"></div>
                    <p className="text-stone-600 text-lg leading-relaxed font-medium">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center justify-between border-t border-stone-100 pt-8">
                    <div className="flex items-center gap-3 opacity-60">
                       <svg className="w-5 h-5 text-stone-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Historical Record Verified</span>
                    </div>
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
