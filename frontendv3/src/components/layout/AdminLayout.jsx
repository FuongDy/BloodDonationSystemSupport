// src/components/layout/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Droplets, GitCompareArrows, Home, LogOut, ClipboardList, Package } from 'lucide-react'; // Thêm các icon mới
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
    const location = useLocation();
    const { logout, user } = useAuth(); // Lấy user từ useAuth

    const menuItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Admin Dashboard", roles: ['Admin'] }, // Chỉ Admin
        { path: "/admin/users", icon: Users, label: "Quản lý Người dùng", roles: ['Admin'] }, // Chỉ Admin
        { path: "/admin/blood-types", icon: Droplets, label: "Quản lý Loại máu", roles: ['Admin'] }, // Chỉ Admin
        { path: "/admin/blood-compatibility", icon: GitCompareArrows, label: "Quản lý Tương thích", roles: ['Admin'] }, // Chỉ Admin
        // Thêm các mục menu cho Staff
        { path: "/staff", icon: LayoutDashboard, label: "Staff Dashboard", roles: ['Staff'] },
        { path: "/staff/donation-requests", icon: ClipboardList, label: "Yêu cầu Hiến máu", roles: ['Staff', 'Admin'] },
        { path: "/staff/blood-inventory", icon: Package, label: "Quản lý Kho máu", roles: ['Staff', 'Admin'] },
    ];

    const isActive = (path) => {
        if (path === "/admin" || path === "/staff") {
            // Kiểm tra chính xác đường dẫn gốc cho Dashboard
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col fixed h-full">
                <div className="flex items-center justify-center h-16 border-b border-gray-700">
                    <Link to={user?.role === 'Admin' ? "/admin" : "/staff"} className="flex items-center space-x-2 text-white">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                        <span className="text-lg font-semibold">{user?.role} Panel</span> {/* Hiển thị role */}
                    </Link>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {menuItems.map((item) => {
                        // Chỉ hiển thị mục menu nếu người dùng có vai trò phù hợp
                        if (item.roles && !item.roles.includes(user?.role)) {
                            return null;
                        }
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive(item.path)
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} className="mr-3" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-2 py-4 border-t border-gray-700 space-y-1">
                    {/* Link về trang chủ public */}
                    <Link
                        to="/"
                        className="w-full flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        <Home size={20} className="mr-3" />
                        Về Trang Chủ
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        <LogOut size={20} className="mr-3" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64">
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;