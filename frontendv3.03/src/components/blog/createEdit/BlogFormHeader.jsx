// src/components/blog/createEdit/BlogFormHeader.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const BlogFormHeader = ({ isEdit, onGoBack }) => {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div>
        <button
          onClick={onGoBack}
          className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-4'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Quay lại
        </button>
        <h1 className='text-3xl font-bold text-gray-900'>
          {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
        </h1>
      </div>
    </div>
  );
};

export default BlogFormHeader;
