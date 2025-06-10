import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ClipboardList, RefreshCw } from 'lucide-react';
import donationService from '../../services/donationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';
import DonationProcessDetailModal from '../../components/admin/DonationProcessDetailModal';

const statusStyles = {
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-100 text-red-800',
    APPOINTMENT_PENDING: 'bg-blue-100 text-blue-800',
    APPOINTMENT_SCHEDULED: 'bg-cyan-100 text-cyan-800',
    HEALTH_CHECK_PASSED: 'bg-teal-100 text-teal-800',
    HEALTH_CHECK_FAILED: 'bg-red-100 text-red-800',
    BLOOD_COLLECTED: 'bg-indigo-100 text-indigo-800',
    TESTING_PASSED: 'bg-green-100 text-green-800',
    TESTING_FAILED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-green-200 text-green-900 font-bold',
    CANCELLED: 'bg-gray-100 text-gray-800',
};

const StatusBadge = ({ status }) => (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
);

const AdminDonationProcessPage = () => {
    const [processesPage, setProcessesPage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);

    const fetchProcesses = useCallback(async (page = 0) => {
        setIsLoading(true);
        try {
            const response = await donationService.getAllDonationProcesses(page, 10);
            setProcessesPage(response);
        } catch (error) {
            toast.error(`Không thể tải dữ liệu quy trình: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProcesses(currentPage);
    }, [currentPage, fetchProcesses]);

    const handleRefresh = () => {
        fetchProcesses(currentPage);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleOpenModal = (process) => {
        setSelectedProcess(process);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedProcess(null);
        setIsModalOpen(false);
    };

    const handleUpdateSuccess = () => {
        handleCloseModal();
        toast.success("Cập nhật quy trình thành công!");
        fetchProcesses(currentPage);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <ClipboardList size={24} className="mr-3 text-red-600" />
                    Quản Lý Quy Trình Hiến Máu
                </h1>
                <Button onClick={handleRefresh} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </Button>
            </div>

            {isLoading && !processesPage ? (
                <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
            ) : processesPage && processesPage.content.length > 0 ? (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người Hiến</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng Thái</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lịch Hẹn</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày Tạo</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {processesPage.content.map((process) => (
                                    <tr key={process.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{process.donor?.fullName}</div>
                                            <div className="text-xs text-gray-500">{process.donor?.email}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap"><StatusBadge status={process.status} /></td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {process.appointment ? formatDate(process.appointment.appointmentDateTime) : 'Chưa có'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(process.createdAt)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <Button size="sm" onClick={() => handleOpenModal(process)}>Xem Chi Tiết</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {processesPage.totalPages > 1 && (
                        <div className="mt-6"><Pagination currentPage={currentPage} totalPages={processesPage.totalPages} onPageChange={handlePageChange} /></div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500 py-10">Không có quy trình nào.</p>
            )}

            {selectedProcess && (
                <DonationProcessDetailModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateSuccess}
                    process={selectedProcess}
                />
            )}
        </div>
    );
};

export default AdminDonationProcessPage;