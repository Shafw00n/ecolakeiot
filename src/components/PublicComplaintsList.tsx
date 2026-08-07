import React, { useState } from 'react';
import MaterialIcon from './MaterialIcon';
import { PublicComplaint, UserRole, ComplaintStatus } from '../types';

interface PublicComplaintsListProps {
  complaints: PublicComplaint[];
  userRole: UserRole;
  onUpdateStatus?: (id: string, newStatus: ComplaintStatus) => void;
  onOpenPublicPortal?: () => void;
}

export const PublicComplaintsList: React.FC<PublicComplaintsListProps> = ({
  complaints,
  userRole,
  onUpdateStatus,
  onOpenPublicPortal,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | ComplaintStatus>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus === 'All') return true;
    return c.status === filterStatus;
  });

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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold">
            <MaterialIcon name="mark_email_unread" className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">Daftar Aduan Terbaru dari Masyarakat</h3>
              {userRole === 'ranger' && (
                <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Prioritas Ranger Lapangan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Laporan langsung publik via QR Code lokasi Smart FTW Situ Gede
            </p>
          </div>
        </div>

        {onOpenPublicPortal && (
          <button
            onClick={onOpenPublicPortal}
            className="px-4 py-2 bg-[#0F766E] hover:bg-[#0d6760] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <MaterialIcon name="qr_code_scanner" className="text-base" />
            <span>Simulasi Scan QR / Submit Aduan</span>
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
          {(['All', 'New', 'In Progress', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                filterStatus === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}{' '}
              <span className="text-[10px] opacity-70">
                ({st === 'All' ? complaints.length : complaints.filter((c) => c.status === st).length})
              </span>
            </button>
          ))}
        </div>

        <div className="text-[11px] font-semibold text-slate-400">
          Role Aktif: <span className="font-extrabold text-[#0F766E] uppercase">{userRole}</span>
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <MaterialIcon name="inbox" className="text-3xl text-slate-300 mb-1" />
          <p className="text-xs font-bold text-slate-500">Belum ada aduan masyarakat pada filter ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border transition-all ${
                c.status === 'New'
                  ? 'bg-sky-50/40 border-sky-200/80 hover:border-sky-300'
                  : c.status === 'In Progress'
                  ? 'bg-amber-50/40 border-amber-200/80'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {c.id}
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{c.issueCategory}</span>
                  <span className="bg-slate-200 text-slate-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                    {c.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(c.status)}
                  <span className="text-[10px] text-slate-400 font-semibold">{c.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-3 font-medium bg-white/70 p-2.5 rounded-xl border border-slate-100">
                "{c.description}"
              </p>

              {/* Reporter Info & Photo preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100/80">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <MaterialIcon name="person" className="text-slate-400 text-base" />
                    <span>{c.reporterName}</span>
                    {c.reporterPhone && (
                      <span className="text-slate-400 text-[11px]">({c.reporterPhone})</span>
                    )}
                  </div>

                  {c.photoUrl && (
                    <button
                      onClick={() => setSelectedImage(c.photoUrl || null)}
                      className="text-[#0F766E] hover:underline font-bold flex items-center gap-1 text-[11px] px-2 py-2"
                    >
                      <MaterialIcon name="image" className="text-base" />
                      <span>Lihat Foto Bukti</span>
                    </button>
                  )}
                </div>

                {/* Status Updater Buttons (especially for Ranger) */}
                {onUpdateStatus && (
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {c.status === 'New' && (
                      <button
                        onClick={() => onUpdateStatus(c.id, 'In Progress')}
                        className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] rounded-lg shadow-2xs transition-all flex items-center gap-1 active:scale-95"
                      >
                        <MaterialIcon name="engineering" className="text-sm" />
                        <span>Start Processing</span>
                      </button>
                    )}

                    {c.status !== 'Resolved' && (
                      <button
                        onClick={() => onUpdateStatus(c.id, 'Resolved')}
                        className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg shadow-2xs transition-all flex items-center gap-1 active:scale-95"
                      >
                        <MaterialIcon name="check_circle" className="text-sm" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image View Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-slate-900 p-3 rounded-2xl max-w-lg w-full relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-slate-800 p-1.5 rounded-full hover:bg-rose-600 transition-all"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>
            <img src={selectedImage} alt="Foto Bukti Aduan" className="w-full h-auto rounded-xl max-h-[75vh] object-contain" />
          </div>
        </div>
      )}

    </div>
  );
};

export default PublicComplaintsList;
