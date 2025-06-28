// src/components/blog/BlogManagementEmptyState.jsx
import React from 'react';
import { CheckCircle, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminEmptyState from '../admin/AdminEmptyState';

const BlogManagementEmptyState = ({ activeTab }) => {
  if (activeTab === 'published') {
    return (
      <AdminEmptyState
        icon={CheckCircle}
        title='Chưa có bài viết nào được xuất bản'
        description='Tạo bài viết mới hoặc duyệt các bài viết đang chờ duyệt.'
        action={{
          label: 'Tạo bài viết mới',
          icon: Plus,
          component: Link,
          to: '/blog/create',
        }}
      />
    );
  }

  return (
    <AdminEmptyState
      icon={Clock}
      title='Không có bài viết nào chờ duyệt'
      description='Tất cả bài viết đã được xử lý.'
      action={{
        label: 'Tạo bài viết mới',
        icon: Plus,
        component: Link,
        to: '/blog/create',
      }}
    />
  );
};

export default BlogManagementEmptyState;
