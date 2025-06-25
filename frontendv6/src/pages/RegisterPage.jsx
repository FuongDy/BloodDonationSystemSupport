import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  UserPlus as UserPlusIcon,
  Heart,
  Shield,
  Users,
  Mail,
  User,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Droplets,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useAppStore, showNotification } from '../store/appStore';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import DatePicker from '../components/common/DatePicker';
import bloodTypeService from '../services/bloodTypeService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { userRegistrationSchema } from '../utils/validationSchemas';
import { handleApiError } from '../utils/errorHandler';

/**
 * RegisterPage Component
 *
 * Trang đăng ký tài khoản với form validation toàn diện sử dụng Yup schema,
 * global state management với Zustand, và error handling nâng cao.
 *
 * Features:
 * - Multi-step form validation với Yup
 * - Real-time validation feedback
 * - Password strength validation
 * - Blood type selection từ API
 * - Global state management
 * - Comprehensive error handling
 * - Loading states
 *
 * @returns {JSX.Element} RegisterPage component
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
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

  /**
   * Fetch blood types từ API với error handling
   */
  const fetchBloodTypes = useCallback(async () => {
    setIsFetchingBloodTypes(true);
    try {
      const response = await bloodTypeService.getAll();
      setBloodTypesFromApi(response || []);
    } catch (error) {
      handleApiError(error, showNotification, {
        fallbackMessage: 'Lỗi khi tải danh sách nhóm máu.',
      });
      setBloodTypesFromApi([]);
    } finally {
      setIsFetchingBloodTypes(false);
    }
  }, [showNotification]);

  /**
   * Effect để handle redirect và fetch blood types
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    } else {
      fetchBloodTypes();
    }
  }, [isAuthenticated, navigate, fetchBloodTypes]);
  /**
   * Xử lý thay đổi input với real-time validation
   * @param {Event} e - Input change event
   */
  const handleInputChange = useCallback(
    async e => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      setFormData(prev => {
        const updatedData = {
          ...prev,
          [name]: newValue,
        };

        // Real-time validation cho field hiện tại (async)
        setTimeout(async () => {
          try {
            await userRegistrationSchema.validateAt(name, updatedData);
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
          } catch (validationError) {
            setValidationErrors(prev => ({
              ...prev,
              [name]: validationError.message,
            }));
          }

          // Nếu đang validate confirmPassword, cũng validate lại password để đảm bảo sync
          if (name === 'confirmPassword' || name === 'password') {
            try {
              await userRegistrationSchema.validateAt(
                'confirmPassword',
                updatedData
              );
              setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
            } catch (validationError) {
              setValidationErrors(prev => ({
                ...prev,
                confirmPassword: validationError.message,
              }));
            }
          }
        }, 0);

        return updatedData;
      });

      // Clear validation error cho field hiện tại
      if (validationErrors[name]) {
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      }
    },
    [validationErrors]
  );
  /**
   * Convert date format từ DD-MM-YYYY sang YYYY-MM-DD cho backend
   * @param {string} dateString - Date string in DD-MM-YYYY format
   * @returns {string} Date string in YYYY-MM-DD format
   */
  const convertDateFormat = dateString => {
    if (!dateString || !dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return null;
    }

    // Convert from DD-MM-YYYY (display format) to YYYY-MM-DD (ISO format for backend)
    const [day, month, year] = dateString.split('-');
    
    // Create a proper ISO date string that Spring Boot's LocalDate can parse
    // Ensure month and day are zero-padded to be valid ISO format
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');
    
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  /**
   * Xử lý submit form với comprehensive validation
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setLoading(true);

      // Bước 1: Validate toàn bộ form với Yup schema
      await userRegistrationSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});

      // Bước 2: Validate và convert định dạng ngày sinh
      if (!formData.dateOfBirth.match(/^\d{2}-\d{2}-\d{4}$/)) {
        throw new Error('INVALID_DATE_FORMAT');
      }

      const convertedDate = convertDateFormat(formData.dateOfBirth);
      if (!convertedDate) {
        throw new Error('INVALID_DATE_FORMAT');
      }

      // Bước 3: Chuẩn bị dữ liệu cho API với format backend yêu cầu
      // First, validate address to ensure it meets backend requirements (min 10 chars)
      const trimmedAddress = formData.address.trim();
      if (trimmedAddress.length < 10) {
        setValidationErrors(prev => ({
          ...prev,
          address: 'Địa chỉ phải có ít nhất 10 ký tự (không tính dấu cách)'
        }));
        showNotification('Địa chỉ phải có ít nhất 10 ký tự', 'error');
        return;
      }

      // Return a string in YYYY-MM-DD format that Spring Boot can parse to LocalDate
      // Make sure date is in ISO format YYYY-MM-DD, not an array
      let dateOfBirth = convertedDate;
      if (Array.isArray(dateOfBirth)) {
        // If it's still an array [year, month, day], convert to ISO string
        const [year, month, day] = dateOfBirth;
        // Make sure month and day are zero-padded
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');
        dateOfBirth = `${year}-${formattedMonth}-${formattedDay}`;
      }
      
      const registrationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        address: trimmedAddress,
        dateOfBirth: dateOfBirth, // ISO format string YYYY-MM-DD that Spring Boot can parse to LocalDate
        password: formData.password,
        bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
      };

      // Bước 4: Validate final data
      console.log('Final registration data:', registrationData);
      
      // Kiểm tra bloodTypeId nếu có
      if (registrationData.bloodTypeId !== null && isNaN(registrationData.bloodTypeId)) {
        setValidationErrors(prev => ({
          ...prev,
          bloodTypeId: 'Nhóm máu không hợp lệ'
        }));
        showNotification('Vui lòng chọn nhóm máu hợp lệ', 'error');
        return;
      }

      // Bước 5: Gọi API đăng ký (request OTP)
      const response = await requestRegistration(registrationData);

      // Bước 6: Xử lý response thành công
      console.log('Registration response:', response);
      
      if (response && (response.success || response.data)) {
        showNotification(
          'Mã OTP đã được gửi! Vui lòng kiểm tra email.',
          'success'
        );
        
        // Navigate với data đã được format
        navigate('/verify-otp', { 
          state: { 
            email: registrationData.email,
          } 
        });
      } else {
        // If we received a response but it doesn't indicate success
        console.error('Unexpected response format:', response);
        throw new Error('Không thể gửi OTP. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Registration submit error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Xử lý các loại lỗi khác nhau
      if (error.name === 'ValidationError') {
        // Lỗi validation từ Yup
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
        showNotification('Vui lòng kiểm tra lại thông tin đăng ký.', 'error');
        
      } else if (error.message === 'INVALID_DATE_FORMAT') {
        // Lỗi định dạng ngày sinh
        setValidationErrors(prev => ({
          ...prev,
          dateOfBirth: 'Định dạng ngày sinh không hợp lệ (DD-MM-YYYY)',
        }));
        showNotification('Định dạng ngày sinh không hợp lệ', 'error');
        
      } else if (!error.response) {
        // Network error or other non-HTTP error
        console.error('Network or non-HTTP error:', error);
        showNotification('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.', 'error');
        
      } else if (error.response?.data) {
        // Lỗi từ API backend
        const apiErrors = error.response.data;
        console.log('API Error Response:', apiErrors);

        // Handle 500 internal server errors
        if (error.response.status === 500) {
          console.error('Server internal error (500):', apiErrors);
          showNotification('Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ quản trị viên.', 'error');
        }
        // Handle case where backend returns a plain string error message
        else if (typeof apiErrors === 'string') {
          // Check if it's an email already exists error
          if (apiErrors.toLowerCase().includes('email is already in use') || 
              apiErrors.toLowerCase().includes('email already exists')) {
            setValidationErrors(prev => ({
              ...prev,
              email: 'Email này đã được sử dụng. Vui lòng chọn email khác.'
            }));
            showNotification('Email này đã được sử dụng. Vui lòng chọn email khác.', 'error');
          } else {
            showNotification(apiErrors, 'error');
          }
        } else if (apiErrors.errors && typeof apiErrors.errors === 'object') {
          // Map lỗi field từ API về frontend fields
          const formErrors = {};
          
          Object.entries(apiErrors.errors).forEach(([field, messages]) => {
            const fieldName = field.toLowerCase();
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;

            // Enhanced field mapping cho backend
            const fieldMapping = {
              fullname: 'fullName',
              'full_name': 'fullName',
              name: 'fullName',
              email: 'email',
              phone: 'phone',
              phonenumber: 'phone',
              'phone_number': 'phone',
              address: 'address',
              dateofbirth: 'dateOfBirth',
              'date_of_birth': 'dateOfBirth',
              birthdate: 'dateOfBirth',
              password: 'password',
              bloodtypeid: 'bloodTypeId',
              'blood_type_id': 'bloodTypeId',
              bloodtype: 'bloodTypeId',
              'blood_type': 'bloodTypeId'
            };

            // Tìm field mapping
            let mappedField = fieldMapping[fieldName];
            if (!mappedField) {
              // Tìm partial match
              const matchedKey = Object.keys(fieldMapping).find(key => 
                fieldName.includes(key) || key.includes(fieldName)
              );
              if (matchedKey) {
                mappedField = fieldMapping[matchedKey];
              }
            }

            if (mappedField) {
              formErrors[mappedField] = errorMessage;
            } else {
              console.warn(`Unmapped field: ${field} -> ${errorMessage}`);
              // Add to general errors
              if (!formErrors.general) formErrors.general = [];
              formErrors.general.push(`${field}: ${errorMessage}`);
            }
          });

          setValidationErrors(prev => ({ ...prev, ...formErrors }));
          showNotification('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.', 'error');
          
        } else if (apiErrors.message) {
          // General API error message
          showNotification(apiErrors.message, 'error');
        } else {
          showNotification('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.', 'error');
        }
      } else {
        // Network hoặc lỗi không xác định
        handleApiError(error, showNotification, {
          fallbackMessage: 'Không thể kết nối đến server. Vui lòng thử lại.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50'>
      {/* Background Pattern */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-32 w-80 h-80 bg-red-100 rounded-full opacity-30 blur-3xl'></div>
        <div className='absolute -bottom-40 -left-32 w-80 h-80 bg-pink-100 rounded-full opacity-30 blur-3xl'></div>
      </div>

      <div className='relative min-h-screen flex'>
        {/* Left Side - Hero Section */}
        <div className='hidden lg:flex lg:w-2/5 flex-col justify-center items-center bg-gradient-to-br from-red-600 to-pink-600 text-white p-8'>
          <div className='max-w-sm text-center'>
            <div className='flex items-center justify-center mb-6'>
              <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                <Heart className='w-10 h-10 text-white' />
              </div>
            </div>
            <h1 className='text-3xl font-bold mb-4'>Tham gia cộng đồng</h1>
            <p className='text-lg text-red-100 mb-6 font-light'>
              Trở thành người hùng cứu người với những giọt máu quý giá
            </p>

            {/* Process Steps */}
            <div className='space-y-3 text-left'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold'>1</span>
                </div>
                <span className='text-red-100'>Đăng ký tài khoản</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold'>2</span>
                </div>
                <span className='text-red-100'>Xác thực thông tin</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold'>3</span>
                </div>
                <span className='text-red-100'>Bắt đầu hiến máu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className='w-full lg:w-3/5 flex items-center justify-center p-4 lg:p-8'>
          <div className='max-w-2xl w-full'>
            {/* Mobile Hero */}
            <div className='lg:hidden text-center mb-6'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4'>
                <Heart className='w-8 h-8 text-red-600' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                Đăng ký tài khoản
              </h1>
              <p className='text-gray-600'>
                Tham gia cộng đồng hiến máu nhân đạo
              </p>
            </div>

            {/* Desktop Header */}
            <div className='hidden lg:block text-center mb-6'>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Tạo tài khoản mới
              </h2>
              <p className='text-gray-600'>
                Điền thông tin để tham gia cộng đồng
              </p>
            </div>

            {/* Register Form */}
            <div className='bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Personal Information Section */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-900 flex items-center border-b pb-2'>
                    <User className='w-5 h-5 mr-2 text-red-600' />
                    Thông tin cá nhân
                  </h3>

                  {/* Full Name */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Họ và tên đầy đủ *
                    </label>
                    <input
                      id='fullName'
                      name='fullName'
                      type='text'
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder='Ví dụ: Nguyễn Văn An'
                      required
                      disabled={authLoading || isFetchingBloodTypes}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                        validationErrors.fullName
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    {validationErrors.fullName && (
                      <p className='text-xs text-red-600'>
                        {validationErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email and Phone */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700 flex items-center'>
                        <Mail className='w-4 h-4 mr-1 text-gray-500' />
                        Email *
                      </label>
                      <input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='your.email@example.com'
                        required
                        disabled={authLoading || isFetchingBloodTypes}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          validationErrors.email
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className='text-xs text-red-600'>
                          {validationErrors.email}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700 flex items-center'>
                        <Phone className='w-4 h-4 mr-1 text-gray-500' />
                        Số điện thoại *
                      </label>
                      <input
                        id='phone'
                        name='phone'
                        type='tel'
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder='0987654321'
                        required
                        disabled={authLoading || isFetchingBloodTypes}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          validationErrors.phone
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      />
                      {validationErrors.phone && (
                        <p className='text-xs text-red-600'>
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth and Blood Type */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {' '}
                    <div className='space-y-2'>
                      {' '}
                      <DatePicker
                        label={
                          <div className='flex items-center text-sm font-medium text-gray-700'>
                            <Calendar className='w-4 h-4 mr-1 text-gray-500' />
                            Ngày sinh *
                          </div>
                        }
                        name='dateOfBirth'
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        maxDate={(() => {
                          // Format today's date as DD-MM-YYYY for max date
                          const today = new Date();
                          const day = String(today.getDate()).padStart(2, '0');
                          const month = String(today.getMonth() + 1).padStart(
                            2,
                            '0'
                          );
                          const year = today.getFullYear();
                          return `${day}-${month}-${year}`;
                        })()} // Không cho chọn ngày tương lai
                        minDate={(() => {
                          // Format date 100 years ago as DD-MM-YYYY
                          const pastDate = new Date();
                          pastDate.setFullYear(pastDate.getFullYear() - 100);
                          const day = String(pastDate.getDate()).padStart(
                            2,
                            '0'
                          );
                          const month = String(
                            pastDate.getMonth() + 1
                          ).padStart(2, '0');
                          const year = pastDate.getFullYear();
                          return `${day}-${month}-${year}`;
                        })()} // Giới hạn ngày sinh từ 100 năm trước
                        placeholder='Tối thiểu 16 tuổi'
                        disabled={authLoading || isFetchingBloodTypes}
                        error={validationErrors.dateOfBirth}
                      />
                      {validationErrors.dateOfBirth && (
                        <p className='text-xs text-red-600'>
                          {validationErrors.dateOfBirth}
                        </p>
                      )}
                    </div>{' '}
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700 flex items-center'>
                        <Droplets className='w-4 h-4 mr-1 text-gray-500' />
                        Nhóm máu (tùy chọn)
                      </label>
                      {isFetchingBloodTypes ? (
                        <div className='w-full px-4 py-3 border rounded-lg bg-gray-50 flex items-center justify-center'>
                          <div className='w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2'></div>
                          <span className='text-sm text-gray-600'>
                            Đang tải...
                          </span>
                        </div>
                      ) : (
                        <select
                          id='bloodTypeId'
                          name='bloodTypeId'
                          value={formData.bloodTypeId}
                          onChange={handleInputChange}
                          disabled={
                            authLoading ||
                            isFetchingBloodTypes ||
                            bloodTypesFromApi.length === 0
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                            validationErrors.bloodTypeId
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <option value=''>-- Chọn nhóm máu --</option>
                          {bloodTypesFromApi
                            .filter(
                              (value, index, self) =>
                                index ===
                                self.findIndex(
                                  t => t.bloodGroup === value.bloodGroup
                                )
                            )
                            .map(bt => (
                              <option key={bt.id} value={bt.id}>
                                {bt.bloodGroup}
                              </option>
                            ))}
                        </select>
                      )}
                      {validationErrors.bloodTypeId && (
                        <p className='text-xs text-red-600'>
                          {validationErrors.bloodTypeId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                      <MapPin className='w-4 h-4 mr-1 text-gray-500' />
                      Địa chỉ *
                      <span className='text-xs text-gray-500 ml-1'>(Tối thiểu 10 ký tự)</span>
                    </label>
                    <textarea
                      id='address'
                      name='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder='Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố (tối thiểu 10 ký tự)'
                      disabled={authLoading || isFetchingBloodTypes}
                      required
                      rows={2}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none ${
                        validationErrors.address
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    {validationErrors.address && (
                      <p className='text-xs text-red-600'>
                        {validationErrors.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Security Section */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-900 flex items-center border-b pb-2'>
                    <Lock className='w-5 h-5 mr-2 text-red-600' />
                    Thông tin bảo mật
                  </h3>

                  {/* Password Fields */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Mật khẩu *
                      </label>
                      <div className='relative'>
                        <input
                          id='password'
                          name='password'
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder='Ít nhất 6 ký tự'
                          required
                          disabled={authLoading || isFetchingBloodTypes}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                            validationErrors.password
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={authLoading}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                        >
                          {showPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                      {validationErrors.password && (
                        <p className='text-xs text-red-600'>
                          {validationErrors.password}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Xác nhận mật khẩu *
                      </label>
                      <div className='relative'>
                        <input
                          id='confirmPassword'
                          name='confirmPassword'
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder='Nhập lại mật khẩu'
                          required
                          disabled={authLoading || isFetchingBloodTypes}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                            validationErrors.confirmPassword
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={authLoading}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className='text-xs text-red-600'>
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='flex items-start'>
                    <input
                      id='agreeTerms'
                      name='agreeTerms'
                      type='checkbox'
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      disabled={authLoading || isFetchingBloodTypes}
                      required
                      className={`w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1 ${
                        validationErrors.agreeTerms ? 'border-red-500' : ''
                      }`}
                    />
                    <label
                      htmlFor='agreeTerms'
                      className='ml-2 block text-sm text-gray-700'
                    >
                      Tôi đã đọc và đồng ý với{' '}
                      <Link
                        to='/terms'
                        className='font-medium text-red-600 hover:text-red-500 hover:underline'
                      >
                        Điều khoản sử dụng
                      </Link>{' '}
                      và{' '}
                      <Link
                        to='/privacy'
                        className='font-medium text-red-600 hover:text-red-500 hover:underline'
                      >
                        Chính sách bảo mật
                      </Link>{' '}
                      của hệ thống.
                    </label>
                  </div>
                  {validationErrors.agreeTerms && (
                    <p className='mt-1 text-xs text-red-600'>
                      {validationErrors.agreeTerms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={
                    authLoading ||
                    isFetchingBloodTypes ||
                    Object.keys(validationErrors).some(
                      key => validationErrors[key] && key !== 'general'
                    ) ||
                    !formData.agreeTerms ||
                    !formData.fullName.trim() ||
                    !formData.email.trim() ||
                    !formData.phone.trim() ||
                    !formData.address.trim() ||
                    !formData.dateOfBirth ||
                    !formData.password ||
                    !formData.confirmPassword
                  }
                  className={`w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    authLoading ? 'cursor-wait' : ''
                  }`}
                >
                  <div className='flex items-center justify-center'>
                    {authLoading ? (
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                    ) : (
                      <CheckCircle className='w-5 h-5 mr-2' />
                    )}
                    {authLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                  </div>
                </button>

                {/* General Errors Display */}
                {validationErrors.general && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                    <h4 className='text-sm font-medium text-red-800 mb-2'>
                      Lỗi khác:
                    </h4>
                    <ul className='text-xs text-red-600 space-y-1'>
                      {validationErrors.general.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </div>

            {/* Footer Note */}
            <div className='mt-6 text-center'>
              <p className='text-xs text-gray-500'>
                Sau khi đăng ký, bạn sẽ nhận được email xác thực để kích hoạt
                tài khoản
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

