import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Sidebar, type Screen } from './components/Sidebar';
import { LoginScreen } from './screens/LoginScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { UploadScreen } from './screens/UploadScreen';
import { AnalysisScreen } from './screens/AnalysisScreen';
import { WeatherScreen } from './screens/WeatherScreen';
import { SoilMetricsScreen } from './screens/SoilMetricsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Home, History, Add, Analytics, Settings } from './components/Icons';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [screen, setScreen] = useState<Screen>('assistant');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (!session) setScreen('login');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session) setScreen('login');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setScreen('assistant');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setScreen('login');
  };

  if (isLoggedIn === null) return null;

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeScreen={screen} setScreen={setScreen} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 blur-[120px] -z-10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-800/10 blur-[100px] -z-10 rounded-full translate-y-1/4 -translate-x-1/4"></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {screen === 'assistant'    && <AssistantScreen setScreen={setScreen} />}
            {screen === 'history'      && <HistoryScreen setScreen={setScreen} />}
            {screen === 'crop-health'  && <UploadScreen setScreen={setScreen} />}
            {screen === 'analysis'     && <AnalysisScreen setScreen={setScreen} />}
            {screen === 'weather'      && <WeatherScreen setScreen={setScreen} />}
            {screen === 'soil-metrics' && <SoilMetricsScreen setScreen={setScreen} />}
            {screen === 'settings'     && <SettingsScreen setScreen={setScreen} onLogout={handleLogout} />}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-emerald-50/80 backdrop-blur-xl border-t border-emerald-900/5 px-6 py-3 flex justify-between items-center z-50">
          <button 
            onClick={() => setScreen('assistant')}
            className={cn("flex flex-col items-center gap-1", screen === 'assistant' ? "text-emerald-950" : "text-emerald-700/60")}
          >
            <Home className="w-6 h-6" fill={screen === 'assistant'} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => setScreen('history')}
            className={cn("flex flex-col items-center gap-1", screen === 'history' ? "text-emerald-950" : "text-emerald-700/60")}
          >
            <History className="w-6 h-6" fill={screen === 'history'} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
          </button>
          <div className="relative -mt-8">
            <button 
              onClick={() => setScreen('crop-health')}
              className="w-14 h-14 signature-gradient rounded-full shadow-lg flex items-center justify-center text-white"
            >
              <Add className="w-8 h-8" />
            </button>
          </div>
          <button 
            onClick={() => setScreen('analysis')}
            className={cn("flex flex-col items-center gap-1", screen === 'analysis' ? "text-emerald-950" : "text-emerald-700/60")}
          >
            <Analytics className="w-6 h-6" fill={screen === 'analysis'} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Data</span>
          </button>
          <button
            onClick={() => setScreen('settings')}
            className={cn("flex flex-col items-center gap-1", screen === 'settings' ? "text-emerald-950" : "text-emerald-700/60")}
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
