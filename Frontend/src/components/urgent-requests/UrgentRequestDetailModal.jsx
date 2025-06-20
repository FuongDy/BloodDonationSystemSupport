import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const UrgentRequestDetailModal = ({ request, onClose }) => {
  if (!request) {
    return null;
  }

  const handleRegisterClick = () => {
    // Logic for registering to donate
    console.log(`Registering to donate for ${request.patientName}`);
    onClose(); // Close modal after action
  };

  return (
    <Modal isOpen={!!request} onClose={onClose} title="Chi Tiết Yêu Cầu Máu Gấp">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{request.patientName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Bệnh viện:</strong> {request.hospitalName}</p>
          <p><strong>Nhóm máu:</strong> <span className="font-bold text-red-500">{request.bloodType}</span></p>
          <p><strong>Số lượng cần:</strong> {request.unitsRequired} đơn vị</p>
          <p><strong>Mức độ khẩn cấp:</strong> <span className="font-semibold text-yellow-500">{request.urgencyLevel}</span></p>
          <p className="md:col-span-2"><strong>Lý do:</strong> {request.reason}</p>
          <p className="md:col-span-2"><strong>Thông tin liên hệ:</strong> {request.contactInfo}</p>
          <p className="md:col-span-2"><strong>Ngày hết hạn:</strong> {new Date(request.deadline).toLocaleDateString('vi-VN')}</p>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-800 mb-4">
            Mỗi giọt máu cho đi là một cuộc đời ở lại. Hành động của bạn có thể cứu sống một mạng người.
          </p>
          <Button
            onClick={handleRegisterClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Đăng Ký Hiến Máu
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UrgentRequestDetailModal;
