import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { Analytics as AnalyticsIcon, TrendingUp, TrendingDown, ShowChart, BarChart, Timeline, ChevronRight, Download } from '../components/Icons';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const AnalyticsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/summary/1')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return (
     <div className="flex-1 flex flex-col items-center justify-center text-primary font-headline font-black uppercase tracking-widest animate-pulse">
        Generating Cloud Reports...
     </div>
  );

  const stats = data.stats;
  const historicalData = data.historicalData;
  const maxVal = Math.max(...historicalData.map((d: any) => d.value));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Farm Analytics" activeScreen="analytics" setScreen={setScreen} />
      
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 scrollbar-hide">
        {/* Header with Export */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-headline font-black text-primary tracking-tight">Performance Summary</h2>
            <p className="text-on-surface-variant font-medium">Detailed insights into your farm's seasonal performance.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold uppercase tracking-widest text-primary hover:bg-surface-container-highest transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest p-6 rounded-3xl border border-emerald-900/5 shadow-sm"
            >
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-black text-primary">{stat.value}</span>
              </div>
              <div className={cn(
                "mt-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                stat.trending === 'up' ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
              )}>
                {stat.trending === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-[2.5rem] border border-emerald-900/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                <Timeline className="w-6 h-6" />
                Yield Trend (6 Months)
              </h3>
              <div className="flex gap-2">
                {['D', 'W', 'M', 'Y'].map(t => (
                  <button key={t} className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors",
                    t === 'M' ? "bg-primary text-white" : "text-on-surface-variant hover:bg-emerald-100"
                  )}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-4 mt-8 px-4">
              {historicalData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full group">
                  <div className="w-full bg-surface-container-highest rounded-2xl flex items-end justify-center relative overflow-hidden flex-1 group-hover:bg-emerald-100 transition-colors">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.value / maxVal) * 100}%` }}
                      transition={{ delay: i * 0.1 }}
                      className="w-full signature-gradient rounded-t-2xl relative"
                    >
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                        <span className="text-[10px] font-black text-primary">{item.value}%</span>
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side insights */}
          <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <ShowChart className="w-6 h-6 text-emerald-300" />
                  <h3 className="text-2xl font-headline font-bold">AI Prediction</h3>
                </div>
                <p className="text-lg text-emerald-50 leading-relaxed mb-8">
                  Based on current weather patterns, we expect a 15% increase in harvesting efficiency next month.
                </p>
                
                <div className="space-y-4">
                  {[
                    { label: 'Forecast Accuracy', val: '98.2%' },
                    { label: 'Data Points', val: '12,420' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{item.label}</span>
                      <span className="text-sm font-black text-white">{item.val}</span>
                    </div>
                  ))}
                </div>
             </div>
             <button className="relative z-10 mt-8 w-full py-4 bg-white text-primary rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-50 transition-colors">
               Deep Analysis Tool
             </button>
             <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-400 opacity-20 rounded-full blur-[80px]"></div>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-emerald-900/5 flex flex-col">
            <h3 className="text-xl font-headline font-bold text-primary mb-6 flex items-center gap-3">
              <BarChart className="w-5 h-5" />
              Resource Distribution
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Water Usage', val: 78, color: 'from-blue-400 to-blue-600' },
                { label: 'Fertilizer Optimization', val: 92, color: 'from-emerald-400 to-emerald-600' },
                { label: 'Energy Consumption', val: 45, color: 'from-amber-400 to-amber-600' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-emerald-900/5">
             <h3 className="text-xl font-headline font-bold text-primary mb-6">Efficiency Alerts</h3>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="text-emerald-700 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-900">Reduced Water Waste</p>
                    <p className="text-[10px] text-emerald-700 font-medium">Smart irrigation saved 2,100L this week.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <TrendingDown className="text-amber-700 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-900">NPK Usage Elevated</p>
                    <p className="text-[10px] text-amber-700 font-medium">Sector B used 4% more nitrogen than average.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
