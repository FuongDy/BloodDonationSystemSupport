// src/components/admin/donationHistory/DonationDetailPanel.jsx
import React from 'react';
import StatusBadge from '../../common/StatusBadge';
import { HOSPITAL_INFO } from '../../../utils/constants';

const DonationDetailPanel = ({
  selectedDonation,
  onStatusUpdate: _onStatusUpdate,
  isModal = false
}) => {
  if (!selectedDonation) {
    if (isModal) {
      return (
        <div className="text-center text-gray-500 py-8">
          <p>Không có thông tin chi tiết</p>
        </div>
      );
    }
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Chọn một quy trình hiến máu để xem chi tiết
        </CardContent>
      </Card>
    );
  }

  const DetailContent = () => (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {selectedDonation.donor?.fullName || 'N/A'}
          </h3>
          <p className="text-sm text-gray-500">ID: #{selectedDonation.id}</p>
        </div>
        {selectedDonation.donor?.bloodType && (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
            Nhóm máu: {selectedDonation.donor.bloodType}
          </span>
        )}
      </div>

      {/* Grid layout for details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin người hiến */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2">Thông tin người hiến</h4>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Họ và tên:</label>
              <p className="text-sm text-gray-900">{selectedDonation.donor?.fullName || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email:</label>
              <p className="text-sm text-gray-900">{selectedDonation.donor?.email || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Số điện thoại:</label>
              <p className="text-sm text-gray-900">{selectedDonation.donor?.phone || 'Chưa cập nhật'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Địa chỉ:</label>
              <p className="text-sm text-gray-900">{selectedDonation.donor?.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>

        {/* Thông tin hiến máu */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2">Thông tin hiến máu</h4>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Trạng thái:</label>
              <div className="mt-1">
                <StatusBadge status={selectedDonation.status} type="donation" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Ngày tạo yêu cầu:</label>
              <p className="text-sm text-gray-900">
                {selectedDonation.createdAt ? new Date(selectedDonation.createdAt).toLocaleString('vi-VN') : 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Ngày cập nhật:</label>
              <p className="text-sm text-gray-900">
                {selectedDonation.updatedAt ? new Date(selectedDonation.updatedAt).toLocaleString('vi-VN') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch hẹn */}
      {selectedDonation.appointment && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-semibold text-gray-900">Thông tin lịch hẹn</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Thời gian hẹn:</label>
                <p className="text-sm text-gray-900">
                  {selectedDonation.appointment.appointmentDate ?
                    new Date(selectedDonation.appointment.appointmentDate).toLocaleDateString('vi-VN') : 'N/A'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Địa điểm:</label>
                <p className="text-sm text-gray-900">{HOSPITAL_INFO.FULL_NAME}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ghi chú */}
      {selectedDonation.note && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-semibold text-gray-900">Ghi chú</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-900">{selectedDonation.note}</p>
          </div>
        </div>
      )}
    </div>
  );

  // Nếu hiển thị trong modal, không cần Card wrapper
  if (isModal) {
    return <DetailContent />;
  }

  // Hiển thị bình thường với Card wrapper
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chi tiết hiến máu</CardTitle>
          {selectedDonation.donor?.bloodType && (
            <span className="ml-4 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
              Nhóm máu: {selectedDonation.donor.bloodType}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">ID: {selectedDonation.id}</div>
      </CardHeader>
      <CardContent>
        <DetailContent />
      </CardContent>
    </Card>
  );
};

export default DonationDetailPanel;
