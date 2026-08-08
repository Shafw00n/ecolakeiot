import { MetricStatus } from '../types';

export interface HistoryPoint {
  time: string;
  pH: number;
  DO: number;
  temperature: number;
  turbidity: number;
  tds: number;
  nitrate: number;
  phosphate: number;
}

export type Timeframe = '24h' | '7d' | '30d';

interface ModeRange {
  base: number;
  amp: number;
}

const MODE_CONFIG: Record<MetricStatus, { pH: ModeRange; DO: ModeRange; temperature: ModeRange; turbidity: ModeRange; tds: ModeRange }> = {
  Good: {
    pH: { base: 7.2, amp: 0.35 },
    DO: { base: 6.4, amp: 0.5 },
    temperature: { base: 27, amp: 1.2 },
    turbidity: { base: 13, amp: 3 },
    tds: { base: 320, amp: 25 },
  },
  Warning: {
    pH: { base: 8.2, amp: 0.4 },
    DO: { base: 3.6, amp: 0.8 },
    temperature: { base: 31.2, amp: 1.5 },
    turbidity: { base: 44, amp: 8 },
    tds: { base: 410, amp: 40 },
  },
  Critical: {
    pH: { base: 5.2, amp: 0.5 },
    DO: { base: 1.8, amp: 0.6 },
    temperature: { base: 26.5, amp: 2.5 },
    turbidity: { base: 84, amp: 12 },
    tds: { base: 1250, amp: 120 },
  },
};

const HOUR_LABELS: Record<Timeframe, string[]> = {
  '24h': ['00:00', '06:00', '12:00', '18:00', '23:00'],
  '7d': ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  '30d': ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'],
};

export const buildHistory = (timeframe: Timeframe, mode: MetricStatus = 'Good'): HistoryPoint[] => {
  const count = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  const labels = HOUR_LABELS[timeframe];
  const cfg = MODE_CONFIG[mode];
  return Array.from({ length: count }).map((_, idx) => {
    const t = Math.sin(idx * 0.7) * 0.5 + Math.random() * 0.4;
    const points: HistoryPoint = {
      time: labels[idx % labels.length],
      pH: parseFloat((cfg.pH.base + t * cfg.pH.amp).toFixed(2)),
      DO: parseFloat((cfg.DO.base + Math.cos(idx * 0.5) * cfg.DO.amp).toFixed(2)),
      temperature: parseFloat((cfg.temperature.base + Math.sin(idx * 0.4) * 1.2).toFixed(1)),
      turbidity: parseFloat((cfg.turbidity.base + Math.sin(idx * 1.1) * (cfg.turbidity.amp / 2)).toFixed(1)),
      tds: parseFloat((cfg.tds.base + Math.sin(idx * 0.6) * (cfg.tds.amp / 2)).toFixed(0)),
      nitrate: parseFloat((1.2 + t * 0.2).toFixed(2)),
      phosphate: parseFloat((0.18 + t * 0.04).toFixed(2)),
    };
    return points;
  });
};

export const TERELMETRY_PARAMS: {
  key: keyof HistoryPoint;
  label: string;
  unit: string;
  icon: string;
  color: string;
  bg: string;
  bar: string;
  is: string;
}[] = [
  { key: 'pH', label: 'pH', unit: '', icon: 'water_drop', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', bar: '#0284c7', is: '' },
  { key: 'DO', label: 'Oksigen Terlarut (DO)', unit: 'mg/L', icon: 'air', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200', bar: '#0d9488', is: '' },
  { key: 'temperature', label: 'Suhu Air', unit: '°C', icon: 'thermostat', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', bar: '#059669', is: '' },
  { key: 'turbidity', label: 'Kekeruhan', unit: 'NTU', icon: 'blur_on', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', bar: '#d97706', is: '' },
  { key: 'tds', label: 'Total Padatan Terlarut (TDS)', unit: 'mg/L', icon: 'electric_bolt', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200', bar: '#0891b2', is: '' },
];