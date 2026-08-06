export type UserRole = 'klh' | 'ipb' | 'ranger' | 'masyarakat';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  organization: string;
  avatar: string;
}

export type WaterStatus = 'Excellent' | 'Good' | 'Moderate' | 'Poor';
export type MetricStatus = 'Good' | 'Warning' | 'Critical';

export interface WaterMetrics {
  pH: number;
  DO: number; // Dissolved Oxygen (mg/L)
  turbidity: number; // NTU
  temperature: number; // °C
  conductivity: number; // µS/cm
  nitrate: number; // mg/L
  phosphate: number; // mg/L
  wqiScore: number; // 0-100
  status: WaterStatus;
  timestamp: string;
}

export interface MetricCardData {
  key: keyof WaterMetrics | string;
  label: string;
  value: number;
  unit: string;
  icon: string;
  status: MetricStatus;
  trend: string;
  history: number[];
  optimalRange: string;
}

export interface FTWUnit {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'warning' | 'offline';
  sensorsOnline: number;
  totalSensors: number;
  battery: number;
  solarOutput: number; // Watts
  flowRate: number; // L/min
  plantHealth: number; // %
  lastMaintenance: string;
  lat: number;
  lng: number;
  mapX: number; // % relative to map container
  mapY: number; // % relative to map container
}

export interface LakeComparisonData {
  id: string;
  name: string;
  location: string;
  areaHectares: number;
  ftwUnits: number;
  avgPh: number;
  avgDo: number;
  avgTurbidity: number;
  wqiScore: number;
  status: WaterStatus;
  activeAlerts: number;
}

export interface LaboratorySample {
  id: string;
  sampleCode: string;
  location: string;
  collectionDate: string;
  ph: number;
  do: number;
  nitrate: number;
  phosphate: number;
  turbidity: number;
  validationStatus: 'Validated' | 'Pending' | 'Flagged';
  researcher: string;
  notes: string;
}

export interface PlantSpeciesPerformance {
  id: string;
  botanicalName: string;
  commonName: string;
  nitrogenRemovalRate: number; // %
  phosphateRemovalRate: number; // %
  doEnhancement: number; // mg/L increase
  growthRateDays: number;
  healthIndex: number; // %
}

export interface RangerChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: 'water' | 'hardware' | 'plants' | 'surrounding';
}

export interface RangerReport {
  id: string;
  reporterName: string;
  location: string;
  issueType: 'Trash Accumulation' | 'Plant Damage' | 'Sensor Offline' | 'Water Discoloration' | 'Illegal Runoff' | 'Other';
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';
  timestamp: string;
  photoUrl?: string;
  coordinates: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'water_alert' | 'sensor_offline' | 'battery_low' | 'ranger_report' | 'academic_validation' | 'maintenance' | 'public_complaint';
  timestamp: string;
  read: boolean;
  severity: 'critical' | 'warning' | 'info';
  actionableLink?: string;
}

export interface PublicComplaint {
  id: string;
  reporterName: string;
  reporterPhone?: string;
  location: string;
  issueCategory: string;
  description: string;
  photoUrl?: string;
  timestamp: string;
  status: 'Baru' | 'Diproses' | 'Selesai';
}

export interface AIDecision {
  id: string;
  title: string;
  parameter: string;
  currentValue: string;
  triggerCondition: string;
  cause: string;
  recommendation: string;
  badge: 'Critical' | 'Warning' | 'Normal';
  priority: 'High' | 'Medium' | 'Low';
  targetLocation: string;
  timestamp: string;
}

export interface SystemTelemetryHistory {
  time: string;
  pH: number;
  DO: number;
  turbidity: number;
  temperature: number;
  nitrate: number;
  phosphate: number;
}
