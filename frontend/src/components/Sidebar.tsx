import React from 'react';
import { SmartToy, History, PottedPlant, Science, WbSunny, Help, Settings, Add } from './Icons';
import { cn } from '../lib/utils';

export type Screen = 'login' | 'assistant' | 'history' | 'crop-health' | 'analysis';

interface SidebarProps {
  activeScreen: Screen;
  setScreen: (s: Screen) => void;
}

export const Sidebar = ({ activeScreen, setScreen }: SidebarProps) => {
  const navItems = [
    { id: 'assistant', label: 'Assistant', icon: SmartToy },
    { id: 'history', label: 'History', icon: History },
    { id: 'crop-health', label: 'Crop Health', icon: PottedPlant },
    { id: 'soil-metrics', label: 'Soil Metrics', icon: Science },
    { id: 'weather', label: 'Weather', icon: WbSunny },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 border-r border-emerald-900/5 bg-emerald-50/40 backdrop-blur-2xl p-4 gap-2 sticky top-0 z-50">
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shadow-sm">
          <SmartToy className="text-white w-6 h-6" fill />
        </div>
        <div>
          <div className="font-headline font-black text-emerald-900 tracking-tight">AgriSense AI</div>
          <div className="text-[10px] font-headline font-bold text-emerald-700/70 uppercase tracking-widest">Digital Agronomist</div>
        </div>
      </div>

      <button 
        onClick={() => setScreen('crop-health')}
        className="mb-6 w-full flex items-center justify-center gap-2 py-3 signature-gradient text-white rounded-xl shadow-sm text-sm font-bold hover:opacity-90 transition-all active:scale-95"
      >
        <Add className="w-4 h-4" />
        New Analysis
      </button>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-headline text-sm font-medium",
              activeScreen === item.id 
                ? "bg-emerald-900 text-white shadow-sm" 
                : "text-emerald-800 hover:bg-emerald-100 hover:translate-x-1"
            )}
          >
            <item.icon className="w-5 h-5" fill={activeScreen === item.id} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-emerald-900/5 pt-4">
        <button className="flex items-center gap-3 px-4 py-3 text-emerald-800 hover:bg-emerald-100 rounded-xl transition-all font-headline text-sm font-medium">
          <Help className="w-5 h-5" />
          <span>Support</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 text-emerald-800 hover:bg-emerald-100 rounded-xl transition-all font-headline text-sm font-medium">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
