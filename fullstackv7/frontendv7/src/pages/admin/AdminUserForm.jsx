// src/pages/admin/AdminUserForm.jsx
import React from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  UserFormHeader,
  UserContactSection,
  UserPersonalSection,
  UserAccountSection,
  UserFormActions,
} from '../../components/admin/admin_userForm';
import { useAdminUserForm } from '../../hooks/useAdminUserForm';

/**
 * AdminUserForm Component
 *
 * Component có thể hoạt động ở 2 modes:
 * - mode="view": Hiển thị thông tin chi tiết (read-only)
 * - mode="edit": Form chỉnh sửa thông tin
 *
 * @param {Object} props
 * @param {string} props.userId - ID của user
 * @param {string} props.mode - "view" hoặc "edit"
 */
const AdminUserForm = ({ userId, mode = 'view' }) => {
  const {
    user,
    formData,
    roles,
    bloodTypes,
    isLoading,
    isSubmitting,
    errors,
    isEditMode,
    isViewMode,
    handleInputChange,
    handleSubmit,
  } = useAdminUserForm(userId, mode);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='12' />
      </div>
    );
  }

  if (!user) {
    return <div className='text-center py-10'>Không tìm thấy người dùng.</div>;
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <UserFormHeader 
        user={user}
        userId={userId}
        isEditMode={isEditMode}
        isViewMode={isViewMode}
      />

      <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
        {/* UNIFIED VIEW/EDIT MODE */}
        {isEditMode ? (
          <form onSubmit={handleSubmit} className='px-6 py-5'>
            <dl className='divide-y divide-gray-200'>
              <UserContactSection
                user={user}
                isEditMode={isEditMode}
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                isSubmitting={isSubmitting}
              />

              <UserPersonalSection
                user={user}
                bloodTypes={bloodTypes}
                isEditMode={isEditMode}
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                isSubmitting={isSubmitting}
              />

              <UserAccountSection
                user={user}
                roles={roles}
                isEditMode={isEditMode}
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            </dl>

            <UserFormActions 
              isSubmitting={isSubmitting}
              isEditMode={isEditMode}
            />
          </form>
        ) : (
          <div className='px-6 py-5'>
            <dl className='divide-y divide-gray-200'>
              <UserContactSection
                user={user}
                isEditMode={isEditMode}
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                isSubmitting={isSubmitting}
              />

              <UserPersonalSection
                user={user}
                bloodTypes={bloodTypes}
                isEditMode={isEditMode}
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                isSubmitting={isSubmitting}
              />

              <UserAccountSection
                user={user}
                roles={roles}
                isEditMode={isEditMode}
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserForm;
