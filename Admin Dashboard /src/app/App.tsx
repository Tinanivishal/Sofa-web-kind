import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import RepairBookings from './pages/RepairBookings';
import Customers from './pages/Customers';
import Admins from './pages/Admins';
import Inventory from './pages/Inventory';
import Coupons from './pages/Coupons';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import CMS from './pages/CMS';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';
import { Toaster } from './components/ui/sonner';

interface AdminRouteProps {
  element: JSX.Element;
}

function AdminRoute({ element }: AdminRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return element;
}

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === '/admin/login';

  if (isAuthPage) {
    return (
      <>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<AdminRoute element={<Dashboard />} />} />
              <Route path="/products" element={<AdminRoute element={<Products />} />} />
              <Route path="/categories" element={<AdminRoute element={<Categories />} />} />
              <Route path="/orders" element={<AdminRoute element={<Orders />} />} />
              <Route path="/repairs" element={<AdminRoute element={<RepairBookings />} />} />
              <Route path="/customers" element={<AdminRoute element={<Customers />} />} />
              <Route path="/admins" element={<AdminRoute element={<Admins />} />} />
              <Route path="/inventory" element={<AdminRoute element={<Inventory />} />} />
              <Route path="/coupons" element={<AdminRoute element={<Coupons />} />} />
              <Route path="/reviews" element={<AdminRoute element={<Reviews />} />} />
              <Route path="/analytics" element={<AdminRoute element={<Analytics />} />} />
              <Route path="/cms" element={<AdminRoute element={<CMS />} />} />
              <Route path="/settings" element={<AdminRoute element={<Settings />} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

