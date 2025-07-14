// src/components/blog/BlogEmptyState.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Button from '../common/Button';

const BlogEmptyState = ({ canCreate = false }) => {
  return (
    <div className='text-center py-20'>
      <h3 className='text-2xl font-semibold text-gray-700 mb-4'>
        Chưa có bài viết nào
      </h3>
      <p className='text-gray-500 mb-4'>
        {canCreate
          ? 'Hãy là người đầu tiên chia sẻ câu chuyện của bạn!'
          : 'Các bài viết sẽ được chia sẻ bởi Admin và Staff.'}
      </p>
      {canCreate && (
        <Link to='/blog/create'>
          <Button variant='primary'>
            <PlusCircle className='w-5 h-5 mr-2' />
            Viết bài đầu tiên
          </Button>
        </Link>
      )}
    </div>
  );
};

export default BlogEmptyState;
