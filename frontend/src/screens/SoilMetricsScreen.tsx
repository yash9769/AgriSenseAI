import React from 'react';
import { Science, WaterDrop, Thermostat } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';
import { motion } from 'motion/react';

const SOIL_DATA = [
  { sector: 'Sector A-12', crop: 'Tomato', moisture: 68, ph: 6.4, nitrogen: 82, temp: 22, status: 'Optimal' },
  { sector: 'Sector B-04', crop: 'Wheat', moisture: 45, ph: 7.1, nitrogen: 61, temp: 24, status: 'Moderate' },
  { sector: 'Sector B-05', crop: 'Potato', moisture: 72, ph: 5.9, nitrogen: 88, temp: 21, status: 'Optimal' },
  { sector: 'Sector C-01', crop: 'Corn', moisture: 34, ph: 6.8, nitrogen: 47, temp: 26, status: 'Low' },
];

const statusColor: Record<string, string> = {
  Optimal: 'bg-emerald-100 text-emerald-800',
  Moderate: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-red-100 text-red-800',
};

export const SoilMetricsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Soil Metrics" setScreen={setScreen} />
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 scrollbar-hide">
        <div className="mb-6">
          <span className="text-xs font-bold text-on-tertiary-container uppercase tracking-[0.2em] mb-2 block">Live Sensors</span>
          <h2 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-2">Soil Metrics</h2>
          <p className="text-on-surface-variant">Real-time sensor readings across all field sectors</p>
        </div>

        {/* Summary cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: WaterDrop, label: 'Avg Moisture', value: '54%', delta: '+3%', good: true },
            { icon: Science, label: 'Avg pH', value: '6.6', delta: 'Neutral', good: true },
            { icon: Thermostat, label: 'Avg Soil Temp', value: '23°C', delta: '+1°C', good: true },
            { icon: Science, label: 'Low Nitrogen Alerts', value: '1', delta: 'Sector C-01', good: false },
          ].map(({ icon: Icon, label, value, delta, good }) => (
            <div key={label} className="bg-surface-container-lowest border border-emerald-900/5 rounded-2xl p-6">
              <Icon className="w-5 h-5 text-emerald-800 mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
              <p className="text-3xl font-headline font-black text-primary">{value}</p>
              <p className={`text-xs font-semibold mt-1 ${good ? 'text-emerald-600' : 'text-red-600'}`}>{delta}</p>
            </div>
          ))}
        </section>

        {/* Sector table */}
        <section className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-emerald-900/5 shadow-sm">
          <div className="px-8 py-6 border-b border-surface-container">
            <h3 className="font-headline font-bold text-lg text-primary">Sector Readings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <th className="px-8 py-4">Sector</th>
                  <th className="px-6 py-4">Moisture</th>
                  <th className="px-6 py-4">pH</th>
                  <th className="px-6 py-4">Nitrogen</th>
                  <th className="px-6 py-4">Soil Temp</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {SOIL_DATA.map((row) => (
                  <tr key={row.sector} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-primary">{row.sector}</p>
                      <p className="text-xs text-on-surface-variant">{row.crop}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 bg-surface-container rounded-full overflow-hidden">
                          <motion.div className="h-full bg-blue-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${row.moisture}%` }} />
                        </div>
                        <span className="text-sm font-bold">{row.moisture}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-sm">{row.ph}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 bg-surface-container rounded-full overflow-hidden">
                          <motion.div className={`h-full rounded-full ${row.nitrogen > 70 ? 'bg-emerald-500' : 'bg-red-400'}`} initial={{ width: 0 }} animate={{ width: `${row.nitrogen}%` }} />
                        </div>
                        <span className="text-sm font-bold">{row.nitrogen}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-sm">{row.temp}°C</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${statusColor[row.status]}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommendation box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-emerald-800">Fertilization Recommendation</p>
            <p className="text-sm text-emerald-700 mt-1">Sector C-01 (Corn) shows nitrogen levels below optimal threshold. Apply 40kg/hectare of urea fertilizer within the next 5 days for best results.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
