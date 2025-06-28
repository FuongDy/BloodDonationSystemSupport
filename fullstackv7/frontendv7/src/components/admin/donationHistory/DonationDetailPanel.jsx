// src/components/admin/donationHistory/DonationDetailPanel.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../ui/Card';
import StatusBadge from '../../common/StatusBadge';
import { HOSPITAL_INFO } from '../../../utils/constants';
import DonationStatusActions from './DonationStatusActions';

const DonationDetailPanel = ({ 
  selectedDonation, 
  onStatusUpdate 
}) => {
  if (!selectedDonation) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Chọn một quy trình hiến máu để xem chi tiết
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết hiến máu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">Người hiến máu</h4>
          <p className="text-sm text-gray-600">
            {selectedDonation.donor?.fullName}
          </p>
          <p className="text-sm text-gray-600">
            {selectedDonation.donor?.email}
          </p>
        </div>

        <div>
          <h4 className="font-medium">Trạng thái</h4>
          <StatusBadge
            status={selectedDonation.status}
            type="donation"
          />
        </div>

        {selectedDonation.appointment && (
          <div>
            <h4 className="font-medium">Lịch hẹn</h4>
            <p className="text-sm text-gray-600">
              {new Date(
                selectedDonation.appointment.appointmentDateTime
              ).toLocaleString('vi-VN')}
            </p>
            <p className="text-sm text-gray-600">
              {HOSPITAL_INFO.FULL_NAME}
            </p>
          </div>
        )}

        {selectedDonation.note && (
          <div>
            <h4 className="font-medium">Ghi chú</h4>
            <p className="text-sm text-gray-600">
              {selectedDonation.note}
            </p>
          </div>
        )}

        <DonationStatusActions
          selectedDonation={selectedDonation}
          onStatusUpdate={onStatusUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default DonationDetailPanel;
