// src/components/blog/createEdit/BlogCreateEditForm.jsx
import React from 'react';
import BlogFormTitle from './BlogFormTitle';
import BlogFormImage from './BlogFormImage';
import BlogFormContent from './BlogFormContent';
import BlogFormTags from './BlogFormTags';
import BlogFormActions from './BlogFormActions';

const BlogCreateEditForm = ({
  formData,
  isEdit,
  isSaving,
  isFormValid,
  onChange,
  onSubmit,
  onGoBack,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-lg'>
      <form onSubmit={onSubmit} className='p-8 space-y-6'>
        <BlogFormTitle
          value={formData.title}
          onChange={onChange}
          disabled={isSaving}
        />

        <BlogFormImage
          imageUrl={formData.imageUrl}
          onChange={onChange}
          disabled={isSaving}
        />

        <BlogFormContent
          value={formData.content}
          onChange={onChange}
          disabled={isSaving}
        />

        <BlogFormTags
          value={formData.tags}
          onChange={onChange}
          disabled={isSaving}
        />

        <BlogFormActions
          isEdit={isEdit}
          isSaving={isSaving}
          isFormValid={isFormValid}
          onGoBack={onGoBack}
          onSubmit={onSubmit}
        />
      </form>
    </div>
  );
};

export default BlogCreateEditForm;
