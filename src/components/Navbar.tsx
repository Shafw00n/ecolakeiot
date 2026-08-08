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
      className="sticky top-0 z-30 transition-all shadow-xs bg-white border-b border-slate-200 text-slate-900 px-4 lg:px-8 py-3.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {!isMasyarakat && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl transition-colors text-slate-600 hover:bg-slate-100 active:scale-95 tap-target-none"
              style={{ minWidth: 48, minHeight: 48 }}
              title="Buka Menu"
              aria-label="Buka menu navigasi"
            >
              <MaterialIcon name="menu" className="text-2xl" />
            </button>
          )}

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden ${
                isMasyarakat
                  ? 'bg-gradient-to-br from-sky-300 to-emerald-400'
                  : 'bg-gradient-to-br from-[#0F766E] to-[#0284C7]'
              }`}
            >
              <img src="/images/ftw_icon.png" alt="SMART-FTW" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-xl uppercase leading-tight">
                  {isMasyarakat ? (
                    <>
                      SMART<span className="text-[#0F766E]">.Warga</span>
                    </>
                  ) : (
                    <>
                      SMART<span className="text-sky-600">-FTW</span>
                    </>
                  )}
                </span>
                <span className="hidden sm:inline-block bg-sky-50 text-sky-700 border border-sky-200/80 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Lake IoT
                </span>
              </div>
              <p className="text-xs hidden sm:block text-slate-500">
                {isMasyarakat
                  ? 'Layanan Pengaduan & Aspirasi Masyarakat Situ Gede'
                  : 'Floating Treatment Wetland Monitoring System'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Monitoring Controls (Only for KLH, IPB, Ranger) */}
        {!isMasyarakat && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenFTWDiagram}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100/80 rounded-xl border border-sky-200 transition-all shadow-xs active:scale-95"
            >
              <MaterialIcon name="schema" className="text-base text-sky-600" />
              <span>Arsitektur FTW System</span>
            </button>

            {/* Mode Simulation Toggle */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <span className="text-slate-500 px-2.5 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider">
                <MaterialIcon name="tune" className="text-sm" />
                Simulasi:
              </span>
              <button
                onClick={() => onSimulationModeChange('Good')}
                className={`px-3.5 py-2 rounded-lg transition-all font-semibold ${
                  simulationMode === 'Good'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
                }`}
              >
                Aman
              </button>
              <button
                onClick={() => onSimulationModeChange('Warning')}
                className={`px-3.5 py-2 rounded-lg transition-all font-semibold ${
                  simulationMode === 'Warning'
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
                }`}
              >
                Waspada
              </button>
              <button
                onClick={() => onSimulationModeChange('Critical')}
                className={`px-3.5 py-2 rounded-lg transition-all font-semibold ${
                  simulationMode === 'Critical'
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
                }`}
              >
                Bahaya
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
              className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors border bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200/80 active:scale-95"
              style={{ minWidth: 48, minHeight: 48 }}
              title="Notifikasi System"
              aria-label="Buka notifikasi"
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
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition-all shadow-xs active:scale-95"
              style={{ minHeight: 48 }}
              title="Kembali ke halaman login"
            >
              <MaterialIcon name="logout" className="text-base" />
              <span className="hidden sm:inline">Keluar Portal</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl transition-all border shadow-xs bg-white hover:bg-slate-100 border-slate-200 text-slate-900 active:scale-[0.98]"
                style={{ minHeight: 48 }}
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
                        className={`w-full text-left px-4 py-3 text-xs flex items-center justify-between transition-colors active:scale-[0.99] ${
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
                      className="w-full text-left px-3 py-3 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 font-semibold"
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
