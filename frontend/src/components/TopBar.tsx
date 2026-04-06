import React from 'react';
import { SmartToy, Star, Notifications, Settings } from './Icons';
import { type Screen } from './Sidebar';

interface TopBarProps {
  title: string;
  setScreen: (s: Screen) => void;
}

export const TopBar = ({ title, setScreen }: TopBarProps) => {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-8 py-4 w-full bg-emerald-50/80 backdrop-blur-xl border-b border-emerald-900/5">
      <div className="flex items-center gap-8">
        <div className="md:hidden flex items-center gap-2" onClick={() => setScreen('assistant')}>
          <div className="w-8 h-8 rounded-full signature-gradient flex items-center justify-center">
            <SmartToy className="text-white w-4 h-4" fill />
          </div>
          <span className="text-lg font-extrabold tracking-tighter text-emerald-900 font-headline">AgriSense AI</span>
        </div>
        <h2 className="hidden md:block font-headline font-bold text-lg text-emerald-900">{title}</h2>
        
        <nav className="hidden lg:flex items-center gap-6 ml-4">
          <button className="font-sans text-xs tracking-wider uppercase text-emerald-700/70 hover:text-emerald-900 transition-colors">Dashboard</button>
          <button className="font-sans text-xs tracking-wider uppercase text-emerald-700/70 hover:text-emerald-900 transition-colors">Field Map</button>
          <button className="font-sans text-xs tracking-wider uppercase text-emerald-950 border-b-2 border-emerald-800 pb-1">Analytics</button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-emerald-100/50 rounded-lg text-emerald-900 text-xs font-bold uppercase tracking-widest transition-all hover:bg-emerald-200/50">
          <Star className="w-3 h-3" fill />
          Pro Plan
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors">
            <Notifications className="w-5 h-5" />
          </button>
          <button className="p-2 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-emerald-900/10">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" 
              alt="User" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};
