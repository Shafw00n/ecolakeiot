import React, { useState } from 'react';
import { FTWUnit } from '../types';
import MaterialIcon from './MaterialIcon';

interface LakeMapProps {
  ftwUnits: FTWUnit[];
  metrics?: {
    pH: number;
    DO: number;
    turbidity: number;
    temperature: number;
    tds: number;
    status: string;
  };
  onSelectUnit?: (unit: FTWUnit) => void;
}

export const LakeMap: React.FC<LakeMapProps> = ({ ftwUnits, metrics, onSelectUnit }) => {
  const [selectedUnit, setSelectedUnit] = useState<FTWUnit | null>(ftwUnits[0] || null);
  const [isCardCollapsed, setIsCardCollapsed] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<'all' | 'ftw' | 'ranger'>('all');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const rangerPosition = {
    name: 'Patroli Ranger-04 (Ahmad Fauzi)',
    location: 'Tepi Barat Daya',
    mapX: 18,
    mapY: 78,
    status: 'Active Patrol',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-[70] rounded-none border-0'
          : 'h-full'
      }`}
    >
      {/* Map Header */}
      <div className={`p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50 ${isFullscreen ? '' : ''}`}
        style={isFullscreen ? { paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' } : undefined}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
            <MaterialIcon name="map" className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Peta Interaktif Situ Gede</h3>
            <p className="text-xs text-slate-500">Sebaran Unit FTW & Tim Field Ranger</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-all active:scale-95"
            title={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
            aria-label={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
          >
            <MaterialIcon name={isFullscreen ? 'fullscreen_exit' : 'fullscreen'} className="text-lg" />
          </button>

          {/* Layer Filters */}
          <div className="flex items-center gap-0.5 bg-white p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-2 rounded-md transition-all active:scale-95 ${
                activeLayer === 'all'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveLayer('ftw')}
              className={`px-2.5 py-2 rounded-md transition-all active:scale-95 ${
                activeLayer === 'ftw'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FTW
            </button>
            <button
              onClick={() => setActiveLayer('ranger')}
              className={`px-2.5 py-2 rounded-md transition-all active:scale-95 ${
                activeLayer === 'ranger'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ranger
            </button>
          </div>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div className={`relative flex-1 min-h-[320px] bg-gradient-to-br from-sky-100 via-emerald-100/40 to-teal-100 overflow-hidden flex items-center justify-center ${isFullscreen ? 'min-h-0' : ''}`}>
        
        {/* Lake Water Vector SVG Shape */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full opacity-85 absolute inset-0 pointer-events-none"
        >
          {/* Lake Shore outline */}
          <path
            d="M 15 36 C 22.5 16, 52.5 14, 85 28 C 95 42, 93.75 76, 77.5 88 C 56.25 98, 27.5 90, 12.5 72 C 6.25 58, 10 48, 15 36 Z"
            fill="#38bdf8"
            fillOpacity="0.3"
            stroke="#0284c7"
            strokeWidth="0.6"
            strokeDasharray="2 1.2"
          />
          <path
            d="M 18.75 40 C 26.25 22, 50 20, 80 26 C 88.75 32, 87.5 58, 73.75 70 C 56.25 75, 30 72, 16.25 58 C 11.25 52, 13.75 46, 18.75 40 Z"
            fill="#0ea5e9"
            fillOpacity="0.25"
          />
          {/* Depth Contours */}
          <ellipse cx="52.5" cy="28" rx="22.5" ry="9" fill="#0284c7" fillOpacity="0.2" />
        </svg>

        {/* Map Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Lake Label */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MaterialIcon name="water" className="text-sky-600 text-base" />
            Danau Situ Gede, Bogor (6.2 Ha)
          </span>
        </div>

        {/* FTW Pins */}
        {(activeLayer === 'all' || activeLayer === 'ftw') &&
          ftwUnits.map((unit) => {
            const isSelected = selectedUnit?.id === unit.id;
            return (
              <div
                key={unit.id}
                style={{ left: `${unit.mapX}%`, top: `${unit.mapY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                onClick={() => {
                  setSelectedUnit(unit);
                  setIsCardCollapsed(false);
                  if (onSelectUnit) onSelectUnit(unit);
                }}
              >
                {/* Ping Animation */}
                <div
                  className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                    unit.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />

                {/* Pin Icon */}
                <div
                  className={`relative w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform ${
                    isSelected ? 'scale-125 ring-4 ring-white' : 'hover:scale-110'
                  } ${unit.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-600'}`}
                >
                  <MaterialIcon name="sensors" className="text-xl" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                    {unit.id.split('-')[1]}
                  </span>
                </div>

                {/* Tooltip on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-md">
                  {unit.name}
                </div>
              </div>
            );
          })}

        {/* Ranger Pin */}
        {(activeLayer === 'all' || activeLayer === 'ranger') && (
          <div
            style={{ left: `${rangerPosition.mapX}%`, top: `${rangerPosition.mapY}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <MaterialIcon name="directions_walk" className="text-lg" />
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-md">
              {rangerPosition.name}
            </div>
          </div>
        )}

        {/* Selected Unit Popup Card (Overlaid at bottom of map) */}
        {selectedUnit && !isCardCollapsed ? (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:w-88 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2 max-h-[60%] overflow-y-auto">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] font-bold bg-[#0F766E]/15 text-[#0F766E] px-2 py-0.5 rounded-md uppercase">
                  {selectedUnit.id}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{selectedUnit.name}</h4>
                <p className="text-[11px] text-slate-500">{selectedUnit.location}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                    selectedUnit.status === 'warning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : selectedUnit.status === 'offline'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {selectedUnit.status === 'warning' ? 'Waspada' : selectedUnit.status === 'offline' ? 'Tidak Aman' : 'Aman'}
                </span>

                {/* Open / Close / Minimize Control Buttons */}
                <button
                  onClick={() => setIsCardCollapsed(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors active:scale-95"
                  title="Tutup Detail Map"
                >
                  <MaterialIcon name="keyboard_arrow_down" className="text-lg" />
                </button>
                <button
                  onClick={() => setIsCardCollapsed(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors active:scale-95"
                  title="Tutup Card"
                >
                  <MaterialIcon name="close" className="text-base" />
                </button>
              </div>
            </div>

            {/* 5 Realtime Water Parameters for the selected FTW station */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] pt-2 border-t border-slate-100">
              <div className="p-1.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">pH</span>
                <span className="font-bold text-slate-800">{metrics ? metrics.pH : 7.2}</span>
              </div>
              <div className="p-1.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">DO</span>
                <span className="font-bold text-slate-800">{metrics ? metrics.DO : 6.5} mg/L</span>
              </div>
              <div className="p-1.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Suhu</span>
                <span className="font-bold text-slate-800">{metrics ? metrics.temperature : 28.4}°C</span>
              </div>
              <div className="p-1.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Kekeruhan</span>
                <span className="font-bold text-slate-800">{metrics ? metrics.turbidity : 18} NTU</span>
              </div>
              <div className="p-1.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">TDS</span>
                <span className="font-bold text-slate-800">{metrics ? metrics.tds.toFixed(0) : '320'} mg/L</span>
              </div>
              <div className="p-1.5 bg-emerald-50 rounded-xl">
                <span className="text-[10px] text-emerald-600 block font-semibold">Baterai IoT</span>
                <span className="font-bold text-emerald-800">{selectedUnit.battery}%</span>
              </div>
            </div>
          </div>
        ) : (
          /* Floating Open Trigger Button when collapsed/closed */
          <button
            onClick={() => {
              setIsCardCollapsed(false);
              if (!selectedUnit && ftwUnits.length > 0) setSelectedUnit(ftwUnits[0]);
            }}
            className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-2.5 border border-slate-200 shadow-lg text-xs font-bold text-[#0F766E] flex items-center gap-2 hover:bg-emerald-50 transition-all z-20 active:scale-95"
            title="Buka Detail Stasiun FTW"
          >
            <MaterialIcon name="info" className="text-base text-[#0F766E]" />
            <span>Buka Detail Stasiun ({selectedUnit ? selectedUnit.id : 'FTW-01'})</span>
            <MaterialIcon name="keyboard_arrow_up" className="text-base" />
          </button>
        )}

      </div>
    </div>
  );
};

export default LakeMap;
