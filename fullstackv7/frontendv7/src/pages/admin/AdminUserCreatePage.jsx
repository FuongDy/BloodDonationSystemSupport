// src/pages/admin/AdminUserCreatePage.jsx
import React from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAdminUserCreate } from '../../hooks/useAdminUserCreate';
import {
  UserCreateHeader,
  UserCreateBasicInfo,
  UserCreatePersonalInfo,
  UserCreateRoleAndStatus,
  UserCreateActions,
} from '../../components/admin/admin_userCreate';

const AdminUserCreatePage = () => {
  const {
    formData,
    roles,
    bloodTypes,
    isLoading,
    errors,
    handleInputChange,
    handleSubmit,
  } = useAdminUserCreate();

  if (isLoading && roles.length === 0) {
    // Only show loading for initial data fetch
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="12" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <UserCreateHeader />
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <UserCreateBasicInfo
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          isLoading={isLoading}
        />

        <UserCreatePersonalInfo
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          isLoading={isLoading}
        />

        <UserCreateRoleAndStatus
          formData={formData}
          roles={roles}
          bloodTypes={bloodTypes}
          onInputChange={handleInputChange}
          errors={errors}
          isLoading={isLoading}
        />

        <UserCreateActions isLoading={isLoading} />
      </form>
    </div>
  );
};

export default AdminUserCreatePage;
