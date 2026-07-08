// src/layout/Layout.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppRoutes from '../routes/AppRoutes';
import { AppSidebar } from '@/pages/sidebar/sidebar';
import Breadcrumb from './breadcrump';
import MaintenancePopup from '@/components/MaintenancePopup';

const excludedUrls = ['/login', '/signup', '/Signup'];

const Layout = () => {
  const location = useLocation();
  const isExcludedRoute = excludedUrls.includes(location?.pathname);
  const tenantId = localStorage.getItem('tenantid');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full h-screen overflow-hidden">
        {/* Sidebar stays on the side across all pages */}
        {!isExcludedRoute ? (
          <>
            <AppSidebar /> <Breadcrumb />
            {tenantId && <MaintenancePopup tenantId={tenantId} />}
          </>
        ) : (
          <div className="flex flex-col w-full h-full">
            <AppRoutes />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
