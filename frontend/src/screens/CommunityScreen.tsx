import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { Groups, Shield, CheckCircle, AddAPhoto, Psychology, Search, ChevronRight } from '../components/Icons';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const INITIAL_COMMUNITIES = [
  { id: 1, name: 'Tomato Farmers Guild', members: 450, activity: 'High', area: 'California', joined: true, image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Wheat Growers Association', members: 1200, activity: 'Medium', area: 'Midwest', joined: false, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Sustainable Farming Collective', members: 85, activity: 'Very High', area: 'Global', joined: false, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Precision Irrigation Network', members: 230, activity: 'High', area: 'Israel-Global', joined: true, image: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=400' },
];

export const CommunityScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/social/guilds')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
            // Trigger auto-init if empty
            fetch('/api/social/init-demo', {method: 'POST'})
                .then(() => fetch('/api/social/guilds').then(r => r.json()).then(setCommunities));
        } else {
            setCommunities(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleJoin = (id: number) => {
    fetch(`/api/social/guilds/${id}/join`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setCommunities(communities.map(c => 
          c.id === id ? { ...c, joined: true, members_count: data.members } : c
        ));
      });
  };

  const filtered = communities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Communities" setScreen={setScreen} activeScreen="community" />
      
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full scrollbar-hide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Farm Guilds</h2>
            <p className="text-on-surface-variant max-w-xl mt-2">Join specialized networks to optimize your crop yields through shared node data and expertise.</p>
          </div>
          <button className="bg-surface-container border border-emerald-900/10 text-primary px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-50 transition-all active:scale-95">
            <AddAPhoto className="w-5 h-5" />
            Create Guild
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-2xl mb-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find guilds by crop or region..."
                className="w-full bg-surface-container-low border-none rounded-full pl-14 pr-6 py-5 text-sm focus:ring-2 focus:ring-primary/20 shadow-sm transition-all outline-none"
            />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
                {filtered.map((c) => (
                    <motion.div 
                        layout
                        key={c.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group bg-surface-container-lowest rounded-[3rem] overflow-hidden border border-emerald-900/5 hover:border-emerald-900/10 hover:shadow-2xl transition-all flex flex-col"
                    >
                        <div className="h-48 relative overflow-hidden">
                            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={c.image} alt={c.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
                            <div className="absolute top-4 right-4">
                                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                                    {c.area}
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-6">
                                <div className="flex items-center gap-2">
                                    <Groups className="text-white/60 w-4 h-4" />
                                    <span className="text-white font-bold text-sm">{c.members_count} Specialists</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-headline font-extrabold text-primary leading-tight group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{c.name}</h3>
                            </div>
                            
                            <div className="flex items-center gap-6 mb-8 mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-outline font-bold">Activity</span>
                                    <span className="text-emerald-800 font-bold text-sm flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {c.activity}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => toggleJoin(c.id)}
                                className={cn(
                                    "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                                    c.joined 
                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                                        : "bg-emerald-900 text-white shadow-xl shadow-emerald-950/20 hover:bg-emerald-800 active:scale-95"
                                )}
                            >
                                {c.joined ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" fill />
                                        Member Access
                                    </>
                                ) : "Join Guild"}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* Action Banner */}
        <div className="mt-16 bg-gradient-to-br from-emerald-50 to-emerald-100 p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-white">
            <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-xl">
                    <Psychology className="text-primary w-10 h-10" />
                </div>
                <div>
                    <h3 className="text-3xl font-headline font-black text-emerald-900">Expert Insights</h3>
                    <p className="text-emerald-800/60 font-medium">Get exclusive access to the Global Agronomy AI for $0/mo.</p>
                </div>
            </div>
            <button className="signature-gradient text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/20 active:scale-95 transition-all">
                Learn More
            </button>
        </div>
      </div>
    </div>
  );
};
