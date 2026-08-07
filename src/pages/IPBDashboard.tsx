import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import MonitoringDashboard from '../views/MonitoringDashboard';
import IPBView from '../views/IPBView';
import DatabaseView from '../views/DatabaseView';
import SettingsView from '../views/SettingsView';
import { ActiveTab } from '../components/Sidebar';

interface OutletCtx {
  role: string;
  activeTab: ActiveTab;
}

export const IPBDashboard: React.FC = () => {
  const { activeTab } = useOutletContext<OutletCtx>();
  const {
    waterMetrics,
    ftwUnits,
    labSamples,
    publicComplaints,
    handleAddSample,
    handleValidateSample,
    handleUpdateComplaintStatus,
    openPublicPortal,
  } = useApp();

  if (activeTab === 'monitoring') {
    return <MonitoringDashboard />;
  }

  if (activeTab === 'database') {
    return <DatabaseView ftwUnits={ftwUnits} metrics={waterMetrics} />;
  }

  if (activeTab === 'settings') {
    return <SettingsView />;
  }

  return (
    <IPBView
      samples={labSamples}
      metrics={waterMetrics}
      onAddSample={handleAddSample}
      onValidateSample={handleValidateSample}
      publicComplaints={publicComplaints}
      onUpdateComplaintStatus={handleUpdateComplaintStatus}
      onOpenPublicPortal={openPublicPortal}
    />
  );
};

export default IPBDashboard;