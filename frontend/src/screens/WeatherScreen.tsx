import React from 'react';
import { WbSunny, WaterDrop, Science, Thermostat, CloudUpload, Settings, Help, Bell, User, LogOut } from '../components/Icons';
import { TopBar } from '../components/TopBar';
import { type Screen } from '../components/Sidebar';

export const WeatherScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const hourly = [
    { time: '6 AM', temp: 18, icon: '🌤', rain: 10 },
    { time: '9 AM', temp: 22, icon: '☀️', rain: 0 },
    { time: '12 PM', temp: 27, icon: '☀️', rain: 0 },
    { time: '3 PM', temp: 29, icon: '⛅', rain: 20 },
    { time: '6 PM', temp: 24, icon: '🌧', rain: 65 },
    { time: '9 PM', temp: 19, icon: '🌩', rain: 80 },
  ];
  const weekly = [
    { day: 'Mon', high: 29, low: 18, icon: '☀️' },
    { day: 'Tue', high: 26, low: 17, icon: '⛅' },
    { day: 'Wed', high: 22, low: 15, icon: '🌧' },
    { day: 'Thu', high: 24, low: 16, icon: '🌤' },
    { day: 'Fri', high: 28, low: 19, icon: '☀️' },
    { day: 'Sat', high: 31, low: 20, icon: '☀️' },
    { day: 'Sun', high: 27, low: 18, icon: '⛅' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar title="Weather Forecast" setScreen={setScreen} />
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 scrollbar-hide">
        <div className="mb-6">
          <span className="text-xs font-bold text-on-tertiary-container uppercase tracking-[0.2em] mb-2 block">Live Data</span>
          <h2 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-2">Weather Forecast</h2>
          <p className="text-on-surface-variant">Field Station · Latitude 18.52°N · Updated 2 min ago</p>
        </div>

        {/* Current conditions hero */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 signature-gradient opacity-60" />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-white/70 font-semibold uppercase tracking-widest text-xs mb-2">Current Conditions</p>
                <div className="flex items-end gap-4 mb-4">
                  <span className="text-8xl font-headline font-black">27°C</span>
                  <div className="mb-3">
                    <p className="text-2xl">⛅</p>
                    <p className="text-white/80 font-semibold">Partly Cloudy</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm">Feels like 30°C · Sector A-12 Field Station</p>
              </div>
              <div className="text-right space-y-3">
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase">Humidity</p>
                  <p className="text-2xl font-bold">62%</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase">Wind</p>
                  <p className="text-2xl font-bold">14 km/h</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase">UV Index</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: WaterDrop, label: 'Rainfall', value: '12mm', sub: 'Last 24h', color: 'bg-blue-50 text-blue-800' },
              { icon: WbSunny, label: 'Sunrise', value: '6:04 AM', sub: 'Sunset 6:42 PM', color: 'bg-yellow-50 text-yellow-800' },
              { icon: Thermostat, label: 'Soil Temp', value: '22°C', sub: 'Optimal range', color: 'bg-emerald-50 text-emerald-800' },
              { icon: Science, label: 'Dew Point', value: '18°C', sub: 'Moderate', color: 'bg-purple-50 text-purple-800' },
            ].map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className={`${color} rounded-2xl p-4 flex flex-col gap-2`}>
                <Icon className="w-5 h-5" />
                <p className="text-xs font-bold uppercase tracking-tight">{label}</p>
                <p className="text-2xl font-headline font-black">{value}</p>
                <p className="text-xs opacity-70">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hourly */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-emerald-900/5">
          <h3 className="font-headline font-bold text-lg text-primary mb-6">Hourly Forecast</h3>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {hourly.map(h => (
              <div key={h.time} className="flex flex-col items-center gap-2 bg-surface-container-low rounded-2xl p-4">
                <span className="text-xs font-bold text-on-surface-variant uppercase">{h.time}</span>
                <span className="text-2xl">{h.icon}</span>
                <span className="font-headline font-black text-primary">{h.temp}°</span>
                <span className="text-xs text-blue-600 font-semibold">{h.rain}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* 7-day */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-emerald-900/5">
          <h3 className="font-headline font-bold text-lg text-primary mb-6">7-Day Outlook</h3>
          <div className="space-y-3">
            {weekly.map(d => (
              <div key={d.day} className="flex items-center justify-between py-3 border-b border-surface-container last:border-0">
                <span className="font-bold text-sm text-on-surface w-12">{d.day}</span>
                <span className="text-xl">{d.icon}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <div className="h-2 bg-surface-container rounded-full flex-1 max-w-32 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" style={{ width: `${((d.high - d.low) / 20) * 100}%` }} />
                  </div>
                  <span className="text-sm text-on-surface-variant w-10 text-right">{d.low}°</span>
                  <span className="text-sm font-bold text-primary w-10 text-right">{d.high}°</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Farming alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-yellow-800">Irrigation Advisory</p>
            <p className="text-sm text-yellow-700 mt-1">Rain expected Thursday evening (65% probability). Consider delaying irrigation Tuesday to conserve water. Optimal window: Wednesday morning.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
