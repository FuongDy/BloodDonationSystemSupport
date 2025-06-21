// src/pages/CreateUrgentRequestPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PlusCircle, ArrowLeft } from 'lucide-react';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient'; // Using apiClient directly for now
import userService from '../services/userService'; // To get blood types

const CreateUrgentRequestPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState({
        patientName: '',
        hospital: '',
        location: '',
        bloodTypeId: '',
        unitsRequired: '1', // Default to 1
        urgency: 'Khẩn cấp', // Default urgency
        reason: '',
        patientAge: '', // Add patientAge
        patientGender: 'Nam', // Add patientGender with default
        contactPhone: '', // Add contactPhone
        isPrivate: false, // Add isPrivate for hiding patient name
    });
    const [bloodTypes, setBloodTypes] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Authorization check
        if (!user || (user.role !== 'Admin' && user.role !== 'Staff')) {
            toast.error("Bạn không có quyền truy cập trang này.");
            navigate('/forbidden');
        }

        const fetchBloodTypes = async () => {
            try {
                const types = await userService.getBloodTypes();
                setBloodTypes(types);
            } catch (err) {
                toast.error("Không thể tải danh sách nhóm máu.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBloodTypes();
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.patientName.trim() && !formData.isPrivate) newErrors.patientName = "Tên bệnh nhân là bắt buộc (trừ khi ẩn danh).";
        if (!formData.hospital.trim()) newErrors.hospital = "Tên bệnh viện là bắt buộc.";
        if (!formData.location.trim()) newErrors.location = "Địa điểm là bắt buộc.";
        if (!formData.bloodTypeId) newErrors.bloodTypeId = "Vui lòng chọn nhóm máu.";
        if (!formData.unitsRequired || isNaN(formData.unitsRequired) || formData.unitsRequired <= 0) {
            newErrors.unitsRequired = "Số lượng đơn vị máu phải là một số dương.";
        }
        if (!formData.reason.trim()) newErrors.reason = "Lý do yêu cầu là bắt buộc.";
        if (!formData.contactPhone.trim()) newErrors.contactPhone = "Số điện thoại liên hệ là bắt buộc.";
        else if (!/^0\d{9}$/.test(formData.contactPhone)) newErrors.contactPhone = "Số điện thoại không hợp lệ.";
        if (formData.patientAge && (isNaN(formData.patientAge) || formData.patientAge <= 0)) {
            newErrors.patientAge = "Tuổi bệnh nhân phải là một số dương.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Vui lòng điền đầy đủ và chính xác các thông tin.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Đang tạo yêu cầu...");

        try {
            // In a real app, this would be a dedicated service function
            await apiClient.post('/urgent-requests', {
                ...formData,
                unitsRequired: parseInt(formData.unitsRequired, 10),
                // The backend should handle setting the request date
            });
            
            toast.success("Tạo yêu cầu khẩn cấp thành công!", { id: toastId });
            navigate('/urgent-requests');
        } catch (err) {
            toast.error(err.message || "Tạo yêu cầu thất bại. Vui lòng thử lại.", { id: toastId });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow flex justify-center items-center">
                    <LoadingSpinner size="lg" />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 pt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-2">
                        <ArrowLeft size={24} className="text-gray-600 mr-4 cursor-pointer hover:text-gray-900" onClick={() => navigate(-1)} />
                        <h1 className="text-3xl font-bold text-gray-800">Tạo yêu cầu khẩn cấp</h1>
                    </div>
                    <p className="text-gray-500 mb-6 ml-10">Sử dụng biểu mẫu này cho các trường hợp cần máu khẩn cấp. Yêu cầu sẽ được ưu tiên và thông báo đến tất cả người hiến máu có nhóm máu phù hợp trong khu vực.</p>
                    
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Patient Info */}
                            <div className="border-b pb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin bệnh nhân</h2>
                                <div className="flex items-center mb-4">
                                    <input 
                                        type="checkbox" 
                                        id="isPrivate" 
                                        name="isPrivate" 
                                        checked={formData.isPrivate} 
                                        onChange={handleInputChange} 
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-800">Giữ ẩn danh bệnh nhân</label>
                                </div>
                                <InputField
                                    label="Tên bệnh nhân"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên bệnh nhân"
                                    error={errors.patientName}
                                    disabled={isSubmitting || formData.isPrivate}
                                    helpText={!formData.isPrivate ? "Thông tin này sẽ hiển thị cho người hiến máu tiềm năng." : "Tên bệnh nhân sẽ được ẩn đi."}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Tuổi"
                                        name="patientAge"
                                        type="number"
                                        value={formData.patientAge}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tuổi"
                                        error={errors.patientAge}
                                        disabled={isSubmitting}
                                    />
                                    <div>
                                        <label htmlFor="patientGender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                        <select 
                                            name="patientGender" 
                                            id="patientGender"
                                            value={formData.patientGender} 
                                            onChange={handleInputChange} 
                                            disabled={isSubmitting}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        >
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Request Info */}
                            <div className="border-b pb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin yêu cầu máu</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu <span className="text-red-500">*</span></label>
                                        <select 
                                            name="bloodTypeId" 
                                            id="bloodTypeId"
                                            value={formData.bloodTypeId} 
                                            onChange={handleInputChange} 
                                            disabled={isSubmitting || bloodTypes.length === 0} 
                                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.bloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">-- Chọn nhóm máu --</option>
                                            {bloodTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.bloodGroup}{bt.rhFactor}</option>)}
                                        </select>
                                        {errors.bloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.bloodTypeId}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="unitsRequired" className="block text-sm font-medium text-gray-700 mb-1">Số đơn vị cần <span className="text-red-500">*</span></label>
                                        <select 
                                            name="unitsRequired" 
                                            id="unitsRequired"
                                            value={formData.unitsRequired} 
                                            onChange={handleInputChange} 
                                            disabled={isSubmitting}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        >
                                            {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1} đơn vị</option>)}
                                        </select>
                                        {errors.unitsRequired && <p className="mt-1 text-xs text-red-600">{errors.unitsRequired}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">Mức độ khẩn cấp <span className="text-red-500">*</span></label>
                                        <select 
                                            name="urgency" 
                                            id="urgency"
                                            value={formData.urgency} 
                                            onChange={handleInputChange} 
                                            disabled={isSubmitting}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        >
                                            <option value="Khẩn cấp">Khẩn cấp - Cần trong vài giờ</option>
                                            <option value="Rất khẩn cấp">Rất khẩn cấp - Cần ngay lập tức</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Location Info */}
                            <div className="border-b pb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin địa điểm</h2>
                                <InputField
                                    label="Bệnh viện/Cơ sở y tế"
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên bệnh viện"
                                    error={errors.hospital}
                                    required
                                    disabled={isSubmitting}
                                />
                                <InputField
                                    label="Địa điểm cụ thể"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: Quận 5, TP.HCM"
                                    error={errors.location}
                                    required
                                    disabled={isSubmitting}
                                />
                                <InputField
                                    label="Chi tiết bổ sung"
                                    name="reason"
                                    type="textarea"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    placeholder="Thêm thông tin chi tiết về trường hợp cần máu..."
                                    error={errors.reason}
                                    required
                                    disabled={isSubmitting}
                                    rows={3}
                                />
                            </div>

                            {/* Contact Info */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin liên hệ</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Người liên hệ"
                                        name="contactPerson"
                                        value={user?.fullName || 'Staff User'} // Automatically fill current user's name
                                        disabled // Disable editing
                                    />
                                    <InputField
                                        label="Số điện thoại liên hệ"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số điện thoại liên hệ"
                                        error={errors.contactPhone}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Submission */}
                            <div className="flex flex-col items-center justify-center pt-6">
                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="confirmation" name="confirmation" required className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                                    <label htmlFor="confirmation" className="ml-2 block text-sm text-gray-800">Tôi xác nhận đây là một yêu cầu khẩn cấp thật sự và tất cả thông tin cung cấp là chính xác.</label>
                                </div>
                                <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} disabled={isSubmitting}>
                                    <PlusCircle size={20} className="mr-2" />
                                    Gửi yêu cầu khẩn cấp
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateUrgentRequestPage;
