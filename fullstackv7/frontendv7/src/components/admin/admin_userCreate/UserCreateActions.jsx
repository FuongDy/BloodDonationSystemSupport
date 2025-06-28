// src/components/admin/userCreate/UserCreateActions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';

const UserCreateActions = ({ isLoading }) => {
  return (
    <div className="flex justify-end space-x-3">
      <Link to="/admin/users">
        <Button type="button" variant="secondary" disabled={isLoading}>
          Hủy
        </Button>
      </Link>
      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? (
          <LoadingSpinner size="5" color="white" className="mr-2" />
        ) : (
          <UserPlus size={18} className="mr-2" />
        )}
        {isLoading ? 'Đang lưu...' : 'Tạo người dùng'}
      </Button>
    </div>
  );
};

export default UserCreateActions;
