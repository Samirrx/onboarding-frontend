// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import OnboardingFlow from '@/pages/onboarding/OnboardingFlow';
import Login from '@/pages/Login/login';
// import Home from '../pages/Home';
// import About from '../pages/About';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>List of users</div>} />
      <Route path="/onboarding-flow" element={<OnboardingFlow />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
