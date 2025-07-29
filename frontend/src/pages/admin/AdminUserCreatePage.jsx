// src/pages/admin/AdminUserCreatePage.jsx
import React from 'react';
import {
  UserCreateActions,
  UserCreateBasicInfo,
  UserCreateHeader,
  UserCreatePersonalInfo,
  UserCreateRoleAndStatus,
} from '../../components/admin/userCreate';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAdminUserCreate from '../../hooks/useAdminUserCreate';

const AdminUserCreatePage = () => {
  const {
    formData,
    bloodTypes,
    isLoading,
    errors,
    handleInputChange,
    handleSubmit,
    loadBloodTypes,
  } = useAdminUserCreate();

  // Load blood types on component mount
  React.useEffect(() => {
    loadBloodTypes();
  }, [loadBloodTypes]);

  if (isLoading && bloodTypes.length === 0) {
    // Only show loading for initial data fetch
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="12" />
      </div>
    );
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <UserCreateHeader />
      
      <form
        onSubmit={handleFormSubmit}
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
