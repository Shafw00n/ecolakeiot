import React from 'react';
import { UserRole } from '../types';
import MaterialIcon from './MaterialIcon';

export type ActiveTab =
  | 'monitoring'
  | 'klh_executive'
  | 'klh_lakes'
  | 'klh_ai_policy'
  | 'ipb_lab'
  | 'ipb_wetland'
  | 'ipb_eutrophication'
  | 'ranger_checklist'
  | 'ranger_reports'
  | 'ranger_qr'
  | 'community'
  | 'database'
  | 'settings';

export interface NavItem {
  id: ActiveTab;
  label: string;
  icon: string;
  description: string;
  badge?: string;
}

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userRole: UserRole;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenFTWDiagram: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  isMobileOpen,
  onCloseMobile,
  onOpenFTWDiagram,
}) => {
  // Define Role-based navigation items
  const getNavItems = (): NavItem[] => {
    const sharedMonitoring: NavItem = {
      id: 'monitoring',
      label: 'Monitoring Real-Time',
      icon: 'dashboard',
      description: 'Peta Smart FTW, 5 Sensor & Historis',
      badge: 'Utama',
    };

    if (userRole === 'klh') {
      return [
        sharedMonitoring,
        {
          id: 'klh_executive' as ActiveTab,
          label: 'Ringkasan Eksekutif WQI',
          icon: 'analytics',
          description: 'Indeks WQI & Baku Mutu Kelas II',
        },
        {
          id: 'klh_lakes' as ActiveTab,
          label: 'Komparasi & Baku Mutu',
          icon: 'compare_arrows',
          description: 'Situ Gede vs Sunter & Maninjau',
        },
        {
          id: 'database' as ActiveTab,
          label: 'Audit Telemetri KLH',
          icon: 'database',
          description: 'Database Sensor Terpusat',
        },
        {
          id: 'settings' as ActiveTab,
          label: 'Threshold Baku Mutu',
          icon: 'settings',
          description: 'Pengaturan Ambang Batas Air',
        },
      ];
    }

    if (userRole === 'ipb') {
      return [
        sharedMonitoring,
        {
          id: 'ipb_lab' as ActiveTab,
          label: 'Sampel Laboratorium',
          icon: 'science',
          description: 'Validasi Sampel Air & Kimia',
        },
        {
          id: 'ipb_wetland' as ActiveTab,
          label: 'Serapan Bio-Filtrasi',
          icon: 'grass',
          description: 'Kinerja Vetiver, Canna, Typha',
        },
        {
          id: 'database' as ActiveTab,
          label: 'Export Raw Dataset',
          icon: 'download',
          description: 'Unduh File Telemetri Sensor',
        },
        {
          id: 'settings' as ActiveTab,
          label: 'Kalibrasi Sensor Lab',
          icon: 'tune',
          description: 'Parameter Sensor IPB Lab',
        },
      ];
    }

    if (userRole === 'masyarakat') {
      return [
        {
          id: 'community' as ActiveTab,
          label: 'Form Aduan Masyarakat',
          icon: 'record_voice_over',
          description: 'Portal Pengaduan QR Code Warga',
          badge: 'Utama',
        },
      ];
    }

    // Default for Ranger Role
    return [
      sharedMonitoring,
      {
        id: 'ranger_checklist' as ActiveTab,
        label: 'Checklist Patroli Harian',
        icon: 'checklist',
        description: 'Pemeriksaan Unit FTW Lapangan',
      },
      {
        id: 'ranger_reports' as ActiveTab,
        label: 'Input Laporan Lapangan',
        icon: 'report',
        description: 'Form Insiden & Masalah Fisik Air',
      },
      {
        id: 'community' as ActiveTab,
        label: 'Daftar Aduan Masyarakat',
        icon: 'mark_email_unread',
        description: 'Laporan Masuk dari Warga (Prioritas)',
      },
      {
        id: 'database' as ActiveTab,
        label: 'Database Sensor Field',
        icon: 'database',
        description: 'Tabel Sensor IoT Lapangan',
      },
      {
        id: 'settings' as ActiveTab,
        label: 'Notifikasi & HP Ranger',
        icon: 'smartphone',
        description: 'Pengaturan Alert Push Ranger',
      },
    ];
  };

  const navItems = getNavItems();

  const getRolePortalMeta = () => {
    if (userRole === 'klh') {
      return {
        title: 'Portal KLH Executive',
        sub: 'Pengawasan Regulasi & Baku Mutu',
        icon: 'shield',
        color: 'bg-[#0F766E] text-white',
        border: 'border-emerald-200',
      };
    }
    if (userRole === 'ipb') {
      return {
        title: 'Portal Riset IPB',
        sub: 'Laboratorium & Fitoremediasi',
        icon: 'science',
        color: 'bg-cyan-800 text-white',
        border: 'border-cyan-200',
      };
    }
    if (userRole === 'masyarakat') {
      return {
        title: 'Portal Warga & Publik',
        sub: 'Aduan QR Code Situ Gede',
        icon: 'qr_code_2',
        color: 'bg-emerald-600 text-white',
        border: 'border-emerald-200',
      };
    }
    return {
      title: 'Portal Ranger Field',
      sub: 'Patroli Preservasi & Komunitas',
      icon: 'checklist',
      color: 'bg-emerald-700 text-white',
      border: 'border-emerald-200',
    };
  };

  const portalMeta = getRolePortalMeta();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container (Desktop Sidebar + Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-[calc(100vh)] lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto flex-1">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold">
                <MaterialIcon name="eco" className="text-xl" />
              </div>
              <span className="font-extrabold text-slate-800 text-base">EcoLake IoT</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>
          </div>

          {/* Role Portal Header Badge */}
          <div className="mb-4 p-3 rounded-2xl border border-sky-200/80 bg-gradient-to-br from-slate-50 to-sky-50/60 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-xs ${portalMeta.color}`}>
              <MaterialIcon name={portalMeta.icon} className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block">
                {portalMeta.title}
              </span>
              <p className="text-[11px] font-bold text-slate-700 truncate">{portalMeta.sub}</p>
            </div>
          </div>

          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Menu Portal {userRole.toUpperCase()}
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-50 to-emerald-50/60 text-slate-900 font-bold shadow-xs border border-sky-300 ring-1 ring-sky-400/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <MaterialIcon
                    name={item.icon}
                    className={`text-xl ${isActive ? 'text-sky-600' : 'text-slate-400'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-sky-100 text-sky-800 border border-sky-200/80 font-extrabold px-2 py-0.5 rounded-full uppercase ml-1">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] block truncate ${
                        isActive ? 'text-sky-700 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Info Box in Sidebar */}
          <div className="mt-6 p-3 bg-gradient-to-br from-slate-50 to-emerald-50/60 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs mb-1">
              <MaterialIcon name="sensors" className="text-[#0F766E] text-base" />
              <span>Smart FTW Situ Gede</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Monitoring IoT sensor kualitas air & bio-filtrasi tanaman terapung.
            </p>
            <button
              onClick={onOpenFTWDiagram}
              className="mt-2 text-[11px] font-bold text-[#0F766E] hover:underline flex items-center gap-1"
            >
              <span>Infografis Arsitektur</span>
              <MaterialIcon name="arrow_forward" className="text-xs" />
            </button>
          </div>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Role Active: {userRole.toUpperCase()}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Fixed bottom for mobile screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-xs transition-colors ${
                isActive ? 'text-[#0F766E] font-extrabold' : 'text-slate-500'
              }`}
            >
              <MaterialIcon name={item.icon} className="text-xl" />
              <span className="text-[9px] mt-0.5 max-w-[55px] truncate">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
