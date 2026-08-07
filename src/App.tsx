import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './contexts/AppContext';
import { UserRole } from './types';
import LoginPage from './pages/LoginPage';
import RoleLayout from './layouts/RoleLayout';
import KLHDashboard from './pages/KLHDashboard';
import IPBDashboard from './pages/IPBDashboard';
import RangerDashboard from './pages/RangerDashboard';
import CommunityDashboard from './pages/CommunityDashboard';

const ROOT_NAV: Record<UserRole, string> = {
  klh: '/dashboard/klh',
  ipb: '/dashboard/ipb',
  ranger: '/dashboard/ranger',
  masyarakat: '/dashboard/community',
};

export default function App() {
  const { isLoggedIn, currentUser } = useApp();
  const home = currentUser ? ROOT_NAV[currentUser.role] : '/login';

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to={home} replace /> : <LoginPage />}
      />
      <Route path="/dashboard/klh" element={isLoggedIn ? <RoleLayout role="klh" /> : <Navigate to="/login" replace />}>
        <Route index element={<KLHDashboard />} />
      </Route>
      <Route path="/dashboard/ipb" element={isLoggedIn ? <RoleLayout role="ipb" /> : <Navigate to="/login" replace />}>
        <Route index element={<IPBDashboard />} />
      </Route>
      <Route path="/dashboard/ranger" element={isLoggedIn ? <RoleLayout role="ranger" /> : <Navigate to="/login" replace />}>
        <Route index element={<RangerDashboard />} />
      </Route>
      <Route path="/dashboard/community" element={isLoggedIn ? <RoleLayout role="masyarakat" /> : <Navigate to="/login" replace />}>
        <Route index element={<CommunityDashboard />} />
      </Route>

      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to={home} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}