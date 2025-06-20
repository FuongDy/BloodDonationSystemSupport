// src/pages/MyPledgesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MapPin, Phone, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import bloodRequestService from '../services/bloodRequestService';

const PledgeCard = ({ pledge }) => {
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'EMERGENCY':
        return 'border-red-500 bg-red-50';
      case 'URGENT':
        return 'border-orange-500 bg-orange-50';
      case 'NORMAL':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const request = pledge.bloodRequest;

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-l-4 ${getPriorityColor(request.priority)} p-6 hover:shadow-lg transition-shadow`}
    >
      <div className='flex justify-between items-start mb-4'>
        <div className='flex items-center'>
          <Heart className='w-6 h-6 text-red-500 mr-3 fill-current' />
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Nhóm máu: {request.bloodTypeRequired}
            </h3>
            <p className='text-sm text-gray-600'>
              Đăng ký lúc: {formatDate(pledge.createdAt)}
            </p>
          </div>
        </div>
        <StatusBadge status={pledge.status || 'PENDING'} />
      </div>

      {request.description && (
        <p className='text-gray-700 mb-4'>{request.description}</p>
      )}

      <div className='space-y-2 mb-4'>
        {request.quantityNeeded && (
          <div className='flex items-center text-sm text-gray-600'>
            <span className='font-medium'>Số lượng cần:</span>
            <span className='ml-2'>{request.quantityNeeded} đơn vị</span>
          </div>
        )}

        {request.location && (
          <div className='flex items-center text-sm text-gray-600'>
            <MapPin className='w-4 h-4 mr-2' />
            <span>{request.location}</span>
          </div>
        )}

        {request.neededBy && (
          <div className='flex items-center text-sm text-gray-600'>
            <Calendar className='w-4 h-4 mr-2' />
            <span>Cần trước: {formatDate(request.neededBy)}</span>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {(request.contactPhone || request.contactEmail) && (
        <div className='bg-gray-50 rounded-lg p-3 mb-4'>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>
            Thông tin liên hệ:
          </h4>
          <div className='space-y-1'>
            {request.contactPhone && (
              <div className='flex items-center text-sm text-gray-600'>
                <Phone className='w-4 h-4 mr-2' />
                <a
                  href={`tel:${request.contactPhone}`}
                  className='text-blue-600 hover:underline'
                >
                  {request.contactPhone}
                </a>
              </div>
            )}
            {request.contactEmail && (
              <div className='flex items-center text-sm text-gray-600'>
                <Mail className='w-4 h-4 mr-2' />
                <a
                  href={`mailto:${request.contactEmail}`}
                  className='text-blue-600 hover:underline'
                >
                  {request.contactEmail}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <div className='flex justify-between items-center text-xs text-gray-500'>
        <span>ID: {pledge.id}</span>
        <span>Yêu cầu: #{request.id}</span>
      </div>
    </div>
  );
};

const MyPledgesPage = () => {
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyPledges = async () => {
      setLoading(true);
      try {
        // Note: This currently returns mock data as backend endpoint is not implemented
        const response = await bloodRequestService.getUserPledges();
        const userPledges = response.data || [];
        setPledges(userPledges);
      } catch (error) {
        console.error('Error fetching user pledges:', error);
        toast.error('Không thể tải danh sách đăng ký hiến máu của bạn.');
        setPledges([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchMyPledges();
    }
  }, [user?.id]);

  if (!user) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Vui lòng đăng nhập
          </h1>
          <p className='text-gray-600'>
            Bạn cần đăng nhập để xem danh sách đăng ký hiến máu của mình.
          </p>
          <Link
            to='/login'
            className='mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700'
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Đăng Ký Hiến Máu Của Tôi
        </h1>
        <p className='text-gray-600'>
          Quản lý các yêu cầu hiến máu mà bạn đã đăng ký.
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <LoadingSpinner size='12' />
        </div>
      ) : pledges.length > 0 ? (
        <div className='space-y-6'>
          {pledges.map(pledge => (
            <PledgeCard key={pledge.id} pledge={pledge} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <Heart className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Chưa có đăng ký nào
          </h3>
          <p className='text-gray-500 mb-6'>
            Bạn chưa đăng ký hiến máu cho yêu cầu nào. Hãy tham gia cứu người
            ngay hôm nay!
          </p>
          <Link
            to='/blood-requests'
            className='inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors'
          >
            <Heart className='w-5 h-5 mr-2' />
            Xem Yêu Cầu Hiến Máu
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPledgesPage;
