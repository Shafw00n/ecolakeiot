import React from 'react';
import MaterialIcon from './MaterialIcon';

interface FTWDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FTWDiagramModal: React.FC<FTWDiagramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Floating Treatment Wetland (FTW)',
      icon: 'grass',
      color: 'bg-emerald-500',
      description:
        'Struktur pulau terapung menggunakan tanaman hidroponik air lokal (Vetiver, Cyperus, Canna) untuk menyerap nutrien berlebih (Nitrat & Fosfat) dan menguraikan polutan biologis.',
      badge: 'Bio-Filtrasi Alami',
    },
    {
      num: 2,
      title: 'IoT Data Acquisition Module',
      icon: 'sensors',
      color: 'bg-teal-600',
      description:
        'Modul sensor celup multi-parameter (pH, DO, Turbiditas, Suhu, Konduktivitas) dikontrol ESP32 Microcontroller dengan daya mandiri Solar Panel 50W & Baterai.',
      badge: 'Hardware Sensor',
    },
    {
      num: 3,
      title: 'Transmission & Cloud Gateway',
      icon: 'cell_tower',
      color: 'bg-sky-500',
      description:
        'Data telemetri dikirim secara berkala tiap 5 detik menggunakan protokol MQTT / Wi-Fi 4G LTE ke server cloud terenkripsi.',
      badge: 'Transmisi Nirkabel',
    },
    {
      num: 4,
      title: 'Real-time Smart Dashboard',
      icon: 'space_dashboard',
      color: 'bg-indigo-600',
      description:
        'Dashboard terintegrasi menampilkan statistik visual, peta interaktif, tren grafik, serta notifikasi responsif untuk semua pemangku kepentingan.',
      badge: 'Visualisasi Data',
    },
    {
      num: 5,
      title: 'Decision Support System (AI)',
      icon: 'psychology',
      color: 'bg-amber-600',
      description:
        'Algoritma kecerdasan buatan menganalisis anomali kualitas air secara otomatis, memberikan rekomendasi tindakan spesifik (seperti aktifkan aerasi atau inspeksi lapangan).',
      badge: 'Analisis AI & Aksi',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative flex flex-col bg-white w-full sm:max-w-4xl sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 mx-0 sm:mx-3 sm:my-4 sm:my-8 max-h-full sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-4 sm:p-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sistem Infografis FTW IoT
                </span>
                <span className="text-slate-400 text-xs">• Situ Gede Smart Lake</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight">
                Alur Kerja IoT-Enabled Floating Treatment Wetland
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Solusi pintar berbasis teknologi hijau untuk restorasi kualitas air danau melalui pemantauan sensor real-time dan bio-filtrasi vegetasi alami.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors active:scale-95"
              aria-label="Tutup infografis"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>
          </div>
        </div>

        {/* Modal Body: Interactive Infographic Architecture Flow */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 bg-slate-50 space-y-6">
          
          {/* Hardware Breakdown Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            
            {/* Left: Plant & FTW Physical structure */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-2">
                <MaterialIcon name="eco" className="text-emerald-600 text-xl" />
                <span>Tanaman Bio-Filtrasi (FTW Island)</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                <li>
                  <strong className="text-emerald-800">Vetiver (Rumput Akar Wangi):</strong> Serapan Nitrat tinggi & jangkar perakaran hingga 2 meter.
                </li>
                <li>
                  <strong className="text-emerald-800">Cyperus papyrus (Papirus Air):</strong> Pengurai polutan organik & pensuplai oksigen.
                </li>
                <li>
                  <strong className="text-emerald-800">Canna indica (Bunga Tasbih):</strong> Penyerap fosfat efektif & estetika lansekap danau.
                </li>
              </ul>
            </div>

            {/* Right: IoT System Electronics */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100">
              <div className="flex items-center gap-2 font-bold text-teal-900 text-sm mb-2">
                <MaterialIcon name="memory" className="text-teal-600 text-xl" />
                <span>Modul IoT Hardware & Sensor</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                  <MaterialIcon name="solar_power" className="text-amber-500 text-base" />
                  <span>Solar Panel 50W</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                  <MaterialIcon name="battery_charging_full" className="text-emerald-500 text-base" />
                  <span>LiFePO4 Battery</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                  <MaterialIcon name="settings_remote" className="text-teal-500 text-base" />
                  <span>ESP32 MCU</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                  <MaterialIcon name="water" className="text-sky-500 text-base" />
                  <span>Multi-Probe Sensors</span>
                </div>
              </div>
            </div>

          </div>

          {/* 5-Step Process Horizontal / Vertical Cards */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Tahapan Alur Kerja Sistem (1 - 5)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-teal-400 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center ${s.color}`}>
                        {s.num}
                      </span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                        {s.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 my-2">
                      <MaterialIcon name={s.icon} className="text-slate-700 text-xl" />
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{s.title}</h4>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MaterialIcon name="info" className="text-teal-600 text-base" />
            <span>Dikembangkan bersama Kementerian Lingkungan Hidup & IPB University</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors active:scale-95"
          >
            Tutup Skema
          </button>
        </div>

      </div>
    </div>
  );
};

export default FTWDiagramModal;
