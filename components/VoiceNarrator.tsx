import React, { useState, useRef, useEffect } from 'react';
import { speakAmharic, translateText } from '../services/geminiService';

interface VoiceNarratorProps {
  text?: string;
  title?: string;
}

const VoiceNarrator: React.FC<VoiceNarratorProps> = ({ 
  text = "The Battle of Adwa in 1896 was a stunning victory for Ethiopia against Italian colonial forces. Led by Emperor Menelik II and Empress Taytu Betul, the Ethiopian forces secured their country's independence and became a symbol of anti-colonial resistance worldwide.",
  title = "The Story of Adwa"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState<'en' | 'am' | 'om'>('en');
  const [style, setStyle] = useState<'documentary' | 'teacher' | 'storyteller'>('storyteller');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Clean up audio on changes to text, style, or language, or when component unmounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, language, style]);

  const handlePlay = async () => {
    // If audio is currently playing, stop/pause immediately (either HTML5 Audio or Web Speech API)
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    // If audio stream is already loaded but paused, play it
    if (audioRef.current && audioUrl && !isPlaying) {
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setLoading(true);
    try {
      // Translate the text if the target language is Amharic or Afaan Oromo
      let textToSpeak = text;
      if (language !== 'en') {
        textToSpeak = await translateText(text, language);
      }

      // Prompt engineering based on style
      let promptText = textToSpeak;
      if (style === 'storyteller') {
        promptText = `[Speak as a dramatic storyteller] ${textToSpeak}`;
      } else if (style === 'documentary') {
        promptText = `[Speak as a deep documentary narrator] ${textToSpeak}`;
      } else if (style === 'teacher') {
        promptText = `[Speak as a clear teacher] ${textToSpeak}`;
      }

      const audioData = await speakAmharic(promptText);
      if (audioData) {
        const blob = new Blob([audioData], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsPlaying(false);
          setProgress(100);
        };
        
        audio.ontimeupdate = () => {
          setProgress((audio.currentTime / audio.duration) * 100);
        };

        audio.playbackRate = speed;
        audio.play();
        setIsPlaying(true);
      } else {
        throw new Error("No audio data from Gemini TTS");
      }
    } catch (err) {
      console.warn("Gemini TTS failed or rate-limited. Falling back to browser SpeechSynthesis.", err);
      
      // Fallback to browser SpeechSynthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        
        // Translate text for fallback if not already translated
        let fallbackText = text;
        try {
          if (language !== 'en') {
            fallbackText = await translateText(text, language);
          }
        } catch (_) {
          fallbackText = text;
        }

        const utterance = new SpeechSynthesisUtterance(fallbackText);
        
        // Match language code
        if (language === 'am') {
          utterance.lang = 'am-ET';
        } else if (language === 'om') {
          utterance.lang = 'om-ET';
        } else {
          utterance.lang = 'en-US';
        }

        // Find a male voice
        const voices = window.speechSynthesis.getVoices();
        const maleVoiceNames = ['david', 'mark', 'george', 'male', 'google uk english male', 'microsoft david'];
        let maleVoice = null;
        
        for (const name of maleVoiceNames) {
          const found = voices.find(v => v.name.toLowerCase().includes(name) && v.lang.startsWith(utterance.lang.substring(0, 2)));
          if (found) {
            maleVoice = found;
            break;
          }
        }
        if (!maleVoice) {
          maleVoice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)));
        }
        if (maleVoice) {
          utterance.voice = maleVoice;
        }

        utterance.rate = speed;

        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
        };

        // Estimate duration based on word count (~150 words per minute)
        const wordCount = fallbackText.split(' ').length;
        const estDuration = Math.ceil((wordCount / 150) * 60) || 30;

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);

        let elapsed = 0;
        const progressTimer = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(progressTimer);
            return;
          }
          elapsed += 1;
          setProgress(Math.min((elapsed / estDuration) * 100, 100));
        }, 1000);
      } else {
        alert("Audio narration is not supported on this browser.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 shadow-2xl font-sans">
      <div className="text-center mb-6">
        <span className="bg-stone-50 text-amber-600 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">AI Voice Narration</span>
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-wide leading-none font-serif">{title}</h2>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Language & Style */}
        <div className="flex gap-3 justify-center">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer"
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="om">Afaan Oromo</option>
          </select>

          <select 
            value={style}
            onChange={(e) => setStyle(e.target.value as any)}
            className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer"
          >
            <option value="storyteller">Storyteller</option>
            <option value="documentary">Documentary</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Player UI */}
        <div className="bg-stone-100 p-6 rounded-2xl border border-stone-100">
          <p className="text-stone-700 text-sm leading-relaxed mb-6 font-normal">"{text}"</p>

          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlay}
              disabled={loading}
              className="w-12 h-12 bg-stone-50 text-amber-600 rounded-full flex items-center justify-center shadow-lg hover:bg-stone-100 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5,0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168l4.2 3a1 1 0 010 1.664l-4.2 3A1 1 0 018 13V7a1 1 0 011.555-.832z" clipRule="evenodd" /></svg>
              )}
            </button>

            {/* Progress Bar */}
            <div className="flex-1 flex flex-col">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-stone-100 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[9px] font-bold text-stone-500 mt-1 uppercase tracking-widest">
                <span>{isPlaying ? 'Playing' : 'Paused'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex justify-between items-center text-xs font-bold text-stone-500 uppercase tracking-widest">
          <span>Speed</span>
          <div className="flex gap-2">
            {[0.8, 1, 1.2, 1.5].map(s => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 rounded ${speed === s ? 'bg-amber-900/20 text-stone-900' : 'hover:text-stone-900'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Download Button */}
        {audioUrl && (
          <div className="text-center pt-4 border-t border-stone-200">
            <a 
              href={audioUrl} 
              download={`${title.toLowerCase().replace(/\s+/g, '_')}.mp3`}
              className="text-xs font-bold uppercase text-amber-600 hover:text-amber-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download Audio
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceNarrator;
