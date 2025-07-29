import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import bloodTypeService from '../services/bloodTypeService';
import userService from '../services/userService';
import { formatDateForBackend } from '../utils/dateUtils';

const useAdminUserCreate = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    roleName: 'Member', // Default role based on backend
    dateOfBirth: '',
    phone: '',
    address: '',
    gender: '',
    emergencyContact: '',
    medicalConditions: '',
    lastDonationDate: '',
    bloodTypeId: '',
    status: 'ACTIVE',
    emailVerified: false,
    phoneVerified: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [bloodTypes, setBloodTypes] = useState([]);

  // Load blood types on component mount
  const loadBloodTypes = useCallback(async () => {
    try {
      const response = await bloodTypeService.getAll();
      setBloodTypes(response || []);
    } catch (error) {
      console.error('Error loading blood types:', error);
      toast.error('Không thể tải danh sách nhóm máu');
    }
  }, []);

  // Handle form field changes
  const handleInputChange = useCallback((nameOrEvent, value) => {
    let fieldName, fieldValue;
    
    // Check if first parameter is an event object
    if (nameOrEvent && nameOrEvent.target) {
      const { name, value: eventValue, type, checked } = nameOrEvent.target;
      fieldName = name;
      fieldValue = type === 'checkbox' ? checked : eventValue;
    } else {
      // Direct parameters
      fieldName = nameOrEvent;
      fieldValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));

    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  }, [errors]);

  // Validate form data
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.roleName) {
      newErrors.roleName = 'Vai trò là bắt buộc';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18 || (age === 18 && today < new Date(birthDate.setFullYear(today.getFullYear())))) {
        newErrors.dateOfBirth = 'Người dùng phải từ 18 tuổi trở lên';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    // Optional fields validation
    if (formData.lastDonationDate) {
      const lastDonationDate = new Date(formData.lastDonationDate);
      const today = new Date();
      
      if (lastDonationDate > today) {
        newErrors.lastDonationDate = 'Ngày hiến máu cuối không thể trong tương lai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Prepare data for backend
  const prepareDataForBackend = useCallback(() => {
    const backendData = {
      email: formData.email.trim().toLowerCase(),
      fullName: formData.fullName.trim(),
      password: formData.password,
      roleName: formData.roleName,
      dateOfBirth: formatDateForBackend(formData.dateOfBirth),
      phone: formData.phone.trim(),
      address: formData.address.trim()
    };

    // Add optional fields only if they have values
    if (formData.gender) {
      backendData.gender = formData.gender;
    }

    if (formData.emergencyContact && formData.emergencyContact.trim()) {
      backendData.emergencyContact = formData.emergencyContact.trim();
    }

    if (formData.medicalConditions && formData.medicalConditions.trim()) {
      backendData.medicalConditions = formData.medicalConditions.trim();
    }

    if (formData.lastDonationDate) {
      backendData.lastDonationDate = formatDateForBackend(formData.lastDonationDate);
    }

    // Convert bloodTypeId to number if provided
    if (formData.bloodTypeId) {
      backendData.bloodTypeId = parseInt(formData.bloodTypeId, 10);
    }

    return backendData;
  }, [formData]);

  // Submit form
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return false;
    }

    setIsLoading(true);
    
    try {
      const backendData = prepareDataForBackend();
      // console.log('Sending user data to backend:', backendData);
      
      const response = await userService.createUserByAdmin(backendData);
      // console.log('Response from backend:', response);
      
      // If we get here without error, the user was created successfully
      toast.success('Tạo người dùng thành công!');
      // console.log('User created successfully, preparing to navigate...');
      
      // Reset form
      setFormData({
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        roleName: 'Member',
        dateOfBirth: '',
        phone: '',
        address: '',
        gender: '',
        emergencyContact: '',
        medicalConditions: '',
        lastDonationDate: '',
        bloodTypeId: '',
        status: 'ACTIVE',
        emailVerified: false,
        phoneVerified: false
      });
      
      setErrors({});
      
      // Navigate to admin users list
      console.log('Navigating to /admin/users...');
      navigate('/admin/users');
      console.log('Navigate function called');
      
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = {};
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          backendErrors[field] = message;
        });
        setErrors(backendErrors);
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo người dùng';
        toast.error(errorMessage);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, prepareDataForBackend]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      roleName: 'Member',
      dateOfBirth: '',
      phone: '',
      address: '',
      gender: '',
      emergencyContact: '',
      medicalConditions: '',
      lastDonationDate: '',
      bloodTypeId: '',
      status: 'ACTIVE',
      emailVerified: false,
      phoneVerified: false
    });
    setErrors({});
  }, []);

  return {
    formData,
    isLoading,
    errors,
    bloodTypes,
    handleInputChange,
    handleSubmit,
    resetForm,
    loadBloodTypes,
    validateForm
  };
};

export default useAdminUserCreate;
