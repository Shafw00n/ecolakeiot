import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
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
  PublicComplaint,
  ComplaintStatus,
} from '../types';
import {
  MOCK_USERS,
  INITIAL_WATER_METRICS,
  INITIAL_FTW_UNITS,
  INITIAL_LAB_SAMPLES,
  INITIAL_RANGER_CHECKLIST,
  INITIAL_RANGER_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AI_DECISIONS,
} from '../data/mockData';

export type ToastLevel = 'info' | 'success' | 'warning' | 'critical';

interface ToastState {
  message: string;
  level: ToastLevel;
}

interface AppContextValue {
  isLoggedIn: boolean;
  currentUser: User;
  login: (role: UserRole) => void;
  logout: () => void;

  waterMetrics: WaterMetrics;
  ftwUnits: FTWUnit[];
  labSamples: LaboratorySample[];
  rangerChecklist: RangerChecklistItem[];
  rangerReports: RangerReport[];
  notifications: NotificationItem[];
  aiDecisions: AIDecision[];
  publicComplaints: PublicComplaint[];
  simulationMode: MetricStatus;
  setSimulationMode: (mode: MetricStatus) => void;

  handleAddPublicComplaint: (complaint: PublicComplaint) => void;
  handleUpdateComplaintStatus: (id: string, status: ComplaintStatus) => void;
  handleAddSample: (sample: LaboratorySample) => void;
  handleValidateSample: (id: string) => void;
  handleToggleChecklist: (id: string) => void;
  handleAddRangerReport: (rep: RangerReport) => void;
  handleMarkAllNotificationsRead: () => void;
  handleClearNotifications: () => void;

  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (v: boolean) => void;
  isFTWDiagramOpen: boolean;
  setIsFTWDiagramOpen: (v: boolean) => void;
  isQRScannerOpen: boolean;
  setIsQRScannerOpen: (v: boolean) => void;
  isPublicPortalOpen: boolean;
  setIsPublicPortalOpen: (v: boolean) => void;
  publicPortalDefaultLocation: string;
  setPublicPortalDefaultLocation: (v: string) => void;
  openPublicPortal: (location?: string) => void;

