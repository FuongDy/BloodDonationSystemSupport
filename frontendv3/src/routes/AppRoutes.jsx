// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// -- Layouts --
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout'; // <<< GIỮ LẠI DÒNG NÀY

// -- Common Pages --
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import ForbiddenPage from '../pages/ForbiddenPage';
import UserProfilePage from '../pages/UserProfilePage';
import BloodCompatibilityCheckerPage from '../pages/BloodCompatibilityCheckerPage';
import EmergencyRequestPage from '../pages/EmergencyRequestPage';
import FindDonorsPage from '../pages/FindDonorsPage';
import BlogPage from '../pages/BlogPage';

// -- Admin Pages --
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUserListPage from '../pages/admin/AdminUserListPage';
import AdminUserCreatePage from "../pages/admin/AdminUserCreatePage";
import AdminUserEditPage from "../pages/admin/AdminUserEditPage";
import AdminUserDetailPage from "../pages/admin/AdminUserDetailPage";
import AdminBloodTypePage from "../pages/admin/AdminBloodTypePage";
import AdminBloodCompatibilityPage from "../pages/admin/AdminBloodCompatibilityPage";
import AdminBloodInventoryPage from "../pages/admin/AdminBloodInventoryPage";
import AdminDonationProcessPage from "../pages/admin/AdminDonationProcessPage";
import AdminBloodRequestPage from '../pages/admin/AdminBloodRequestPage';

// -- Route Protection --
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
    <Routes>
        {/* === Public Routes with Main Layout === */}
        <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/compatibility-check" element={<BloodCompatibilityCheckerPage />} />
            <Route path="/find-donors" element={<FindDonorsPage />} />
            <Route path="/emergency-request" element={<EmergencyRequestPage />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* Routes for logged-in users */}
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<UserProfilePage />} />
            </Route>
        </Route>

        {/* === Auth Routes without Main Layout === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* === Admin Routes === */}
        <Route element={<ProtectedRoute requiredRoles={['Admin', 'Staff']} />}>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<ProtectedRoute requiredRoles={['Admin']}><AdminUserListPage /></ProtectedRoute>} />
                <Route path="users/new" element={<ProtectedRoute requiredRoles={['Admin']}><AdminUserCreatePage /></ProtectedRoute>} />
                <Route path="users/edit/:userId" element={<ProtectedRoute requiredRoles={['Admin']}><AdminUserEditPage /></ProtectedRoute>} />
                <Route path="users/view/:userId" element={<ProtectedRoute requiredRoles={['Admin']}><AdminUserDetailPage /></ProtectedRoute>} />
                <Route path="blood-types" element={<AdminBloodTypePage />} />
                <Route path="blood-compatibility" element={<ProtectedRoute requiredRoles={['Admin']}><AdminBloodCompatibilityPage /></ProtectedRoute>} />
                <Route path="inventory" element={<AdminBloodInventoryPage />} />
                <Route path="blood-requests" element={<AdminBloodRequestPage />} /> 
                <Route path="donation-process" element={<AdminDonationProcessPage />} />
            </Route>
        </Route>

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;