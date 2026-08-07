import React, { useState } from 'react';
import { LakeComparisonData, PublicComplaint, WaterMetrics, ComplaintStatus } from '../types';
import MaterialIcon from '../components/MaterialIcon';
import PublicComplaintsList from '../components/PublicComplaintsList';

interface KLHViewProps {
  lakes: LakeComparisonData[];
  metrics: WaterMetrics;
  publicComplaints: PublicComplaint[];
  onUpdateComplaintStatus: (id: string, status: ComplaintStatus) => void;
  onOpenPublicPortal?: () => void;
}

export const KLHView: React.FC<KLHViewProps> = ({
  lakes,
  metrics,
  publicComplaints,
  onUpdateComplaintStatus,
  onOpenPublicPortal,
}) => {
  const [selectedLake, setSelectedLake] = useState<LakeComparisonData>(lakes[0]);
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* KLH Executive Portal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-6 rounded-2xl shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <MaterialIcon name="analytics" className="text-teal-400 text-sm" />
                Portal Kementerian Lingkungan Hidup (KLH)
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">• Tingkat Nasional & Regional</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Dashboard Kebijakan & Pengawasan Danau Nasional
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Evaluasi kinerja pemulihan danau berbasis teknologi Floating Treatment Wetland (FTW), perbandingan antar-danau, serta perumusan rekomendasi kebijakan.
            </p>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <MaterialIcon name="picture_as_pdf" className="text-base" />
            <span>Cetak Laporan Eksekutif KLH</span>
          </button>
        </div>
      </div>

      {/* Executive Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Sensor IoT Terpasang</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">21 Sensors</div>
            <span className="text-[10px] text-emerald-600 font-bold">Tersebar di 3 Danau</span>
          </div>
          <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
            <MaterialIcon name="sensors" className="text-2xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Jumlah Unit Pulau FTW</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">9 Modular Units</div>
            <span className="text-[10px] text-teal-600 font-bold">Situ Gede, Burung & Panjang</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <MaterialIcon name="grass" className="text-2xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Peringatan Kritis Hari Ini</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">1 Incident</div>
            <span className="text-[10px] text-amber-700 font-semibold">Situ Burung (DO Rendah)</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <MaterialIcon name="warning" className="text-2xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Rata-Rata WQI Danau</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">79.2 / 100</div>
            <span className="text-[10px] text-emerald-600 font-bold">Kategori Baik (Good)</span>
          </div>
          <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
            <MaterialIcon name="verified" className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Lake Comparison Table & Visual Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="compare_arrows" className="text-teal-600 text-2xl" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Matriks Perbandingan Kualitas Air Danau</h3>
              <p className="text-xs text-slate-500">Situ Gede vs Situ Burung vs Situ Panjang</p>
            </div>
          </div>
        </div>

        {/* Responsive Lake Cards (Mobile) */}
        <div className="md:hidden space-y-3">
          {lakes.map((lake) => (
            <div
              key={lake.id}
              className={`rounded-2xl border overflow-hidden ${
                selectedLake.id === lake.id ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200'
              }`}
            >
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MaterialIcon name="location_on" className="text-teal-600 text-lg shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-xs truncate">{lake.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{lake.location}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-bold ${
                    lake.status === 'Good'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {lake.status}
                </span>
              </div>

              <div className="p-3.5 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">Luas</span>
                  <span className="font-bold text-slate-800 text-xs">{lake.areaHectares} Ha</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">FTW</span>
                  <span className="font-bold text-slate-800 text-xs">{lake.ftwUnits} Unit</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">WQI</span>
                  <span className="font-extrabold text-teal-700 text-xs">{lake.wqiScore}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">pH</span>
                  <span className="font-bold text-slate-800 text-xs">{lake.avgPh}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">DO</span>
                  <span className="font-bold text-slate-800 text-xs">{lake.avgDo} mg/L</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <span className="text-[9px] text-slate-400 block font-semibold">Kekeruhan</span>
                  <span className="font-bold text-slate-800 text-xs">{lake.avgTurbidity} NTU</span>
                </div>
              </div>

              <div className="px-3.5 pb-3.5">
                <button
                  onClick={() => setSelectedLake(lake)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 hover:border-teal-500 text-slate-700 font-semibold rounded-xl text-[11px] transition-all active:scale-[0.99]"
                >
                  Detail Kebijakan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Lake Comparison Table (Tablet & Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">Nama Danau & Wilayah</th>
                <th className="p-3">Luas (Ha)</th>
                <th className="p-3">Jumlah FTW</th>
                <th className="p-3">Rata-rata pH</th>
                <th className="p-3">Rata-rata DO</th>
                <th className="p-3">Kekeruhan</th>
                <th className="p-3">Skor WQI</th>
                <th className="p-3">Status Air</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {lakes.map((lake) => (
                <tr
                  key={lake.id}
                  className={`hover:bg-teal-50/40 transition-colors ${
                    selectedLake.id === lake.id ? 'bg-teal-50/70 border-l-4 border-teal-600' : ''
                  }`}
                >
                  <td className="p-3 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <MaterialIcon name="location_on" className="text-teal-600 text-base" />
                      <span>{lake.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{lake.areaHectares} Ha</td>
                  <td className="p-3 text-slate-600">{lake.ftwUnits} Unit</td>
                  <td className="p-3 text-slate-600">{lake.avgPh}</td>
                  <td className="p-3 font-bold text-slate-800">{lake.avgDo} mg/L</td>
                  <td className="p-3 text-slate-600">{lake.avgTurbidity} NTU</td>
                  <td className="p-3 font-extrabold text-teal-700">{lake.wqiScore}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        lake.status === 'Good'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lake.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedLake(lake)}
                      className="px-3 py-2 bg-white border border-slate-200 hover:border-teal-500 text-slate-700 font-semibold rounded-lg text-[11px] transition-all active:scale-95"
                    >
                      Detail Kebijakan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Policy Recommendations Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <MaterialIcon name="insights" className="text-teal-600 text-2xl" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Rekomendasi Kebijakan AI & Tindakan Eksekutif</h3>
            <p className="text-xs text-slate-500">Ringkasan Keputusan Berbasis Sains untuk Kementerian</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-2">
              <MaterialIcon name="trending_up" className="text-teal-600 text-lg" />
              <span>1. Evaluasi Tren Kualitas Air</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Program FTW di Situ Gede berhasil meningkatkan ketersediaan Oksigen Terlarut (DO) sebesar 18% dalam 30 hari terakhir. Kadar nitrat terbukti turun secara berkelanjutan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-xs mb-2">
              <MaterialIcon name="add_circle" className="text-amber-600 text-lg" />
              <span>2. Rekomendasi Ekspansi FTW</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Danau Situ Burung direkomendasikan untuk penambahan 2 Unit Modular FTW baru guna menangani limpasan limbah pertanian & pertanian lokal secara terpadu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs mb-2">
              <MaterialIcon name="groups" className="text-emerald-600 text-lg" />
              <span>3. Program Kolaborasi Komunitas</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Alokasikan insentif program "Ranger Kebersihan Danau" untuk memperkuat patroli sampah warga dan menjaga vegetasi pulau terapung FTW.
            </p>
          </div>

        </div>
      </div>

      {/* Public Complaints List Section in KLH Dashboard */}
      <PublicComplaintsList
        complaints={publicComplaints}
        userRole="klh"
        onUpdateStatus={onUpdateComplaintStatus}
        onOpenPublicPortal={onOpenPublicPortal}
      />

      {/* Report Modal Simulation */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Cetak Laporan Eksekutif KLH</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">
                Laporan Eksekutif Monitoring Danau Nasional (Agustus 2026)
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Ringkasan Telemetri Sensor 3 Danau</li>
                <li>Evaluasi Efektivitas FTW Sistem IPB</li>
                <li>Status WQI & Rekomendasi Kebijakan KLH</li>
              </ul>
              <div className="p-3 bg-teal-50 text-teal-800 rounded-xl mt-3 text-[11px]">
                File PDF ringkasan telah disimulasikan dan siap diunduh untuk arsip Kementerian.
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert('Laporan PDF Eksekutif KLH berhasil diunduh!');
                  setShowReportModal(false);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl"
              >
                Unduh PDF Laporan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KLHView;
