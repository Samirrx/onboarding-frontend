// src/routes/AppRoutes.jsx
import React from 'react';
import { EnvironmentScopeProvider } from '@/hooks/environment-scope';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import OnboardingFlow from '@/pages/onboarding/OnboardingFlow';
import SystemMaintenancePage from '@/pages/onboarding/SystemMaintenance';
import Login from '@/pages/Login/login';
import Signup from '@/pages/Signup/signup';
import TenantList from '@/pages/TenantList/tenant-list';
import AiCredits from '@/pages/AiCredits/ai-credits';
// import Home from '../pages/Home';
// import About from '../pages/About';

const AppRoutes = () => {
  const location = useLocation();
  const routes = (
    <Routes>
      <Route path="/" element={<TenantList />} />
      <Route path="/ai-credits" element={<AiCredits />} />
      <Route path="/onboarding-flow" element={<OnboardingFlow />} />
      <Route path="/system-maintenance" element={<SystemMaintenancePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Signup" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
  return ['/login', '/signup', '/Signup'].includes(location.pathname)
    ? routes : <EnvironmentScopeProvider>{routes}</EnvironmentScopeProvider>;
};

export default AppRoutes;
