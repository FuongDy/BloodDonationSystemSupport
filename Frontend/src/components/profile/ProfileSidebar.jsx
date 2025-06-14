// src/components/profile/ProfileSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ShieldCheck, CalendarDays, History, Settings, Bell } from 'lucide-react';

const ProfileSidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: "/profile", label: "Thông tin cá nhân", icon: User },
        { path: "/profile/security", label: "Bảo mật & Đăng nhập", icon: ShieldCheck },
        { path: "/profile/donation-schedule", label: "Lịch hiến máu", icon: CalendarDays },
        { path: "/profile/donation-history", label: "Lịch sử hiến máu", icon: History },
        { path: "/profile/notifications", label: "Cài đặt thông báo", icon: Bell },
        { path: "/profile/settings", label: "Cài đặt tài khoản", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white p-4 rounded-lg shadow-lg space-y-1 h-fit">
            {menuItems.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center py-2.5 px-3 rounded-md text-sm font-medium transition-colors
                        ${isActive(item.path)
                            ? 'bg-red-50 text-red-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                >
                    <item.icon size={18} className={`mr-3 ${isActive(item.path) ? 'text-red-600' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                </Link>
            ))}
        </aside>
    );
};

export default ProfileSidebar;
