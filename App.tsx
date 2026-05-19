
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Calendar from './components/Calendar';
import EventDetails from './components/EventDetails';
import MyReminders from './components/MyReminders';
import CultureZone from './components/CultureZone';
import HeritageChat from './components/HeritageChat';
import CulturalMap from './components/CulturalMap';
import HistoricalTimeline from './components/HistoricalTimeline';
import VoiceNarrator from './components/VoiceNarrator';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import { supabase } from './services/supabase';
import { User } from '@supabase/supabase-js';
import { EthiopianEvent, UserReminder, CalendarDay, ReminderPriority, ReminderCategory } from './types';
import { EVENTS_DATA, ETHIOPIAN_MONTHS_AMHARIC } from './constants';
import { toEthiopianDate } from './utils/dateConverter';

const ProfileSettings: React.FC<{ user: any }> = ({ user }) => {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'preferences' | 'security'>('profile');

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setMessage('Check your new email for a confirmation link!');
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
         <h2 className="text-4xl font-black text-stone-900 tracking-tight">Account Settings</h2>
         <p className="text-stone-500 font-medium mt-2">Manage your portal identity, preferences, and security settings.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Settings Sidebar */}
        <div className="lg:col-span-3">
           <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sticky top-28 space-y-2">
             <button 
               onClick={() => setActiveSettingsTab('profile')}
               className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeSettingsTab === 'profile' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}
             >
               <span className="text-lg">👤</span> Profile
             </button>
             <button 
               onClick={() => setActiveSettingsTab('preferences')}
               className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeSettingsTab === 'preferences' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}
             >
               <span className="text-lg">⚙️</span> Preferences
             </button>
             <button 
               onClick={() => setActiveSettingsTab('security')}
               className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeSettingsTab === 'security' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}
             >
               <span className="text-lg">🛡️</span> Security
             </button>
             
             <div className="pt-4 mt-4 border-t border-stone-100">
               <button 
                 onClick={() => supabase.auth.signOut()}
                 className="w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-3"
               >
                 <span className="text-lg">🚪</span> Sign Out
               </button>
             </div>
           </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-9 space-y-8">
          
          {activeSettingsTab === 'profile' && (
            <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              {/* Profile Cover */}
              <div className="h-40 bg-gradient-to-r from-stone-900 to-amber-900 relative">
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
              </div>
              
              <div className="px-10 pb-10">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-8 relative z-10">
                   <div className="w-32 h-32 bg-white rounded-3xl p-2 shadow-2xl">
                      <div className="w-full h-full bg-amber-100 rounded-2xl flex items-center justify-center text-5xl">
                         🦅
                      </div>
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-3xl font-black text-stone-900">{user.email?.split('@')[0]}</h3>
                       <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Verified</span>
                     </div>
                     <p className="text-stone-500 font-medium">{user.email}</p>
                   </div>
                </div>

                <form onSubmit={handleUpdateEmail} className="space-y-6 max-w-xl">
                  <div>
                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2 block">Email Address</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input 
                        type="email" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={user.email}
                        className="flex-1 h-14 bg-stone-50 border border-stone-200 rounded-xl px-5 text-sm font-medium focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all shadow-inner"
                        required
                      />
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="h-14 px-8 bg-stone-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-50 whitespace-nowrap shadow-lg hover:shadow-stone-900/20"
                      >
                        {loading ? 'Saving...' : 'Update Email'}
                      </button>
                    </div>
                  </div>
                  {message && <p className="text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">{message}</p>}
                </form>
              </div>
            </div>
          )}

          {activeSettingsTab === 'preferences' && (
            <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl p-10 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-black text-stone-900 mb-8">Platform Preferences</h3>
              
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-stone-100 pb-8">
                   <div>
                     <h4 className="font-bold text-stone-900 mb-1">Email Notifications</h4>
                     <p className="text-sm text-stone-500 font-medium">Receive alerts for upcoming Ethiopian holidays and events.</p>
                   </div>
                   <div className="w-14 h-8 bg-amber-500 rounded-full relative cursor-pointer shadow-inner">
                     <div className="w-6 h-6 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                   </div>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-8">
                   <div>
                     <h4 className="font-bold text-stone-900 mb-1">AI Voice Autoplay</h4>
                     <p className="text-sm text-stone-500 font-medium">Automatically play Amharic audio pronunciations.</p>
                   </div>
                   <div className="w-14 h-8 bg-stone-200 rounded-full relative cursor-pointer shadow-inner">
                     <div className="w-6 h-6 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                   </div>
                </div>

                <div className="flex items-center justify-between">
                   <div>
                     <h4 className="font-bold text-stone-900 mb-1">Default Calendar View</h4>
                     <p className="text-sm text-stone-500 font-medium">Choose your primary date system.</p>
                   </div>
                   <select className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-500 cursor-pointer">
                      <option>Gregorian First</option>
                      <option>Ethiopian First</option>
                   </select>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'security' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl p-10">
                <h3 className="text-2xl font-black text-stone-900 mb-2">Security Hub</h3>
                <p className="text-sm text-stone-500 font-medium mb-8">Manage your password and authentication methods.</p>
                
                <button className="h-14 px-8 bg-stone-100 text-stone-900 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-stone-200 transition-colors w-full sm:w-auto shadow-sm">
                  Change Password
                </button>
              </div>

              <div className="bg-rose-50 rounded-[2.5rem] border border-rose-100 p-10">
                <h3 className="text-2xl font-black text-rose-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-rose-700/80 font-medium mb-8">Permanently delete your account and all saved heritage data.</p>
                
                <button className="h-14 px-8 bg-rose-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20">
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ user: any, onNavigate: (tab: string) => void }> = ({ user, onNavigate }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-stone-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>
        
        <div className="w-32 h-32 bg-stone-800 border-4 border-amber-500 rounded-full flex items-center justify-center text-5xl flex-shrink-0 relative z-10 shadow-2xl">
          👋
        </div>
        
        <div className="relative z-10 text-center md:text-left flex-1">
          <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">Pro Explorer</span>
          <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Welcome back!</h2>
          <p className="text-stone-400 font-medium text-lg mb-4">{user.email}</p>
          <p className="text-sm text-stone-500 max-w-md">Your gateway to Ethiopian heritage is ready. Discover deep historical insights and upcoming events.</p>
        </div>

        <div className="hidden lg:flex gap-6 relative z-10 bg-stone-800/50 p-6 rounded-[2rem] border border-stone-700 backdrop-blur-sm">
           <div className="text-center">
             <div className="text-3xl font-black text-amber-400 mb-1">12</div>
             <div className="text-[9px] text-stone-400 font-black uppercase tracking-widest">Events<br/>Saved</div>
           </div>
           <div className="w-px bg-stone-700"></div>
           <div className="text-center">
             <div className="text-3xl font-black text-amber-400 mb-1">LV.4</div>
             <div className="text-[9px] text-stone-400 font-black uppercase tracking-widest">Heritage<br/>Scholar</div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Quick Access Grid */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-black text-stone-900 tracking-tight">Explore Platform</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => onNavigate('vault')} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:border-amber-400 hover:shadow-2xl transition-all group text-left h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                 <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-3 relative z-10">Heritage Calendar</h3>
              <p className="text-sm text-stone-500 leading-relaxed font-medium relative z-10 flex-1">Explore upcoming events, festivals, and religious holidays synchronized across Gregorian and Ethiopian dates.</p>
              <div className="mt-8 text-xs font-black uppercase tracking-widest text-amber-600 group-hover:translate-x-2 transition-transform">Launch →</div>
            </button>

            <button onClick={() => onNavigate('chat')} className="bg-stone-900 p-8 rounded-[2.5rem] border border-stone-800 shadow-xl hover:border-emerald-400 hover:shadow-2xl transition-all group text-left h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                 <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3 relative z-10">AI Storyteller</h3>
              <p className="text-sm text-stone-400 leading-relaxed font-medium relative z-10 flex-1">Chat with our intelligent guide. Uncover ancient Ethiopian history, myths, and deep cultural insights.</p>
              <div className="mt-8 text-xs font-black uppercase tracking-widest text-emerald-400 group-hover:translate-x-2 transition-transform">Start Chat →</div>
            </button>
            
            <button onClick={() => onNavigate('map')} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:border-blue-400 hover:shadow-2xl transition-all group text-left h-full flex flex-col relative overflow-hidden">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2 relative z-10">Cultural Atlas</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-medium relative z-10 flex-1">Interactive map of heritage sites.</p>
            </button>
            
            <button onClick={() => onNavigate('culture')} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl hover:border-rose-400 hover:shadow-2xl transition-all group text-left h-full flex flex-col relative overflow-hidden">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2 relative z-10">Culture Zone</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-medium relative z-10 flex-1">Food, music, and traditions.</p>
            </button>
          </div>
        </div>

        {/* Right Sidebar - Recent & Upcoming */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-amber-500 rounded-[2.5rem] p-8 shadow-xl text-stone-900 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                 <span className="text-9xl">✨</span>
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2 relative z-10">Next Big Event</h4>
              <h3 className="text-3xl font-black tracking-tight mb-2 relative z-10">Fichee-Chambalaalla</h3>
              <p className="text-sm font-bold mb-6 relative z-10">Sidama New Year celebration of unity and peace.</p>
              <button onClick={() => onNavigate('vault')} className="bg-stone-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-stone-800 transition-colors relative z-10">
                 View Details
              </button>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-lg font-black text-stone-900">Recent Activity</h4>
                 <button onClick={() => onNavigate('reminders')} className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-stone-900">View All</button>
              </div>

              <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-lg flex-shrink-0">💬</div>
                    <div>
                       <p className="text-sm font-bold text-stone-900">Asked about Axumite Kingdom</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-1">2 days ago</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-lg flex-shrink-0">🔖</div>
                    <div>
                       <p className="text-sm font-bold text-stone-900">Saved Timkat Event</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-1">1 week ago</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-lg flex-shrink-0">🗺️</div>
                    <div>
                       <p className="text-sm font-bold text-stone-900">Explored Lalibela Map</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-1">2 weeks ago</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};


const UpdatePassword: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Password updated successfully!');
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10 bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-xl max-w-md mx-auto mt-10">
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔑</div>
      <h2 className="text-xl font-black mb-6 text-stone-900">Set New Password</h2>
      
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <div>
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1 block text-left">New Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-sm font-medium focus:border-amber-500 focus:outline-none focus:bg-white transition-all"
            required
          />
        </div>
        <div>
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1 block text-left">Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-sm font-medium focus:border-amber-500 focus:outline-none focus:bg-white transition-all"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-amber-500 text-stone-900 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {message && <p className="text-xs font-bold text-amber-600 mt-4">{message}</p>}
    </div>
  );
};

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<EthiopianEvent | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [reminders, setReminders] = useState<UserReminder[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'vault' | 'map' | 'timeline' | 'culture' | 'chat' | 'account'>(() => {
    return (localStorage.getItem('ethio_active_tab') as any) || 'home';
  });

  useEffect(() => {
    localStorage.setItem('ethio_active_tab', activeTab);
  }, [activeTab]);
  const [user, setUser] = useState<User | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true);
        setActiveTab('account');
      } else if (event === 'SIGNED_IN') {
        setActiveTab(prev => prev === 'account' ? 'home' : prev);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
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
              <h1 className="text-xl font-black tracking-tighter text-stone-900 leading-none">{t('app.title')}</h1>
              <p className="text-[9px] text-stone-400 font-black uppercase tracking-[0.3em] mt-1">{t('app.subtitle')}</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex gap-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 shadow-inner">
            {[
              { id: 'home', label: 'Home', icon: '🏛️' },
              ...(user ? [
                { id: 'vault', label: 'Vault', icon: '🏺' },
              ] : [
                { id: 'account', label: 'Login', icon: '👤' }
              ])
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white shadow-xl text-stone-900 border border-stone-100 scale-[1.02]' : 'text-stone-400 hover:text-stone-600'}`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.id === 'account' ? 'Login' : tab.label}
                {tab.id === 'reminders' && reminders.length > 0 && (
                   <span className="bg-amber-500 text-stone-900 w-5 h-5 flex items-center justify-center rounded-lg shadow-sm font-bold ml-1">{reminders.length}</span>
                )}
              </button>
            ))}
            
            {/* Dropdown for More */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all flex items-center gap-2 h-full"
                >
                  <span>➕</span> More
                </button>
                {isMoreOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-2xl py-2 z-50">
                    {[
                      { id: 'map', label: 'Atlas', icon: '🗺️' },
                      { id: 'timeline', label: 'Timeline', icon: '📜' },
                      { id: 'culture', label: t('nav.zone'), icon: '✨' },
                      { id: 'chat', label: t('nav.guide'), icon: '🤖' }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setIsMoreOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <span className="text-base">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          </nav>

          <div className="flex items-center gap-6">
            <select 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language}
              className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs font-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="en">EN</option>
              <option value="am">አማ</option>
              <option value="om">ORM</option>
            </select>

            <div className="hidden xl:flex flex-col items-end">
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Local Time</p>
               <p className="text-stone-900 font-bold text-sm tracking-tight">{todayInfo.ethAmharic}</p>
            </div>
            <button 
               onClick={() => setActiveTab('account')}
               className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${activeTab === 'account' ? 'bg-amber-600 border-amber-700 text-white shadow-lg' : 'bg-stone-100 border-stone-200 text-stone-400 hover:bg-stone-200 hover:text-stone-600'}`}
               title="Profile"
            >
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 px-6 h-20 flex items-center justify-around shadow-2xl">
        {[
          { id: 'home', label: 'Home', icon: '🏛️' },
          ...(user ? [
            { id: 'vault', label: 'Vault', icon: '🏺' },
          ] : [
            { id: 'account', label: 'Login', icon: '👤' }
          ])
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 transition-all flex-shrink-0 min-w-[60px] ${activeTab === tab.id ? 'text-amber-600 scale-110 font-bold' : 'text-stone-400'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
        
        {/* More Button */}
        {user && (
          <>
            <button 
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex flex-col items-center gap-1 transition-all ${isMoreOpen ? 'text-amber-600' : 'text-stone-400'}`}
            >
              <span className="text-xl">➕</span>
              <span className="text-[8px] font-black uppercase tracking-widest">More</span>
            </button>

            {/* Mobile Dropdown (Popover) */}
            {isMoreOpen && (
              <div className="absolute bottom-20 left-0 right-0 bg-white border-t border-stone-200 shadow-2xl py-6 grid grid-cols-3 gap-y-6 px-6 z-50">
                {[
                  { id: 'map', label: 'Atlas', icon: '🗺️' },
                  { id: 'timeline', label: 'Timeline', icon: '📜' },
                  { id: 'culture', label: 'Zone', icon: '✨' },
                  { id: 'chat', label: 'Guide', icon: '🤖' }
                ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setIsMoreOpen(false); }}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-amber-600 font-bold' : 'text-stone-400'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>
        )}
        </>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10 flex-grow w-full">
        {isResettingPassword ? (
          <UpdatePassword onComplete={() => setIsResettingPassword(false)} />
        ) : !user ? (
          activeTab === 'account' ? (
            <Auth />
          ) : (
            <LandingPage onExplore={() => setActiveTab('account')} />
          )
        ) : activeTab === 'vault' ? (
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

            {/* Combined Reminders/Saved Section in Vault */}
            <div className="lg:col-span-12 mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              <MyReminders 
                reminders={reminders} 
                events={EVENTS_DATA} 
                onDelete={handleDeleteReminder} 
                onUpdate={handleUpdateReminder}
                onClearAll={handleClearAllReminders}
              />
            </div>
          </div>
        ) : activeTab === 'home' ? (
          user ? <Dashboard user={user} onNavigate={setActiveTab} /> : <LandingPage onExplore={() => setActiveTab('account')} />
        ) : activeTab === 'map' ? (
          <CulturalMap />
        ) : activeTab === 'timeline' ? (
          <HistoricalTimeline />
        ) : activeTab === 'culture' ? (
          <CultureZone />
        ) : activeTab === 'chat' ? (
          <HeritageChat />
        ) : activeTab === 'account' ? (
          user ? <ProfileSettings user={user} /> : <Auth />
        ) : (
          user ? (
            <ProfileSettings user={user} />
          ) : (
            <Auth />
          )
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
    { id: 'tg', icon: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3.002-2.21-1.444 1.394c-.16.16-.294.294-.602.294l.215-3.048 5.549-5.012c.241-.213-.053-.331-.373-.118l-6.853 4.314-2.956-.922c-.642-.201-.655-.642.134-.95l11.554-4.451c.535-.196.994.122.832.797z', color: 'bg-sky-500 hover:shadow-sky-200', href: 'https://t.me/urjiiko1' },
    { id: 'gh', icon: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12', color: 'bg-stone-900 hover:shadow-stone-200', href: 'https://github.com/gemachistesfaye' },
    { id: 'mail', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-rose-500 hover:shadow-rose-200', href: 'mailto:gemachistesfaye36@gmail.com', isStroke: true },
    { id: 'phone', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', color: 'bg-emerald-500 hover:shadow-emerald-200', href: 'tel:+251976601074', isStroke: true }
  ];

  return (
    <footer className="bg-white border-t border-stone-100 mt-12 py-6 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 items-center">
        
        {/* Left Column: About Website */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-stone-900 text-amber-500 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
              Portal
            </span>
            <h3 className="text-lg font-black text-stone-900 tracking-tight">
              Ethiopian Events <span className="text-amber-600">Portal</span>
            </h3>
          </div>
          <p className="text-stone-500 text-xs font-medium max-w-sm">
            Dedicated to preserving and exploring Ethiopia's rich cultural heritage and events through modern technology.
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">© 2026 Rights Reserved</p>
        </div>

        {/* Right Column: About Me */}
        <div className="flex flex-col md:items-end gap-2 text-center md:text-right">
          <div className="flex items-center gap-3 md:flex-row-reverse">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-amber-500 font-black text-sm shadow-md">G</div>
            <div>
              <h4 className="text-sm font-black text-stone-900">Gemachis Tesfaye</h4>
              <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Lead Engineer</p>
            </div>
          </div>
          <p className="text-stone-500 text-xs font-medium max-w-sm md:text-right">
            Software Developer building intelligent solutions.
          </p>
          
          {/* Social Media Icons */}
          <div className="flex gap-1.5 mt-1 justify-center md:justify-end">
            {socialLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`w-7 h-7 ${link.color} text-white rounded-md flex items-center justify-center transition-all hover:-translate-y-0.5 shadow-sm group`}
              >
                <svg 
                  className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" 
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
    </footer>
  );
};

export default App;
