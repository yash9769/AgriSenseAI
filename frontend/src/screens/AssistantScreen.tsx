import React, { useState } from 'react';
import { SmartToy, Help, WbSunny, WaterDrop, AddCircle, ImageIcon, Send, PottedPlant, Science } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const AssistantScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      text: "Hello! I am your **AgriSense Digital Agronomist**. I've analyzed your field telemetry from the last 24 hours.",
      time: '09:14 AM'
    }
  ]);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;
    
    const userMsg = { role: 'user', text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const resp = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText }),
      });

      if (!resp.ok) throw new Error("Connection failed");
      const data = await resp.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.response || "No response received", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: data.data || null
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Sorry, I'm having trouble connecting to the sensors. Please check your connection.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const triggerAction = (action: string) => {
    if (action === 'Activate Irrigation') {
      setIsIrrigating(true);
      setShowNotification("Irrigation sequence activated for Sector B-12");
      setTimeout(() => setShowNotification(null), 3000);
    } else if (action === 'Compare with Sector A') {
      setScreen('analysis');
    } else if (action === 'Schedule Manual Check') {
      setShowNotification("Manual inspection scheduled for 2:00 PM today");
      setTimeout(() => setShowNotification(null), 3000);
    }
  };
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Assistant Session" activeScreen="assistant" setScreen={setScreen} />
      
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8 max-w-4xl mx-auto w-full scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: m.role === 'assistant' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "flex items-start gap-4 max-w-[85%]",
              m.role === 'user' && "self-end flex-row-reverse"
            )}
          >
            {m.role === 'assistant' ? (
              <div className="w-10 h-10 shrink-0 rounded-full signature-gradient flex items-center justify-center shadow-sm">
                <SmartToy className="text-white w-6 h-6" fill />
              </div>
            ) : (
              <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="User" />
              </div>
            )}
            <div className={cn(
              "flex flex-col gap-2",
              m.role === 'user' && "items-end"
            )}>
              <div className={cn(
                "p-5 rounded-2xl shadow-sm bg-surface-container-lowest leading-relaxed",
                m.role === 'assistant' ? "rounded-tl-none border border-emerald-900/5" : "bg-primary text-on-primary rounded-tr-none"
              )}>
                 {m.text}
                 {m.data && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {m.data.temp && (
                      <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                          <WbSunny className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-tight opacity-60">Temperature</p>
                          <p className="text-xl font-headline font-extrabold">{m.data.temp}°C</p>
                        </div>
                      </div>
                    )}
                    {m.data.humidity && (
                      <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
                          <WaterDrop className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-tight opacity-60">Humidity</p>
                          <p className="text-xl font-headline font-extrabold">{m.data.humidity}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-semibold">{m.time}</span>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4"
          >
            <div className="w-10 h-10 shrink-0 rounded-full signature-gradient flex items-center justify-center shadow-sm animate-pulse">
              <SmartToy className="text-white w-6 h-6" fill />
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-surface-container-lowest p-5 rounded-2xl rounded-tl-none border border-emerald-900/5 shadow-sm text-on-surface-variant flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-6 bg-surface-container-low/40 backdrop-blur-md border-t border-emerald-900/5">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setScreen('crop-health')}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-emerald-900/5 rounded-full text-xs font-semibold text-emerald-900 whitespace-nowrap hover:shadow-sm transition-all"
            >
              <PottedPlant className="w-4 h-4" />
              Check crop disease
            </button>
            <button 
              onClick={() => setScreen('weather')}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-emerald-900/5 rounded-full text-xs font-semibold text-emerald-900 whitespace-nowrap hover:shadow-sm transition-all"
            >
              <WbSunny className="w-4 h-4" />
              Get weather info
            </button>
            <button 
              onClick={() => setScreen('analysis')}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-emerald-900/5 rounded-full text-xs font-semibold text-emerald-900 whitespace-nowrap hover:shadow-sm transition-all"
            >
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
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about crop diseases or upload an image..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/50 py-3"
              />
              <button 
                onClick={handleSend}
                className="ml-2 w-12 h-12 flex items-center justify-center signature-gradient text-white rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-on-surface-variant/40 font-medium">AgriSense AI can make mistakes. Consider verifying critical agricultural data.</p>
        </div>
      </div>
      {/* Simple Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm z-[100] flex items-center gap-3 border border-emerald-400/20"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {showNotification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
