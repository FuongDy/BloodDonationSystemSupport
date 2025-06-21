import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw, Heart, Clock, MapPin, Phone, Mail, User, AlertTriangle, Eye, Droplet } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import bloodRequestService from '../services/bloodRequestService';

const BloodRequestsTable = ({ requests, onPledgeSuccess }) => {
  const formatDate = dateString => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityBadge = priority => {
    switch (priority) {
      case 'EMERGENCY':
        return 'bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold';
      case 'URGENT':
        return 'bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold';
      case 'NORMAL':
        return 'bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold';
      default:
        return 'bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold';
    }
  };

  const getPriorityText = priority => {
    switch (priority) {
      case 'EMERGENCY':
        return 'Khẩn cấp';
      case 'URGENT':
        return 'Gấp';
      case 'NORMAL':
        return 'Bình thường';
      default:
        return priority || 'Chưa xác định';
    }
  };

  const getBloodTypeDisplay = bloodType => {
    if (!bloodType) return 'Chưa xác định';
    return `${bloodType.bloodGroup || ''}${bloodType.componentType || ''}`;
  };

  const handlePledge = async (requestId) => {
    try {
      await bloodRequestService.pledgeToRequest(requestId);
      toast.success('Đăng ký hiến máu thành công!');
      if (onPledgeSuccess) {
        onPledgeSuccess();
      }
    } catch (error) {
      console.error('Error pledging:', error);
      toast.error('Lỗi khi đăng ký hiến máu: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-200'>
          <Heart className='w-12 h-12 text-red-500' />
        </div>
        <h3 className='text-2xl font-bold text-gray-900 mb-3'>
          Hiện tại không có yêu cầu khẩn cấp nào
        </h3>
        <p className='text-gray-700 mb-8 leading-relaxed font-medium'>
          Hãy quay lại sau để kiểm tra các yêu cầu mới. Cảm ơn bạn đã quan tâm đến việc hiến máu!
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Desktop Table */}
      <div className='hidden lg:block bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b-2 border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                  Nhóm máu
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                  Thông tin bệnh nhân
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                  Số lượng
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                  Ưu tiên
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                  Địa điểm
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                  Thời hạn
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                  Liên hệ
                </th>
                <th className='px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y-2 divide-gray-100'>
              {requests.map((request, index) => (
                <tr key={request.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-full bg-red-100 flex items-center justify-center'>
                          <Droplet className='h-5 w-5 text-red-600 fill-current' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-lg font-bold text-red-600'>
                          {getBloodTypeDisplay(request.bloodType)}
                        </div>
                        <div className='text-xs text-gray-500'>
                          #{request.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm'>
                      <div className='font-bold text-gray-900'>
                        {request.patientName || 'Chưa xác định'}
                      </div>
                      <div className='text-gray-700 font-medium'>
                        {request.hospital || 'Chưa xác định'}
                      </div>
                      {request.description && (
                        <div className='text-gray-600 text-xs mt-1 line-clamp-2'>
                          {request.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-lg font-bold text-gray-900'>
                      {request.quantityNeeded || request.quantityInUnits || '1'}
                    </div>
                    <div className='text-xs text-gray-500'>đơn vị</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={getPriorityBadge(request.priority)}>
                      {getPriorityText(request.priority)}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      {request.location || 'Chưa xác định'}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {formatDate(request.neededBy)}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm space-y-1'>
                      {request.contactPhone && (
                        <div className='flex items-center text-blue-600'>
                          <Phone className='h-3 w-3 mr-1' />
                          <a href={`tel:${request.contactPhone}`} className='hover:underline font-medium'>
                            {request.contactPhone}
                          </a>
                        </div>
                      )}
                      {request.contactEmail && (
                        <div className='flex items-center text-blue-600'>
                          <Mail className='h-3 w-3 mr-1' />
                          <a href={`mailto:${request.contactEmail}`} className='hover:underline font-medium'>
                            {request.contactEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <Button
                      onClick={() => handlePledge(request.id)}
                      variant='primary'
                      size='sm'
                      className='bg-red-600 hover:bg-red-700 text-white font-bold'
                    >
                      <Heart className='h-4 w-4 mr-1 fill-current' />
                      Đăng ký hiến
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className='lg:hidden space-y-4'>
        {requests.map((request) => (
          <div key={request.id} className='bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6'>
            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center space-x-3'>
                <div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center'>
                  <Droplet className='h-6 w-6 text-red-600 fill-current' />
                </div>
                <div>
                  <div className='text-xl font-bold text-red-600'>
                    {getBloodTypeDisplay(request.bloodType)}
                  </div>
                  <div className='text-sm text-gray-500'>
                    #{request.id}
                  </div>
                </div>
              </div>
              <span className={getPriorityBadge(request.priority)}>
                {getPriorityText(request.priority)}
              </span>
            </div>

            {/* Content */}
            <div className='space-y-3 mb-4'>
              <div>
                <div className='font-bold text-gray-900 text-lg'>
                  {request.patientName || 'Chưa xác định'}
                </div>
                <div className='text-gray-700 font-medium'>
                  {request.hospital || 'Chưa xác định'}
                </div>
              </div>

              {request.description && (
                <div className='text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border'>
                  {request.description}
                </div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-gray-50 p-3 rounded-lg border'>
                  <div className='text-xs font-bold text-gray-700 uppercase tracking-wide'>Số lượng</div>
                  <div className='text-lg font-bold text-gray-900'>
                    {request.quantityNeeded || request.quantityInUnits || '1'} đơn vị
                  </div>
                </div>
                <div className='bg-gray-50 p-3 rounded-lg border'>
                  <div className='text-xs font-bold text-gray-700 uppercase tracking-wide'>Thời hạn</div>
                  <div className='text-sm font-bold text-gray-900'>
                    {formatDate(request.neededBy)}
                  </div>
                </div>
              </div>

              {request.location && (
                <div className='bg-gray-50 p-3 rounded-lg border'>
                  <div className='text-xs font-bold text-gray-700 uppercase tracking-wide'>Địa điểm</div>
                  <div className='text-sm font-bold text-gray-900'>
                    {request.location}
                  </div>
                </div>
              )}

              {(request.contactPhone || request.contactEmail) && (
                <div className='bg-gray-50 p-3 rounded-lg border'>
                  <div className='text-xs font-bold text-gray-700 uppercase tracking-wide mb-2'>Liên hệ</div>
                  <div className='space-y-1'>
                    {request.contactPhone && (
                      <div className='flex items-center text-blue-600'>
                        <Phone className='h-4 w-4 mr-2' />
                        <a href={`tel:${request.contactPhone}`} className='hover:underline font-medium'>
                          {request.contactPhone}
                        </a>
                      </div>
                    )}
                    {request.contactEmail && (
                      <div className='flex items-center text-blue-600'>
                        <Mail className='h-4 w-4 mr-2' />
                        <a href={`mailto:${request.contactEmail}`} className='hover:underline font-medium'>
                          {request.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action */}
            <div className='flex justify-center pt-4 border-t-2 border-gray-200'>
              <Button
                onClick={() => handlePledge(request.id)}
                variant='primary'
                className='bg-red-600 hover:bg-red-700 text-white font-bold w-full'
              >
                <Heart className='h-5 w-5 mr-2 fill-current' />
                Đăng ký hiến máu
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmergencyBloodRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await bloodRequestService.searchActiveRequests();
      console.log('API response:', response); // Debug log
      
      // Handle different response formats
      let requestsData = [];
      if (response.data && Array.isArray(response.data)) {
        requestsData = response.data;
      } else if (Array.isArray(response)) {
        requestsData = response;
      } else {
        console.warn('Unexpected response format:', response);
        requestsData = [];
      }
      
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Không thể tải danh sách yêu cầu máu.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handlePledgeSuccess = () => {
    // Refresh the requests list to update pledge counts
    fetchRequests();
  };
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6 shadow-lg'>
            <Heart className='w-8 h-8 text-white fill-current' />
          </div>
          <h1 className='text-4xl font-extrabold text-gray-900 mb-3'>
            Các Trường Hợp Cần Máu Khẩn Cấp
          </h1>
          <p className='text-lg text-gray-700 max-w-2xl mx-auto font-medium mb-6'>
            Mỗi giọt máu cho đi, một cuộc đời ở lại. Hãy cùng chung tay giúp đỡ
            những bệnh nhân đang cần máu.
          </p>
          <Button
            onClick={fetchRequests}
            disabled={loading}
            variant='outline'
            className='inline-flex items-center border-2 border-gray-300 font-bold'
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Làm mới
          </Button>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='text-center'>
              <LoadingSpinner size='12' />
              <p className='text-gray-600 mt-4 font-medium'>Đang tải danh sách yêu cầu...</p>
            </div>          </div>
        ) : (
          <BloodRequestsTable requests={requests} onPledgeSuccess={handlePledgeSuccess} />
        )}
      </div>
    </div>
  );
};

export default EmergencyBloodRequest;
