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

  const [idCardFiles, setIdCardFiles] = useState({
    frontImage: null,
    backImage: null,
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
   * Xử lý thay đổi input với real-time validation
   * @param {Event} e - Input change event
   */
  const handleInputChange = useCallback(
    async (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;      setFormData(prev => {
        const updatedData = {
          ...prev,
          [name]: newValue,
        };
        
        // Real-time validation cho field hiện tại (async) - skip CCCD files
        if (name !== 'frontImage' && name !== 'backImage') {
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
        }
        
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
   * Xử lý file upload cho CCCD
   * @param {string} side - 'front' hoặc 'back'
   * @param {File|null} file - File object hoặc null để xóa
   */
  const handleFileUpload = useCallback((side, file) => {
    setIdCardFiles(prev => ({
      ...prev,
      [side === 'front' ? 'frontImage' : 'backImage']: file
    }));

    // Clear validation errors khi upload thành công
    if (file) {
      setValidationErrors(prev => ({
        ...prev,
        [side === 'front' ? 'frontImage' : 'backImage']: '',
        idCard: '',
        general: ''
      }));
    }
  }, []);

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

      // Bước 2: Validate CCCD files
      if (!idCardFiles.frontImage || !idCardFiles.backImage) {
        const errors = {};
        if (!idCardFiles.frontImage) {
          errors.frontImage = 'Vui lòng tải lên ảnh mặt trước CCCD';
        }
        if (!idCardFiles.backImage) {
          errors.backImage = 'Vui lòng tải lên ảnh mặt sau CCCD';
        }
        setValidationErrors(errors);
        showNotification('Vui lòng tải lên đầy đủ ảnh mặt trước và mặt sau CCCD', 'error');
        return;
      }

      // Bước 3: Validate và convert định dạng ngày sinh
      if (!formData.dateOfBirth.match(/^\d{2}-\d{2}-\d{4}$/)) {
        throw new Error('INVALID_DATE_FORMAT');
      }

      const convertedDate = convertDateFormat(formData.dateOfBirth);
      if (!convertedDate) {
        throw new Error('INVALID_DATE_FORMAT');
      }

      // Bước 3: Chuẩn bị dữ liệu cho API với format backend yêu cầu
      // Validate address and coordinates
      const trimmedAddress = formData.address.trim();
      if (trimmedAddress.length < 10) {
        setValidationErrors(prev => ({
          ...prev,
          address: 'Địa chỉ phải có ít nhất 10 ký tự (không tính dấu cách)'
        }));
        showNotification('Địa chỉ phải có ít nhất 10 ký tự', 'error');
        return;
      }

      // TODO: Re-enable coordinate validation when AddressPicker provides geocoding
      // Validate coordinates
      // if (formData.latitude === null || formData.longitude === null) {
      //   setValidationErrors(prev => ({
      //     ...prev,
      //     address: 'Vui lòng chọn địa chỉ từ bản đồ hoặc ô tìm kiếm'
      //   }));
      //   showNotification('Vui lòng chọn một địa chỉ từ bản đồ hoặc ô tìm kiếm.', 'error');
      //   return;
      // }

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

      // Bước 4: Validate final data
      // Kiểm tra bloodTypeId nếu có
      if (registrationData.bloodTypeId !== null && isNaN(registrationData.bloodTypeId)) {
        setValidationErrors(prev => ({
          ...prev,
          bloodTypeId: 'Nhóm máu không hợp lệ'
        }));
        showNotification('Vui lòng chọn nhóm máu hợp lệ', 'error');
        return;
      }

      // Bước 5: Gọi API đăng ký (request OTP) với CCCD files
      const response = await requestRegistration(
        registrationData, 
        idCardFiles.frontImage, 
        idCardFiles.backImage
      );

      // Bước 6: Xử lý response thành công
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

        // Handle 500 internal server errors
        if (error.response.status === 500) {
          console.error('Server internal error (500):', apiErrors);
          showNotification('Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ quản trị viên.', 'error');
        }
        // Handle case where backend returns a plain string error message
        else if (typeof apiErrors === 'string') {
          // Check for file size limit errors
          if (apiErrors.includes('FileSizeLimitExceededException') || 
              apiErrors.includes('exceeds its maximum permitted size')) {
            let errorField = 'general';
            let errorMessage = 'Kích thước file ảnh quá lớn. Vui lòng chọn file nhỏ hơn 1MB.';
            
            // Determine which file caused the error
            if (apiErrors.includes('frontImage')) {
              errorField = 'frontImage';
              errorMessage = 'Ảnh mặt trước CCCD quá lớn (tối đa 1MB)';
            } else if (apiErrors.includes('backImage')) {
              errorField = 'backImage';
              errorMessage = 'Ảnh mặt sau CCCD quá lớn (tối đa 1MB)';
            }
            
            setValidationErrors(prev => ({
              ...prev,
              [errorField]: errorMessage
            }));
            showNotification(errorMessage, 'error');
          }
          // Check if it's an email already exists error
          else if (apiErrors.toLowerCase().includes('email is already in use') || 
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

  // Calculate if form is valid for submit button
  const isFormValid = () => {
    return (
      !authLoading &&
      !isFetchingBloodTypes &&
      !Object.keys(validationErrors).some(
        key => validationErrors[key] && key !== 'general'
      ) &&
      formData.agreeTerms &&
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.dateOfBirth &&
      formData.password &&
      formData.confirmPassword &&
      idCardFiles.frontImage &&
      idCardFiles.backImage
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
    handleFileUpload,
    toggleShowPassword,
    toggleShowConfirmPassword,
    isFormValid,
    handleAddressSelect,
  };
};
