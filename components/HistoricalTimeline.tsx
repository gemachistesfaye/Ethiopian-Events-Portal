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
    <div className="min-h-screen bg-stone-50 p-6 lg:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <span className="bg-stone-900 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">Chronicle of Time</span>
          <h1 className="text-5xl font-black text-stone-900 tracking-tighter leading-none mb-2">Historical <span className="text-amber-600">Timeline</span></h1>
          <p className="text-stone-500 text-sm font-medium">Journey through the epic eras of Ethiopian history.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === c ? 'bg-amber-500 text-stone-900' : 'bg-white border border-stone-200 text-stone-400 hover:text-stone-600'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-stone-200"></div>

          <div className="space-y-12 md:space-y-16">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-4 md:gap-0`}
              >
                {/* Content Card */}
                <div className="w-full md:w-[45%] ml-12 md:ml-0">
                  <div 
                    className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-xl hover:border-amber-500 transition-all cursor-pointer group"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest">{event.year}</span>
                    <h3 className="text-xl font-black text-stone-900 mt-1 mb-2 group-hover:text-amber-600 transition-colors">{event.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{event.description}</p>
                    <span className="mt-4 inline-block text-[9px] font-black uppercase bg-stone-100 text-stone-400 px-2 py-1 rounded">{event.category}</span>
                  </div>
                </div>

                {/* Central Node */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow-lg"></div>

                {/* Empty space filler for alignment */}
                <div className="hidden md:block w-[45%]"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal for Details */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white max-w-2xl w-full rounded-[3rem] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64">
                  <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-amber-500 text-stone-900 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{selectedEvent.year}</span>
                    <h2 className="text-3xl font-black text-white mt-2 tracking-tight">{selectedEvent.title}</h2>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-stone-600 text-base leading-relaxed mb-6">{selectedEvent.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest">{selectedEvent.category}</span>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="text-xs font-black uppercase text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      Close
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
