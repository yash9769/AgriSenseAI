import React from 'react';
import { Search, ChevronRight } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { cn } from '../lib/utils';

const HISTORY_DATA = [
  { id: 1, crop: 'Tomato', sector: 'Sector A-12', disease: 'Early Blight', pathogen: 'Alternaria solani', date: 'May 24, 2024', risk: 'High', image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=200' },
  { id: 2, crop: 'Wheat', sector: 'Sector B-04', disease: 'Leaf Rust', pathogen: 'Puccinia triticina', date: 'May 22, 2024', risk: 'Medium', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200' },
  { id: 3, crop: 'Potato', sector: 'Sector B-05', disease: 'Healthy', pathogen: 'No pathogens found', date: 'May 20, 2024', risk: 'Low', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=200' },
  { id: 4, crop: 'Corn', sector: 'Sector C-01', disease: 'Gray Leaf Spot', pathogen: 'Cercospora zeae-maydis', date: 'May 18, 2024', risk: 'Medium', image: 'https://images.unsplash.com/photo-1551727041-5b347d65b633?auto=format&fit=crop&q=80&w=200' },
];

export const HistoryScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="History" setScreen={setScreen} />
      
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 scrollbar-hide">
        {/* Health Trend Chart Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-on-surface-variant font-semibold tracking-wider uppercase text-[0.65rem]">Crop Performance</span>
                  <h2 className="text-3xl font-bold font-headline text-primary mt-1">Health Trend</h2>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-medium">Last 30 Days</span>
                </div>
              </div>
              
              <div className="h-48 w-full flex items-end gap-1 px-2">
                {[40, 60, 55, 75, 45, 90, 30, 95, 65, 50, 80, 40].map((h, i) => (
                  <div 
                    key={i}
                    style={{ height: `${h}%` }}
                    className={cn(
                      "flex-1 rounded-t-lg transition-all cursor-pointer relative group",
                      h > 90 ? "bg-primary-container" : "bg-primary/10 hover:bg-primary/20"
                    )}
                  >
                    {h > 90 && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">Peak Severity</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-outline uppercase tracking-tighter">
                <span>May 01</span>
                <span>May 15</span>
                <span>May 30</span>
              </div>
            </div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-primary p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-white/70 font-semibold tracking-wider uppercase text-[0.65rem]">AI Insight</span>
              <h3 className="text-xl font-headline font-bold mt-2 leading-tight">Environmental stress detected in Sector B-4.</h3>
              <p className="text-sm text-white/80 mt-4 leading-relaxed font-light">Analysis frequency increased by 24% this week. We recommend checking the irrigation schedules for Potato crops.</p>
            </div>
            <button className="relative z-10 mt-8 py-3 bg-primary-container text-on-primary-container rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
              View Recommendations
            </button>
            <div className="absolute inset-0 signature-gradient opacity-50"></div>
          </div>
        </section>

        {/* Table Controls */}
        <section className="flex flex-col md:flex-row gap-4 items-center justify-between mt-12 mb-4">
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-full w-full md:w-auto">
            <button className="px-5 py-2 bg-surface-container-lowest text-primary rounded-full text-xs font-bold shadow-sm">All Crops</button>
            <button className="px-5 py-2 text-on-surface-variant hover:bg-surface-container-lowest/50 rounded-full text-xs font-medium transition-all">Cereal</button>
            <button className="px-5 py-2 text-on-surface-variant hover:bg-surface-container-lowest/50 rounded-full text-xs font-medium transition-all">Vegetables</button>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by crop or disease..."
              className="w-full bg-surface-container-low border-none rounded-full pl-12 pr-6 py-3 text-sm focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline/60"
            />
          </div>
        </section>

        {/* History Table */}
        <section className="bg-surface-container-lowest rounded-[2rem] shadow-sm overflow-hidden mb-20 border border-emerald-900/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-5 font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant">Crop Analysis</th>
                  <th className="px-6 py-5 font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant">Status / Disease</th>
                  <th className="px-6 py-5 font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant">Analyzed On</th>
                  <th className="px-6 py-5 font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant">Risk Level</th>
                  <th className="px-8 py-5 font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {HISTORY_DATA.map((item) => (
                  <tr key={item.id} className="group hover:bg-surface-container-low/30 transition-colors cursor-pointer" onClick={() => setScreen('analysis')}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-surface-container">
                          <img src={item.image} alt={item.crop} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <div className="font-headline font-bold text-primary">{item.crop}</div>
                          <div className="text-[0.65rem] font-bold text-outline-variant uppercase tracking-tighter">{item.sector}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-medium text-sm text-on-surface">{item.disease}</div>
                      <div className="text-[0.7rem] text-on-surface-variant/70 italic">{item.pathogen}</div>
                    </td>
                    <td className="px-6 py-6 text-sm text-on-surface-variant">{item.date}</td>
                    <td className="px-6 py-6">
                      <div className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        item.risk === 'High' ? "bg-error-container text-on-error-container" :
                        item.risk === 'Medium' ? "bg-secondary-container text-on-secondary-container" :
                        "bg-emerald-100 text-emerald-900"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full mr-2",
                          item.risk === 'High' ? "bg-error" :
                          item.risk === 'Medium' ? "bg-secondary" :
                          "bg-primary"
                        )}></span>
                        {item.risk}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-outline">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-surface-container-low/30 border-t border-surface-container flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Showing 4 of 128 analyses</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">Previous</button>
              <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">Next</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
