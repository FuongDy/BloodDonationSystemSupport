// src/pages/admin/AdminBlogManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  CheckCircle,
  Clock,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import blogPostService from '../../services/blogPostService';
import BlogPostCard from '../../components/blog/BlogPostCard';
import TabNavigation from '../../components/common/TabNavigation';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import AdminEmptyState from '../../components/admin/AdminEmptyState';

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
      
      // Handle response structure safely
      setPublishedPosts({
        content: publishedData?.content || publishedData || [],
        totalElements: publishedData?.totalElements || 0
      });
      setPendingPosts({
        content: pendingData?.content || pendingData || [],
        totalElements: pendingData?.totalElements || 0
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Không thể tải danh sách bài viết.');
      // Set empty data on error
      setPublishedPosts({ content: [], totalElements: 0 });
      setPendingPosts({ content: [], totalElements: 0 });
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
      label: `Đã xuất bản (${publishedPosts.totalElements || 0})`,
      icon: CheckCircle,
    },
    {
      key: 'pending',
      label: `Chờ duyệt (${pendingPosts.totalElements || 0})`,
      icon: Clock,
    },
  ];
  const currentPosts =
    activeTab === 'published' ? (publishedPosts.content || []) : (pendingPosts.content || []);

  const headerActions = [
    {
      label: 'Làm mới',
      icon: Eye,
      variant: 'outline',
      onClick: handleRefresh,
      disabled: isLoading,
      className: isLoading ? 'animate-spin' : ''
    },
    {
      label: 'Tạo bài viết mới',
      icon: Plus,
      variant: 'primary',
      component: Link,
      to: '/blog/create'
    }
  ];
  const renderEmptyState = () => {
    if (activeTab === 'published') {
      return (
        <AdminEmptyState
          icon={CheckCircle}
          title="Chưa có bài viết nào được xuất bản"
          description="Tạo bài viết mới hoặc duyệt các bài viết đang chờ duyệt."
          action={{
            label: 'Tạo bài viết mới',
            icon: Plus,
            component: Link,
            to: '/blog/create'
          }}
        />
      );
    }
    
    return (
      <AdminEmptyState
        icon={Clock}
        title="Không có bài viết nào chờ duyệt"
        description="Tất cả bài viết đã được xử lý."
        action={{
          label: 'Tạo bài viết mới',
          icon: Plus,
          component: Link,
          to: '/blog/create'
        }}
      />
    );
  };
  return (
    <AdminPageLayout
      title="Quản lý Blog"
      description="Quản lý và duyệt các bài viết blog"
      actions={headerActions}
    >
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <AdminContentWrapper
        isLoading={isLoading}
        isEmpty={currentPosts.length === 0}
        emptyStateComponent={renderEmptyState()}
      >
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
      </AdminContentWrapper>
    </AdminPageLayout>
  );
};

export default AdminBlogManagementPage;


