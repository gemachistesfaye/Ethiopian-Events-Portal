
import React, { useState, useEffect, useMemo } from 'react';
import Calendar from './components/Calendar';
import EventDetails from './components/EventDetails';
import MyReminders from './components/MyReminders';
import CultureZone from './components/CultureZone';
import HeritageChat from './components/HeritageChat';
import { EthiopianEvent, UserReminder, CalendarDay, ReminderPriority, ReminderCategory } from './types';
import { EVENTS_DATA, ETHIOPIAN_MONTHS_AMHARIC } from './constants';
import { toEthiopianDate } from './utils/dateConverter';

const App: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EthiopianEvent | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [reminders, setReminders] = useState<UserReminder[]>([]);
  const [activeTab, setActiveTab] = useState<'calendar' | 'reminders' | 'culture' | 'chat'>('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Religious' | 'Public' | 'Cultural'>('All');

  // Today's summary for the top bar
  const todayInfo = useMemo(() => {
    const now = new Date();
    const eth = toEthiopianDate(now);
    return {
      greg: now.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }),
      eth: eth,
      ethAmharic: `${ETHIOPIAN_MONTHS_AMHARIC[eth.month - 1]} ${eth.day}, ${eth.year}`
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('eth_reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reminders", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eth_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleAddReminder = (
    dateStr: string,
    note: string,
    priority: ReminderPriority,
    category: ReminderCategory,
    eventId?: string
  ) => {
    const newReminder: UserReminder = {
      id: Math.random().toString(36).substring(2, 11), // use substring instead of deprecated substr
      eventId,
      dateStr,
      note,
      priority,
      category,
      createdAt: new Date().toISOString()
    };
    setReminders((prev: UserReminder[]) => [newReminder, ...prev]);
  };

  const handleUpdateReminder = (id: string, note: string) => {
    setReminders((prev: UserReminder[]) => prev.map((r: UserReminder) => r.id === id ? { ...r, note } : r));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev: UserReminder[]) => prev.filter((r: UserReminder) => r.id !== id));
  };

  const handleClearAllReminders = () => {
    if (confirm("Destroy all cultural records? This action is permanent.")) {
      setReminders([]);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-amber-200 flex flex-col pb-20 md:pb-0 font-sans">
      {/* Dynamic Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-stone-900 rounded-2xl flex items-center justify-center text-amber-500 font-black text-2xl shadow-2xl transition-all hover:rotate-6 hover:scale-110 cursor-pointer">
              E
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-stone-900 leading-none">ETHIOPIAN <span className="text-amber-600">HERITAGE</span></h1>
              <p className="text-[9px] text-stone-400 font-black uppercase tracking-[0.3em] mt-1">Intelligence Portal</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex gap-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 shadow-inner">
            {[
              { id: 'calendar', label: 'Explore', icon: '🌍' },
              { id: 'reminders', label: 'Saved', icon: '🏺' },
              { id: 'culture', label: 'Zone', icon: '✨' },
              { id: 'chat', label: 'Guide', icon: '🤖' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white shadow-xl text-stone-900 border border-stone-100 scale-[1.02]' : 'text-stone-400 hover:text-stone-600'}`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
                {tab.id === 'reminders' && reminders.length > 0 && (
                   <span className="bg-amber-500 text-stone-900 w-5 h-5 flex items-center justify-center rounded-lg shadow-sm font-bold">{reminders.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex flex-col items-end">
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Local Time</p>
               <p className="text-stone-900 font-bold text-sm tracking-tight">{todayInfo.ethAmharic}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 px-6 h-20 flex items-center justify-around shadow-2xl">
        {[
          { id: 'calendar', label: 'Explore', icon: '🌍' },
          { id: 'reminders', label: 'Saved', icon: '🏺' },
          { id: 'culture', label: 'Zone', icon: '✨' },
          { id: 'chat', label: 'Guide', icon: '🤖' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-amber-600 scale-110' : 'text-stone-400'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10 flex-grow w-full">
        {activeTab === 'calendar' ? (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                   <div>
                     <span className="bg-stone-900 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">The Explorer</span>
                     <h2 className="text-6xl font-black text-stone-900 tracking-tighter leading-none">Heritage <span className="text-amber-600">Portal</span></h2>
                   </div>
                   
                   <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl flex items-center gap-6">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-2xl text-stone-900 shadow-xl">{todayInfo.eth.day}</div>
                      <div>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Ethiopian Date</p>
                        <p className="text-stone-900 font-black text-base">{todayInfo.ethAmharic}</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="md:col-span-2 relative">
                    <input 
                      type="text"
                      placeholder="Search events, history, or locations..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="w-full h-16 bg-white border-2 border-stone-100 rounded-[1.5rem] px-14 text-sm font-bold focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
                    />
                    <svg className="w-6 h-6 absolute left-6 top-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <select 
                    value={categoryFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value as any)}
                    className="h-16 bg-white border-2 border-stone-100 rounded-[1.5rem] px-6 text-xs font-black uppercase tracking-widest focus:border-amber-500 focus:outline-none shadow-sm cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Religious">Religious</option>
                    <option value="Public">Public</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>

                <Calendar 
                  onSelectDate={(day: CalendarDay) => setSelectedDay(day)} 
                  selectedDate={selectedDay?.gregorian || null} 
                />
              </section>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-stone-900 group-hover:bg-amber-500 transition-colors"></div>
                  
                  {selectedDay ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="mb-10">
                         <h3 className="text-3xl font-black text-stone-900 leading-none mb-2">{selectedDay.gregorian.getDate()} {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(selectedDay.gregorian)}</h3>
                         <p className="text-stone-400 text-xs font-black uppercase tracking-widest ethiopic-font">
                           {selectedDay.ethiopian.monthNameAmharic} {selectedDay.ethiopian.day}
                         </p>
                      </div>
                      
                      <div className="space-y-6">
                        {selectedDay.events.length > 0 ? (
                          selectedDay.events.map((event: EthiopianEvent) => (
                            <div 
                              key={event.id} 
                              className="group bg-stone-50 p-6 rounded-[2rem] border border-stone-100 hover:border-amber-400 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-xl"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="relative h-44 rounded-[1.5rem] overflow-hidden mb-5">
                                <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
                                <span className="absolute bottom-4 left-4 bg-amber-500 text-stone-900 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{event.category}</span>
                              </div>
                              <h4 className="font-black text-stone-900 text-xl group-hover:text-amber-600 transition-colors mb-1">{event.name}</h4>
                              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Click for Deep Insight</p>
                            </div>
                          ))
                        ) : (
                          <div className="py-24 text-center bg-stone-50/50 rounded-[2.5rem] border-2 border-dashed border-stone-100">
                             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
                               <svg className="w-8 h-8 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             </div>
                             <p className="text-stone-300 font-black text-[10px] uppercase tracking-widest">No Heritage Records</p>
                          </div>
                        )}
                        
                        <div className="pt-8 border-t border-stone-100 flex items-center justify-center">
                           <button 
                            onClick={() => setActiveTab('reminders')}
                            className="text-stone-400 hover:text-amber-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                           >
                             Manage Personal Heritage Box →
                           </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-32 text-center">
                      <div className="w-24 h-24 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-stone-100 rotate-6 transition-transform shadow-sm">
                        <svg className="w-12 h-12 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </div>
                      <p className="text-stone-300 font-black text-[10px] uppercase tracking-widest max-w-[140px] mx-auto leading-relaxed">Select a portal date to explore history</p>
                    </div>
                  )}
                </div>

                <div className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-stone-800">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                  </div>
                  <h4 className="text-lg font-black text-amber-500 mb-4 tracking-tight flex items-center gap-3">
                     💡 Quick Cultural Fact
                  </h4>
                  <p className="text-stone-400 text-sm leading-relaxed font-medium">
                    The Ethiopian calendar has 13 months. 12 months have 30 days each, and the 13th month, Pagumē, has five or six days depending on if it's a leap year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'reminders' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MyReminders 
              reminders={reminders} 
              events={EVENTS_DATA} 
              onDelete={handleDeleteReminder} 
              onUpdate={handleUpdateReminder}
              onClearAll={handleClearAllReminders}
            />
          </div>
        ) : activeTab === 'culture' ? (
          <CultureZone />
        ) : (
          <HeritageChat />
        )}
      </main>
      <Footer />
      {selectedEvent && (
        <EventDetails 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          onAddReminder={(
            eventId: string,
            note: string,
            priority: ReminderPriority,
            category: ReminderCategory
          ) => {
            handleAddReminder(selectedEvent.gregDate, note, priority, category, eventId);
          }}
        />
      )}
    </div>
  );
};

// Footer component moved outside of App
const Footer: React.FC = () => {
  const socialLinks = [
    { id: 'tg', icon: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3.002-2.21-1.444 1.394c-.16.16-.294.294-.602.294l.215-3.048 5.549-5.012c.241-.213-.053-.331-.373-.118l-6.853 4.314-2.956-.922c-.642-.201-.655-.642.134-.95l11.554-4.451c.535-.196.994.122.832.797z', color: 'bg-sky-500 hover:shadow-sky-200', href: 'https://t.me/GemachisTesfaye' },
    { id: 'gh', icon: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12', color: 'bg-stone-900 hover:shadow-stone-200', href: 'https://github.com/gemachistesfaye' },
    { id: 'mail', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-rose-500 hover:shadow-rose-200', href: 'mailto:gemachistesfaye36@gmail.com', isStroke: true },
    { id: 'phone', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', color: 'bg-emerald-500 hover:shadow-emerald-200', href: 'tel:+251976601074', isStroke: true }
  ];

  return (<footer className="bg-white border-t border-stone-100 mt-12 pt-10 pb-6 px-6">
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
      
      <div className="text-center md:text-left">
        
        <span className="bg-stone-900 text-amber-500 px-3 py-1 rounded text-xs font-black uppercase tracking-widest">
          Dev Profile
        </span>
        <h3 className="text-4xl font-black text-stone-900 mt-3 mb-1 tracking-tighter">
          Gemachis <span className="text-amber-600">| Data & Dev</span>
        </h3>
        
        <p className="text-stone-500 text-sm font-medium max-w-sm">
          Intelligent solutions at the intersection of heritage and tech.
        </p>
      </div>

      {/* Contact Strip */}
      <div className="flex flex-col items-center md:items-end gap-3">
        <div className="text-center md:text-right">
          <h4 className="text-xl font-black text-stone-900 leading-tight">Gemachis Tesfaye</h4>
          
          <p className="text-amber-600 text-xs font-bold uppercase tracking-widest">Lead Engineer</p>
        </div>
        <div className="flex gap-2">
          {socialLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`w-10 h-10 ${link.color} text-white rounded-lg flex items-center justify-center transition-all hover:-translate-y-1 shadow-sm group`}
            >
              <svg 
                className="w-5 h-5 group-hover:scale-110 transition-transform" 
                fill={link.isStroke ? "none" : "currentColor"} 
                stroke={link.isStroke ? "currentColor" : "none"} 
                strokeWidth={link.isStroke ? 2.5 : 0} 
                viewBox="0 0 24 24"
              >
                <path d={link.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="pt-6 border-t border-stone-100 flex flex-row justify-between items-center text-stone-400">
      <div className="flex items-center gap-2">
        
        <div className="w-6 h-6 bg-stone-900 rounded flex items-center justify-center text-amber-500 font-black text-xs">G</div>
        <p className="text-xs font-bold uppercase hidden sm:block">Gemachis | Data & Dev</p>
      </div>
     
      <p className="text-[10px] font-black uppercase tracking-widest">© 2026 Rights Reserved</p>
    </div>
  </div>
</footer>
  );
};

export default App;
