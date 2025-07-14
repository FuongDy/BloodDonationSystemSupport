// src/components/admin/AdminLoadingState.jsx
import React from 'react';

const AdminLoadingState = ({ message = 'Đang tải dữ liệu...' }) => (
  <div className='text-center text-gray-400 py-8 animate-pulse'>
    <div className='w-12 h-12 mx-auto mb-4 rounded-full bg-gray-200' />
    <p>{message}</p>
  </div>
);

export default AdminLoadingState;
