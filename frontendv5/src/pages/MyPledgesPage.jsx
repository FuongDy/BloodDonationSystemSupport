// src/pages/MyPledgesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MapPin, Phone, Mail, Clock, User, Activity, ChevronRight, Award } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import bloodRequestService from '../services/bloodRequestService';

// Utility functions
const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getPriorityConfig = priority => {
  switch (priority) {
    case 'EMERGENCY':
      return {
        badge: 'bg-red-500 text-white',
        icon: '🚨',
        text: 'Khẩn cấp'
      };
    case 'URGENT':
      return {
        badge: 'bg-orange-500 text-white',
        icon: '⚡',
        text: 'Gấp'
      };
    case 'NORMAL':
      return {
        badge: 'bg-blue-500 text-white',
        icon: '📋',
        text: 'Bình thường'
      };
    default:
      return {
        badge: 'bg-gray-500 text-white',
        icon: '📋',
        text: 'Chưa xác định'
      };
  }
};

const getStatusConfig = status => {
  switch (status) {
    case 'PENDING':
      return { icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-100' };
    case 'CONFIRMED':
      return { icon: Award, color: 'text-green-700', bg: 'bg-green-100' };
    case 'COMPLETED':
      return { icon: Heart, color: 'text-emerald-700', bg: 'bg-emerald-100' };
    case 'CANCELLED':
      return { icon: Activity, color: 'text-gray-700', bg: 'bg-gray-100' };
    default:
      return { icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-100' };
  }
};

// Get blood type display string
const getBloodTypeDisplay = (bloodType) => {
  if (!bloodType) return 'Chưa xác định';
  return `${bloodType.bloodGroup}${bloodType.componentType}`;
};

const PledgesTable = ({ pledges }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Nhóm máu & Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Thông tin yêu cầu
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Địa điểm & Thời hạn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pledges.map((pledge) => {
                const request = pledge.bloodRequest;
                const priorityConfig = getPriorityConfig(request.priority);
                const statusConfig = getStatusConfig(pledge.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={pledge.id} className="hover:bg-gray-50 transition-colors">
                    {/* Blood Type & Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-red-600">
                              {getBloodTypeDisplay(request.bloodType)}
                            </span>
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          </div>
                          <StatusBadge status={pledge.status || 'PENDING'} />
                        </div>
                      </div>
                    </td>

                    {/* Request Info */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.badge}`}>
                            <span className="mr-1">{priorityConfig.icon}</span>
                            {priorityConfig.text}
                          </span>
                        </div>
                        {request.description && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {request.description}
                          </p>
                        )}
                        {request.quantityNeeded && (
                          <p className="text-xs text-gray-600 mt-1">
                            Cần: <span className="font-semibold">{request.quantityNeeded} đơn vị</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Location & Deadline */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {request.location && (
                          <div className="flex items-center text-sm text-gray-700">
                            <MapPin className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                            <span className="truncate">{request.location}</span>
                          </div>
                        )}
                        {request.neededBy && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Clock className="w-4 h-4 text-orange-600 mr-2" />
                            <span>{formatDate(request.neededBy)}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {request.contactPhone && (
                          <a
                            href={`tel:${request.contactPhone}`}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="truncate">{request.contactPhone}</span>
                          </a>
                        )}
                        {request.contactEmail && (
                          <a
                            href={`mailto:${request.contactEmail}`}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="truncate">{request.contactEmail}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(pledge.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {pledge.id}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {pledges.map((pledge) => {
          const request = pledge.bloodRequest;
          const priorityConfig = getPriorityConfig(request.priority);
          const statusConfig = getStatusConfig(pledge.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={pledge.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-red-600">
                        {getBloodTypeDisplay(request.bloodType)}
                      </span>
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                  </div>
                </div>
                <StatusBadge status={pledge.status || 'PENDING'} />
              </div>

              {/* Priority */}
              <div className="mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.badge}`}>
                  <span className="mr-1">{priorityConfig.icon}</span>
                  {priorityConfig.text}
                </span>
              </div>

              {/* Description */}
              {request.description && (
                <p className="text-sm text-gray-700 mb-3">{request.description}</p>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {request.quantityNeeded && (
                  <div>
                    <span className="text-gray-600">Số lượng:</span>
                    <p className="font-semibold">{request.quantityNeeded} đơn vị</p>
                  </div>
                )}
                {request.location && (
                  <div>
                    <span className="text-gray-600">Địa điểm:</span>
                    <p className="font-semibold truncate">{request.location}</p>
                  </div>
                )}
                {request.neededBy && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Thời hạn:</span>
                    <p className="font-semibold">{formatDate(request.neededBy)}</p>
                  </div>
                )}
              </div>

              {/* Contact */}
              {(request.contactPhone || request.contactEmail) && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div className="space-y-2">
                    {request.contactPhone && (
                      <a
                        href={`tel:${request.contactPhone}`}
                        className="flex items-center text-sm text-blue-600"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {request.contactPhone}
                      </a>
                    )}
                    {request.contactEmail && (
                      <a
                        href={`mailto:${request.contactEmail}`}
                        className="flex items-center text-sm text-blue-600"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {request.contactEmail}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between items-center text-xs text-gray-500">
                <span>ID: {pledge.id}</span>
                <span>{formatDate(pledge.createdAt)}</span>
              </div>
            </div>
          );
        })}
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
        // Gọi API để lấy danh sách pledges của user
        const response = await bloodRequestService.getUserPledges();
        const userPledges = response.data || response || [];
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

  // Statistics calculations
  const stats = React.useMemo(() => {
    const total = pledges.length;
    const pending = pledges.filter(p => p.status === 'PENDING').length;
    const confirmed = pledges.filter(p => p.status === 'CONFIRMED').length;
    const completed = pledges.filter(p => p.status === 'COMPLETED').length;
    
    return { total, pending, confirmed, completed };
  }, [pledges]);

  if (!user) {    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='max-w-md w-full mx-4'>
          <div className='bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-gray-200'>
            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Heart className='w-10 h-10 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>
              Vui lòng đăng nhập
            </h1>
            <p className='text-gray-700 mb-6 font-medium'>
              Bạn cần đăng nhập để xem danh sách đăng ký hiến máu của mình.
            </p>
            <Link
              to='/login'
              className='inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-bold shadow-lg'
            >
              <User className='w-5 h-5 mr-2' />
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6 shadow-lg'>
            <Heart className='w-8 h-8 text-white fill-current' />
          </div>
          <h1 className='text-4xl font-extrabold text-gray-900 mb-3'>
            Đăng Ký Hiến Máu Của Tôi
          </h1>
          <p className='text-lg text-gray-700 max-w-2xl mx-auto font-medium'>
            Quản lý và theo dõi tất cả các yêu cầu hiến máu mà bạn đã đăng ký. 
            Mỗi giọt máu đều có thể cứu sống một người.
          </p>
        </div>        {/* Statistics Cards */}
        {!loading && pledges.length > 0 && (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
            <div className='bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Tổng cộng</p>
                  <p className='text-3xl font-bold text-gray-900 mt-1'>{stats.total}</p>
                </div>
                <div className='p-3 bg-blue-100 rounded-lg'>
                  <Activity className='w-6 h-6 text-blue-600' />
                </div>
              </div>
            </div>
            
            <div className='bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Chờ xử lý</p>
                  <p className='text-3xl font-bold text-yellow-600 mt-1'>{stats.pending}</p>
                </div>
                <div className='p-3 bg-yellow-100 rounded-lg'>
                  <Clock className='w-6 h-6 text-yellow-600' />
                </div>
              </div>
            </div>
            
            <div className='bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Đã xác nhận</p>
                  <p className='text-3xl font-bold text-green-600 mt-1'>{stats.confirmed}</p>
                </div>
                <div className='p-3 bg-green-100 rounded-lg'>
                  <Award className='w-6 h-6 text-green-600' />
                </div>
              </div>
            </div>
            
            <div className='bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Hoàn thành</p>
                  <p className='text-3xl font-bold text-emerald-600 mt-1'>{stats.completed}</p>
                </div>
                <div className='p-3 bg-emerald-100 rounded-lg'>
                  <Heart className='w-6 h-6 text-emerald-600 fill-current' />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='text-center'>
              <LoadingSpinner size='12' />
              <p className='text-gray-600 mt-4'>Đang tải danh sách đăng ký...</p>
            </div>
          </div>        ) : pledges.length > 0 ? (
          <PledgesTable pledges={pledges} />
        ) : (<div className='text-center py-20'>
            <div className='max-w-md mx-auto'>
              <div className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-200'>
                <Heart className='w-12 h-12 text-red-500' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                Chưa có đăng ký nào
              </h3>
              <p className='text-gray-700 mb-8 leading-relaxed font-medium'>
                Bạn chưa đăng ký hiến máu cho yêu cầu nào. Hãy tham gia cứu người 
                và mang đến hy vọng cho những bệnh nhân đang cần máu khẩn cấp!
              </p>
              <Link
                to='/blood-requests'
                className='inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                <Heart className='w-6 h-6 mr-3 fill-current' />
                Khám phá yêu cầu hiến máu
                <ChevronRight className='w-5 h-5 ml-2' />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPledgesPage;
