import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

// Material-UI Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const ProfileDetailItem = ({ icon: Icon, label, value, highlight }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500 flex items-center">
            {Icon && <Icon sx={{ fontSize: 18, marginRight: '8px', color: highlight ? '#16a34a' : 'inherit' }} />}
            {label}
        </dt>
        <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${highlight ? 'font-semibold text-green-700' : 'text-gray-800'}`}>
            {value || <span className="italic text-gray-400">Chưa cập nhật</span>}
        </dd>
    </div>
);


const UserProfilePage = () => {
    const { user, setUser } = useAuth();
    const queryClient = useQueryClient();
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    const onSubmit = async (data) => {
        try {
            const response = await authService.updateProfile(data);
            setUser(response.data); // Cập nhật lại thông tin user trong context
            toast.success('Cập nhật thông tin thành công!'); // Giữ nguyên, đã tương thích
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra.'); // Giữ nguyên, đã tương thích
        }
    };

    const { data: profileData, isLoading, isError, error } = useQuery({
        queryKey: ['userProfile', user?.id],
        queryFn: () => userService.getCurrentUserProfile(),
        enabled: !!user,
        onSuccess: (data) => {
            setFormData({
                ...data,
                dateOfBirth: data.dateOfBirth ? format(parseISO(data.dateOfBirth), 'yyyy-MM-dd') : '',
            });
        }
    });

    const { mutate: updateUser, isLoading: isUpdating } = useMutation({
        mutationFn: (updateData) => userService.updateUserProfile(updateData),
        onSuccess: (updatedUser) => {
            toast.success('Cập nhật hồ sơ thành công!');
            queryClient.setQueryData(['userProfile', user.id], updatedUser);
            // Cập nhật lại thông tin user trong context nếu cần
            setUser({ ...user, fullName: updatedUser.fullName });
            setIsEditMode(false);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ.');
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { fullName, phone, address, dateOfBirth, isReadyToDonate, medicalConditions } = formData;
        updateUser({ fullName, phone, address, dateOfBirth, isReadyToDonate, medicalConditions });
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    if (isError) return <div className="text-red-500 text-center mt-10">Lỗi khi tải thông tin: {error.message}</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 border-b">
                    <div>
                        <h3 className="text-2xl leading-6 font-bold text-gray-900">
                            Hồ Sơ Cá Nhân
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Thông tin chi tiết về tài khoản của bạn.
                        </p>
                    </div>
                    <div>
                        {!isEditMode ? (
                            <Button onClick={() => setIsEditMode(true)} startIcon={<EditIcon />}>
                                Chỉnh sửa
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={() => setIsEditMode(false)} variant="secondary" startIcon={<CancelIcon />}>
                                    Hủy
                                </Button>
                                <Button onClick={handleSubmit} isLoading={isUpdating} startIcon={<SaveIcon />}>
                                    Lưu
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    {!isEditMode ? (
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <ProfileDetailItem icon={PersonIcon} label="Họ và tên" value={profileData.fullName} />
                            <ProfileDetailItem icon={EmailIcon} label="Email" value={profileData.email} />
                            <ProfileDetailItem icon={PhoneIcon} label="Số điện thoại" value={profileData.phone} />
                            <ProfileDetailItem icon={LocationOnIcon} label="Địa chỉ" value={profileData.address} />
                            <ProfileDetailItem icon={CakeIcon} label="Ngày sinh" value={profileData.dateOfBirth ? format(parseISO(profileData.dateOfBirth), 'dd/MM/yyyy') : ''} />
                            <ProfileDetailItem icon={BloodtypeIcon} label="Nhóm máu" value={profileData.bloodTypeDescription} />
                            <ProfileDetailItem icon={MedicalInformationIcon} label="Tình trạng bệnh lý" value={profileData.medicalConditions} />
                            <ProfileDetailItem
                                icon={profileData.isReadyToDonate ? CheckCircleIcon : CancelIcon}
                                label="Sẵn sàng hiến máu"
                                value={profileData.isReadyToDonate ? "Có" : "Không"}
                                highlight={profileData.isReadyToDonate}
                            />
                        </dl>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <InputField label="Họ và tên" name="fullName" value={formData.fullName || ''} onChange={handleChange} />
                            <InputField label="Email" name="email" value={formData.email || ''} onChange={handleChange} disabled />
                            <InputField label="Số điện thoại" name="phone" value={formData.phone || ''} onChange={handleChange} />
                            <InputField label="Địa chỉ" name="address" value={formData.address || ''} onChange={handleChange} />
                            <InputField label="Ngày sinh" name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                            <InputField label="Nhóm máu" name="bloodTypeDescription" value={formData.bloodTypeDescription || ''} onChange={handleChange} disabled />
                            <InputField label="Tình trạng bệnh lý (nếu có)" name="medicalConditions" value={formData.medicalConditions || ''} onChange={handleChange} />
                            <div className="flex items-center">
                                <input
                                    id="isReadyToDonate"
                                    name="isReadyToDonate"
                                    type="checkbox"
                                    checked={formData.isReadyToDonate || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isReadyToDonate" className="ml-2 block text-sm text-gray-900">
                                    Tôi sẵn sàng nhận thông báo và tham gia hiến máu
                                </label>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;