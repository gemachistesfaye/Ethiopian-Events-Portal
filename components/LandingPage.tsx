import React from 'react';
import { motion } from 'framer-motion';

const LandingPage: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  return (
    <div className="bg-stone-50 text-stone-900 font-sans overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 bg-stone-900 text-white overflow-hidden">
        {/* Glowing Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-700/30 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <span className="bg-amber-500 text-stone-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block shadow-xl">
            Welcome to the Future of Heritage
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            Experience Ethiopian <br />
            <span className="text-amber-500">Culture & History</span>
          </h1>
          <p className="text-stone-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Discover the ancient traditions, epic stories, and vibrant festivals of Ethiopia through cutting-edge AI and interactive experiences.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onExplore}
              className="bg-amber-500 text-stone-900 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-amber-400 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20"
            >
              Begin Journey
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/20 transition-all">
              Watch Trailer
            </button>
          </div>
        </motion.div>

        {/* Floating Cards Mockup */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs w-48"
          >
            <p className="text-amber-500 font-black">TODAY IN HISTORY</p>
            <p className="text-white mt-1">The Battle of Adwa victory was secured.</p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Core Modules</span>
          <h2 className="text-4xl font-black text-stone-900 tracking-tight mt-1">Immersive Exploration</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-14 h-14 bg-amber-500 text-stone-900 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-amber-500/20">🗺️</div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">Interactive Atlas</h3>
            <p className="text-stone-500 text-sm leading-relaxed">Explore regions, traditions, and local heritage through a stylized interactive map.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-14 h-14 bg-stone-900 text-amber-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">📜</div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">Living Timeline</h3>
            <p className="text-stone-500 text-sm leading-relaxed">Scroll through centuries of epic history, from Axum to modern eras.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-14 h-14 bg-amber-500 text-stone-900 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-amber-500/20">🤖</div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">AI Storyteller</h3>
            <p className="text-stone-500 text-sm leading-relaxed">Chat with an advanced AI guide that narrates history with emotional depth.</p>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-stone-900 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <p className="text-5xl font-black text-amber-500 mb-2">3000+</p>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Years of History</p>
          </div>
          <div>
            <p className="text-5xl font-black text-white mb-2">12+</p>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Cultural Regions</p>
          </div>
          <div>
            <p className="text-5xl font-black text-amber-500 mb-2">50+</p>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Major Festivals</p>
          </div>
          <div>
            <p className="text-5xl font-black text-white mb-2">24/7</p>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest">AI Assistance</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-amber-500 text-stone-900 p-12 rounded-[3rem] shadow-2xl shadow-amber-500/10">
          <h2 className="text-4xl font-black tracking-tight mb-4">Ready to Explore?</h2>
          <p className="text-stone-900/80 text-sm font-medium mb-8 max-w-xl mx-auto">Join thousands of cultural enthusiasts discovering the rich heritage of Ethiopia.</p>
          <button 
            onClick={onExplore}
            className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-stone-800 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
