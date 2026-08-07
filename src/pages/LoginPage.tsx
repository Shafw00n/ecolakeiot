import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useApp } from '../contexts/AppContext';
import LoginModal from '../components/LoginModal';

const ROLE_ROUTES: Record<UserRole, string> = {
  klh: '/dashboard/klh',
  ipb: '/dashboard/ipb',
  ranger: '/dashboard/ranger',
  masyarakat: '/dashboard/community',
};

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate(ROLE_ROUTES[role]);
  };

  return <LoginModal onLogin={handleLogin} />;
};

export default LoginPage;