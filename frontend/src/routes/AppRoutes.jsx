// src/routes/AppRoutes.jsx
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Public pages
import ForbiddenPage from '../pages/ForbiddenPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import OTPVerificationPage from '../pages/OTPVerificationPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import RegisterPage from '../pages/RegisterPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';

// User pages
import MyAppointmentsPage from '../pages/MyAppointmentsPage';
import MyDonationHistoryPage from '../pages/MyDonationHistoryPage';
import NearbyDonorsPage from '../pages/NearbyDonorsPage';
import UserProfilePage from '../pages/UserProfilePage';

// Feature pages
import BlogCreateEditPage from '../pages/BlogCreateEditPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import BlogPage from '../pages/BlogPage';
import BloodCompatibilityCheckerPage from '../pages/BloodCompatibilityCheckerPage';
import EmergencyBloodRequestsPage from '../pages/EmergencyBloodRequestsPage';
import RequestDonationPage from '../pages/RequestDonationPage';


// Admin pages
import AdminAppointmentManagementPage from '../pages/admin/AdminAppointmentManagementPage';
import AdminBlogCreatePage from '../pages/admin/AdminBlogCreatePage';
import AdminBlogEditPage from '../pages/admin/AdminBlogEditPage';
import AdminBlogManagementPage from '../pages/admin/AdminBlogManagementPage';
// import AdminBloodCompatibilityPage from '../pages/admin/AdminBloodCompatibilityPage';
import AdminBloodInventoryPage from '../pages/admin/AdminBloodInventoryPage';
// import AdminBloodTypePage from '../pages/admin/AdminBloodTypePage';
import AdminCreateEmergencyRequestPage from '../pages/admin/AdminCreateEmergencyRequestPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminDonationHistoryPage from '../pages/admin/AdminDonationHistoryPage';
import AdminEmergencyRequestsPage from '../pages/admin/AdminEmergencyRequestsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminUserCreatePage from '../pages/admin/AdminUserCreatePage';
import AdminUserDetailPage from '../pages/admin/AdminUserDetailPage';
import AdminUserEditPage from '../pages/admin/AdminUserEditPage';
import AdminUserListPage from '../pages/admin/AdminUserListPage';

// New donation process management pages
import AdminBloodCollectionPage from '../pages/admin/AdminBloodCollectionPage';
import AdminDonationProcessManagementPage from '../pages/admin/AdminDonationProcessManagementPage';
import AdminDonationRequestsPage from '../pages/admin/AdminDonationRequestsPage';
import AdminHealthCheckPage from '../pages/admin/AdminHealthCheckPage';
import AdminTestResultsPage from '../pages/admin/AdminTestResultsPage';

// Layout components
import AdminLayout from '../components/layout/AdminLayout';
import MainLayout from '../components/layout/MainLayout';
import AdminFindDonorPage from '../pages/admin/AdminFindDonorPage';
import ProtectedRoute from './ProtectedRoute';

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
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
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

      {/* Admin and Staff Routes */}
      <Route element={<ProtectedRoute requiredRoles={['Admin', 'Staff']} />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path='users' element={<AdminUserListPage />} />
          <Route path='users/new' element={<AdminUserCreatePage />} />
          <Route path='users/:userId/edit' element={<AdminUserEditPage />} />
          <Route path='users/:userId' element={<AdminUserDetailPage />} />
          {/* <Route path='blood-types' element={<AdminBloodTypePage />} /> */}
          {/* <Route path='blood-compatibility' element={<AdminBloodCompatibilityPage />} /> */}
          <Route path='donation-history' element={<AdminDonationHistoryPage />} />
          <Route path='emergency-requests' element={<AdminEmergencyRequestsPage />} />
          <Route path='emergency-requests/create' element={<AdminCreateEmergencyRequestPage />} />
          <Route path='blood-inventory' element={<AdminBloodInventoryPage />} />
          <Route path='blog-management' element={<AdminBlogManagementPage />} />
          <Route path='blog/create' element={<AdminBlogCreatePage />} />
          <Route path='blog/:id/edit' element={<AdminBlogEditPage />} />
          <Route path='appointment-management' element={<AdminAppointmentManagementPage />} />
          <Route path='reports' element={<AdminReportsPage />} />
          <Route path='find-donor' element={<AdminFindDonorPage />} />
          {/* separated donation process management routes */}
          <Route path='donation-requests' element={<AdminDonationRequestsPage />} />
          <Route path='health-checks' element={<AdminHealthCheckPage />} />
          <Route path='blood-collection' element={<AdminBloodCollectionPage />} />
          <Route path='test-results' element={<AdminTestResultsPage />} />
          <Route path='donation-process-management' element={<AdminDonationProcessManagementPage />} />
        </Route>
      </Route>

      {/* Not Found Route */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRoutes;
