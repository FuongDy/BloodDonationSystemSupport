// src/components/appointments/RescheduleModal.jsx
import React from 'react';
import Modal from '../common/Modal';

const RescheduleModal = ({
  isOpen,
  onClose,
  rescheduleReason,
  setRescheduleReason,
  onConfirm,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className='p-4'>
        <h2 className='text-lg font-bold mb-2'>Yêu cầu đổi lịch</h2>
        <textarea
          className='w-full border rounded p-2 mb-4'
          rows={3}
          placeholder='Nhập lý do đổi lịch...'
          value={rescheduleReason}
          onChange={e => setRescheduleReason(e.target.value)}
        />
        <div className='flex justify-end space-x-2'>
          <button
            className='px-4 py-2 bg-gray-200 rounded'
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className='px-4 py-2 bg-blue-600 text-white rounded'
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RescheduleModal;
