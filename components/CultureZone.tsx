
import React, { useState, useEffect } from 'react';
import { generateCulturalTrivia } from '../services/geminiService';
import { CulturalTrivia } from '../types';

const CultureZone: React.FC = () => {
  const [trivia, setTrivia] = useState<CulturalTrivia | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchTrivia = async () => {
    setLoading(true);
    setShowAnswer(false);
    const result = await generateCulturalTrivia();
    if (result) setTrivia(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrivia();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-stone-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden border border-stone-800 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-amber-500 text-stone-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Culture Trivia</span>
            <div className="h-4 w-[1px] bg-stone-700"></div>
            <span className="text-stone-400 text-xs font-bold">Powered by Gemini AI</span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-12 h-12 border-4 border-stone-800 border-t-amber-500 rounded-full animate-spin mb-4"></div>
              <p className="text-stone-400 font-medium animate-pulse">Consulting the elders of knowledge...</p>
            </div>
          ) : trivia ? (
            <div className="space-y-6">
              <h3 className="text-3xl font-black leading-tight tracking-tight text-amber-50">
                {trivia.question}
              </h3>
              
              {!showAnswer ? (
                <button 
                  onClick={() => setShowAnswer(true)}
                  className="bg-white text-stone-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl active:scale-95"
                >
                  Reveal Correct Answer
                </button>
              ) : (
                <div className="p-8 bg-stone-800/50 rounded-3xl border border-stone-700 animate-in zoom-in duration-500">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">The Answer Is</p>
                  <p className="text-xl font-bold mb-4">{trivia.answer}</p>
                  <div className="h-[1px] bg-stone-700 mb-4"></div>
                  <p className="text-stone-400 text-sm leading-relaxed font-medium">
                    {trivia.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
             <p className="text-stone-400">Unable to load trivia. Please try again.</p>
          )}

          <div className="mt-10">
            <button 
              onClick={fetchTrivia}
              className="text-stone-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Generate New Question
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Food & Cuisine', icon: '🍲', desc: 'Explore the flavors of Injera, Doro Wat, and Coffee Ceremonies.' },
          { title: 'Music & Dance', icon: '💃', desc: 'Discover Eskista and the traditional instruments of the highlands.' },
          { title: 'History & Kings', icon: '👑', desc: 'Trace the lineage from Axum to the Solomonic dynasty.' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
            <h4 className="font-black text-stone-900 mb-2">{item.title}</h4>
            <p className="text-stone-500 text-xs font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CultureZone;
