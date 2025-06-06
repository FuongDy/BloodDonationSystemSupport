// src/pages/admin/AdminBloodTypePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import bloodTypeService from '../../services/bloodTypeService.js';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import BloodTypeFormModal from '../../components/admin/BloodTypeFormModal.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook

const AdminBloodTypePage = () => {
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBloodType, setEditingBloodType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth(); // Lấy user từ useAuth

    const fetchBloodTypes = useCallback(async (search) => {
        setIsLoading(true);
        try {
            const data = await bloodTypeService.getAll(search);
            setBloodTypes(data);
        } catch (error) {
            toast.error(`Lỗi khi tải danh sách: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBloodTypes(searchTerm);
    }, [searchTerm, fetchBloodTypes]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleOpenModal = (bloodType = null) => {
        // Chỉ cho phép Admin mở modal để chỉnh sửa/tạo mới
        if (user?.role !== 'Admin' && bloodType) { //
            toast.error("Bạn không có quyền chỉnh sửa loại máu.");
            return;
        }
        if (user?.role !== 'Admin' && !bloodType) { //
            toast.error("Bạn không có quyền thêm loại máu.");
            return;
        }
        setEditingBloodType(bloodType);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBloodType(null);
    };

    const handleSaveSuccess = () => {
        fetchBloodTypes(searchTerm);
        handleCloseModal();
    };

    const handleDelete = async (id, description) => {
        // Chỉ cho phép Admin xóa
        if (user?.role !== 'Admin') { //
            toast.error("Bạn không có quyền xóa loại máu.");
            return;
        }

        const displayName = description || `ID: ${id}`;
        if (window.confirm(`Bạn có chắc chắn muốn xóa loại máu "${displayName}" không?`)) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await bloodTypeService.delete(id);
                toast.success('Xóa thành công!', { id: toastId });
                fetchBloodTypes(searchTerm);
            } catch (error) {
                toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Loại máu</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => fetchBloodTypes(searchTerm)} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    {user?.role === 'Admin' && ( // Chỉ Admin mới được thêm loại máu
                        <Button onClick={() => handleOpenModal()} variant="primary" disabled={isLoading}>
                            <PlusCircle size={20} className="mr-2" /> Thêm loại máu
                        </Button>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm theo ID, nhóm máu, thành phần, mô tả..." />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-10"><LoadingSpinner size="12" /></div>
            ) : bloodTypes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Không có loại máu nào phù hợp.</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['ID', 'Nhóm máu', 'Thành phần', 'Mô tả', 'Hạn dùng (ngày)', 'Nhiệt độ (°C)', 'Thể tích (ml)', 'Hành động'].map(header => (
                                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bloodTypes.map((bt) => (
                                <tr key={bt.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bt.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{bt.bloodGroup}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bt.componentType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={bt.description}>{bt.description || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{bt.shelfLifeDays}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        {bt.storageTempMin !== null && bt.storageTempMax !== null ? `${bt.storageTempMin}°C -> ${bt.storageTempMax}°C` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{bt.volumeMl || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {user?.role === 'Admin' ? ( // Chỉ Admin mới được chỉnh sửa/xóa
                                            <>
                                                <Button onClick={() => handleOpenModal(bt)} variant="icon" className="text-indigo-600 hover:text-indigo-800" title="Chỉnh sửa">
                                                    <Edit3 size={18} />
                                                </Button>
                                                <Button onClick={() => handleDelete(bt.id, bt.description)} variant="icon" className="text-red-600 hover:text-red-800" title="Xóa">
                                                    <Trash2 size={18} />
                                                </Button>
                                            </>
                                        ) : ( // Hiển thị nút bị vô hiệu hóa cho các vai trò khác
                                            <>
                                                <Button variant="icon" className="text-gray-400 cursor-not-allowed" title="Không có quyền chỉnh sửa">
                                                    <Edit3 size={18} />
                                                </Button>
                                                <Button variant="icon" className="text-gray-400 cursor-not-allowed" title="Không có quyền xóa">
                                                    <Trash2 size={18} />
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && (
                <BloodTypeFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess}
                    bloodType={editingBloodType}
                />
            )}
        </div>
    );
};

export default AdminBloodTypePage;