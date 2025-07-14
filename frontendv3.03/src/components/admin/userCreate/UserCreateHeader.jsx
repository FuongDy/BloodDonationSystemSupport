// src/components/admin/userCreate/UserCreateHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const UserCreateHeader = () => {
  return (
    <div className="mb-6">
      <Link
        to="/admin/users"
        className="flex items-center text-red-600 hover:text-red-800 mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Quay lại danh sách
      </Link>
      <h1 className="text-2xl font-bold text-gray-800">
        Tạo Người dùng mới
      </h1>
    </div>
  );
};

export default UserCreateHeader;
