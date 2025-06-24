// src/pages/MyDonationHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MapPin, Phone, Clock, User, Activity, ChevronRight, Award, Droplets, FileText, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import donationService from '../services/donationService';
import { formatDateTime } from '../utils/formatters';
import { HOSPITAL_INFO } from '../utils/constants';

const getStatusConfig = status => {
  switch (status) {
    case 'COMPLETED':
      return { 
        icon: Heart, 
        color: 'text-green-700', 
        bg: 'bg-green-100',
        badge: 'bg-green-500 text-white',
        displayText: 'Hoàn thành'
      };
    case 'SCHEDULED':
      return { 
        icon: Calendar, 
        color: 'text-blue-700', 
        bg: 'bg-blue-100',
        badge: 'bg-blue-500 text-white',
        displayText: 'Đã lên lịch'
      };
    case 'PENDING':
      return { 
        icon: Clock, 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-100',
        badge: 'bg-yellow-500 text-white',
        displayText: 'Chờ xử lý'
      };
    case 'CANCELLED':
      return { 
        icon: Activity, 
        color: 'text-red-700', 
        bg: 'bg-red-100',
        badge: 'bg-red-500 text-white',
        displayText: 'Đã hủy'
      };
    case 'IN_PROGRESS':
      return { 
        icon: Activity, 
        color: 'text-purple-700', 
        bg: 'bg-purple-100',
        badge: 'bg-purple-500 text-white',
        displayText: 'Đang thực hiện'
      };
    default:
      return { 
        icon: Clock, 
        color: 'text-gray-700', 
        bg: 'bg-gray-100',
        badge: 'bg-gray-500 text-white',
        displayText: 'Chưa xác định'
      };
  }
};

const DonationHistoryTable = ({ donationProcesses }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Trạng thái & Nhóm máu
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Thông tin hiến máu
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Lịch hẹn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Kết quả
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donationProcesses.map((process) => {
                const statusConfig = getStatusConfig(process.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={process.id} className="hover:bg-gray-50 transition-colors">                    {/* Status & Blood Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-red-600">
                              {process.donor?.bloodType || 'N/A'}
                            </span>
                            <Droplets className="w-4 h-4 text-red-500 fill-current" />
                          </div>
                          <StatusBadge status={process.status} />
                        </div>
                      </div>
                    </td>

                    {/* Donation Info */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {process.note && (
                          <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                            {process.note}
                          </p>
                        )}
                        {process.collectedVolumeMl && (
                          <div className="flex items-center text-sm text-green-600">
                            <Droplets className="w-4 h-4 mr-1" />
                            <span className="font-semibold">{process.collectedVolumeMl}ml</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Appointment */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {process.appointment ? (
                          <>
                            <div className="flex items-center text-sm text-gray-700">
                              <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                              <span>{formatDateTime(process.appointment.scheduledDate)}</span>
                            </div>                            <div className="flex items-center text-sm text-gray-700">
                              <Building2 className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                              <span className="truncate">{HOSPITAL_INFO.FULL_NAME}</span>
                            </div>
                            {process.appointment.address && (
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate text-xs">{process.appointment.address}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Chưa có lịch hẹn</span>
                        )}
                      </div>
                    </td>

                    {/* Results */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {process.status === 'COMPLETED' && process.collectedVolumeMl ? (
                          <div className="flex items-center text-sm text-green-600">
                            <Award className="w-4 h-4 mr-2" />
                            <span>Thành công</span>
                          </div>
                        ) : process.status === 'CANCELLED' ? (
                          <div className="flex items-center text-sm text-red-600">
                            <Activity className="w-4 h-4 mr-2" />
                            <span>Đã hủy</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </div>
                    </td>

                    {/* Creation Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDateTime(process.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {process.id}
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
        {donationProcesses.map((process) => {
          const statusConfig = getStatusConfig(process.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={process.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-red-600">
                        {process.donor?.bloodType || 'N/A'}
                      </span>
                      <Droplets className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                  </div>
                </div>
                <StatusBadge status={process.status} />
              </div>

              {/* Note */}
              {process.note && (
                <div className="mb-3">
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                    <p className="text-sm text-gray-700">{process.note}</p>
                  </div>
                </div>
              )}

              {/* Appointment Info */}
              {process.appointment && (
                <div className="mb-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{formatDateTime(process.appointment.scheduledDate)}</span>
                  </div>                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{HOSPITAL_INFO.FULL_NAME}</span>
                  </div>
                  {process.appointment.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">{process.appointment.address}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Volume & Result */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  ID: {process.id} • {formatDateTime(process.createdAt)}
                </div>
                {process.collectedVolumeMl && (
                  <div className="flex items-center text-sm text-green-600">
                    <Droplets className="w-4 h-4 mr-1" />
                    <span className="font-semibold">{process.collectedVolumeMl}ml</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MyDonationHistoryPage = () => {
  const { user } = useAuth();
  const [donationProcesses, setDonationProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await donationService.getMyDonationHistory();
        setDonationProcesses(response.data || []);
      } catch (error) {
        console.error('Error fetching donation history:', error);
        setError('Không thể tải lịch sử hiến máu. Vui lòng thử lại.');
        toast.error('Không thể tải lịch sử hiến máu');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDonationHistory();
    }
  }, [user]);

  // Calculate statistics
  const stats = {
    total: donationProcesses.length,
    completed: donationProcesses.filter(p => p.status === 'COMPLETED').length,
    scheduled: donationProcesses.filter(p => p.status === 'SCHEDULED').length,
    pending: donationProcesses.filter(p => p.status === 'PENDING').length,
    totalVolume: donationProcesses
      .filter(p => p.status === 'COMPLETED' && p.collectedVolumeMl)
      .reduce((sum, p) => sum + p.collectedVolumeMl, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Đang tải lịch sử hiến máu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" />
                Lịch Sử Hiến Máu
              </h1>
              <p className="mt-2 text-gray-600">
                Theo dõi toàn bộ hành trình hiến máu của bạn
              </p>
            </div>
            <Link
              to="/request-donation"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
            >
              <Heart className="w-5 h-5 mr-2" />
              Đăng Ký Hiến Máu
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số lần</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã lên lịch</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <Droplets className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng thể tích</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVolume}ml</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <Activity className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : donationProcesses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Heart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch sử hiến máu</h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có lần hiến máu nào. Hãy bắt đầu hành trình cứu người của bạn ngay hôm nay!
            </p>
            <Link
              to="/request-donation"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Heart className="w-5 h-5 mr-2" />
              Đăng Ký Hiến Máu Ngay
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <DonationHistoryTable donationProcesses={donationProcesses} />
        )}
      </div>
    </div>
  );
};

export default MyDonationHistoryPage;


