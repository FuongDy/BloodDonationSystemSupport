// src/pages/BlogCreateEditPage.jsx
import React from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useBlogCreateEdit } from '../hooks/useBlogCreateEdit';
import { BlogFormHeader, BlogCreateEditForm } from '../components/blog/createEdit';

const BlogCreateEditPage = () => {
  const {
    formData,
    isLoading,
    isSaving,
    isEdit,
    isFormValid,
    handleChange,
    handleSubmit,
    handleGoBack,
  } = useBlogCreateEdit();

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <BlogFormHeader isEdit={isEdit} onGoBack={handleGoBack} />
      
      <BlogCreateEditForm
        formData={formData}
        isEdit={isEdit}
        isSaving={isSaving}
        isFormValid={isFormValid}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onGoBack={handleGoBack}
      />
    </div>
  );
};

export default BlogCreateEditPage;
