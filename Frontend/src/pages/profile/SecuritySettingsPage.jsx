import React from 'react';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';

const SecuritySettingsPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bảo mật & Đăng nhập</h2>
      <ChangePasswordForm />
    </div>
  );
};

export default SecuritySettingsPage;
