import React, { useState, useRef } from 'react';
import { SmartToy, Help, WbSunny, AddCircle, ImageIcon, Send, PottedPlant, Science } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { motion, AnimatePresence } from 'motion/react';

interface Message { id: number; role: 'ai' | 'user'; text: string; time: string; }

const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const getAIReply = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes('crop disease') || lower.includes('check crop')) return "For disease detection, upload a clear photo of the affected leaf via the **Crop Health** tab. Our AI pipeline will analyze it and provide a diagnosis with treatment steps. 🌿";
  if (lower.includes('weather')) return "Current: ⛅ 27°C, 62% humidity. No rain tonight — temperatures above 24°C. Check the **Weather** screen for the full 7-day forecast.";
  if (lower.includes('soil')) return "🌱 Sector A-12 (Tomato): Optimal. Sector B-04 (Wheat): Moderate nitrogen. Sector C-01 (Corn): ⚠️ Nitrogen below threshold — apply 40kg/ha urea within 5 days. See **Soil Metrics** for details.";
  if (lower.includes('irrigat') || lower.includes('water')) return "Sector B-12 moisture is at 45% — below optimal 55-70%. Recommend a 30-min irrigation cycle this evening. Soil temp 22°C is ideal for water absorption.";
  if (lower.includes('disease') || lower.includes('blight') || lower.includes('rust')) return "Upload a clear photo of the affected leaf via **Crop Health** for precise diagnosis. Common signs of blight: dark spots with yellow halos. For rust: orange-brown pustules on leaves.";
  return "I understand your concern. Based on current telemetry, all sectors are within normal parameters. Could you provide more details so I can give a targeted recommendation? 🌱";
};

export const AssistantScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1, role: 'ai', time: '09:14 AM',
    text: "Hello! I am your **AgriSense Digital Agronomist**. I've analyzed your field telemetry for the last 24 hours.\n\nMoisture in Sector B-12 is dipping below optimal. Want a soil health report or shall we check for heat stress on your corn crops?",
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: trimmed, time: now() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: getAIReply(trimmed), time: now() }]);
      setTyping(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, 900 + Math.random() * 500);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const fmt = (t: string) => t.split('**').map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>);

  const chips = [
    { label: 'Check crop disease', icon: PottedPlant },
    { label: 'Get weather info', icon: WbSunny },
    { label: 'Soil health tips', icon: Science },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Assistant Session" setScreen={setScreen} />
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 max-w-4xl mx-auto w-full scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ${msg.role === 'ai' ? 'signature-gradient' : 'bg-secondary-container'}`}>
                {msg.role === 'ai' ? <SmartToy className="text-white w-6 h-6" fill /> : <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="User" />}
              </div>
              <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`p-5 rounded-2xl shadow-sm leading-relaxed text-sm whitespace-pre-line ${msg.role === 'ai' ? 'bg-surface-container-lowest rounded-tl-none text-on-surface' : 'bg-primary text-on-primary rounded-tr-none'}`}>
                  {fmt(msg.text)}
                </div>
                <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-semibold mx-1">{msg.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 max-w-[85%]">
            <div className="w-10 h-10 shrink-0 rounded-full signature-gradient flex items-center justify-center">
              <SmartToy className="text-white w-6 h-6" fill />
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-6 bg-surface-container-low/40 backdrop-blur-md border-t border-emerald-900/5">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {chips.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => sendMessage(label)}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-emerald-900/5 rounded-full text-xs font-semibold text-emerald-900 whitespace-nowrap hover:bg-emerald-50 transition-all">
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-900/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-center bg-surface-container-lowest border border-emerald-900/10 p-2 pl-4 rounded-2xl shadow-sm gap-1">
              <button 
                onClick={() => setScreen('crop-health')} 
                className="p-2 text-on-surface-variant hover:text-emerald-900 transition-colors bg-emerald-50/50 rounded-xl mr-1 active:scale-90" 
                title="Go to crop health"
              >
                <AddCircle className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setScreen('crop-health')} 
                className="p-2 text-on-surface-variant hover:text-emerald-900 transition-colors bg-emerald-50/50 rounded-xl mr-2 active:scale-90" 
                title="Upload crop photo"
              >
                <ImageIcon className="w-6 h-6" />
              </button>
              <input type="text" placeholder="Ask about crop diseases or upload an image..."
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/50 py-3 outline-none" />
              <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                className="ml-2 w-12 h-12 flex items-center justify-center signature-gradient text-white rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
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
