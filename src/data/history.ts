import { WaterMetrics } from '../types';

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

const PARAM_RANGES: Record<
  string,
  { base: number; amp: number; min: number }
> = {
  pH: { base: 7.2, amp: 0.35, min: 6.5 },
  DO: { base: 6.4, amp: 0.9, min: 3.5 },
  temperature: { base: 26, amp: 1.8, min: 22 },
  turbidity: { base: 16, amp: 5, min: 8 },
  tds: { base: 320, amp: 40, min: 280 },
  nitrate: { base: 1.2, amp: 0.3, min: 0.8 },
  phosphate: { base: 0.18, amp: 0.06, min: 0.1 },
};

const HOUR_LABELS: Record<Timeframe, string[]> = {
  '24h': ['00:00', '06:00', '12:00', '18:00', '23:00'],
  '7d': ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  '30d': ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'],
};

export const buildHistory = (timeframe: Timeframe): HistoryPoint[] => {
  const count = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  const labels = HOUR_LABELS[timeframe];
  return Array.from({ length: count }).map((_, idx) => {
    const t = Math.sin(idx * 0.7) * 0.5 + Math.random() * 0.4;
    const points: HistoryPoint = {
      time: labels[idx % labels.length],
      pH: parseFloat((PARAM_RANGES.pH.base + t * PARAM_RANGES.pH.amp).toFixed(2)),
      DO: parseFloat((PARAM_RANGES.DO.base + Math.cos(idx * 0.5) * PARAM_RANGES.DO.amp).toFixed(2)),
      temperature: parseFloat(
        (PARAM_RANGES.temperature.base + Math.sin(idx * 0.4) * 1.4).toFixed(1)
      ),
      turbidity: parseFloat(
        (PARAM_RANGES.turbidity.base + Math.sin(idx * 1.1) * 2.4).toFixed(1)
      ),
      tds: parseFloat(
        (PARAM_RANGES.tds.base + Math.sin(idx * 0.6) * 20).toFixed(0)
      ),
      nitrate: parseFloat((PARAM_RANGES.nitrate.base + t * 0.2).toFixed(2)),
      phosphate: parseFloat((PARAM_RANGES.phosphate.base + t * 0.04).toFixed(2)),
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