import React, { useState } from 'react';
import { PottedPlant, Mail, Lock, Visibility, VisibilityOff, Encrypted } from '../components/Icons';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      if (mode === 'forgot') {
        if (!email) { showToast('⚠️ Please enter your email'); return; }
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        showToast('✅ Reset link sent! Check your inbox.');
        setTimeout(() => setMode('login'), 2000);
        return;
      }

      if (mode === 'signup') {
        if (!email || !password) { showToast('⚠️ All fields are required'); return; }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast('✅ Account created! Check your email for verification.');
        return;
      }

      // login
      if (!email || !password) { showToast('⚠️ Please enter email and password'); return; }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      onLogin();
    } catch (err) {
      showToast(err instanceof Error ? `❌ ${err.message}` : '❌ Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-emerald-950">
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale-[20%] brightness-75 opacity-40 shadow-inner" 
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920)' }}
      />
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur shadow-2xl px-8 py-4 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <span className="font-headline font-bold text-emerald-900">{toast}</span>
        </div>
      )}
      
      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="glass-panel rounded-[2.5rem] p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl signature-gradient mb-8 shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-700">
              <PottedPlant className="text-white w-10 h-10" fill />
            </div>
            <h1 className="text-4xl font-headline font-black tracking-tight text-white mb-3">
              {mode === 'forgot' ? 'Reset Portal' : mode === 'signup' ? 'New Harvest' : 'AgriSense AI'}
            </h1>
            <p className="text-emerald-100 font-medium opacity-80 decoration-emerald-400 decoration-wavy">
              {mode === 'forgot' ? "Enter your email to recover your crops" : 'Professional Plant Pathology & Insights'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[11px] font-black tracking-[0.2em] text-emerald-200 uppercase ml-1 opacity-70">Territory Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="text-emerald-300/60 w-5 h-5 group-focus-within:text-emerald-100 transition-colors" />
                </div>
                <input 
                  type="email" 
                  placeholder="farmer@domain.ai"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-emerald-100/30 focus:ring-2 focus:ring-emerald-400/30 focus:bg-white/10 transition-all outline-none text-lg font-medium"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className="block text-[11px] font-black tracking-[0.2em] text-emerald-200 uppercase ml-1 opacity-70">Secure Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="text-emerald-300/60 w-5 h-5 group-focus-within:text-emerald-100 transition-colors" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-emerald-100/30 focus:ring-2 focus:ring-emerald-400/30 focus:bg-white/10 transition-all outline-none text-lg font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                        console.log('Login: Toggling password visibility');
                        setShowPassword(p => !p);
                    }}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-emerald-300/60 hover:text-white transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-5 h-5">
                    <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full h-full border-2 border-white/20 rounded bg-white/5 peer-checked:bg-emerald-400 peer-checked:border-emerald-400 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 text-emerald-950 font-bold text-[10px]">✓</div>
                  </div>
                  <span className="text-sm font-bold text-emerald-100/70 group-hover:text-white transition-colors">Keep Session</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => {
                      console.log('Login: Switching to Forgot Password mode');
                      setMode('forgot');
                  }} 
                  className="text-sm font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider active:opacity-70"
                >
                  Forgot Key?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 signature-gradient text-white rounded-2xl font-black text-xl shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3)] hover:shadow-[0_20px_40px_-8px_rgba(16,185,129,0.5)] active:scale-[0.98] mt-6 disabled:opacity-60 transition-all group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                ) : (
                    <>
                        {mode === 'forgot' ? 'Initiate Reset' : mode === 'signup' ? 'Claim My Spot' : 'Enter Application'}
                    </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/10 text-center">
            {mode === 'login' ? (
              <p className="text-emerald-100/60 font-bold">
                New to the field?{' '}
                <button 
                  type="button"
                  onClick={() => {
                      console.log('Login: Switching to Signup mode');
                      setMode('signup');
                  }} 
                  className="text-emerald-400 font-black ml-2 hover:text-emerald-300 transition-colors border-b-2 border-emerald-400/20 hover:border-emerald-400/50 pb-0.5 active:opacity-70"
                >
                    Create Account
                </button>
              </p>
            ) : (
              <p className="text-emerald-100/60 font-bold">
                Returning expert?{' '}
                <button 
                   onClick={() => {
                       console.log('Login: Switching back to Login mode');
                       setMode('login');
                   }} 
                   className="text-emerald-400 font-black ml-2 hover:text-emerald-300 transition-colors border-b-2 border-emerald-400/20 hover:border-emerald-400/50 pb-0.5"
                >
                   Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-white/30">
          <Encrypted className="w-4 h-4" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">AES-256 Cloud Infrastructure</span>
        </div>
      </motion.main>
    </div>
  );
};

