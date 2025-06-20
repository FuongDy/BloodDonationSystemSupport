// src/pages/admin/AdminBlogManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import blogPostService from '../../services/blogPostService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';

const BlogPostCard = ({ post, onStatusChange, onDelete }) => {
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApprove = async () => {
    try {
      await blogPostService.approvePost(post.id);
      toast.success('Đã duyệt bài viết thành công!');
      onStatusChange();
    } catch (error) {
      toast.error('Không thể duyệt bài viết.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        await blogPostService.deletePost(post.id);
        toast.success('Đã xóa bài viết thành công!');
        onDelete();
      } catch (error) {
        toast.error('Không thể xóa bài viết.');
      }
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className='w-full h-48 object-cover'
        />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-between mb-3'>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}
          >
            {post.status === 'PUBLISHED' && (
              <CheckCircle className='w-3 h-3 mr-1' />
            )}
            {post.status === 'PENDING' && <Clock className='w-3 h-3 mr-1' />}
            {post.status === 'PUBLISHED'
              ? 'Đã xuất bản'
              : post.status === 'PENDING'
                ? 'Chờ duyệt'
                : post.status === 'DRAFT'
                  ? 'Bản nháp'
                  : post.status === 'REJECTED'
                    ? 'Bị từ chối'
                    : post.status}
          </span>
          <span className='text-xs text-gray-500'>ID: {post.id}</span>
        </div>

        <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
          {post.title}
        </h3>

        <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
          {post.content
            ? post.content.substring(0, 150) + '...'
            : 'Không có nội dung'}
        </p>

        <div className='space-y-2 mb-4'>
          <div className='flex items-center text-sm text-gray-600'>
            <User className='w-4 h-4 mr-2' />
            <span>{post.authorName || 'Chưa xác định'}</span>
          </div>
          <div className='flex items-center text-sm text-gray-600'>
            <Calendar className='w-4 h-4 mr-2' />
            <span>Tạo: {formatDate(post.createdAt)}</span>
          </div>
          {post.publishedAt && (
            <div className='flex items-center text-sm text-gray-600'>
              <Calendar className='w-4 h-4 mr-2' />
              <span>Xuất bản: {formatDate(post.publishedAt)}</span>
            </div>
          )}
          {post.viewCount && (
            <div className='flex items-center text-sm text-gray-600'>
              <Eye className='w-4 h-4 mr-2' />
              <span>{post.viewCount} lượt xem</span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Link
            to={`/blog/${post.id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button variant='outline' size='sm'>
              <Eye className='w-4 h-4 mr-1' />
              Xem
            </Button>
          </Link>

          <Link to={`/blog/${post.id}/edit`}>
            <Button variant='outline' size='sm'>
              <Edit className='w-4 h-4 mr-1' />
              Sửa
            </Button>
          </Link>

          {post.status === 'PENDING' && (
            <Button onClick={handleApprove} variant='primary' size='sm'>
              <CheckCircle className='w-4 h-4 mr-1' />
              Duyệt
            </Button>
          )}

          <Button onClick={handleDelete} variant='danger-outline' size='sm'>
            <Trash2 className='w-4 h-4 mr-1' />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminBlogManagementPage = () => {
  const [publishedPosts, setPublishedPosts] = useState({
    content: [],
    totalElements: 0,
  });
  const [pendingPosts, setPendingPosts] = useState({
    content: [],
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [publishedData, pendingData] = await Promise.all([
        blogPostService.getAllPublishedPosts(0, 20),
        blogPostService.getPendingPosts(0, 20),
      ]);
      setPublishedPosts(publishedData);
      setPendingPosts(pendingData);
    } catch (error) {
      toast.error('Không thể tải danh sách bài viết.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const tabs = [
    {
      key: 'published',
      label: `Đã xuất bản (${publishedPosts.totalElements})`,
      icon: CheckCircle,
    },
    {
      key: 'pending',
      label: `Chờ duyệt (${pendingPosts.totalElements})`,
      icon: Clock,
    },
  ];

  const currentPosts =
    activeTab === 'published' ? publishedPosts.content : pendingPosts.content;

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
            <div className='mb-4 md:mb-0'>
              <h1 className='text-3xl font-bold text-gray-900'>Quản lý Blog</h1>
              <p className='text-gray-600 mt-2'>
                Quản lý và duyệt các bài viết blog
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant='outline'
              >
                <Eye
                  className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                />
                Làm mới
              </Button>
              <Link to='/blog/create'>
                <Button variant='primary'>
                  <Plus className='w-4 h-4 mr-2' />
                  Tạo bài viết mới
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-lg shadow-sm mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8 px-6' aria-label='Tabs'>
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === key
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className='w-4 h-4 mr-2' />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <LoadingSpinner size='12' />
          </div>
        ) : currentPosts.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {currentPosts.map(post => (
              <BlogPostCard
                key={post.id}
                post={post}
                onStatusChange={handleRefresh}
                onDelete={handleRefresh}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12 bg-white rounded-lg shadow-sm'>
            <div className='max-w-md mx-auto'>
              {activeTab === 'published' ? (
                <>
                  <CheckCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Chưa có bài viết nào được xuất bản
                  </h3>
                  <p className='text-gray-500 mb-6'>
                    Tạo bài viết mới hoặc duyệt các bài viết đang chờ duyệt.
                  </p>
                </>
              ) : (
                <>
                  <Clock className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Không có bài viết nào chờ duyệt
                  </h3>
                  <p className='text-gray-500 mb-6'>
                    Tất cả bài viết đã được xử lý.
                  </p>
                </>
              )}
              <Link to='/blog/create'>
                <Button variant='primary'>
                  <Plus className='w-4 h-4 mr-2' />
                  Tạo bài viết mới
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogManagementPage;
