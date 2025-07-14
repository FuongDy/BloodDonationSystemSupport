// src/components/blog/BlogDetailHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BlogDetailHeader = () => {
  return (
    <div className='mb-6'>
      <Link
        to='/blog'
        className='inline-flex items-center text-gray-600 hover:text-gray-900'
      >
        <ArrowLeft className='w-4 h-4 mr-2' />
        Quay lại danh sách bài viết
      </Link>
    </div>
  );
};

export default BlogDetailHeader;
