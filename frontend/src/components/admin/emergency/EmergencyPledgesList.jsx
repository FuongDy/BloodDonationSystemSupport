// src/components/admin/emergency/EmergencyPledgesList.jsx
import React, { useState, useEffect } from 'react';
import { Users, Clock, User, Phone, Mail, AlertTriangle, RefreshCw, MapPin, Calendar, Shield, Heart, Activity, FileText, Star, Bed } from 'lucide-react';
import LoadingSpinner from '../../common/LoadingSpinner';
import Button from '../../common/Button';
import StatusBadge from '../../common/StatusBadge';
import { useEmergencyPledges } from '../../../hooks/useEmergencyPledges';
import { formatDateTime } from '../../../utils/formatters';

const EmergencyPledgesList = ({ requestId, requestData }) => {
  const { 
    pledges, 
    donationProcesses, 
    isLoading, 
    error, 
    fetchPledgesForRequest, 
    fetchAllDonationProcesses,
    refreshData 
  } = useEmergencyPledges();

  useEffect(() => {
    if (requestId) {
      refreshData(requestId);
    } else {
      fetchAllDonationProcesses();
    }
  }, [requestId, refreshData, fetchAllDonationProcesses]);

  const handleRefresh = () => {
    refreshData(requestId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="8" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Users className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            {requestId ? 'Người đăng ký hiến máu' : 'Quy trình hiến máu từ Emergency Requests'}
          </h3>
          {requestId && pledges.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pledges.length} người
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Làm mới
        </Button>
      </div>

      {/* Request Info (if viewing specific request) */}
      {requestId && requestData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Thông tin yêu cầu khẩn cấp</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-blue-800">
              <User className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">Bệnh nhân:</span>
              <span className="ml-1 truncate">{requestData.patientName}</span>
            </div>
            <div className="flex items-center text-blue-800">
              <Heart className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">Nhóm máu:</span>
              <span className="ml-1">{requestData.bloodType?.bloodGroup}</span>
            </div>
            <div className="flex items-center text-blue-800">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">Bệnh viện:</span>
              <span className="ml-1 truncate">{requestData.hospital}</span>
            </div>
            <div className="flex items-center text-blue-800">
              <Activity className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">Số lượng:</span>
              <span className="ml-1">{requestData.quantityInUnits} đơn vị</span>
            </div>
            <div className="flex items-center text-blue-800">
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">Mức độ:</span>
              <span className="ml-1 uppercase">{requestData.urgency}</span>
            </div>
            <div className="flex items-center text-blue-800">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">Tạo lúc:</span>
              <span className="ml-1">{formatDateTime(requestData.createdAt)}</span>
            </div>
            {/* Thông tin phòng và giường */}
            {(requestData.roomNumber || requestData.bedNumber) && (
              <>
                <div className="flex items-center text-blue-800">
                  <Bed className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="font-medium">Phòng:</span>
                  <span className="ml-1">
                    {requestData.roomNumber ? `Phòng ${requestData.roomNumber}` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center text-blue-800">
                  <Bed className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="font-medium">Giường:</span>
                  <span className="ml-1">
                    {requestData.bedNumber ? `Giường ${requestData.bedNumber}` : 'N/A'}
                  </span>
                </div>
              </>
            )}
          </div>
          {requestData.description && (
            <div className="mt-3 p-3 bg-blue-100 rounded-md">
              <div className="flex items-start">
                <FileText className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-blue-900">Mô tả:</span>
                  <p className="text-sm text-blue-800 mt-1">{requestData.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics Cards for Pledges */}
      {requestId && pledges.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-blue-900">Tổng cộng</div>
                <div className="text-lg font-bold text-blue-600">{pledges.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-green-900">Đã xác minh</div>
                <div className="text-lg font-bold text-green-600">
                  {pledges.filter(p => p.emailVerified).length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-purple-900">Sẵn sàng</div>
                <div className="text-lg font-bold text-purple-600">
                  {pledges.filter(p => p.isReadyToDonate).length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-orange-900">Có kinh nghiệm</div>
                <div className="text-lg font-bold text-orange-600">
                  {pledges.filter(p => p.lastDonationDate).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards for Donation Processes */}
      {!requestId && donationProcesses.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-blue-900">Tổng cộng</div>
                <div className="text-lg font-bold text-blue-600">{donationProcesses.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-yellow-900">Chờ duyệt</div>
                <div className="text-lg font-bold text-yellow-600">
                  {donationProcesses.filter(p => p.status === 'PENDING_APPROVAL').length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-blue-900">Đã hẹn lịch</div>
                <div className="text-lg font-bold text-blue-600">
                  {donationProcesses.filter(p => p.status === 'APPOINTMENT_SCHEDULED').length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-green-900">Hoàn thành</div>
                <div className="text-lg font-bold text-green-600">
                  {donationProcesses.filter(p => p.status === 'COMPLETED').length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-red-900">Từ chối</div>
                <div className="text-lg font-bold text-red-600">
                  {donationProcesses.filter(p => p.status === 'REJECTED').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {requestId ? (
        pledges.length > 0 ? (
          <div className="space-y-3">
            {pledges.map((pledge) => (
              <div key={pledge.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">{pledge.fullName}</h4>
                        {pledge.emailVerified && (
                          <Shield className="w-4 h-4 text-green-500 ml-2" title="Email đã xác minh" />
                        )}
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {pledge.bloodType|| 'Nhóm máu chưa xác định'}
                        </span>
                        {pledge.status && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {pledge.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <Clock className="w-3 h-3 inline mr-1" />
                    <div>{formatDateTime(pledge.createdAt)}</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{pledge.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span>Số điện thoại: {pledge.phone}</span>
                  </div>
                  {pledge.address && (
                    <div className="flex items-center md:col-span-2">
                      <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{pledge.address}</span>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  {pledge.dateOfBirth && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-medium">Ngày sinh:</span>
                      <span className="ml-1">{new Date(pledge.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  
                  {pledge.gender && (
                    <div className="flex items-center text-xs text-gray-600">
                      <User className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-medium">Giới tính:</span>
                      <span className="ml-1">{pledge.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                    </div>
                  )}

                  {pledge.lastDonationDate && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Heart className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-medium">Lần hiến cuối:</span>
                      <span className="ml-1">{new Date(pledge.lastDonationDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}

                  {/* {pledge.isReadyToDonate !== undefined && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Activity className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-medium">Sẵn sàng hiến máu:</span>
                      <span className={`ml-1 ${pledge.isReadyToDonate ? 'text-green-600' : 'text-red-600'}`}>
                        {pledge.isReadyToDonate ? 'Có' : 'Không'}
                      </span>
                    </div>
                  )} */}
                </div>

                {/* Emergency Contact */}
                {pledge.emergencyContact && pledge.emergencyContact !== pledge.phone && (
                  <div className="mt-3 p-2 bg-orange-50 rounded text-xs">
                    <div className="flex items-center text-orange-800">
                      <AlertTriangle className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-medium">Liên hệ khẩn cấp:</span>
                      <span className="ml-1">{pledge.emergencyContact}</span>
                    </div>
                  </div>
                )}

                {/* Medical Conditions */}
                {pledge.medicalConditions && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
                    <div className="flex items-start text-yellow-800">
                      <FileText className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Tình trạng sức khỏe:</span>
                        <p className="mt-1">{pledge.medicalConditions}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Status */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className={`ml-1 ${pledge.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {pledge.emailVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600">SĐT:</span>
                      <span className={`ml-1 ${pledge.phoneVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {pledge.phoneVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </span>
                    </div>
                  </div>
                  {pledge.role && (
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="text-gray-500">{pledge.role}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có người đăng ký
            </h3>
            <p className="text-gray-600">
              Chưa có ai đăng ký hiến máu cho yêu cầu khẩn cấp này.
            </p>
          </div>
        )
      ) : (
        // Show donation processes
        donationProcesses.length > 0 ? (
          <div className="space-y-3">
            {donationProcesses.map((process) => (
              <div key={process.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{process.donorName}</h4>
                      <div className="flex items-center mt-1 space-x-2">
                        <StatusBadge status={process.status} type="donation" />
                        {process.donorBloodType && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            {process.donorBloodType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <Clock className="w-3 h-3 inline mr-1" />
                    <div>{formatDateTime(process.createdAt)}</div>
                    {process.updatedAt && process.updatedAt !== process.createdAt && (
                      <div className="mt-1 text-gray-400">
                        Cập nhật: {formatDateTime(process.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Donation Process Information */}
                <div className="space-y-2 mb-3">
                  {process.donorEmail && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{process.donorEmail}</span>
                    </div>
                  )}
                  
                  {process.donorPhone && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span>{process.donorPhone}</span>
                    </div>
                  )}

                  {process.appointmentDate && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-medium">Lịch hẹn:</span>
                      <span className="ml-1">{formatDateTime(process.appointmentDate)}</span>
                    </div>
                  )}

                  {process.healthCheckDate && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Activity className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-medium">Khám sàng lọc:</span>
                      <span className="ml-1">{formatDateTime(process.healthCheckDate)}</span>
                    </div>
                  )}

                  {process.collectionDate && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Heart className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-medium">Ngày hiến máu:</span>
                      <span className="ml-1">{formatDateTime(process.collectionDate)}</span>
                    </div>
                  )}
                </div>

                {/* Health Check Results */}
                {(process.healthCheckResult || process.bloodPressure || process.heartRate) && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <h5 className="text-xs font-medium text-blue-900 mb-2">Kết quả khám sàng lọc</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-blue-800">
                      {process.healthCheckResult && (
                        <div>
                          <span className="font-medium">Kết quả:</span>
                          <span className={`ml-1 ${process.healthCheckResult === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>
                            {process.healthCheckResult === 'PASSED' ? 'Đạt' : 'Không đạt'}
                          </span>
                        </div>
                      )}
                      {process.bloodPressure && (
                        <div>
                          <span className="font-medium">Huyết áp:</span>
                          <span className="ml-1">{process.bloodPressure}</span>
                        </div>
                      )}
                      {process.heartRate && (
                        <div>
                          <span className="font-medium">Nhịp tim:</span>
                          <span className="ml-1">{process.heartRate} bpm</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Blood Test Results */}
                {(process.bloodTestResult || process.testDetails) && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <h5 className="text-xs font-medium text-green-900 mb-2">Kết quả xét nghiệm máu</h5>
                    <div className="text-xs text-green-800">
                      {process.bloodTestResult && (
                        <div className="mb-1">
                          <span className="font-medium">Kết quả:</span>
                          <span className={`ml-1 ${process.bloodTestResult === 'SAFE' ? 'text-green-600' : 'text-red-600'}`}>
                            {process.bloodTestResult === 'SAFE' ? 'An toàn' : 'Không an toàn'}
                          </span>
                        </div>
                      )}
                      {process.testDetails && (
                        <div>
                          <span className="font-medium">Chi tiết:</span>
                          <span className="ml-1">{process.testDetails}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {process.note && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-start text-yellow-800">
                      <FileText className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium">Ghi chú:</span>
                        <p className="text-xs mt-1">{process.note}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Collection Information */}
                {(process.volumeCollected || process.bloodUnitId) && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                    <h5 className="text-xs font-medium text-purple-900 mb-2">Thông tin thu thập</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-purple-800">
                      {process.volumeCollected && (
                        <div>
                          <span className="font-medium">Thể tích:</span>
                          <span className="ml-1">{process.volumeCollected} ml</span>
                        </div>
                      )}
                      {process.bloodUnitId && (
                        <div>
                          <span className="font-medium">Mã đơn vị:</span>
                          <span className="ml-1 font-mono">{process.bloodUnitId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có quy trình hiến máu
            </h3>
            <p className="text-gray-600">
              Chưa có quy trình hiến máu nào được tạo.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default EmergencyPledgesList;
