import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { INITIAL_LAKE_COMPARISONS } from '../data/mockData';
import MonitoringDashboard from '../views/MonitoringDashboard';
import KLHView from '../views/KLHView';
import DatabaseView from '../views/DatabaseView';
import SettingsView from '../views/SettingsView';
import { ActiveTab } from '../components/Sidebar';

interface OutletCtx {
  role: string;
  activeTab: ActiveTab;
}

export const KLHDashboard: React.FC = () => {
  const { activeTab } = useOutletContext<OutletCtx>();
  const { waterMetrics, ftwUnits, publicComplaints, handleUpdateComplaintStatus, openPublicPortal } = useApp();

  if (activeTab === 'monitoring') {
    return <MonitoringDashboard />;
  }

  if (activeTab === 'database') {
    return <DatabaseView ftwUnits={ftwUnits} metrics={waterMetrics} />;
  }

  return (
    <KLHView
      lakes={INITIAL_LAKE_COMPARISONS}
      metrics={waterMetrics}
      publicComplaints={publicComplaints}
      onUpdateComplaintStatus={handleUpdateComplaintStatus}
      onOpenPublicPortal={openPublicPortal}
    />
  );
};

export default KLHDashboard;