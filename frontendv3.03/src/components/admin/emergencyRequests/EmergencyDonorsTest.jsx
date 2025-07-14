// src/components/admin/emergencyRequests/EmergencyDonorsTest.jsx
import React, { useState } from 'react';
import EmergencyDonorsModal from './EmergencyDonorsModal';
import Button from '../../common/Button';

const EmergencyDonorsTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock request data for testing
  const mockRequestData = {
    id: 1,
    patientName: 'Nguyễn Văn Test',
    bloodType: {
      bloodGroup: 'O+'
    },
    hospital: 'Bệnh viện Chợ Rẫy',
    quantityInUnits: 3,
    urgency: 'CRITICAL',
    description: 'Trường hợp khẩn cấp cần máu ngay'
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test Emergency Donors Modal</h2>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Thông tin yêu cầu test:</h3>
        <ul className="text-sm space-y-1">
          <li><strong>ID:</strong> {mockRequestData.id}</li>
          <li><strong>Bệnh nhân:</strong> {mockRequestData.patientName}</li>
          <li><strong>Nhóm máu:</strong> {mockRequestData.bloodType.bloodGroup}</li>
          <li><strong>Bệnh viện:</strong> {mockRequestData.hospital}</li>
          <li><strong>Số lượng:</strong> {mockRequestData.quantityInUnits} đơn vị</li>
        </ul>
      </div>
      
      <Button
        variant="primary"
        onClick={() => setIsModalOpen(true)}
      >
        Mở Modal Danh Sách Người Hiến Máu
      </Button>
      
      <EmergencyDonorsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestId={mockRequestData.id}
        requestData={mockRequestData}
      />
    </div>
  );
};

export default EmergencyDonorsTest;
