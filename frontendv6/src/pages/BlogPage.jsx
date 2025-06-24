// src/pages/BlogPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Eye, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import blogPostService from '../services/blogPostService';
import { useAuth } from '../hooks/useAuth';
import { BLOG_PERMISSIONS } from '../utils/constants';
import { _formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';

const BlogCard = ({ post }) => {
  const _formatDate = dateString => {
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
          <span>{_formatDate(post.createdAt)}</span>
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

const BlogPage = () => {
  const [posts, setPosts] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const canCreateBlog =
    isAuthenticated && BLOG_PERMISSIONS.canCreateBlog(user?.role);

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
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Blog Hiến Máu</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          Chia sẻ kiến thức, kinh nghiệm và câu chuyện về hoạt động hiến máu
          tình nguyện
        </p>
      </div>

      {/* Action Bar */}
      {canCreateBlog && (
        <div className='flex justify-end mb-8'>
          <Link to='/blog/create'>
            <Button variant='primary'>
              <PlusCircle className='w-5 h-5 mr-2' />
              Viết bài mới
            </Button>
          </Link>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      ) : posts.content.length > 0 ? (
        <>
          {/* Blog Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {posts.content.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {posts.totalPages > 1 && (
            <div className='flex justify-center'>
              <Pagination
                currentPage={currentPage}
                totalPages={posts.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className='text-center py-20'>
          <h3 className='text-2xl font-semibold text-gray-700 mb-4'>
            Chưa có bài viết nào
          </h3>
          <p className='text-gray-500 mb-4'>
            {canCreateBlog
              ? 'Hãy là người đầu tiên chia sẻ câu chuyện của bạn!'
              : 'Các bài viết sẽ được chia sẻ bởi Admin và Staff.'}
          </p>
          {canCreateBlog && (
            <Link to='/blog/create'>
              <Button variant='primary'>
                <PlusCircle className='w-5 h-5 mr-2' />
                Viết bài đầu tiên
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
