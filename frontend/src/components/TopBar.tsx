import React from 'react';
import { SmartToy, Star, Notifications, Settings } from './Icons';
import { type Screen } from './Sidebar';
import { cn } from '../lib/utils';

interface TopBarProps {
  title: string;
  activeScreen?: Screen;
  setScreen: (s: Screen) => void;
  dark?: boolean;
}

export const TopBar = ({ title, activeScreen, setScreen, dark }: TopBarProps) => {
  return (
    <header className={cn(
      "sticky top-0 z-40 flex justify-between items-center px-8 py-4 w-full backdrop-blur-xl border-b transition-colors duration-300",
      dark 
        ? "bg-emerald-950/80 border-white/5 text-white" 
        : "bg-emerald-50/80 border-emerald-900/5 text-emerald-900"
    )}>
      <div className="flex items-center gap-8">
        <div className="md:hidden flex items-center gap-2" onClick={() => setScreen('assistant')}>
          <div className="w-8 h-8 rounded-full signature-gradient flex items-center justify-center">
            <SmartToy className="text-white w-4 h-4" fill />
          </div>
          <span className={cn("text-lg font-extrabold tracking-tighter font-headline", dark ? "text-white" : "text-emerald-900")}>AgriSense AI</span>
        </div>
        <h2 className={cn("hidden md:block font-headline font-bold text-lg", dark ? "text-white" : "text-emerald-900")}>{title}</h2>
        
        <nav className="hidden lg:flex items-center gap-6 ml-4">
          <button 
            onClick={() => setScreen('dashboard')}
            className={cn(
              "font-sans text-xs tracking-wider uppercase transition-all",
              activeScreen === 'dashboard' 
                ? (dark ? "text-white border-b-2 border-emerald-400 pb-1" : "text-emerald-950 border-b-2 border-emerald-800 pb-1")
                : (dark ? "text-emerald-100/40 hover:text-white" : "text-emerald-700/70 hover:text-emerald-900")
            )}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setScreen('field-map')}
            className={cn(
              "font-sans text-xs tracking-wider uppercase transition-all",
              activeScreen === 'field-map' 
                ? (dark ? "text-white border-b-2 border-emerald-400 pb-1" : "text-emerald-950 border-b-2 border-emerald-800 pb-1")
                : (dark ? "text-emerald-100/40 hover:text-white" : "text-emerald-700/70 hover:text-emerald-900")
            )}
          >
            Field Map
          </button>
          <button 
            onClick={() => setScreen('assistant')}
            className={cn(
              "font-sans text-xs tracking-wider uppercase transition-all",
              activeScreen === 'assistant' 
                ? (dark ? "text-white border-b-2 border-emerald-400 pb-1" : "text-emerald-950 border-b-2 border-emerald-800 pb-1")
                : (dark ? "text-emerald-100/40 hover:text-white" : "text-emerald-700/70 hover:text-emerald-900")
            )}
          >
            AI Assistant
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setScreen('pro-plan')}
          className={cn(
            "hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm border",
            dark 
                ? "bg-emerald-400 text-emerald-950 border-emerald-400 hover:bg-emerald-300"
                : "bg-emerald-100/50 text-emerald-900 border-emerald-900/5 hover:bg-emerald-200/50"
          )}
        >
          <Star className="w-3 h-3" fill />
          Upgrade Pro
        </button>
        <div className="flex items-center gap-2">
          <button className={cn("p-2 rounded-lg transition-colors", dark ? "text-emerald-100/60 hover:bg-white/10" : "text-emerald-700 hover:bg-emerald-100/50")}>
            <Notifications className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setScreen('settings')}
            className={cn("p-2 rounded-lg transition-colors", dark ? "text-emerald-100/60 hover:bg-white/10" : "text-emerald-700 hover:bg-emerald-100/50")}
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className={cn("w-8 h-8 rounded-full overflow-hidden border", dark ? "border-white/10" : "border-emerald-900/10")}>
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
