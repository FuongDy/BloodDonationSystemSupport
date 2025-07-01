// src/components/admin/AdminLoadingState.jsx
import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminLoadingState = ({
  message = 'Đang tải...',
  className = 'flex justify-center items-center py-10',
  spinnerSize = '12',
}) => {
  return (
    <div className={className}>
      <div className='text-center'>
        <LoadingSpinner size={spinnerSize} />
        {message && <p className='mt-2 text-gray-600'>{message}</p>}
      </div>
    </div>
  );
};

export default AdminLoadingState;
