import React, { useState, useRef, useEffect } from 'react';
import { chatWithHeritageGuide, speakAmharic } from '../services/geminiService';
import { ChatMessage } from '../types';

interface UIMessage extends ChatMessage {
  id: string;
  time: string;
}

const STORAGE_KEY = "heritage_chat_history_v2";

const MODES = [
  { id: 'guide', label: 'Heritage Guide', icon: '🌍' },
  { id: 'storyteller', label: 'Storyteller', icon: '📜' },
  { id: 'teacher', label: 'Teacher', icon: '🎓' },
  { id: 'festival', label: 'Explainer', icon: '🎉' },
  { id: 'myth', label: 'Narrator', icon: '🦅' }
] as const;

type ModeType = typeof MODES[number]['id'];

const HeritageChat: React.FC = () => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ModeType>('guide');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: UIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const responseText = await chatWithHeritageGuide(updatedMessages, textToSend, mode);

      const modelMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'model',
          text: "The guide is resting. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (text: string, messageId: string) => {
    setSpeakingId(messageId);
    try {
      const audioData = await speakAmharic(text);
      if (audioData) {
        const blob = new Blob([audioData], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => setSpeakingId(null);
        audio.play();
      } else {
        setSpeakingId(null);
        alert("Audio generation failed or not supported for this text.");
      }
    } catch (err) {
      console.error(err);
      setSpeakingId(null);
    }
  };

  const quickActions = [
    { text: "Tell me the story of Adwa", icon: "⚔️" },
    { text: "Explain Timkat like a documentary", icon: "🎬" },
    { text: "Teach me Ethiopian history step-by-step", icon: "📚" }
  ];

  return (
<<<<<<< HEAD
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-stone-50 rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden font-sans">
=======
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-stone-900 rounded-[3rem] border border-stone-800 shadow-2xl overflow-hidden font-sans">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
      
      {/* MODES SELECTOR */}
      <div className="bg-stone-900 p-4 flex flex-wrap gap-2 justify-center border-b border-stone-800">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === m.id ? 'bg-amber-900/200 text-stone-100' : 'text-stone-400 hover:text-white'}`}
          >
            <span>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* HEADER */}
<<<<<<< HEAD
      <div className="bg-stone-50 p-6 border-b border-stone-100 flex justify-between items-center">
=======
      <div className="bg-stone-900 p-6 border-b border-stone-800 flex justify-between items-center">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
        <div>
          <h3 className="text-xl font-black text-stone-100 tracking-tight">
            {MODES.find(m => m.id === mode)?.label}
          </h3>
          <p className="text-xs text-stone-400 font-medium mt-1">Immersive Heritage Experience</p>
        </div>

        <button
          onClick={() => { if(confirm("Clear history?")) { localStorage.removeItem(STORAGE_KEY); setMessages([]); } }}
          className="text-xs font-black uppercase text-stone-400 hover:text-red-500 transition-colors"
        >
          Clear History
        </button>
      </div>

      {/* CHAT BODY */}
<<<<<<< HEAD
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 bg-stone-100/50">
=======
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 bg-stone-950/50">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393

        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🤖</div>
            <p className="text-stone-400 font-black text-xs uppercase tracking-widest mb-6">Choose a mode or try a quick action</p>
            
            <div className="grid gap-3 max-w-md mx-auto">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.text)}
<<<<<<< HEAD
                  className="bg-stone-50 p-4 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 text-left transition-all flex items-center gap-3 group"
=======
                  className="bg-stone-900 p-4 rounded-xl border border-stone-800 hover:border-amber-500 hover:bg-amber-900/20/50 text-left transition-all flex items-center gap-3 group"
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-sm font-bold text-stone-300 group-hover:text-stone-100">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-6 rounded-[2rem] text-sm shadow-sm relative group ${
                m.role === 'user'
<<<<<<< HEAD
                  ? 'bg-amber-500 text-stone-900 font-bold'
                  : 'bg-stone-50 border border-stone-200 text-stone-800 leading-relaxed'
=======
                  ? 'bg-amber-900/200 text-stone-100 font-bold'
                  : 'bg-stone-900 border border-stone-800 text-stone-200 leading-relaxed'
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              }`}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {(() => {
                  const text = m.text;
                  const regex = /(\*\*|<b>)(.*?)(?:\*\*|<\/b>)/g;
                  const parts = [];
                  let lastIndex = 0;
                  let match;
                  
                  while ((match = regex.exec(text)) !== null) {
                    const textBefore = text.slice(lastIndex, match.index);
                    if (textBefore) {
                      parts.push(textBefore);
                    }
                    parts.push(
                      <strong 
                        className={`font-black ${m.role === 'user' ? 'text-stone-100 underline' : 'text-stone-950 bg-amber-900/20/70 px-1 py-0.5 rounded'}`} 
                        key={match.index}
                      >
                        {match[2]}
                      </strong>
                    );
                    lastIndex = regex.lastIndex;
                  }
                  
                  const textAfter = text.slice(lastIndex);
                  if (textAfter) {
                    parts.push(textAfter);
                  }
                  
                  return parts.length > 0 ? parts : text;
                })()}
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-800/20">
                <span className="text-[10px] opacity-50 font-black">{m.time}</span>
                
                {m.role === 'model' && (
                  <button
                    onClick={() => handleSpeak(m.text, m.id)}
                    className={`text-xs flex items-center gap-1 font-black uppercase tracking-widest ${speakingId === m.id ? 'text-amber-600 animate-pulse' : 'text-stone-400 hover:text-stone-300'}`}
                    disabled={speakingId !== null && speakingId !== m.id}
                  >
                    {speakingId === m.id ? '🔊 Speaking...' : '🔈 Listen'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
<<<<<<< HEAD
            <div className="bg-stone-50 border border-stone-200 p-6 rounded-[2rem] flex items-center gap-3">
=======
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-[2rem] flex items-center gap-3">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs font-black text-stone-400 uppercase tracking-widest">Storyteller is composing...</span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
<<<<<<< HEAD
      <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-6 border-t bg-stone-50 flex gap-3">
=======
      <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-6 border-t bg-stone-900 flex gap-3">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the Storyteller..."
<<<<<<< HEAD
          className="flex-1 h-14 px-6 rounded-xl bg-stone-100 border-2 border-transparent focus:border-amber-500 focus:outline-none focus:bg-stone-50 font-medium transition-all"
=======
          className="flex-1 h-14 px-6 rounded-xl bg-stone-800 border-2 border-transparent focus:border-amber-500 focus:outline-none focus:bg-stone-900 font-medium transition-all"
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-stone-900 text-white px-6 rounded-xl font-black uppercase text-xs tracking-widest disabled:opacity-40 hover:bg-stone-800 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default HeritageChat;