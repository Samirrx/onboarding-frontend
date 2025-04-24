// src/layout/Layout.jsx

import React, { use } from 'react';
import { BrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppRoutes from '../routes/AppRoutes';
import { AppSidebar } from '@/pages/sidebar/sidebar';
import Breadcrumb from './breadcrump';
import { ToastProvider } from '@/hooks/toastUtils';

const excludedUrls = ['/login'];

const Layout = () => {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <ToastProvider>
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

         
          
        </div></ToastProvider>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default Layout;
