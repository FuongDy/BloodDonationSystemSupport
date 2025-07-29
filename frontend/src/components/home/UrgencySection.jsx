import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import bloodRequestService from '../../services/bloodRequestService';
import { getBloodCompatibilityInfo } from '../../utils/bloodCompatibility';
import LoadingSpinner from '../common/LoadingSpinner';

const UrgencySection = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const fetchActiveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await bloodRequestService.searchActiveRequests();
      // Lấy 3 request đầu tiên để hiển thị trong homepage
      const data = response.data || response || [];
      setRequests(data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      // Fallback to mock data nếu API lỗi
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize helper functions
  const getPriorityDisplay = useMemo(() => (urgency) => {
    if (urgency === 'URGENT') return 'Khẩn cấp';
    if (urgency === 'CRITICAL') return 'Cực kỳ khẩn cấp';
    return 'Cần gấp';
  }, []);

  const getPriorityClass = useMemo(() => (urgency) => {
    if (urgency === 'CRITICAL') return 'bg-red-100 text-red-800';
    if (urgency === 'URGENT') return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  }, []);

  const formatTimeLeft = useMemo(() => (createdAt) => {
    if (!createdAt) return 'Mới đăng';
    
    const now = new Date();
    const created = new Date(createdAt);
    const diffHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Vừa đăng';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Yêu cầu khẩn cấp</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những yêu cầu máu khẩn cấp cần được hỗ trợ ngay lập tức
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="8" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Yêu cầu khẩn cấp</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những yêu cầu máu khẩn cấp cần được hỗ trợ ngay lập tức
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">Hiện tại không có yêu cầu khẩn cấp</h3>
            <p className="text-gray-400">Đây là tin tốt! Không có trường hợp cấp cứu nào cần máu gấp.</p>
            <Link 
              to="/blood-requests" 
              className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              Xem tất cả yêu cầu →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div key={request.id} className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(request.urgency)}`}>
                      {getPriorityDisplay(request.urgency)}
                    </span>
                    <div className="flex items-center text-red-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{formatTimeLeft(request.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-red-600 mb-1">
                      Nhóm máu {request.bloodType?.bloodGroup || request.bloodType || 'N/A'}
                    </h3>
                    
                    {/* Hiển thị các nhóm máu tương thích */}
                    {(() => {
                      const recipientBloodType = request.bloodType?.bloodGroup || request.bloodType;
                      if (!recipientBloodType || recipientBloodType === 'N/A') return null;
                      
                      const compatibilityInfo = getBloodCompatibilityInfo(recipientBloodType);
                      if (!compatibilityInfo.compatibleDonors.length) return null;
                      
                      return (
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {compatibilityInfo.compatibleDonors.map((bloodType, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  bloodType === recipientBloodType
                                    ? 'bg-red-100 text-red-800'
                                    : bloodType === 'O-'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                                title={bloodType === recipientBloodType ? 'Trùng khớp' : bloodType === 'O-' ? 'Vạn năng' : 'Tương thích'}
                              >
                                {bloodType}
                                {bloodType === recipientBloodType && ' ✓'}
                                {bloodType === 'O-' && ' 🌟'}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-blue-600">
                            {compatibilityInfo.isUniversalRecipient 
                              ? '🎯 Nhận từ tất cả nhóm máu'
                              : `💡 ${compatibilityInfo.donorCount} nhóm máu có thể hiến`
                            }
                          </p>
                        </div>
                      );
                    })()}
                    
                    <p className="text-gray-600 mt-2">Cần {request.quantityInUnits || request.quantity} đơn vị</p>
                    {request.patientName && (
                      <p className="text-sm text-gray-500 mt-1">BN: {request.patientName}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{request.hospital || request.location || 'Bệnh viện'}</span>
                  </div>
                  
                  {(request.roomNumber || request.bedNumber) && (
                    <div className="text-sm text-gray-500 mb-4">
                      📍 {request.roomNumber && `P.${request.roomNumber}`}
                      {request.roomNumber && request.bedNumber && ' - '}
                      {request.bedNumber && `G.${request.bedNumber}`}
                    </div>
                  )}
                  
                  <Link to="/blood-requests" className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-center">
                    Hỗ trợ ngay
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to="/blood-requests" 
                className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
              >
                Xem tất cả yêu cầu khẩn cấp
                <span className="ml-2">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(UrgencySection);
