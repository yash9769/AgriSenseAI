import React from 'react';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { Settings as SettingsIcon, Mail, Lock, Shield, Bolt, Help, ChevronRight, CheckCircle } from '../components/Icons';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const SettingsScreen = ({ setScreen, user, setUser, setIsLoggedIn }: { setScreen: (s: Screen) => void, user: any, setUser: any, setIsLoggedIn: any }) => {
  const [loading, setLoading] = React.useState(!user);

  React.useEffect(() => {
    if (!user) {
        // Fetch mock user 1 if none logged in for demo
        fetch('/api/auth/profile/1')
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            });
    }
  }, [user]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Synchronizing Security Tokens...</div>;

  const sections = [
    { title: 'Account Settings', desc: user.email, icon: SettingsIcon },
    { title: 'Field Parameters', desc: `Location: ${user.location || 'Global'}`, icon: Bolt },
    { title: 'Notifications', desc: 'Customized for harvest season', icon: Help },
    { title: 'Privacy & Security', desc: 'AES-256 Encryption Active', icon: Shield },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="System Settings" activeScreen="settings" setScreen={setScreen} />
      
      <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full space-y-12 scrollbar-hide">
        <div className="flex items-center gap-8 mb-12">
            <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] bg-emerald-100 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="text-4xl font-headline font-black text-emerald-800">{user.name[0]}</div>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                    <CheckCircle className="w-4 h-4" />
                </button>
            </div>
            <div>
                <h2 className="text-3xl font-headline font-black text-primary">{user.name}</h2>
                <p className="text-on-surface-variant font-medium">Farmer · {user.location || 'India'}</p>
                <div className="mt-2 flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-900/5">Verified Node</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {sections.map((section, i) => (
                <button key={i} className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-3xl border border-emerald-900/5 hover:bg-emerald-50/50 transition-all group text-left">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <section.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-headline font-bold text-lg text-on-surface">{section.title}</h3>
                            <p className="text-sm text-on-surface-variant font-medium">{section.desc}</p>
                        </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-outline group-hover:text-primary transition-all group-hover:translate-x-1" />
                </button>
            ))}
        </div>

        <div className="pt-8 border-t border-outline-variant/10">
            <button 
                onClick={handleLogout}
                className="px-8 py-4 bg-error-container text-on-error-container rounded-2xl font-bold flex items-center gap-3 hover:bg-error transition-colors shadow-sm"
            >
                Log Out of System
            </button>
        </div>
      </div>
    </div>
  );
};
