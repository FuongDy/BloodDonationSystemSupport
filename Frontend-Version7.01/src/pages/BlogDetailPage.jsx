// src/pages/BlogDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BlogDetailHeader,
  BlogDetailMeta,
  BlogDetailContent,
} from '../components/blog';
import { useBlogDetail } from '../hooks/useBlogDetail';

const BlogDetailPage = () => {
  const { id } = useParams();
  const { post, isLoading, isDeleting, canEdit, canDelete, handleDelete } = useBlogDetail(id);

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center py-20'>
          <h2 className='text-2xl font-semibold text-gray-700'>
            Không tìm thấy bài viết
          </h2>
          <Link
            to='/blog'
            className='text-red-600 hover:text-red-700 mt-4 inline-block'
          >
            ← Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <BlogDetailHeader />
      <BlogDetailContent 
        post={post}
        canEdit={canEdit}
        canDelete={canDelete}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default BlogDetailPage;
