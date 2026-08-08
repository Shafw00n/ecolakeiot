import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const ROLE_ROUTES: Record<UserRole, string> = {
  klh: '/dashboard/klh',
  ipb: '/dashboard/ipb',
  ranger: '/dashboard/ranger',
  masyarakat: '/dashboard/community',
};
import { useApp } from '../contexts/AppContext';
import Navbar from '../components/Navbar';
import Sidebar, { ActiveTab } from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import FTWDiagramModal from '../components/FTWDiagramModal';
import QRScannerModal from '../components/QRScannerModal';
import PublicComplaintPortalModal from '../components/PublicComplaintPortalModal';
import CriticalAlertModal from '../components/CriticalAlertModal';
import MaterialIcon from '../components/MaterialIcon';

interface RoleLayoutProps {
  role: UserRole;
}

const TOAST_STYLES: Record<string, string> = {
  info: 'border-teal-500/40 text-teal-400',
  success: 'border-emerald-500/50 text-emerald-400',
  warning: 'border-amber-500/50 text-amber-400',
  critical: 'border-rose-500/50 text-rose-400',
};

export const RoleLayout: React.FC<RoleLayoutProps> = ({ role }) => {
  const {
    currentUser,
    login,
    logout,
    simulationMode,
    setSimulationMode,
    waterMetrics,
    unreadCount,
    notifications,
    ftwUnits,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    isFTWDiagramOpen,
    setIsFTWDiagramOpen,
    isQRScannerOpen,
    setIsQRScannerOpen,
    isPublicPortalOpen,
    setIsPublicPortalOpen,
    publicPortalDefaultLocation,
    openPublicPortal,
    handleAddPublicComplaint,
    handleMarkAllNotificationsRead,
    handleClearNotifications,
    toast,
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('monitoring');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCriticalAlertShown, setIsCriticalAlertShown] = useState(false);

  useEffect(() => {
    if (simulationMode === 'Critical' && !isCriticalAlertShown) {
      setIsCriticalAlertShown(true);
    }
    if (simulationMode !== 'Critical') {
      setIsCriticalAlertShown(false);
    }
  }, [simulationMode]);

  const handleRoleChange = (r: UserRole) => {
    login(r);
    navigate(ROLE_ROUTES[r]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        simulationMode={simulationMode}
        onSimulationModeChange={setSimulationMode}
        unreadCount={unreadCount}
        onToggleNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenFTWDiagram={() => setIsFTWDiagramOpen(true)}
        onOpenPublicPortal={openPublicPortal}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onLogout={handleLogout}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={role}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenFTWDiagram={() => setIsFTWDiagramOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-8 overflow-x-hidden min-w-0">
          <Outlet context={{ role, activeTab, setActiveTab }} />
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-[60] max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border ${TOAST_STYLES[toast.level]} text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3`}
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <MaterialIcon name={toast.level === 'success' ? 'check_circle' : toast.level === 'critical' ? 'error' : 'info'} className="text-lg" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Drawers & Modals */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
      />

      <FTWDiagramModal
        isOpen={isFTWDiagramOpen}
        onClose={() => setIsFTWDiagramOpen(false)}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        ftwUnits={ftwUnits}
        onOpenPublicPortal={openPublicPortal}
      />

      <PublicComplaintPortalModal
        isOpen={isPublicPortalOpen}
        onClose={() => setIsPublicPortalOpen(false)}
        defaultLocation={publicPortalDefaultLocation}
        onSubmitComplaint={handleAddPublicComplaint}
      />
      {/* Critical Alert */}
      <CriticalAlertModal
        isOpen={isCriticalAlertShown}
        onClose={() => setIsCriticalAlertShown(false)}
        metrics={waterMetrics}
      />
    </div>
  );
};

export default RoleLayout;