// src/pages/admin/AdminUserEditPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

import userService from '../../services/userService';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminUserEditPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [roles, setRoles] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Sửa: Tách logic fetch và xử lý dữ liệu để dễ quản lý hơn
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Lấy tất cả dữ liệu cần thiết song song
            const [userData, rolesData, bloodTypesData] = await Promise.all([
                userService.getUserById(userId),
                userService.getRoles(),
                userService.getBloodTypes()
            ]);

            setRoles(rolesData || []);
            setBloodTypes(bloodTypesData || []);

            // Tìm bloodTypeId từ bloodTypeDescription trả về
            const matchingBloodType = (bloodTypesData || []).find(bt => bt.description === userData.bloodTypeDescription);

            setFormData({
                fullName: userData.fullName || '',
                phone: userData.phone || '',
                address: userData.address || '',
                dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
                roleName: userData.role || 'Member', // role trả về là string
                status: userData.status || 'Active',
                emailVerified: userData.emailVerified || false,
                bloodTypeId: matchingBloodType ? matchingBloodType.id.toString() : '', // Chuyển sang string để khớp với value của option
            });

        } catch (error) {
            toast.error(`Lỗi khi tải dữ liệu người dùng: ${error.message}`);
            navigate('/admin/users');
        } finally {
            setIsLoading(false);
        }
    }, [userId, navigate]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Đang cập nhật...');

        const requestData = {
            ...formData,
            bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
        };

        try {
            await userService.updateUserByAdmin(userId, requestData);
            toast.success('Cập nhật người dùng thành công!', { id: toastId });
            navigate('/admin/users');
        } catch (error) {
            const errorMessage = error.message || 'Cập nhật thất bại.';
            toast.error(errorMessage, { id: toastId });
            if (error.response?.data && typeof error.response.data === 'object') {
                setErrors(prev => ({ ...prev, ...error.response.data }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !formData) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="12" /></div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Link to="/admin/users" className="flex items-center text-red-600 hover:text-red-800 mb-4">
                <ArrowLeft size={20} className="mr-2" />
                Quay lại danh sách
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh Sửa Thông Tin Người Dùng</h1>

            {/* Form để chỉnh sửa, bỏ qua các trường không thể sửa như username, email */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Thông tin chi tiết</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Họ và tên đầy đủ" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required error={errors.fullName} disabled={isSubmitting} />
                    <InputField label="Số điện thoại" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
                <InputField label="Địa chỉ" id="address" name="address" value={formData.address} onChange={handleInputChange} disabled={isSubmitting} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Ngày sinh" id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required error={errors.dateOfBirth} disabled={isSubmitting} />
                    <div>
                        <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
                        <select id="bloodTypeId" name="bloodTypeId" value={formData.bloodTypeId} onChange={handleInputChange} disabled={isSubmitting || bloodTypes.length === 0} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <option value="">-- Không có --</option>
                            {bloodTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.description}</option>)}
                        </select>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4 pt-4">Phân quyền & Trạng thái</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                        <select id="roleName" name="roleName" value={formData.roleName} onChange={handleInputChange} required disabled={isSubmitting || roles.length === 0} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
                        </select>
                        {errors.roleName && <p className="mt-1 text-xs text-red-600">{errors.roleName}</p>}
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select id="status" name="status" value={formData.status} onChange={handleInputChange} required disabled={isSubmitting} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center">
                    <input id="emailVerified" name="emailVerified" type="checkbox" checked={formData.emailVerified} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                    <label htmlFor="emailVerified" className="ml-2 block text-sm text-gray-900">Email đã được xác thực</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Link to="/admin/users">
                        <Button type="button" variant="secondary" disabled={isSubmitting}>
                            Hủy
                        </Button>
                    </Link>
                    <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                        <Save size={18} className="mr-2" />
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminUserEditPage;