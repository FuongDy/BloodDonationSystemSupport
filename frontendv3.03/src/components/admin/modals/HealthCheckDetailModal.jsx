// src/components/admin/modals/HealthCheckDetailModal.jsx
import React from 'react';
import { X, Activity, User, Heart, FileText, ClipboardCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import Modal from '../../common/Modal';
import StatusBadge from '../../common/StatusBadge';
import { formatDateTime } from '../../../utils/formatters';
import { DONATION_STATUS } from '../../../utils/constants';

const HealthCheckDetailModal = ({ 
  isOpen, 
  onClose, 
  healthCheck 
}) => {
  if (!healthCheck) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASSED':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      default:
        return 'default';
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'NORMAL':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ABNORMAL':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <ClipboardCheck className="w-4 h-4 text-gray-500" />;
    }
  };

  const healthCheckItems = [
    { key: 'weight', label: 'Cân nặng', unit: 'kg', category: 'physical' },
    { key: 'bloodPressureSystolic', label: 'Huyết áp tâm thu', unit: 'mmHg', category: 'vital' },
    { key: 'bloodPressureDiastolic', label: 'Huyết áp tâm trương', unit: 'mmHg', category: 'vital' },
    { key: 'heartRate', label: 'Nhịp tim', unit: 'bpm', category: 'vital' },
    { key: 'temperature', label: 'Nhiệt độ', unit: '°C', category: 'vital' },
    { key: 'hemoglobinLevel', label: 'Hemoglobin', unit: 'g/dL', category: 'blood' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết khám sức khỏe"
      size="large"
    >
      <div className="space-y-6">
        {/* Header với trạng thái */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Khám sức khỏe #{healthCheck.id}
            </h3>
            <p className="text-sm text-gray-500">
              Thực hiện lúc {formatDateTime(healthCheck.checkDate)}
            </p>
          </div>
          <StatusBadge 
            status={healthCheck.isEligible ? 'PASSED' : 'FAILED'} 
            variant={getStatusColor(healthCheck.isEligible ? 'PASSED' : 'FAILED')} 
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
                <p className="text-sm text-gray-900">
                  {healthCheck.donor?.fullName || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nhóm máu:</label>
                <p className="text-sm font-semibold text-red-600 flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  {healthCheck.donor?.bloodType || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày sinh:</label>
                <p className="text-sm text-gray-900">
                  {(() => {
                    const dateOfBirth = healthCheck.donor?.dateOfBirth;
                    return dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('vi-VN') : 'N/A';
                  })()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Giới tính:</label>
                <p className="text-sm text-gray-900">
                  {(() => {
                    const gender = healthCheck.donor?.gender;
                    if (gender === 'MALE') return 'Nam';
                    if (gender === 'FEMALE') return 'Nữ';
                    return gender || 'N/A';
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin bác sĩ khám */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="flex items-center text-md font-medium text-gray-900 mb-3">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              Thông tin bác sĩ khám
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Thời gian khám:</label>
                <p className="text-sm text-gray-900">{formatDateTime(healthCheck.checkDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Kết quả:</label>
                <p className={`text-sm font-medium ${healthCheck.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                  {healthCheck.isEligible ? '✓ Đạt tiêu chuẩn hiến máu' : '✗ Không đạt tiêu chuẩn hiến máu'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kết quả khám sức khỏe */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="flex items-center text-md font-medium text-gray-900 mb-4">
            <ClipboardCheck className="w-5 h-5 mr-2 text-purple-500" />
            Kết quả khám sức khỏe
          </h4>
          
          {/* Chỉ số sinh hiệu */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Chỉ số sinh hiệu</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Huyết áp - hiển thị combined */}
              {healthCheck.bloodPressureSystolic && healthCheck.bloodPressureDiastolic && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Huyết áp</span>
                    {getResultIcon('NORMAL')}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {healthCheck.bloodPressureSystolic}/{healthCheck.bloodPressureDiastolic}
                    <span className="text-sm text-gray-500 ml-1">mmHg</span>
                  </p>
                </div>
              )}
              
              {/* Các chỉ số vital khác */}
              {healthCheckItems.filter(item => item.category === 'vital' && !item.key.includes('bloodPressure')).map((item) => (
                <div key={item.key} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    {getResultIcon('NORMAL')}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {healthCheck[item.key] || 'N/A'} 
                    {healthCheck[item.key] && <span className="text-sm text-gray-500 ml-1">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chỉ số cơ thể */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Chỉ số cơ thể</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthCheckItems.filter(item => item.category === 'physical').map((item) => (
                <div key={item.key} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    {getResultIcon('NORMAL')}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {healthCheck[item.key] || 'N/A'} 
                    {healthCheck[item.key] && <span className="text-sm text-gray-500 ml-1">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Xét nghiệm máu */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Xét nghiệm máu cơ bản</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthCheckItems.filter(item => item.category === 'blood').map((item) => (
                <div key={item.key} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    {getResultIcon('NORMAL')}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {healthCheck[item.key] || 'N/A'} 
                    {healthCheck[item.key] && <span className="text-sm text-gray-500 ml-1">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kết luận và ghi chú */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="flex items-center text-md font-medium text-gray-900 mb-3">
            <FileText className="w-5 h-5 mr-2 text-indigo-500" />
            Kết luận và ghi chú
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Kết luận chung:</label>
              <p className={`text-sm font-medium ${healthCheck.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                {healthCheck.isEligible ? '✓ Đạt tiêu chuẩn hiến máu' : '✗ Không đạt tiêu chuẩn hiến máu'}
              </p>
            </div>
            {healthCheck.notes && (
              <div>
                <label className="text-sm font-medium text-gray-600">Ghi chú:</label>
                <p className="text-sm text-gray-700">{healthCheck.notes}</p>
              </div>
            )}
          </div>
        </div>

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

export default HealthCheckDetailModal;
