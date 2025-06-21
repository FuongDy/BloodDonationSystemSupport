import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import urgentRequestService from '../../services/urgentRequestService';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const AdminUrgentRequestManagementPage = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      const response = await urgentRequestService.getPendingRequests();
      setPendingRequests(response.data);
    } catch (err) {
      setError('Không thể tải danh sách yêu cầu. Vui lòng thử lại.');
      toast.error('Không thể tải danh sách yêu cầu. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const openModal = (request, action) => {
    setSelectedRequest(request);
    setModalAction(action);
    setIsModalOpen(true);
    setRejectionReason('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setModalAction(null);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    try {
      await urgentRequestService.approveRequest(selectedRequest.id, user);
      toast.success(`Đã duyệt thành công yêu cầu #${selectedRequest.id}`);
      fetchPendingRequests(); // Refresh the list
      closeModal();
    } catch (err) {
      toast.error('Duyệt yêu cầu thất bại.');
      console.error(err);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason) {
        toast.warn('Vui lòng nhập lý do từ chối.');
        return;
    }
    try {
      await urgentRequestService.rejectRequest(selectedRequest.id, rejectionReason);
      toast.info(`Đã từ chối yêu cầu #${selectedRequest.id}`);
      fetchPendingRequests(); // Refresh the list
      closeModal();
    } catch (err) {
      toast.error('Từ chối yêu cầu thất bại.');
      console.error(err);
    }
  };

  const handleSubmit = () => {
    if (modalAction === 'approve') {
      handleApprove();
    } else if (modalAction === 'reject') {
      handleReject();
    }
  };

  const RequestCard = ({ request }) => (
    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{request.patientName} {request.isAnonymous && <span className="text-sm font-normal text-gray-500">(Ẩn danh)</span>}</h3>
          <p className="text-sm text-gray-500">Bệnh viện: {request.hospital}</p>
        </div>
        <span className={`font-semibold text-sm py-1 px-3 rounded-full ${request.urgency === 'Rất khẩn cấp' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {request.urgency}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <p><strong className="font-semibold">Nhóm máu:</strong> <span className="font-mono text-red-600 font-bold">{request.bloodType}</span></p>
        <p><strong className="font-semibold">Số lượng:</strong> {request.unitsNeeded} đơn vị</p>
        <p><strong className="font-semibold">Giới tính:</strong> {request.patientGender}</p>
        <p><strong className="font-semibold">Tuổi:</strong> {request.patientAge}</p>
        <p className="col-span-2"><strong className="font-semibold">Địa điểm:</strong> {request.location}</p>
        <p className="col-span-2"><strong className="font-semibold">SĐT liên hệ:</strong> {request.contactPhone}</p>
        <p className="col-span-2"><strong className="font-semibold">Lý do:</strong> {request.reason}</p>
        <p className="col-span-2 text-gray-500"><strong className="font-semibold">Người tạo:</strong> {request.createdBy}</p>
        <p className="col-span-2 text-gray-500"><strong className="font-semibold">Ngày tạo:</strong> {new Date(request.requestDate).toLocaleString()}</p>
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="danger" onClick={() => openModal(request, 'reject')}>
          <XCircle size={18} className="mr-2" />
          Từ chối
        </Button>
        <Button variant="success" onClick={() => openModal(request, 'approve')}>
          <CheckCircle size={18} className="mr-2" />
          Duyệt
        </Button>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Yêu cầu Khẩn cấp</h1>
      <p className="text-gray-600 mb-6">Duyệt hoặc từ chối các yêu cầu cần máu khẩn cấp đang chờ xử lý.</p>

      {pendingRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingRequests.map(req => <RequestCard key={req.id} request={req} />)}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Không có yêu cầu nào đang chờ</h2>
            <p className="text-gray-500 mt-2">Tất cả các yêu cầu khẩn cấp đã được xử lý. Quay lại sau để kiểm tra.</p>
        </div>
      )}

      {selectedRequest && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={`${modalAction === 'approve' ? 'Xác nhận Duyệt' : 'Xác nhận Từ chối'} Yêu cầu`}>
            <div className="p-2">
                <div className="flex items-center mb-4">
                    <AlertTriangle size={40} className={`${modalAction === 'approve' ? 'text-green-500' : 'text-red-500'} mr-3`} />
                    <p className="text-gray-700">
                        Bạn có chắc chắn muốn {modalAction === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu máu cho bệnh nhân 
                        <strong className="mx-1">{selectedRequest.patientName}</strong> 
                        tại <strong className="mx-1">{selectedRequest.hospital}</strong>?
                    </p>
                </div>

                {modalAction === 'reject' && (
                    <div>
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">Lý do từ chối <span className="text-red-500">*</span></label>
                        <textarea
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            rows="3"
                            placeholder="Ví dụ: Thông tin không hợp lệ, yêu cầu không đủ khẩn cấp..."
                        />
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={closeModal}>Hủy bỏ</Button>
                    <Button 
                        variant={modalAction === 'approve' ? 'success' : 'danger'} 
                        onClick={handleSubmit}
                        disabled={modalAction === 'reject' && !rejectionReason}
                    >
                        {modalAction === 'approve' ? 'Xác nhận Duyệt' : 'Xác nhận Từ chối'}
                    </Button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUrgentRequestManagementPage;
