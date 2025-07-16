// src/components/blog/BlogPostCard.jsx
import React from 'react';
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import StatusBadge from '../common/StatusBadge';
import DateTimeDisplay from '../common/DateTimeDisplay';
import InfoRow from '../common/InfoRow';
import ActionButtonGroup from '../common/ActionButtonGroup';
import blogPostService from '../../services/blogPostService';
import { useAuth } from '../../hooks/useAuth';

const BlogPostCard = ({ post, onStatusChange, onDelete, onViewPost, showApproval = false }) => {
  const { user } = useAuth();
  
  // Safe access to post properties
  if (!post || !post.id) {
    return null;
  }

  // Check permissions
  const isAuthor = user && post.authorId === user.id;
  const isAdmin = user && user.role === 'Admin';
  const canEdit = isAuthor; // Chỉ tác giả mới có thể sửa
  const canDelete = isAuthor || isAdmin; // Tác giả hoặc Admin có thể xóa
  const handleApprove = async () => {
    try {
      await blogPostService.approvePost(post.id);
      toast.success('Đã duyệt bài viết thành công!');
      onStatusChange();
    } catch (error) {
      toast.error(`Không thể duyệt bài viết: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error('Bạn không có quyền xóa bài viết này');
      return;
    }

    // eslint-disable-next-line no-alert
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        await blogPostService.deletePost(post.id);
        toast.success('Đã xóa bài viết thành công!');
        onDelete();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể xóa bài viết';
        toast.error(errorMessage);
      }
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'PUBLISHED':
        return 'Đã xuất bản';
      case 'PENDING_APPROVAL':
        return 'Chờ duyệt';
      case 'DRAFT':
        return 'Bản nháp';
      case 'REJECTED':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      variant: 'outline',
      ...(onViewPost ? {
        onClick: () => onViewPost(post.id)
      } : {
        component: Link,
        to: `/blog/${post.id}`,
        target: '_blank',
        rel: 'noopener noreferrer'
      })
    },
  ];

  // Chỉ thêm nút sửa nếu user có quyền
  if (canEdit) {
    actions.push({
      label: 'Sửa',
      icon: Edit,
      variant: 'outline',
      component: Link,
      to: `/blog/${post.id}/edit`,
    });
  }

  // Chỉ hiển thị nút duyệt nếu được yêu cầu và bài viết đang chờ duyệt
  if (showApproval && post.status === 'PENDING_APPROVAL') {
    actions.push({
      label: 'Duyệt',
      icon: CheckCircle,
      variant: 'primary',
      onClick: handleApprove,
    });
  }

  // Chỉ thêm nút xóa nếu user có quyền
  if (canDelete) {
    actions.push({
      label: 'Xóa',
      icon: Trash2,
      variant: 'danger-outline',
      onClick: handleDelete,
    });
  }

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
          <StatusBadge
            status={post.status}
            text={getStatusText(post.status)}
            icon={post.status === 'PUBLISHED' ? CheckCircle : Clock}
          />
          <span className='text-xs text-gray-500'>ID: {post.id}</span>
        </div>{' '}
        <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
          {post.title || 'Tiêu đề không xác định'}
        </h3>
        <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
          {post.content
            ? `${post.content.substring(0, 150)}...`
            : 'Không có nội dung'}
        </p>
        <div className='space-y-2 mb-4'>
          <InfoRow
            icon={User}
            label='Tác giả'
            value={post.authorName || 'Chưa xác định'}
          />
          <InfoRow
            icon={Calendar}
            label='Tạo'
            value={<DateTimeDisplay date={post.createdAt} />}
          />
          {post.publishedAt && (
            <InfoRow
              icon={Calendar}
              label='Xuất bản'
              value={<DateTimeDisplay date={post.publishedAt} />}
            />
          )}
          {post.viewCount && (
            <InfoRow icon={Eye} label='Lượt xem' value={post.viewCount} />
          )}
        </div>
        <ActionButtonGroup actions={actions} />
      </div>
    </div>
  );
};

export default BlogPostCard;
