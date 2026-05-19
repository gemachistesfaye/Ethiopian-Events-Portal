import React, { useState } from 'react';
import { supabase } from '../services/supabase';
const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [message, setMessage] = useState('');
    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        if (isSignUp && password !== confirmPassword) {
            setMessage('Passwords do not match!');
            setLoading(false);
            return;
        }
        try {
            if (isForgotPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error)
                    throw error;
                setMessage('Password reset link sent to your email!');
            }
            else if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: name }
                    }
                });
                if (error)
                    throw error;
                setMessage('Check your email for the confirmation link! You can only log in after verifying.');
            }
            else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error)
                    throw error;
            }
        }
        catch (error) {
            setMessage(error.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
            if (error)
                throw error;
        }
        catch (error) {
            alert(error.message);
        }
    };
    const handleGitHubLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
            if (error)
                throw error;
        }
        catch (error) {
            alert(error.message);
        }
    };
    return (<div className="max-w-md mx-auto bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 shadow-xl font-sans mt-10">
      <div className="text-center mb-6">
        <span className="bg-stone-50 text-amber-600 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">Secure Access</span>
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-wide leading-none font-serif">
          {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {isSignUp && (<div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 block">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 bg-stone-100 border border-stone-100 rounded-xl px-4 text-sm font-medium focus:border-amber-500 focus:outline-none focus:bg-stone-50 transition-all" required={isSignUp}/>
          </div>)}

        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 block">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 bg-stone-100 border border-stone-100 rounded-xl px-4 text-sm font-medium focus:border-amber-500 focus:outline-none focus:bg-stone-50 transition-all" required/>
        </div>

        {!isForgotPassword && (<div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 bg-stone-100 border border-stone-100 rounded-xl px-4 text-sm font-medium focus:border-amber-500 focus:outline-none focus:bg-stone-50 transition-all" required={!isForgotPassword}/>
          </div>)}

        {isSignUp && (<div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 block">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full h-12 bg-stone-100 border border-stone-100 rounded-xl px-4 text-sm font-medium focus:border-amber-500 focus:outline-none focus:bg-stone-50 transition-all" required={isSignUp}/>
          </div>)}

        {!isSignUp && !isForgotPassword && (<div className="text-right">
            <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs font-bold uppercase text-stone-500 hover:text-amber-600 transition-colors">
              Forgot Password?
            </button>
          </div>)}

        <button type="submit" disabled={loading} className="w-full h-12 bg-amber-900/20 text-stone-900 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-amber-600 transition-colors disabled:opacity-50">
          {loading ? 'Processing...' : isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {message && <p className="text-center text-xs font-bold text-amber-600 mt-4">{message}</p>}

      {!isForgotPassword && (<>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-bold text-stone-700"><span className="bg-stone-50 px-4">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleGoogleLogin} className="w-full h-12 bg-stone-50 border border-stone-200 text-stone-700 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-stone-100 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.54 28.55c-.48-1.45-.76-2.99-.76-4.55s.28-3.1.76-4.55l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google
            </button>

            <button onClick={handleGitHubLogin} className="w-full h-12 bg-stone-50 text-stone-900 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-stone-100 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.293 0 .322.218.694.825.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
        </>)}

      <div className="text-center mt-6 flex flex-col gap-2">
        <button onClick={() => {
            setIsSignUp(!isSignUp);
            setIsForgotPassword(false);
            setMessage('');
        }} className="text-xs font-bold uppercase text-stone-500 hover:text-amber-600 transition-colors">
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>

        {isForgotPassword && (<button onClick={() => {
                setIsForgotPassword(false);
                setIsSignUp(false);
                setMessage('');
            }} className="text-xs font-bold uppercase text-stone-500 hover:text-amber-600 transition-colors">
            Back to Login
          </button>)}
      </div>
    </div>);
};
export default Auth;
