// src/pages/admin/AdminBloodInventoryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Warehouse, Edit, PlusCircle, RefreshCw } from 'lucide-react';
import bloodTypeService from '../../services/bloodTypeService';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format } from 'date-fns';

const AdminBloodInventoryPage = () => {
    const [inventoryPage, setInventoryPage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchInventory = useCallback(async (page = 0) => {
        setIsLoading(true);
        try {
            // Lấy 10 mục mỗi trang
            const data = await bloodTypeService.getAll(page, 10, ['bloodGroup,asc']);
            setInventoryPage(data);
        } catch (error) {
            toast.error(`Không thể tải dữ liệu kho máu: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory(currentPage);
    }, [currentPage, fetchInventory]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRefresh = () => {
        fetchInventory(currentPage);
    };

    // Hàm định dạng ngày
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
                    <Warehouse size={24} className="mr-3 text-red-600" />
                    Quản Lý Kho Máu
                </h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleRefresh} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    <Button variant="primary" onClick={() => toast.success('Chức năng đang được phát triển!')}>
                        <PlusCircle size={20} className="mr-2" />
                        Cập nhật Kho
                    </Button>
                </div>
            </div>
            {isLoading && !inventoryPage ? (
                <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
            ) : inventoryPage && inventoryPage.content.length > 0 ? (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại máu</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số Lượng (đv)</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cập nhật cuối</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventoryPage.content.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-red-600">{item.description}</div>
                                            <div className="text-xs text-gray-500">{`Nhóm ${item.bloodGroup} - ${item.componentType}`}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 text-center font-semibold">{item.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{formatDate(item.lastUpdated)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Button variant="icon" className="text-blue-600" onClick={() => toast.success('Chức năng đang được phát triển!')}>
                                                <Edit size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {inventoryPage.totalPages > 1 && (
                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-sm text-gray-700">
                                Trang <span className="font-medium">{inventoryPage.number + 1}</span> / <span className="font-medium">{inventoryPage.totalPages}</span> ({inventoryPage.totalElements} loại)
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={inventoryPage.totalPages}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500 py-10">Không có dữ liệu trong kho.</p>
            )}
        </div>
    );
};

export default AdminBloodInventoryPage;