import React, { useState } from 'react';
import { LaboratorySample, PlantSpeciesPerformance, PublicComplaint, WaterMetrics, ComplaintStatus } from '../types';
import { PLANT_SPECIES_DATA } from '../data/mockData';
import MaterialIcon from '../components/MaterialIcon';
import PublicComplaintsList from '../components/PublicComplaintsList';

interface IPBViewProps {
  samples: LaboratorySample[];
  metrics: WaterMetrics;
  onAddSample: (sample: LaboratorySample) => void;
  onValidateSample: (id: string) => void;
  publicComplaints: PublicComplaint[];
  onUpdateComplaintStatus: (id: string, status: ComplaintStatus) => void;
  onOpenPublicPortal?: () => void;
}

export const IPBView: React.FC<IPBViewProps> = ({
  samples,
  metrics,
  onAddSample,
  onValidateSample,
  publicComplaints,
  onUpdateComplaintStatus,
  onOpenPublicPortal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const validationLabel = (v: string) =>
    v === 'Validated' ? 'Tervalidasi' : v === 'Pending' ? 'Menunggu' : 'Ditolak';
  const [newSample, setNewSample] = useState({
    sampleCode: 'LAB-SG-10A',
    location: 'FTW-01 Inflow',
    ph: 7.25,
    do: 6.50,
    nitrate: 1.30,
    phosphate: 0.18,
    turbidity: 15.0,
    researcher: 'Tim Peneliti IPB',
    notes: 'Uji laboratorium rutin spektrofotometri.',
  });

  const handleCreateSample = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LaboratorySample = {
      id: `SMP-${Date.now()}`,
      sampleCode: newSample.sampleCode,
      location: newSample.location,
      collectionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ph: Number(newSample.ph),
      do: Number(newSample.do),
      nitrate: Number(newSample.nitrate),
      phosphate: Number(newSample.phosphate),
      turbidity: Number(newSample.turbidity),
      validationStatus: 'Validated',
      researcher: newSample.researcher,
      notes: newSample.notes,
    };
    onAddSample(created);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* IPB Academic Portal Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <MaterialIcon name="science" className="text-emerald-400 text-sm" />
                Portal Riset IPB University
              </span>
              <span className="text-slate-300 text-xs hidden sm:inline">
                • Departemen Manajemen Sumberdaya Perairan
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Dashboard Analisis Ilmiah & Validasi Laboratorium
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Validasi data sensor IoT, pengujian laboratorium spektrofotometri, dan evaluasi efisiensi bio-filtrasi tanaman FTW.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <MaterialIcon name="biotech" className="text-base" />
            <span>Input Sampel Lab Baru</span>
          </button>
        </div>
      </div>

      {/* Plant Species Bio-Filtration Performance Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MaterialIcon name="grass" className="text-emerald-600 text-2xl" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Evaluasi Kinerja Spesies Tanaman FTW</h3>
              <p className="text-xs text-slate-500">Kapasitas Serapan Nutrien (Nitrat & Fosfat)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            3 Spesies Utama
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANT_SPECIES_DATA.map((plant) => (
            <div
              key={plant.id}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-all hover:border-emerald-300 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Spesies FTW
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    Health: {plant.healthIndex}%
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 mt-1">{plant.commonName}</h4>
                <p className="text-xs italic text-slate-500 mb-3">{plant.botanicalName}</p>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Serapan Nitrat (N)</span>
                      <span className="font-bold text-emerald-700">{plant.nitrogenRemovalRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${plant.nitrogenRemovalRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Serapan Fosfat (P)</span>
                      <span className="font-bold text-teal-700">{plant.phosphateRemovalRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${plant.phosphateRemovalRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Peningkatan DO: +{plant.doEnhancement} mg/L</span>
                <span>Siklus: {plant.growthRateDays} Hari</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Laboratory Simulation Samples Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MaterialIcon name="biotech" className="text-teal-600 text-2xl" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Hasil Pengujian Laboratorium IPB</h3>
              <p className="text-xs text-slate-500">Pencocokan Data Uji Basah vs Sensor IoT</p>
            </div>
          </div>
        </div>

        {/* Responsive Sample Cards (Mobile) */}
        <div className="md:hidden space-y-3">
          {samples.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <MaterialIcon name="science" className="text-base" />
                  </span>
                  <div className="min-w-0">
                    <span className="block font-extrabold text-slate-900 text-xs truncate">{s.sampleCode}</span>
                    <span className="block text-[10px] text-slate-400 truncate">{s.location}</span>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-bold ${
                    s.validationStatus === 'Validated'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.validationStatus === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {validationLabel(s.validationStatus)}
                </span>
              </div>

              <div className="p-3.5 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">pH Lab</span>
                  <span className="font-bold text-slate-800 text-xs">{s.ph}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">DO Lab</span>
                  <span className="font-bold text-teal-700 text-xs">{s.do} mg/L</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">Nitrat</span>
                  <span className="font-bold text-slate-800 text-xs">{s.nitrate}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">Fosfat</span>
                  <span className="font-bold text-slate-800 text-xs">{s.phosphate}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">Waktu</span>
                  <span className="font-bold text-slate-600 text-[10px]">{s.collectionDate}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">Peneliti</span>
                  <span className="font-bold text-slate-700 text-[10px] truncate block">{s.researcher}</span>
                </div>
              </div>

              {s.validationStatus === 'Pending' && (
                <div className="px-3.5 pb-3.5">
                  <button
                    onClick={() => onValidateSample(s.id)}
                    className="w-full px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] active:scale-[0.99] transition-all"
                  >
                    <MaterialIcon name="check_circle" className="text-sm inline-block mr-1 align-middle" />
                    Validasi Sampel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lab Results Table (Tablet & Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">Kode Sampel</th>
                <th className="p-3">Lokasi Pengambilan</th>
                <th className="p-3">Waktu Ambil</th>
                <th className="p-3">pH Lab</th>
                <th className="p-3">DO Lab</th>
                <th className="p-3">Nitrat (NO3)</th>
                <th className="p-3">Fosfat (PO4)</th>
                <th className="p-3">Peneliti</th>
                <th className="p-3">Status Validasi</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {samples.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{s.sampleCode}</td>
                  <td className="p-3 text-slate-700">{s.location}</td>
                  <td className="p-3 text-slate-500 whitespace-nowrap">{s.collectionDate}</td>
                  <td className="p-3 font-semibold">{s.ph}</td>
                  <td className="p-3 font-bold text-teal-700">{s.do} mg/L</td>
                  <td className="p-3 text-slate-700">{s.nitrate} mg/L</td>
                  <td className="p-3 text-slate-700">{s.phosphate} mg/L</td>
                  <td className="p-3 text-slate-600">{s.researcher}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.validationStatus === 'Validated'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.validationStatus === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {validationLabel(s.validationStatus)}
                    </span>
                  </td>
                  <td className="p-3">
                    {s.validationStatus === 'Pending' && (
                      <button
                        onClick={() => onValidateSample(s.id)}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] active:scale-95 transition-all"
                      >
                        Validasi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publication & Student Internship Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <MaterialIcon name="article" className="text-teal-600 text-xl" />
          <h3 className="font-bold text-slate-900 text-sm">Publikasi Riset & Kegiatan Praktikum/KKN IPB</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
              Jurnal Ilmiah Ongoing
            </span>
            <h4 className="font-bold text-slate-900 mt-1">
              "Efficiency of Phytoremediation in Tropical Lakes using FTW IoT Monitoring"
            </h4>
            <p className="text-slate-600 mt-1">
              Penulis: Prof. Dr. Maya Roseti et al. Status: Dalam Tinjauan Jurnal Limnologi Indonesia.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Program Mahasiswa KKN IPB
            </span>
            <h4 className="font-bold text-slate-900 mt-1">
              Pendampingan Komunitas Ranger & Edukasi Warga Situ Gede
            </h4>
            <p className="text-slate-600 mt-1">
              Peserta: 12 Mahasiswa MSP IPB. Jadwal: Juli - September 2026. Fokus: Kalibrasi sensor & pengolahan data.
            </p>
          </div>
        </div>
      </div>

      {/* Public Complaints List Section in IPB Dashboard */}
      <PublicComplaintsList
        complaints={publicComplaints}
        userRole="ipb"
        onUpdateStatus={onUpdateComplaintStatus}
        onOpenPublicPortal={onOpenPublicPortal}
      />

      {/* Add Sample Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Input Sampel Laboratorium IPB</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleCreateSample} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kode Sampel</label>
                <input
                  type="text"
                  value={newSample.sampleCode}
                  onChange={(e) => setNewSample({ ...newSample, sampleCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Lokasi Pengambilan</label>
                <input
                  type="text"
                  value={newSample.location}
                  onChange={(e) => setNewSample({ ...newSample, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">pH Uji Lab</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSample.ph}
                    onChange={(e) => setNewSample({ ...newSample, ph: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">DO Uji Lab (mg/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSample.do}
                    onChange={(e) => setNewSample({ ...newSample, do: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nitrat (NO3)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSample.nitrate}
                    onChange={(e) => setNewSample({ ...newSample, nitrate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fosfat (PO4)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSample.phosphate}
                    onChange={(e) => setNewSample({ ...newSample, phosphate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Peneliti IPB</label>
                <input
                  type="text"
                  value={newSample.researcher}
                  onChange={(e) => setNewSample({ ...newSample, researcher: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Simpan Sampel Lab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default IPBView;
