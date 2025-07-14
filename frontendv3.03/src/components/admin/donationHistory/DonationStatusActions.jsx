// src/components/admin/donationHistory/DonationStatusActions.jsx
import React from 'react';
import Button from '../../common/Button';

const DonationStatusActions = ({ selectedDonation, onStatusUpdate }) => {
  const handleStatusUpdate = (newStatus) => {
    onStatusUpdate(selectedDonation.id, newStatus);
  };

  const renderActionsByStatus = () => {
    switch (selectedDonation.status) {
      case 'PENDING_APPROVAL':
        return (
          <div className="space-y-2">
            <Button
              size="sm"
              className="w-full"
              onClick={() => handleStatusUpdate('APPOINTMENT_PENDING')}
            >
              Duyệt đơn
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleStatusUpdate('REJECTED')}
            >
              Từ chối
            </Button>
          </div>
        );

      case 'APPOINTMENT_SCHEDULED':
        return (
          <Button
            size="sm"
            className="w-full"
            onClick={() => handleStatusUpdate('HEALTH_CHECK_PASSED')}
          >
            Khám sức khỏe đạt
          </Button>
        );

      case 'HEALTH_CHECK_PASSED':
        return (
          <Button
            size="sm"
            className="w-full"
            onClick={() => handleStatusUpdate('BLOOD_COLLECTED')}
          >
            Đã lấy máu
          </Button>
        );

      case 'BLOOD_COLLECTED':
        return (
          <div className="space-y-2">
            <Button
              size="sm"
              className="w-full"
              onClick={() => handleStatusUpdate('TESTING_PASSED')}
            >
              Xét nghiệm đạt
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleStatusUpdate('TESTING_FAILED')}
            >
              Xét nghiệm không đạt
            </Button>
          </div>
        );

      case 'TESTING_PASSED':
        return (
          <Button
            size="sm"
            className="w-full"
            onClick={() => handleStatusUpdate('COMPLETED')}
          >
            Hoàn thành
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium">Cập nhật trạng thái</h4>
      {renderActionsByStatus()}
    </div>
  );
};

export default DonationStatusActions;
