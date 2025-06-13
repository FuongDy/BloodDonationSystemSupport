// src/pages/admin/AdminBloodTypePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, RefreshCw, Edit3, Trash2, Droplets, Info } from 'lucide-react'; // Added Info
import toast from 'react-hot-toast';
import bloodTypeService from '../../services/bloodTypeService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BloodTypeFormModal from '../../components/admin/BloodTypeFormModal';

const BLOOD_GROUP_TABS = ["Tất cả", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AdminBloodTypePage = () => {
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBloodType, setEditingBloodType] = useState(null);
    const [activeTab, setActiveTab] = useState(BLOOD_GROUP_TABS[0]);

    const fetchBloodTypes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await bloodTypeService.getAll();
            setBloodTypes(data || []); // Ensure bloodTypes is always an array
        } catch (error) {
            toast.error(`Lỗi khi tải danh sách loại máu: ${error.message}`);
            setBloodTypes([]); // Set to empty array on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBloodTypes();
    }, [fetchBloodTypes]);

    const handleOpenModal = (bloodType = null) => {
        setEditingBloodType(bloodType);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBloodType(null);
    };

    const handleSaveSuccess = () => {
        fetchBloodTypes();
        handleCloseModal();
    };

    const handleDelete = async (id, description) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa loại máu "${description}" (ID: ${id}) không?`)) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await bloodTypeService.delete(id);
                toast.success('Xóa thành công!', { id: toastId });
                fetchBloodTypes();
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    toast.error(`Lỗi khi xóa: Không tìm thấy loại máu.`, { id: toastId });
                } else {
                    toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
                }
            }
        }
    };

    const filteredBloodTypes = bloodTypes.filter(bt => {
        if (activeTab === "Tất cả") return true;
        const tabBloodGroup = activeTab.slice(0, -1);
        const tabRhFactor = activeTab.slice(-1);
        if (activeTab === "O+" || activeTab === "O-") { // Handle O group which might not have length 2 for group part
             return bt.bloodGroup === "O" && bt.rhFactor === tabRhFactor;
        }
        if (activeTab.includes("AB")) { // Handle AB group
            return bt.bloodGroup === "AB" && bt.rhFactor === tabRhFactor;
        }
        return bt.bloodGroup === tabBloodGroup && bt.rhFactor === tabRhFactor;
    });

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-slate-700 mb-4 sm:mb-0">Quản lý Loại máu</h1>
                    <div className="flex items-center space-x-2">
                        <Button onClick={fetchBloodTypes} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                        </Button>
                        <Button onClick={() => handleOpenModal()} variant="primary" disabled={isLoading}>
                            <PlusCircle size={20} className="mr-2" /> Thêm loại máu
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                        {BLOOD_GROUP_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors
                                    ${activeTab === tab
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <LoadingSpinner size="12" />
                    </div>
                ) : bloodTypes.length === 0 ? ( // Initial empty state for all blood types
                    <div className="text-center py-12">
                        <Droplets size={48} className="mx-auto text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-600 mb-2">Chưa có loại máu nào</h3>
                        <p className="text-slate-500 mb-6">
                            Hãy bắt đầu bằng cách thêm loại máu đầu tiên vào hệ thống.
                        </p>
                        <Button onClick={() => handleOpenModal()} variant="primary" disabled={isLoading}>
                            <PlusCircle size={20} className="mr-2" /> Thêm loại máu mới
                        </Button>
                    </div>
                ) : filteredBloodTypes.length === 0 ? ( // Empty state for the current filter
                    <div className="text-center py-10">
                        <Info size={40} className="mx-auto text-slate-400 mb-3" />
                        <p className="text-slate-500 text-lg">
                            Không tìm thấy loại máu nào cho bộ lọc "{activeTab}".
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBloodTypes.map((bt) => (
                            <div key={bt.id} className="bg-slate-50 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold text-slate-800">{bt.description}</h3>
                                    <div className="flex space-x-1">
                                        <Button onClick={() => handleOpenModal(bt)} variant="icon" size="sm" className="text-sky-600 hover:text-sky-800" title="Chỉnh sửa">
                                            <Edit3 size={16} />
                                        </Button>
                                        <Button onClick={() => handleDelete(bt.id, bt.description)} variant="icon" size="sm" className="text-red-600 hover:text-red-800" title="Xóa">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">Nhóm: <span className="font-medium text-slate-700">{bt.bloodGroup}</span></p>
                                <p className="text-sm text-slate-600">Yếu tố Rh: <span className="font-medium text-slate-700">{bt.rhFactor}</span></p>
                                {/* Removed Created At Date */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
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
