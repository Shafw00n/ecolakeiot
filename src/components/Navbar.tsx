import React, { useState } from 'react';
import { User, UserRole, MetricStatus } from '../types';
import { MOCK_USERS } from '../data/mockData';
import MaterialIcon from './MaterialIcon';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  simulationMode: MetricStatus;
  onSimulationModeChange: (mode: MetricStatus) => void;
  unreadCount: number;
  onToggleNotifications: () => void;
  onOpenFTWDiagram: () => void;
  onOpenPublicPortal?: () => void;
  onMobileMenuToggle: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  simulationMode,
  onSimulationModeChange,
  unreadCount,
  onToggleNotifications,
  onOpenFTWDiagram,
  onOpenPublicPortal,
  onMobileMenuToggle,
  onLogout,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const isMasyarakat = currentUser.role === 'masyarakat';

  return (
    <header
      className={`sticky top-0 z-30 transition-all shadow-md ${
        isMasyarakat
          ? 'bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#38BDF8] text-white border-b border-sky-300/40'
          : 'bg-white border-b border-slate-200 text-slate-900 shadow-xs'
      } px-4 lg:px-8 py-3.5`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {!isMasyarakat && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-xl transition-colors text-slate-600 hover:bg-slate-100"
              title="Buka Menu"
            >
              <MaterialIcon name="menu" className="text-2xl" />
            </button>
          )}

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                isMasyarakat
                  ? 'bg-gradient-to-br from-sky-300 to-emerald-400 text-slate-950 font-black'
                  : 'bg-gradient-to-br from-[#0F766E] to-[#0284C7] text-white'
              }`}
            >
              {isMasyarakat ? (
                <MaterialIcon name="record_voice_over" className="text-2xl" />
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
                </svg>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-xl uppercase leading-tight">
                  {isMasyarakat ? (
                    <>
                      EcoLake<span className="text-sky-300">.Warga</span>
                    </>
                  ) : (
                    <>
                      EcoLake<span className="text-sky-600">.IoT</span>
                    </>
                  )}
                </span>
                <span className="hidden sm:inline-block bg-sky-50 text-sky-700 border border-sky-200/80 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Lake IoT
                </span>
              </div>
              <p className={`text-xs hidden sm:block ${isMasyarakat ? 'text-sky-100/90' : 'text-slate-500'}`}>
                {isMasyarakat
                  ? 'Layanan Pengaduan & Aspirasi Masyarakat Situ Gede'
                  : 'Situ Gede Smart Water Quality Monitoring'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Monitoring Controls (Only for KLH, IPB, Ranger) */}
        {!isMasyarakat && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenFTWDiagram}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100/80 rounded-xl border border-sky-200 transition-all shadow-xs"
            >
              <MaterialIcon name="schema" className="text-base text-sky-600" />
              <span>Arsitektur FTW System</span>
            </button>

            {onOpenPublicPortal && (
              <button
                onClick={onOpenPublicPortal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#0F766E] to-sky-700 hover:from-[#0d6760] hover:to-sky-800 rounded-xl transition-all shadow-xs"
                title="Portal Aduan Masyarakat (Scan QR)"
              >
                <MaterialIcon name="qr_code_2" className="text-base text-sky-200" />
                <span>Portal QR Aduan</span>
              </button>
            )}

            {/* Mode Simulation Toggle */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <span className="text-slate-500 px-2.5 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider">
                <MaterialIcon name="tune" className="text-sm" />
                Simulasi:
              </span>
              <button
                onClick={() => onSimulationModeChange('Good')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  simulationMode === 'Good'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onSimulationModeChange('Warning')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  simulationMode === 'Warning'
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Peringatan
              </button>
              <button
                onClick={() => onSimulationModeChange('Critical')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  simulationMode === 'Critical'
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kritis
              </button>
            </div>
          </div>
        )}

        {/* Right: Notifications, Role Selector & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Notifications Button (Only for KLH, IPB, Ranger) */}
          {!isMasyarakat && (
            <button
              onClick={onToggleNotifications}
              className="relative p-2.5 rounded-xl transition-colors border bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200/80"
              title="Notifikasi System"
            >
              <MaterialIcon name="notifications" className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          )}



          {/* Role Switcher & User Profile Dropdown */}
          {isMasyarakat ? (
            <button
              onClick={() => onLogout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold border border-white/20 transition-all shadow-xs"
              title="Kembali ke halaman login"
            >
              <MaterialIcon name="logout" className="text-base" />
              <span className="hidden sm:inline">Keluar Portal</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl transition-all border shadow-xs bg-white hover:bg-slate-100 border-slate-200 text-slate-900"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-600/30"
                />
                <div className="text-left hidden sm:block pr-1">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name.split(',')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]"></span>
                    {currentUser.role}
                  </div>
                </div>
                <MaterialIcon name="arrow_drop_down" className="text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showRoleDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pengguna Aktif</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#0F766E] font-semibold truncate">{currentUser.organization}</p>
                  </div>

                  <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ganti Role Simulasi (4 Portal)
                  </div>

                  {(['klh', 'ipb', 'ranger', 'masyarakat'] as UserRole[]).map((r) => {
                    const userObj = MOCK_USERS[r];
                    const isActive = currentUser.role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          onRoleChange(r);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-900 font-bold border-l-4 border-[#0F766E]'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MaterialIcon
                            name={
                              r === 'klh'
                                ? 'shield'
                                : r === 'ipb'
                                ? 'science'
                                : r === 'ranger'
                                ? 'engineering'
                                : 'qr_code_2'
                            }
                            className={`text-base ${isActive ? 'text-[#0F766E]' : 'text-slate-400'}`}
                          />
                          <div>
                            <div className="capitalize font-semibold">
                              {r === 'masyarakat' ? 'Masyarakat' : r.toUpperCase()} Portal
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                              {userObj.organization}
                            </div>
                          </div>
                        </div>
                        {isActive && <MaterialIcon name="check" className="text-[#0F766E] text-sm" />}
                      </button>
                    );
                  })}

                  <div className="border-t border-slate-100 mt-2 pt-1 px-2">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 font-semibold"
                    >
                      <MaterialIcon name="logout" className="text-base" />
                      <span>Keluar Simulasi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;
