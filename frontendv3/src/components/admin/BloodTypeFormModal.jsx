import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { toast } from 'react-hot-toast'; // SỬA: Thay đổi import từ react-toastify sang react-hot-toast
import bloodTypeService from '../../services/bloodTypeService';
import { useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';

// THÊM: Định nghĩa các tùy chọn cho thành phần máu
const componentTypeOptions = [
    'Toàn phần',
    'Hồng cầu',
    'Tiểu cầu',
    'Huyết tương',
];

const BloodTypeFormModal = ({ isOpen, onClose, onSaveSuccess, bloodType }) => { 
    const initialFormData = {
        bloodGroup: '',
        componentType: 'Toàn phần', // SỬA: Đồng bộ giá trị mặc định
        description: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const isEditMode = !!bloodType;
    const canManageAll = user?.role === 'Admin';
    // Logic quyền: Admin được làm tất cả, Staff chỉ được sửa mô tả của loại máu đã có
    const canUpdateDescription = user?.role === 'Admin' || (user?.role === 'Staff' && isEditMode);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && bloodType) {
                setFormData({
                    bloodGroup: bloodType.bloodGroup || '',
                    componentType: bloodType.componentType || 'Toàn phần',
                    description: bloodType.description || '',
                });
            } else {
                setFormData(initialFormData);
            }
            setErrors({});
        }
    }, [isOpen, bloodType, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.bloodGroup.trim()) newErrors.bloodGroup = "Nhóm máu không được để trống.";
        if (!formData.componentType) newErrors.componentType = "Thành phần máu không được để trống.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Kiểm tra quyền trước khi gửi request
        if (!canManageAll && !isEditMode) {
            toast.error("Bạn không có quyền tạo mới loại máu.");
            return;
        }

        setIsLoading(true);
        try {
            let response;
            if (isEditMode) {
                // Khi sửa, chỉ cho phép cập nhật mô tả theo logic quyền
                const updatePayload = {
                    description: formData.description,
                };
                response = await bloodTypeService.update(bloodType.id, updatePayload); 
                toast.success('Cập nhật loại máu thành công!');
            } else {
                // Khi tạo mới, chỉ Admin được phép
                response = await bloodTypeService.create(formData); 
                toast.success('Tạo mới loại máu thành công!');
            }
            // Cập nhật lại danh sách loại máu trên UI
            queryClient.invalidateQueries({ queryKey: ['bloodTypes'] });
            if (onSaveSuccess) onSaveSuccess(response);
            onClose(); // Đóng modal sau khi thành công
        } catch (error) {
            const errorMsg = error.response?.data?.message || `Thao tác thất bại: ${error.message}`;
            toast.error(errorMsg);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const modalFooter = (
        <>
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>Hủy</Button>
            <Button variant="primary" type="submit" form="bloodTypeForm" disabled={isLoading || (isEditMode ? !canUpdateDescription : !canManageAll)} isLoading={isLoading}>
                {isEditMode ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Chỉnh sửa loại máu" : "Thêm loại máu mới"} footerContent={modalFooter} size="lg">
            <form id="bloodTypeForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Nhóm máu (VD: A+, O-)"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                        // Chỉ Admin có thể nhập khi tạo mới, không thể sửa sau khi đã tạo
                        disabled={isLoading || isEditMode || !canManageAll}
                        error={errors.bloodGroup}
                    />
                    <div>
                        <label htmlFor="componentType" className="block text-sm font-medium text-gray-700 mb-1">Thành phần máu</label>
                        <select
                            id="componentType"
                            name="componentType"
                            value={formData.componentType}
                            onChange={handleChange}
                            // Chỉ Admin có thể chọn khi tạo mới, không thể sửa sau khi đã tạo
                            disabled={isLoading || isEditMode || !canManageAll}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.componentType ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            {componentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        {errors.componentType && <p className="mt-1 text-xs text-red-600">{errors.componentType}</p>}
                    </div>
                </div>
                <InputField
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    // Admin hoặc Staff (khi sửa) có thể thay đổi mô tả
                    disabled={isLoading || !canUpdateDescription}
                    error={errors.description}
                />
            </form>
        </Modal>
    );
};

export default BloodTypeFormModal;