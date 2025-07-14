// src/components/admin/modals/AppointmentDetailModal.jsx
import React from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, Mail, Heart, FileText } from 'lucide-react';
import Modal from '../../common/Modal';
import StatusBadge from '../../common/StatusBadge';
import { formatDateTime, formatDate, formatTime } from '../../../utils/formatters';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

const AppointmentDetailModal = ({ 
  isOpen, 
  onClose, 
  appointment 
}) => {
  if (!appointment) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case APPOINTMENT_STATUS.CONFIRMED:
        return 'success';
      case APPOINTMENT_STATUS.PENDING:
        return 'warning';
      case APPOINTMENT_STATUS.CANCELLED:
        return 'error';
      case APPOINTMENT_STATUS.COMPLETED:
        return 'info';
      default:
        return 'default';
    }
  };

  // Helper function to parse backend date format (dd-MM-yyyy)
  const parseBackendDate = (dateString) => {
    if (!dateString) return null;
    
    // If it's already a valid date string, use it directly
    if (dateString.includes('-') && dateString.length === 10) {
      // Check if it's dd-MM-yyyy format
      const parts = dateString.split('-');
      if (parts.length === 3 && parts[0].length === 2) {
        // Convert dd-MM-yyyy to yyyy-MM-dd for JavaScript
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    return dateString;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết cuộc hẹn hiến máu"
      size="large"
    >
      <div className="space-y-6">
        {/* Header với trạng thái */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cuộc hẹn #{appointment.id}
            </h3>
            <p className="text-sm text-gray-500">
              Tạo lúc {formatDateTime(appointment.createdAt)}
            </p>
          </div>
          <StatusBadge 
            status={appointment.status} 
            variant={getStatusColor(appointment.status)} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin người hiến máu */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="flex items-center text-md font-medium text-gray-900 mb-3">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Thông tin người hiến máu
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Họ và tên:</label>
                <p className="text-sm text-gray-900">{appointment.donor?.fullName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-gray-400" />
                  {appointment.donor?.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-gray-400" />
                  {appointment.donor?.phone || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nhóm máu:</label>
                <p className="text-sm font-semibold text-red-600 flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  {appointment.donor?.bloodType || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin lịch hẹn */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="flex items-center text-md font-medium text-gray-900 mb-3">
              <Calendar className="w-5 h-5 mr-2 text-green-500" />
              Thông tin lịch hẹn
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày hẹn:</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                  {appointment.appointmentDate ? formatDate(parseBackendDate(appointment.appointmentDate)) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Địa điểm:</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {appointment.location || 'Trung tâm hiến máu chính'}
                </p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        {appointment.notes && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="flex items-center text-md font-medium text-gray-900 mb-2">
              <FileText className="w-5 h-5 mr-2 text-yellow-500" />
              Ghi chú
            </h4>
            <p className="text-sm text-gray-700">{appointment.notes}</p>
          </div>
        )}

        {/* Lịch sử thay đổi */}
        {appointment.history && appointment.history.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Lịch sử thay đổi
            </h4>
            <div className="space-y-2">
              {appointment.history.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.action}</span>
                  <span className="text-gray-500">{formatDateTime(item.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentDetailModal;
