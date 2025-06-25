import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Heart,
  Mail,
  User,
  Phone,
  Calendar,
  Lock,
  Droplets,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useAppStore, showNotification } from '../store/appStore';
import DatePicker from '../components/common/DatePicker';
import bloodTypeService from '../services/bloodTypeService';
import { userRegistrationSchema } from '../utils/validationSchemas';
import { handleApiError } from '../utils/errorHandler';
import AddressPicker from '../components/common/AddressPicker.jsx';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    latitude: null,
    longitude: null,
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    bloodTypeId: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bloodTypesFromApi, setBloodTypesFromApi] = useState([]);
  const [isFetchingBloodTypes, setIsFetchingBloodTypes] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const {
    requestRegistration,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const { setLoading } = useAppStore();
  const navigate = useNavigate();

  const fetchBloodTypes = useCallback(async () => {
    setIsFetchingBloodTypes(true);
    try {
      const data = await bloodTypeService.getAll();
      // Kiểm tra kỹ dữ liệu trả về là một mảng
      if (Array.isArray(data)) {
        // Lọc để chỉ giữ lại các nhóm máu cơ bản một cách an toàn hơn
        const simpleBloodTypes = data.filter(
          (bt) => bt && typeof bt.description === 'string' && !bt.description.includes('(')
        );
        setBloodTypesFromApi(simpleBloodTypes);
      } else {
        setBloodTypesFromApi([]);
      }
    } catch (error) {
      handleApiError(error, showNotification, {
        fallbackMessage: 'Lỗi khi tải danh sách nhóm máu.',
      });
    } finally {
      setIsFetchingBloodTypes(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    } else {
      fetchBloodTypes();
    }
  }, [isAuthenticated, navigate, fetchBloodTypes]);

  const handleInputChange = useCallback(e => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [validationErrors]);

  const handleAddressSelect = useCallback(({ address, latitude, longitude }) => {
    setFormData(prev => ({
      ...prev,
      address,
      latitude,
      longitude,
    }));
    if (validationErrors.address) {
      setValidationErrors(prev => ({ ...prev, address: '' }));
    }
  }, [validationErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userRegistrationSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      setLoading(true);

      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
      };

      if (registrationData.latitude === null || registrationData.longitude === null) {
        throw new Error("Vui lòng chọn một địa chỉ từ bản đồ hoặc ô tìm kiếm.");
      }

      await requestRegistration(registrationData);

      showNotification('Mã OTP đã được gửi! Vui lòng kiểm tra email.', 'success');
      navigate('/verify-otp', { state: { email: registrationData.email } });

    } catch (error) {
      if (error.name === 'ValidationError') {
        const newErrors = {};
        error.inner.forEach(err => { newErrors[err.path] = err.message; });
        setValidationErrors(newErrors);
        showNotification('Vui lòng kiểm tra lại thông tin đăng ký.', 'error');
      } else {
        handleApiError(error, showNotification);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-32 w-80 h-80 bg-red-100 rounded-full opacity-30 blur-3xl'></div>
        <div className='absolute -bottom-40 -left-32 w-80 h-80 bg-pink-100 rounded-full opacity-30 blur-3xl'></div>
      </div>

      <div className='relative min-h-screen flex'>
        <div className='hidden lg:flex lg:w-2/5 flex-col justify-center items-center bg-gradient-to-br from-red-600 to-pink-600 text-white p-8'>
          <div className='max-w-sm text-center'>
            <div className='flex items-center justify-center mb-6'>
              <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                <Heart className='w-10 h-10 text-white' />
              </div>
            </div>
            <h1 className='text-3xl font-bold mb-4'>Tham gia cộng đồng</h1>
            <p className='text-lg text-red-100 mb-6 font-light'>Trở thành người hùng cứu người với những giọt máu quý giá</p>
            <div className='space-y-3 text-left'>
              <div className='flex items-center space-x-3'><div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'><span className='text-sm font-bold'>1</span></div><span className='text-red-100'>Đăng ký tài khoản</span></div>
              <div className='flex items-center space-x-3'><div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'><span className='text-sm font-bold'>2</span></div><span className='text-red-100'>Xác thực thông tin</span></div>
              <div className='flex items-center space-x-3'><div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'><span className='text-sm font-bold'>3</span></div><span className='text-red-100'>Bắt đầu hiến máu</span></div>
            </div>
          </div>
        </div>

        <div className='w-full lg:w-3/5 flex items-center justify-center p-4 lg:p-8'>
          <div className='max-w-2xl w-full'>
            <div className='text-center mb-6'>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>Tạo tài khoản mới</h2>
              <p className='text-gray-600'>Điền thông tin để tham gia cộng đồng</p>
            </div>

            <div className='bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100'>
              <form onSubmit={handleSubmit} noValidate className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-900 flex items-center border-b pb-2'><User className='w-5 h-5 mr-2 text-red-600' />Thông tin cá nhân</h3>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>Họ và tên đầy đủ *</label>
                    <input id='fullName' name='fullName' type='text' value={formData.fullName} onChange={handleInputChange} placeholder='Ví dụ: Nguyễn Văn An' required disabled={authLoading || isFetchingBloodTypes} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} />
                    {validationErrors.fullName && <p className='text-xs text-red-600'>{validationErrors.fullName}</p>}
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'><label className='text-sm font-medium text-gray-700 flex items-center'><Mail className='w-4 h-4 mr-1 text-gray-500' /> Email *</label><input id='email' name='email' type='email' value={formData.email} onChange={handleInputChange} placeholder='your.email@example.com' required disabled={authLoading || isFetchingBloodTypes} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} />{validationErrors.email && <p className='text-xs text-red-600'>{validationErrors.email}</p>}</div>
                    <div className='space-y-2'><label className='text-sm font-medium text-gray-700 flex items-center'><Phone className='w-4 h-4 mr-1 text-gray-500' /> Số điện thoại *</label><input id='phone' name='phone' type='tel' value={formData.phone} onChange={handleInputChange} placeholder='0987654321' required disabled={authLoading || isFetchingBloodTypes} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} />{validationErrors.phone && <p className='text-xs text-red-600'>{validationErrors.phone}</p>}</div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'><DatePicker label={<div className="flex items-center text-sm font-medium text-gray-700"><Calendar className='w-4 h-4 mr-1 text-gray-500' /> Ngày sinh *</div>} name='dateOfBirth' value={formData.dateOfBirth} onChange={handleInputChange} required maxDate={new Date().toISOString().split('T')[0]} placeholder='YYYY-MM-DD' disabled={authLoading || isFetchingBloodTypes} />{validationErrors.dateOfBirth && <p className='text-xs text-red-600'>{validationErrors.dateOfBirth}</p>}</div>
                    <div className='space-y-2'><label className='text-sm font-medium text-gray-700 flex items-center'><Droplets className='w-4 h-4 mr-1 text-gray-500' /> Nhóm máu</label>{isFetchingBloodTypes ? <div className='w-full px-4 py-3 border rounded-lg bg-gray-50 flex items-center justify-center'><div className='w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2'></div><span className='text-sm text-gray-600'>Đang tải...</span></div> : <select id='bloodTypeId' name='bloodTypeId' value={formData.bloodTypeId} onChange={handleInputChange} disabled={authLoading || isFetchingBloodTypes || bloodTypesFromApi.length === 0} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.bloodTypeId ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}><option value=''>-- Chọn nhóm máu --</option>{bloodTypesFromApi.map(bt => (<option key={bt.id} value={bt.id}>{bt.description}</option>))}</select>}{validationErrors.bloodTypeId && <p className='text-xs text-red-600'>{validationErrors.bloodTypeId}</p>}</div>
                  </div>

                  <AddressPicker onAddressSelect={handleAddressSelect} />
                  {validationErrors.address && <p className='text-xs text-red-600 mt-1'>{validationErrors.address}</p>}

                </div>

                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-900 flex items-center border-b pb-2'><Lock className='w-5 h-5 mr-2 text-red-600' /> Thông tin bảo mật</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'><label className='text-sm font-medium text-gray-700'>Mật khẩu *</label><div className='relative'><input id='password' name='password' type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} placeholder='Ít nhất 6 ký tự' required disabled={authLoading || isFetchingBloodTypes} className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} /><button type='button' onClick={() => setShowPassword(!showPassword)} disabled={authLoading} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'>{showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}</button></div>{validationErrors.password && <p className='text-xs text-red-600'>{validationErrors.password}</p>}</div>
                    <div className='space-y-2'><label className='text-sm font-medium text-gray-700'>Xác nhận mật khẩu *</label><div className='relative'><input id='confirmPassword' name='confirmPassword' type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} placeholder='Nhập lại mật khẩu' required disabled={authLoading || isFetchingBloodTypes} className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} /><button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={authLoading} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'>{showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}</button></div>{validationErrors.confirmPassword && <p className='text-xs text-red-600'>{validationErrors.confirmPassword}</p>}</div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='flex items-start'><input id='agreeTerms' name='agreeTerms' type='checkbox' checked={formData.agreeTerms} onChange={handleInputChange} disabled={authLoading || isFetchingBloodTypes} required className={`w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1 ${validationErrors.agreeTerms ? 'border-red-500' : ''}`} /><label htmlFor='agreeTerms' className='ml-2 block text-sm text-gray-700'>Tôi đã đọc và đồng ý với{' '}<Link to='/terms' className='font-medium text-red-600 hover:text-red-500 hover:underline'>Điều khoản sử dụng</Link>{' '}và{' '}<Link to='/privacy' className='font-medium text-red-600 hover:text-red-500 hover:underline'>Chính sách bảo mật</Link>{' '}của hệ thống.</label></div>{validationErrors.agreeTerms && <p className='mt-1 text-xs text-red-600'>{validationErrors.agreeTerms}</p>}
                </div>

                <button type='submit' disabled={authLoading || isFetchingBloodTypes || Object.keys(validationErrors).some(key => !!validationErrors[key])} className={`w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${authLoading ? 'cursor-wait' : ''}`}><div className='flex items-center justify-center'>{authLoading ? <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div> : <CheckCircle className='w-5 h-5 mr-2' />}{authLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}</div></button>
                <div className='text-center pt-4 border-t'><p className='text-sm text-gray-600'>Đã có tài khoản?{' '}<Link to='/login' className='font-medium text-red-600 hover:text-red-500 inline-flex items-center group'><ArrowLeft className='w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform' />Đăng nhập ngay</Link></p></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;