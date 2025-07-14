// src/pages/BlogPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import blogPostService from '../services/blogPostService';
import { useAuth } from '../hooks/useAuth';
import { BLOG_PERMISSIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BlogHeader,
  BlogActionBar,
  BlogGrid,
  BlogEmptyState,
} from '../components/blog';

const BlogPage = () => {
  const [posts, setPosts] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  const canCreateBlog = isAuthenticated && BLOG_PERMISSIONS.canCreateBlog(user?.role);

  const fetchPosts = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const data = await blogPostService.getAllPublishedPosts(page, 9);
      setPosts(data);
    } catch {
      toast.error('Không thể tải danh sách bài viết.');
      setPosts({ content: [], totalElements: 0, totalPages: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <BlogHeader />
      <BlogActionBar canCreate={canCreateBlog} />

      {isLoading ? (
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      ) : posts.content.length > 0 ? (
        <BlogGrid
          posts={posts.content}
          currentPage={currentPage}
          totalPages={posts.totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <BlogEmptyState canCreate={canCreateBlog} />
      )}
    </div>
  );
};

export default BlogPage;
