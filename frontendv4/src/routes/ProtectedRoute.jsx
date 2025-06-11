// frontendv2/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Sử dụng useAuth hook
import LoadingSpinner from '../components/common/LoadingSpinner'; // Component spinner

const ProtectedRoute = ({ requiredRoles }) => { // Đổi prop thành requiredRoles (mảng)
    const { user, isAuthenticated, loading } = useAuth(); // Lấy trạng thái từ AuthContext
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
    if (requiredRoles && !requiredRoles.includes(user?.role)) { // Kiểm tra nếu vai trò của người dùng không nằm trong các vai trò được phép
        // Người dùng đã đăng nhập nhưng không có quyền truy cập
        return <Navigate to="/forbidden" replace />;
    }

    return <Outlet />; // Hiển thị component con nếu đã xác thực và có quyền
};

export default ProtectedRoute;