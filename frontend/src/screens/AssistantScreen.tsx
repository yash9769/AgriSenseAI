import React from 'react';
import { SmartToy, Help, WbSunny, WaterDrop, AddCircle, ImageIcon, Send, PottedPlant, Science } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { motion } from 'motion/react';

export const AssistantScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Assistant Session" setScreen={setScreen} />
      
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8 max-w-4xl mx-auto w-full scrollbar-hide">
        {/* AI Message */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start gap-4 max-w-[85%]"
        >
          <div className="w-10 h-10 shrink-0 rounded-full signature-gradient flex items-center justify-center shadow-sm">
            <SmartToy className="text-white w-6 h-6" fill />
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-surface-container-lowest p-5 rounded-2xl rounded-tl-none shadow-sm text-on-surface leading-relaxed">
              <p className="mb-3">Hello! I am your <strong>AgriSense Digital Agronomist</strong>. I've analyzed your field telemetry from the last 24 hours.</p>
              <p>The moisture levels in Sector B-12 are dipping slightly below optimal. Would you like a detailed soil health report or should we check for potential heat stress symptoms on your corn crops?</p>
            </div>
            <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-semibold ml-1">09:14 AM</span>
          </div>
        </motion.div>

        {/* User Message */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start gap-4 max-w-[85%] self-end flex-row-reverse"
        >
          <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="User" />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="bg-primary text-on-primary p-5 rounded-2xl rounded-tr-none shadow-sm leading-relaxed">
              <p>Show me the potential heat stress symptoms for Sector B-12. Also, check if the current weather forecast predicts any rain for tonight.</p>
            </div>
            <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-semibold mr-1">09:15 AM</span>
          </div>
        </motion.div>

        {/* AI Response with Data */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 max-w-[95%]"
        >
          <div className="w-10 h-10 shrink-0 rounded-full signature-gradient flex items-center justify-center shadow-sm">
            <SmartToy className="text-white w-6 h-6" fill />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="bg-surface-container-lowest p-6 rounded-2xl rounded-tl-none shadow-sm text-on-surface leading-relaxed">
              <div className="flex items-center gap-2 mb-4">
                <Help className="w-5 h-5 text-on-tertiary-container" />
                <h3 className="font-headline font-bold text-emerald-900">Analysis: Sector B-12</h3>
              </div>
              <p className="text-sm mb-4">I've detected early leaf curling and slight stomatal closure in your corn crops, which are classic signs of <strong>Moderate Heat Stress</strong>. Current weather data shows no rain expected tonight, with temperatures remaining above 24°C.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center">
                    <WbSunny className="w-6 h-6 text-on-tertiary-container" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tight">Soil Temp</p>
                    <p className="text-xl font-headline font-extrabold text-emerald-900">28.4°C</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-error-container flex items-center justify-center">
                    <WaterDrop className="w-6 h-6 text-on-error-container" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tight">Humidity</p>
                    <p className="text-xl font-headline font-extrabold text-emerald-900">32%</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-emerald-900/5">
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-3">Recommended Actions</p>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-900 border border-emerald-900/10 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-colors">Activate Irrigation</button>
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-900 border border-emerald-900/10 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-colors">Compare with Sector A</button>
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-900 border border-emerald-900/10 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-colors">Schedule Manual Check</button>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-semibold ml-1">09:16 AM</span>
          </div>
        </motion.div>
      </div>

      {/* Input Section */}
      <div className="p-6 bg-surface-container-low/40 backdrop-blur-md border-t border-emerald-900/5">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-emerald-900/5 rounded-full text-xs font-semibold text-emerald-900 whitespace-nowrap hover:shadow-sm transition-all">
              <PottedPlant className="w-4 h-4" />
              Check crop disease
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-emerald-900/5 rounded-full text-xs font-semibold text-emerald-900 whitespace-nowrap hover:shadow-sm transition-all">
              <WbSunny className="w-4 h-4" />
              Get weather info
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-emerald-900/5 rounded-full text-xs font-semibold text-emerald-900 whitespace-nowrap hover:shadow-sm transition-all">
              <Science className="w-4 h-4" />
              Soil health tips
            </button>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-900/5 rounded-2xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100"></div>
            <div className="relative flex items-center bg-surface-container-lowest border border-emerald-900/10 p-2 pl-4 rounded-2xl shadow-sm">
              <button className="p-2 text-on-surface-variant hover:text-emerald-900 transition-colors">
                <AddCircle className="w-6 h-6" />
              </button>
              <button className="p-2 text-on-surface-variant hover:text-emerald-900 transition-colors mr-2">
                <ImageIcon className="w-6 h-6" />
              </button>
              <input 
                type="text" 
                placeholder="Ask about crop diseases or upload an image..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/50 py-3"
              />
              <button className="ml-2 w-12 h-12 flex items-center justify-center signature-gradient text-white rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all">
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-on-surface-variant/40 font-medium">AgriSense AI can make mistakes. Consider verifying critical agricultural data.</p>
        </div>
      </div>
    </div>
  );
};
