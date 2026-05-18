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
    year: 'c. 100 AD',
    title: 'Rise of the Axumite Empire',
    description: 'Axum becomes a major naval and trading power, bridging the Roman Empire and ancient India.',
    category: 'Politics',
    imageUrl: 'https://picsum.photos/id/1011/800/600'
  },
  {
    id: '2',
    year: 'c. 330 AD',
    title: 'Adoption of Christianity',
    description: 'King Ezana adopts Christianity, making Axum one of the first polities to do so.',
    category: 'Religion',
    imageUrl: 'https://picsum.photos/id/1012/800/600'
  },
  {
    id: '3',
    year: 'c. 500 AD',
    title: 'Development of Ge\'ez Script',
    description: 'The Ge\'ez script is fully developed and used for literature and religious texts.',
    category: 'Innovation',
    imageUrl: 'https://picsum.photos/id/1013/800/600'
  },
  {
    id: '4',
    year: 'c. 1200 AD',
    title: 'Rock-Hewn Churches of Lalibela',
    description: 'King Lalibela orders the construction of 11 monolithic churches carved from living rock.',
    category: 'Culture',
    imageUrl: 'https://picsum.photos/id/1014/800/600'
  },
  {
    id: '5',
    year: '1896',
    title: 'Battle of Adwa',
    description: 'Ethiopian forces under Emperor Menelik II defeat the Italian army, securing independence.',
    category: 'Warfare',
    imageUrl: 'https://picsum.photos/id/1015/800/600'
  },
  {
    id: '6',
    year: '1930',
    title: 'Coronation of Haile Selassie',
    description: 'Ras Tafari Makonnen is crowned as Emperor Haile Selassie I.',
    category: 'Politics',
    imageUrl: 'https://picsum.photos/id/1016/800/600'
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
