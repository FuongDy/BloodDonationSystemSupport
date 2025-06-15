// src/pages/UserProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import { UserCircle, Edit3, Save, CalendarDays, Droplet, Mail, Phone, MapPin, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import { Link, Routes, Route } from 'react-router-dom';

// Placeholder components for sidebar routes
const ProfileSecurityPage = () => <div className="bg-white shadow-xl rounded-lg p-6 md:p-8"><h2>Bảo mật & Đăng nhập</h2><p>Nội dung trang bảo mật...</p></div>;
const ProfileDonationSchedulePage = () => <div className="bg-white shadow-xl rounded-lg p-6 md:p-8"><h2>Lịch hiến máu</h2><p>Nội dung trang lịch hiến máu...</p></div>;
const ProfileDonationHistoryPage = () => <div className="bg-white shadow-xl rounded-lg p-6 md:p-8"><h2>Lịch sử hiến máu</h2><p>Nội dung trang lịch sử hiến máu...</p></div>;
const ProfileNotificationsPage = () => <div className="bg-white shadow-xl rounded-lg p-6 md:p-8"><h2>Cài đặt thông báo</h2><p>Nội dung trang cài đặt thông báo...</p></div>;
const ProfileSettingsPage = () => <div className="bg-white shadow-xl rounded-lg p-6 md:p-8"><h2>Cài đặt tài khoản</h2><p>Nội dung trang cài đặt tài khoản...</p></div>;

const UserProfileInfo = ({ profileData, formData, handleInputChange, handleSubmit, isEditing, setIsEditing, isSubmitting, errors, bloodTypes, fetchProfile }) => {
    // This component contains the form and display logic for the main profile info
    // Extracted from UserProfilePage for clarity when using nested routes
    return (
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                    <UserCircle size={48} className="text-red-600 mr-4" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{profileData.fullName}</h1>
                        <p className="text-gray-600">{profileData.email}</p>
                    </div>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit3 size={16} className="mr-2" /> Chỉnh sửa hồ sơ
                    </Button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField label="Họ và tên đầy đủ" name="fullName" value={formData.fullName} onChange={handleInputChange} required disabled={isSubmitting} error={errors.fullName} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Số điện thoại" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} error={errors.phone} />
                        <InputField label="Ngày sinh" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} disabled={isSubmitting} error={errors.dateOfBirth} />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={isSubmitting} className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">-- Chọn giới tính --</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                            <option value="Other">Khác</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
                    </div>
                    <InputField label="Địa chỉ" name="address" type="textarea" value={formData.address} onChange={handleInputChange} disabled={isSubmitting} error={errors.address} rows={2} />
                    <InputField label="Liên hệ khẩn cấp" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} disabled={isSubmitting} error={errors.emergencyContact} />

                    <div>
                        <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
                        <select name="bloodTypeId" value={formData.bloodTypeId} onChange={handleInputChange} disabled={isSubmitting || bloodTypes.length === 0} className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.bloodTypeId ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">-- Chọn nhóm máu --</option>
                            {bloodTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.bloodGroup}{bt.rhFactor} ({bt.description})</option>)}
                        </select>
                        {errors.bloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.bloodTypeId}</p>}
                    </div>
                    <InputField label="Tình trạng bệnh lý (nếu có)" name="medicalConditions" type="textarea" value={formData.medicalConditions} onChange={handleInputChange} disabled={isSubmitting} error={errors.medicalConditions} rows={2} />
                    <InputField label="Ngày hiến máu gần nhất" name="lastDonationDate" type="date" value={formData.lastDonationDate} onChange={handleInputChange} disabled={isSubmitting} error={errors.lastDonationDate} />
                    <div className="flex items-center">
                        <input name="isReadyToDonate" type="checkbox" checked={formData.isReadyToDonate} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                        <label htmlFor="isReadyToDonate" className="ml-2 block text-sm text-gray-900">Tôi sẵn sàng hiến máu</label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); fetchProfile(); }} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                            <Save size={16} className="mr-2" /> Lưu thay đổi
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4 mt-6">
                    <InfoRow icon={Mail} label="Email" value={profileData.email} />
                    <InfoRow icon={Phone} label="Điện thoại" value={profileData.phone || "Chưa cập nhật"} />
                    <InfoRow icon={CalendarDays} label="Ngày sinh" value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN') : "Chưa cập nhật"} />
                    <InfoRow icon={User} label="Giới tính" value={profileData.gender || "Chưa cập nhật"} />
                    <InfoRow icon={MapPin} label="Địa chỉ" value={profileData.address || "Chưa cập nhật"} />
                    <InfoRow icon={AlertTriangle} label="Liên hệ khẩn cấp" value={profileData.emergencyContact || "Chưa cập nhật"} />
                    <InfoRow icon={Droplet} label="Nhóm máu" value={profileData.bloodTypeDescription || "Chưa cập nhật"} />
                    <InfoRow icon={ShieldCheck} label="Bệnh lý" value={profileData.medicalConditions || "Không có"} />
                    <InfoRow icon={CalendarDays} label="Hiến máu lần cuối" value={profileData.lastDonationDate ? new Date(profileData.lastDonationDate).toLocaleDateString('vi-VN') : "Chưa có"} />
                    <InfoRow icon={profileData.isReadyToDonate ? CheckCircle : XCircle} label="Sẵn sàng hiến máu" value={profileData.isReadyToDonate ? "Có" : "Không"} valueColor={profileData.isReadyToDonate ? 'text-green-600' : 'text-red-600'} />
                </div>
            )}
        </div>
    );
};


