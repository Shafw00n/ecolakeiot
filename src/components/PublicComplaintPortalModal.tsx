import React, { useState } from 'react';
import MaterialIcon from './MaterialIcon';
import { PublicComplaint } from '../types';

interface PublicComplaintPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLocation?: string;
  onSubmitComplaint: (complaint: PublicComplaint) => void;
}

const ISSUE_CATEGORIES = [
  'Kondisi air keruh',
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
  { label: 'Contoh Tanaman Layu', url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Contoh Air Keruh', url: 'https://images.unsplash.com/photo-1544830728-872f9b17c152?w=600&auto=format&fit=crop&q=80' },
];

export const PublicComplaintPortalModal: React.FC<PublicComplaintPortalModalProps> = ({
  isOpen,
  onClose,
  defaultLocation = 'FTW-01',
  onSubmitComplaint,
}) => {
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [location, setLocation] = useState(defaultLocation);
  const [issueCategory, setIssueCategory] = useState(ISSUE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  if (!isOpen) return null;

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
      status: 'Baru',
    };

    onSubmitComplaint(newComplaint);
    setSubmittedId(newId);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setReporterName('');
    setReporterPhone('');
    setLocation(defaultLocation);
    setIssueCategory(ISSUE_CATEGORIES[0]);
    setDescription('');
    setPhotoUrl('');
    setPhotoPreview(null);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative my-8 animate-in fade-in slide-in-from-bottom-3">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center font-bold shadow-sm">
              <MaterialIcon name="qr_code_2" className="text-2xl" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#0F766E] uppercase tracking-wider block">
                Portal Publik QR Code
              </span>
              <h3 className="font-extrabold text-slate-900 text-base">Form Laporan Kondisi Smart FTW</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        {isSubmitted ? (
          /* Halaman Sukses */
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <MaterialIcon name="check_circle" className="text-4xl" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                ID Aduan: {submittedId}
              </span>
              <h4 className="text-lg font-extrabold text-slate-900">Laporan Berhasil Terkirim!</h4>
              <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                Terima kasih. Laporan Anda telah diterima dan akan diteruskan kepada petugas.
              </p>
            </div>

            {/* Notification Dispatch Simulation Badge */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-[#0F766E]">
                  <MaterialIcon name="mark_email_read" className="text-base" /> Notifikasi Otomatis Tersebar:
                </span>
                <span className="bg-sky-100 text-sky-800 border border-sky-300 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  Status: Baru
                </span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 pl-1">
                <li className="flex items-center gap-1.5">
                  <MaterialIcon name="check" className="text-emerald-600 text-xs" />
                  <span><strong>Dashboard Ranger</strong> (Prioritas Lapangan)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MaterialIcon name="check" className="text-emerald-600 text-xs" />
                  <span><strong>Dashboard KLH</strong> (Pengawasan Baku Mutu)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MaterialIcon name="check" className="text-emerald-600 text-xs" />
                  <span><strong>Dashboard IPB</strong> (Analisis Dampak Lingkungan)</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
              >
                Buat Laporan Lain
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#0F766E] hover:bg-[#0d6760] text-white font-bold text-xs rounded-xl transition-all shadow-md"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        ) : (
          /* Form Aduan */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-2xl flex items-center gap-2.5 text-emerald-900">
              <MaterialIcon name="info" className="text-xl text-[#0F766E] flex-shrink-0" />
              <p className="text-[11px] font-medium leading-tight">
                Tanpa login. Laporan Anda langsung dikirimkan ke tim Ranger Situ Gede & instansi pengawas.
              </p>
            </div>

            {/* Nama Pelapor & HP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Pelapor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:bg-white focus:border-[#0F766E] focus:outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:bg-white focus:border-[#0F766E] focus:outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:bg-white focus:border-[#0F766E] focus:outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:bg-white focus:border-[#0F766E] focus:outline-none"
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
                rows={3}
                placeholder='Contoh: "Sensor terlihat mati", "Tanaman mengering", "Air berubah menjadi coklat", "Banyak sampah di sekitar alat"...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:bg-white focus:border-[#0F766E] focus:outline-none"
                required
              />
            </div>

            {/* Upload Foto / Attach Image */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Upload Foto Laporan <span className="text-slate-400 font-normal">(Bukti Fisik)</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                  <MaterialIcon name="add_a_photo" className="text-xl text-[#0F766E]" />
                  <span className="font-bold text-slate-700 text-xs">Pilih Foto dari Galeri / Kamera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>

                {/* Preset Sample Images for quick testing */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">Atau pilih contoh:</span>
                  {PRESET_SAMPLE_PHOTOS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setPhotoUrl(p.url);
                        setPhotoPreview(p.url);
                      }}
                      className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-lg border border-slate-200 transition-all whitespace-nowrap"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Image Preview */}
                {photoPreview && (
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-sm mt-2">
                    <img src={photoPreview} alt="Preview Laporan" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoUrl('');
                      }}
                      className="absolute top-2 right-2 p-1 bg-slate-900/70 text-white rounded-full hover:bg-rose-600 transition-all"
                    >
                      <MaterialIcon name="close" className="text-sm" />
                    </button>
                    <span className="absolute bottom-2 left-2 text-[10px] font-extrabold bg-slate-900/80 text-white px-2 py-0.5 rounded-md">
                      Foto Terlampir
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Footer Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0F766E] hover:bg-[#0d6760] text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <MaterialIcon name="send" className="text-base" />
                <span>Kirim Laporan</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default PublicComplaintPortalModal;
