// src/hooks/useAdminUserForm.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import userService from '../services/userService';
import bloodTypeService from '../services/bloodTypeService';

export const useAdminUserForm = (userId, mode = 'view') => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
    isReadyToDonate: true,
    roleName: '',
    status: '',
    emailVerified: false,
    phoneVerified: false,
  });
  const [roles, setRoles] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';

  const fetchUserData = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true);
      try {
        // Tạo danh sách roles cố định vì chưa có API
        const rolesData = [
          { name: 'ADMIN', description: 'Quản trị viên' },
          { name: 'STAFF', description: 'Nhân viên' },
          { name: 'MEMBER', description: 'Thành viên' },
        ];

        const [userData, bloodTypesData] = await Promise.all([
          userService.getUserByIdForAdmin(userId, forceRefresh),
          bloodTypeService.getAll(),
        ]);

        setUser(userData);
        setRoles(rolesData);
        setBloodTypes(bloodTypesData || []);

        // Initialize form data for edit mode
        if (isEditMode) {
          const newFormData = {
            fullName: userData.fullName || '',
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || '',
            address: userData.address || '',
            emergencyContact: userData.emergencyContact || '',
            bloodTypeId: userData.bloodType?.id || userData.bloodTypeId || '',
            medicalConditions: userData.medicalConditions || '',
            lastDonationDate: userData.lastDonationDate || '',
            isReadyToDonate:
              userData.isReadyToDonate !== null
                ? userData.isReadyToDonate
                : true,
            roleName: userData.role || userData.roleName || '',
            status: userData.status || 'ACTIVE',
            emailVerified: userData.emailVerified || false,
            phoneVerified: userData.phoneVerified || false,
          };
          setFormData(newFormData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error(`Failed to create user: ${error.message}`);
        navigate('/admin/users');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, navigate, isEditMode]
  );

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = 'Họ tên không được để trống.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại các trường thông tin.');
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Đang cập nhật người dùng...');

    const requestData = {
      ...formData,
      bloodTypeId: formData.bloodTypeId
        ? parseInt(formData.bloodTypeId, 10)
        : null,
    };
    if (requestData.phone === '') requestData.phone = null;
    if (requestData.gender === '') requestData.gender = null;
    if (requestData.address === '') requestData.address = null;
    if (requestData.emergencyContact === '')
      requestData.emergencyContact = null;
    if (requestData.medicalConditions === '')
      requestData.medicalConditions = null;
    if (!requestData.dateOfBirth) requestData.dateOfBirth = null;
    if (!requestData.lastDonationDate) requestData.lastDonationDate = null;

    try {
      const _updatedUser = await userService.updateUserByAdmin(
        userId,
        requestData
      );
      toast.success('Cập nhật người dùng thành công!', { id: toastId });

      // Force refresh dữ liệu user từ server
      setUser(null);
      await fetchUserData(true);
    } catch (error) {
      console.error('Update user error:', error);
      toast.error(
        `Cập nhật người dùng thất bại: ${error.message || 'Vui lòng thử lại.'}`,
        {
          id: toastId,
        }
      );
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === 'object'
      ) {
        setErrors(prev => ({ ...prev, ...error.response.data }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    formData,
    roles,
    bloodTypes,
    isLoading,
    isSubmitting,
    errors,
    isEditMode,
    isViewMode,
    handleInputChange,
    handleSubmit,
    fetchUserData,
  };
};
