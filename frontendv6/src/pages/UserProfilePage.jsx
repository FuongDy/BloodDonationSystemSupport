// src/pages/UserProfilePage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileSidebar from '../components/profile/ProfileSidebar.jsx';
import UserProfileViewPage from './profile/UserProfileViewPage.jsx';
import UserProfileEditPage from './profile/UserProfileEditPage.jsx';

// Placeholder components for sidebar routes
const ProfileSecurityPage = () => (
  <div className='bg-white shadow-xl rounded-lg p-6 md:p-8'>
    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Bảo mật & Đăng nhập</h2>
    <p className='text-gray-600'>Quản lý mật khẩu và cài đặt bảo mật tài khoản...</p>
  </div>
);

const ProfileDonationSchedulePage = () => (
  <div className='bg-white shadow-xl rounded-lg p-6 md:p-8'>
    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Lịch hiến máu</h2>
    <p className='text-gray-600'>Xem và quản lý lịch hẹn hiến máu của bạn...</p>
  </div>
);

const ProfileDonationHistoryPage = () => (
  <div className='bg-white shadow-xl rounded-lg p-6 md:p-8'>
    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Lịch sử hiến máu</h2>
    <p className='text-gray-600'>Xem lịch sử các lần hiến máu đã thực hiện...</p>
  </div>
);

const ProfileNotificationsPage = () => (
  <div className='bg-white shadow-xl rounded-lg p-6 md:p-8'>
    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Cài đặt thông báo</h2>
    <p className='text-gray-600'>Quản lý các thông báo và cảnh báo...</p>
  </div>
);

const ProfileSettingsPage = () => (
  <div className='bg-white shadow-xl rounded-lg p-6 md:p-8'>
    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Cài đặt tài khoản</h2>
    <p className='text-gray-600'>Cài đặt tổng quát cho tài khoản...</p>
  </div>
);

const UserProfilePage = () => {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            <Routes>
              <Route path='/' element={<UserProfileViewPage />} />
              <Route path='/edit' element={<UserProfileEditPage />} />
              <Route path='/security' element={<ProfileSecurityPage />} />
              <Route path='/schedule' element={<ProfileDonationSchedulePage />} />
              <Route path='/history' element={<ProfileDonationHistoryPage />} />
              <Route path='/notifications' element={<ProfileNotificationsPage />} />
              <Route path='/settings' element={<ProfileSettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

