import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl font-sans mt-10">
      <div className="text-center mb-6">
        <span className="bg-stone-900 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">Secure Access</span>
        <h2 className="text-3xl font-black text-stone-900 tracking-tighter leading-none">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1 block">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-sm font-medium focus:border-amber-500 focus:outline-none focus:bg-white transition-all"
            required
          />
        </div>
        <div>
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1 block">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-sm font-medium focus:border-amber-500 focus:outline-none focus:bg-white transition-all"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-stone-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {message && <p className="text-center text-xs font-bold text-amber-600 mt-4">{message}</p>}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
        <div className="relative flex justify-center text-xs uppercase font-black text-stone-300"><span className="bg-white px-4">Or continue with</span></div>
      </div>

      <button 
        onClick={handleGoogleLogin}
        className="w-full h-12 bg-white border border-stone-200 text-stone-700 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>
        Google
      </button>

      <div className="text-center mt-6">
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs font-black uppercase text-stone-400 hover:text-amber-600 transition-colors"
        >
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
