// src/pages/EmergencyBloodRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Heart, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

import bloodRequestService from '../services/bloodRequestService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';
import PledgeButton from '../components/blood/PledgeButton';
import UrgencyBadge from '../components/common/UrgencyBadge';
import DateTimeDisplay from '../components/common/DateTimeDisplay';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { HOSPITAL_INFO } from '../utils/constants';

const EmergencyBloodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveRequests();
  }, []);
  const fetchActiveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await bloodRequestService.searchActiveRequests();
      setRequests(response.data || response || []);
    } catch (error) {
      console.error(
      error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        // Authentication error - show a more specific message
        toast.error('Bạn cần đăng nhập để xem danh sách yêu cầu máu khẩn cấp');
      } else if (error.response?.status === 0 || error.code === 'ECONNABORTED') {
        // Network error or timeout
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Other errors
        const errorMessage = error.response?.data?.message || 'Không thể tải danh sách yêu cầu máu khẩn cấp';
        toast.error(errorMessage);
      }
      
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePledgeSuccess = () => {
    fetchActiveRequests(); // Refresh để cập nhật pledge count
    toast.success('Cảm ơn bạn đã cam kết hiến máu! Vui lòng đến bệnh viện theo thông tin được cung cấp.');
  };

  const headerActions = [
    {
      label: 'Làm mới',
      icon: RefreshCw,
      onClick: fetchActiveRequests,
      variant: 'outline'
    }
  ];

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-center items-center py-20'>
            <LoadingSpinner size='12' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <PageHeader
          title="Yêu cầu máu khẩn cấp"
          description="Những yêu cầu cần hỗ trợ gấp từ các bệnh viện. Hãy cam kết hiến máu để cứu người!"
          icon={AlertTriangle}
          actions={headerActions}
        />

        {/* Hospital Info Banner */}
        <div className='mb-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg'>
          <div className='flex items-center'>
            <MapPin className='w-5 h-5 text-blue-400 mr-2' />
            <div>
              <h3 className='text-lg font-medium text-blue-900'>Địa điểm hiến máu</h3>
              <p className='text-blue-700 mt-1'>{HOSPITAL_INFO.FULL_ADDRESS}</p>
              <p className='text-sm text-blue-600 mt-2'>
                💡 <strong>Lưu ý:</strong> Sau khi cam kết, vui lòng đến bệnh viện trong vòng 24-48 giờ để hoàn thành quá trình hiến máu.
              </p>
            </div>
          </div>
        </div>

        {requests.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {requests.map((request) => (
              <EmergencyRequestCard
                key={request.id}
                request={request}
                onPledgeSuccess={handlePledgeSuccess}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="results"
            title="Hiện tại không có yêu cầu máu khẩn cấp"
            description="Tuyệt vời! Hiện tại không có yêu cầu máu khẩn cấp nào. Hãy quay lại sau hoặc kiểm tra các yêu cầu hiến máu thường xuyên khác."
            action={{
              label: 'Xem tất cả yêu cầu',
              href: '/blood-requests'
            }}
          />
        )}
      </div>
    </div>
  );
};

// Component hiển thị từng emergency request
const EmergencyRequestCard = ({ request, onPledgeSuccess }) => {
  const pledgeCount = request.pledgeCount || request.pledges?.length || 0;
  const requiredPledges = (request.quantityInUnits || 1) + 1; // N+1 rule
  const progressPercentage = Math.min((pledgeCount / requiredPledges) * 100, 100);

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg text-red-600 flex items-center'>
            <AlertTriangle className='w-5 h-5 mr-2' />
            Cần máu {request.bloodType?.bloodGroup}
          </CardTitle>
          <UrgencyBadge urgency={request.urgency} />
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Patient and Hospital Info */}
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span className='text-sm font-medium text-gray-600'>Bệnh nhân:</span>
            <span className='text-sm text-gray-900 font-medium'>{request.patientName}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm font-medium text-gray-600'>Bệnh viện:</span>
            <span className='text-sm text-gray-900'>{request.hospital}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm font-medium text-gray-600'>Số lượng:</span>            <span className='text-sm font-semibold text-red-600'>
              {request.quantityInUnits} đơn vị
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Tiến độ cam kết:</span>
            <span className='font-medium'>{pledgeCount}/{requiredPledges} người</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div 
              className='bg-red-500 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Time info */}
        <div className='flex items-center text-sm text-gray-500'>
          <Clock className='w-4 h-4 mr-1' />
          <span>Tạo lúc: </span>
          <DateTimeDisplay date={request.createdAt} format="relative" />
        </div>

        {/* Pledge Button */}
        <div className='pt-2'>
          <PledgeButton 
            request={request} 
            onPledgeSuccess={onPledgeSuccess}
          />
        </div>

        {/* Instructions */}
        <div className='mt-4 p-3 bg-blue-50 rounded-md'>
          <p className='text-xs text-blue-700'>
            💡 <strong>Sau khi cam kết:</strong> Vui lòng đến {HOSPITAL_INFO.NAME} trong vòng 24-48 giờ để hoàn thành hiến máu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyBloodRequestsPage;

