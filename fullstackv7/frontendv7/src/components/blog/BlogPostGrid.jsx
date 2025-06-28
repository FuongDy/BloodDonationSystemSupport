// src/components/blog/BlogPostGrid.jsx
import React from 'react';
import BlogPostCard from './BlogPostCard';

const BlogPostGrid = ({ 
  posts = [], 
  onStatusChange, 
  onDelete,
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {posts.map(post => (
        <BlogPostCard
          key={post.id}
          post={post}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BlogPostGrid;
