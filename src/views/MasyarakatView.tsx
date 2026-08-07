import React, { useState } from 'react';
import MaterialIcon from '../components/MaterialIcon';
import { PublicComplaint, ComplaintStatus } from '../types';

interface MasyarakatViewProps {
  publicComplaints: PublicComplaint[];
  onSubmitComplaint: (complaint: PublicComplaint) => void;
}

const ISSUE_CATEGORIES = [
  'Air keruh',
  'Bau tidak sedap',
  'Warna air berubah',
  'Sampah di sekitar FTW',
  'Tanaman FTW rusak',
  'Sensor/alat FTW rusak',
  'Pelampung atau struktur FTW rusak',
  'Lainnya',
];

const PRESET_SAMPLE_PHOTOS = [
  { label: 'Contoh Sampah FTW', url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&auto=format&fit=crop&q=80' },
  { label: 'Contoh Air Keruh', url: 'https://images.unsplash.com/photo-1544830728-872f9b17c152?w=600&auto=format&fit=crop&q=80' },
  { label: 'Contoh Tanaman Layu', url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&auto=format&fit=crop&q=80' },
];

export const MasyarakatView: React.FC<MasyarakatViewProps> = ({
  publicComplaints,
  onSubmitComplaint,
}) => {
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [location, setLocation] = useState('FTW-01');
  const [issueCategory, setIssueCategory] = useState(ISSUE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !description.trim()) return;

    const newId = `ADUAN-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const newComplaint: PublicComplaint = {
      id: newId,
      reporterName: reporterName.trim(),
      reporterPhone: reporterPhone.trim() || undefined,
      location,
      issueCategory,
      description: description.trim(),
      photoUrl: photoPreview || photoUrl || undefined,
      timestamp: timeString,
      status: 'New',
    };

    onSubmitComplaint(newComplaint);
    setSubmittedId(newId);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setReporterName('');
    setReporterPhone('');
    setLocation('FTW-01');
    setIssueCategory(ISSUE_CATEGORIES[0]);
    setDescription('');
    setPhotoUrl('');
    setPhotoPreview(null);
    setIsSubmitted(false);
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'New':
        return (
          <span className="bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            New
          </span>
        );
      case 'In Progress':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Resolved
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Mobile-Friendly Portal Banner */}
      <div className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#38BDF8] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-sky-200 border border-white/20">
              <MaterialIcon name="qr_code_scanner" className="text-base text-sky-300" />
              <span>Portal Publik Warga & Wisatawan</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Portal Aduan Masyarakat Situ Gede
            </h1>
            <p className="text-xs text-sky-100/90 leading-relaxed max-w-xl">
              Laporkan kendala fisik, kebersihan, atau kerusakan alat Smart FTW di lokasi danau tanpa perlu mendaftar. Laporan Anda langsung dikirimkan ke tim Ranger Lapangan, KLH & IPB.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-sky-200 flex-shrink-0 self-end sm:self-auto shadow-inner">
            <MaterialIcon name="record_voice_over" className="text-2xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Complaint Form (8 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-7 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center font-bold">
                <MaterialIcon name="edit_note" className="text-2xl" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Form Laporan Kondisi Smart FTW</h2>
                <p className="text-xs text-slate-500">Tanpa Login • Otomatis Terhubung ke Telemetri & Petugas</p>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            /* Halaman Sukses */
            <div className="py-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <MaterialIcon name="check_circle" className="text-4xl" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                  ID Aduan: {submittedId}
                </span>
                <h3 className="text-xl font-black text-slate-900">Laporan Berhasil Terkirim!</h3>
                <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed font-medium">
                  Terima kasih. Laporan Anda telah diterima dan akan diteruskan kepada petugas.
                </p>
              </div>

              {/* Status Verification Flow info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-between font-bold text-slate-800 pb-1 border-b border-slate-200">
                  <span className="flex items-center gap-1.5 text-[#0F766E]">
                    <MaterialIcon name="mark_email_read" className="text-base" /> Status Penerusan Laporan:
                  </span>
                  <span className="bg-sky-100 text-sky-800 border border-sky-300 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                    Baru
                  </span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1.5">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MaterialIcon name="check" className="text-emerald-600 text-sm" />
                      <strong>Dashboard Ranger Lapangan</strong>
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Prioritas 1</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MaterialIcon name="check" className="text-emerald-600 text-sm" />
                      <strong>Dashboard KLH (Pengawasan)</strong>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Tersinkron</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MaterialIcon name="check" className="text-emerald-600 text-sm" />
                      <strong>Dashboard IPB (Akademik)</strong>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Tersinkron</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetForm}
                  className="px-6 py-3 bg-[#0F766E] hover:bg-[#0d6760] text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mx-auto"
                >
                  <MaterialIcon name="add" className="text-base" />
                  <span>Kirim Laporan Lainnya</span>
                </button>
              </div>
            </div>
          ) : (
            /* Form Input Aduan */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Nama Pelapor & HP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Nama Pelapor <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama Anda (contoh: Budi Santoso)"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:bg-white focus:border-[#0F766E] focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Nomor HP <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:bg-white focus:border-[#0F766E] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Lokasi FTW & Jenis Laporan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Lokasi FTW <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-bold focus:bg-white focus:border-[#0F766E] focus:outline-none transition-all"
                  >
                    <option value="FTW-01">FTW-01 (Dermaga Barat)</option>
                    <option value="FTW-02">FTW-02 (Dermaga Tengah)</option>
                    <option value="FTW-03">FTW-03 (Pusat Danau)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Jenis Laporan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-bold focus:bg-white focus:border-[#0F766E] focus:outline-none transition-all"
                  >
                    {ISSUE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deskripsi Laporan */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Deskripsi Laporan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder='Contoh: "Sensor terlihat mati", "Tanaman mengering", "Air berubah menjadi coklat", "Banyak sampah di sekitar alat"...'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:bg-white focus:border-[#0F766E] focus:outline-none transition-all leading-relaxed"
                  required
                />
              </div>

              {/* Upload Foto (Attach Image dengan Preview) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Upload Foto Bukti <span className="text-slate-400 font-normal">(Attach Image)</span>
                </label>

                <div className="space-y-2">
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors text-center">
                    <MaterialIcon name="add_a_photo" className="text-2xl text-[#0F766E]" />
                    <span className="font-bold text-slate-700 text-xs">Ambil Foto / Pilih File dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Preset Sample Photos */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">Simulasi foto:</span>
                    {PRESET_SAMPLE_PHOTOS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(p.url);
                          setPhotoPreview(p.url);
                        }}
                        className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-lg border border-slate-200 transition-all whitespace-nowrap"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Photo Preview Before Submit */}
                  {photoPreview && (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-sm mt-2">
                      <img src={photoPreview} alt="Preview Foto Aduan" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhotoUrl('');
                        }}
                        className="absolute top-2 right-2 flex items-center justify-center w-9 h-9 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition-all active:scale-95"
                      >
                        <MaterialIcon name="close" className="text-sm" />
                      </button>
                      <span className="absolute bottom-2 left-2 text-[10px] font-extrabold bg-slate-900/80 text-white px-2.5 py-1 rounded-md">
                        Preview Foto Siap Dikirim
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0F766E] hover:bg-[#0d6760] text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MaterialIcon name="send" className="text-lg" />
                  <span>Kirim Aduan</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Complaints Live Tracking List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <MaterialIcon name="history" className="text-[#0F766E] text-lg" />
                  <span>Status Aduan Terkini</span>
                </h3>
                <p className="text-[11px] text-slate-500">Transparansi Laporan Publik Masyarakat</p>
              </div>
              <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                Total: {publicComplaints.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {publicComplaints.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] font-extrabold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {c.id}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{c.issueCategory}</span>
                    </div>
                    {getStatusBadge(c.status)}
                  </div>

                  <p className="text-slate-600 line-clamp-2 text-[11px] font-medium leading-relaxed bg-white p-2 rounded-xl border border-slate-100">
                    "{c.description}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="font-bold text-slate-600">Lokasi: {c.location} • {c.reporterName}</span>
                    <span>{c.timestamp}</span>
                  </div>

                  {c.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedImageModal(c.photoUrl || null)}
                      className="text-[#0F766E] hover:underline text-[10px] font-bold flex items-center gap-1 pt-0.5"
                    >
                      <MaterialIcon name="image" className="text-xs" />
                      <span>Lihat Lampiran Foto</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Image Preview Modal */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-slate-900 p-3 rounded-2xl max-w-lg w-full relative">
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 text-white bg-slate-800 p-1.5 rounded-full hover:bg-rose-600 transition-all"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>
            <img src={selectedImageModal} alt="Foto Lampiran Aduan" className="w-full h-auto rounded-xl max-h-[75vh] object-contain" />
          </div>
        </div>
      )}

    </div>
  );
};

export default MasyarakatView;
