// src/hooks/useRegister.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useAppStore, showNotification } from '../store/appStore';
import bloodTypeService from '../services/bloodTypeService';
import { userRegistrationSchema, createFormErrorToast, FORM_SUCCESS_MESSAGES, FORM_ERROR_MESSAGES } from '../utils/validationSchemas';
import { handleApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export const useRegister = () => {
    // Tối ưu toast với duration ngắn và dismiss cũ
    const showToast = (type, message) => {
        toast.dismiss(); // Dismiss all existing toasts
        toast[type](message, {
            duration: 2500, // 2.5 seconds for registration (slightly longer than blog)
            position: 'top-center',
        });
    };

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
        user,
        loading: authLoading,
    } = useAuth();
    const { setLoading } = useAppStore();
    const navigate = useNavigate();

    /**
     * Fetch blood types từ API với error handling
     */
    const fetchBloodTypes = useCallback(async() => {
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
     * Allow admin/staff to access register page for testing purposes
     */
    useEffect(() => {
        if (isAuthenticated) {
            // Only redirect regular users (not admin/staff)
            const userRole = user?.role;
            if (userRole !== 'Admin' && userRole !== 'Staff') {
                navigate('/', { replace: true });
                return;
            }
        }
        // Always fetch blood types for the form
        fetchBloodTypes();
    }, [isAuthenticated, user, navigate, fetchBloodTypes]);

    /**
     * Validate date format dd-MM-yyyy cho backend
     * @param {string} dateString - Date string in DD-MM-YYYY format
     * @returns {string} Date string in DD-MM-YYYY format cho backend
     */
    const validateDateFormat = (dateString) => {
        if (!dateString || !dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
            return null;
        }

        // Backend giờ đã chấp nhận dd-MM-yyyy format trực tiếp
        return dateString;
    };

    /**
     * Perform real-time validation for a field
     * @param {string} fieldName - The field name to validate
     * @param {Object} data - The form data to validate
     */
    const performFieldValidation = async(fieldName, data) => {
        try {
            await userRegistrationSchema.validateAt(fieldName, data);
            setValidationErrors(prev => ({...prev, [fieldName]: '' }));
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
    const validatePasswordSync = async(fieldName, data) => {
        if (fieldName === 'confirmPassword' || fieldName === 'password') {
            try {
                await userRegistrationSchema.validateAt('confirmPassword', data);
                setValidationErrors(prev => ({...prev, confirmPassword: '' }));
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
        async(e) => {
            const { name, value, type, checked, files } = e.target;        // Handle file uploads - không còn cần thiết cho registration
        if (type === 'file') {
            // File upload đã được chuyển sang UserProfile
            return;
        }

            const newValue = type === 'checkbox' ? checked : value;

            setFormData(prev => {
                const updatedData = {
                    ...prev,
                    [name]: newValue,
                };

                // Real-time validation cho field hiện tại (async)
                setTimeout(async() => {
                    await performFieldValidation(name, updatedData);
                    await validatePasswordSync(name, updatedData);
                }, 0);

                return updatedData;
            });

            // Clear validation error cho field hiện tại
            if (validationErrors[name]) {
                setValidationErrors(prev => ({...prev, [name]: '' }));
            }
        }, [validationErrors]
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
    const prepareRegistrationData = (validatedDate) => {
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

        // Backend giờ sử dụng dd-MM-yyyy format trực tiếp
        const dateOfBirth = validatedDate;

        const registrationData = {
            fullName: formData.fullName.trim(),
            email: formData.email.toLowerCase().trim(),
            phone: formData.phone.trim(),
            address: trimmedAddress,
            latitude: formData.latitude,
            longitude: formData.longitude,
            dateOfBirth,
            password: formData.password,
            bloodTypeId: formData.bloodTypeId || null,
        };

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
            
            // Use enhanced error toast function
            createFormErrorToast(errors, showToast);

        } else if (error.message === 'INVALID_DATE_FORMAT') {
            // Lỗi định dạng ngày sinh
            const dateError = { dateOfBirth: '📅 Định dạng ngày sinh không hợp lệ (DD-MM-YYYY)' };
            setValidationErrors(prev => ({
                ...prev,
                ...dateError,
            }));
            createFormErrorToast(dateError, showToast);

        } else if (!error.response) {
            // Network error or other non-HTTP error
            console.error('Network or non-HTTP error:', error);
            showToast('error', FORM_ERROR_MESSAGES.NETWORK_ERROR);

        } else if (error.response && error.response.data) {
            handleBackendError(error.response.data, error.response.status);
        } else {
            // Network hoặc lỗi không xác định
            showToast('error', 'Không thể kết nối đến server. Vui lòng thử lại');
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
            showToast('error', FORM_ERROR_MESSAGES.SERVER_ERROR);
            return;
        }

        // Handle case where backend returns a plain string error message
        if (typeof apiErrors === 'string') {
            // Check if it's an email already exists error
            if (apiErrors.toLowerCase().includes('email is already in use') ||
                apiErrors.toLowerCase().includes('email already exists')) {
                const emailError = { email: FORM_ERROR_MESSAGES.DUPLICATE_EMAIL };
                setValidationErrors(prev => ({
                    ...prev,
                    ...emailError
                }));
                createFormErrorToast(emailError, showToast);
            } else {
                showToast('error', `⚠️ ${apiErrors}`);
            }
            return;
        }

        if (apiErrors.errors && typeof apiErrors.errors === 'object') {
            handleFieldErrors(apiErrors.errors);
        } else if (apiErrors.message) {
            // General API error message
            showToast('error', `⚠️ ${apiErrors.message}`);
        } else {
            showToast('error', FORM_ERROR_MESSAGES.VALIDATION_ERROR);
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
        'blood_type': 'bloodTypeId',
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
                // Add emoji prefix based on field type
                let enhancedMessage = errorMessage;
                if (mappedField === 'email' && !enhancedMessage.startsWith('📧')) {
                    enhancedMessage = `📧 ${errorMessage}`;
                } else if (mappedField === 'phone' && !enhancedMessage.startsWith('📱')) {
                    enhancedMessage = `📱 ${errorMessage}`;
                } else if (mappedField === 'fullName' && !enhancedMessage.startsWith('👤')) {
                    enhancedMessage = `👤 ${errorMessage}`;
                } else if (mappedField === 'password' && !enhancedMessage.startsWith('🔒')) {
                    enhancedMessage = `🔒 ${errorMessage}`;
                }
                
                formErrors[mappedField] = enhancedMessage;
            } else {
                console.warn(`Unmapped field: ${field} -> ${errorMessage}`);
                if (!formErrors.general) formErrors.general = [];
                formErrors.general.push(`${field}: ${errorMessage}`);
            }
        });

        setValidationErrors(prev => ({...prev, ...formErrors }));
        showNotification('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.', 'error');
    };

    /**
     * Xử lý submit form với comprehensive validation
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async(e) => {
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

            const validatedDate = validateDateFormat(formData.dateOfBirth);
            if (!validatedDate) {
                throw new Error('INVALID_DATE_FORMAT');
            }

            // Bước 3: Chuẩn bị dữ liệu cho API
            const registrationData = prepareRegistrationData(validatedDate);
            if (!registrationData) return; // Error already handled in prepareRegistrationData

            // Bước 4: Gọi API đăng ký (request OTP)
            const response = await requestRegistration(registrationData);

            // Bước 5: Xử lý response thành công
            if (response && (response.success || response.data)) {
                showToast('success', FORM_SUCCESS_MESSAGES.REGISTRATION);

                // Navigate với data đã được format
                navigate('/verify-otp', {
                    state: {
                        email: registrationData.email,
                    }
                });
            } else {
                // If we received a response but it doesn't indicate success
                console.error('Unexpected response format:', response);
                showToast('error', FORM_ERROR_MESSAGES.SERVER_ERROR);
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
            setValidationErrors(prev => ({...prev, address: '' }));
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
        return (!authLoading &&
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