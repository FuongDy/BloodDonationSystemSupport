// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Sử dụng useAuth hook
import LoadingSpinner from '../components/common/LoadingSpinner'; // Component spinner

const ProtectedRoute = ({ requiredRoles }) => {
    const { user, isAuthenticated, loading } = useAuth(); // Lấy trạng thái từ AuthContext
    const location = useLocation();

    if (loading) {
        // Hiển thị một spinner hoặc fallback UI trong khi kiểm tra trạng thái xác thực
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Lưu lại trang người dùng muốn truy cập để redirect sau khi login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Kiểm tra role nếu requiredRoles được cung cấp và là một mảng
    if (requiredRoles && Array.isArray(requiredRoles) && requiredRoles.length > 0) {
        if (!user?.role || !requiredRoles.includes(user.role)) {
            // Người dùng đã đăng nhập nhưng không có quyền truy cập
            return <Navigate to="/forbidden" replace />;
        }
    }

    return <Outlet />; // Hiển thị component con nếu đã xác thực và có quyền
};

export default ProtectedRoute;