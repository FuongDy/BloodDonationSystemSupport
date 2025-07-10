// src/pages/admin/AdminBloodCompatibilityPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, RefreshCw, GitCompareArrows, CheckCircle, XCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodCompatibilityService from '../../services/bloodCompatibilityService';
import BloodCompatibilityFormModal from '../../components/admin/BloodCompatibilityFormModal';
import BloodCompatibilityTable from '../../components/admin/BloodCompatibilityTable';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import { useAuth } from '../../hooks/useAuth';
import DashboardHeader from '../../components/admin/DashboardHeader';

const AdminBloodCompatibilityPage = () => {
  const [rulesPage, setRulesPage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const { user } = useAuth();

  const fetchRules = useCallback(
    async (page = currentPage, size = pageSize) => {
      setIsLoading(true);
      try {
        const data = await bloodCompatibilityService.getAll(page, size);
        setRulesPage(data);
      } catch (error) {
        toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize]
  );

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    fetchRules(currentPage, pageSize);
  };

  const handleOpenModal = (rule = null) => {
    if (user?.role !== 'Admin' && rule) {
      toast.error('Bạn không có quyền chỉnh sửa quy tắc tương thích.');
      return;
    }
    if (user?.role !== 'Admin' && !rule) {
      toast.error('Bạn không có quyền thêm quy tắc tương thích.');
      return;
    }
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleSaveSuccess = () => {
    fetchRules(currentPage, pageSize);
    handleCloseModal();
  };

  const handleDeleteRule = async id => {
    if (user?.role !== 'Admin') {
      toast.error('Bạn không có quyền xóa quy tắc tương thích.');
      return;
    }

    // eslint-disable-next-line no-alert
    if (!window.confirm('Bạn có chắc chắn muốn xóa quy tắc này không?')) {
      return;
    }

    try {
      await bloodCompatibilityService.delete(id);
      toast.success('Xóa quy tắc thành công!');
      fetchRules(currentPage, pageSize);
    } catch (error) {
      toast.error(`Lỗi khi xóa quy tắc: ${error.message}`);
    }
  };

  // Hàm helper để định dạng tên hiển thị
  const formatBloodTypeDisplay = bloodType => {
    if (!bloodType) return 'N/A';
    return `${bloodType.bloodGroup} (${bloodType.componentType})`;
  };

  const headerActions = [
    {
      label: 'Làm mới',
      icon: RefreshCw,
      variant: 'secondary',
      onClick: handleRefresh,
      disabled: isLoading,
      className: isLoading ? 'animate-spin' : '',
    },
    ...(user?.role === 'Admin'
      ? [
          {
            label: 'Thêm quy tắc',
            icon: PlusCircle,
            variant: 'primary',
            onClick: () => handleOpenModal(),
            disabled: isLoading,
          },
        ]
      : []),
  ];

  // Calculate stats
  const totalRules = rulesPage?.totalElements || 0;
  const compatibleRules = rulesPage?.content?.filter(rule => rule.isCompatible)?.length || 0;
  const incompatibleRules = rulesPage?.content?.filter(rule => !rule.isCompatible)?.length || 0;
  const activeRules = rulesPage?.content?.filter(rule => rule.isActive)?.length || 0;

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quản lý Tương thích máu"
        description="Quản lý các quy tắc tương thích giữa các nhóm máu, đảm bảo an toàn trong quá trình truyền máu."
        variant="compatibility"
        showActivityFeed={false}
        stats={[
          {
            icon: <GitCompareArrows className="w-5 h-5 text-green-300" />,
            value: totalRules,
            label: "Tổng quy tắc"
          },
          {
            icon: <CheckCircle className="w-5 h-5 text-green-300" />,
            value: compatibleRules,
            label: "Tương thích"
          },
          {
            icon: <XCircle className="w-5 h-5 text-red-300" />,
            value: incompatibleRules,
            label: "Không tương thích"
          },
          {
            icon: <Activity className="w-5 h-5 text-blue-300" />,
            value: activeRules,
            label: "Đang hoạt động"
          }
        ]}
      />

      <div className="space-y-6">
        <AdminContentWrapper
          isLoading={isLoading}
          hasData={rulesPage?.content?.length > 0}
          loadingMessage='Đang tải quy tắc tương thích...'
          emptyMessage='Chưa có quy tắc tương thích nào.'
          showPagination={true}
          currentPage={currentPage}
          totalPages={rulesPage?.totalPages || 0}
          totalElements={rulesPage?.totalElements || 0}
          onPageChange={handlePageChange}
          paginationLoading={isLoading}
        >
          <BloodCompatibilityTable
            rules={rulesPage?.content || []}
            onEdit={handleOpenModal}
            onDelete={handleDeleteRule}
            formatBloodTypeDisplay={formatBloodTypeDisplay}
            user={user}
          />
        </AdminContentWrapper>
      </div>

      {isModalOpen && (
        <BloodCompatibilityFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
          rule={editingRule}
        />
      )}
    </AdminPageLayout>
  );
};

export default AdminBloodCompatibilityPage;
