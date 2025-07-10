// src/components/layout/StaffLayout.jsx
import React, { useState } from 'react';
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
  Menu,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const StaffLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className='flex h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white/80 backdrop-blur-xl shadow-xl border-r border-white/20 flex flex-col fixed h-full transition-all duration-300`}>
        {/* Header */}
        <div className='bg-orange-500/90 backdrop-blur-md border-b border-orange-400/50'>
          <div className='flex items-center justify-between h-16 px-4'>
            {!sidebarCollapsed && (
              <Link to='/staff' className='flex items-center space-x-2 text-white'>
                <img src='/logo.png' alt='Logo' className='h-8 w-auto' />
                <span className='text-lg font-bold'>Staff Panel</span>
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className='text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 backdrop-blur-sm'
            >
              {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className='flex-1 px-3 py-4 space-y-1'>
          {menuItems.map(item => {
            if (user && item.roles.includes(user.role)) {
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center ${sidebarCollapsed ? 'px-3 justify-center' : 'px-3'} py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-orange-100/70 text-orange-700 border-l-4 border-orange-500/80 shadow-lg backdrop-blur-sm'
                      : 'text-gray-700 hover:bg-orange-50/60 hover:text-orange-600 hover:border-l-4 hover:border-orange-300/60 hover:backdrop-blur-sm'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon 
                    size={20} 
                    className={`${sidebarCollapsed ? '' : 'mr-3'} ${
                      isActive(item.path) ? 'text-orange-600' : 'text-gray-500'
                    }`} 
                  />
                  {!sidebarCollapsed && item.label}
                </Link>
              );
            }
            return null;
          })}
        </nav>
        
        {/* Footer */}
        <div className='px-0 py-4 border-t border-white/20 space-y-3 bg-gray-50/30 backdrop-blur-md'>
          {/* User Info */}
          {!sidebarCollapsed && (
            <div className='bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-none p-3 shadow-lg border-y border-orange-300/30 relative overflow-hidden'>
              {/* Glass effect overlay */}
              <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
              <div className='relative flex items-center space-x-2.5'>
                <div className='w-10 h-10 bg-white/95 rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm flex-shrink-0 border border-white/20'>
                  <span className='text-orange-600 font-bold text-sm'>
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'T'}
                  </span>
                </div>
                <div className='flex-1 min-w-0 overflow-hidden'>
                  <p className='text-white font-semibold text-xs leading-tight truncate drop-shadow-sm'>
                    {user?.fullName || 'Tần Khang Bùi Nguyên'}
                  </p>
                  <p className='text-orange-100 text-xs leading-tight truncate drop-shadow-sm'>
                    {user?.email || 'tankhang646@gmail.com'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className='px-2'>
            <Link
              to='/'
              className={`group w-full flex items-center ${sidebarCollapsed ? 'px-3 justify-center' : 'px-3'} py-3 text-sm font-medium rounded-xl text-gray-700 bg-white/60 hover:bg-white/80 hover:text-orange-600 hover:shadow-lg backdrop-blur-md transition-all duration-200 border border-white/40 hover:border-orange-200`}
              title={sidebarCollapsed ? 'Về trang chủ' : undefined}
            >
              <Home size={20} className={`${sidebarCollapsed ? '' : 'mr-3'} text-gray-600 group-hover:text-orange-600 transition-colors duration-200`} />
              {!sidebarCollapsed && 'Về trang chủ'}
            </Link>
          </div>
          
          <div className='px-2'>
            <button
              onClick={logout}
              className={`group w-full flex items-center ${sidebarCollapsed ? 'px-3 justify-center' : 'px-3'} py-3 text-sm font-medium rounded-xl text-gray-700 bg-white/60 hover:bg-red-50/90 hover:text-red-600 hover:shadow-lg backdrop-blur-md transition-all duration-200 border border-white/40 hover:border-red-200`}
              title={sidebarCollapsed ? 'Đăng xuất' : undefined}
            >
              <LogOut size={20} className={`${sidebarCollapsed ? '' : 'mr-3'} text-gray-600 group-hover:text-red-600 transition-colors duration-200`} />
              {!sidebarCollapsed && 'Đăng xuất'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <main className='flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
