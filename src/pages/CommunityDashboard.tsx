import React from 'react';
import { useApp } from '../contexts/AppContext';
import { MasyarakatView } from '../views/MasyarakatView';

export const CommunityDashboard: React.FC = () => {
  const { publicComplaints, handleAddPublicComplaint } = useApp();

  return (
    <MasyarakatView
      publicComplaints={publicComplaints}
      onSubmitComplaint={handleAddPublicComplaint}
    />
  );
};

export default CommunityDashboard;