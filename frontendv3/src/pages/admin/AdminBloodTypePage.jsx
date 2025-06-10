import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

import bloodTypeService from '../../services/bloodTypeService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BloodTypeFormModal from '../../components/admin/BloodTypeFormModal';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';

const AdminBloodTypePage = () => {
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedBloodType, setSelectedBloodType] = useState(null);
    const [bloodTypeIdToDelete, setBloodTypeIdToDelete] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
    });
    const [sort, setSort] = useState({ field: 'id', direction: 'asc' });

    const fetchBloodTypes = useCallback(async (page = 0) => {
        setIsLoading(true);
        try {
            // SỬA LẠI LỜI GỌI HÀM TẠI ĐÂY
            const data = await bloodTypeService.getAll(page, 10, [`${sort.field},${sort.direction}`]);
            setBloodTypes(data.content || []);
            setPagination({
                currentPage: data.number,
                totalPages: data.totalPages,
                totalItems: data.totalElements,
            });
        } catch (error) {
            toast.error(`Lỗi khi tải danh sách nhóm máu: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [sort]);

    useEffect(() => {
        fetchBloodTypes(pagination.currentPage);
    }, [fetchBloodTypes, pagination.currentPage]);

    const handleOpenModal = (bloodType = null) => {
        setSelectedBloodType(bloodType);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBloodType(null);
    };

    const handleSave = () => {
        handleCloseModal();
        fetchBloodTypes(pagination.currentPage); // Tải lại trang hiện tại
    };

    const confirmDelete = (id) => {
        setBloodTypeIdToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (bloodTypeIdToDelete) {
            const toastId = toast.loading('Đang xóa...');
            try {
                // SỬA LẠI LỜI GỌI HÀM TẠI ĐÂY
                await bloodTypeService.delete(bloodTypeIdToDelete);
                toast.success('Xóa nhóm máu thành công!', { id: toastId });
                setBloodTypeIdToDelete(null);
                setIsDeleteConfirmOpen(false);
                fetchBloodTypes(); // Tải lại danh sách từ trang đầu
            } catch (error) {
                toast.error(`Xóa thất bại: ${error.message}`, { id: toastId });
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Nhóm Máu</h1>
                <Button onClick={() => handleOpenModal()} variant="primary">
                    <Plus size={20} className="mr-2" />
                    Thêm Nhóm Máu
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhóm Máu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành Phần</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bloodTypes.map((bloodType) => (
                                    <tr key={bloodType.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bloodType.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bloodType.bloodGroup}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bloodType.componentType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{bloodType.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                            <div className="flex justify-end items-center space-x-2">
                                                <Button variant="icon" onClick={() => handleOpenModal(bloodType)} className="text-blue-600 hover:text-blue-800">
                                                    <Edit size={18} />
                                                </Button>
                                                <Button variant="icon" onClick={() => confirmDelete(bloodType.id)} className="text-red-600 hover:text-red-800">
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {bloodTypes.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Không tìm thấy dữ liệu nhóm máu.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => fetchBloodTypes(page)}
                        />
                    )}
                </>
            )}

            {isModalOpen && (
                <BloodTypeFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    bloodTypeData={selectedBloodType}
                />
            )}

            <Modal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title="Xác nhận xóa"
            >
                <p>Bạn có chắc chắn muốn xóa nhóm máu này không? Hành động này không thể hoàn tác.</p>
                <div className="flex justify-end space-x-3 mt-4">
                    <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminBloodTypePage;