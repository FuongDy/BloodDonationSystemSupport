import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlusCircle, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import bloodTypeService from '../../services/bloodTypeService.js';
import Button from '../../components/common/Button.jsx';
import BloodTypeFormModal from '../../components/admin/BloodTypeFormModal.jsx';
import BloodTypeCard from '../../components/admin/BloodTypeCard.jsx';
import TabNavigation from '../../components/common/TabNavigation.jsx';
import AdminPageLayout from '../../components/admin/AdminPageLayout.jsx';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper.jsx';
import AdminEmptyState from '../../components/admin/AdminEmptyState.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import { useAuth } from '../../hooks/useAuth';

const AdminBloodTypePage = () => {
  // --- STATE MANAGEMENT ---
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBloodType, setEditingBloodType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // THÊM MỚI: State để quản lý tab nào đang hoạt động
  const [activeTab, setActiveTab] = useState(null);

  // --- DATA FETCHING & PROCESSING ---
  const fetchBloodTypes = useCallback(async search => {
    setIsLoading(true);
    try {
      const data = await bloodTypeService.getAll(search);
      setBloodTypes(data || []);    } catch (error) {
      toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBloodTypes(searchTerm);
  }, [searchTerm, fetchBloodTypes]);

  const groupedBloodTypes = useMemo(() => {
    if (!bloodTypes) return {};
    return bloodTypes.reduce((acc, current) => {
      const group = current.bloodGroup;
      if (!acc[group]) acc[group] = [];
      acc[group].push(current);
      return acc;
    }, {});
  }, [bloodTypes]);

  // Effect để tự động chọn tab đầu tiên khi dữ liệu thay đổi
  useEffect(() => {
    const groups = Object.keys(groupedBloodTypes).sort();
    if (groups.length > 0) {
      // Nếu tab hiện tại không còn tồn tại trong danh sách mới (do tìm kiếm)
      // hoặc chưa có tab nào được chọn, thì chọn tab đầu tiên
      if (!groups.includes(activeTab)) {
        setActiveTab(groups[0]);
      }
    } else {
      setActiveTab(null); // Không có dữ liệu thì không có tab nào
    }
  }, [groupedBloodTypes, activeTab]);
  // --- HANDLERS ---
  const handleOpenModal = (bloodType = null) => {
    setEditingBloodType(bloodType);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBloodType(null);
  };
  const handleSaveSuccess = () => {
    fetchBloodTypes(searchTerm);
    handleCloseModal();
  };  const handleDelete = async (id, description) => {
    const displayName = description || `ID: ${id}`;
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa loại máu "${displayName}" không?`
    );
    
    if (confirmed) {
      const toastId = toast.loading('Đang xóa...');
      try {
        await bloodTypeService.delete(id);
        toast.success('Xóa thành công!', { id: toastId });
        fetchBloodTypes(searchTerm);      } catch (error) {
        toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
      }
    }
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  // Create tabs from grouped data
  const tabs = Object.keys(groupedBloodTypes)
    .sort()
    .map(groupName => ({
      key: groupName,
      label: groupName,
      icon: null
    }));

  const headerActions = [
    ...(isAdmin ? [{
      label: 'Thêm mới',
      icon: PlusCircle,
      variant: 'primary',
      onClick: () => handleOpenModal(),
      disabled: isLoading
    }] : [])
  ];
  // --- RENDER ---
  return (
    <AdminPageLayout
      title="Quản lý Loại máu"
      actions={headerActions}
    >
      {tabs.length > 0 ? (
        <div className='bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200'>
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
          />

          {/* NỘI DUNG TABS */}
          <div className='p-2 md:p-4'>
            {activeTab && groupedBloodTypes[activeTab] ? (
              <div className='divide-y divide-slate-100'>
                {groupedBloodTypes[activeTab].map(item => (
                  <BloodTypeCard
                    key={item.id}
                    bloodType={item}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    canEdit={isAdmin}
                  />
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="Không có dữ liệu"
                description="Không có loại máu nào phù hợp với tìm kiếm của bạn."
              />
            )}
          </div>
        </div>
      ) : (
        <AdminContentWrapper
          isLoading={isLoading}
          isEmpty={true}
          emptyStateComponent={
            <AdminEmptyState
              title="Không có dữ liệu"
              description="Không có loại máu nào phù hợp với tìm kiếm của bạn."
            />
          }
        />
      )}

      <BloodTypeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveSuccess={handleSaveSuccess}
        bloodType={editingBloodType}
      />
    </AdminPageLayout>
  );
};

export default AdminBloodTypePage;


