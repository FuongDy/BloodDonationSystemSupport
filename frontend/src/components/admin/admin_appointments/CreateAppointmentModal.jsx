// src/components/admin/appointments/CreateAppointmentModal.jsx
import React from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import InputField from '../../common/InputField';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Tạo lịch hẹn mới'
    >
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Chọn quy trình hiến máu
          </label>
          <select
            value={appointmentForm.processId}
            onChange={e => handleInputChange('processId', e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500'
          >
            <option value=''>Chọn quy trình</option>
            {processes.map(process => (
              <option key={process.id} value={process.id}>
                #{process.id} - {process.donor?.fullName} (
                {process.donor?.email})
              </option>
            ))}
          </select>
        </div>

        <InputField
          label='Ngày giờ hẹn'
          type='datetime-local'
          value={appointmentForm.appointmentDateTime}
          onChange={e => handleInputChange('appointmentDateTime', e.target.value)}
          required
        />

        <InputField
          label='Địa điểm'
          value={appointmentForm.location}
          onChange={e => handleInputChange('location', e.target.value)}
          placeholder='Bệnh viện Huyết học - FPT'
          required
        />

        <InputField
          label='Ghi chú'
          value={appointmentForm.notes}
          onChange={e => handleInputChange('notes', e.target.value)}
          placeholder='Nhập ghi chú (tùy chọn)...'
        />

        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>Tạo lịch hẹn</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAppointmentModal;
