import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, Eye, Upload, User, Phone, Calendar, MapPin, BriefcaseMedical, Shield } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns'; // Đảm bảo có parseISO

import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import bloodTypeService from '../../services/bloodTypeService';

import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import IdCardUploadSection from '../../components/profile/IdCardUploadSection';

const UserProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, setUser: setAuthUser } = useAuth();

  // Tối ưu toast với duration ngắn và dismiss cũ
  const showToast = (type, message) => {
    toast.dismiss();
    toast[type](message, {
      duration: 2500,
      position: 'top-center',
    });
  };

  const [formData, setFormData] = useState({
    fullName: '', phone: '', dateOfBirth: '', gender: '', address: '',
    emergencyContact: '', bloodTypeId: '', medicalConditions: '',
    lastDonationDate: '', isReadyToDonate: true,
  });
  const [idCardData, setIdCardData] = useState({ frontImage: null, backImage: null });
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [isSubmittingIdCard, setIsSubmittingIdCard] = useState(false);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // API có thể trả về dd-MM-yyyy, cần chuẩn hóa lại cho input
    const date = isValid(parseISO(dateString)) ? parseISO(dateString) : new Date(dateString.split('-').reverse().join('-'));
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
  };

  const initializeForms = useCallback((userData) => {
    setFormData({
      fullName: userData.fullName || '',
      phone: userData.phone || '',
      dateOfBirth: formatDateForInput(userData.dateOfBirth),
      gender: userData.gender || '',
      address: userData.address || '',
      emergencyContact: userData.emergencyContact || '',
      bloodTypeId: userData.bloodType?.id?.toString() || '',
      medicalConditions: userData.medicalConditions || '',
      lastDonationDate: formatDateForInput(userData.lastDonationDate),
      isReadyToDonate: userData.isReadyToDonate ?? true,
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userData, bloodTypesData] = await Promise.all([
          userService.getProfile(),
          bloodTypeService.getAll(),
        ]);
        initializeForms(userData);
        setBloodTypes(bloodTypesData || []);
      } catch (error) {
        showToast('error', `Lỗi tải dữ liệu: ${error.message}`);
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate, initializeForms]);

  const handleInfoChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleIdCardChange = useCallback((name, file) => {
    setIdCardData(prev => ({ ...prev, [name]: file }));
  }, []);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingInfo(true);

    const formatDateForApi = (dateString) => {
      if (!dateString) return null;
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'dd-MM-yyyy') : null;
    };

    const cleanedData = {
      ...formData,
      bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
      dateOfBirth: formatDateForApi(formData.dateOfBirth),
      lastDonationDate: formatDateForApi(formData.lastDonationDate),
    };

    // Chỉ gửi các trường có giá trị, xóa các trường rỗng hoặc null
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === null || cleanedData[key] === '') {
        delete cleanedData[key];
      }
    });

    try {
      const result = await userService.updateUserProfile(cleanedData);
      setAuthUser(result);
      showToast('success', 'Cập nhật thông tin thành công!');
      navigate('/profile');
    } catch (error) {
      showToast('error', `Lỗi cập nhật: ${error.message}`);
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  const handleIdCardSubmit = async (e) => {
    e.preventDefault();
    if (!idCardData.frontImage || !idCardData.backImage) {
      showToast('error', 'Vui lòng chọn ảnh mặt trước và mặt sau');
      return;
    }
    setIsSubmittingIdCard(true);
    const uploadFormData = new FormData();
    uploadFormData.append('frontImage', idCardData.frontImage);
    uploadFormData.append('backImage', idCardData.backImage);
    try {
      const result = await userService.uploadIdCard(uploadFormData);
      setAuthUser(result);
      showToast('success', 'CCCD đã được tải lên và xác minh thành công!');
      navigate('/profile');
    } catch (error) {
      showToast('error', `Lỗi tải lên CCCD: ${error.message}`);
    } finally {
      setIsSubmittingIdCard(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="12" /></div>;
  }

  return (
    <div className='p-4 sm:p-6 bg-gray-50 min-h-screen'>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-white px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl leading-6 font-bold text-gray-900">Chỉnh sửa hồ sơ</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <Eye size={16} className="mr-2" />
                Xem hồ sơ
              </Button>
            </div>
          </div>

          <form onSubmit={handleIdCardSubmit} className='p-6 space-y-6'>
            <h2 className='text-xl font-semibold text-gray-800 flex items-center'><Shield className="mr-3 text-red-500"/>Xác minh danh tính</h2>
            <p className='text-sm text-gray-600'>Tải lên ảnh 2 mặt của CCCD/CMND để xác thực tài khoản và có thể đặt lịch hiến máu.</p>
            <IdCardUploadSection onFileChange={handleIdCardChange} isSubmitting={isSubmittingIdCard} />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSubmittingIdCard || !idCardData.frontImage || !idCardData.backImage}>
                <Upload size={18} className="mr-2" />
                {isSubmittingIdCard ? 'Đang tải lên...' : 'Tải lên & Xác minh'}
              </Button>
            </div>
          </form>

          <div className="border-t mx-6"></div>

          <form onSubmit={handleInfoSubmit} className='p-6 space-y-6'>
            <h2 className='text-xl font-semibold text-gray-800 flex items-center'><User className="mr-3 text-red-500"/>Thông tin cá nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleInfoChange} disabled={isSubmittingInfo} required />
              <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleInfoChange} disabled={isSubmittingInfo} />
              <InputField label="Ngày sinh" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInfoChange} disabled={isSubmittingInfo} />
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Giới tính</label>
                <select name="gender" value={formData.gender} onChange={handleInfoChange} disabled={isSubmittingInfo} className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>
            <InputField as="textarea" rows={2} label="Địa chỉ" name="address" value={formData.address} onChange={handleInfoChange} disabled={isSubmittingInfo} />
            <InputField label="Liên hệ khẩn cấp" name="emergencyContact" value={formData.emergencyContact} onChange={handleInfoChange} disabled={isSubmittingInfo} />

            <h2 className='text-xl font-semibold text-gray-800 flex items-center mt-6'><BriefcaseMedical className="mr-3 text-red-500"/>Thông tin Y tế</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nhóm máu</label>
                <select name="bloodTypeId" value={formData.bloodTypeId} onChange={handleInfoChange} disabled={isSubmittingInfo || bloodTypes.length === 0} className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                  <option value="">-- Chọn nhóm máu --</option>
                  {bloodTypes
                    .filter(
                      (value, index, self) =>
                        index ===
                        self.findIndex(t => t.bloodGroup === value.bloodGroup)
                    )
                    .map(bt => (
                      <option key={bt.id} value={bt.id}>
                        {bt.bloodGroup}
                      </option>
                    ))}
                </select>
              </div>
              <InputField label="Ngày hiến gần nhất" name="lastDonationDate" type="date" value={formData.lastDonationDate} onChange={handleInfoChange} disabled={isSubmittingInfo} />
            </div>
            <InputField as="textarea" rows={2} label="Tình trạng bệnh lý (nếu có)" name="medicalConditions" value={formData.medicalConditions} onChange={handleInfoChange} disabled={isSubmittingInfo} />

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="success" disabled={isSubmittingInfo}>
                <Save size={18} className="mr-2" />
                {isSubmittingInfo ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditPage;