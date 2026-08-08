import React from 'react';
import { UserRole, MetricStatus } from '../types';
import MaterialIcon from './MaterialIcon';

export type ActiveTab =
  | 'monitoring'
  | 'klh_executive'
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
  simulationMode: MetricStatus;
  onSimulationModeChange: (mode: MetricStatus) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  isMobileOpen,
  onCloseMobile,
  onOpenFTWDiagram,
  simulationMode,
  onSimulationModeChange,
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
          label: 'Ringkasan Eksekutif & Komparasi',
          icon: 'analytics',
          description: 'Indeks WQI, Baku Mutu & Antar-Danau',
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
          label: 'Lab & Bio-Filtrasi',
          icon: 'science',
          description: 'Validasi Sampel Air & Kinerja Vetiver, Canna, Typha',
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
        label: 'Patroli & Laporan',
        icon: 'checklist',
        description: 'Checklist, Insiden & Aduan Masyarakat',
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
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 lg:z-20 h-[calc(100dvh)] lg:h-[calc(100dvh-4rem)] w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto flex-1">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between -mx-4 -mt-4 px-4 py-4 mb-4 bg-gradient-to-r from-[#0F766E] to-[#0D9488] lg:hidden" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur border border-white/25 text-white flex items-center justify-center shadow-sm">
                <MaterialIcon name="eco" className="text-xl" />
              </div>
              <div>
                <span className="block font-extrabold text-white text-base leading-tight">SMART-FTW</span>
                <span className="block text-[9px] text-emerald-100/90 font-bold uppercase tracking-wider">
                  Floating Treatment Wetland Monitoring
                </span>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="flex items-center justify-center w-11 h-11 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors active:scale-95"
              aria-label="Tutup menu"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>
          </div>

          {/* Role Portal Header Badge */}
          <div className={`mb-4 p-3.5 rounded-2xl border ${portalMeta.border} bg-gradient-to-br from-slate-50 to-emerald-50/50 shadow-sm flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md ${portalMeta.color}`}>
              <MaterialIcon name={portalMeta.icon} className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold text-[#0F766E] uppercase tracking-wider block">
                {portalMeta.title}
              </span>
              <p className="text-[11px] font-bold text-slate-700 truncate">{portalMeta.sub}</p>
            </div>
            <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Mobile Simulation Mode Selector (only in drawer) */}
          {userRole !== 'masyarakat' && (
          <div className="mb-4 p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm lg:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MaterialIcon name="tune" className="text-sm text-[#0F766E]" />
                Simulasi Kondisi Air
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { key: 'Good' as MetricStatus, label: 'Aman', active: 'bg-emerald-600 text-white border-emerald-600 shadow-xs', inactive: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { key: 'Warning' as MetricStatus, label: 'Waspada', active: 'bg-amber-500 text-white border-amber-500 shadow-xs', inactive: 'bg-amber-50 text-amber-700 border-amber-200' },
                { key: 'Critical' as MetricStatus, label: 'Bahaya', active: 'bg-rose-600 text-white border-rose-600 shadow-xs', inactive: 'bg-rose-50 text-rose-700 border-rose-200' },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onSimulationModeChange(opt.key)}
                  className={`flex items-center justify-center px-1.5 py-2 rounded-lg text-[10px] font-extrabold border transition-all active:scale-95 ${
                    simulationMode === opt.key ? opt.active : opt.inactive
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          )}

          <div className="flex items-center gap-3 mb-2 px-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Menu Portal {userRole.toUpperCase()}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
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
                  className={`group relative w-full text-left px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white font-bold shadow-lg shadow-[#0F766E]/25'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full transition-all ${
                      isActive ? 'bg-emerald-300' : 'bg-transparent group-hover:bg-slate-300'
                    }`}
                  />
                  <MaterialIcon
                    name={item.icon}
                    className={`text-xl ${isActive ? 'text-emerald-200' : 'text-slate-400 group-hover:text-[#0F766E]'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold truncate">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                            isActive
                              ? 'bg-emerald-300/20 text-emerald-100 border border-emerald-200/40'
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        <MaterialIcon
                          name="chevron_right"
                          className={`text-lg shrink-0 transition-transform ${
                            isActive ? 'text-emerald-100' : 'text-slate-300 group-hover:translate-x-0.5'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[10px] block truncate ${
                        isActive ? 'text-emerald-100/90 font-medium' : 'text-slate-400'
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
          <div className="mt-6 p-4 bg-gradient-to-br from-[#0F766E]/[0.06] to-emerald-50 rounded-2xl border border-emerald-200/70">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs mb-1">
              <span className="w-7 h-7 rounded-lg bg-[#0F766E] text-white flex items-center justify-center shadow-sm">
                <MaterialIcon name="sensors" className="text-sm" />
              </span>
              <span>Smart FTW Situ Gede</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug pl-9">
              Monitoring IoT sensor kualitas air & bio-filtrasi tanaman terapung.
            </p>
            <button
              onClick={onOpenFTWDiagram}
              className="mt-2.5 ml-9 text-[11px] font-bold text-[#0F766E] hover:bg-[#0F766E] hover:text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              <span>Infografis Arsitektur</span>
              <MaterialIcon name="arrow_forward" className="text-xs" />
            </button>
          </div>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-slate-100 text-center" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Peran Aktif: {userRole.toUpperCase()}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">v1.0</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Fixed bottom for mobile screens) */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch justify-around px-1 pt-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                aria-label={item.label}
                className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all tap-target-none active:scale-95 ${
                  isActive ? 'text-[#0F766E] font-extrabold' : 'text-slate-500 hover:bg-slate-100'
                }`}
                style={{ minHeight: 48 }}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[#0F766E]" />
                )}
                <MaterialIcon
                  name={item.icon}
                  className={`text-2xl ${isActive ? 'icon-filled' : ''}`}
                />
                <span className="text-[9px] mt-0.5 max-w-[60px] truncate">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
