// src/components/admin/DonationProcessDetailModal.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import donationService from '../../services/donationService';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Calendar, CheckCircle, XCircle, Syringe, ClipboardPlus, TestTube2, Hourglass } from 'lucide-react';

// Component con để xử lý việc tạo lịch hẹn
const ScheduleAppointmentAction = ({ process, onActionSuccess }) => {
    const [appointmentDate, setAppointmentDate] = useState('');

    const handleSchedule = async () => {
        if (!appointmentDate) {
            toast.error('Vui lòng chọn ngày hẹn.');
            return;
        }
        try {
            await donationService.createAppointment({
                processId: process.id,
                appointmentDateTime: new Date(appointmentDate).toISOString(),
                location: 'Tại cơ sở y tế ABC' // Có thể thêm trường nhập liệu
            });
            toast.success('Đã tạo lịch hẹn thành công!');
            onActionSuccess();
        } catch (error) {
            toast.error(`Lỗi khi tạo lịch hẹn: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="mt-4 p-4 border-t">
            <h4 className="font-semibold text-md mb-2">Tạo Lịch Hẹn</h4>
            <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full p-2 border rounded-md"
            />
            <Button onClick={handleSchedule} className="mt-2 w-full" disabled={!appointmentDate}>
                <Calendar className="mr-2" size={16} /> Xác nhận Lịch Hẹn
            </Button>
        </div>
    );
};

const DonationProcessDetailModal = ({ process, isOpen, onClose, onUpdate }) => {
    if (!process) return null;

    const handleUpdateStatus = async (newStatus, note = 'Cập nhật bởi nhân viên') => {
        try {
            await donationService.updateProcessStatus(process.id, newStatus, note);
            toast.success(`Cập nhật trạng thái thành công: ${newStatus.replace(/_/g, ' ')}`);
            onUpdate(); // Gọi lại hàm fetch dữ liệu ở trang cha
            onClose(); // Đóng modal
        } catch (error) {
            toast.error(`Lỗi khi cập nhật: ${error.response?.data?.message || error.message}`);
        }
    };

    const formatDate = (dateString) => dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : 'N/A';

    const renderActions = () => {
        switch (process.status) {
            case 'PENDING_APPROVAL':
                return (
                    <div className="flex justify-end gap-2 mt-4 p-4 border-t">
                        <Button onClick={() => handleUpdateStatus('APPOINTMENT_PENDING')} variant="primary">
                            <CheckCircle className="mr-2" size={16} /> Chấp Thuận
                        </Button>
                        <Button onClick={() => handleUpdateStatus('REJECTED')} variant="danger">
                            <XCircle className="mr-2" size={16} /> Từ Chối
                        </Button>
                    </div>
                );
            case 'APPOINTMENT_PENDING':
                return <ScheduleAppointmentAction process={process} onActionSuccess={() => { onUpdate(); onClose(); }} />;
            case 'APPOINTMENT_SCHEDULED':
                return (
                    <div className="flex justify-end gap-2 mt-4 p-4 border-t">
                        <Button onClick={() => handleUpdateStatus('HEALTH_CHECK_PASSED')} variant="primary">
                            <ClipboardPlus className="mr-2" size={16} /> Đạt Yêu Cầu Sức Khỏe
                        </Button>
                        <Button onClick={() => handleUpdateStatus('HEALTH_CHECK_FAILED')} variant="danger">
                            <XCircle className="mr-2" size={16} /> Không Đạt Yêu Cầu
                        </Button>
                    </div>
                );
            case 'HEALTH_CHECK_PASSED':
                return (
                    <div className="flex justify-end gap-2 mt-4 p-4 border-t">
                        <Button onClick={() => donationService.markBloodAsCollected(process.id).then(onUpdate).then(onClose)} variant="primary">
                            <Syringe className="mr-2" size={16} /> Xác Nhận Lấy Máu
                        </Button>
                    </div>
                );
            case 'BLOOD_COLLECTED':
                return (
                    <div className="flex justify-end gap-2 mt-4 p-4 border-t">
                        <Button onClick={() => handleUpdateStatus('TESTING_PASSED')} variant="primary">
                            <TestTube2 className="mr-2" size={16} /> Xét Nghiệm Đạt
                        </Button>
                        <Button onClick={() => handleUpdateStatus('TESTING_FAILED')} variant="danger">
                            <XCircle className="mr-2" size={16} /> Xét Nghiệm Không Đạt
                        </Button>
                    </div>
                );
            default:
                return <div className="text-center text-gray-500 p-4 border-t"><Hourglass size={16} className="inline mr-2" />Không có hành động nào</div>;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Chi Tiết Quy Trình #${process.id}`}>
            <div className="p-2">
                <div className="grid grid-cols-2 gap-4">
                    <div><strong>Người hiến:</strong> {process.donor.fullName}</div>
                    <div><strong>Email:</strong> {process.donor.email}</div>
                    <div><strong>Nhóm máu:</strong> {process.donor.bloodType?.name || 'Chưa cập nhật'}</div>
                    <div><strong>Trạng thái:</strong> <span className="font-semibold text-blue-600">{process.status.replace(/_/g, ' ')}</span></div>
                    <div><strong>Ngày tạo:</strong> {formatDate(process.createdAt)}</div>
                    <div><strong>Lịch hẹn:</strong> {process.appointment ? formatDate(process.appointment.appointmentDateTime) : 'Chưa có'}</div>
                </div>
                {/* Thêm các thông tin chi tiết khác nếu có, ví dụ: kết quả khám, xét nghiệm... */}
            </div>
            {renderActions()}
        </Modal>
    );
};

export default DonationProcessDetailModal;