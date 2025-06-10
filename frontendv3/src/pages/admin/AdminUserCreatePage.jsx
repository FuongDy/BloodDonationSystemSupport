// src/pages/admin/AdminUserCreatePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';

import userService from '../../services/userService';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminUserCreatePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        dateOfBirth: '',
        bloodTypeId: '',
        roleName: 'Member', // Mặc định là Member
        status: 'Active',
        emailVerified: false,
    });
    const [roles, setRoles] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch dữ liệu cần thiết cho dropdowns (roles, blood types)
    const fetchRequiredData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [rolesData, bloodTypesData] = await Promise.all([
                userService.getRoles(),
                userService.getBloodTypes()
            ]);
            setRoles(rolesData || []);
            setBloodTypes(bloodTypesData || []);
        } catch (error) {
            toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequiredData();
    }, [fetchRequiredData]);

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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Họ tên không được để trống.";
        if (!formData.username.trim()) newErrors.username = "Tên đăng nhập không được để trống.";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email không hợp lệ.";
        if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        if (!formData.roleName) newErrors.roleName = "Vai trò không được để trống.";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Ngày sinh không được để trống.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin đã nhập.");
            return;
        }
        setIsSubmitting(true);
        const toastId = toast.loading("Đang tạo người dùng mới...");

        const requestData = {
            ...formData,
            bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
        };

        try {
            await userService.createUserByAdmin(requestData);
            toast.success("Tạo người dùng thành công!", { id: toastId });
            navigate('/admin/users');
        } catch (error) {
            const errorMessage = error.message || 'Tạo người dùng thất bại. Vui lòng thử lại.';
            toast.error(errorMessage, { id: toastId });
            // Hiển thị lỗi từ backend nếu có (ví dụ: email/username đã tồn tại)
            if (error.response?.data && typeof error.response.data === 'object') {
                setErrors(prev => ({ ...prev, ...error.response.data }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="12" /></div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Link to="/admin/users" className="flex items-center text-red-600 hover:text-red-800 mb-4">
                <ArrowLeft size={20} className="mr-2" />
                Quay lại danh sách
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <UserPlus size={24} className="mr-3" /> Tạo Người Dùng Mới
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Thông tin đăng nhập</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Tên đăng nhập" id="username" name="username" value={formData.username} onChange={handleInputChange} required error={errors.username} disabled={isSubmitting} />
                    <InputField label="Mật khẩu" id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required error={errors.password} disabled={isSubmitting} />
                </div>
                <InputField label="Địa chỉ Email" id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required error={errors.email} disabled={isSubmitting} />

                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4 pt-4">Thông tin chi tiết</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Họ và tên đầy đủ" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required error={errors.fullName} disabled={isSubmitting} />
                    <InputField label="Số điện thoại" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Ngày sinh" id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required error={errors.dateOfBirth} disabled={isSubmitting} />
                    <div>
                        <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
                        <select id="bloodTypeId" name="bloodTypeId" value={formData.bloodTypeId} onChange={handleInputChange} disabled={isSubmitting || bloodTypes.length === 0} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <option value="">-- Chọn nhóm máu (Tùy chọn) --</option>
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
                        Tạo người dùng
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminUserCreatePage;