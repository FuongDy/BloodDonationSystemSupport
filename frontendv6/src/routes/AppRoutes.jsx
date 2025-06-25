// src/routes/AppRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Eager-loaded components (critical for first paint)
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ForbiddenPage from '../pages/ForbiddenPage';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Lazy-loaded components with code splitting
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const OTPVerificationPage = React.lazy(
  () => import('../pages/OTPVerificationPage')
);
const UserProfilePage = React.lazy(() => import('../pages/UserProfilePage'));
const MyDonationHistoryPage = React.lazy(
  () => import('../pages/MyDonationHistoryPage')
);
const MyAppointmentsPage = React.lazy(
  () => import('../pages/MyAppointmentsPage')
);

const BloodCompatibilityCheckerPage = React.lazy(
  () => import('../pages/BloodCompatibilityCheckerPage')
);
const BlogPage = React.lazy(() => import('../pages/BlogPage'));
const BlogDetailPage = React.lazy(() => import('../pages/BlogDetailPage'));
const BlogCreateEditPage = React.lazy(
  () => import('../pages/BlogCreateEditPage')
);
const RequestDonationPage = React.lazy(
  () => import('../pages/RequestDonationPage')
);
const EmergencyBloodRequestsPage = React.lazy(
  () => import('../pages/EmergencyBloodRequestsPage')
);
const PrivacyPolicyPage = React.lazy(
  () => import('../pages/PrivacyPolicyPage')
);
const TermsOfServicePage = React.lazy(
  () => import('../pages/TermsOfServicePage')
);

// Admin pages - lazy loaded
const AdminDashboardPage = React.lazy(
  () => import('../pages/admin/AdminDashboardPage')
);
const AdminUserListPage = React.lazy(
  () => import('../pages/admin/AdminUserListPage')
);
const AdminUserCreatePage = React.lazy(
  () => import('../pages/admin/AdminUserCreatePage')
);
const AdminUserEditPage = React.lazy(
  () => import('../pages/admin/AdminUserEditPage')
);
const AdminUserDetailPage = React.lazy(
  () => import('../pages/admin/AdminUserDetailPage')
);
const AdminBloodTypePage = React.lazy(
  () => import('../pages/admin/AdminBloodTypePage')
);
const AdminBloodCompatibilityPage = React.lazy(
  () => import('../pages/admin/AdminBloodCompatibilityPage')
);
const AdminDonationHistoryPage = React.lazy(
  () => import('../pages/admin/AdminDonationHistoryPage')
);
const AdminEmergencyRequestsPage = React.lazy(
  () => import('../pages/admin/AdminEmergencyRequestsPage')
);
const AdminCreateEmergencyRequestPage = React.lazy(
  () => import('../pages/admin/AdminCreateEmergencyRequestPage')
);
const AdminBloodInventoryPage = React.lazy(
  () => import('../pages/admin/AdminBloodInventoryPage')
);
const AdminBlogManagementPage = React.lazy(
  () => import('../pages/admin/AdminBlogManagementPage')
);
const AdminDonationProcessPage = React.lazy(
  () => import('../pages/admin/AdminDonationProcessPage')
);
const AdminAppointmentManagementPage = React.lazy(
  () => import('../pages/admin/AdminAppointmentManagementPage')
);
const AdminBloodRequestsPage = React.lazy(
  () => import('../pages/admin/AdminBloodRequestsPage')
);

/**
 * Loading fallback component
 */
const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='text-center'>
      <LoadingSpinner size='12' />
      <p className='mt-4 text-gray-600'>Đang tải trang...</p>
    </div>
  </div>
);

/**
 * Wrapper component for lazy-loaded routes with error boundary
 */
const LazyRoute = ({ children, source }) => (
  <ErrorBoundary source={source} level='component'>
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
  </ErrorBoundary>
);

/**
 * Main App Routes with code splitting and error boundaries
 */
const AppRoutes = () => (
  <ErrorBoundary source='app-router' level='app'>
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/register'
          element={
            <LazyRoute source='register-page'>
              <RegisterPage />
            </LazyRoute>
          }
        />
        <Route
          path='/verify-otp'
          element={
            <LazyRoute source='otp-verification-page'>
              <OTPVerificationPage />
            </LazyRoute>
          }
        />
        <Route path='/forbidden' element={<ForbiddenPage />} />
        <Route
          path='/blood-compatibility'
          element={
            <LazyRoute source='blood-compatibility-page'>
              <BloodCompatibilityCheckerPage />
            </LazyRoute>
          }
        />
        <Route
          path='/blog'
          element={
            <LazyRoute source='blog-page'>
              <BlogPage />
            </LazyRoute>
          }
        />
        <Route
          path='/blog/:id'
          element={
            <LazyRoute source='blog-detail-page'>
              <BlogDetailPage />
            </LazyRoute>
          }
        />{' '}
        <Route
          path='/blood-requests'
          element={
            <LazyRoute source='emergency-blood-requests-page'>
              <EmergencyBloodRequestsPage />
            </LazyRoute>
          }
        />
        <Route
          path='/request-donation'
          element={
            <LazyRoute source='request-donation-page'>
              <RequestDonationPage />
            </LazyRoute>
          }
        />
        <Route
          path='/privacy'
          element={
            <LazyRoute source='privacy-policy-page'>
              <PrivacyPolicyPage />
            </LazyRoute>
          }
        />
        <Route
          path='/terms'
          element={
            <LazyRoute source='terms-of-service-page'>
              <TermsOfServicePage />
            </LazyRoute>
          }
        />
      </Route>

      {/* Authenticated User Routes */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route
            path='/profile/*'
            element={
              <LazyRoute source='user-profile-page'>
                <UserProfilePage />
              </LazyRoute>
            }
          />{' '}
          <Route
            path='/my-donation-history'
            element={
              <LazyRoute source='my-donation-history-page'>
                <MyDonationHistoryPage />
              </LazyRoute>
            }
          />
          <Route path='/my-appointments' element={<MyAppointmentsPage />} />
        </Route>
      </Route>

      {/* Staff and Admin Routes for Blog Management */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute requiredRoles={['Staff', 'Admin']} />}>
          <Route
            path='/blog/create'
            element={
              <LazyRoute source='blog-create-page'>
                <BlogCreateEditPage />
              </LazyRoute>
            }
          />
          <Route
            path='/blog/:id/edit'
            element={
              <LazyRoute source='blog-edit-page'>
                <BlogCreateEditPage />
              </LazyRoute>
            }
          />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRoles={['Admin']} />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route
            index
            element={
              <LazyRoute source='admin-dashboard-page'>
                <AdminDashboardPage />
              </LazyRoute>
            }
          />
          <Route
            path='users'
            element={
              <LazyRoute source='admin-user-list-page'>
                <AdminUserListPage />
              </LazyRoute>
            }
          />
          <Route
            path='users/new'
            element={
              <LazyRoute source='admin-user-create-page'>
                <AdminUserCreatePage />
              </LazyRoute>
            }
          />
          <Route
            path='users/:userId/edit'
            element={
              <LazyRoute source='admin-user-edit-page'>
                <AdminUserEditPage />
              </LazyRoute>
            }
          />
          <Route
            path='users/:userId'
            element={
              <LazyRoute source='admin-user-detail-page'>
                <AdminUserDetailPage />
              </LazyRoute>
            }
          />
          <Route
            path='blood-types'
            element={
              <LazyRoute source='admin-blood-type-page'>
                <AdminBloodTypePage />
              </LazyRoute>
            }
          />
          <Route
            path='blood-compatibility'
            element={
              <LazyRoute source='admin-blood-compatibility-page'>
                <AdminBloodCompatibilityPage />
              </LazyRoute>
            }
          />
          <Route
            path='donation-history'
            element={
              <LazyRoute source='admin-donation-history-page'>
                <AdminDonationHistoryPage />
              </LazyRoute>
            }
          />{' '}
          <Route
            path='emergency-requests'
            element={
              <LazyRoute source='admin-emergency-requests-page'>
                <AdminEmergencyRequestsPage />
              </LazyRoute>
            }
          />
          <Route
            path='emergency-requests/create'
            element={
              <LazyRoute source='admin-create-emergency-request-page'>
                <AdminCreateEmergencyRequestPage />
              </LazyRoute>
            }
          />
          <Route
            path='blood-requests'
            element={
              <LazyRoute source='admin-blood-requests-page'>
                <AdminBloodRequestsPage />
              </LazyRoute>
            }
          />
          <Route
            path='blood-inventory'
            element={
              <LazyRoute source='admin-blood-inventory-page'>
                <AdminBloodInventoryPage />
              </LazyRoute>
            }
          />{' '}
          <Route
            path='blog-management'
            element={
              <LazyRoute source='admin-blog-management-page'>
                <AdminBlogManagementPage />
              </LazyRoute>
            }
          />
          <Route
            path='donation-process'
            element={
              <LazyRoute source='admin-donation-process-page'>
                <AdminDonationProcessPage />
              </LazyRoute>
            }
          />
          <Route
            path='appointment-management'
            element={
              <LazyRoute source='admin-appointment-management-page'>
                <AdminAppointmentManagementPage />
              </LazyRoute>
            }
          />
        </Route>
      </Route>

      {/* Staff Routes */}
      <Route element={<ProtectedRoute requiredRoles={['Staff', 'Admin']} />}>
        <Route path='/staff' element={<AdminLayout />}>
          <Route
            path='donation-history'
            element={
              <LazyRoute source='staff-donation-history-page'>
                <AdminDonationHistoryPage />
              </LazyRoute>
            }
          />
          <Route
            path='emergency-requests'
            element={
              <LazyRoute source='staff-emergency-requests-page'>
                <AdminEmergencyRequestsPage />
              </LazyRoute>
            }
          />
          <Route
            path='blood-inventory'
            element={
              <LazyRoute source='staff-blood-inventory-page'>
                <AdminBloodInventoryPage />
              </LazyRoute>
            }
          />
        </Route>
      </Route>

      {/* Not Found Route */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRoutes;
