import React, { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import MaterialIcon from '../components/MaterialIcon';
import LakeMap from '../components/LakeMap';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { buildHistory, Timeframe, HistoryPoint, TERELMETRY_PARAMS } from '../data/history';
import { MetricStatus } from '../types';
import { PARAM_THRESHOLDS, STATUS_STYLE, ParamThresholdStatus } from '../data/thresholds';

interface TrendModalProps {
  paramKey: string;
  mode: MetricStatus;
  onClose: () => void;
}

const TrendModal: React.FC<TrendModalProps> = ({ paramKey, mode, onClose }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const param = TERELMETRY_PARAMS.find((p) => p.key === paramKey) || TERELMETRY_PARAMS[0];
  const data = useMemo(() => buildHistory(timeframe, mode), [timeframe, mode]);

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
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const getOverallStatus = () => {
    if (simulationMode === 'Critical') {
      return {
        label: 'Bahaya',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        dot: 'bg-rose-600 animate-ping',
        border: 'border-rose-200 bg-rose-50/60',
      };
    }
    if (simulationMode === 'Warning') {
      return {
        label: 'Waspada',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-500 animate-pulse',
        border: 'border-amber-200 bg-amber-50/60',
      };
    }
    return {
      label: 'Aman',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500 animate-pulse',
      border: 'border-emerald-200 bg-emerald-50/60',
    };
  };

  const status = getOverallStatus();

  // 5 parameter cards with click -> trend modal
  const paramValues: Record<string, number> = {
    pH: waterMetrics.pH,
    DO: waterMetrics.DO,
    temperature: waterMetrics.temperature,
    turbidity: waterMetrics.turbidity,
    tds: waterMetrics.tds,
  };

  const params = PARAM_THRESHOLDS.map((th) => {
    const value = paramValues[th.key];
    const modeStatus: ParamThresholdStatus =
      simulationMode === 'Critical'
        ? 'critical'
        : simulationMode === 'Warning'
        ? 'warning'
        : 'good';
    const decimals = th.key === 'pH' || th.key === 'DO' ? 2 : th.key === 'tds' ? 0 : 1;
    const shortLabel =
      th.key === 'pH'
        ? 'pH'
        : th.key === 'DO'
        ? 'DO'
        : th.key === 'temperature'
        ? 'Temperature'
        : th.key === 'turbidity'
        ? 'Turbidity'
        : 'TDS';
    return {
      key: th.key,
      label: th.label,
      shortLabel,
      value: value.toFixed(decimals),
      unit: th.unit,
      icon: th.icon,
      status: modeStatus,
      style: STATUS_STYLE[modeStatus],
      optimalRange: th.optimalRange,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header hero */}
      <div className={`text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden transition-colors ${
        simulationMode === 'Critical'
          ? 'bg-gradient-to-r from-rose-950 via-rose-800 to-rose-600'
          : simulationMode === 'Warning'
          ? 'bg-gradient-to-r from-amber-900 via-amber-700 to-amber-500'
          : 'bg-[#0F766E]'
      }`}>
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
          <svg className="w-80 h-80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-2 border ${
                simulationMode === 'Critical'
                  ? 'bg-white/15 text-rose-100 border-rose-200/40'
                  : simulationMode === 'Warning'
                  ? 'bg-white/15 text-amber-100 border-amber-200/40'
                  : 'bg-emerald-900/60 text-emerald-200 border-emerald-400/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  simulationMode === 'Critical' ? 'bg-rose-300 animate-ping' : 'bg-emerald-400 animate-ping'
                }`} />
                {simulationMode === 'Critical'
                  ? 'DARURAT - Kualitas Air Bahaya'
                  : simulationMode === 'Warning'
                  ? 'Peringatan - Kualitas Air Waspada'
                  : 'Telemetri Sensor Real-time'}
              </span>
              <span className="text-white/80 text-xs hidden sm:inline font-medium">
                • Terakhir diperbarui: {waterMetrics.timestamp}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Monitoring Kualitas Air Danau Situ Gede
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Floating Treatment Wetland (FTW) terintegrasi dengan sensor IoT real-time, peringatan otomatis, dan analisis kualitas air.
            </p>
          </div>
          <button
            onClick={() => setIsFTWDiagramOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 text-white text-xs font-bold rounded-xl border backdrop-blur-xs shadow-xs active:scale-95 self-start md:self-auto ${
              simulationMode === 'Critical'
                ? 'bg-white/15 hover:bg-white/25 border-white/20'
                : simulationMode === 'Warning'
                ? 'bg-white/15 hover:bg-white/25 border-white/20'
                : 'bg-white/10 hover:bg-white/20 border-white/20'
            }`}
          >
            <MaterialIcon name="schema" className="text-emerald-300 text-base" />
            <span>Infografis Arsitektur FTW</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {simulationMode === 'Warning' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50 shadow-xs animate-in fade-in slide-in-from-top-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <MaterialIcon name="warning" className="text-lg" />
          </span>
          <div className="text-xs text-amber-800 leading-relaxed space-y-1">
            <p className="font-extrabold text-amber-900">Peringatan Kualitas Air - Status: WASPADA</p>
            <p>Terjadi deviasi pada beberapa parameter (pH, DO, Suhu, Kekeruhan, TDS). Dilakukan inspeksi lapangan oleh tim Ranger dan analisis lanjutan oleh KLH & IPB.</p>
          </div>
        </div>
      )}
      {simulationMode === 'Critical' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-rose-200 bg-rose-50 shadow-md animate-in slide-in-from-top-2">
          <span className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0 animate-pulse">
            <MaterialIcon name="emergency" className="text-lg" />
          </span>
          <div className="text-xs text-rose-800 leading-relaxed space-y-1">
            <p className="font-extrabold text-rose-900">ALARM DARURAT - Kualitas Air: BAHAYA</p>
            <p>Parameter kritis terdeteksi (pH asam, DO sangat rendah, kekeruhan & TDS ekstrem). Notifikasi darurat telah dikirim ke KLH & pemangku kepentingan. Diperlukan mitigasi segera.</p>
          </div>
        </div>
      )}

      {/* Overall status + FTW units */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall status */}
        <div className={`rounded-2xl p-5 border ${status.border} bg-white shadow-xs`}>
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon name="shield" className="text-2xl text-slate-700" />
            <h3 className="font-extrabold text-slate-900 text-sm">Kualitas Air Keseluruhan</h3>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold border ${status.badge}`}>
              <span className={`w-3 h-3 rounded-full ${status.dot}`} />
              {status.label.toUpperCase()}
            </div>
            <button
              onClick={() => setShowAnalysisModal(true)}
              className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg shadow-xs transition-all active:scale-95"
            >
              <MaterialIcon name="analytics" className="text-sm" />
              <span>Detail</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Skor WQI: <strong className="text-slate-800">{waterMetrics.wqiScore}/100</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
            {params.map((p) => (
              <div key={p.key} className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${p.style.dot}`} />
                  {p.shortLabel}
                </span>
                <span className="font-bold text-slate-800">
                  {p.value} {p.unit}
                </span>
              </div>
            ))}
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
              <div key={u.id} className={`p-4 rounded-2xl border bg-slate-50/60 ${
                simulationMode === 'Critical'
                  ? 'border-rose-200'
                  : simulationMode === 'Warning'
                  ? 'border-amber-200'
                  : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-slate-900">{u.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    simulationMode === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : simulationMode === 'Warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {simulationMode === 'Critical'
                      ? 'Bahaya'
                      : simulationMode === 'Warning'
                      ? 'Waspada'
                      : 'Aktif'}
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
              className={`relative text-left bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-[0.98] ${p.style.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 truncate">{p.label}</span>
                <div className={`p-1.5 rounded-lg flex items-center justify-center ${p.style.bg} ${p.style.text}`}>
                  <MaterialIcon name={p.icon} className="text-base" />
                </div>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className={`text-2xl font-extrabold tracking-tight ${p.style.text}`}>{p.value}</span>
                <span className="text-xs font-bold text-slate-400">{p.unit}</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${p.style.badge} mt-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${p.style.dot}`} />
                {p.style.label}
              </span>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2 text-[10px]">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <MaterialIcon name="show_chart" className="text-xs" /> Tren
                </span>
                <span className="text-slate-400">{p.optimalRange}</span>
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

      {activeMetric && <TrendModal paramKey={activeMetric} mode={simulationMode} onClose={() => setActiveMetric(null)} />}

      {showAnalysisModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in p-4"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          onClick={() => setShowAnalysisModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in zoom-in duration-200 max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`px-5 py-4 border-b shrink-0 ${
              simulationMode === 'Critical'
                ? 'bg-rose-50 border-rose-200'
                : simulationMode === 'Warning'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`p-2 rounded-xl ${
                    simulationMode === 'Critical'
                      ? 'bg-rose-100 text-rose-700'
                      : simulationMode === 'Warning'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <MaterialIcon name="analytics" className="text-lg" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Analisa dan Rekomendasi Tindakan</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      simulationMode === 'Critical'
                        ? 'text-rose-600'
                        : simulationMode === 'Warning'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}>
                      {simulationMode === 'Critical' ? 'Kondisi Bahaya' : simulationMode === 'Warning' ? 'Kondisi Waspada' : 'Kondisi Aman'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="p-2 rounded-full bg-white/80 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-all shadow-xs"
                  aria-label="Tutup"
                >
                  <MaterialIcon name="close" className="text-base" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5">

              {/* Aman */}
              {simulationMode === 'Good' && (
                <>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="font-extrabold text-emerald-900 text-sm mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      KONDISI 1: AMAN
                    </h4>
                    <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                      <p>
                        <strong className="text-slate-900">Analisis Sensor:</strong> Semua nilai berada diambang batas optimal. Nilai DO yang tinggi (6.5 mg/L) menunjukkan pasokan oksigen melimpah. Kekeruhan yang rendah (12 NTU) menjamin proses fotosintesis vegetasi bawah air berjalan baik.
                      </p>
                      <div>
                        <strong className="text-slate-900">Rekomendasi Tindakan di Dashboard:</strong>
                        <ul className="mt-2 space-y-1.5 pl-4">
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-400">
                            "Kondisi air danau dalam keadaan sehat. Lanjutkan pemantauan rutin harian."
                          </li>
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-400">
                            "Sistem Smart FTW beroperasi dalam mode hemat energi (Eco-Mode)."
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Waspada */}
              {simulationMode === 'Warning' && (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-extrabold text-amber-900 text-sm mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      KONDISI 2: WASPADA
                    </h4>
                    <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                      <p>
                        <strong className="text-slate-900">Analisis Sensor:</strong> DO mulai turun (3.5 mg/L), temperatur naik, dan kekeruhan meningkat (45 NTU). Kombinasi suhu hangat dan kekeruhan ini biasanya dipicu oleh tingginya fosfat/nitrat (dari limbah detergen atau pupuk pertanian), memicu ledakan alga (<em>algae bloom</em>). Alga yang mati lalu diurai bakteri, memakan banyak oksigen (DO drop).
                      </p>
                      <div>
                        <strong className="text-slate-900">Rekomendasi Tindakan di Dashboard:</strong>
                        <ul className="mt-2 space-y-2 pl-4">
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400">
                            "Peringatan: Terjadi penurunan Oksigen Terlarut (DO) dan peningkatan kekeruhan. Terindikasi gejala awal Eutrofikasi."
                          </li>
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400">
                            <strong>Tindakan Fisik:</strong> "Aktifkan aerator tambahan (jika ada pada FTW) untuk menyuntikkan oksigen ke dalam air."
                          </li>
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400">
                            <strong>Tindakan Biologis:</strong> "Posisikan unit Smart FTW bergerak menuju area dengan kekeruhan tertinggi untuk mempercepat penyerapan zat hara (Nitrat/Fosfat) oleh akar tanaman."
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Bahaya */}
              {simulationMode === 'Critical' && (
                <>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                    <h4 className="font-extrabold text-rose-900 text-sm mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      KONDISI 3: BAHAYA
                    </h4>
                    <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                      <p>
                        <strong className="text-slate-900">Analisis Sensor:</strong> pH drop drastis menjadi sangat asam (5.2), DO kritis (1.8 mg/L), kekeruhan sangat tinggi (85 NTU), dan TDS melonjak tinggi (1250 mg/L). Ini adalah indikasi kuat masuknya limbah industri, limbah domestik masif, atau limpasan sedimen lumpur pekat. Ikan dan organisme air terancam mati massal akibat anoksia (kekurangan oksigen) dan racun keasaman.
                      </p>
                      <div>
                        <strong className="text-slate-900">Rekomendasi Tindakan di Dashboard:</strong>
                        <ul className="mt-2 space-y-2 pl-4">
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-rose-400">
                            "ALARM BAHAYA: Mutu air rusak berat. Potensi kematian massal biota danau tinggi."
                          </li>
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-rose-400">
                            <strong>Tindakan Otomatis Sistem:</strong> "Kirim notifikasi darurat (Peringatan Bahaya) via Telegram/Blynk kepada Dinas Lingkungan Hidup setempat atau pengelola danau."
                          </li>
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-rose-400">
                            <strong>Tindakan Kimia/Fisik:</strong> "Rekomendasi penaburan kapur pertanian (Kalsium Karbonat/CaCO3) di sekitar titik sensor untuk menetralkan pH yang asam."
                          </li>
                          <li className="relative before:content-[''] before:absolute before:-left-2.5 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-rose-400">
                            <strong>Tindakan Mitigasi:</strong> "Isolasi atau tutup sementara saluran masuk (inlet) air eksternal yang menuju ke danau untuk menghentikan sumber polutan."
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 shrink-0">
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard;