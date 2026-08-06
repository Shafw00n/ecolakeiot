import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  WaterMetrics,
  FTWUnit,
  MetricStatus,
  LaboratorySample,
  RangerChecklistItem,
  RangerReport,
  NotificationItem,
  AIDecision,
  SystemTelemetryHistory,
  PublicComplaint,
} from './types';
import {
  MOCK_USERS,
  INITIAL_WATER_METRICS,
  INITIAL_FTW_UNITS,
  INITIAL_LAKE_COMPARISONS,
  INITIAL_LAB_SAMPLES,
  INITIAL_RANGER_CHECKLIST,
  INITIAL_RANGER_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AI_DECISIONS,
  GENERATE_TELEMETRY_HISTORY,
} from './data/mockData';

import Navbar from './components/Navbar';
import Sidebar, { ActiveTab } from './components/Sidebar';
import NotificationDrawer from './components/NotificationDrawer';
import FTWDiagramModal from './components/FTWDiagramModal';
import QRScannerModal from './components/QRScannerModal';
import PublicComplaintPortalModal from './components/PublicComplaintPortalModal';
import LoginModal from './components/LoginModal';

import MainDashboardView from './views/MainDashboardView';
import KLHView from './views/KLHView';
import IPBView from './views/IPBView';
import RangerView from './views/RangerView';
import CommunityView from './views/CommunityView';
import MasyarakatView from './views/MasyarakatView';
import DatabaseView from './views/DatabaseView';
import SettingsView from './views/SettingsView';
import MaterialIcon from './components/MaterialIcon';

const INITIAL_PUBLIC_COMPLAINTS: PublicComplaint[] = [
  {
    id: 'ADUAN-8492',
    reporterName: 'Budi Santoso',
    reporterPhone: '081234567890',
    location: 'FTW-02',
    issueCategory: 'Sensor/alat FTW rusak',
    description: 'Sensor pH & DO terlihat mati dan kabel telemetry agak kendur di sisi timur rakit FTW-02.',
    timestamp: '14:32 WIB',
    status: 'Baru',
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ADUAN-8488',
    reporterName: 'Siti Rahmawati',
    reporterPhone: '085711223344',
    location: 'FTW-01',
    issueCategory: 'Sampah di sekitar FTW',
    description: 'Banyak sampah plastik botol minuman tersangkut di perimeter pelampung FTW-01.',
    timestamp: '11:15 WIB',
    status: 'Diproses',
    photoUrl: 'https://images.unsplash.com/photo-1544830728-872f9b17c152?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ADUAN-8475',
    reporterName: 'Ahmad Fauzi',
    location: 'FTW-03',
    issueCategory: 'Tanaman FTW rusak',
    description: 'Tanaman vetiver di sudut selatan terlihat agak menguning setelah hujan deras kemarin.',
    timestamp: 'Kemarin, 16:40 WIB',
    status: 'Selesai',
  },
];

