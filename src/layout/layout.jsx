// src/layout/Layout.jsx

import React, { use } from 'react';
import { BrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppRoutes from '../routes/AppRoutes';
import { AppSidebar } from '@/pages/sidebar/sidebar';
import Breadcrumb from './breadcrump';

const excludedUrls = ['/login'];

const Layout = ({ children }) => {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full h-screen overflow-hidden">
          {/* Sidebar stays on the side across all pages */}
          {!excludedUrls.includes(window.location.pathname) ? (
            <>
              <AppSidebar /> <Breadcrumb />
            </>
          ) : (
            <div className="flex flex-col w-full h-full">
              <AppRoutes />
            </div>
          )}

          {/* Main content */}
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default Layout;