const UserProfilePage = () => {
    // console.log("UserProfilePage rendering or re-rendering"); // For debugging
    const { user, loading: authLoading, isAuthenticated, logout } = useAuth(); // Added logout
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        emergencyContact: '',
        bloodTypeId: '',
        medicalConditions: '',
        lastDonationDate: '',
        isReadyToDonate: false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true); // Page's own data loading state
    const [error, setError] = useState(null);
    const [bloodTypes, setBloodTypes] = useState([]);

    const fetchProfile = useCallback(async () => {
        // Ensure user and userId are valid before proceeding
        if (!user || !user.userId) {
            setError("Thông tin xác thực người dùng không hợp lệ để tải hồ sơ.");
            setLoading(false);
            setProfileData(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getProfile(user.userId);
            if (data) {
                setProfileData(data);
                setFormData({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                    gender: data.gender || '',
                    address: data.address || '',
                    emergencyContact: data.emergencyContact || '',
                    bloodTypeId: data.bloodTypeId || '',
                    medicalConditions: data.medicalConditions || '',
                    lastDonationDate: data.lastDonationDate ? data.lastDonationDate.split('T')[0] : '',
                    isReadyToDonate: data.isReadyToDonate || false,
                });
            } else {
                setProfileData(null);
                setError('Không tìm thấy dữ liệu hồ sơ người dùng.');
            }
            setErrors({});
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            setError(err.message || 'Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
            setProfileData(null);
            toast.error(err.message || 'Không thể tải thông tin hồ sơ.');
        } finally {
            setLoading(false);
        }
    }, [user]); // Dependency on user object

    const fetchBloodTypes = useCallback(async () => {
        try {
            // Assuming you have a service to fetch blood types
            // For now, using a placeholder or ensuring it's handled if bloodTypeService exists
            // const types = await bloodTypeService.getAllBloodTypes();
            // setBloodTypes(types);
            // Placeholder if service not fully implemented yet:
            // Simulating fetch from a config or mock if bloodTypeService is not ready
            // This part needs to be connected to your actual blood type fetching logic
            // For the purpose of fixing the UI, we'll assume bloodTypes might be populated elsewhere or can be empty
        } catch (err) {
            console.error("Failed to fetch blood types:", err);
            toast.error("Không thể tải danh sách nhóm máu.");
        }
    }, []);


    useEffect(() => {
        if (authLoading) {
            // If auth is loading, page should also reflect a loading state or wait.
            // Setting page loading to true ensures a consistent loading indicator.
            setLoading(true);
            return; // Wait for auth to complete
        }

        // Auth is complete (authLoading is false)
        if (isAuthenticated && user && user.userId) {
            fetchProfile();
            fetchBloodTypes();
        } else if (isAuthenticated && (!user || !user.userId)) {
            // Authenticated according to context, but user object is invalid/incomplete
            setError("Đã xác thực nhưng thông tin người dùng không đầy đủ hoặc bị lỗi. Vui lòng thử đăng nhập lại.");
            setLoading(false);
            setProfileData(null);
        } else {
            // Not authenticated
            setError("Vui lòng đăng nhập để xem hồ sơ của bạn.");
            setLoading(false);
            setProfileData(null);
        }
    }, [isAuthenticated, user, authLoading, fetchProfile, fetchBloodTypes]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống.";
        // Add other validations as needed
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
        try {
            await userService.updateProfile(user.userId, formData);
            toast.success('Cập nhật hồ sơ thành công!');
            setIsEditing(false);
            fetchProfile(); // Refresh profile data
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(err.message || 'Cập nhật hồ sơ thất bại.');
            toast.error(err.message || 'Cập nhật hồ sơ thất bại.');
            // Potentially set field-specific errors from response if API provides them
            // setErrors(err.response?.data?.errors || {});
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Render logic:
    if (authLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
                    <LoadingSpinner size="lg" />
                </main>
                <Footer />
            </div>
        );
    }

    if (loading) { // Page specific data loading (auth is done)
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <ProfileSidebar />
                        <div className="flex-1 flex justify-center items-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <ProfileSidebar />
                        <div className="flex-1 flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-6 md:p-8"> {/* Changed classes for vertical centering and full height feel */}
                            <div className="text-center"> {/* Inner wrapper for text content */}
                                <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-red-700 mb-2">Đã xảy ra lỗi</h2>
                                <p className="text-gray-600 mb-4">{error}</p>
                                {isAuthenticated && user?.userId && !error.includes("thông tin người dùng không đầy đủ") && (
                                    <Button onClick={fetchProfile} variant="primary">
                                        Thử lại
                                    </Button>
                                )}
                                {isAuthenticated && (!user || !user.userId) && (
                                    <Link to="/login" onClick={() => { if(logout) logout(); }}>
                                        <Button variant="primary">
                                            Đăng nhập lại
                                        </Button>
                                    </Link>
                                )}
                                {!isAuthenticated && !error.includes("thông tin người dùng không đầy đủ") && (
                                    <Link to="/login">
                                        <Button variant="primary">Đăng nhập</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!profileData && !isAuthenticated) { // Case where user is not logged in and no specific error was set for that
         return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <ProfileSidebar />
                        <div className="flex-1 flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-6 md:p-8"> {/* Changed classes */}
                            <div className="text-center"> {/* Inner wrapper */}
                                <UserCircle size={48} className="text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Yêu cầu đăng nhập</h2>
                                <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem thông tin hồ sơ.</p>
                                <Link to="/login">
                                    <Button variant="primary">Đến trang đăng nhập</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    
    if (!profileData && isAuthenticated) { // Logged in, but no profile data (and no error reported by fetch)
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <ProfileSidebar />
                        <div className="flex-1 flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-6 md:p-8"> {/* Changed classes */}
                            <div className="text-center"> {/* Inner wrapper */}
                                <UserCircle size={48} className="text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Không có dữ liệu hồ sơ</h2>
                                <p className="text-gray-600">Không tìm thấy thông tin hồ sơ cho tài khoản này.</p>
                                {/* Optionally, a button to create a profile if applicable */}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <ProfileSidebar />
                    <div className="flex-1">
                        <Routes>
                            <Route 
                                index 
                                element={
                                    <UserProfileInfo
                                        profileData={profileData}
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleSubmit={handleSubmit}
                                        isEditing={isEditing}
                                        setIsEditing={setIsEditing}
                                        isSubmitting={isSubmitting}
                                        errors={errors}
                                        bloodTypes={bloodTypes}
                                        fetchProfile={fetchProfile}
                                    />
                                } 
                            />
                            <Route path="security" element={<ProfileSecurityPage />} />
                            <Route path="donation-schedule" element={<ProfileDonationSchedulePage />} />
                            <Route path="donation-history" element={<ProfileDonationHistoryPage />} />
                            <Route path="notifications" element={<ProfileNotificationsPage />} />
                            <Route path="settings" element={<ProfileSettingsPage />} />
                        </Routes>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const InfoRow = ({ icon: Icon, label, value, valueColor = 'text-gray-700' }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-gray-200 last:border-b-0">
        <dt className="text-sm font-medium text-gray-500 flex items-center">
            <Icon size={16} className="mr-2 text-red-500" />
            {label}
        </dt>
        <dd className={`mt-1 text-sm ${valueColor} sm:mt-0 sm:col-span-2`}>{value}</dd>
    </div>
);

export default UserProfilePage;