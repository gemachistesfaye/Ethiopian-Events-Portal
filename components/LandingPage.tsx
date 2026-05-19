import React from 'react';
import { motion } from 'framer-motion';

const LandingPage: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  return (
<<<<<<< HEAD
    <div className="bg-stone-100 text-stone-900 font-sans overflow-hidden">
=======
    <div className="bg-stone-950 text-stone-100 font-sans overflow-hidden">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 bg-stone-900 text-white overflow-hidden">
        {/* Glowing Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-900/200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-700/30 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <span className="bg-amber-900/200 text-stone-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block shadow-xl">
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
              className="bg-amber-900/200 text-stone-100 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-amber-400 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20"
            >
              Begin Journey
            </button>
<<<<<<< HEAD
            <button className="bg-stone-50/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-stone-50/20 transition-all">
=======
            <button className="bg-stone-900/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-stone-900/20 transition-all">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              Watch Trailer
            </button>
          </div>
        </motion.div>

        {/* Floating Cards Mockup */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
<<<<<<< HEAD
            className="bg-stone-50/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs w-48"
=======
            className="bg-stone-900/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs w-48"
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
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
          <h2 className="text-4xl font-black text-stone-100 tracking-tight mt-1">Immersive Exploration</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
<<<<<<< HEAD
            className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all"
=======
            className="bg-stone-900 p-8 rounded-[2.5rem] border border-stone-800 shadow-xl hover:shadow-2xl transition-all"
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
          >
            <div className="w-14 h-14 bg-amber-900/200 text-stone-100 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-amber-500/20">🗺️</div>
            <h3 className="text-2xl font-black text-stone-100 mb-2">Interactive Atlas</h3>
            <p className="text-stone-400 text-sm leading-relaxed">Explore regions, traditions, and local heritage through a stylized interactive map.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
<<<<<<< HEAD
            className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all"
=======
            className="bg-stone-900 p-8 rounded-[2.5rem] border border-stone-800 shadow-xl hover:shadow-2xl transition-all"
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
          >
            <div className="w-14 h-14 bg-stone-900 text-amber-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">📜</div>
            <h3 className="text-2xl font-black text-stone-100 mb-2">Living Timeline</h3>
            <p className="text-stone-400 text-sm leading-relaxed">Scroll through centuries of epic history, from Axum to modern eras.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
<<<<<<< HEAD
            className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all"
=======
            className="bg-stone-900 p-8 rounded-[2.5rem] border border-stone-800 shadow-xl hover:shadow-2xl transition-all"
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
          >
            <div className="w-14 h-14 bg-amber-900/200 text-stone-100 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-amber-500/20">🤖</div>
            <h3 className="text-2xl font-black text-stone-100 mb-2">AI Storyteller</h3>
            <p className="text-stone-400 text-sm leading-relaxed">Chat with an advanced AI guide that narrates history with emotional depth.</p>
          </motion.div>
        </div>
      </section>

      {/* FEATURED FESTIVALS SECTION */}
      <section className="py-24 px-6 bg-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Glimpse of Heritage</span>
            <h2 className="text-4xl font-black text-stone-100 tracking-tight mt-1">Featured Festivals</h2>
            <p className="text-stone-400 text-sm font-medium mt-2">Discover some of the most vibrant celebrations in Ethiopia.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Event 1: Timkat */}
<<<<<<< HEAD
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
=======
            <div className="bg-stone-900 rounded-[2rem] overflow-hidden border border-stone-800 shadow-xl group">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              <div 
                className="h-48 bg-stone-800 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('/timkat.png')` }}
              ></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">January 19</span>
                <h3 className="text-xl font-black text-stone-100 mt-2 mb-1">Timkat (Epiphany)</h3>
                <p className="text-stone-400 text-xs leading-relaxed">The most important festival of the Ethiopian Orthodox Church, celebrating the baptism of Jesus.</p>
              </div>
            </div>

            {/* Event 2: Meskel */}
<<<<<<< HEAD
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
=======
            <div className="bg-stone-900 rounded-[2rem] overflow-hidden border border-stone-800 shadow-xl group">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              <div 
                className="h-48 bg-stone-800 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('/meskel.png')` }}
              ></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">September 27</span>
                <h3 className="text-xl font-black text-stone-100 mt-2 mb-1">Meskel</h3>
                <p className="text-stone-400 text-xs leading-relaxed">The commemoration of the discovery of the True Cross, marked by the lighting of a massive bonfire.</p>
              </div>
            </div>

            {/* Event 3: Irreecha */}
<<<<<<< HEAD
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
=======
            <div className="bg-stone-900 rounded-[2rem] overflow-hidden border border-stone-800 shadow-xl group">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              <div 
                className="h-48 bg-stone-800 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('/irreecha.png')` }}
              ></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Sep / Oct</span>
                <h3 className="text-xl font-black text-stone-100 mt-2 mb-1">Irreecha</h3>
                <p className="text-stone-400 text-xs leading-relaxed">Oromo thanksgiving festival marking the end of the rainy season and the arrival of spring.</p>
              </div>
            </div>

            {/* Event 4: Eid al-Fitr */}
<<<<<<< HEAD
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
=======
            <div className="bg-stone-900 rounded-[2rem] overflow-hidden border border-stone-800 shadow-xl group">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              <div 
                className="h-48 bg-stone-800 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('/eid_fitr.png')` }}
              ></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Moveable</span>
                <h3 className="text-xl font-black text-stone-100 mt-2 mb-1">Eid al-Fitr</h3>
                <p className="text-stone-400 text-xs leading-relaxed">Celebrates the end of Ramadan with prayers, feasting, and community charity.</p>
              </div>
            </div>

            {/* Event 5: Eid al-Adha */}
<<<<<<< HEAD
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
=======
            <div className="bg-stone-900 rounded-[2rem] overflow-hidden border border-stone-800 shadow-xl group">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              <div 
                className="h-48 bg-stone-800 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('/eid_adha.png')` }}
              ></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Moveable</span>
                <h3 className="text-xl font-black text-stone-100 mt-2 mb-1">Eid al-Adha</h3>
                <p className="text-stone-400 text-xs leading-relaxed">The Feast of Sacrifice, honoring Abraham's willingness to sacrifice his son.</p>
              </div>
            </div>

            {/* Event 6: Fichee Chambalaalla */}
<<<<<<< HEAD
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
=======
            <div className="bg-stone-900 rounded-[2rem] overflow-hidden border border-stone-800 shadow-xl group">
>>>>>>> 8e595acb9bebecb852d174592b19d072ae677393
              <div 
                className="h-48 bg-stone-800 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('/fichee.png')` }}
              ></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Moveable</span>
                <h3 className="text-xl font-black text-stone-100 mt-2 mb-1">Fichee-Chambalaalla</h3>
                <p className="text-stone-400 text-xs leading-relaxed">The traditional New Year festival of the Sidama people, promoting social cohesion and peace.</p>
              </div>
            </div>
          </div>
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
        <div className="max-w-3xl mx-auto bg-amber-900/200 text-stone-100 p-12 rounded-[3rem] shadow-2xl shadow-amber-500/10">
          <h2 className="text-4xl font-black tracking-tight mb-4">Ready to Explore?</h2>
          <p className="text-stone-100/80 text-sm font-medium mb-8 max-w-xl mx-auto">Join thousands of cultural enthusiasts discovering the rich heritage of Ethiopia.</p>
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
