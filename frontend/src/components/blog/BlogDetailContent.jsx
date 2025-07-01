// src/components/blog/BlogDetailContent.jsx
import React from 'react';
import BlogDetailMeta from './BlogDetailMeta';

const BlogDetailContent = ({ 
  post, 
  canEdit, 
  canDelete, 
  onDelete, 
  isDeleting 
}) => {
  return (
    <article className='bg-white rounded-lg shadow-lg overflow-hidden'>
      {/* Featured Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className='w-full h-64 md:h-96 object-cover'
        />
      )}

      <div className='p-8'>
        {/* Meta */}
        <BlogDetailMeta
          post={post}
          canEdit={canEdit}
          canDelete={canDelete}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />

        {/* Status Badge */}
        {post.status && post.status !== 'PUBLISHED' && (
          <div className='mb-4'>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                post.status === 'DRAFT'
                  ? 'bg-gray-100 text-gray-800'
                  : post.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {post.status === 'DRAFT'
                ? 'Bản nháp'
                : post.status === 'PENDING'
                  ? 'Chờ duyệt'
                  : 'Đã từ chối'}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
          {post.title}
        </h1>

        {/* Content */}
        <div className='prose prose-lg max-w-none'>
          {post.content.split('\n').map(
            (paragraph, index) =>
              paragraph.trim() && (
                <p key={index} className='mb-4 text-gray-700 leading-relaxed'>
                  {paragraph}
                </p>
              )
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <div className='flex flex-wrap gap-2'>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800'
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogDetailContent;
