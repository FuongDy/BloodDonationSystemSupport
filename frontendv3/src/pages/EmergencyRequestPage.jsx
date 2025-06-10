// src/pages/EmergencyRequestPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import bloodRequestService from '../services/bloodRequestService';
import bloodTypeService from '../services/bloodTypeService';
import { useQuery } from '@tanstack/react-query';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { HeartPulse } from 'lucide-react';

const EmergencyRequestPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();

    const { data: bloodTypes, isLoading: isLoadingBloodTypes } = useQuery({
        queryKey: ['bloodTypes'],
        queryFn: () => bloodTypeService.getAllPublic().then(res => res.data.content || res.data)
    });

    const onSubmit = async (data) => {
        try {
            const requestData = {
                ...data,
                quantity: parseInt(data.quantity, 10),
                urgencyLevel: 'HIGH',
                latitude: 10.7769, 
                longitude: 106.7009
            };
            await bloodRequestService.createEmergencyRequest(requestData);
            toast.success('Đã gửi yêu cầu khẩn cấp thành công!');
            navigate('/');
        } catch (error) {
            toast.error(`Gửi yêu cầu thất bại: ${error.response?.data?.message || error.message}`);
        }
    };

    if (isLoadingBloodTypes) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center text-red-600 mb-6 flex items-center justify-center">
                <HeartPulse size={32} className="mr-3" /> Yêu Cầu Máu Khẩn Cấp
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <InputField
                    label="Tên bệnh nhân"
                    name="patientName"
                    register={register}
                    validation={{ required: 'Tên bệnh nhân là bắt buộc' }}
                    error={errors.patientName}
                />
                <InputField
                    label="Thông tin liên hệ (SĐT)"
                    name="contactNumber"
                    register={register}
                    validation={{ required: 'Số điện thoại là bắt buộc' }}
                    error={errors.contactNumber}
                />
                <InputField
                    label="Địa chỉ (Bệnh viện)"
                    name="location"
                    register={register}
                    validation={{ required: 'Địa chỉ là bắt buộc' }}
                    error={errors.location}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu cần</label>
                        <select
                            id="bloodTypeId"
                            {...register('bloodTypeId', { required: 'Vui lòng chọn nhóm máu' })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">-- Chọn nhóm máu --</option>
                            {bloodTypes?.map(bt => <option key={bt.id} value={bt.id}>{bt.name}</option>)}
                        </select>
                        {errors.bloodTypeId && <p className="text-red-500 text-xs mt-1">{errors.bloodTypeId.message}</p>}
                    </div>
                    <InputField
                        label="Số lượng (đơn vị)"
                        name="quantity"
                        type="number"
                        register={register}
                        validation={{ required: 'Số lượng là bắt buộc', min: { value: 1, message: 'Số lượng phải lớn hơn 0' } }}
                        error={errors.quantity}
                    />
                </div>

                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Lý do/Ghi chú</label>
                    <textarea
                        id="reason"
                        {...register('reason')}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    ></textarea>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                </Button>
            </form>
        </div>
    );
};

export default EmergencyRequestPage;