import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import MonitoringDashboard from '../views/MonitoringDashboard';
import RangerView from '../views/RangerView';
import DatabaseView from '../views/DatabaseView';
import SettingsView from '../views/SettingsView';
import { ActiveTab } from '../components/Sidebar';

interface OutletCtx {
  role: string;
  activeTab: ActiveTab;
}

export const RangerDashboard: React.FC = () => {
  const { activeTab } = useOutletContext<OutletCtx>();
  const {
    waterMetrics,
    ftwUnits,
    rangerChecklist,
    rangerReports,
    publicComplaints,
    handleToggleChecklist,
    handleAddRangerReport,
    handleUpdateComplaintStatus,
    setIsQRScannerOpen,
    openPublicPortal,
  } = useApp();

  if (activeTab === 'monitoring') {
    return <MonitoringDashboard />;
  }

  if (activeTab === 'ranger_checklist') {
    return (
      <div className="space-y-6">
        <RangerView
          checklist={rangerChecklist}
          reports={rangerReports}
          onToggleChecklist={handleToggleChecklist}
          onAddReport={handleAddRangerReport}
          onOpenQRScanner={() => setIsQRScannerOpen(true)}
          publicComplaints={publicComplaints}
          onUpdateComplaintStatus={handleUpdateComplaintStatus}
          onOpenPublicPortal={openPublicPortal}
        />
      </div>
    );
  }

  if (activeTab === 'database') {
    return <DatabaseView ftwUnits={ftwUnits} metrics={waterMetrics} />;
  }

  return <MonitoringDashboard />;
};

export default RangerDashboard;