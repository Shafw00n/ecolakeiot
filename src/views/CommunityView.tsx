import React, { useState } from 'react';
import MaterialIcon from '../components/MaterialIcon';

interface CommunityViewProps {
  onOpenQRScanner: () => void;
  onOpenPublicPortal?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onOpenQRScanner, onOpenPublicPortal }) => {
  const [joinedCleanup, setJoinedCleanup] = useState(false);
  const [communityReport, setCommunityReport] = useState({
    name: '',
    phone: '',
    location: 'Dermaga Barat Situ Gede',
    observation: '',
  });
  const [reportSent, setReportSent] = useState(false);

  const handleCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityReport.observation) return;
    setReportSent(true);
    setTimeout(() => {
      setReportSent(false);
      setCommunityReport({ name: '', phone: '', location: 'Dermaga Barat Situ Gede', observation: '' });
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Community Engagement Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <MaterialIcon name="groups" className="text-emerald-400 text-sm" />
                Partisipasi Komunitas & Warga Danau
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Aksi Komunitas Peduli Lingkungan Situ Gede
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Pemberdayaan masyarakat lokal dalam menjaga kebersihan air, pemindaian lokasi sensor QR, dan partisipasi aktif kegiatan gotong royong.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={onOpenQRScanner}
              className="px-4 py-3 bg-white text-teal-900 font-extrabold text-xs rounded-xl shadow-lg transition-all hover:bg-teal-50 flex items-center justify-center gap-2"
            >
              <MaterialIcon name="qr_code_scanner" className="text-lg text-teal-600" />
              <span>Scan QR Telemetri</span>
            </button>

            {onOpenPublicPortal && (
              <button
                onClick={onOpenPublicPortal}
                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MaterialIcon name="record_voice_over" className="text-lg" />
                <span>Portal Aduan QR Warga</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-Col layout: QR & Event Registration + Citizen Reporting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* QR Scanner & Cleanup Action */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <MaterialIcon name="volunteer_activism" className="text-emerald-600 text-2xl" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Kegiatan Bersih Danau (Aksi Gotong Royong)</h3>
                <p className="text-xs text-slate-500">Jadwal Rutin Sabtu Bersih Situ Gede</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-extrabold text-emerald-900">Sabtu Bersih FTW #14</span>
                <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                  9 Agustus 2026 (07:00 WIB)
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                Mari bergabung bersama Komunitas Ranger & Mahasiswa IPB untuk pembersihan sampah botol plastik di sekitar perimeter FTW-01 & FTW-02. Peratan disiapkan panitia.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <MaterialIcon name="location_on" className="text-emerald-600 text-base" />
                <span>Titik Kumpul: Dermaga Utama Situ Gede Bogor</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setJoinedCleanup(!joinedCleanup)}
            className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
              joinedCleanup
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <MaterialIcon name={joinedCleanup ? 'task_alt' : 'how_to_reg'} className="text-base" />
            <span>{joinedCleanup ? 'Terdaftar Sebagai Relawan!' : 'Daftar Relawan Sabtu Bersih'}</span>
          </button>
        </div>

        {/* Form Laporan Warga */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <MaterialIcon name="record_voice_over" className="text-teal-600 text-2xl" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Form Laporan Suara Warga</h3>
              <p className="text-xs text-slate-500">Laporkan Perubahan Warna / Bau Air Danau</p>
            </div>
          </div>

          {reportSent && (
            <div className="p-3 bg-teal-100 text-teal-900 rounded-xl mb-3 text-xs font-bold flex items-center gap-2">
              <MaterialIcon name="check_circle" className="text-teal-600 text-lg" />
              <span>Laporan warga diterima! Ranger akan mengecek lokasi.</span>
            </div>
          )}

          <form onSubmit={handleCommunitySubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nama Warga / Pelapor</label>
              <input
                type="text"
                placeholder="Nama lengkap Anda..."
                value={communityReport.name}
                onChange={(e) => setCommunityReport({ ...communityReport, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lokasi Pengamatan</label>
              <input
                type="text"
                value={communityReport.location}
                onChange={(e) => setCommunityReport({ ...communityReport, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Catatan Pengamatan</label>
              <textarea
                rows={3}
                placeholder="Tuliskan pengamatan Anda (misal: bau amonia, sampah menumpuk)..."
                value={communityReport.observation}
                onChange={(e) => setCommunityReport({ ...communityReport, observation: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MaterialIcon name="send" className="text-base" />
              <span>Kirim Laporan Pengamatan Warga</span>
            </button>
          </form>
        </div>

      </div>

      {/* AI-guided Science-backed Educational Guide: "How to Stand Up Against Pollution" */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
          <MaterialIcon name="school" className="text-teal-600 text-2xl" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Panduan Edukasi Ilmiah: Cara Berdiri & Melindungi Danau
            </h3>
            <p className="text-xs text-slate-500">Langkah Nyata Berbasis Sains untuk Warga & Pengunjung Danau</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-3">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-xs mb-1">Cegah Limpasan Deterjen & Plastik</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Deterjen fosfat tinggi memicu blooming gulma eceng gondok (eutrofikasi). Gunakan pembersih ramah lingkungan di pemukiman sekitar danau.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-xs mb-1">Jaga Kerapatan Tanaman FTW</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Akar tanaman Vetiver & Papirus menyerap hingga 84% Nitrat alami. Jangan merusak atau memancing terlalu dekat dengan rakit pulau FTW.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center text-sm mb-3">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-xs mb-1">Gunakan Aplikasi QR Telemetri</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Scan barcode QR pada tiang dermaga untuk memantau nilai pH & Oksigen (DO) secara transparan dari HP Anda secara mandiri.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-sm mb-3">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-xs mb-1">Laporkan Segera Anomali Air</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Jika melihat air berubah hitam atau ikan lemas, gunakan tombol Laporan Ranger agar tim teknis segera menyalakan aerator darurat.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CommunityView;
