import React from 'react';
import { WaterMetrics } from '../types';
import MaterialIcon from './MaterialIcon';

interface CriticalAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: WaterMetrics;
}

const CriticalAlertModal: React.FC<CriticalAlertModalProps> = ({ isOpen, onClose, metrics }) => {
  if (!isOpen) return null;

  const parameters = [
    { label: 'pH', value: metrics.pH.toFixed(2), unit: '', safeRange: '6.5 – 8.5', isCritical: metrics.pH < 6.5 || metrics.pH > 8.5 },
    { label: 'DO', value: metrics.DO.toFixed(2), unit: 'mg/L', safeRange: '> 5.0', isCritical: metrics.DO < 5.0 },
    { label: 'Temperature', value: metrics.temperature.toFixed(1), unit: '°C', safeRange: '20 – 30', isCritical: metrics.temperature < 20 || metrics.temperature > 30 },
    { label: 'Turbidity', value: metrics.turbidity.toFixed(1), unit: 'NTU', safeRange: '< 25', isCritical: metrics.turbidity > 25 },
    { label: 'TDS', value: metrics.tds.toString(), unit: 'mg/L', safeRange: '< 500', isCritical: metrics.tds > 500 },
  ];

  const criticalCount = parameters.filter(p => p.isCritical).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Animated red overlay */}
      <div
        className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm animate-pulse"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with pulsing red */}
        <div className="relative bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 text-white p-6 text-center overflow-hidden">
          {/* Animated background circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/30 rounded-full animate-ping" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-500/20 rounded-full animate-pulse" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/25 shadow-lg">
              <MaterialIcon name="warning" className="text-4xl text-amber-300 animate-bounce" />
            </div>
            <h2 className="text-xl font-extrabold uppercase tracking-wider">BAHAYA</h2>
            <p className="text-rose-200 text-xs mt-1 font-semibold">Kualitas Air Situ Gede dalam Kondisi Kritis</p>
          </div>
        </div>

        {/* Alert summary */}
        <div className="p-5 space-y-4">
          {/* Critical count badge */}
          <div className="flex items-center justify-center gap-2">
            <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs font-extrabold px-3 py-1.5 rounded-full">
              {criticalCount} dari {parameters.length} Parameter di Luar Baku Mutu
            </span>
          </div>

          {/* Warning message */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <MaterialIcon name="priority_high" className="text-amber-600 text-lg shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800">Peringatan Sistem</p>
                <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                  Kondisi air terdeteksi membahayakan ekosistem danau. Segera lakukan inspeksi FTW & koordinasi dengan tim lapangan.
                </p>
              </div>
            </div>
          </div>

          {/* Parameter list */}
          <div className="space-y-2">
            {parameters.map((p) => (
              <div
                key={p.label}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  p.isCritical ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${p.isCritical ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span>{p.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold">{p.value} {p.unit}</span>
                  <span className="block text-[10px] opacity-70">Baku: {p.safeRange}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              <MaterialIcon name="visibility_off" className="text-base" />
              Sembunyikan
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98]"
            >
              <MaterialIcon name="notification_important" className="text-base" />
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertModal;