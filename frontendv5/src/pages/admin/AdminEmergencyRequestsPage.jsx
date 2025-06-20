// src/pages/admin/AdminEmergencyRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodRequestService from '../../services/bloodRequestService';
import bloodTypeService from '../../services/bloodTypeService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Modal from '../../components/common/Modal';
import InputField from '../../components/common/InputField';

const AdminEmergencyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    hospital: '',
    bloodTypeId: '',
    quantityInUnits: '',
    urgency: 'CRITICAL',
  });

  useEffect(() => {
    fetchRequests();
    fetchBloodTypes();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      //API thật
      const response = await bloodRequestService.searchActiveRequests();
      console.log('Response:', response);
      setRequests(response.data || response || []);
      
      // Comment dữ liệu giả khi test API thật
      // const mockData = [
      //   {
      //     id: 1,
      //     patientName: 'Nguyễn Văn A',
      //     hospital: 'Bệnh viện Chợ Rẫy',
      //     bloodType: { bloodGroup: 'O+' },
      //     quantityInUnits: 3,
      //     urgency: 'CRITICAL',
      //     status: 'PENDING',
      //     createdAt: new Date().toISOString(),
      //   },
      //   {
      //     id: 2,
      //     patientName: 'Trần Thị B',
      //     hospital: 'Bệnh viện Bình Dân',
      //     bloodType: { bloodGroup: 'A+' },
      //     quantityInUnits: 2,
      //     urgency: 'URGENCY',
      //     status: 'APPROVED',
      //     createdAt: new Date().toISOString(),
      //   }
      // ];  
      // setRequests(mockData);
      
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Lỗi khi tải danh sách yêu cầu khẩn cấp');
      setRequests([]); // Set empty array để tránh crash
    } finally {
      setLoading(false);
    }
  };

  const fetchBloodTypes = async () => {
    try {
      const res = await bloodTypeService.getAll();
      setBloodTypes(res);
    } catch (error) {
      toast.error('Không thể tải danh sách nhóm máu');
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateRequest = async e => {
    e.preventDefault();
    try {
      // Chuyển đổi dữ liệu để phù hợp với API backend
      const requestData = {
        patientName: formData.patientName,
        hospital: formData.hospital,
        bloodTypeId: parseInt(formData.bloodTypeId),
        quantityInUnits: parseInt(formData.quantityInUnits),
        urgency: formData.urgency,
      };
      
      await bloodRequestService.createBloodRequest(requestData);
      toast.success('Tạo yêu cầu khẩn cấp thành công');
      setIsModalOpen(false);
      fetchRequests();
      setFormData({
        patientName: '',
        hospital: '',
        bloodTypeId: '',
        quantityInUnits: '',
        urgency: 'CRITICAL',
      });
    } catch (error) {
      toast.error('Lỗi khi tạo yêu cầu khẩn cấp');
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await bloodRequestService.updateRequestStatus(requestId, status);
      toast.success('Cập nhật trạng thái thành công');
      fetchRequests();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const getUrgencyBadge = urgency => {
    const urgencyConfig = {
      CRITICAL: { variant: 'error', label: 'Cực kỳ khẩn cấp' },
      URGENCY: { variant: 'warning', label: 'Khẩn cấp' },
      NORMAL: { variant: 'info', label: 'Bình thường' },
    };
    const config = urgencyConfig[urgency] || {
      variant: 'default',
      label: urgency,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = status => {
    const statusConfig = {
      PENDING: { variant: 'warning', label: 'Chờ xử lý' },
      APPROVED: { variant: 'info', label: 'Đã duyệt' },
      FULFILLED: { variant: 'success', label: 'Đã hoàn thành' },
      REJECTED: { variant: 'error', label: 'Từ chối' },
      CANCELLED: { variant: 'error', label: 'Đã hủy' },
    };
    const config = statusConfig[status] || {
      variant: 'default',
      label: status,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner size='12' />
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title='Quản lý Yêu cầu Khẩn cấp'
        subtitle='Theo dõi và xử lý các yêu cầu máu khẩn cấp'
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Tạo yêu cầu khẩn cấp
          </Button>
        }
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {requests.length === 0 ? (
          <div className='col-span-full flex flex-col items-center justify-center py-12 text-center'>
            <AlertTriangle className='w-16 h-16 text-gray-400 mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Hiện tại chưa có yêu cầu khẩn cấp nào
            </h3>
            <p className='text-gray-500 mb-6'>
              Chưa có yêu cầu máu khẩn cấp nào được tạo. Bạn có thể tạo yêu cầu mới bằng cách nhấn nút bên trên.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className='w-4 h-4 mr-2' />
              Tạo yêu cầu đầu tiên
            </Button>
          </div>
        ) : (
          requests.map(request => (
            <Card key={request.id} hover>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>
                    Cần máu {request.bloodType?.bloodGroup}
                  </CardTitle>
                  {getUrgencyBadge(request.urgency)}
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Bệnh nhân:</span>
                  <span className='font-semibold'>{request.patientName}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Bệnh viện:</span>
                  <span className='font-semibold'>{request.hospital}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Số lượng:</span>
                  <span className='font-semibold'>
                    {request.quantityInUnits} đơn vị
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Trạng thái:</span>
                  {getStatusBadge(request.status)}
                </div>

                <div className='flex items-center space-x-2'>
                  <Clock className='w-4 h-4 text-gray-500' />
                  <span className='text-sm'>
                    {new Date(request.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                {request.status === 'PENDING' && (
                  <div className='flex space-x-2 pt-2'>
                    <Button
                      size='sm'
                      className='flex-1'
                      onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                    >
                      Duyệt
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1'
                      onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                    >
                      Từ chối
                    </Button>
                  </div>
                )}

                {request.status === 'APPROVED' && (
                  <Button
                    size='sm'
                    className='w-full'
                    onClick={() => handleStatusUpdate(request.id, 'FULFILLED')}
                  >
                    Đánh dấu hoàn thành
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Tạo yêu cầu khẩn cấp'
        size='lg'
      >
        <form onSubmit={handleCreateRequest} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <InputField
              label='Tên bệnh nhân'
              name='patientName'
              value={formData.patientName}
              onChange={handleInputChange}
              required
            />
            
            <InputField
              label='Bệnh viện'
              name='hospital'
              value={formData.hospital}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='bloodTypeId'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Nhóm máu
              </label>
              <select
                id='bloodTypeId'
                name='bloodTypeId'
                value={formData.bloodTypeId}
                onChange={handleInputChange}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
                required
              >
                <option value=''>-- Chọn nhóm máu --</option>
                {bloodTypes
                  .filter(
                    (bt, index, self) =>
                      index ===
                      self.findIndex(t => t.bloodGroup === bt.bloodGroup)
                  )
                  .map(bt => (
                    <option key={bt.id} value={bt.id}>
                      {bt.bloodGroup}
                    </option>
                  ))}
              </select>
            </div>

            <InputField
              label='Số lượng (đơn vị)'
              name='quantityInUnits'
              type='number'
              value={formData.quantityInUnits}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Mức độ khẩn cấp
            </label>
            <select
              name='urgency'
              value={formData.urgency}
              onChange={handleInputChange}
              className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500'
            >
              <option value='CRITICAL'>Cực kỳ khẩn cấp</option>
              <option value='URGENCY'>Khẩn cấp</option>
              <option value='NORMAL'>Bình thường</option>
            </select>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type='submit'>Tạo yêu cầu</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default AdminEmergencyRequestsPage;
