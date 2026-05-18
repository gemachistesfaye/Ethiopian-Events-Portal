import React, { useState, useRef, useEffect } from 'react';
import { chatWithHeritageGuide } from '../services/geminiService';
import { ChatMessage } from '../types';

interface UIMessage extends ChatMessage {
  id: string;
  time: string;
}

const STORAGE_KEY = "heritage_chat_history";

const HeritageChat: React.FC = () => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* =========================
     LOAD SAVED CHAT
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  /* =========================
     SAVE CHAT
  ========================= */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading]);

  /* =========================
     AUTO FOCUS
  ========================= */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: UIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const responseText = await chatWithHeritageGuide(updatedMessages, input);

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

  /* =========================
     ENTER TO SEND
  ========================= */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend(e as any);
  };

  /* =========================
     CLEAR CHAT
  ========================= */
  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[650px] flex flex-col bg-white rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="bg-stone-900 p-8 text-white flex justify-between items-center">
        <h3 className="text-2xl font-black tracking-tighter">HERITAGE GUIDE</h3>

        <button
          onClick={clearChat}
          className="text-xs uppercase text-stone-400 hover:text-white"
        >
          Clear
        </button>
      </div>

      {/* CHAT BODY */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 bg-stone-50/50">

        {messages.length === 0 && (
          <div className="text-center opacity-50 mt-20">
            Ask anything about Ethiopian history or culture 🇪🇹
          </div>
        )}

        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-5 rounded-[2rem] text-sm shadow ${
                m.role === 'user'
                  ? 'bg-amber-500 text-stone-900'
                  : 'bg-white border border-stone-200'
              }`}
            >
              <div>{m.text}</div>
              <div className="text-[10px] opacity-50 mt-2">{m.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="animate-pulse text-stone-400 text-sm">
            Guide is thinking…
          </div>
        )}
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="p-6 border-t flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the Heritage Guide..."
          className="flex-1 h-14 px-6 rounded-xl bg-stone-100"
        />

        <button
          disabled={loading || !input.trim()}
          className="bg-stone-900 text-white px-6 rounded-xl disabled:opacity-40"
        >
          Ask
        </button>
      </form>
    </div>
  );
};

export default HeritageChat;