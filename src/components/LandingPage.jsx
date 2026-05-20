import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
const LandingPage = ({ onExplore }) => {
  const { t } = useTranslation();
    return (<div className="bg-stone-100 text-stone-900 font-sans overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center p-6 bg-stone-950 text-stone-100 overflow-hidden border-b border-stone-900">
        {/* Glowing Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-800/30 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 max-w-4xl mx-auto">
          <span className="bg-amber-950/60 text-amber-400 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 inline-block shadow-lg border border-amber-900/30">
            {t('landing.welcome')}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide leading-tight mb-6 text-stone-100 font-serif">
            {t('landing.experience')} <br />
            <span className="gold-text-gradient">{t('landing.culture')}</span>
          </h1>
          <p className="text-stone-400 text-sm md:text-base max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            {t('landing.desc')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={onExplore} className="bg-amber-500 text-stone-950 px-6 py-3 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-amber-400 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20">
              Begin Journey
            </button>
            <button className="bg-stone-900 border border-stone-800 text-stone-100 px-6 py-3 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-stone-800 transition-all">
              Watch Trailer
            </button>
          </div>
        </motion.div>

        {/* Floating Cards Mockup */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="bg-stone-900/40 backdrop-blur-md p-4 rounded-xl border border-stone-850 text-xs w-48 text-stone-300">
            <p className="text-amber-500 font-bold">{t('landing.today')}</p>
            <p className="text-stone-300 mt-1 font-normal">The Battle of Adwa victory was secured.</p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">{t('landing.core_modules')}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-wide mt-1 font-serif">{t('landing.immersive')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div whileHover={{ y: -5 }} className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-amber-900/20 text-stone-900 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-amber-500/20">🗺️</div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 font-serif">Interactive Atlas</h3>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-normal">Explore regions, traditions, and local heritage through a stylized interactive map.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ y: -5 }} className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-stone-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg">📜</div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 font-serif">Living Timeline</h3>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-normal">Scroll through centuries of epic history, from Axum to modern eras.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div whileHover={{ y: -5 }} className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-amber-900/20 text-stone-900 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-amber-500/20">🤖</div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 font-serif">AI Storyteller</h3>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-normal">Chat with an advanced AI guide that narrates history with emotional depth.</p>
          </motion.div>
        </div>
      </section>

      {/* FEATURED FESTIVALS SECTION */}
      <section className="py-20 px-6 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">{t('landing.glimpse')}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-wide mt-1 font-serif">{t('landing.featured')}</h2>
            <p className="text-stone-500 text-xs md:text-sm font-medium mt-2">Discover some of the most vibrant celebrations in Ethiopia.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Event 1: Timkat */}
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
              <div className="h-48 bg-stone-100 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('/timkat.png')` }}></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">January 19</span>
                <h3 className="text-lg font-bold text-stone-900 mt-2 mb-1 font-serif">Timkat (Epiphany)</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-normal">The most important festival of the Ethiopian Orthodox Church, celebrating the baptism of Jesus.</p>
              </div>
            </div>

            {/* Event 2: Meskel */}
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
              <div className="h-48 bg-stone-100 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('/meskel.png')` }}></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">September 27</span>
                <h3 className="text-lg font-bold text-stone-900 mt-2 mb-1 font-serif">Meskel</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-normal">The commemoration of the discovery of the True Cross, marked by the lighting of a massive bonfire.</p>
              </div>
            </div>

            {/* Event 3: Irreecha */}
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
              <div className="h-48 bg-stone-100 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('/irreecha.png')` }}></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Sep / Oct</span>
                <h3 className="text-lg font-bold text-stone-900 mt-2 mb-1 font-serif">Irreecha</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-normal">Oromo thanksgiving festival marking the end of the rainy season and the arrival of spring.</p>
              </div>
            </div>

            {/* Event 4: Eid al-Fitr */}
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
              <div className="h-48 bg-stone-100 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('/eid_fitr.png')` }}></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Moveable</span>
                <h3 className="text-lg font-bold text-stone-900 mt-2 mb-1 font-serif">Eid al-Fitr</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-normal">Celebrates the end of Ramadan with prayers, feasting, and community charity.</p>
              </div>
            </div>

            {/* Event 5: Eid al-Adha */}
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
              <div className="h-48 bg-stone-100 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('/eid_adha.png')` }}></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Moveable</span>
                <h3 className="text-lg font-bold text-stone-900 mt-2 mb-1 font-serif">Eid al-Adha</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-normal">The Feast of Sacrifice, honoring Abraham's willingness to sacrifice his son.</p>
              </div>
            </div>

            {/* Event 6: Fichee Chambalaalla */}
            <div className="bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group">
              <div className="h-48 bg-stone-100 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('/fichee.png')` }}></div>
              <div className="p-6">
                <span className="bg-amber-900/40 text-amber-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Moveable</span>
                <h3 className="text-lg font-bold text-stone-900 mt-2 mb-1 font-serif">Fichee-Chambalaalla</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-normal">The traditional New Year festival of the Sidama people, promoting social cohesion and peace.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-stone-50 text-stone-900 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">3000+</p>
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{t('landing.stats_years')}</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">12+</p>
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{t('landing.stats_regions')}</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">50+</p>
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{t('landing.stats_festivals')}</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">24/7</p>
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{t('landing.stats_ai')}</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-stone-950 text-stone-100 p-10 rounded-[3rem] shadow-2xl border border-stone-900">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide mb-4 text-stone-100 font-serif">{t('landing.ready')}</h2>
          <p className="text-stone-400 text-xs md:text-sm font-normal mb-8 max-w-xl mx-auto">Join thousands of cultural enthusiasts discovering the rich heritage of Ethiopia.</p>
          <button onClick={onExplore} className="bg-amber-500 text-stone-950 px-6 py-3 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-amber-400 transition-colors shadow-xl shadow-amber-500/10">
            {t('landing.get_started')}
          </button>
        </div>
      </section>
    </div>);
};
export default LandingPage;
