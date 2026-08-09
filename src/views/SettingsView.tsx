import React, { useState } from 'react';
import MaterialIcon from '../components/MaterialIcon';

export const SettingsView: React.FC = () => {
  const [telemetryInterval, setTelemetryInterval] = useState('5');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Settings Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-6 rounded-2xl shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center">
            <MaterialIcon name="settings" className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Pengaturan System Telemetri</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              Konfigurasi Frekuensi Telemetri ESP32
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <MaterialIcon name="check_circle" className="text-emerald-600 text-lg" />
          <span>Pengaturan sistem berhasil diperbarui!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Card 1: Telemetry Interval */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <MaterialIcon name="tune" className="text-teal-600 text-xl" />
            <span>Frekuensi Sinkronisasi Telemetri IoT</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: '5 Detik (Realtime)', val: '5' },
              { label: '15 Detik (Normal)', val: '15' },
              { label: '30 Detik (Hemat Daya)', val: '30' },
              { label: '60 Detik (Low Bandwidth)', val: '60' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.val}
                onClick={() => setTelemetryInterval(opt.val)}
                className={`p-3 rounded-xl text-xs font-bold border text-center transition-all active:scale-[0.98] ${
                  telemetryInterval === opt.val
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <MaterialIcon name="save" className="text-base" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default SettingsView;
