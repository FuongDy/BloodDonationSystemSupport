// src/pages/admin/AdminBlogManagementPage.jsx
import { Calendar, Eye, FileText, Plus, TrendingUp, Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminFiltersPanel from '../../components/admin/common/AdminFiltersPanel';
import {
  BlogDetailModal,
  BlogManagementEmptyState,
  BlogPostGrid
} from '../../components/blog';
import { useBlogManagement } from '../../hooks/useBlogManagement';

const AdminBlogManagementPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  // Pagination state (admin style: 10/page, 0-based index)
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const totalPages = Math.ceil(filteredPosts.length / pageSize) || 1;
  const paginatedPosts = useMemo(() => {
    const startIdx = currentPage * pageSize;
    return filteredPosts.slice(startIdx, startIdx + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  // Handler for page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1); // MUI Pagination is 1-based
  };

  // Thêm handler cho việc xem chi tiết bài viết
  const handleViewDetail = (postId) => {
    setSelectedPostId(postId);
    setIsDetailModalOpen(true);
  };

  // Thêm onViewDetail cho mỗi post
  const postsWithViewDetail = paginatedPosts.map(post => ({
    ...post,
    onViewDetail: handleViewDetail
  }));

  // Calculate stats
  const totalPosts = allPosts.length;
  const draftPosts = allPosts.filter(post => post.status === 'DRAFT').length;

  // Status options for filter
  const statusOptions = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'PUBLISHED', label: 'Đã xuất bản' },
    { value: 'DRAFT', label: 'Bản nháp' },
    { value: 'PENDING_APPROVAL', label: 'Chờ duyệt' },
    { value: 'REJECTED', label: 'Bị từ chối' },
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
            posts={postsWithViewDetail}
            onStatusChange={handleRefresh}
            onDelete={handleRefresh}
            showApproval={false} // Admin/staff không cần duyệt
            viewMode={viewMode}
          />
          {/* Pagination (admin style) */}
          {filteredPosts.length > pageSize && (
            <div className="flex justify-end mt-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Trước
                </button>
                <button
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </AdminContentWrapper>
      </div>
      
      {/* Modal xem chi tiết bài viết */}
      <BlogDetailModal
        postId={selectedPostId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onStatusChange={handleRefresh}
      />
    </AdminPageLayout>
  );
};

export default AdminBlogManagementPage;
