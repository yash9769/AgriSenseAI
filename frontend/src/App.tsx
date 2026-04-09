import React, { useState } from 'react';
import { Sidebar, type Screen } from './components/Sidebar';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { UploadScreen } from './screens/UploadScreen';
import { AnalysisScreen } from './screens/AnalysisScreen';
import { ForumsScreen } from './screens/ForumsScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { FieldMapScreen } from './screens/FieldMapScreen';
import { SoilMetricsScreen } from './screens/SoilMetricsScreen';
import { WeatherScreen } from './screens/WeatherScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupportScreen } from './screens/SupportScreen';
import { ProPlanScreen } from './screens/ProPlanScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { Home, History, Add, Analytics, Settings } from './components/Icons';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
    setScreen('dashboard');
  };

  if (!isLoggedIn) {
    return authMode === 'login' ? (
      <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterScreen onRegister={handleLogin} onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeScreen={screen} setScreen={setScreen} />
      
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
            {screen === 'assistant' && <AssistantScreen setScreen={setScreen} />}
            {screen === 'history' && <HistoryScreen setScreen={setScreen} />}
            {screen === 'crop-health' && (
              <UploadScreen 
                setScreen={setScreen} 
                setSelectedImg={setSelectedImg} 
                setAnalysisResult={setAnalysisResult} 
              />
            )}
            {screen === 'analysis' && (
              <AnalysisScreen 
                setScreen={setScreen} 
                image={selectedImg} 
                result={analysisResult} 
              />
            )}
            {screen === 'forums' && <ForumsScreen setScreen={setScreen} />}
            {screen === 'community' && <CommunityScreen setScreen={setScreen} />}
            {screen === 'dashboard' && <DashboardScreen setScreen={setScreen} />}
            {screen === 'field-map' && <FieldMapScreen setScreen={setScreen} />}
            {screen === 'soil-metrics' && <SoilMetricsScreen setScreen={setScreen} />}
            {screen === 'weather' && <WeatherScreen setScreen={setScreen} />}
            {screen === 'settings' && <SettingsScreen setScreen={setScreen} user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />}
            {screen === 'support' && <SupportScreen setScreen={setScreen} />}
            {screen === 'pro-plan' && <ProPlanScreen setScreen={setScreen} />}
            {screen === 'analytics' && <AnalyticsScreen setScreen={setScreen} />}
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
            <Settings className="w-6 h-6" fill={screen === 'settings'} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
