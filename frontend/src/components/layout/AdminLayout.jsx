// frontendv2/src/components/layout/AdminLayout.jsx
import {
  Crown,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareWarning,
  Phone,
  UserCog,
  Users,
  Warehouse
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RoleBadge from '../common/RoleBadge';

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // Define color schemes based on user role
  const isStaff = user?.role === 'Staff';
  const colorScheme = isStaff ? {
    // Orange theme for Staff
    primary: 'orange-500',
    secondary: 'amber-500',
    light: 'orange-50',
    gradient: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-50 via-white to-amber-50',
    glassGradient: 'from-orange-500/10 to-amber-500/10',
    shadowColor: 'shadow-orange-500/25',
    hoverBg: 'group-hover:bg-orange-100',
    textColor: 'text-orange-600',
    iconColor: 'text-orange-500',
    backgroundElements: {
      first: 'bg-orange-200/30',
      second: 'bg-amber-200/30',
      third: 'bg-yellow-200/20',
      fourth: 'bg-orange-300/20',
      center: 'bg-amber-100/10'
    }
  } : {
    // Purple theme for Admin
    primary: 'purple-500',
    secondary: 'indigo-500', 
    light: 'purple-50',
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 via-white to-indigo-50',
    glassGradient: 'from-purple-500/10 to-indigo-500/10',
    shadowColor: 'shadow-purple-500/25',
    hoverBg: 'group-hover:bg-purple-100',
    textColor: 'text-purple-600',
    iconColor: 'text-purple-500',
    backgroundElements: {
      first: 'bg-purple-200/30',
      second: 'bg-indigo-200/30',
      third: 'bg-violet-200/20',
      fourth: 'bg-purple-300/20',
      center: 'bg-indigo-100/10'
    }
  };

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['Admin', 'Staff'],
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Quản lý người dùng',
      roles: ['Admin'],
    },
    {
      path: '/admin/emergency-requests',
      icon: MessageSquareWarning,
      label: 'Quản lý yêu cầu khẩn cấp',
      roles: ['Staff'],
    },
    // Donation Process Management - Separated into individual pages
    {
      path: '/admin/donation-process-management',
      icon: UserCog,
      label: 'Quản lý quy trình hiến máu',
      roles: [ 'Staff', 'Admin'],
    },
    {
      path: '/admin/donation-history',
      icon: History,
      label: 'Quản lý lịch sử hiến máu',
      roles: [ 'Staff', 'Admin'],
    },
    {
      path: '/admin/blood-inventory',
      icon: Warehouse,
      label: 'Quản lý kho máu',
      roles: [ 'Staff', 'Admin'],
    },
    {
      path: '/admin/blog-management',
      icon: FileText,
      label: 'Quản lý blog',
      roles: ['Admin', 'Staff'],
    },
    {
      path: '/admin/find-donor',
      icon: Users,
      label: 'Tìm người hiến máu',
      roles: [ 'Staff', 'Admin'],
    },
    {
      path: '/admin/reports',
      icon: FileText,
      label: 'Báo cáo hệ thống',
      roles: ['Admin'],
    },
  ];

  const isActive = path => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    
    <div className={`flex h-screen bg-gradient-to-br ${colorScheme.bgGradient} relative overflow-hidden max-w-full`}>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-32 w-96 h-96 ${colorScheme.backgroundElements.first} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -right-32 w-80 h-80 ${colorScheme.backgroundElements.second} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/3 right-20 w-48 h-48 ${colorScheme.backgroundElements.third} rounded-full blur-2xl animate-pulse delay-500`}></div>
        <div className={`absolute bottom-1/3 left-20 w-40 h-40 ${colorScheme.backgroundElements.fourth} rounded-full blur-2xl animate-pulse delay-1500`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${colorScheme.backgroundElements.center} rounded-full blur-3xl`}></div>
      </div>

      {/* Enhanced Glass Sidebar */}
      <aside className='w-80 bg-white/20 backdrop-blur-xl border-r border-white/30 text-gray-800 flex flex-col fixed h-full shadow-2xl z-10 overflow-hidden'>
        {/* Header with Logo and Branding */}
        <div className={`p-6 border-b border-white/30 bg-gradient-to-r ${colorScheme.glassGradient}`}>
          <Link to='/admin' className='flex items-center space-x-3'>
            <div className={`w-12 h-12 bg-gradient-to-br ${colorScheme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Crown className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <span className={`text-xl font-bold bg-gradient-to-r ${colorScheme.gradient} bg-clip-text text-transparent drop-shadow-sm`}>
                {user?.role === 'Staff' ? 'Staff Panel' : 'Admin Panel'}
              </span>
              <div className={`text-xs ${colorScheme.textColor}/80 font-medium`}>
                {user?.role === 'Staff' ? 'Quản lý nhân viên' : 'Quản trị hệ thống'}
              </div>
            </div>
          </Link>
        </div>

        {/* Enhanced User Info Card */}
        <div className='p-6 border-b border-white/30'>
          <div className={`bg-gradient-to-br ${colorScheme.glassGradient} backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className='flex items-center space-x-3 mb-3'>
              <div className={`w-12 h-12 bg-gradient-to-br ${colorScheme.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                <span className='text-white font-bold text-lg drop-shadow-sm'>
                  {user?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-gray-800 truncate drop-shadow-sm'>
                  {user?.fullName || 'Admin User'}
                </h3>
                <RoleBadge role={user?.role} />
              </div>
            </div>
            
            <div className='space-y-2 text-sm'>
              <div className='flex items-center text-gray-600'>
                <Mail className={`w-3.5 h-3.5 mr-2 ${colorScheme.iconColor}`} />
                <span className='truncate text-xs'>{user?.email || 'admin@system.com'}</span>
              </div>
              <div className='flex items-center text-gray-600'>
                <Phone className={`w-3.5 h-3.5 mr-2 ${colorScheme.iconColor}`} />
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
                      ? `bg-gradient-to-r ${colorScheme.gradient} text-white shadow-lg ${colorScheme.shadowColor} transform scale-[1.02]`
                      : `text-gray-700 hover:bg-white/40 hover:${colorScheme.textColor} backdrop-blur-sm border border-transparent hover:border-white/50`
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                    isItemActive 
                      ? 'bg-white/20 shadow-inner' 
                      : `${colorScheme.hoverBg} group-hover:scale-110`
                  }`}>
                    <item.icon 
                      size={16} 
                      className={`transition-all duration-300 ${
                        isItemActive 
                          ? 'text-white drop-shadow-sm' 
                          : `text-gray-600 group-hover:${colorScheme.textColor}`
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
        <div className={`p-4 border-t border-white/30 bg-gradient-to-r ${colorScheme.glassGradient.replace('/10', '/5')} space-y-2`}>
          {/* <Link
            to='/'
            className={`group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-white/40 hover:${colorScheme.textColor} transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/50 hover:shadow-md`}
          >
            <div className={`w-8 h-8 rounded-lg bg-transparent ${colorScheme.hoverBg} flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110`}>
              <Home size={16} className={`text-gray-600 group-hover:${colorScheme.textColor} transition-colors duration-300`} />
            </div>
            <span>Về trang chủ</span>
          </Link> */}
          
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
      <div className='flex-1 flex flex-col ml-80 relative min-h-screen'>
        <main className='flex-1 p-8 overflow-y-auto overflow-x-hidden'>
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl min-h-full border border-white/40 shadow-xl p-6 hover:shadow-2xl transition-all duration-500 overflow-hidden">
            <div className="w-full max-w-none overflow-x-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
