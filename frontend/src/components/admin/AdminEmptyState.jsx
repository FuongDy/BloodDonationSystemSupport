// src/components/admin/AdminEmptyState.jsx
import React from 'react';

const AdminEmptyState = ({
  message = 'Không có dữ liệu nào phù hợp.',
  icon: IconComponent,
  className = 'text-center text-gray-500 py-8',
  children,
}) => (
  <div className={className}>
    {IconComponent && (
      <IconComponent className='w-12 h-12 text-gray-400 mx-auto mb-4' />
    )}
    <p>{message}</p>
    {children}
  </div>
);

export default AdminEmptyState;
