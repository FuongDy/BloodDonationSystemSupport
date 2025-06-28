// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';

// All components - direct imports (no lazy loading)
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OTPVerificationPage from '../pages/OTPVerificationPage';
import NotFoundPage from '../pages/NotFoundPage';
import ForbiddenPage from '../pages/ForbiddenPage';
import UserProfilePage from '../pages/UserProfilePage';
import MyDonationHistoryPage from '../pages/MyDonationHistoryPage';
import MyAppointmentsPage from '../pages/MyAppointmentsPage';
import BloodCompatibilityCheckerPage from '../pages/BloodCompatibilityCheckerPage';
import BlogPage from '../pages/BlogPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import BlogCreateEditPage from '../pages/BlogCreateEditPage';
import RequestDonationPage from '../pages/RequestDonationPage';
import EmergencyBloodRequestsPage from '../pages/EmergencyBloodRequestsPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUserListPage from '../pages/admin/AdminUserListPage';
import AdminUserCreatePage from '../pages/admin/AdminUserCreatePage';
import AdminUserEditPage from '../pages/admin/AdminUserEditPage';
import AdminUserDetailPage from '../pages/admin/AdminUserDetailPage';
import AdminBloodTypePage from '../pages/admin/AdminBloodTypePage';
import AdminBloodCompatibilityPage from '../pages/admin/AdminBloodCompatibilityPage';
import AdminDonationHistoryPage from '../pages/admin/AdminDonationHistoryPage';
import AdminEmergencyRequestsPage from '../pages/admin/AdminEmergencyRequestsPage';
import AdminCreateEmergencyRequestPage from '../pages/admin/AdminCreateEmergencyRequestPage';
import AdminBloodInventoryPage from '../pages/admin/AdminBloodInventoryPage';
import AdminBlogManagementPage from '../pages/admin/AdminBlogManagementPage';
import AdminDonationProcessPage from '../pages/admin/AdminDonationProcessPage';
import AdminAppointmentManagementPage from '../pages/admin/AdminAppointmentManagementPage';
import AdminBloodRequestsPage from '../pages/admin/AdminBloodRequestsPage';

// New donation process management pages
import AdminDonationRequestsPage from '../pages/admin/AdminDonationRequestsPage';
import AdminHealthCheckPage from '../pages/admin/AdminHealthCheckPage';
import AdminBloodCollectionPage from '../pages/admin/AdminBloodCollectionPage';
import AdminTestResultsPage from '../pages/admin/AdminTestResultsPage';

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
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/verify-otp' element={<OTPVerificationPage />} />
        <Route path='/forbidden' element={<ForbiddenPage />} />
        <Route path='/blood-compatibility' element={<BloodCompatibilityCheckerPage />} />
        <Route path='/blog' element={<BlogPage />} />
        <Route path='/blog/:id' element={<BlogDetailPage />} />
        <Route path='/blood-requests' element={<EmergencyBloodRequestsPage />} />
        <Route path='/request-donation' element={<RequestDonationPage />} />
        <Route path='/privacy' element={<PrivacyPolicyPage />} />
        <Route path='/terms' element={<TermsOfServicePage />} />
      </Route>

      {/* Authenticated User Routes */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path='/profile/*' element={<UserProfilePage />} />
          <Route path='/my-donation-history' element={<MyDonationHistoryPage />} />
          <Route path='/my-appointments' element={<MyAppointmentsPage />} />
        </Route>
      </Route>

      {/* Staff and Admin Routes for Blog Management */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute requiredRoles={['Staff', 'Admin']} />}>
          <Route path='/blog/create' element={<BlogCreateEditPage />} />
          <Route path='/blog/:id/edit' element={<BlogCreateEditPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRoles={['Admin']} />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path='users' element={<AdminUserListPage />} />
          <Route path='users/new' element={<AdminUserCreatePage />} />
          <Route path='users/:userId/edit' element={<AdminUserEditPage />} />
          <Route path='users/:userId' element={<AdminUserDetailPage />} />
          <Route path='blood-types' element={<AdminBloodTypePage />} />
          <Route path='blood-compatibility' element={<AdminBloodCompatibilityPage />} />
          <Route path='donation-history' element={<AdminDonationHistoryPage />} />
          <Route path='emergency-requests' element={<AdminEmergencyRequestsPage />} />
          <Route path='emergency-requests/create' element={<AdminCreateEmergencyRequestPage />} />
          <Route path='blood-requests' element={<AdminBloodRequestsPage />} />
          <Route path='blood-inventory' element={<AdminBloodInventoryPage />} />
          <Route path='blog-management' element={<AdminBlogManagementPage />} />
          <Route path='donation-process' element={<AdminDonationProcessPage />} />
          <Route path='appointment-management' element={<AdminAppointmentManagementPage />} />
          
          {/* separated donation process management routes */}
          <Route path='donation-requests' element={<AdminDonationRequestsPage />} />
          <Route path='health-checks' element={<AdminHealthCheckPage />} />
          <Route path='blood-collection' element={<AdminBloodCollectionPage />} />
          <Route path='test-results' element={<AdminTestResultsPage />} />
        </Route>
      </Route>

      {/* Staff Routes */}
      <Route element={<ProtectedRoute requiredRoles={['Staff', 'Admin']} />}>
        <Route path='/staff' element={<AdminLayout />}>
          <Route path='donation-history' element={<AdminDonationHistoryPage />} />
          <Route path='emergency-requests' element={<AdminEmergencyRequestsPage />} />
          <Route path='blood-inventory' element={<AdminBloodInventoryPage />} />
        </Route>
      </Route>

      {/* Not Found Route */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRoutes;
