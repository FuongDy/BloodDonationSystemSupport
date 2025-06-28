// src/hooks/useRegister.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useAppStore, showNotification } from '../store/appStore';
import bloodTypeService from '../services/bloodTypeService';
import { userRegistrationSchema } from '../utils/validationSchemas';
import { handleApiError } from '../utils/errorHandler';

export const useRegister = () => {
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
  }, []);

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
   * Convert date format từ DD-MM-YYYY sang YYYY-MM-DD cho backend
   * @param {string} dateString - Date string in DD-MM-YYYY format
   * @returns {string} Date string in YYYY-MM-DD format
   */
  const convertDateFormat = (dateString) => {
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
   * Perform real-time validation for a field
   * @param {string} fieldName - The field name to validate
   * @param {Object} data - The form data to validate
   */
  const performFieldValidation = async (fieldName, data) => {
    try {
      await userRegistrationSchema.validateAt(fieldName, data);
      setValidationErrors(prev => ({ ...prev, [fieldName]: '' }));
    } catch (validationError) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: validationError.message,
      }));
    }
  };

  /**
   * Validate password confirmation when password fields change
   * @param {string} fieldName - The field name that changed
   * @param {Object} data - The form data to validate
   */
  const validatePasswordSync = async (fieldName, data) => {
    if (fieldName === 'confirmPassword' || fieldName === 'password') {
      try {
        await userRegistrationSchema.validateAt('confirmPassword', data);
        setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
      } catch (validationError) {
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: validationError.message,
        }));
      }
    }
  };

  /**
   * Xử lý thay đổi input với real-time validation
   * @param {Event} e - Input change event
   */
  const handleInputChange = useCallback(
    async (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      setFormData(prev => {
        const updatedData = {
          ...prev,
          [name]: newValue,
        };

        // Real-time validation cho field hiện tại (async)
        setTimeout(async () => {
          await performFieldValidation(name, updatedData);
          await validatePasswordSync(name, updatedData);
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
   * Toggle password visibility
   */
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Validate address and prepare registration data
   * @param {string} convertedDate - Converted date string
   * @returns {Object} Registration data object
   */
  const prepareRegistrationData = (convertedDate) => {
    // Validate address and coordinates
    const trimmedAddress = formData.address.trim();
    if (trimmedAddress.length < 10) {
      setValidationErrors(prev => ({
        ...prev,
        address: 'Địa chỉ phải có ít nhất 10 ký tự (không tính dấu cách)'
      }));
      showNotification('Địa chỉ phải có ít nhất 10 ký tự', 'error');
      return null;
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
      dateOfBirth, // ISO format string YYYY-MM-DD that Spring Boot can parse to LocalDate
      password: formData.password,
      bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
    };

    // Validate final data - Kiểm tra bloodTypeId nếu có
    if (registrationData.bloodTypeId !== null && isNaN(registrationData.bloodTypeId)) {
      setValidationErrors(prev => ({
        ...prev,
        bloodTypeId: 'Nhóm máu không hợp lệ'
      }));
      showNotification('Vui lòng chọn nhóm máu hợp lệ', 'error');
      return null;
    }

    return registrationData;
  };

  /**
   * Handle API errors from registration
   * @param {Error} error - The error object
   */
  const handleRegistrationError = (error) => {
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
      handleBackendError(error.response.data, error.response.status);
    } else {
      // Network hoặc lỗi không xác định
      handleApiError(error, showNotification, {
        fallbackMessage: 'Không thể kết nối đến server. Vui lòng thử lại.',
      });
    }
  };

  /**
   * Handle backend API errors
   * @param {Object} apiErrors - Error data from backend
   * @param {number} status - HTTP status code
   */
  const handleBackendError = (apiErrors, status) => {
    // Handle 500 internal server errors
    if (status === 500) {
      console.error('Server internal error (500):', apiErrors);
      showNotification('Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ quản trị viên.', 'error');
      return;
    }

    // Handle case where backend returns a plain string error message
    if (typeof apiErrors === 'string') {
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
      return;
    }

    if (apiErrors.errors && typeof apiErrors.errors === 'object') {
      handleFieldErrors(apiErrors.errors);
    } else if (apiErrors.message) {
      // General API error message
      showNotification(apiErrors.message, 'error');
    } else {
      showNotification('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.', 'error');
    }
  };

  /**
   * Get field mapping configuration for backend error fields
   * @returns {Object} Field mapping object
   */
  const getFieldMapping = () => ({
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
  });

  /**
   * Map backend field name to frontend field name
   * @param {string} fieldName - Backend field name
   * @returns {string|null} Frontend field name or null if not found
   */
  const mapFieldName = (fieldName) => {
    const fieldMapping = getFieldMapping();
    const lowerFieldName = fieldName.toLowerCase();
    
    // Direct mapping
    const mappedField = fieldMapping[lowerFieldName];
    if (mappedField) return mappedField;

    // Partial match
    const matchedKey = Object.keys(fieldMapping).find(key => 
      lowerFieldName.includes(key) || key.includes(lowerFieldName)
    );
    
    return matchedKey ? fieldMapping[matchedKey] : null;
  };

  /**
   * Handle field validation errors from backend
   * @param {Object} errors - Field errors object
   */
  const handleFieldErrors = (errors) => {
    const formErrors = {};
    
    Object.entries(errors).forEach(([field, messages]) => {
      const errorMessage = Array.isArray(messages) ? messages[0] : messages;
      const mappedField = mapFieldName(field);

      if (mappedField) {
        formErrors[mappedField] = errorMessage;
      } else {
        console.warn(`Unmapped field: ${field} -> ${errorMessage}`);
        if (!formErrors.general) formErrors.general = [];
        formErrors.general.push(`${field}: ${errorMessage}`);
      }
    });

    setValidationErrors(prev => ({ ...prev, ...formErrors }));
    showNotification('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.', 'error');
  };

  /**
   * Xử lý submit form với comprehensive validation
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
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

      // Bước 3: Chuẩn bị dữ liệu cho API
      const registrationData = prepareRegistrationData(convertedDate);
      if (!registrationData) return; // Error already handled in prepareRegistrationData

      // Bước 4: Gọi API đăng ký (request OTP)
      const response = await requestRegistration(registrationData);

      // Bước 5: Xử lý response thành công
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
      handleRegistrationError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle address selection from AddressPicker
   * @param {Object} addressData - Contains address, latitude, longitude
   */
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

  /**
   * Check if all required form fields are filled
   * @returns {boolean} True if all required fields have values
   */
  const areRequiredFieldsFilled = () => {
    return (
      formData.agreeTerms &&
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.dateOfBirth &&
      formData.password &&
      formData.confirmPassword
    );
  };

  /**
   * Check if there are any validation errors
   * @returns {boolean} True if there are no validation errors
   */
  const hasNoValidationErrors = () => {
    return !Object.keys(validationErrors).some(
      key => validationErrors[key] && key !== 'general'
    );
  };

  // Calculate if form is valid for submit button
  const isFormValid = () => {
    return (
      !authLoading &&
      !isFetchingBloodTypes &&
      hasNoValidationErrors() &&
      areRequiredFieldsFilled()
    );
  };

  return {
    // State
    formData,
    showPassword,
    showConfirmPassword,
    bloodTypesFromApi,
    isFetchingBloodTypes,
    validationErrors,
    authLoading,
    
    // Actions
    handleInputChange,
    handleSubmit,
    toggleShowPassword,
    toggleShowConfirmPassword,
    isFormValid,
    handleAddressSelect,
  };
};
