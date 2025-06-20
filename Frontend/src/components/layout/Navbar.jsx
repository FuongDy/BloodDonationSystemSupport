// src/components/layout/Navbar.jsx
import React from 'react';
import { Heart, Home, CalendarPlus, ShieldAlert, UserCog, LogOut, UserCircle, LogIn, UserPlus, BookOpen, Rss } from 'lucide-react'; // Updated icons
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, isAuthenticated, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        toast.success('Đã đăng xuất!');
        navigate('/');
    };

    // Updated navLinks based on the new requirements
    const navLinks = [
        { to: "/", label: "Trang chủ", icon: Home },
        { to: "/handbook", label: "Cẩm nang", icon: BookOpen },
        { to: "/urgent-requests", label: "Cần máu gấp", icon: ShieldAlert },
        { to: "/schedule-donation", label: "Đặt lịch hiến máu", icon: CalendarPlus },
        { to: "/blog", label: "Blog", icon: Rss },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white shadow-md border-b border-gray-200 fixed w-full top-0 z-50 h-16">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Changed to max-w-screen-xl */}
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Logo BloodConnect" className="w-10 h-10 sm:w-12 sm:h-12" /> {/* Adjusted logo size */}
                        <span className="text-lg sm:text-xl font-bold text-red-600">BloodConnect</span> {/* Red color for brand */}
                    </Link>

                    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                    ${isActive(link.to)
                                        ? 'bg-red-50 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <link.icon className={`w-4 h-4 ${isActive(link.to) ? 'text-red-600' : 'text-gray-500'}`} />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        {isAuthenticated && user?.role === 'Admin' && (
                             <Link
                                to="/admin"
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                    ${isActive('/admin') || location.pathname.startsWith('/admin/')
                                        ? 'bg-red-50 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <UserCog className={`w-4 h-4 ${isActive('/admin') || location.pathname.startsWith('/admin/') ? 'text-red-600' : 'text-gray-500'}`} />
                                <span>Quản trị</span>
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center space-x-3">
                        {loading ? (
                            <span className="text-sm text-gray-500 px-3 py-1.5">Đang tải...</span>
                        ) : isAuthenticated && user ? (
                            <>
                                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors">
                                    <UserCircle className="w-6 h-6" /> {/* Slightly larger icon */}
                                    <span className="text-sm font-medium hidden sm:block">{user.fullName || user.email}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm px-4 py-2 rounded-md" // Primary button style
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:block">Đăng xuất</span>
                                    <span className="sm:hidden">Thoát</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium transition-colors text-sm px-3 py-1.5 rounded-md hover:bg-gray-100"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Đăng nhập</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm px-4 py-2 rounded-md" // Primary button style
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Đăng ký</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;