// src/hooks/useAdminUserCreate.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import bloodTypeService from '../services/bloodTypeService';
import { useApi } from './useApi';
import { formatDateForBackend } from '../utils/dateUtils';

export const useAdminUserCreate = () => {
  const navigate = useNavigate();
  const { execute, isLoading: isApiLoading } = useApi();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    roleName: 'MEMBER',
    dateOfBirth: '',
    phone: '',
    address: '',
    bloodTypeId: '',
    status: 'Active',
    emailVerified: false,
    phoneVerified: false,
  });
  
  const [roles, setRoles] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fixed roles list as no API available yet
        const rolesData = [
          { name: 'ADMIN', description: 'Quản trị viên' },
          { name: 'STAFF', description: 'Nhân viên' },
          { name: 'MEMBER', description: 'Thành viên' },
        ];
        setRoles(rolesData);

        // Fetch blood types from API
        const bloodTypesData = await bloodTypeService.getAll();
        setBloodTypes(bloodTypesData || []);
      } catch (error) {
        console.error('Data loading error:', error);
        await execute(
          () => Promise.reject(error),
          {
            showToast: true,
            errorMessage: `Không thể tải dữ liệu: ${error.message || 'Không thể tải dữ liệu'}`
          }
        );
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, [execute]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    // Convert HTML date input (YYYY-MM-DD) to backend format (dd-MM-yyyy)
    if (name === 'dateOfBirth' && type === 'date' && value) {
      processedValue = formatDateForBackend(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống.';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ.';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống.';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }
    
    if (!formData.roleName) {
      newErrors.roleName = 'Vai trò không được để trống.';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh không được để trống.';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống.';
    } else if (formData.phone.length < 9 || formData.phone.length > 15) {
      newErrors.phone = 'Số điện thoại phải có từ 9-15 ký tự.';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống.';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      await execute(
        () => Promise.reject(new Error('Vui lòng kiểm tra lại các trường thông tin.')),
        { showToast: true }
      );
      return;
    }

    const requestData = {
      ...formData,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      dateOfBirth: formatDateForBackend(formData.dateOfBirth),
      bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId, 10) : null,
    };
    delete requestData.confirmPassword;

    await execute(
      () => userService.createUserByAdmin(requestData),
      {
        showToast: true,
        loadingMessage: 'Đang tạo người dùng...',
        successMessage: 'Tạo người dùng thành công!',
        onSuccess: () => {
          navigate('/admin/users');
        },
        onError: (error) => {
          console.error('User creation error:', error);
          if (error.response?.data && typeof error.response.data === 'object') {
            const serverErrors = {};
            for (const key in error.response.data) {
              serverErrors[key] = error.response.data[key];
            }
            setErrors(prev => ({ ...prev, ...serverErrors }));
          }
        }
      }
    );
  };

  const combinedLoading = isLoading || isApiLoading;

  return {
    formData,
    roles,
    bloodTypes,
    isLoading: combinedLoading,
    errors,
    handleInputChange,
    handleSubmit,
  };
};
