// src/routes/index.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import UserProfilePage from "../pages/UserProfilePage"; // Giả sử bạn sẽ tạo trang này
import ForbiddenPage from "../pages/ForbiddenPage"; // Giả sử bạn sẽ tạo trang này

import AdminLayout from "../components/layout/AdminLayout";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUserListPage from "../pages/admin/AdminUserListPage";
import AdminUserCreatePage from "../pages/admin/AdminUserCreatePage";
import AdminUserEditPage from "../pages/admin/AdminUserEditPage";
import AdminBloodTypePage from "../pages/admin/AdminBloodTypePage"; // Import AdminBloodTypePage
import AdminBloodInventoryPage from "../pages/admin/AdminBloodInventoryPage"; // Import AdminBloodInventoryPage




import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
    <Routes>
        {/* Public Routes accessible via MainLayout (nếu có) or directly */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} /> {/* Trang cấm truy cập */}

        {/* Authenticated User Routes */}
        <Route element={<ProtectedRoute />}> {/* Không yêu cầu role cụ thể, chỉ cần đăng nhập */}
            <Route path="/profile/*" element={<UserProfilePage />} />
            {/* Thêm các route khác cho member ở đây */}
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="Admin" />}> {/* */}
            <Route path="/admin" element={<AdminLayout />}> {/* */}
                <Route index element={<AdminDashboardPage />} /> {/* */}
                <Route path="users" element={<AdminUserListPage />} /> {/* */}
                <Route path="users/new" element={<AdminUserCreatePage />} /> {/* */}
                <Route path="users/edit/:userId" element={<AdminUserEditPage />} /> {/* */}
                <Route path="blood-types" element={<AdminBloodTypePage />} /> {/* Add route for blood types */}
                <Route path="blood-inventory" element={<AdminBloodInventoryPage />} /> {/* Add route for blood inventory */}
               
            </Route>
        </Route>

        {/* TODO: Staff Routes */}
        {/*
        <Route element={<ProtectedRoute requiredRole="Staff" />}>
            <Route path="/staff" element={<StaffLayout />}> // StaffLayout nếu có
                <Route index element={<StaffDashboardPage />} />
            </Route>
        </Route>
        */}

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} /> {/* */}
    </Routes>
);

export default AppRoutes;