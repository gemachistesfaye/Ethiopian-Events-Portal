
import React, { useState, useRef, useEffect } from 'react';
import { chatWithHeritageGuide } from '../services/geminiService';
import { ChatMessage } from '../types';

const HeritageChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const responseText = await chatWithHeritageGuide(messages, input);
    const modelMessage: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMessage]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[650px] flex flex-col bg-white rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-stone-900 p-8 text-white flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-stone-900 text-2xl shadow-xl">
            ✨
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tighter">HERITAGE GUIDE</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Deep Cultural AI Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Guide Online</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-8 space-y-6 scroll-smooth bg-stone-50/50"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-50">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6 border border-stone-200">
              <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <h4 className="font-black text-stone-900 mb-2">Ask the Elders</h4>
            <p className="text-xs font-medium text-stone-500 leading-relaxed">Ask anything about Ethiopian history, traditions, or current celebrations.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
              m.role === 'user' 
              ? 'bg-amber-500 text-stone-900 rounded-tr-none' 
              : 'bg-white text-stone-800 rounded-tl-none border border-stone-200'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-stone-200 p-6 rounded-[2rem] rounded-tl-none">
               <div className="flex gap-1.5">
                 <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-8 bg-white border-t border-stone-200">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question for the Heritage Guide..."
            className="w-full h-16 bg-stone-100 rounded-2xl px-8 pr-32 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all border border-transparent focus:border-amber-300"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-3 top-3 bg-stone-900 text-white h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 disabled:opacity-50 transition-all active:scale-95 shadow-lg"
          >
            Ask Guide
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeritageChat;
