// src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import blogPostService from '../services/blogPostService';
import { useAuth } from '../hooks/useAuth';
import { BLOG_PERMISSIONS } from '../utils/constants';
import { _formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogPostService.getPostById(id);
        setPost(data);
      } catch (error) {
        toast.error('Không thể tải bài viết.');
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await blogPostService.deletePost(id);
      toast.success('Xóa bài viết thành công!');
      navigate('/blog');
    } catch (error) {
      toast.error('Không thể xóa bài viết.');
    } finally {
      setIsDeleting(false);
    }
  };

  const _formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEdit = user && BLOG_PERMISSIONS.canEditBlog(user.role, post?.authorId, user.id);
  const canDelete = user && BLOG_PERMISSIONS.canDeleteBlog(user.role, post?.authorId, user.id);

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
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/blog'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Quay lại danh sách bài viết
        </Link>
      </div>

      {/* Article */}
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
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center text-gray-500 text-sm'>
              <User className='w-4 h-4 mr-1' />
              <span className='mr-4'>{post.authorName}</span>
              <Clock className='w-4 h-4 mr-1' />
              <span>{_formatDate(post.createdAt)}</span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className='ml-2 text-xs'>(Đã chỉnh sửa)</span>
              )}
            </div>

            {/* Action Buttons */}
            {(canEdit || canDelete) && (
              <div className='flex items-center space-x-3'>
                {canEdit && (
                  <Link to={`/blog/${id}/edit`}>
                    <Button variant='outline' size='sm'>
                      <Edit className='w-4 h-4 mr-2' />
                      Chỉnh sửa
                    </Button>
                  </Link>
                )}
                {canDelete && (
                  <Button
                    variant='danger-outline'
                    size='sm'
                    onClick={handleDelete}
                    disabled={isDeleting}
                    isLoading={isDeleting}
                  >
                    <Trash2 className='w-4 h-4 mr-2' />
                    Xóa
                  </Button>
                )}
              </div>
            )}
          </div>

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
    </div>
  );
};

export default BlogDetailPage;


