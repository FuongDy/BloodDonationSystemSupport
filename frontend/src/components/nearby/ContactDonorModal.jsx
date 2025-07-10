// src/components/nearby/ContactDonorModal.jsx
import React from 'react';
import { X, User, Droplet, Phone, Mail } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InfoRow from '../common/InfoRow';

const ContactDonorModal = ({ donor, isOpen, onClose }) => {
    if (!isOpen || !donor) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center">
                    <User className="w-6 h-6 text-red-600 mr-3" />
                    <span>Thông tin liên hệ người hiến máu</span>
                </div>
            }
            size="md"
            footerContent={
                <Button variant="secondary" onClick={onClose}>
                    <X className="w-4 h-4 mr-2" />
                    Đóng
                </Button>
            }
        >
            <div className="p-4">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{donor.fullName}</h2>
                    <p className="text-lg text-red-600 font-semibold">{donor.bloodTypeDescription || donor.bloodType?.bloodGroup}</p>
                </div>
                <div className="space-y-4">
                    <InfoRow
                        icon={Phone}
                        label="Số điện thoại"
                        value={<a href={`tel:${donor.phone}`} className="text-blue-600 hover:underline">{donor.phone || 'Chưa cập nhật'}</a>}
                        labelClassName="font-semibold"
                    />
                    <InfoRow
                        icon={Mail}
                        label="Email"
                        value={<a href={`mailto:${donor.email}`} className="text-blue-600 hover:underline">{donor.email || 'Chưa cập nhật'}</a>}
                        labelClassName="font-semibold"
                    />
                </div>
                <div className="mt-6 p-3 bg-blue-50 rounded-md text-center">
                    <p className="text-xs text-blue-700">
                        💡 Vui lòng liên hệ với thái độ tôn trọng và lịch sự.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default ContactDonorModal;