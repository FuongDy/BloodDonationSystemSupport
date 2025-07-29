// src/components/donation/DonationDetailModal.jsx
import React from 'react';
import { X, Calendar, MapPin, Droplets, Building2, User, FileText, Activity, Clock, AlertTriangle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import DonationTypeBadge from '../common/DonationTypeBadge';
import { formatDateTime, formatDate } from '../../utils/formatters';
import { HOSPITAL_INFO } from '../../utils/constants';
import { getProcessBloodType } from '../../utils/bloodTypeUtils';
import { getDonationStatusConfig } from './DonationStatusConfig';

const DonationDetailModal = ({ isOpen, onClose, donation, user }) => {
  if (!isOpen || !donation) return null;

  const statusConfig = getDonationStatusConfig(donation.status);
  const StatusIcon = statusConfig.icon;
  const bloodType = getProcessBloodType(donation, user);
  const isEmergency = donation.donationType === 'EMERGENCY';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết đơn hiến máu
                </h3>
                <p className="text-sm text-gray-500">ID: {donation.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Status and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Trạng thái</span>
                </div>
                <StatusBadge status={donation.status || 'PENDING_APPROVAL'} type="donation" />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {isEmergency ? (
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Loại hiến máu</span>
                </div>
                <DonationTypeBadge donationType={donation.donationType || 'STANDARD'} />
              </div>
            </div>

            {/* Blood Type and Volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Nhóm máu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xl font-bold ${bloodType === 'Chưa xác định nhóm máu' ? 'text-gray-500' : 'text-red-600'}`}>
                    {bloodType}
                  </span>
                  {bloodType !== 'Chưa xác định nhóm máu' && (
                    <Droplets className="w-5 h-5 text-red-500 fill-current" />
                  )}
                </div>
              </div>

              {donation.collectedVolumeMl && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Lượng máu hiến</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-green-600">
                      {donation.collectedVolumeMl}ml
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Donor Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Thông tin người hiến</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Họ và tên:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {donation.donor?.fullName || user?.fullName || 'Chưa cập nhật'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Nhóm máu:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {donation.donor?.bloodType || bloodType}
                  </span>
                </div>
              </div>
            </div>

            {/* Note
            {donation.note && donation.note.trim() && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Ghi chú</span>
                </div>
                <p className="text-gray-900">{donation.note}</p>
              </div>
            )} */}

            {/* Appointment Information */}
            {donation.appointment && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Thông tin lịch hẹn</span>
                </div>
                <div className="space-y-3">
                  
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-500">Bệnh viện:</span>
                    <span className="font-medium text-gray-900">
                      {donation.appointment.hospital || HOSPITAL_INFO.FULL_NAME}
                    </span>
                  </div>
                  
                  {donation.appointment.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-500">Địa chỉ:</span>
                        <p className="font-medium text-gray-900 mt-1">
                          {donation.appointment.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Thời gian</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Ngày tạo đơn:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatDateTime(donation.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailModal;
