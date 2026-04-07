import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Help, LogOut } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';

export const SettingsScreen = ({ setScreen, onLogout }: { setScreen: (s: Screen) => void; onLogout?: () => void }) => {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [threshold, setThreshold] = useState('0.60');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-primary' : 'bg-surface-container-highest'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Settings" setScreen={setScreen} />
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full space-y-8 scrollbar-hide">
        <div className="mb-6">
          <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-2">Settings</h2>
          <p className="text-on-surface-variant">Manage your account and app preferences</p>
        </div>

        {/* Profile section */}
        <section className="bg-surface-container-lowest rounded-2xl border border-emerald-900/5 p-6">
          <h3 className="font-headline font-bold text-base text-primary mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="User" className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100" />
            <div>
              <p className="font-bold text-on-surface">John Farmer</p>
              <p className="text-sm text-on-surface-variant">farmer@agrisense.ai</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Pro Plan · Active</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">Full Name</label>
              <input defaultValue="John Farmer" className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">Farm Location</label>
              <input defaultValue="Nashik, Maharashtra" className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>
        </section>

        {/* AI Settings */}
        <section className="bg-surface-container-lowest rounded-2xl border border-emerald-900/5 p-6">
          <h3 className="font-headline font-bold text-base text-primary mb-4 flex items-center gap-2"><Settings className="w-4 h-4" /> AI Diagnosis</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Auto-analyze on upload</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Immediately run diagnosis when an image is uploaded</p>
              </div>
              <Toggle value={autoAnalyze} onChange={() => setAutoAnalyze(p => !p)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Confidence threshold</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Min. model confidence before falling back to GPT-4o</p>
              </div>
              <select value={threshold} onChange={e => setThreshold(e.target.value)} className="bg-surface-container-low rounded-lg px-3 py-2 text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="0.50">50%</option>
                <option value="0.60">60%</option>
                <option value="0.70">70%</option>
                <option value="0.80">80%</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-surface-container-lowest rounded-2xl border border-emerald-900/5 p-6">
          <h3 className="font-headline font-bold text-base text-primary mb-4 flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>
          <div className="space-y-5">
            {[
              { label: 'Push notifications', sub: 'Get alerts for disease detections', value: notifications, set: () => setNotifications(p => !p) },
              { label: 'Email reports', sub: 'Weekly crop health summary via email', value: emailAlerts, set: () => setEmailAlerts(p => !p) },
              { label: 'Dark mode', sub: 'Switch to dark interface (coming soon)', value: darkMode, set: () => setDarkMode(p => !p) },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.sub}</p>
                </div>
                <Toggle value={item.value} onChange={item.set} />
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleSave} className="flex-1 py-3 signature-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95">
            {saved ? '✅ Settings Saved!' : 'Save Changes'}
          </button>
          <button onClick={() => { if (window.confirm('Are you sure you want to sign out?')) onLogout?.(); }} className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
