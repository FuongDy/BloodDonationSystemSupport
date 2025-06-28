// src/components/admin/DonationProcessModals.jsx
import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import HealthCheckForm from './HealthCheckForm';
import BloodCollectionForm from './BloodCollectionForm';
import TestResultForm from './TestResultForm';
import { DONATION_STATUS } from '../../utils/constants';

const DonationProcessModals = ({
  selectedProcess,
  modals,
  forms,
  onModalClose,
  onFormChange,
  onSubmit,
}) => {
  const {
    showStatusModal,
    showHealthCheckModal,
    showCollectionModal,
    showTestResultModal,
    showAppointmentModal,
  } = modals;

  const { statusForm, appointmentForm } = forms;

  return (
    <>
      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => onModalClose('status')}
        title='Cập nhật trạng thái'
      >
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Trạng thái mới
            </label>
            <select
              value={statusForm.newStatus}
              onChange={e =>
                onFormChange('status', 'newStatus', e.target.value)
              }
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500'
            >
              <option value=''>Chọn trạng thái</option>
              <option value={DONATION_STATUS.APPOINTMENT_PENDING}>
                Chờ đặt lịch hẹn
              </option>
              <option value={DONATION_STATUS.REJECTED}>Từ chối</option>
            </select>
          </div>
          <InputField
            label='Ghi chú'
            value={statusForm.note}
            onChange={e => onFormChange('status', 'note', e.target.value)}
            placeholder='Nhập ghi chú...'
          />
          <div className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => onModalClose('status')}>
              Hủy
            </Button>
            <Button onClick={() => onSubmit('status')}>Cập nhật</Button>
          </div>
        </div>
      </Modal>

      {/* Health Check Modal */}
      <HealthCheckForm
        processId={selectedProcess?.id}
        isOpen={showHealthCheckModal}
        onClose={() => onModalClose('healthCheck')}
        onSuccess={() => onSubmit('healthCheck')}
      />

      {/* Collection Modal */}
      <BloodCollectionForm
        processId={selectedProcess?.id}
        isOpen={showCollectionModal}
        onClose={() => onModalClose('collection')}
        onSuccess={() => onSubmit('collection')}
      />

      {/* Test Result Modal */}
      <TestResultForm
        processId={selectedProcess?.id}
        isOpen={showTestResultModal}
        onClose={() => onModalClose('testResult')}
        onSuccess={() => onSubmit('testResult')}
      />

      {/* Appointment Modal */}
      <Modal
        isOpen={showAppointmentModal}
        onClose={() => onModalClose('appointment')}
        title='Tạo lịch hẹn'
      >
        <div className='space-y-4'>
          <InputField
            label='Ngày giờ hẹn'
            type='datetime-local'
            value={appointmentForm.appointmentDateTime}
            onChange={e =>
              onFormChange('appointment', 'appointmentDateTime', e.target.value)
            }
          />
          <InputField
            label='Địa điểm'
            value={appointmentForm.location}
            onChange={e =>
              onFormChange('appointment', 'location', e.target.value)
            }
            placeholder='Bệnh viện Huyết học - FPT'
          />
          <InputField
            label='Ghi chú'
            value={appointmentForm.notes}
            onChange={e => onFormChange('appointment', 'notes', e.target.value)}
            placeholder='Nhập ghi chú...'
          />
          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              onClick={() => onModalClose('appointment')}
            >
              Hủy
            </Button>
            <Button onClick={() => onSubmit('appointment')}>
              Tạo lịch hẹn
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DonationProcessModals;
