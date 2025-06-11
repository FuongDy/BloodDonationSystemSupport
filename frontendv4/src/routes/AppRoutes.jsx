// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import UserProfilePage from "../pages/UserProfilePage";
import ForbiddenPage from "../pages/ForbiddenPage";

import AdminLayout from "../components/layout/AdminLayout";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUserListPage from "../pages/admin/AdminUserListPage";
import AdminUserCreatePage from "../pages/admin/AdminUserCreatePage";
import AdminUserEditPage from "../pages/admin/AdminUserEditPage";
import AdminUserDetailPage from "../pages/admin/AdminUserDetailPage";
import AdminBloodTypePage from "../pages/admin/AdminBloodTypePage";
import AdminBloodCompatibilityPage from "../pages/admin/AdminBloodCompatibilityPage";
import BloodCompatibilityCheckerPage from "../pages/BloodCompatibilityCheckerPage";
import RequestDonationPage from '../pages/RequestDonationPage';
import BloodRequestsPage from '../pages/BloodRequestsPage';
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout.jsx";

const AppRoutes = () => (
    <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/blood-compatibility" element={<BloodCompatibilityCheckerPage />} />
        <Route path="/blood-requests" element={<BloodRequestsPage />} />
        </Route>


        {/* Authenticated User Routes (bất kỳ ai đã đăng nhập) */}
        <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/request-donation" element={<RequestDonationPage />} />
        </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute requiredRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUserListPage />} />
                <Route path="users/new" element={<AdminUserCreatePage />} />
                <Route path="users/edit/:userId" element={<AdminUserEditPage />} />
                <Route path="users/view/:userId" element={<AdminUserDetailPage />} />
                <Route path="blood-types" element={<AdminBloodTypePage />} />
                <Route path="blood-compatibility" element={<AdminBloodCompatibilityPage />} />
            </Route>
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;