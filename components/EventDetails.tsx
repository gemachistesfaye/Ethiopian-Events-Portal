
import React, { useState, useEffect } from 'react';
import { EthiopianEvent, ReminderPriority, ReminderCategory } from '../types';
import { getCulturalInsight, speakAmharic } from '../services/geminiService';

interface EventDetailsProps {
  event: EthiopianEvent;
  onClose: () => void;
  onAddReminder: (eventId: string, note: string, priority: ReminderPriority, category: ReminderCategory) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose, onAddReminder }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [reminderNote, setReminderNote] = useState('');
  const [priority, setPriority] = useState<ReminderPriority>('Medium');
  const [category, setCategory] = useState<ReminderCategory>('General');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const result = await getCulturalInsight(event.name, event.description);
      setInsight(result);
      setLoadingInsight(false);
    };
    fetchInsight();
  }, [event]);

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const audioData = await speakAmharic(event.nameAmharic);
    if (audioData) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await audioContext.decodeAudioData(audioData.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  const handleSubmitReminder = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReminder(event.id, reminderNote, priority, category);
    setShowReminderForm(false);
    setReminderNote('');
    alert('Heritage box updated! Check your saved moments.');
  };

  const formattedGregDate = new Date(event.gregDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side: Visuals */}
        <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
          <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white z-10">
             <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest mb-3 inline-block shadow-lg">
               {event.category}
             </span>
             <h2 className="text-3xl font-black leading-none mb-2">{event.name}</h2>
             <div className="flex items-center gap-2">
               <span className="text-lg font-bold ethiopic-font text-amber-50">{event.nameAmharic}</span>
               <button 
                onClick={handleSpeak}
                disabled={isSpeaking}
                className={`p-2 rounded-full bg-white/20 hover:bg-white/40 transition-all ${isSpeaking ? 'animate-pulse' : ''}`}
               >
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 14.657a1 1 0 01-1.414-1.414A5 5 0 0011 8.586V7.172a7 7 0 013.657 7.485z" clipRule="evenodd" /></svg>
               </button>
             </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-2/3 p-10 overflow-y-auto bg-stone-50/30">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-amber-600 text-xs font-black uppercase tracking-[0.2em] mb-1">Festival Schedule</p>
              <p className="text-stone-900 font-bold">{event.ethDate} <span className="mx-2 text-stone-300">|</span> {formattedGregDate}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-stone-100 hover:bg-stone-200 rounded-2xl text-stone-500 transition-all shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-10">
            <section>
              <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Historical Context</h3>
              <p className="text-stone-600 text-sm leading-relaxed font-medium bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                {event.description}
              </p>
            </section>

            <section className="bg-amber-500 rounded-[2rem] p-8 text-stone-900 shadow-xl shadow-amber-200/50">
              <h3 className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM16.464 14.657l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zM10 8a2 2 0 100 4 2 2 0 000-4z" /></svg>
                Gemini AI Cultural Insight
              </h3>
              {loadingInsight ? (
                <div className="h-20 flex items-center justify-center animate-pulse">
                   <div className="w-6 h-1 bg-amber-900 rounded-full"></div>
                </div>
              ) : (
                <p className="font-serif italic text-lg leading-relaxed">"{insight}"</p>
              )}
            </section>

            <section>
              {showReminderForm ? (
                <form onSubmit={handleSubmitReminder} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-2xl animate-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Priority</label>
                      <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as ReminderPriority)}
                        className="w-full bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ReminderCategory)}
                        className="w-full bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="General">General</option>
                        <option value="Travel">Travel</option>
                        <option value="Religious">Religious</option>
                        <option value="Social">Social</option>
                      </select>
                    </div>
                  </div>
                  
                  <textarea
                    value={reminderNote}
                    onChange={(e) => setReminderNote(e.target.value)}
                    placeholder="Add a private note about your plans..."
                    className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 mb-6 min-h-[120px]"
                    required
                  />
                  
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-stone-900/20 active:scale-95 transition-all">Save to Heritage Box</button>
                    <button type="button" onClick={() => setShowReminderForm(false)} className="px-8 py-4 bg-stone-100 text-stone-400 rounded-2xl font-black text-xs uppercase tracking-widest">Cancel</button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setShowReminderForm(true)}
                  className="w-full bg-stone-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-stone-800 transition-all shadow-2xl shadow-stone-900/30"
                >
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                  Create Private Record
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
