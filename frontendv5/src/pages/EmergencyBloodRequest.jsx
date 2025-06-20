import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BloodRequestCard from '../components/blood/BloodRequestCard';
import Button from '../components/common/Button';
import bloodRequestService from '../services/bloodRequestService';

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
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900'>
            Các Trường Hợp Cần Máu Khẩn Cấp
          </h1>
          <p className='mt-4 text-lg text-gray-600'>
            Mỗi giọt máu cho đi, một cuộc đời ở lại. Hãy cùng chung tay giúp đỡ
            những bệnh nhân đang cần máu.
          </p>
          <div className='mt-6'>
            <Button
              onClick={fetchRequests}
              disabled={loading}
              variant='outline'
              className='inline-flex items-center'
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Làm mới
            </Button>
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-12'>
            <LoadingSpinner size='12' />
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {Array.isArray(requests) && requests.length > 0 ? (
              requests.map(req => (
                <BloodRequestCard
                  key={req.id}
                  request={req}
                  onPledgeSuccess={handlePledgeSuccess}
                />
              ))
            ) : (
              <div className='col-span-full text-center py-12'>
                <p className='text-gray-500 text-lg'>
                  Hiện tại không có yêu cầu khẩn cấp nào.
                </p>
                <p className='text-gray-400 text-sm mt-2'>
                  Hãy quay lại sau để kiểm tra các yêu cầu mới.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
  );
};
export default EmergencyBloodRequest;
