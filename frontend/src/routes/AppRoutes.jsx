import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import ErrorBoundary from '../components/common/ErrorBoundary';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const OTPVerificationPage = lazy(() => import('../pages/OTPVerificationPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogDetailPage = lazy(() => import('../pages/BlogDetailPage'));
const BlogCreateEditPage = lazy(() => import('../pages/BlogCreateEditPage'));
const UserProfilePage = lazy(() => import('../pages/UserProfilePage'));
const MyDonationHistoryPage = lazy(() => import('../pages/MyDonationHistoryPage'));
const MyAppointmentsPage = lazy(() => import('../pages/MyAppointmentsPage'));
const RequestDonationPage = lazy(() => import('../pages/RequestDonationPage'));
const BloodCompatibilityCheckerPage = lazy(() => import('../pages/BloodCompatibilityCheckerPage'));
const NearbyDonorsPage = lazy(() => import('../pages/NearbyDonorsPage')); // Import trang mới
const EmergencyBloodRequestsPage = lazy(() => import('../pages/EmergencyBloodRequestsPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('../pages/TermsOfServicePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('../pages/ForbiddenPage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminUserListPage = lazy(() => import('../pages/admin/AdminUserListPage'));
const AdminUserCreatePage = lazy(() => import('../pages/admin/AdminUserCreatePage'));
const AdminUserEditPage = lazy(() => import('../pages/admin/AdminUserEditPage'));
const AdminAppointmentManagementPage = lazy(() => import('../pages/admin/AdminAppointmentManagementPage'));
const AdminBloodInventoryPage = lazy(() => import('../pages/admin/AdminBloodInventoryPage'));
const AdminDonationProcessPage = lazy(() => import('../pages/admin/AdminDonationProcessPage'));
const AdminBloodTypePage = lazy(() => import('../pages/admin/AdminBloodTypePage'));
const AdminBloodCompatibilityPage = lazy(() => import('../pages/admin/AdminBloodCompatibilityPage'));
const AdminEmergencyRequestsPage = lazy(() => import('../pages/admin/AdminEmergencyRequestsPage'));
const AdminBlogManagementPage = lazy(() => import('../pages/admin/AdminBlogManagementPage'));
const AdminCreateEmergencyRequestPage = lazy(() => import('../pages/admin/AdminCreateEmergencyRequestPage'));


const AppRoutes = () => (
    <ErrorBoundary source='app-router' level='app'>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/verify-otp' element={<OTPVerificationPage />} />
          <Route path='/blog' element={<BlogPage />} />
          <Route path='/blog/:slug' element={<BlogDetailPage />} />
          <Route path='/request-donation' element={<RequestDonationPage />} />
          <Route path='/blood-compatibility' element={<BloodCompatibilityCheckerPage />} />
          <Route path='/emergency-requests' element={<EmergencyBloodRequestsPage />} />
          <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
          <Route path='/terms-of-service' element={<TermsOfServicePage />} />
        </Route>

        {/* Authenticated User Routes */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path='/profile/*' element={<UserProfilePage />} />
            <Route path='/my-donation-history' element={<MyDonationHistoryPage />} />
            <Route path='/my-appointments' element={<MyAppointmentsPage />} />
            <Route path='/find-donors' element={<NearbyDonorsPage />} /> {/* Dòng được thêm */}
            <Route path='/blog/create' element={<BlogCreateEditPage />} />
            <Route path='/blog/edit/:slug' element={<BlogCreateEditPage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route element={<ProtectedRoute requiredRole='ADMIN' />}>
            <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
            <Route path='/admin/users' element={<AdminUserListPage />} />
            <Route path='/admin/users/create' element={<AdminUserCreatePage />} />
            <Route path='/admin/users/edit/:userId' element={<AdminUserEditPage />} />
            <Route path='/admin/appointments' element={<AdminAppointmentManagementPage />} />
            <Route path='/admin/inventory' element={<AdminBloodInventoryPage />} />
            <Route path='/admin/donation-process' element={<AdminDonationProcessPage />} />
            <Route path='/admin/blood-types' element={<AdminBloodTypePage />} />
            <Route path='/admin/blood-compatibility' element={<AdminBloodCompatibilityPage />} />
            <Route path='/admin/emergency-requests' element={<AdminEmergencyRequestsPage />} />
            <Route path='/admin/emergency-requests/create' element={<AdminCreateEmergencyRequestPage />} />
            <Route path='/admin/blog' element={<AdminBlogManagementPage />} />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path='/forbidden' element={<ForbiddenPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
);

export default AppRoutes;