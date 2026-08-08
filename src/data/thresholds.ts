import { MetricStatus } from '../types';

export type ParamThresholdStatus = 'good' | 'warning' | 'critical';

export interface ParamThreshold {
  key: string;
  label: string;
  unit: string;
  icon: string;
  optimalRange: string;
  classify: (value: number) => ParamThresholdStatus;
}

const classifyPh = (v: number): ParamThresholdStatus => {
  if (v < 6.5 || v > 8.5) return 'critical';
  if (v < 7.0 || v > 8.0) return 'warning';
  return 'good';
};

const classifyDo = (v: number): ParamThresholdStatus => {
  if (v < 2.0) return 'critical';
  if (v < 6.0) return 'warning';
  return 'good';
};

const classifyTemp = (v: number): ParamThresholdStatus => {
  if (v < 25 || v > 32.5) return 'critical';
  if (v < 27.5 || v > 31) return 'warning';
  return 'good';
};

const classifyTurb = (v: number): ParamThresholdStatus => {
  if (v > 60) return 'critical';
  if (v > 25) return 'warning';
  return 'good';
};

const classifyTds = (v: number): ParamThresholdStatus => {
  if (v > 600) return 'critical';
  if (v > 340) return 'warning';
  return 'good';
};

export const PARAM_THRESHOLDS: ParamThreshold[] = [
  {
    key: 'pH',
    label: 'pH (Keasaman)',
    unit: '',
    icon: 'water_drop',
    optimalRange: '6.5 - 8.5',
    classify: classifyPh,
  },
  {
    key: 'DO',
    label: 'Oksigen Terlarut (DO)',
    unit: 'mg/L',
    icon: 'air',
    optimalRange: '≥ 6.0 mg/L',
    classify: classifyDo,
  },
  {
    key: 'temperature',
    label: 'Suhu Air',
    unit: '°C',
    icon: 'thermostat',
    optimalRange: '25 - 31 °C',
    classify: classifyTemp,
  },
  {
    key: 'turbidity',
    label: 'Kekeruhan (Turbidity)',
    unit: 'NTU',
    icon: 'blur_on',
    optimalRange: '≤ 25 NTU',
    classify: classifyTurb,
  },
  {
    key: 'tds',
    label: 'Total Padatan Terlarut (TDS)',
    unit: 'mg/L',
    icon: 'electric_bolt',
    optimalRange: '≤ 340 mg/L',
    classify: classifyTds,
  },
];

export const STATUS_STYLE: Record<
  ParamThresholdStatus,
  { badge: string; dot: string; border: string; bg: string; text: string; label: string }
> = {
  good: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/60',
    text: 'text-emerald-700',
    label: 'Aman',
  },
  warning: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500 animate-pulse',
    border: 'border-amber-200',
    bg: 'bg-amber-50/60',
    text: 'text-amber-700',
    label: 'Waspada',
  },
  critical: {
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    dot: 'bg-rose-600 animate-ping',
    border: 'border-rose-200',
    bg: 'bg-rose-50/60',
    text: 'text-rose-700',
    label: 'Bahaya',
  },
};

export const SIMULATION_BASE_VALUES: Record<
  MetricStatus,
  { pH: number; DO: number; temperature: number; turbidity: number; tds: number; wqi: number }
> = {
  Good: { pH: 7.2, DO: 6.5, temperature: 27.0, turbidity: 12.0, tds: 320, wqi: 88.5 },
  Warning: { pH: 8.2, DO: 3.5, temperature: 31.5, turbidity: 45.0, tds: 410, wqi: 68.4 },
  Critical: { pH: 5.2, DO: 1.8, temperature: 26.5, turbidity: 85.0, tds: 1250, wqi: 42.0 },
};