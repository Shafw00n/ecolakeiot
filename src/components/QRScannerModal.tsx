import React, { useState } from 'react';
import MaterialIcon from './MaterialIcon';
import { FTWUnit } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ftwUnits: FTWUnit[];
  onOpenPublicPortal?: (location?: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  ftwUnits,
  onOpenPublicPortal,
}) => {
  const [scannedUnit, setScannedUnit] = useState<FTWUnit | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = (unit: FTWUnit) => {
    setIsScanning(true);
    setTimeout(() => {
      setScannedUnit(unit);
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="qr_code_scanner" className="text-teal-400 text-2xl" />
            <h3 className="font-bold text-slate-100 text-base">Simulasi Scan QR Sensor IoT</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        {!scannedUnit ? (
          <div>
            <p className="text-xs text-slate-400 mb-3 text-center">
              Arahkan kamera ke kode QR di fisik rakit pulau FTW atau tiang sensor danau:
            </p>

            {/* Simulated Camera Viewfinder */}
            <div className="relative w-56 h-56 mx-auto bg-slate-950 rounded-2xl border-2 border-teal-500/60 overflow-hidden flex items-center justify-center my-4 shadow-inner">
              <div className="absolute inset-4 border-2 border-dashed border-teal-400/40 rounded-xl pointer-events-none" />
              
              {/* Scanning Red/Green line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 animate-pulse shadow-md" />

              <MaterialIcon name="qr_code_2" className="text-7xl text-teal-500/40 opacity-70" />

              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2">
                  <MaterialIcon name="sync" className="animate-spin text-3xl text-teal-400" />
                  <span className="text-xs font-bold text-teal-300">Membaca Telemetri QR...</span>
                </div>
              )}
            </div>

            {/* Simulated Quick QR Code Targets */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 block text-center mb-2">
                Klik Kode Barcode QR Simulasi di bawah:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {ftwUnits.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSimulateScan(u)}
                    className="p-2 bg-slate-800 hover:bg-teal-900/60 text-teal-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex flex-col items-center gap-1"
                  >
                    <MaterialIcon name="qr_code" className="text-lg" />
                    <span>{u.id}</span>
                  </button>
                ))}
              </div>

              {onOpenPublicPortal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPublicPortal();
                  }}
                  className="w-full mt-3 py-2.5 bg-[#0F766E] hover:bg-[#0d6760] text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MaterialIcon name="record_voice_over" className="text-base" />
                  <span>Buka Form Aduan Masyarakat (Tanpa Login)</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-teal-950/60 rounded-xl border border-teal-500/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-teal-400">{scannedUnit.id}</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Telemetry Linked
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">{scannedUnit.name}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{scannedUnit.location}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Baterai Perangkat</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <MaterialIcon name="battery_full" className="text-sm" />
                    {scannedUnit.battery}%
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Daya Panel Surya</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                    <MaterialIcon name="solar_power" className="text-sm" />
                    {scannedUnit.solarOutput} Watts
                  </span>
                </div>
              </div>
            </div>

            {onOpenPublicPortal && (
              <button
                onClick={() => {
                  const loc = scannedUnit.id;
                  onClose();
                  onOpenPublicPortal(loc);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <MaterialIcon name="report_problem" className="text-base" />
                <span>Kirim Laporan Aduan untuk {scannedUnit.id}</span>
              </button>
            )}

            <button
              onClick={() => setScannedUnit(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              Scan Kode QR Lain
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default QRScannerModal;
