import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import MaterialIcon from './MaterialIcon';

interface LoginModalProps {
  onLogin: (role: UserRole) => void;
  onCancel?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('klh');
  const [email, setEmail] = useState(MOCK_USERS.klh.email);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleRoleSelect = (r: UserRole) => {
    setSelectedRole(r);
    setEmail(MOCK_USERS[r].email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin(selectedRole);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full font-['Plus_Jakarta_Sans',sans-serif] overflow-y-auto lg:overflow-hidden bg-white">
      <div className="min-h-[100dvh] lg:h-screen grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Half (50%): Full-bleed Lake Image — no card, no margin, no radius */}
        <div className="relative h-[42vh] sm:h-[40vh] lg:h-full bg-[#042f2c] overflow-hidden text-white">
          <img
            src="/images/situgedelake.png"
            alt="Pemandangan Danau Situ Gede"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#042f2c]/95 via-teal-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-teal-950/20" />

          {/* Top Badge Overlay */}
          <div className="absolute top-8 left-8 z-10">
            <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-extrabold text-white border border-white/25 shadow-lg shadow-black/20">
              <MaterialIcon name="nature_people" className="text-base text-emerald-300" />
              <span>Situ Gede Eco-Conservation</span>            </div>
          </div>

          {/* Bottom Description Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-8 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
              Konservasi Danau<br />Smart FTW IoT
            </h2>
            <p className="max-w-md text-sm text-emerald-100/90 leading-relaxed font-medium drop-shadow">
              Pemantauan kualitas air real-time pada ekosistem Floating Treatment Wetland (FTW) terpadu Situ Gede.
            </p>
            <div className="flex items-center flex-wrap gap-2.5 text-[11px] text-emerald-200 font-bold pt-1">
              <span className="inline-flex items-center gap-1.5 bg-black/25 backdrop-blur border border-emerald-300/25 rounded-full px-3 py-1.5">
                <MaterialIcon name="sensors" className="text-emerald-300 text-sm" /> IoT Sensors
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/25 backdrop-blur border border-sky-300/25 rounded-full px-3 py-1.5">
                <MaterialIcon name="shield" className="text-sky-300 text-sm" /> KLH & IPB
              </span>
            </div>
          </div>
        </div>

        {/* Right Half (50%): Centered Login Card */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-white via-white to-teal-50/60 px-6 sm:px-12 py-10 overflow-hidden">
          {/* Ambient soft glows on the right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
          
          {/* Brand Header */}
          <div className="text-center mb-7">
            <div className="relative w-16 h-16 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg shadow-[#0F766E]/30 mx-auto mb-3 ring-4 ring-emerald-100 overflow-hidden">
              <img src="/images/ftw_icon.png" alt="SMART-FTW" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight uppercase">
              SMART<span className="text-[#0F766E]">-FTW</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              IoT-Enabled Floating Treatment Wetland Monitoring System
            </p>
          </div>

          {/* Role Selector Grid for 4 distinct roles */}
          <div className="mb-5">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px flex-1 max-w-[70px] bg-gradient-to-r from-transparent to-slate-200" />
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                Pilih Portal Akun
              </label>
              <div className="h-px flex-1 max-w-[70px] bg-gradient-to-l from-transparent to-slate-200" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'klh' as UserRole, label: 'KLH', icon: 'shield', org: 'Kementerian' },
                { id: 'ipb' as UserRole, label: 'IPB', icon: 'science', org: 'Akademik' },
                { id: 'ranger' as UserRole, label: 'Ranger', icon: 'engineering', org: 'Lapangan' },
                { id: 'masyarakat' as UserRole, label: 'Masyarakat', icon: 'qr_code_2', org: 'Form Aduan' },
              ].map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id)}
                    className={`group p-2.5 rounded-2xl border text-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#0F766E] to-[#065f46] text-white border-[#0F766E] shadow-lg shadow-[#0F766E]/25 scale-[1.03]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/60 hover:shadow-sm'
                    }`}
                  >
                    <MaterialIcon
                      name={r.icon}
                      className={`text-xl block mx-auto mb-1 ${isSelected ? 'text-emerald-200' : 'text-slate-400 group-hover:text-[#0F766E]'}`}
                    />
                    <div className="text-[11px] font-extrabold truncate">{r.label}</div>
                    <div className={`text-[9px] truncate ${isSelected ? 'text-emerald-100/90' : 'text-slate-400'}`}>
                      {r.org}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected User Profile Card */}
          <div className="p-3 bg-white/80 backdrop-blur rounded-2xl border border-emerald-200/80 shadow-sm mb-5 flex items-center gap-3 animate-in fade-in duration-200">
            <div className="relative">
              <img
                src={MOCK_USERS[selectedRole].avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#0F766E]/25"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <h4 className="text-xs font-extrabold text-slate-900 truncate">
                {MOCK_USERS[selectedRole].name}
              </h4>
              <p className="text-[11px] text-[#0F766E] truncate font-bold">
                {MOCK_USERS[selectedRole].title}
              </p>
            </div>
            <span className="shrink-0 text-[9px] font-black text-white bg-[#0F766E]/90 px-2 py-1 rounded-lg uppercase tracking-wider">
              {selectedRole}
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Alamat Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 pl-10 text-slate-800 font-medium shadow-sm transition-all focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 hover:border-slate-300"
                  required
                />
                <MaterialIcon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 pl-10 pr-10 text-slate-800 font-medium shadow-sm transition-all focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 hover:border-slate-300"
                  required
                />
                <MaterialIcon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-[#0F766E] w-4 h-4 cursor-pointer"
                />
                <span>Ingat sesi perangkat ini</span>
              </label>
              <span className="text-[#0F766E] hover:underline font-bold cursor-pointer transition-colors">
                Lupa kata sandi?
              </span>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 bg-gradient-to-r from-[#0F766E] to-[#065f46] hover:from-[#0d6760] hover:to-[#065f46] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#0F766E]/25 transition-all duration-200 flex items-center justify-center gap-2 mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isAuthenticating ? (
                <>
                  <MaterialIcon name="sync" className="animate-spin text-base" />
                  <span>Otentikasi Pengguna...</span>
                </>
              ) : (
                <>
                  <MaterialIcon name="login" className="text-base" />
                  <span>Masuk Dashboard Portal ({selectedRole.toUpperCase()})</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-[10px] text-slate-400 font-medium">
            Versi Simulasi IoT • Portal Situ Gede Monitoring System
          </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;
