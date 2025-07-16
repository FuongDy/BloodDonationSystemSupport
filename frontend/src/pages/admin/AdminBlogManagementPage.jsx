// src/pages/admin/AdminBlogManagementPage.jsx
import React, { useState } from 'react';
import {  Plus, FileText, Users, TrendingUp, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminFiltersPanel from '../../components/admin/common/AdminFiltersPanel';
import { 
  BlogPostGrid, 
  BlogManagementEmptyState,
  BlogDetailModal
} from '../../components/blog';
import { useBlogManagement } from '../../hooks/useBlogManagement';

const AdminBlogManagementPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    publishedPosts,
    pendingPosts,
    isLoading,
    handleRefresh,
    publishedCount,
    pendingCount,
  } = useBlogManagement();

  // Combine all posts
  const allPosts = [...(publishedPosts.content || []), ...(pendingPosts.content || [])];
  
  // Filter posts based on search and status
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = search === '' || 
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.content?.toLowerCase().includes(search.toLowerCase()) ||
      post.authorName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalPosts = allPosts.length;
  const draftPosts = allPosts.filter(post => post.status === 'DRAFT').length;

  // Status options for filter
  const statusOptions = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'PUBLISHED', label: 'Đã xuất bản' },
    { value: 'DRAFT', label: 'Bản nháp' },
  ];

  // Filters configuration for AdminFiltersPanel
  const filtersConfig = [
    {
      key: 'status',
      label: 'Trạng thái',
      value: statusFilter,
      onChange: setStatusFilter,
      options: statusOptions,
    },
  ];

  // Check if filters are active
  const hasActiveFilters = search || statusFilter !== 'ALL';

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
  };

  // Modal handlers
  const handleViewPost = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  const headerActions = [
    {
      label: 'Tạo bài viết mới',
      icon: Plus,
      variant: 'primary',
      onClick: () => navigate('/admin/blog/create'),
    },
  ];

  return (
    <AdminPageLayout
      title='Quản lý Blog'
      description='Quản lý và tạo các bài viết blog cho hệ thống hiến máu'
      headerActions={headerActions}
    >
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quản lý Blog"
        description="Tạo, chỉnh sửa và quản lý các bài viết blog"
        variant="blog"
        showActivityFeed={false}
        stats={[
          {
            icon: <FileText className="w-5 h-5 text-blue-300" />,
            value: totalPosts,
            label: "Tổng bài viết"
          },
          {
            icon: <Users className="w-5 h-5 text-green-300" />,
            value: publishedCount,
            label: "Đã xuất bản"
          },
          {
            icon: <Calendar className="w-5 h-5 text-yellow-300" />,
            value: draftPosts,
            label: "Bản nháp"
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-purple-300" />,
            value: pendingCount,
            label: "Chờ duyệt"
          }
        ]}
      />

      <div className="space-y-6">
        {/* Filters and Search */}
        <AdminFiltersPanel
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Tìm kiếm theo tiêu đề, nội dung, tác giả..."
          filters={filtersConfig}
          showViewMode={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={totalPosts}
          filteredCount={filteredPosts.length}
          itemLabel="bài viết"
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content */}
        <AdminContentWrapper
          isLoading={isLoading}
          hasData={filteredPosts.length > 0}
          loadingMessage="Đang tải danh sách bài viết..."
          emptyMessage={<BlogManagementEmptyState />}
        >
          <BlogPostGrid
            posts={filteredPosts}
            onStatusChange={handleRefresh}
            onDelete={handleRefresh}
            onViewPost={handleViewPost}
            showApproval={false} // Admin/staff không cần duyệt
            viewMode={viewMode}
          />
        </AdminContentWrapper>
      </div>

      {/* Blog Detail Modal */}
      <BlogDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        postId={selectedPostId}
      />
    </AdminPageLayout>
  );
};

export default AdminBlogManagementPage;
