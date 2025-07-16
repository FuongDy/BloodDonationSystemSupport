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
import NearbyDonorsPage from '../pages/NearbyDonorsPage';

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
import AdminBlogCreatePage from '../pages/admin/AdminBlogCreatePage';
import AdminAppointmentManagementPage from '../pages/admin/AdminAppointmentManagementPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';

// New donation process management pages
import AdminDonationRequestsPage from '../pages/admin/AdminDonationRequestsPage';
import AdminHealthCheckPage from '../pages/admin/AdminHealthCheckPage';
import AdminBloodCollectionPage from '../pages/admin/AdminBloodCollectionPage';
import AdminTestResultsPage from '../pages/admin/AdminTestResultsPage';
import AdminDonationProcessManagementPage from '../pages/admin/AdminDonationProcessManagementPage';

// Layout components
import ProtectedRoute from './ProtectedRoute';
import AdminOnlyRoute from './AdminOnlyRoute';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import StaffLayout from '../components/layout/StaffLayout';
import AdminFindDonorPage from '../pages/admin/AdminFindDonorPage';
import StaffDashboardPage from '../pages/staff/StaffDashboardPage';
import StaffUserManagementPage from '../pages/staff/StaffUserManagementPage';
import StaffDonationsPage from '../pages/staff/StaffDonationsPage';
import StaffAppointmentsPage from '../pages/staff/StaffAppointmentsPage';
import StaffInventoryPage from '../pages/staff/StaffInventoryPage';
import StaffReportsPage from '../pages/staff/StaffReportsPage';

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
          <Route path='/find-donors' element={<NearbyDonorsPage />} />
        </Route>
      </Route>

      {/* Staff and Admin Routes for Blog Management */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute requiredRoles={['Staff', 'Admin']} />}>
          <Route path='/blog/create' element={<BlogCreateEditPage />} />
          <Route path='/blog/:id/edit' element={<BlogCreateEditPage />} />
        </Route>
      </Route>

      {/* Admin and Staff Routes - Combined with role-based access */}
      <Route element={<ProtectedRoute requiredRoles={['Admin', 'Staff']} />}>
        <Route path='/admin' element={<AdminLayout />}>
          {/* Admin-only routes */}
          <Route index element={<AdminOnlyRoute><AdminDashboardPage /></AdminOnlyRoute>} />
          <Route path='users' element={<AdminOnlyRoute><AdminUserListPage /></AdminOnlyRoute>} />
          <Route path='users/new' element={<AdminOnlyRoute><AdminUserCreatePage /></AdminOnlyRoute>} />
          <Route path='users/:userId/edit' element={<AdminOnlyRoute><AdminUserEditPage /></AdminOnlyRoute>} />
          <Route path='users/:userId' element={<AdminOnlyRoute><AdminUserDetailPage /></AdminOnlyRoute>} />
          <Route path='blood-types' element={<AdminOnlyRoute><AdminBloodTypePage /></AdminOnlyRoute>} />
          <Route path='blood-compatibility' element={<AdminOnlyRoute><AdminBloodCompatibilityPage /></AdminOnlyRoute>} />
          <Route path='blog-management' element={<AdminOnlyRoute><AdminBlogManagementPage /></AdminOnlyRoute>} />
          <Route path='blog/create' element={<AdminOnlyRoute><AdminBlogCreatePage /></AdminOnlyRoute>} />
          <Route path='appointment-management' element={<AdminOnlyRoute><AdminAppointmentManagementPage /></AdminOnlyRoute>} />
          <Route path='reports' element={<AdminOnlyRoute><AdminReportsPage /></AdminOnlyRoute>} />
          
          {/* Shared routes for both Admin and Staff */}
          <Route path='emergency-requests' element={<AdminEmergencyRequestsPage />} />
          <Route path='emergency-requests/create' element={<AdminCreateEmergencyRequestPage />} />
          <Route path='donation-process-management' element={<AdminDonationProcessManagementPage />} />
          <Route path='donation-history' element={<AdminDonationHistoryPage />} />
          <Route path='blood-inventory' element={<AdminBloodInventoryPage />} />
          <Route path='find-donor' element={<AdminFindDonorPage />} />
          
          {/* Donation process sub-routes - Shared */}
          <Route path='donation-requests' element={<AdminDonationRequestsPage />} />
          <Route path='health-checks' element={<AdminHealthCheckPage />} />
          <Route path='blood-collection' element={<AdminBloodCollectionPage />} />
          <Route path='test-results' element={<AdminTestResultsPage />} />
        </Route>
      </Route>

      {/* Not Found Route */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRoutes;
