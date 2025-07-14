// src/components/blog/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Eye } from 'lucide-react';

const BlogCard = ({ post }) => {
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <article className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className='w-full h-48 object-cover'
        />
      )}
      <div className='p-6'>
        <div className='flex items-center text-sm text-gray-500 mb-2'>
          <User className='w-4 h-4 mr-1' />
          <span className='mr-4'>{post.authorName}</span>
          <Clock className='w-4 h-4 mr-1' />
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <h2 className='text-xl font-bold text-gray-900 mb-3 hover:text-red-600 transition-colors'>
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h2>

        <p className='text-gray-600 mb-4'>{truncateContent(post.content)}</p>

        <div className='flex justify-between items-center'>
          <Link
            to={`/blog/${post.id}`}
            className='text-red-600 hover:text-red-700 font-medium'
          >
            Đọc thêm →
          </Link>
          {post.viewCount && (
            <div className='flex items-center text-gray-400 text-sm'>
              <Eye className='w-4 h-4 mr-1' />
              <span>{post.viewCount} lượt xem</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
