import React, { useState } from 'react';
import { FTWUnit, WaterMetrics } from '../types';
import MaterialIcon from '../components/MaterialIcon';

interface DatabaseViewProps {
  ftwUnits: FTWUnit[];
  metrics: WaterMetrics;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({ ftwUnits, metrics }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Generate 10 detailed IoT Sensor Probe records for the table
  const sensorDatabaseRecords = [
    { id: 'SNS-SG-01', type: 'Probe pH Glass Electrode', unit: 'FTW-01', location: 'Zona Inflow Utara', value: `${metrics.pH} pH`, lastUpdate: '10 detik yang lalu', status: 'Active', battery: '98%' },
    { id: 'SNS-SG-02', type: 'Probe DO Optical Luminescent', unit: 'FTW-01', location: 'Zona Inflow Utara', value: `${metrics.DO} mg/L`, lastUpdate: '10 detik yang lalu', status: 'Active', battery: '98%' },
    { id: 'SNS-SG-03', type: 'Probe Turbidity Infrared', unit: 'FTW-01', location: 'Zona Inflow Utara', value: `${metrics.turbidity} NTU`, lastUpdate: '10 detik yang lalu', status: 'Active', battery: '98%' },
    { id: 'SNS-SG-04', type: 'Probe Temp PT100', unit: 'FTW-01', location: 'Zona Inflow Utara', value: `${metrics.temperature} °C`, lastUpdate: '10 detik yang lalu', status: 'Active', battery: '98%' },
    { id: 'SNS-SG-05', type: 'Probe DO Optical Luminescent', unit: 'FTW-02', location: 'Zona Bio-Filtrasi Tengah', value: '5.90 mg/L', lastUpdate: '12 detik yang lalu', status: 'Warning', battery: '74%' },
    { id: 'SNS-SG-06', type: 'Probe Nitrate Ion-Selective', unit: 'FTW-02', location: 'Zona Bio-Filtrasi Tengah', value: '1.85 mg/L', lastUpdate: '12 detik yang lalu', status: 'Active', battery: '74%' },
    { id: 'SNS-SG-07', type: 'Probe Phosphate Photometric', unit: 'FTW-02', location: 'Zona Bio-Filtrasi Tengah', value: '0.26 mg/L', lastUpdate: '12 detik yang lalu', status: 'Active', battery: '74%' },
    { id: 'SNS-SG-08', type: 'Probe pH Glass Electrode', unit: 'FTW-03', location: 'Zona Outlet Danau', value: '7.40 pH', lastUpdate: '8 detik yang lalu', status: 'Active', battery: '91%' },
    { id: 'SNS-SG-09', type: 'Probe DO Optical Luminescent', unit: 'FTW-03', location: 'Zona Outlet Danau', value: '7.10 mg/L', lastUpdate: '8 detik yang lalu', status: 'Active', battery: '91%' },
    { id: 'SNS-SG-10', type: 'ESP32 IoT Gateway Microcontroller', unit: 'FTW-01', location: 'Kotak Kontrol Dermaga', value: 'MQTT Connected', lastUpdate: '5 detik yang lalu', status: 'Active', battery: '98%' },
  ];

  const filteredRecords = sensorDatabaseRecords.filter((rec) => {
    const matchesSearch =
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.unit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || rec.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Sensor ID', 'Jenis Probe', 'Unit FTW', 'Lokasi', 'Nilai Terakhir', 'Update', 'Status', 'Baterai'];
    const rows = filteredRecords.map((r) => [r.id, r.type, r.unit, r.location, r.value, r.lastUpdate, r.status, r.battery]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecolake_iot_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Database Explorer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-6 rounded-2xl shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <MaterialIcon name="database" className="text-teal-400 text-sm" />
                Client-Side IoT Database
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Eksplorasi Telemetri Sensor & Log Perangkat
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Pencarian data historis sensor, audit log pengiriman data MQTT ESP32, dan ekspor dataset CSV.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MaterialIcon name="download" className="text-base" />
            <span>Ekspor Dataset CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID sensor, jenis probe, atau lokasi..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 pl-9"
          />
          <MaterialIcon name="search" className="absolute left-3 top-2.5 text-slate-400 text-base pointer-events-none" />
        </div>

        {/* Status Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'all' ? 'bg-white font-bold text-teal-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'active' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('warning')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'warning' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Warning
          </button>
        </div>
      </div>

      {/* Telemetry Database Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3.5">ID Sensor</th>
                <th className="p-3.5">Jenis Probe / Perangkat</th>
                <th className="p-3.5">Unit FTW</th>
                <th className="p-3.5">Lokasi Danau</th>
                <th className="p-3.5">Nilai Terakhir</th>
                <th className="p-3.5">Update Telemetri</th>
                <th className="p-3.5">Status Power</th>
                <th className="p-3.5">Status Sensor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-teal-50/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{r.id}</td>
                  <td className="p-3.5 text-slate-700">{r.type}</td>
                  <td className="p-3.5">
                    <span className="font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      {r.unit}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{r.location}</td>
                  <td className="p-3.5 font-bold text-slate-900">{r.value}</td>
                  <td className="p-3.5 text-slate-500">{r.lastUpdate}</td>
                  <td className="p-3.5 text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <MaterialIcon name="battery_full" className="text-emerald-500 text-sm" />
                      {r.battery}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-between flex justify-between items-center">
          <span>Menampilkan {filteredRecords.length} dari 10 Perangkat Sensor</span>
          <span>Protokol Transmisi: MQTT / JSON Telemetry</span>
        </div>
      </div>

    </div>
  );
};

export default DatabaseView;
