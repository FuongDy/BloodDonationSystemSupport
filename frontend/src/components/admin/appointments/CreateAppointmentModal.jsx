// src/components/admin/appointments/CreateAppointmentModal.jsx
import React from 'react';
import toast from 'react-hot-toast';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import InputField from '../../common/InputField';
import { formatDateForInput, isDateTodayOrFuture } from '../../../utils/dateUtils';

const CreateAppointmentModal = ({
  isOpen,
  onClose,
  appointmentForm,
  setAppointmentForm,
  processes,
  onSubmit,
}) => {
  const handleInputChange = (field, value) => {
    setAppointmentForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!appointmentForm.processId) {
      toast.error('Vui lòng chọn quy trình hiến máu');
      return;
    }
    
    if (!appointmentForm.appointmentDate) {
      toast.error('Vui lòng chọn ngày hẹn');
      return;
    }
    
    // Kiểm tra ngày hẹn không được là quá khứ (cho phép hôm nay)
    // appointmentForm.appointmentDate ở đây là YYYY-MM-DD format từ HTML input
    const selectedDate = new Date(appointmentForm.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Ngày hẹn không được là ngày trong quá khứ');
      return;
    }
    
    // Kiểm tra ngày hẹn không quá xa (ví dụ: không quá 6 tháng)
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    if (selectedDate > sixMonthsFromNow) {
      toast.error('Ngày hẹn không được quá 6 tháng từ hiện tại');
      return;
    }
    
    if (!appointmentForm.location.trim()) {
      toast.error('Vui lòng nhập địa điểm');
      return;
    }
    
    console.log('Form data before submit:', appointmentForm);
    onSubmit();
  };

  // Get selected process info for display
  const selectedProcess = processes.find(p => p.id === Number(appointmentForm.processId));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <span>Tạo lịch hẹn mới</span>
          {processes.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {processes.length} quy trình chờ
            </span>
          )}
        </div>
      }
      size="md"
    >
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Chọn quy trình hiến máu <span className="text-red-500">*</span>
          </label>
          <select
            value={appointmentForm.processId}
            onChange={e => handleInputChange('processId', e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500'
            required
          >
            <option value=''>-- Chọn quy trình --</option>
            {processes.map(process => (
              <option key={process.id} value={process.id}>
                #{process.id} - {process.donor?.fullName || 'N/A'} 
                {process.bloodType?.bloodGroup && ` (${process.bloodType.bloodGroup})`}
                {process.donor?.email && ` - ${process.donor.email}`}
              </option>
            ))}
          </select>
          {processes.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Không có quy trình nào cần tạo lịch hẹn
            </p>
          )}
        </div>

        {/* Selected Process Info */}
        {selectedProcess && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Thông tin quy trình được chọn</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-700">Người hiến:</span>
                <span className="font-medium text-blue-900">{selectedProcess.donor?.fullName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Email:</span>
                <span className="font-medium text-blue-900">{selectedProcess.donor?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Nhóm máu:</span>
                <span className="font-medium text-blue-900">{selectedProcess.bloodType?.bloodGroup || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Trạng thái:</span>
                <span className="font-medium text-blue-900">{selectedProcess.status || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        <InputField
          label='Ngày hẹn'
          type='date'
          value={appointmentForm.appointmentDate}
          onChange={e => handleInputChange('appointmentDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
          required
        />

        <InputField
          label='Địa điểm'
          value={appointmentForm.location}
          placeholder='Bệnh viện Huyết học - FPT'
          onChange={e => handleInputChange('location', e.target.value)}
          required
          helpText="Địa điểm mặc định là bệnh viện chính"
        />

        <InputField
          label='Ghi chú'
          value={appointmentForm.notes}
          onChange={e => handleInputChange('notes', e.target.value)}
          placeholder='Nhập ghi chú (tùy chọn)...'
          helpText="Thông tin bổ sung cho lịch hẹn"
        />

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 Lưu ý khi tạo lịch hẹn</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Chỉ chọn ngày trong tương lai</li>
            <li>• Đảm bảo người hiến máu có thể đến đúng ngày hẹn</li>
            <li>• Kiểm tra tình trạng sức khỏe trước khi tạo lịch hẹn</li>
            <li>• Hệ thống sẽ tự động gửi thông báo cho người hiến máu</li>
          </ul>
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!appointmentForm.processId || !appointmentForm.appointmentDate}
          >
            Tạo lịch hẹn
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAppointmentModal;
