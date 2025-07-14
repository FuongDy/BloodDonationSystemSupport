// src/components/admin/emergencyRequests/EmergencyDonorsModal.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import EmergencyPledgesList from '../emergency/EmergencyPledgesList';

const EmergencyDonorsModal = ({ isOpen, onClose, requestId, requestData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <Heart className="w-5 h-5 text-red-600 mr-2" />
          <span>Danh sách người hiến máu</span>
        </div>
      }
      size="large"
      footerContent={
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      }
    >
      <EmergencyPledgesList requestId={requestId} requestData={requestData} />
    </Modal>
  );
};

export default EmergencyDonorsModal;
