// src/components/blog/BlogGrid.jsx
import React from 'react';
import BlogCard from './BlogCard';
import Pagination from '../common/Pagination';

const BlogGrid = ({ posts, currentPage, totalPages, onPageChange }) => {
  return (
    <>
      {/* Blog Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

export default BlogGrid;
