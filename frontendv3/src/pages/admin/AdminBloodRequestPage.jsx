import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Droplet, RefreshCw } from 'lucide-react';
import bloodRequestService from '../../services/bloodRequestService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';

const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    FULFILLED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
};

const urgencyStyles = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-red-600',
    CRITICAL: 'text-red-800 font-bold',
};

const StatusBadge = ({ status }) => (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
    </span>
);

const AdminBloodRequestPage = () => {
    const [requestsPage, setRequestsPage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchRequests = useCallback(async (page = 0) => {
        setIsLoading(true);
        try {
            const response = await bloodRequestService.getAllBloodRequests(page, 10);
            setRequestsPage(response);
        } catch (error) {
            toast.error(`Không thể tải dữ liệu yêu cầu máu: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests(currentPage);
    }, [currentPage, fetchRequests]);

    const handleRefresh = () => {
        fetchRequests(currentPage);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    
    const formatDate = (dateString) => dateString ? format(new Date(dateString), 'dd/MM/yyyy') : 'N/A';

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Droplet size={24} className="mr-3 text-red-600" />
                    Quản Lý Yêu Cầu Máu
                </h1>
                <Button onClick={handleRefresh} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </Button>
            </div>

            {isLoading && !requestsPage ? (
                <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
            ) : requestsPage && requestsPage.content.length > 0 ? (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhóm máu</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng (đv)</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Độ khẩn cấp</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày yêu cầu</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requestsPage.content.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.patientName}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{req.bloodType.bloodGroup}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-700">{req.quantity}</td>
                                        <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${urgencyStyles[req.urgencyLevel]}`}>{req.urgencyLevel}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(req.requestDate)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap"><StatusBadge status={req.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {requestsPage.totalPages > 1 && (
                        <div className="mt-6"><Pagination currentPage={currentPage} totalPages={requestsPage.totalPages} onPageChange={handlePageChange} /></div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500 py-10">Không có yêu cầu máu nào.</p>
            )}
        </div>
    );
};

export default AdminBloodRequestPage;