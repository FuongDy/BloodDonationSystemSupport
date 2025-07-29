// src/components/appointments/AppointmentDetailModal.jsx
import { Activity, Calendar, Clock, FileText, Hash, MapPin, User, Volume2, X } from 'lucide-react';
import Button from '../common/Button';
import DateTimeDisplay from '../common/DateTimeDisplay';

// Status and type utility functions (same as in AppointmentCard)
const getStatusInfo = (status) => {
  const statusMap = {
    'PENDING_APPROVAL': { label: 'Chờ phê duyệt', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    'REJECTED': { label: 'Bị từ chối', color: 'bg-red-100 text-red-800', icon: Activity },
    'APPOINTMENT_PENDING': { label: 'Chờ đặt lịch', color: 'bg-blue-100 text-blue-800', icon: Calendar },
    'APPOINTMENT_SCHEDULED': { label: 'Đã đặt lịch', color: 'bg-green-100 text-green-800', icon: Calendar },
    'RESCHEDULE_REQUESTED': { label: 'Yêu cầu đổi lịch', color: 'bg-orange-100 text-orange-800', icon: Clock },
    'HEALTH_CHECK_PASSED': { label: 'Khám sức khỏe đạt', color: 'bg-green-100 text-green-800', icon: Activity },
    'HEALTH_CHECK_FAILED': { label: 'Khám sức khỏe không đạt', color: 'bg-red-100 text-red-800', icon: Activity },
    'BLOOD_COLLECTED': { label: 'Đã lấy máu', color: 'bg-blue-100 text-blue-800', icon: Activity },
    'TESTING_PASSED': { label: 'Xét nghiệm đạt', color: 'bg-green-100 text-green-800', icon: Activity },
    'TESTING_FAILED': { label: 'Xét nghiệm không đạt', color: 'bg-red-100 text-red-800', icon: Activity },
    'COMPLETED': { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: Activity },
    'CANCELLED': { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800', icon: Activity }
  };
  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: Activity };
};

const getTypeInfo = (type) => {
  const typeMap = {
    'STANDARD': { label: 'Hiến máu thường', color: 'bg-blue-100 text-blue-800', description: 'Hiến máu theo lịch trình thường quy' },
    'EMERGENCY': { label: 'Hiến máu khẩn cấp', color: 'bg-red-100 text-red-800', description: 'Hiến máu đáp ứng yêu cầu khẩn cấp' }
  };
  return typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800', description: '' };
};

const AppointmentDetailModal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  const statusInfo = getStatusInfo(appointment.status);
  const typeInfo = getTypeInfo(appointment.donationType);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Chi tiết lịch hẹn #{appointment.id}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Type */}
          <div className="flex gap-3">
            <div className={`px-3 py-2 rounded-lg flex items-center gap-2 ${statusInfo.color}`}>
              <StatusIcon size={16} />
              <span className="font-medium">{statusInfo.label}</span>
            </div>
            {appointment.donationType && (
              <div className={`px-3 py-2 rounded-lg ${typeInfo.color}`}>
                <span className="font-medium">{typeInfo.label}</span>
              </div>
            )}
          </div>

          {/* Main Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Ngày và giờ hẹn</p>
                  {appointment.appointmentDate ? (
                    <DateTimeDisplay
                      date={appointment.appointmentDate}
                      format="full"
                      className="text-gray-600"
                    />
                  ) : (
                    <p className="text-gray-500 italic">Chưa có thông tin</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Địa điểm</p>
                  <p className="text-gray-600">{appointment.location || 'Chưa xác định'}</p>
                </div>
              </div>

              {appointment.staff && (
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Nhân viên phụ trách</p>
                    <p className="text-gray-600">{appointment.staff.fullName || appointment.staff.email || 'Chưa phân công'}</p>
                    {appointment.staff.email && appointment.staff.fullName && (
                      <p className="text-sm text-gray-500">{appointment.staff.email}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Thông tin định danh</p>
                  <p className="text-gray-600">Lịch hẹn #{appointment.id}</p>
                </div>
              </div>

              {appointment.collectedVolumeMl && (
                <div className="flex items-start space-x-3">
                  <Volume2 className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Lượng máu đã lấy</p>
                    <p className="text-gray-600">{appointment.collectedVolumeMl} ml</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Thời gian tạo</p>
                  {appointment.createdAt ? (
                    <DateTimeDisplay
                      date={appointment.createdAt}
                      format="full"
                      className="text-gray-600"
                    />
                  ) : (
                    <p className="text-gray-500 italic">Chưa có thông tin</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(appointment.notes || appointment.processNote) && (
            <div className="space-y-3">
              {appointment.notes && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Ghi chú lịch hẹn:</p>
                      <p className="text-blue-800">{appointment.notes}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* {appointment.processNote && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900 mb-1">Ghi chú quy trình:</p>
                      <p className="text-yellow-800">{appointment.processNote}</p>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          )}

          {/* Donation Type Description */}
          {typeInfo.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900 mb-1">Về loại hiến máu này:</p>
              <p className="text-gray-600">{typeInfo.description}</p>
            </div>
          )}

          {/* Timeline if needed - can be expanded */}
          {appointment.updatedAt && appointment.createdAt && appointment.updatedAt !== appointment.createdAt && (
            <div className="border-t pt-4">
              <p className="font-medium text-gray-900 mb-2">Thông tin cập nhật:</p>
              <div className="text-sm text-gray-600">
                <p>Lần cập nhật cuối: 
                  {appointment.updatedAt ? (
                    <DateTimeDisplay
                      date={appointment.updatedAt}
                      format="full"
                      className="ml-1"
                    />
                  ) : (
                    <span className="ml-1 text-gray-500 italic">Chưa có thông tin</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button
            variant="primary"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
