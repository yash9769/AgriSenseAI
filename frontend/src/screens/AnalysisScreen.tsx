import React from 'react';
import { CheckCircle, BarChart, Psychology, GridView, Coronavirus, Waves, Medication, Bolt, Shield, Spa, Download } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const AnalysisScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Diagnosis Result" setScreen={setScreen} />
      
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 scrollbar-hide">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 relative group overflow-hidden rounded-3xl bg-surface-container-low aspect-video lg:aspect-auto h-full min-h-[400px]">
            <img 
              className="absolute inset-0 w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=1200" 
              alt="Tomato leaf analysis" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 glass-panel rounded-full text-[10px] font-bold uppercase tracking-widest text-primary border border-white/20">Analysis Target</span>
              </div>
              <h1 className="text-3xl font-headline font-extrabold text-white leading-tight">Solanum lycopersicum</h1>
              <p className="text-emerald-50/80 text-sm max-w-md">Scanning completed. Pattern recognition algorithm identified structural anomalies in chlorophyll distribution.</p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-emerald-900/5 flex flex-col justify-between flex-1 relative overflow-hidden shadow-sm">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-tertiary-container/10 rounded-full blur-3xl"></div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Primary Diagnosis</span>
                <h2 className="text-4xl font-headline font-bold text-primary mb-1">Early Blight</h2>
                <p className="text-on-surface-variant text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-800" fill />
                  High Confidence Identification
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center relative py-10">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-container-low" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                    <motion.circle 
                      initial={{ strokeDashoffset: 552.92 }}
                      animate={{ strokeDashoffset: 38.7 }}
                      className="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeWidth="12"
                    ></motion.circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-headline font-black text-primary">93%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Match</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                <div className="flex flex-col">
                  <span className="text-xs text-on-surface-variant">Pathogen</span>
                  <span className="font-bold text-sm">Alternaria solani</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-on-surface-variant">Risk Level</span>
                  <span className="px-2 py-0.5 bg-error-container text-on-error-container rounded-full text-[10px] font-bold uppercase">Critical</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Probability & Reasoning Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col">
            <h3 className="text-lg font-headline font-bold mb-6 flex items-center gap-2 text-primary">
              <BarChart className="w-5 h-5" />
              Probability Distribution
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Early Blight', val: 93 },
                { label: 'Septoria Leaf Spot', val: 4.2 },
                { label: 'Target Spot', val: 2.8 },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      className={cn("h-full", item.val > 50 ? "bg-primary" : "bg-primary/30")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-3xl md:col-span-2">
            <h3 className="text-lg font-headline font-bold mb-6 flex items-center gap-2 text-primary">
              <Psychology className="w-5 h-5" />
              AI Reasoning Flow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/30 -translate-y-1/2 z-0"></div>
              {[
                { icon: GridView, label: 'Detected Pattern', desc: 'Concentric rings on lower leaves' },
                { icon: Coronavirus, label: 'Disease', desc: 'Early Blight Fungal infection' },
                { icon: Waves, label: 'Cause', desc: 'Excessive soil moisture & humidity' },
                { icon: Medication, label: 'Action', desc: 'Copper-based fungicide application' },
              ].map((step, i) => (
                <div key={i} className="bg-surface-container-lowest p-4 rounded-2xl relative z-10 flex flex-col items-center text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                    <step.icon className="text-primary w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">{step.label}</span>
                  <p className="text-xs mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prescription Strategy */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-2xl font-headline font-extrabold tracking-tight">Prescription Strategy</h3>
            <div className="hidden sm:block h-[1px] flex-1 mx-8 bg-outline-variant/20"></div>
            <button
              type="button"
              onClick={() => {
                const now = new Date().toLocaleString();
                window.alert(`📄 Preparing PDF report for Early Blight diagnosis...\n\nGenerated at: ${now}\n\nIn production this will download a full report with treatment plan, probability distribution, and field metadata.`);
              }}
              className="text-primary text-sm font-bold flex items-center gap-1 hover:underline active:scale-95 transition-transform"
            >
              Download PDF Report
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-emerald-900/5 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                  <Bolt className="text-error w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-headline font-bold">Immediate Response</h4>
                  <p className="text-on-surface-variant text-sm">Required within 24-48 hours</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'Prune and destroy infected leaves showing concentric lesions to prevent spore dispersal.',
                  'Apply a Chlorothalonil or Copper-based fungicide as per local safety guidelines.',
                  'Avoid overhead watering immediately to keep foliage dry.'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{i+1}</div>
                    <p className="text-sm text-on-surface leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-emerald-900/5 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-800/10 flex items-center justify-center">
                  <Shield className="text-emerald-800 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-headline font-bold">Long-term Prevention</h4>
                  <p className="text-on-surface-variant text-sm">Strategic field management</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'Increase spacing between plants to improve airflow and reduce microclimate humidity.',
                  'Implement a 3-year crop rotation cycle, avoiding nightshade family members (potatoes, peppers).',
                  'Mulch soil surfaces to prevent soil-borne spores from splashing onto lower leaves during rain.'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-800">
                      <Spa className="w-4 h-4" fill />
                    </div>
                    <p className="text-sm text-on-surface leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
