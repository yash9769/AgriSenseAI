import React from 'react';
import { CheckCircle, BarChart, Analytics, Psychology, GridView, Coronavirus, Waves, Medication, Bolt, Shield, Spa, Download } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface AnalysisScreenProps {
  setScreen: (s: Screen) => void;
  image: string | null;
  result: {
    disease: string;
    crop: string;
    confidence: number;
    pathogen: string;
    risk_level: string;
    reasoning: string[];
    treatment: string[];
    prevention: string[];
    // --- Soft Computing/PGM Fields ---
    fuzzy?: { label: string; description: string; level: string; color: string };
    uncertainty?: { flag: boolean; message: string; tier: string };
    top3?: { label: string; score: number; pct: string }[];
    symptomGraph?: { symptom: string; weight: number }[];
    inferenceMode?: string;
  } | null;
}

export const AnalysisScreen = ({ setScreen, image, result }: AnalysisScreenProps) => {
  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-pulse">
            <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Analytics className="w-8 h-8 text-emerald-800" />
            </div>
            <p className="text-on-surface-variant font-headline font-bold">No analysis data found.</p>
            <button 
                onClick={() => setScreen('crop-health')}
                className="mt-4 text-primary font-bold hover:underline"
            >
                Go back to upload
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Diagnosis Result" setScreen={setScreen} />
      
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 scrollbar-hide">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 relative group overflow-hidden rounded-3xl bg-surface-container-low aspect-video lg:aspect-auto h-full min-h-[400px]">
            <img 
              className="absolute inset-0 w-full h-full object-cover" 
              src={image || "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=1200"} 
              alt="Analyzed crop" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 glass-panel rounded-full text-[10px] font-bold uppercase tracking-widest text-primary border border-white/20">Analysis Target</span>
              </div>
              <h1 className="text-3xl font-headline font-extrabold text-white leading-tight">{result.crop}</h1>
              <p className="text-emerald-50/80 text-sm max-w-md">AgriSense Hybrid AI identified the following health patterns in your crop.</p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-emerald-900/5 flex flex-col justify-between flex-1 relative overflow-hidden shadow-sm">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-tertiary-container/10 rounded-full blur-3xl"></div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Primary Diagnosis</span>
                <h2 className="text-4xl font-headline font-bold text-primary mb-1">{result.disease}</h2>
                <p className="text-on-surface-variant text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-800" fill />
                  AI Verified Identification
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center relative py-10">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-container-low" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                    <motion.circle 
                      initial={{ strokeDashoffset: 552.92 }}
                      animate={{ strokeDashoffset: 552.92 - (552.92 * result.confidence / 100) }}
                      className="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeWidth="12"
                    ></motion.circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-headline font-black text-primary">{result.confidence}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Confidence</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                <div className="flex flex-col">
                  <span className="text-xs text-on-surface-variant">Pathogen</span>
                  <span className="font-bold text-sm">{result.pathogen}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-on-surface-variant">Risk Level</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    result.risk_level.toLowerCase() === 'critical' ? "bg-error-container text-on-error-container" : "bg-warning-container text-on-warning-container"
                  )}>
                    {result.risk_level}
                  </span>
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
              Impact Summary
            </h3>
            <div className="space-y-6">
                <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                        The detected <strong>{result.disease}</strong> is currently at a <strong>{result.risk_level}</strong> risk level. {result.reasoning[0] || 'Strategic response suggested.'}
                    </p>
                </div>
                {result.fuzzy && (
                  <div className={cn(
                    "p-4 rounded-2xl border flex flex-col gap-1",
                    result.fuzzy.level === 'high' ? "bg-emerald-50 border-emerald-100" :
                    result.fuzzy.level === 'medium' ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"
                  )}>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">
                      <span>Fuzzy Logic Label</span>
                      <Psychology className="w-3 h-3" />
                    </div>
                    <p className="font-bold text-sm">{result.fuzzy.label} CONFIDENCE</p>
                    <p className="text-xs opacity-80">{result.fuzzy.description}</p>
                  </div>
                )}
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-3xl md:col-span-2">
            <h3 className="text-lg font-headline font-bold mb-6 flex items-center gap-2 text-primary">
              <Psychology className="w-5 h-5" />
              Advanced Reasoning Engine
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 h-full">
              {/* Top-3 Probabilistic Reasoning */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-emerald-900/5 flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Probabilistic Top-3 (PGM)</span>
                <div className="space-y-4 flex-1 justify-center flex flex-col">
                  {(result.top3 || []).map((p, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="truncate">{p.label}</span>
                        <span>{p.pct}</span>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: p.pct }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                  {(!result.top3 || result.top3.length === 0) && (
                    <p className="text-xs italic text-on-surface-variant">Model diagnostics stabilizing...</p>
                  )}
                </div>
              </div>

              {/* Symptom Graph */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-emerald-900/5 flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Symptom-Disease Graph Edges</span>
                <div className="space-y-3">
                  {(result.symptomGraph || []).slice(0, 4).map((edge, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0"></div>
                      <span className="text-xs font-medium capitalize flex-1">{edge.symptom}</span>
                      <span className="text-[10px] font-bold text-primary/60">w={edge.weight.toFixed(2)}</span>
                    </div>
                  ))}
                  {(!result.symptomGraph || result.symptomGraph.length === 0) && (
                    <p className="text-xs italic text-on-surface-variant">Mapping visual symptoms to Bayesian node graph...</p>
                  )}
                </div>
              </div>

              {/* LLM Reasoning (if available) */}
              {result.reasoning && result.reasoning.length > 0 && (
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-emerald-900/5 flex flex-col col-span-1 sm:col-span-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Model Reasoning (Gemini Hybrid Tier)</span>
                  <div className="space-y-2">
                    {result.reasoning.map((r, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <p className="text-xs text-on-surface-variant leading-relaxed">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Uncertainty & Fallback Logic (Visible if uncertainty is high) */}
        {result.uncertainty?.flag && (
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 items-center"
           >
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                <Bolt className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Uncertainty Warning</h4>
                <p className="text-xs text-amber-800 leading-relaxed">{result.uncertainty.message}</p>
              </div>
              <div className="ml-auto">
                 <span className="text-[9px] font-black bg-amber-900 text-white px-2 py-0.5 rounded-full uppercase italic">Soft Computing Tier: {result.uncertainty.tier}</span>
              </div>
           </motion.div>
        )}

        {/* Prescription Strategy */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-2xl font-headline font-extrabold tracking-tight">Prescription Strategy</h3>
            <div className="hidden sm:block h-[1px] flex-1 mx-8 bg-outline-variant/20"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-emerald-900/5 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                  <Bolt className="text-error w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-headline font-bold">Immediate Response</h4>
                  <p className="text-on-surface-variant text-sm">Required as soon as possible</p>
                </div>
              </div>
              <ul className="space-y-4">
                {result.treatment.map((text, i) => (
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
                {result.prevention.map((text, i) => (
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
