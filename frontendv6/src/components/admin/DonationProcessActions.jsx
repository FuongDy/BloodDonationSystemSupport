// src/components/admin/DonationProcessActions.jsx
import React from 'react';
import { Calendar, Edit3, Activity, Heart, TestTube } from 'lucide-react';
import Button from '../common/Button';
import { DONATION_STATUS } from '../../utils/constants';

const DonationProcessActions = ({ process, onActionClick }) => {
  const getActionButtons = donationProcess => {
    const actions = [];

    switch (donationProcess.status) {
      case DONATION_STATUS.PENDING_APPROVAL:
        actions.push({
          label: 'Duyệt/Từ chối',
          icon: Edit3,
          variant: 'outline',
          action: 'updateStatus',
        });
        break;

      case DONATION_STATUS.APPOINTMENT_PENDING:
        actions.push({
          label: 'Tạo lịch hẹn',
          icon: Calendar,
          variant: 'primary',
          action: 'createAppointment',
        });
        break;

      case DONATION_STATUS.APPOINTMENT_SCHEDULED:
        actions.push({
          label: 'Khám sàng lọc',
          icon: Activity,
          variant: 'info',
          action: 'healthCheck',
        });
        break;

      case DONATION_STATUS.HEALTH_CHECK_PASSED:
        actions.push({
          label: 'Lấy máu',
          icon: Heart,
          variant: 'success',
          action: 'bloodCollection',
        });
        break;

      case DONATION_STATUS.BLOOD_COLLECTED:
        actions.push({
          label: 'Kết quả xét nghiệm',
          icon: TestTube,
          variant: 'warning',
          action: 'testResult',
        });
        break;
    }

    return actions;
  };

  const actionButtons = getActionButtons(process);

  return (
    <div className='flex space-x-2'>
      {actionButtons.map((action, index) => (
        <Button
          key={index}
          size='sm'
          variant={action.variant}
          onClick={() => onActionClick(action.action, process)}
        >
          <action.icon size={16} className='mr-1' />
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default DonationProcessActions;
