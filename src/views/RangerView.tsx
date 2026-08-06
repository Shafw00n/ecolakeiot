import React, { useState } from 'react';
import { PublicComplaint, RangerChecklistItem, RangerReport } from '../types';
import MaterialIcon from '../components/MaterialIcon';
import PublicComplaintsList from '../components/PublicComplaintsList';

interface RangerViewProps {
  checklist: RangerChecklistItem[];
  reports: RangerReport[];
  onToggleChecklist: (id: string) => void;
  onAddReport: (report: RangerReport) => void;
  onOpenQRScanner: () => void;
  publicComplaints: PublicComplaint[];
  onUpdateComplaintStatus: (id: string, status: 'Baru' | 'Diproses' | 'Selesai') => void;
  onOpenPublicPortal?: () => void;
}

export const RangerView: React.FC<RangerViewProps> = ({
  checklist,
  reports,
  onToggleChecklist,
  onAddReport,
  onOpenQRScanner,
  publicComplaints,
  onUpdateComplaintStatus,
  onOpenPublicPortal,
}) => {
  const [reportForm, setReportForm] = useState({
    location: 'FTW-01 (Dermaga Utama)',
    issueType: 'Trash Accumulation' as RangerReport['issueType'],
    description: '',
    severity: 'Medium' as RangerReport['severity'],
    photoPreview: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportForm((prev) => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setReportForm((prev) => ({
        ...prev,
        photoPreview:
          'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=400&q=80',
      }));
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newRep: RangerReport = {
        id: `REP-${Date.now().toString().slice(-4)}`,
        reporterName: 'Ahmad Fauzi (Ranger-04)',
        location: reportForm.location,
        issueType: reportForm.issueType,
        description: reportForm.description,
        severity: reportForm.severity,
        status: 'Submitted',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        photoUrl:
          reportForm.photoPreview ||
          'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=400&q=80',
        coordinates: '-6.5532, 106.7511',
      };
      onAddReport(newRep);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setReportForm({
        location: 'FTW-01 (Dermaga Utama)',
        issueType: 'Trash Accumulation',
        description: '',
        severity: 'Medium',
        photoPreview: '',
      });
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Ranger Portal Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <MaterialIcon name="checklist" className="text-emerald-400 text-sm" />
                Portal Local Community Ranger
              </span>
              <span className="text-slate-300 text-xs hidden sm:inline">
                • Komunitas Peduli Situ Gede
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Dashboard Pemantauan Lapangan & Respons Cepat
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Checklist patroli rutin, pelaporan insiden kondisi air danau, inspeksi kebersihan pulau FTW, serta pemindaian QR Code sensor.
            </p>
          </div>

          <button
            onClick={onOpenQRScanner}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <MaterialIcon name="qr_code_scanner" className="text-base" />
            <span>Scan QR Sensor IoT</span>
          </button>
        </div>
      </div>

      {/* PRIORITAS RANGER: Public Complaints List (QR Code Portal Aduan Masyarakat) */}
      <PublicComplaintsList
        complaints={publicComplaints}
        userRole="ranger"
        onUpdateStatus={onUpdateComplaintStatus}
        onOpenPublicPortal={onOpenPublicPortal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Field Inspection Checklist (Col 1) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <MaterialIcon name="fact_check" className="text-emerald-600 text-2xl" />
                <h3 className="font-bold text-slate-900 text-sm">Checklist Patroli Lapangan</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {checklist.filter((c) => c.checked).length} / {checklist.length} Selesai
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Centang setiap tugas inspeksi fisik yang telah diselesaikan tim Ranger hari ini:
            </p>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    item.checked
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onToggleChecklist(item.id)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className={`text-xs ${item.checked ? 'font-semibold line-through text-slate-500' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
            Terakhir dikonfirmasi: Tim Ranger Situ Gede (08:00 WIB)
          </div>
        </div>

        {/* Quick Incident Report Form (Col 2 & 3) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <MaterialIcon name="report" className="text-teal-600 text-2xl" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Form Laporan Insiden Lapangan (Dummy)</h3>
              <p className="text-xs text-slate-500">Kirim Laporan Kondisi Air / Kerusakan FTW ke Sistem</p>
            </div>
          </div>

          {submitSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl mb-4 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <MaterialIcon name="check_circle" className="text-emerald-600 text-lg" />
              <span>Laporan insiden berhasil dikirim ke dashboard KLH & IPB!</span>
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Lokasi Insiden</label>
                <select
                  value={reportForm.location}
                  onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium"
                >
                  <option value="FTW-01 (Dermaga Utama)">FTW-01 (Dermaga Utama Inflow)</option>
                  <option value="FTW-02 (Zona Tengah)">FTW-02 (Mid-Lake Bio-Filtrasi)</option>
                  <option value="FTW-03 (Outflow Selatan)">FTW-03 (Zona Outlet Danau)</option>
                  <option value="Tepi Barat Situ Gede">Tepi Barat Situ Gede</option>
                  <option value="Area Pemukiman Warga">Area Pemukiman Sekitar Danau</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Jenis Masalah</label>
                <select
                  value={reportForm.issueType}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, issueType: e.target.value as any })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium"
                >
                  <option value="Trash Accumulation">Tumpukan Sampah Plastik</option>
                  <option value="Plant Damage">Kerusakan Tanaman FTW</option>
                  <option value="Sensor Offline">Indikator Sensor Offline</option>
                  <option value="Water Discoloration">Perubahan Warna / Bau Air</option>
                  <option value="Illegal Runoff">Limpasan Limbah Mencurigakan</option>
                  <option value="Other">Lain-lain</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Tingkat Urgensi (Severity)</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High', 'Critical'] as const).map((sev) => (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => setReportForm({ ...reportForm, severity: sev })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      reportForm.severity === sev
                        ? sev === 'Critical' || sev === 'High'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Deskripsi Lapangan</label>
              <textarea
                rows={3}
                value={reportForm.description}
                onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                placeholder="Jelaskan kondisi detail insiden yang ditemui tim Ranger..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Photo Attachment Simulation */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Foto Bukti Lapangan</label>
              <div className="flex items-center gap-3">
                <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer flex items-center gap-2 border border-slate-300">
                  <MaterialIcon name="photo_camera" className="text-base text-slate-600" />
                  <span>{reportForm.photoPreview ? 'Ganti Foto' : 'Unggah Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUploadSim}
                    className="hidden"
                  />
                </label>

                {reportForm.photoPreview && (
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <img
                      src={reportForm.photoPreview}
                      alt="Preview"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="text-[11px] text-emerald-700 font-bold">Foto Siap</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <MaterialIcon name="sync" className="animate-spin text-base" />
                    <span>Mengirim Laporan...</span>
                  </>
                ) : (
                  <>
                    <MaterialIcon name="send" className="text-base" />
                    <span>Kirim Laporan Ranger</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Patrol Timeline & Recent Reports */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <MaterialIcon name="timeline" className="text-emerald-600 text-2xl" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Riwayat Patroli & Laporan Komunitas</h3>
            <p className="text-xs text-slate-500">Aktivitas Terbaru Ranger Situ Gede</p>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                {rep.photoUrl ? (
                  <img
                    src={rep.photoUrl}
                    alt="Bukti Insiden"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                    <MaterialIcon name="report" className="text-2xl" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{rep.id}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                      {rep.issueType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.severity === 'Critical' || rep.severity === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Urgensi: {rep.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-1 font-medium">{rep.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Dilaporkan oleh: {rep.reporterName} • {rep.location} • {rep.timestamp}
                  </p>
                </div>
              </div>

              <span
                className={`text-[11px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap ${
                  rep.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                Status: {rep.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RangerView;
