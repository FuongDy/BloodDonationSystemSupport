// src/components/admin/userForm/UserAccountSection.jsx
import React from 'react';
import { Shield, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react';
import UserDetailItem from './UserDetailItem';

const UserAccountSection = ({ 
  user, 
  roles,
  isEditMode, 
  formData, 
  onInputChange, 
  errors, 
  isSubmitting 
}) => {
  return (
    <>
      <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
        Thông tin tài khoản
      </h3>
      <UserDetailItem
        icon={Shield}
        label='Vai trò'
        value={user.role}
        highlight={true}
        isEditable={true}
        fieldName='roleName'
        fieldType='select'
        options={roles.map(role => ({
          value: role.name,
          label: `${role.name}`,
        }))}
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={
          user.status === 'ACTIVE'
            ? CheckCircle
            : user.status === 'SUSPENDED'
              ? XCircle
              : HelpCircle
        }
        label='Trạng thái'
        value={
          user.status === 'ACTIVE'
            ? 'Hoạt động'
            : user.status === 'SUSPENDED'
              ? 'Tạm khóa'
              : user.status === 'DEACTIVATED'
                ? 'Vô hiệu hóa'
                : user.status
        }
        highlight={user.status === 'ACTIVE'}
        isEditable={true}
        fieldName='status'
        fieldType='select'
        options={[
          { value: 'ACTIVE', label: 'Hoạt động' },
          { value: 'SUSPENDED', label: 'Tạm khóa' },
          { value: 'DEACTIVATED', label: 'Vô hiệu ' },
        ]}
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={user.emailVerified ? CheckCircle : XCircle}
        label='Email đã xác thực'
        value={user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
        isEditable={true}
        fieldName='emailVerified'
        fieldType='checkbox'
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={user.phoneVerified ? CheckCircle : XCircle}
        label='SĐT đã xác thực'
        value={user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
        isEditable={true}
        fieldName='phoneVerified'
        fieldType='checkbox'
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={onInputChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <UserDetailItem
        icon={Clock}
        label='Ngày tạo'
        value={
          user.createdAt
            ? new Date(user.createdAt).toLocaleString()
            : null
        }
      />
      <UserDetailItem
        icon={Clock}
        label='Cập nhật lần cuối'
        value={
          user.updatedAt
            ? new Date(user.updatedAt).toLocaleString()
            : null
        }
      />
    </>
  );
};

export default UserAccountSection;
