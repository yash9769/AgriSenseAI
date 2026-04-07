import React from 'react';
import { SmartToy, Star, Notifications, Settings } from './Icons';
import { type Screen } from './Sidebar';
import { cn } from '../lib/utils';

interface TopBarProps {
  title: string;
  setScreen: (s: Screen) => void;
}

export const TopBar = ({ title, setScreen }: TopBarProps) => {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-4 md:px-8 py-4 w-full bg-emerald-50/80 backdrop-blur-xl border-b border-emerald-900/5">
      <div className="flex items-center gap-4 md:gap-8 grow">
        <div className="md:hidden flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setScreen('assistant')}>
          <div className="w-8 h-8 rounded-full signature-gradient flex items-center justify-center">
            <SmartToy className="text-white w-4 h-4" fill />
          </div>
          <span className="text-lg font-extrabold tracking-tighter text-emerald-900 font-headline">AgriSense AI</span>
        </div>
        <h2 className="hidden md:block font-headline font-bold text-lg text-emerald-900 shrink-0">{title}</h2>
        
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 ml-4">
          <button
            onClick={() => setScreen('assistant')}
            className={cn(
              "font-sans text-[10px] lg:text-xs tracking-wider uppercase transition-colors",
              title === 'Assistant Session' ? "text-emerald-950 border-b-2 border-emerald-800 pb-1 font-bold" : "text-emerald-700/70 hover:text-emerald-900"
            )}
          >
            Dashboard
          </button>
          <button
            onClick={() => setScreen('soil-metrics')}
            className={cn(
              "font-sans text-[10px] lg:text-xs tracking-wider uppercase transition-colors",
              title === 'Soil Metrics' ? "text-emerald-950 border-b-2 border-emerald-800 pb-1 font-bold" : "text-emerald-700/70 hover:text-emerald-900"
            )}
          >
            Field Map
          </button>
          <button
            onClick={() => setScreen('history')}
            className={cn(
              "font-sans text-[10px] lg:text-xs tracking-wider uppercase transition-colors",
              title === 'History' ? "text-emerald-950 border-b-2 border-emerald-800 pb-1 font-bold" : "text-emerald-700/70 hover:text-emerald-900"
            )}
          >
            Analytics
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button
          onClick={() => {
            window.alert('✨ AgriSense Pro\n\nUnlock unlimited field scans, satellite imagery, and localized pest prediction models.\n\nRedirecting to subscription portal...');
            setScreen('settings');
          }}
          className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-1.5 bg-emerald-100 rounded-lg text-emerald-900 text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all hover:bg-emerald-200"
        >
          <Star className="w-3 h-3" fill />
          Pro Plan
        </button>
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => window.alert('🔔 No new notifications.\n\nYour crops are healthy today!')}
            className="p-2 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors"
            title="Notifications"
          >
            <Notifications className="w-5 h-5" />
          </button>
          <button
            onClick={() => setScreen('settings')}
            className="p-2 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setScreen('settings')}
            className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-emerald-900/10 hover:shadow-md transition-all active:scale-95"
            title="Profile"
          >
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" 
              alt="User profile" 
            />
          </button>
        </div>
      </div>
    </header>
  );
};

