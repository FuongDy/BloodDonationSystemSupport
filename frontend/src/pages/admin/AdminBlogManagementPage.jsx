// src/pages/admin/AdminBlogManagementPage.jsx
import React from 'react';
import { Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import { 
  BlogManagementTabs, 
  BlogPostGrid, 
  BlogManagementEmptyState 
} from '../../components/blog';
import { useBlogManagement } from '../../hooks/useBlogManagement';

const AdminBlogManagementPage = () => {
  const {
    isLoading,
    activeTab,
    setActiveTab,
    handleRefresh,
    getCurrentPosts,
    publishedCount,
    pendingCount,
  } = useBlogManagement();

  const currentPosts = getCurrentPosts();

  const headerActions = [
    {
      label: 'Làm mới',
      icon: Eye,
      variant: 'outline',
      onClick: handleRefresh,
      disabled: isLoading,
      className: isLoading ? 'animate-spin' : '',
    },
    {
      label: 'Tạo bài viết mới',
      icon: Plus,
      variant: 'primary',
      component: Link,
      to: '/blog/create',
    },
  ];

  return (
    <AdminPageLayout
      title='Quản lý Blog'
      description='Quản lý và duyệt các bài viết blog'
      actions={headerActions}
    >
      <BlogManagementTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        publishedCount={publishedCount}
        pendingCount={pendingCount}
      />

      <AdminContentWrapper
        isLoading={isLoading}
        isEmpty={currentPosts.length === 0}
        emptyStateComponent={<BlogManagementEmptyState activeTab={activeTab} />}
      >
        <BlogPostGrid
          posts={currentPosts}
          onStatusChange={handleRefresh}
          onDelete={handleRefresh}
        />
      </AdminContentWrapper>
    </AdminPageLayout>
  );
};

export default AdminBlogManagementPage;