  toast: ToastState | null;
  showToast: (message: string, level?: ToastLevel) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const INITIAL_PUBLIC_COMPLAINTS: PublicComplaint[] = [
  {
    id: 'ADUAN-8492',
    reporterName: 'Budi Santoso',
    reporterPhone: '081234567890',
    location: 'FTW-02',
    issueCategory: 'Sensor rusak',
    description:
      'Sensor pH & DO terlihat mati dan kabel telemetry agak kendur di sisi timur rakit FTW-02.',
    timestamp: '14:32 WIB',
    status: 'New',
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
    status: 'In Progress',
    photoUrl: 'https://images.unsplash.com/photo-1544830728-872f9b17c152?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ADUAN-8475',
    reporterName: 'Ahmad Fauzi',
    location: 'FTW-03',
    issueCategory: 'Tanaman FTW rusak',
    description: 'Tanaman vetiver di sudut selatan terlihat agak menguning setelah hujan deras kemarin.',
    timestamp: 'Kemarin, 16:40 WIB',
    status: 'Resolved',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.klh);

  const [simulationMode, setSimulationMode] = useState<MetricStatus>('Good');
  const [waterMetrics, setWaterMetrics] = useState<WaterMetrics>(INITIAL_WATER_METRICS);
  const [ftwUnits, setFtwUnits] = useState<FTWUnit[]>(INITIAL_FTW_UNITS);
  const [labSamples, setLabSamples] = useState<LaboratorySample[]>(INITIAL_LAB_SAMPLES);
  const [rangerChecklist, setRangerChecklist] =
    useState<RangerChecklistItem[]>(INITIAL_RANGER_CHECKLIST);
  const [rangerReports, setRangerReports] = useState<RangerReport[]>(INITIAL_RANGER_REPORTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [aiDecisions, setAiDecisions] = useState<AIDecision[]>(INITIAL_AI_DECISIONS);
  const [publicComplaints, setPublicComplaints] =
    useState<PublicComplaint[]>(INITIAL_PUBLIC_COMPLAINTS);

  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isFTWDiagramOpen, setIsFTWDiagramOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isPublicPortalOpen, setIsPublicPortalOpen] = useState(false);
  const [publicPortalDefaultLocation, setPublicPortalDefaultLocation] = useState('FTW-01');
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, level: ToastLevel = 'info') => {
    setToast({ message, level });
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  const login = useCallback((role: UserRole) => {
    setCurrentUser(MOCK_USERS[role]);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const openPublicPortal = useCallback((location?: string) => {
    if (location) setPublicPortalDefaultLocation(location);
    setIsPublicPortalOpen(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setWaterMetrics((prev) => {
        let basePh = 7.2;
        let baseDo = 6.5;
        let baseTemp = 27.0;
        let baseTurb = 12.0;
        let baseTds = 320;
        let statusTag: WaterMetrics['status'] = 'Good';

        if (simulationMode === 'Warning') {
          basePh = 8.2;
          baseDo = 3.5;
          baseTemp = 31.5;
          baseTurb = 45.0;
          baseTds = 410;
          statusTag = 'Moderate';
        } else if (simulationMode === 'Critical') {
          basePh = 5.2;
          baseDo = 1.8;
          baseTemp = 26.5;
          baseTurb = 85.0;
          baseTds = 1250;
          statusTag = 'Poor';
        }

        const phNoise = Math.random() * 0.1 - 0.05;
        const doNoise = Math.random() * 0.15 - 0.07;
        const tempNoise = Math.random() * 0.2 - 0.1;
        const turbNoise = Math.random() * 0.8 - 0.4;
        const tdsNoise = Math.round(Math.random() * 8 - 4);

        let score = 88.5;
        if (simulationMode === 'Warning') score = 68.4;
        if (simulationMode === 'Critical') score = 42.0;

        return {
          ...prev,
          pH: parseFloat((basePh + phNoise).toFixed(2)),
          DO: parseFloat((baseDo + doNoise).toFixed(2)),
          temperature: parseFloat((baseTemp + tempNoise).toFixed(1)),
          turbidity: parseFloat((baseTurb + turbNoise).toFixed(1)),
          tds: baseTds + tdsNoise,
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

  const handleAddPublicComplaint = useCallback(
    (complaint: PublicComplaint) => {
      setPublicComplaints((prev) => [complaint, ...prev]);
      const newNotif: NotificationItem = {
        id: `notif-pub-${Date.now()}`,
        title: `Laporan baru dari masyarakat (${complaint.location})`,
        message: `Jenis: ${complaint.issueCategory} | Pelapor: ${complaint.reporterName} | Status: ${complaint.status}`,
        type: 'public_complaint',
        timestamp: 'Baru saja',
        read: false,
        severity: 'warning',
      };
      setNotifications((prev) => [newNotif, ...prev]);
      showToast(`Laporan ${complaint.id} otomatis diteruskan ke Dashboard KLH, IPB & Ranger!`, 'success');
    },
    [showToast]
  );

  const handleUpdateComplaintStatus = useCallback(
    (id: string, newStatus: ComplaintStatus) => {
      setPublicComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      showToast(`Status aduan ${id} diperbarui menjadi: ${newStatus}`, 'info');
    },
    [showToast]
  );

  const handleAddSample = useCallback(
    (sample: LaboratorySample) => {
      setLabSamples((prev) => [sample, ...prev]);
      showToast(`Sampel Lab ${sample.sampleCode} berhasil ditambahkan!`, 'success');
    },
    [showToast]
  );

  const handleValidateSample = useCallback(
    (id: string) => {
      setLabSamples((prev) =>
        prev.map((s) => (s.id === id ? { ...s, validationStatus: 'Validated' as const } : s))
      );
      showToast('Sampel Laboratorium berhasil divalidasi!', 'success');
    },
    [showToast]
  );

  const handleToggleChecklist = useCallback((id: string) => {
    setRangerChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  }, []);

  const handleAddRangerReport = useCallback(
    (rep: RangerReport) => {
      setRangerReports((prev) => [rep, ...prev]);
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
      showToast('Laporan Ranger berhasil dikirim ke dashboard KLH & IPB!', 'success');
    },
    [showToast]
  );

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleClearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: AppContextValue = {
    isLoggedIn,
    currentUser,
    login,
    logout,
    waterMetrics,
    ftwUnits,
    labSamples,
    rangerChecklist,
    rangerReports,
    notifications,
    aiDecisions,
    publicComplaints,
    simulationMode,
    setSimulationMode,
    handleAddPublicComplaint,
    handleUpdateComplaintStatus,
    handleAddSample,
    handleValidateSample,
    handleToggleChecklist,
    handleAddRangerReport,
    handleMarkAllNotificationsRead,
    handleClearNotifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    isFTWDiagramOpen,
    setIsFTWDiagramOpen,
    isQRScannerOpen,
    setIsQRScannerOpen,
    isPublicPortalOpen,
    setIsPublicPortalOpen,
    publicPortalDefaultLocation,
    setPublicPortalDefaultLocation,
    openPublicPortal,
    toast,
    showToast,
    unreadCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
};

export default AppContext;