import React, { useState } from 'react';
import { NotificationItem } from '../types';
import MaterialIcon from './MaterialIcon';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearNotifications,
}) => {
  const [filter, setFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return n.severity === 'critical' || n.type === 'water_alert';
    if (filter === 'public') return n.type === 'public_complaint';
    return true;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'water_alert':
        return 'water_drop';
      case 'sensor_offline':
        return 'sensors_off';
      case 'battery_low':
        return 'battery_alert';
      case 'ranger_report':
        return 'report';
      case 'public_complaint':
        return 'mark_email_unread';
      case 'academic_validation':
        return 'science';
      case 'maintenance':
        return 'build';
      default:
        return 'notifications';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen sm:w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}>
            <div className="flex items-center gap-2">
              <MaterialIcon name="notifications" className="text-teal-400 text-2xl" />
              <div>
                <h3 className="font-bold text-base">Pusat Notifikasi System</h3>
                <p className="text-xs text-slate-400">Peringatan Kualitas Air & Status IoT</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white active:scale-95 transition-all"
              aria-label="Tutup notifikasi"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>
          </div>

          {/* Controls & Filter Bar */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-2.5 rounded-xl transition-all active:scale-95 ${
                  filter === 'all'
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-3.5 py-2.5 rounded-xl transition-all active:scale-95 ${
                  filter === 'critical'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Alert Air
              </button>
              <button
                onClick={() => setFilter('public')}
                className={`px-3.5 py-2.5 rounded-xl transition-all active:scale-95 ${
                  filter === 'public'
                    ? 'bg-[#0F766E] text-white font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Aduan Warga
              </button>
            </div>

            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-teal-700 hover:underline px-2 py-2.5"
            >
              Tandai Dibaca
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <MaterialIcon name="notifications_paused" className="text-4xl text-slate-300 mb-2" />
                <p className="text-sm font-semibold">Tidak ada notifikasi saat ini.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    notif.read ? 'bg-white border-slate-200' : 'bg-teal-50/60 border-teal-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl flex items-center justify-center text-white ${
                        notif.severity === 'critical'
                          ? 'bg-rose-500'
                          : notif.severity === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-teal-600'
                      }`}
                    >
                      <MaterialIcon name={getIconForType(notif.type)} className="text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-right" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}>
            <button
              onClick={onClearNotifications}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-2.5"
            >
              Bersihkan Notifikasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
