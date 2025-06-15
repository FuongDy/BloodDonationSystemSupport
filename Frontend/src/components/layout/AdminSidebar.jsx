// src/components/layout/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, LogOut, Home as HomeIcon, Droplets, GitCompareArrows, 
    ChevronsLeft, ChevronsRight, Flame, MessageSquareWarning, History, Archive 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = ({ isOpen, toggleSidebar }) => { 
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path));

    const menuItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/users", icon: Users, label: "Quản lý người dùng" },
        { path: "/admin/blood-types", icon: Droplets, label: "Quản lý loại máu" },
        { path: "/admin/blood-compatibility", icon: GitCompareArrows, label: "Quản lý tương thích" },
        { path: "/admin/emergency-requests", icon: MessageSquareWarning, label: "Quản lý yêu cầu Khẩn cấp" },
        { path: "/admin/donation-history", icon: History, label: "Quản lí lịch sử hiến máu" },
        { path: "/admin/blood-inventory", icon: Archive, label: "Quản lý kho máu" },
    ];

    return (
        <aside 
            className={`bg-slate-800 text-slate-100 p-4 space-y-2 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}
        >
            <div className="flex items-center justify-between mb-6">
                {isOpen ? (
                    <div className="flex items-center">
                        <Flame size={26} className="text-red-500 mr-2.5" />
                        <h2 className="text-xl font-semibold text-slate-50">Admin Panel</h2>
                    </div>
                ) : (
                    <div /> 
                )}
                <button 
                    onClick={toggleSidebar} 
                    className="text-slate-300 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    title={isOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
                >
                    {isOpen ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
                </button>
            </div>
            <nav className="flex flex-col h-[calc(100%-3rem)]"> {/* Adjusted height from 4rem to 3rem */}
                <ul className="flex-grow">
                    {menuItems.map((item) => (
                        <li key={item.path} className="mb-1" title={!isOpen ? item.label : ''}>
                            <Link
                                to={item.path}
                                className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out group ${
                                    isActive(item.path)
                                        ? 'bg-slate-900 text-white shadow-md' 
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    } ${!isOpen ? 'justify-center' : ''}`}
                            >
                                <item.icon size={20} className={`${isOpen ? 'mr-3' : 'mr-0'} ${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'}`} />
                                {isOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto">
                    <hr className="my-2 border-slate-600" /> {/* Adjusted margin from my-4 to my-2 */}
                    <li title={!isOpen ? "Về trang chủ" : ''}>
                        <Link 
                            to="/" 
                            className={`flex items-center py-2.5 px-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out group ${!isOpen ? 'justify-center' : ''}`}
                        >
                            <HomeIcon size={20} className={`${isOpen ? 'mr-3' : 'mr-0'} text-slate-400 group-hover:text-slate-100`} />
                            {isOpen && <span className="font-medium">Về trang chủ</span>}
                        </Link>
                    </li>
                    <li className="mt-1" title={!isOpen ? "Đăng xuất" : ''}>
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center py-2.5 px-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-left transition-all duration-200 ease-in-out group ${!isOpen ? 'justify-center' : ''}`}
                        >
                            <LogOut size={20} className={`${isOpen ? 'mr-3' : 'mr-0'} text-slate-400 group-hover:text-slate-100`} />
                            {isOpen && <span className="font-medium">Đăng xuất</span>}
                        </button>
                    </li>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
