import React, { useState } from 'react';
import {
  WaterMetrics,
  FTWUnit,
  AIDecision,
  SystemTelemetryHistory,
  MetricStatus,
} from '../types';
import MaterialIcon from '../components/MaterialIcon';
import LakeMap from '../components/LakeMap';
import AIAdvisorCard from '../components/AIAdvisorCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

interface MainDashboardViewProps {
  metrics: WaterMetrics;
  ftwUnits: FTWUnit[];
  decisions: AIDecision[];
  history: SystemTelemetryHistory[];
  simulationMode: MetricStatus;
  onOpenFTWDiagram: () => void;
  onNavigateToRoleTab: (tab: any) => void;
}

export const MainDashboardView: React.FC<MainDashboardViewProps> = ({
  metrics,
  ftwUnits,
  decisions,
  history,
  simulationMode,
  onOpenFTWDiagram,
  onNavigateToRoleTab,
}) => {
  const [chartMetric, setChartMetric] = useState<'DO' | 'pH' | 'turbidity' | 'temperature' | 'conductivity'>('DO');
  const [chartTimeframe, setChartTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [showPhonePopupAlert, setShowPhonePopupAlert] = useState(simulationMode === 'Critical');

  // Overall status classification: Aman (Green), Waspada (Yellow), Tidak Aman (Red)
  const getOverallStatus = () => {
    if (simulationMode === 'Critical' || metrics.status === 'Poor' || metrics.DO < 4.0 || metrics.pH < 6.5 || metrics.pH > 8.5) {
      return { label: 'Tidak Aman', color: 'bg-rose-500 text-white border-rose-600', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200', desc: 'Nilai parameter melebihi ambang batas baku mutu air. Diperlukan penanganan cepat.' };
    }
    if (simulationMode === 'Warning' || metrics.status === 'Moderate' || metrics.DO < 6.0 || metrics.turbidity > 20) {
      return { label: 'Waspada', color: 'bg-amber-500 text-white border-amber-600', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200', desc: 'Indikasi penurunan kualitas air terdeteksi. Tim ranger melakukan inspeksi.' };
    }
    return { label: 'Aman', color: 'bg-emerald-600 text-white border-emerald-700', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', desc: 'Kualitas air Situ Gede memenuhi kriteria baku mutu air Kelas II.' };
  };

  const currentOverall = getOverallStatus();

  // 5 Primary Parameter Cards explicitly requested
  const primaryParameters = [
    {
      id: 'pH',
      name: 'pH (Tingkat Keasaman)',
      value: metrics.pH.toFixed(1),
      unit: '',
      statusLabel: metrics.pH >= 6.5 && metrics.pH <= 8.5 ? 'Normal' : 'Tidak Normal',
      statusType: metrics.pH >= 6.5 && metrics.pH <= 8.5 ? 'Aman' : 'Waspada',
      icon: 'water_drop',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'DO',
      name: 'Dissolved Oxygen (DO)',
      value: metrics.DO.toFixed(1),
      unit: 'mg/L',
      statusLabel: metrics.DO >= 6.0 ? 'Baik' : metrics.DO >= 4.0 ? 'Waspada' : 'Rendah',
      statusType: metrics.DO >= 6.0 ? 'Aman' : metrics.DO >= 4.0 ? 'Waspada' : 'Tidak Aman',
      icon: 'air',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      id: 'temperature',
      name: 'Suhu',
      value: metrics.temperature.toFixed(1),
      unit: '°C',
      statusLabel: metrics.temperature >= 24 && metrics.temperature <= 30 ? 'Normal' : 'Tinggi',
      statusType: metrics.temperature >= 24 && metrics.temperature <= 30 ? 'Aman' : 'Waspada',
      icon: 'thermostat',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'turbidity',
      name: 'Kekeruhan (Turbidity)',
      value: metrics.turbidity.toFixed(0),
      unit: 'NTU',
      statusLabel: metrics.turbidity <= 20 ? 'Baik' : metrics.turbidity <= 35 ? 'Sedang' : 'Tinggi',
      statusType: metrics.turbidity <= 20 ? 'Aman' : metrics.turbidity <= 35 ? 'Waspada' : 'Tidak Aman',
      icon: 'blur_on',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'conductivity',
      name: 'EC / TDS',
      value: (metrics.conductivity / 1000).toFixed(2),
      unit: 'mS/cm',
      statusLabel: metrics.conductivity <= 400 ? 'Normal' : 'Tinggi',
      statusType: metrics.conductivity <= 400 ? 'Aman' : 'Waspada',
      icon: 'electric_bolt',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. System Flow Strip: Sensor FTW -> Dashboard Monitoring -> Notifikasi HP */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <MaterialIcon name="alt_route" className="text-sm text-[#0F766E]" />
          Alur Sistem Monitoring IoT Smart FTW Situ Gede
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
          {/* Step 1 */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold shadow-xs">
              <MaterialIcon name="sensors" className="text-lg" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">1. Sensor FTW IoT</h4>
              <p className="text-[11px] text-slate-500">Probe pH, DO, Suhu, NTU di pulau terapung</p>
            </div>
          </div>

          {/* Arrow Step 1 to 2 */}
          <div className="hidden md:flex absolute top-1/2 left-[32%] -translate-y-1/2 z-10 text-slate-300">
            <MaterialIcon name="chevron_right" className="text-2xl" />
          </div>

          {/* Step 2 */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold shadow-xs">
              <MaterialIcon name="dashboard" className="text-lg" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">2. Dashboard Monitoring</h4>
              <p className="text-[11px] text-slate-500">Analisis visual & grafik tren realtime</p>
            </div>
          </div>

          {/* Arrow Step 2 to 3 */}
          <div className="hidden md:flex absolute top-1/2 left-[65%] -translate-y-1/2 z-10 text-slate-300">
            <MaterialIcon name="chevron_right" className="text-2xl" />
          </div>

          {/* Step 3 */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
              <MaterialIcon name="smartphone" className="text-lg" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">3. Notifikasi HP Ranger</h4>
              <p className="text-[11px] text-slate-500">Peringatan otomatis saat status Waspada/Red</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-[#0F766E] text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
          <svg className="w-80 h-80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
          </svg>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Sensor Telemetry
              </span>
              <span className="text-emerald-100/80 text-xs hidden sm:inline font-medium">
                • Update Terakhir: {metrics.timestamp}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Monitoring Kualitas Air Situ Gede
            </h1>
            <p className="text-emerald-50 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Sistem pemantauan Floating Treatment Wetland (Smart FTW) terintegrasi dengan sensor IoT realtime dan notifikasi otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenFTWDiagram}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all backdrop-blur-xs flex items-center gap-2 shadow-xs active:scale-95"
            >
              <MaterialIcon name="schema" className="text-emerald-300 text-base" />
              <span>Infografis FTW</span>
            </button>
            <button
              onClick={() => setShowPhonePopupAlert(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <MaterialIcon name="smartphone" className="text-base" />
              <span>Simulasi Notifikasi HP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Status Card (Status Kualitas Air) + Overall Status Indicators */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <MaterialIcon name="shield" className="text-2xl text-[#0F766E]" />
              <h3 className="text-base font-extrabold text-slate-900">Status Utama Kualitas Air Danau</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Indikator agregat baku mutu air Situ Gede</p>
          </div>

          {/* Status Badge Indicator: Aman (Hijau), Waspada (Kuning), Tidak Aman (Merah) */}
          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 rounded-xl text-sm font-extrabold border shadow-xs flex items-center gap-2 ${currentOverall.badgeColor}`}>
              <span className={`w-3 h-3 rounded-full ${
                currentOverall.label === 'Aman' ? 'bg-emerald-500 animate-pulse' :
                currentOverall.label === 'Waspada' ? 'bg-amber-500 animate-bounce' : 'bg-rose-600 animate-ping'
              }`} />
              Status: {currentOverall.label}
            </span>
          </div>
        </div>

        {/* Status Breakdown Indicators Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
            currentOverall.label === 'Aman' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MaterialIcon name="check_circle" className="text-xl" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-emerald-900">1. Aman (Hijau)</h4>
              <p className="text-[11px] text-emerald-700">Semua parameter normal</p>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
            currentOverall.label === 'Waspada' ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <MaterialIcon name="warning" className="text-xl" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-amber-900">2. Waspada (Kuning)</h4>
              <p className="text-[11px] text-amber-700">Mendekati ambang batas</p>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
            currentOverall.label === 'Tidak Aman' ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <MaterialIcon name="error" className="text-xl" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-rose-900">3. Tidak Aman (Merah)</h4>
              <p className="text-[11px] text-rose-700">Melewati batas baku mutu</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Parameter Cards (pH, DO, Suhu, Kekeruhan, EC/TDS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MaterialIcon name="tune" className="text-[#0F766E] text-xl" />
              <span>5 Parameter Utama Sensor Air (Klik card untuk lihat grafik)</span>
            </h3>
            <p className="text-xs text-slate-500">Nilai sensor berubah otomatis secara realtime</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {primaryParameters.map((p) => {
            const isSelected = chartMetric === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setChartMetric(p.id as any)}
                className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 truncate">{p.name}</span>
                  <div className={`p-1.5 rounded-lg border ${p.color}`}>
                    <MaterialIcon name={p.icon} className="text-base" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{p.value}</span>
                  <span className="text-xs font-bold text-slate-400">{p.unit}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-3 text-xs">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                      p.statusType === 'Aman'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.statusType === 'Waspada'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {p.statusLabel}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-[#0F766E] font-bold flex items-center gap-0.5">
                      <MaterialIcon name="show_chart" className="text-xs" /> Aktif
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) & Historical Charts Recharts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peta Monitoring Situ Gede */}
        <div className="flex flex-col h-full">
          <LakeMap ftwUnits={ftwUnits} metrics={metrics} />
        </div>

        {/* Grafik Historis Recharts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MaterialIcon name="show_chart" className="text-[#0F766E] text-xl" />
                Grafik Historis ({chartMetric})
              </h3>
              <p className="text-xs text-slate-500">Tren perubahan telemetri parameter sensor</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={chartMetric}
                onChange={(e) => setChartMetric(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:border-[#0F766E]"
                style={{ minHeight: 44 }}
              >
                <option value="DO">DO (Oksigen Terlarut)</option>
                <option value="pH">pH (Derajat Keasaman)</option>
                <option value="temperature">Suhu (°C)</option>
                <option value="turbidity">Kekeruhan (NTU)</option>
                <option value="conductivity">EC / TDS (mS/cm)</option>
              </select>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
                {(['24h', '7d', '30d'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartTimeframe(t)}
                    className={`px-3 py-2 rounded-lg transition-all font-bold text-xs active:scale-95 ${
                      chartTimeframe === t
                        ? 'bg-[#0F766E] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t === '24h' ? '24 Jam' : t === '7d' ? '7 Hari' : '30 Hari'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recharts Component */}
          <div className="h-56 sm:h-64 lg:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
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
                  dataKey={chartMetric === 'conductivity' ? 'turbidity' : chartMetric}
                  stroke="#0F766E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Filter Aktif: <strong className="text-slate-800">{chartMetric}</strong> ({chartTimeframe === '24h' ? '24 Jam' : chartTimeframe === '7d' ? '7 Hari' : '30 Hari'})</span>
            <span className="text-[#0F766E] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Simulasi Data Realtime
            </span>
          </div>
        </div>

      </div>

      {/* Hardware FTW Status Grid Summary */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="sensors" className="text-[#0F766E] text-2xl" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Status Stasiun FTW (FTW-01, FTW-02, FTW-03)</h3>
              <p className="text-xs text-slate-500">Perangkat IoT, daya panel surya & sirkulasi air</p>
            </div>
          </div>
          <span className="text-xs text-[#0F766E] font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            3 Unit Active Islands
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ftwUnits.map((u) => (
            <div
              key={u.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all hover:border-[#0F766E]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xs text-slate-900">{u.id}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    u.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {u.status === 'warning' ? 'Waspada' : 'Aman'}
                </span>
              </div>

              <p className="text-xs font-bold text-slate-800 truncate mb-3">{u.name}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-medium">Baterai</span>
                  <span className="font-bold text-slate-800">{u.battery}%</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-medium">Solar Power</span>
                  <span className="font-bold text-slate-800">{u.solarOutput}W</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Smartphone Push Notification Overlay / Modal */}
      {showPhonePopupAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setShowPhonePopupAlert(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>

            {/* Smartphone Header Simulation */}
            <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
              <MaterialIcon name="smartphone" className="text-emerald-400 text-lg" />
              <span>Simulasi Push Notifikasi HP Ranger</span>
            </div>

            {/* Notification Bubble */}
            <div className="bg-rose-950/80 border border-rose-500/50 rounded-2xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md animate-bounce">
                  <MaterialIcon name="warning" className="text-2xl" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300">Peringatan Kualitas Air</span>
                    <span className="text-[10px] text-slate-400">Baru Saja</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white mt-1">
                    DO Turun Menjadi {metrics.DO.toFixed(1)} mg/L
                  </h4>
                  <div className="mt-2 text-xs text-rose-200 space-y-1">
                    <p>• Status: <strong className="text-white uppercase font-black">Tidak Aman</strong></p>
                    <p>• Lokasi: <strong>FTW-02 Dermaga Tengah</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-4">
              Notifikasi otomatis dikirimkan ke aplikasi Ranger & Dashboard Pengawas saat baku mutu terlampaui.
            </p>

            <button
              onClick={() => setShowPhonePopupAlert(false)}
              className="w-full mt-4 py-2.5 bg-[#0F766E] hover:bg-[#0d6760] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MainDashboardView;
