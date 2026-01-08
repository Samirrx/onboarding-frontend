// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import OnboardingFlow from '@/pages/onboarding/OnboardingFlow';
import Login from '@/pages/Login/login';
import Signup from '@/pages/Signup/signup';
import TenantList from '@/pages/TenantList/tenant-list';
// import Home from '../pages/Home';
// import About from '../pages/About';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TenantList />} />
      <Route path="/onboarding-flow" element={<OnboardingFlow />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Signup" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
};

export default AppRoutes;
