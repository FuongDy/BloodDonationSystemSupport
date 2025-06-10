import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import donationService from '../services/donationService';
import { User, Lock, History } from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import InputField from '../components/common/InputField';
import { format } from 'date-fns';

// ====================================================================
// 1. Component con cho Tab "Hồ sơ cá nhân"
// ====================================================================
const ProfileTab = () => {
    const { user, updateUserContext } = useAuth();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Lấy thông tin profile khi component được render
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getCurrentUserProfile();
                setProfile(response.data);
                reset(response.data); // Cập nhật giá trị mặc định cho form
            } catch (error) {
                toast.error("Không thể tải thông tin cá nhân.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [reset]);

    // Xử lý khi submit form cập nhật
    const onSubmit = async (data) => {
        try {
            const response = await userService.updateUserProfile(data);
            updateUserContext(response.data); // Cập nhật lại thông tin user trong context
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (error) {
            toast.error(`Lỗi khi cập nhật: ${error.response?.data?.message || error.message}`);
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;
    if (!profile) return <p>Không tìm thấy thông tin hồ sơ.</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
                label="Họ và Tên"
                name="fullName"
                register={register}
                validation={{ required: 'Họ tên là bắt buộc' }}
                error={errors.fullName}
                defaultValue={profile.fullName}
            />
            <InputField
                label="Email"
                name="email"
                type="email"
                register={register}
                validation={{ required: 'Email là bắt buộc' }}
                error={errors.email}
                defaultValue={profile.email}
                disabled={true} // Không cho phép sửa email
            />
            <InputField
                label="Số điện thoại"
                name="phoneNumber"
                register={register}
                error={errors.phoneNumber}
                defaultValue={profile.phoneNumber}
            />
            <InputField
                label="Địa chỉ"
                name="address"
                register={register}
                error={errors.address}
                defaultValue={profile.address}
            />
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
        </form>
    );
};

// ====================================================================
// 2. Component con cho Tab "Đổi mật khẩu"
// ====================================================================
const ChangePasswordTab = () => {
    // (Logic cho việc đổi mật khẩu sẽ được thêm vào đây)
    // Hiện tại chỉ là placeholder
    return (
        <div>
            <p className="text-gray-600">Chức năng đổi mật khẩu đang được phát triển.</p>
        </div>
    );
};


// ====================================================================
// 3. Component con cho Tab "Lịch sử hiến máu"
// ====================================================================
const DonationHistoryTab = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Lấy lịch sử hiến máu của user
    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const response = await donationService.getMyDonationHistory();
                // Sắp xếp lịch sử theo ngày tạo mới nhất
                const sortedHistory = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setHistory(sortedHistory);
            } catch (error) {
                toast.error("Không thể tải lịch sử hiến máu.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const statusStyles = {
        COMPLETED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-gray-100 text-gray-800',
        REJECTED: 'bg-red-100 text-red-800',
        default: 'bg-blue-100 text-blue-800'
    };

    const getStatusStyle = (status) => statusStyles[status] || statusStyles.default;


    if (isLoading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;
    if (history.length === 0) return <p className="text-center text-gray-500 py-10">Bạn chưa có lịch sử hiến máu nào.</p>;

    return (
        <div className="space-y-4">
            {history.map(item => (
                <div key={item.id} className="p-4 border rounded-lg bg-gray-50 transition-shadow hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-md text-gray-800">
                                Lịch hẹn: {item.appointment ? format(new Date(item.appointment.appointmentDateTime), 'dd/MM/yyyy') : 'Chưa có'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Ngày đăng ký: {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                            </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(item.status)}`}>
                            {item.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};


// ====================================================================
// 4. Component chính của trang UserProfile
// ====================================================================
const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    // Hàm render nội dung tương ứng với tab được chọn
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab />;
            case 'password':
                return <ChangePasswordTab />;
            case 'history':
                return <DonationHistoryTab />;
            default:
                return <ProfileTab />;
        }
    };

    // Hàm tạo class cho tab để highlight tab đang active
    const getTabClassName = (tabName) => {
        return `flex items-center px-4 py-2 -mb-px border-b-2 transition-colors duration-200 ${activeTab === tabName
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-red-600'
            }`;
    };

    return (
        <div className="max-w-4xl mx-auto my-10 p-4 sm:p-6 bg-white rounded-lg shadow-md">
            {/* Thanh điều hướng các tab */}
            <div className="flex border-b mb-6">
                <button onClick={() => setActiveTab('profile')} className={getTabClassName('profile')}>
                    <User size={18} className="mr-2" /> Hồ Sơ
                </button>
                <button onClick={() => setActiveTab('password')} className={getTabClassName('password')}>
                    <Lock size={18} className="mr-2" /> Đổi Mật Khẩu
                </button>
                <button onClick={() => setActiveTab('history')} className={getTabClassName('history')}>
                    <History size={18} className="mr-2" /> Lịch Sử Hiến Máu
                </button>
            </div>

            {/* Nội dung của tab */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default UserProfilePage;