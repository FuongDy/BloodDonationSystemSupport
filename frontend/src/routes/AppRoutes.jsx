// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';

// All components - direct imports (no lazy loading)
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import UserProfilePage from '../pages/UserProfilePage';
import MyDonationHistoryPage from '../pages/MyDonationHistoryPage';
import MyAppointmentsPage from '../pages/MyAppointmentsPage';


// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminAppointmentManagementPage from '../pages/admin/AdminAppointmentManagementPage';

// Layout components
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';

/**
 * Main App Routes - Simplified version without lazy loading
 */
const AppRoutes = () => (
  <ErrorBoundary source='app-router' level='app'>
<Routes>
      {/* Authenticated User Routes */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path='/profile/*' element={<UserProfilePage />} />
          <Route path='/my-donation-history' element={<MyDonationHistoryPage />} />
          <Route path='/my-appointments' element={<MyAppointmentsPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRoles={['Admin']} />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path='appointment-management' element={<AdminAppointmentManagementPage />} />
        </Route>
      </Route>


      {/* Not Found Route */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRoutes;
