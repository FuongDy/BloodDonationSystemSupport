// src/pages/FindDonorsPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import bloodTypeService from '../services/bloodTypeService';
import bloodRequestService from '../services/bloodRequestService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Search, UserCheck } from 'lucide-react';

const FindDonorsPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { data: bloodTypes, isLoading: isLoadingBloodTypes } = useQuery({
        queryKey: ['bloodTypes'],
        queryFn: () => bloodTypeService.getAllPublic().then(res => res.data.content || res.data)
    });

    const mutation = useMutation({
        mutationFn: (searchParams) => bloodRequestService.findDonors(searchParams),
    });

    const onSubmit = (data) => {
        const searchParams = {
            bloodTypeId: data.bloodTypeId,
            distance: parseInt(data.distance, 10),
            latitude: 10.7769, // Lấy từ trình duyệt
            longitude: 106.7009 // Lấy từ trình duyệt
        };
        mutation.mutate(searchParams);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Tìm Người Hiến Máu</h1>
            <p className="text-center text-gray-500 mb-8">Tìm những người sẵn sàng hiến máu gần bạn.</p>

            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full">
                        <select
                            {...register('bloodTypeId', { required: true })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Tất cả nhóm máu</option>
                            {bloodTypes?.map(bt => <option key={bt.id} value={bt.id}>{bt.name}</option>)}
                        </select>
                    </div>
                    <div className="w-full">
                        <select
                            {...register('distance', { required: true })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="20">20 km</option>
                            <option value="50">50 km</option>
                        </select>
                    </div>
                    <Button type="submit" disabled={mutation.isLoading} className="w-full md:w-auto">
                        <Search size={18} className="mr-2" /> Tìm
                    </Button>
                </form>
            </div>

            <div className="mt-8">
                {mutation.isLoading && <div className="flex justify-center"><LoadingSpinner /></div>}
                {mutation.isError && <p className="text-center text-red-500">Lỗi: {mutation.error.message}</p>}
                {mutation.isSuccess && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mutation.data?.data.length === 0 ? (
                            <p className="col-span-full text-center text-gray-500">Không tìm thấy người hiến máu phù hợp.</p>
                        ) : (
                            mutation.data.data.map(user => (
                                <div key={user.id} className="p-4 bg-white rounded-lg shadow flex items-center gap-4">
                                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                                        <UserCheck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{user.fullName}</h3>
                                        <p className="text-sm text-gray-600">Sẵn sàng hiến máu</p>
                                        <p className="text-xs text-gray-500">Khoảng cách: ~{user.distance.toFixed(2)} km</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindDonorsPage;