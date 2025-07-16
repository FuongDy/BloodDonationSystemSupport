import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  UserCircle,
  Shield,
  CalendarDays,
  History,
  Bell,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ProfileSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/profile', icon: UserCircle, label: 'Thông tin cá nhân' },
  ];

  const isActive = path => {
    if (path === '/profile') {
      return location.pathname === '/profile';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <div className='flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200'>
        <UserCircle size={40} className='text-red-600' />
        <div>
          <h3 className='font-medium text-gray-800'>
            {user?.fullName || 'Người dùng'}
          </h3>
          <p className='text-sm text-gray-600'>{user?.email || ''}</p>
        </div>
      </div>

      <nav>
        <ul className='space-y-2'>
          {menuItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/profile'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 py-2.5 px-3 rounded-lg transition duration-200 ${
                    isActive
                      ? 'bg-red-50 text-red-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  size={18}
                  className={
                    isActive(item.path) ? 'text-red-600' : 'text-gray-500'
                  }
                />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
