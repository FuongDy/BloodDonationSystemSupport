// src/components/admin/appointments/RescheduleAppointmentModal.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import InputField from '../../common/InputField';
import { formatDateTime } from '../../../utils/formatters';

const RescheduleAppointmentModal = ({
  isOpen,
  onClose,
  selectedAppointment,
  rescheduleForm,
  setRescheduleForm,
  onSubmit,
}) => {
  const handleInputChange = (field, value) => {
    setRescheduleForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Yêu cầu đổi lịch hẹn'
    >
      <div className='space-y-4'>
        <div className='bg-yellow-50 p-3 rounded-lg border border-yellow-200'>
          <div className='flex items-center space-x-2'>
            <AlertTriangle size={16} className='text-yellow-600' />
            <span className='text-sm text-yellow-700'>
              Lịch hẹn hiện tại:{' '}
              {selectedAppointment?.appointment &&
                formatDateTime(
                  selectedAppointment.appointment.appointmentDateTime
                )}
            </span>
          </div>
        </div>

        <InputField
          label='Lý do đổi lịch'
          value={rescheduleForm.reason}
          onChange={e => handleInputChange('reason', e.target.value)}
          placeholder='Nhập lý do cần đổi lịch...'
          required
        />

        <InputField
          label='Đề xuất thời gian mới (tùy chọn)'
          type='datetime-local'
          value={rescheduleForm.suggestedDateTime}
          onChange={e => handleInputChange('suggestedDateTime', e.target.value)}
        />

        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button variant='warning' onClick={onSubmit}>
            Yêu cầu đổi lịch
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RescheduleAppointmentModal;
