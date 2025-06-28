// src/components/admin/userForm/UserFormActions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';

const UserFormActions = ({ isSubmitting, isEditMode }) => {
  if (!isEditMode) return null;

  return (
    <div className='flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200'>
      <Link to='/admin/users'>
        <Button
          type='button'
          variant='secondary'
          disabled={isSubmitting}
        >
          Quay lại danh sách
        </Button>
      </Link>
      <Button type='submit' variant='primary' disabled={isSubmitting}>
        {isSubmitting ? (
          <LoadingSpinner size='5' color='white' className='mr-2' />
        ) : (
          <Save size={18} className='mr-2' />
        )}
        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
      </Button>
    </div>
  );
};

export default UserFormActions;
