// src/components/layout/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, ShieldAlert, Home as HomeIcon, Droplets, GitCompareArrows } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth'; // Sử dụng useAuth hook

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth(); // Lấy user và hàm logout từ context

    const handleLogout = () => {
        logout(); //
        navigate('/login');
    };

    // ProtectedRoute sẽ xử lý việc chưa đăng nhập hoặc sai role
    // Tuy nhiên, kiểm tra ở đây vẫn tốt để phòng trường hợp truy cập trực tiếp
    if (user?.role !== 'Admin') { //
        // navigate('/forbidden'); // Hoặc trang chủ nếu không có trang forbidden
        // return null; 
        // Note: Navigate trong render phase không được khuyến khích, ProtectedRoute đã làm việc này.
        // Nếu component này render, nghĩa là ProtectedRoute đã cho phép.
    }

    const isActive = (path) => location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path));


    const menuItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/users", icon: Users, label: "Quản lí người dùng" },
        { path: "/admin/blood-types", icon: Droplets, label: "Loại máu" },
        { path: "/admin/blood-components", icon: ShieldAlert, label: "Thành phần máu" },
        { path: "/admin/blood-compatibility", icon: GitCompareArrows, label: "Tương thích máu" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 pt-16"> {/* pt-16 cho navbar cố định chiều cao h-16 */}
                <aside className="w-64 bg-slate-800 text-slate-100 p-4 space-y-2 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto shadow-lg">
                    <h2 className="text-xl font-semibold mb-6 px-2 text-slate-50">Admin Panel</h2>
                    <nav>
                        <ul>
                            {menuItems.map((item) => (
                                <li key={item.path} className="mb-1">
                                    <Link
                                        to={item.path}
                                        className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out group ${
                                            isActive(item.path)
                                                ? 'bg-red-600 text-white shadow-md' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }`}
                                    >
                                        <item.icon size={20} className={`mr-3 group-hover:text-red-400 ${isActive(item.path) ? 'text-white' : 'text-slate-400'}`} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                            <hr className="my-4 border-slate-600" />
                            <li>
                                <Link to="/" className="flex items-center py-2.5 px-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out group">
                                    <HomeIcon size={20} className="mr-3 text-slate-400 group-hover:text-red-400" />
                                    <span className="font-medium">Về trang chủ</span>
                                </Link>
                            </li>
                            <li className="mt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center py-2.5 px-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-left transition-all duration-200 ease-in-out group"
                                >
                                    <LogOut size={20} className="mr-3 text-slate-400 group-hover:text-red-400" />
                                    <span className="font-medium">Đăng xuất</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 p-6 bg-gray-50 ml-64"> {/* Changed bg-gray-100 to bg-gray-50 for a lighter content area */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;