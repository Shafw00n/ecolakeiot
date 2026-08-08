import React, { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import MaterialIcon from '../components/MaterialIcon';
import LakeMap from '../components/LakeMap';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { buildHistory, Timeframe, HistoryPoint, TERELMETRY_PARAMS } from '../data/history';

interface TrendModalProps {
  paramKey: string;
  onClose: () => void;
}

const TrendModal: React.FC<TrendModalProps> = ({ paramKey, onClose }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const param = TERELMETRY_PARAMS.find((p) => p.key === paramKey) || TERELMETRY_PARAMS[0];
  const data = useMemo(() => buildHistory(timeframe), [timeframe]);

  const metricToKey: Record<string, keyof HistoryPoint> = {
    pH: 'pH',
    DO: 'DO',
    temperature: 'temperature',
    turbidity: 'turbidity',
    tds: 'tds',
  };
  const chartKey = metricToKey[paramKey] as string;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative flex flex-col w-full sm:max-w-2xl mx-auto sm:my-6 sm:rounded-2xl bg-white border-0 sm:border border-slate-200 shadow-2xl overflow-hidden z-10 flex-1 sm:flex-none sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="shrink-0 p-4 bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${param.bg}`}>
              <MaterialIcon name={param.icon} className={`text-xl ${param.color}`} />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base truncate">Tren Historis: {param.label}</h3>
              <p className="text-xs text-slate-400">Pola perubahan parameter {param.unit && `(${param.unit})`}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95"
            aria-label="Tutup grafik"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        {/* Timeframe toggle */}
        <div className="shrink-0 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 w-fit mx-auto">
            {(['24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  timeframe === t ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t === '24h' ? '24 Jam' : t === '7d' ? '7 Hari' : '30 Hari'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={param.bar} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={param.bar} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={(point: HistoryPoint) => point[chartKey as keyof HistoryPoint] as number}
                  name={param.label}
                  stroke={param.bar}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#trendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="block text-[10px] text-slate-400 font-semibold">Max</span>
              <span className="font-extrabold text-slate-800 text-sm">
                {Math.max(...data.map((d) => d[param.key] as number)).toFixed(1)}
              </span>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl">
              <span className="block text-[10px] text-teal-500 font-semibold">Avg</span>
              <span className="font-extrabold text-teal-700 text-sm">
                {(data.reduce((a, b) => a + (b[param.key] as number), 0) / data.length).toFixed(1)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="block text-[10px] text-slate-400 font-semibold">Min</span>
              <span className="font-extrabold text-slate-800 text-sm">
                {Math.min(...data.map((d) => d[param.key] as number)).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MonitoringDashboard: React.FC = () => {
  const { waterMetrics, ftwUnits, simulationMode, setIsFTWDiagramOpen } = useApp();
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const getOverallStatus = () => {
    if (simulationMode === 'Critical' || waterMetrics.status === 'Poor' || waterMetrics.DO < 4.0) {
      return {
        label: 'Critical',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        dot: 'bg-rose-600 animate-ping',
        border: 'border-rose-200 bg-rose-50/60',
      };
    }
    if (simulationMode === 'Warning' || waterMetrics.status === 'Moderate' || waterMetrics.DO < 6.0) {
      return {
        label: 'Warning',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-500 animate-pulse',
        border: 'border-amber-200 bg-amber-50/60',
      };
    }
    return {
      label: 'Safe',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500 animate-pulse',
      border: 'border-emerald-200 bg-emerald-50/60',
    };
  };

  const status = getOverallStatus();

  // 5 parameter cards with click -> trend modal
  const params = [
    { key: 'pH', label: 'pH (Keasaman)', value: waterMetrics.pH.toFixed(2), unit: '', icon: 'water_drop', color: 'bg-sky-100 text-sky-700' },
    { key: 'DO', label: 'Oksigen Terlarut (DO)', value: waterMetrics.DO.toFixed(2), unit: 'mg/L', icon: 'air', color: 'bg-teal-100 text-teal-700' },
    { key: 'temperature', label: 'Suhu Air', value: waterMetrics.temperature.toFixed(1), unit: '°C', icon: 'thermostat', color: 'bg-emerald-100 text-emerald-700' },
    { key: 'turbidity', label: 'Kekeruhan (Turbidity)', value: waterMetrics.turbidity.toFixed(1), unit: 'NTU', icon: 'blur_on', color: 'bg-amber-100 text-amber-700' },
    { key: 'tds', label: 'Total Padatan Terlarut (TDS)', value: waterMetrics.tds.toFixed(0), unit: 'mg/L', icon: 'electric_bolt', color: 'bg-cyan-100 text-cyan-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header hero */}
      <div className="bg-[#0F766E] text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
          <svg className="w-80 h-80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Telemetri Sensor Real-time
              </span>
              <span className="text-emerald-100/80 text-xs hidden sm:inline font-medium">
                • Terakhir diperbarui: {waterMetrics.timestamp}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Monitoring Kualitas Air Danau Situ Gede
            </h1>
            <p className="text-emerald-50 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Floating Treatment Wetland (FTW) terintegrasi dengan sensor IoT real-time, peringatan otomatis, dan analisis kualitas air.
            </p>
          </div>
          <button
            onClick={() => setIsFTWDiagramOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 backdrop-blur-xs shadow-xs active:scale-95 self-start md:self-auto"
          >
            <MaterialIcon name="schema" className="text-emerald-300 text-base" />
            <span>Infografis Arsitektur FTW</span>
          </button>
        </div>
      </div>

      {/* Overall status + FTW units */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall status */}
        <div className={`rounded-2xl p-5 border ${status.border} bg-white shadow-xs`}>
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon name="shield" className="text-2xl text-slate-700" />
            <h3 className="font-extrabold text-slate-900 text-sm">Kualitas Air Keseluruhan</h3>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold border ${status.badge}`}>
            <span className={`w-3 h-3 rounded-full ${status.dot}`} />
            {status.label.toUpperCase()}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Skor WQI: <strong className="text-slate-800">{waterMetrics.wqiScore}/100</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">pH</span>
              <span className="font-bold text-slate-800">{waterMetrics.pH}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">DO</span>
              <span className="font-bold text-slate-800">{waterMetrics.DO} mg/L</span>
            </div>
          </div>
        </div>

        {/* FTW units */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MaterialIcon name="sensors" className="text-slate-700 text-2xl" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Status Stasiun FTW</h3>
                <p className="text-xs text-slate-500">Perangkat IoT, tenaga surya & sirkulasi air</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ftwUnits.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-slate-900">{u.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    u.status === 'warning' ? 'bg-amber-100 text-amber-800' : u.status === 'offline' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {u.status === 'warning' ? 'Waspada' : u.status === 'offline' ? 'Offline' : 'Aktif'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate mb-3">{u.name}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Baterai</span>
                    <span className="font-bold text-slate-800">{u.battery}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Tenaga Surya</span>
                    <span className="font-bold text-slate-800">{u.solarOutput}W</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5 parameter cards (click to open trend) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MaterialIcon name="tune" className="text-slate-700 text-xl" />
              <span>5 Parameter Sensor Utama (Klik kartu untuk grafik historis)</span>
            </h3>
            <p className="text-xs text-slate-500">Nilai diperbarui otomatis secara real-time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {params.map((p) => (
            <button
              key={p.key}
              onClick={() => setActiveMetric(p.key)}
              className="text-left bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs hover:shadow-md hover:border-teal-400 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 truncate">{p.label}</span>
                <div className={`p-1.5 rounded-lg flex items-center justify-center ${p.color}`}>
                  <MaterialIcon name={p.icon} className="text-base" />
                </div>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{p.value}</span>
                <span className="text-xs font-bold text-slate-400">{p.unit}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-3 text-[10px]">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <MaterialIcon name="show_chart" className="text-xs" /> Tren
                </span>
                <MaterialIcon name="chevron_right" className="text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map + trend chart layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col h-full">
          <LakeMap ftwUnits={ftwUnits} metrics={waterMetrics} />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="show_chart" className="text-slate-700 text-xl" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Tips</h3>
              <p className="text-xs text-slate-500">Klik kartu parameter di atas untuk membuka grafik tren historis 24 jam / 7 hari / 30 hari.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed">
            Data sensor diperbarui setiap 5 detik. Gunakan toggle simulasi di navbar (Aman / Waspada / Bahaya) untuk melihat pratinjau perubahan status dan dampaknya terhadap seluruh parameter yang dipantau.
          </div>
        </div>
      </div>

      {activeMetric && <TrendModal paramKey={activeMetric} onClose={() => setActiveMetric(null)} />}
    </div>
  );
};

export default MonitoringDashboard;