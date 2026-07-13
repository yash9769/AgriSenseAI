import React from 'react';
import { PottedPlant, Mail, Lock, Visibility, Encrypted } from '../components/Icons';
import { motion } from 'motion/react';

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale-[20%] brightness-75" 
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920)' }}
      />
      <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent" />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container mb-6 shadow-lg">
              <PottedPlant className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-primary mb-2">Welcome to AgriSense AI</h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">Explainable AI for Smart Farming</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wider text-on-surface-variant uppercase ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-outline w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  placeholder="farmer@agrisense.ai"
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wider text-on-surface-variant uppercase ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-outline w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors">
                  <Visibility className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 border-2 border-outline-variant rounded bg-transparent checked:bg-primary checked:border-primary transition-all" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-primary hover:underline underline-offset-4">Forgot password?</button>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-primary text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] mt-4"
            >
              Sign In to AgriSense AI
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-on-surface-variant font-medium">
              Don't have an account yet? 
              <button className="text-primary font-bold ml-1 hover:underline underline-offset-4">Create an account</button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-white/60">
          <Encrypted className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-widest uppercase">Secure Enterprise Access</span>
        </div>
      </motion.main>
    </div>
  );
};
