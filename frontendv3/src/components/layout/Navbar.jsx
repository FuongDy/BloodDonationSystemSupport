// src/components/layout/Navbar.jsx
import React from 'react';
import { Heart, Home, Search, BookOpen, User, LogOut, UserCircle, LogIn, UserPlus, Shield, ClipboardList, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, isAuthenticated, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Đã đăng xuất thành công!');
        navigate('/');
    };

    const navLinks = [
        { to: "/", label: "Trang chủ" },
        { to: "/blood-compatibility-checker", label: "Kiểm tra tương thích" }, 
        { to: "/find-donors", label: "Tìm người hiến" },
        { to: "/emergency-request", label: "Yêu cầu khẩn cấp" },
        { to: "/blog", label: "Blog" },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Logo BloodConnect" className="h-12 w-auto" />
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">BloodConnect</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                   
                    <div className="flex items-center space-x-3">
                        {loading ? (
                            <span className="text-sm text-gray-500">Đang tải...</span>
                        ) : isAuthenticated && user ? (
                            <div className="flex items-center space-x-3">
                                {user.role === 'Admin' && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 px-3 py-1.5 rounded-md bg-purple-100 hover:bg-purple-200 transition-colors"
                                        title="Admin Dashboard"
                                    >
                                        <Shield size={16} className="mr-1" />
                                        Admin
                                    </Link>
                                )}
                                {user.role === 'Staff' && ( // Thêm link cho Staff Dashboard
                                    <Link
                                        to="/staff"
                                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors"
                                        title="Staff Dashboard"
                                    >
                                        <ClipboardList size={16} className="mr-1" />
                                        Staff
                                    </Link>
                                )}
                                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-red-600">
                                    <UserCircle className="w-6 h-6" />
                                    <span className="text-sm font-medium hidden sm:block">{user.fullName || user.email}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium transition-colors text-sm px-3 py-1.5"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Đăng nhập</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm px-4 py-2 rounded-md shadow-sm"
                                >
                                    <span>Đăng ký</span>
                                    <UserPlus className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;