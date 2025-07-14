// src/components/layout/StaffLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Droplets,
  Calendar,
  Warehouse,
  FileText,
  BarChart3,
  Home,
  LogOut,
  Shield,
  Settings,
  Mail,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import RoleBadge from '../common/RoleBadge';

const StaffLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      path: '/staff',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['Staff'],
    },
    {
      path: '/staff/donations',
      icon: Droplets,
      label: 'Quản lý hiến máu',
      roles: ['Staff'],
    },
    {
      path: '/staff/appointments',
      icon: Calendar,
      label: 'Quản lý lịch hẹn',
      roles: ['Staff'],
    },
    {
      path: '/staff/users',
      icon: Users,
      label: 'Quản lý người dùng',
      roles: ['Staff'],
    },
    {
      path: '/staff/inventory',
      icon: Warehouse,
      label: 'Quản lý kho máu',
      roles: ['Staff'],
    },
    {
      path: '/staff/blog-management',
      icon: FileText,
      label: 'Quản lý blog',
      roles: ['Staff'],
    },
    {
      path: '/staff/reports',
      icon: BarChart3,
      label: 'Báo cáo',
      roles: ['Staff'],
    },
  ];

  const isActive = path => {
    if (path === '/staff') {
      return location.pathname === '/staff';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className='flex h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 relative overflow-hidden'>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-32 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-orange-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-20 w-40 h-40 bg-amber-300/20 rounded-full blur-2xl animate-pulse delay-1500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Glass Sidebar */}
      <aside className='w-80 bg-white/20 backdrop-blur-xl border-r border-white/30 text-gray-800 flex flex-col fixed h-full shadow-2xl z-10'>
        {/* Header with Logo and Branding */}
        <div className='p-6 border-b border-white/30 bg-gradient-to-r from-orange-500/10 to-amber-500/10'>
          <Link to='/staff' className='flex items-center space-x-3'>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <span className='text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-sm'>
                Staff Panel
              </span>
              <div className='text-xs text-orange-600/80 font-medium'>
                Quản lý hiến máu
              </div>
            </div>
          </Link>
        </div>

        {/* Enhanced User Info Card */}
        <div className='p-6 border-b border-white/30'>
          <div className='bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-center space-x-3 mb-3'>
              <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md'>
                <span className='text-white font-bold text-lg drop-shadow-sm'>
                  {user?.fullName?.charAt(0) || 'S'}
                </span>
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-gray-800 truncate drop-shadow-sm'>
                  {user?.fullName || 'Staff User'}
                </h3>
                <RoleBadge role={user?.role} />
              </div>
            </div>
            
            <div className='space-y-2 text-sm'>
              <div className='flex items-center text-gray-600'>
                <Mail className='w-3.5 h-3.5 mr-2 text-orange-500' />
                <span className='truncate text-xs'>{user?.email || 'staff@system.com'}</span>
              </div>
              <div className='flex items-center text-gray-600'>
                <Phone className='w-3.5 h-3.5 mr-2 text-orange-500' />
                <span className='text-xs'>{user?.phone || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto'>
          {menuItems.map(item => {
            if (user && item.roles.includes(user.role)) {
              const isItemActive = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 hover:shadow-lg ${
                    isItemActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-white/40 hover:text-orange-600 backdrop-blur-sm border border-transparent hover:border-white/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                    isItemActive 
                      ? 'bg-white/20 shadow-inner' 
                      : 'group-hover:bg-orange-100 group-hover:scale-110'
                  }`}>
                    <item.icon 
                      size={16} 
                      className={`transition-all duration-300 ${
                        isItemActive 
                          ? 'text-white drop-shadow-sm' 
                          : 'text-gray-600 group-hover:text-orange-600'
                      }`} 
                    />
                  </div>
                  <span className={`transition-all duration-300 ${
                    isItemActive ? 'drop-shadow-sm' : ''
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            }
            return null;
          })}
        </nav>

        {/* Enhanced Footer Actions */}
        <div className='p-4 border-t border-white/30 bg-gradient-to-r from-orange-500/5 to-amber-500/5 space-y-2'>
          <Link
            to='/'
            className='group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-white/40 hover:text-orange-600 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/50 hover:shadow-md'
          >
            <div className="w-8 h-8 rounded-lg bg-transparent group-hover:bg-orange-100 flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110">
              <Home size={16} className='text-gray-600 group-hover:text-orange-600 transition-colors duration-300' />
            </div>
            <span>Về trang chủ</span>
          </Link>
          
          <button
            onClick={logout}
            className='group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-red-200/50 hover:shadow-md'
          >
            <div className="w-8 h-8 rounded-lg bg-transparent group-hover:bg-red-100 flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110">
              <LogOut size={16} className='text-gray-600 group-hover:text-red-600 transition-colors duration-300' />
            </div>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Enhanced Main Content */}
      <div className='flex-1 flex flex-col ml-80 relative'>
        <main className='flex-1 p-8 overflow-y-auto'>
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl min-h-full border border-white/40 shadow-xl p-6 hover:shadow-2xl transition-all duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
