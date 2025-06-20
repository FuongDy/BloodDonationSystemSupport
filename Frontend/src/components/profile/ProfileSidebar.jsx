// src/components/profile/ProfileSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ShieldCheck, CalendarDays, History, Settings, Bell, Menu, X } from 'lucide-react';

const ProfileSidebar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <>
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full bg-white rounded-lg shadow-lg p-4 flex items-center justify-between text-gray-700 hover:text-red-600 transition-colors"
                >
                    <span className="font-medium">Menu tài khoản</span>
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`w-full lg:w-80 bg-white rounded-lg shadow-lg overflow-hidden h-fit sticky top-24 ${
                isMobileMenuOpen ? 'block' : 'hidden lg:block'
            }`}>
                <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <h2 className="text-lg font-semibold">Quản lý tài khoản</h2>
                    <p className="text-red-100 text-sm mt-1">Cập nhật thông tin cá nhân</p>
                </div>
                <nav className="p-2">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 mb-1 group
                                ${isActive(item.path)
                                    ? 'bg-red-50 text-red-700 border-l-4 border-red-500 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                                }`}
                        >
                            <item.icon 
                                size={20} 
                                className={`mr-3 transition-colors duration-200 ${
                                    isActive(item.path) 
                                        ? 'text-red-600' 
                                        : 'text-gray-400 group-hover:text-gray-600'
                                }`} 
                            />
                            <span className="flex-1">{item.label}</span>
                            {isActive(item.path) && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default ProfileSidebar;