export default function App() {
  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.klh);

  // Active Navigation Tab (Default to shared Monitoring Real-Time)
  const [activeTab, setActiveTab] = useState<ActiveTab>('monitoring');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulation Mode & Live State Engine
  const [simulationMode, setSimulationMode] = useState<MetricStatus>('Good');
  const [waterMetrics, setWaterMetrics] = useState<WaterMetrics>(INITIAL_WATER_METRICS);
  const [ftwUnits, setFtwUnits] = useState<FTWUnit[]>(INITIAL_FTW_UNITS);
  const [labSamples, setLabSamples] = useState<LaboratorySample[]>(INITIAL_LAB_SAMPLES);
  const [rangerChecklist, setRangerChecklist] = useState<RangerChecklistItem[]>(INITIAL_RANGER_CHECKLIST);
  const [rangerReports, setRangerReports] = useState<RangerReport[]>(INITIAL_RANGER_REPORTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [aiDecisions, setAiDecisions] = useState<AIDecision[]>(INITIAL_AI_DECISIONS);
  const [publicComplaints, setPublicComplaints] = useState<PublicComplaint[]>(INITIAL_PUBLIC_COMPLAINTS);
  const [telemetryHistory, setTelemetryHistory] = useState<SystemTelemetryHistory[]>(
    GENERATE_TELEMETRY_HISTORY()
  );

  // Modals & Drawers
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isFTWDiagramOpen, setIsFTWDiagramOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isPublicPortalOpen, setIsPublicPortalOpen] = useState(false);
  const [publicPortalDefaultLocation, setPublicPortalDefaultLocation] = useState('FTW-01');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle Public Complaint Submission
  const handleAddPublicComplaint = (complaint: PublicComplaint) => {
    setPublicComplaints((prev) => [complaint, ...prev]);

    // Push notification to ALL 3 role dashboards!
    const newNotif: NotificationItem = {
      id: `notif-pub-${Date.now()}`,
      title: `Laporan baru dari masyarakat (${complaint.location})`,
      message: `Jenis: ${complaint.issueCategory} | Pelapor: ${complaint.reporterName} | Status: Menunggu Verifikasi`,
      type: 'public_complaint',
      timestamp: 'Baru saja',
      read: false,
      severity: 'warning',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setToastMessage(`Laporan ${complaint.id} otomatis diteruskan ke Dashboard KLH, IPB & Ranger!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Update Status of Public Complaint
  const handleUpdateComplaintStatus = (id: string, newStatus: 'Baru' | 'Diproses' | 'Selesai') => {
    setPublicComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    setToastMessage(`Status aduan ${id} diperbarui menjadi: ${newStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenPublicPortal = (location?: string) => {
    if (location) setPublicPortalDefaultLocation(location);
    setIsPublicPortalOpen(true);
  };

  // Switch Role Helper (Redirects to role portal landing tab)
  const handleRoleChange = (role: UserRole) => {
    setCurrentUser(MOCK_USERS[role]);
    if (role === 'masyarakat') {
      setActiveTab('community');
    } else {
      setActiveTab('monitoring');
    }
    setToastMessage(`Berhasil berpindah ke Portal ${role.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live Simulation Timer (Every 5 seconds live sensor telemetry fluctuates)
  useEffect(() => {
    const timer = setInterval(() => {
      setWaterMetrics((prev) => {
        let basePh = 7.35;
        let baseDo = 6.82;
        let baseTurb = 14.5;
        let statusTag: WaterMetrics['status'] = 'Good';

        if (simulationMode === 'Warning') {
          basePh = 6.95;
          baseDo = 5.75;
          baseTurb = 23.5;
          statusTag = 'Moderate';
        } else if (simulationMode === 'Critical') {
          basePh = 6.40;
          baseDo = 3.90;
          baseTurb = 38.0;
          statusTag = 'Poor';
        }

        // Slight noise fluctuation
        const phNoise = (Math.random() * 0.1 - 0.05);
        const doNoise = (Math.random() * 0.15 - 0.07);
        const turbNoise = (Math.random() * 0.8 - 0.4);

        const newPh = parseFloat((basePh + phNoise).toFixed(2));
        const newDo = parseFloat((baseDo + doNoise).toFixed(2));
        const newTurb = parseFloat((baseTurb + turbNoise).toFixed(1));

        let score = 88.5;
        if (simulationMode === 'Warning') score = 68.4;
        if (simulationMode === 'Critical') score = 42.0;

        return {
          ...prev,
          pH: newPh,
          DO: newDo,
          turbidity: newTurb,
          wqiScore: score,
          status: statusTag,
          timestamp: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [simulationMode]);

  // Handle Lab Sample Addition
  const handleAddSample = (sample: LaboratorySample) => {
    setLabSamples((prev) => [sample, ...prev]);
    setToastMessage(`Sampel Lab ${sample.sampleCode} berhasil ditambahkan!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Validate Sample
  const handleValidateSample = (id: string) => {
    setLabSamples((prev) =>
      prev.map((s) => (s.id === id ? { ...s, validationStatus: 'Validated' as const } : s))
    );
    setToastMessage('Sampel Laboratorium berhasil divalidasi!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Ranger Checklist Toggle
  const handleToggleChecklist = (id: string) => {
    setRangerChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  // Handle Ranger Report Submission
  const handleAddRangerReport = (rep: RangerReport) => {
    setRangerReports((prev) => [rep, ...prev]);
    // Also push a notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Laporan Ranger (${rep.issueType})`,
      message: `${rep.reporterName} melaporkan insiden di ${rep.location}`,
      type: 'ranger_report',
      timestamp: 'Baru saja',
      read: false,
      severity: rep.severity === 'Critical' || rep.severity === 'High' ? 'critical' : 'warning',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isLoggedIn) {
    return (
      <LoginModal
        onLogin={(role) => {
          setCurrentUser(MOCK_USERS[role]);
          if (role === 'masyarakat') {
            setActiveTab('community');
          } else {
            setActiveTab('monitoring');
          }
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        simulationMode={simulationMode}
        onSimulationModeChange={setSimulationMode}
        unreadCount={unreadCount}
        onToggleNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenFTWDiagram={() => setIsFTWDiagramOpen(true)}
        onOpenPublicPortal={handleOpenPublicPortal}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Body Layout with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Sidebar Navigation (Only for KLH, IPB, Ranger) */}
        {currentUser.role !== 'masyarakat' && (
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userRole={currentUser.role}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            onOpenFTWDiagram={() => setIsFTWDiagramOpen(true)}
          />
        )}

        {/* Main Content Workspace View */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-8 overflow-x-hidden min-w-0">
          {activeTab === 'monitoring' && (
            <MainDashboardView
              metrics={waterMetrics}
              ftwUnits={ftwUnits}
              decisions={aiDecisions}
              history={telemetryHistory}
              simulationMode={simulationMode}
              onOpenFTWDiagram={() => setIsFTWDiagramOpen(true)}
              onNavigateToRoleTab={(tab) => setActiveTab(tab)}
            />
          )}

          {(activeTab === 'klh_executive' || activeTab === 'klh_lakes' || activeTab === 'klh_ai_policy') && (
            <KLHView
              lakes={INITIAL_LAKE_COMPARISONS}
              metrics={waterMetrics}
              publicComplaints={publicComplaints}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
              onOpenPublicPortal={handleOpenPublicPortal}
            />
          )}

          {(activeTab === 'ipb_lab' || activeTab === 'ipb_wetland' || activeTab === 'ipb_eutrophication') && (
            <IPBView
              samples={labSamples}
              metrics={waterMetrics}
              onAddSample={handleAddSample}
              onValidateSample={handleValidateSample}
              publicComplaints={publicComplaints}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
              onOpenPublicPortal={handleOpenPublicPortal}
            />
          )}

          {(activeTab === 'ranger_checklist' || activeTab === 'ranger_reports' || activeTab === 'ranger_qr') && (
            <RangerView
              checklist={rangerChecklist}
              reports={rangerReports}
              onToggleChecklist={handleToggleChecklist}
              onAddReport={handleAddRangerReport}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
              publicComplaints={publicComplaints}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
              onOpenPublicPortal={handleOpenPublicPortal}
            />
          )}

          {(activeTab === 'community' || currentUser.role === 'masyarakat') && (
            <MasyarakatView
              publicComplaints={publicComplaints}
              onSubmitComplaint={handleAddPublicComplaint}
            />
          )}

          {activeTab === 'database' && (
            <DatabaseView ftwUnits={ftwUnits} metrics={waterMetrics} />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Toast Notification Floating Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-[60] max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-teal-500/40 text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 mb-safe"
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <MaterialIcon name="info" className="text-teal-400 text-lg" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearNotifications={() => setNotifications([])}
      />

      <FTWDiagramModal
        isOpen={isFTWDiagramOpen}
        onClose={() => setIsFTWDiagramOpen(false)}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        ftwUnits={ftwUnits}
        onOpenPublicPortal={handleOpenPublicPortal}
      />

      <PublicComplaintPortalModal
        isOpen={isPublicPortalOpen}
        onClose={() => setIsPublicPortalOpen(false)}
        defaultLocation={publicPortalDefaultLocation}
        onSubmitComplaint={handleAddPublicComplaint}
      />
    </div>
  );
}
