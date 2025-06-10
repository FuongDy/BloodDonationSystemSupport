// frontendv2/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // SỬA: Sửa lại thành default import
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ requiredRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
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

    // Kiểm tra role nếu requiredRoles được cung cấp
    // user?.role là một string, requiredRoles là một mảng string
    if (requiredRoles && !requiredRoles.includes(user?.role)) {
        // Người dùng đã đăng nhập nhưng không có quyền truy cập
        return <Navigate to="/forbidden" replace />;
    }

    return <Outlet />; // Hiển thị component con nếu đã xác thực và có quyền
};

export default ProtectedRoute;