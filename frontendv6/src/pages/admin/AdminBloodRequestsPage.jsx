// src/pages/admin/AdminBloodRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodRequestService from '../../services/bloodRequestService';
import bloodTypeService from '../../services/bloodTypeService';
import {
  REQUEST_STATUS,
  URGENCY_LEVELS,
  STATUS_COLORS,
} from '../../utils/constants';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import BloodRequestForm from '../../components/admin/BloodRequestForm';

const AdminBloodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchRequests();
    fetchBloodTypes();
  }, [currentPage]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await bloodRequestService.getAllRequests({
        page: currentPage,
        size: pageSize,
      });

      const data = response.data;
      if (data.content) {
        setRequests(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      toast.error('Lỗi khi tải danh sách yêu cầu máu');
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBloodTypes = async () => {
    try {
      const response = await bloodTypeService.getAll();
      setBloodTypes(response || []);
    } catch (error) {
      console.error('Error fetching blood types:', error);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleView = request => {
    setModalMode('view');
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleEdit = request => {
    setModalMode('edit');
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await bloodRequestService.updateStatus(requestId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };
  const handleSubmitForm = async formData => {
    try {
      setIsSubmitting(true);
      if (modalMode === 'create') {
        await bloodRequestService.createRequest(formData);
        toast.success('Tạo yêu cầu máu thành công');
      }
      setIsModalOpen(false);
      fetchRequests();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        modalMode === 'create'
          ? 'Lỗi khi tạo yêu cầu'
          : 'Lỗi khi cập nhật yêu cầu'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    handleSubmitForm({
      ...formData,
      quantityInUnits: parseInt(formData.quantityInUnits),
      bloodTypeId: parseInt(formData.bloodTypeId),
    });
  };

  // Initial form data for modal
  const [formData, setFormData] = useState({
    patientName: '',
    hospital: '',
    bloodTypeId: '',
    quantityInUnits: '',
    urgency: 'URGENT',
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === 'create') {
        setFormData({
          patientName: '',
          hospital: '',
          bloodTypeId: '',
          quantityInUnits: '',
          urgency: 'URGENT',
        });
      } else if (selectedRequest) {
        setFormData({
          patientName: selectedRequest.patientName || '',
          hospital: selectedRequest.hospital || '',
          bloodTypeId: selectedRequest.bloodType?.id || '',
          quantityInUnits: selectedRequest.quantityInUnits || '',
          urgency: selectedRequest.urgency || 'URGENT',
        });
      }
    }
  }, [isModalOpen, modalMode, selectedRequest]);

  // Filter and search logic
  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hospital?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || request.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === 'ALL' || request.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const columns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
    },
    {
      key: 'patientName',
      title: 'Tên bệnh nhân',
      sortable: true,
    },
    {
      key: 'hospital',
      title: 'Bệnh viện',
      sortable: true,
    },
    {
      key: 'bloodType',
      title: 'Nhóm máu',
      render: row => row.bloodType?.name || 'N/A',
    },
    {
      key: 'quantityInUnits',
      title: 'Số lượng (đơn vị)',
      sortable: true,
    },
    {
      key: 'urgency',
      title: 'Mức độ khẩn cấp',
      render: row => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.urgency === 'CRITICAL'
              ? 'bg-red-100 text-red-800'
              : row.urgency === 'URGENT'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {URGENCY_LEVELS[row.urgency] || row.urgency}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: row => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[row.status] || 'bg-gray-100 text-gray-800'}`}
        >
          {REQUEST_STATUS[row.status] || row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: row =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString('vi-VN')
          : 'N/A',
      sortable: true,
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: row => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleView(row)}
            className='p-1'
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEdit(row)}
            className='p-1'
          >
            <Edit className='h-4 w-4' />
          </Button>
          {row.status === 'PENDING' && (
            <select
              className='text-xs border rounded px-1 py-1'
              value={row.status}
              onChange={e => handleStatusUpdate(row.id, e.target.value)}
            >
              <option value='PENDING'>Chờ xử lý</option>
              <option value='APPROVED'>Chấp thuận</option>
              <option value='REJECTED'>Từ chối</option>
              <option value='FULFILLED'>Hoàn thành</option>
            </select>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminPageLayout>
      {' '}
      <AdminContentWrapper
        title='Quản lý yêu cầu máu'
        subtitle='Tạo và quản lý yêu cầu máu khẩn cấp. Các yêu cầu PENDING sẽ hiển thị công khai cho người dùng đăng ký hiến máu.'
      >
        {/* Header Actions */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div className='flex flex-col sm:flex-row gap-4 flex-1'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <input
                type='text'
                placeholder='Tìm kiếm bệnh nhân, bệnh viện...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'
              />
            </div>

            {/* Filters */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'
            >
              <option value='ALL'>Tất cả trạng thái</option>
              <option value='PENDING'>Chờ xử lý</option>
              <option value='APPROVED'>Chấp thuận</option>
              <option value='REJECTED'>Từ chối</option>
              <option value='FULFILLED'>Hoàn thành</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={e => setUrgencyFilter(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'
            >
              <option value='ALL'>Tất cả mức độ</option>
              <option value='CRITICAL'>Rất khẩn cấp</option>
              <option value='URGENT'>Khẩn cấp</option>
              <option value='NORMAL'>Bình thường</option>
            </select>
          </div>

          <Button
            onClick={handleCreate}
            className='bg-red-600 hover:bg-red-700'
          >
            <Plus className='h-4 w-4 mr-2' />
            Tạo yêu cầu mới
          </Button>
        </div>
        {/* Data Table */}
        <DataTable
          data={filteredRequests}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setCurrentPage}
          emptyMessage='Không có yêu cầu máu nào'
        />{' '}
        {/* Modal for Create/Edit/View */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            modalMode === 'create'
              ? 'Tạo yêu cầu máu mới'
              : modalMode === 'edit'
                ? 'Chỉnh sửa yêu cầu máu'
                : 'Chi tiết yêu cầu máu'
          }
          size='lg'
        >
          {modalMode === 'view' ? (
            // View mode - display data only
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Tên bệnh nhân
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedRequest?.patientName}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Bệnh viện
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedRequest?.hospital}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Nhóm máu
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedRequest?.bloodType?.name}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Số lượng
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedRequest?.quantityInUnits} đơn vị
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Mức độ khẩn cấp
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {URGENCY_LEVELS[selectedRequest?.urgency]}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Trạng thái
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {REQUEST_STATUS[selectedRequest?.status]}
                  </p>
                </div>
                <div className='col-span-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Ngày tạo
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {selectedRequest?.createdAt
                      ? new Date(selectedRequest.createdAt).toLocaleString(
                          'vi-VN'
                        )
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex justify-end pt-4 border-t'>
                <Button variant='outline' onClick={() => setIsModalOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          ) : (
            // Create/Edit mode - show form
            <BloodRequestForm
              formData={formData}
              bloodTypes={bloodTypes}
              onInputChange={handleInputChange}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsModalOpen(false)}
              isLoading={isSubmitting}
            />
          )}
        </Modal>
      </AdminContentWrapper>
    </AdminPageLayout>
  );
};

export default AdminBloodRequestsPage;
