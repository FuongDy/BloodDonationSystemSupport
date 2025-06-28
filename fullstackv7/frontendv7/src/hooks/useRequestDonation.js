// src/hooks/useRequestDonation.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import donationService from '../services/donationService';
import { useAuth } from './useAuth';
import useAuthRedirect from './useAuthRedirect';
import { HOSPITAL_INFO } from '../utils/constants';
import { useAppToast } from './useAppToast';
import { getErrorMessage } from '../utils/errorHandler';

export const useRequestDonation = () => {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthRedirect();
  const { showSuccess, showError } = useAppToast();

  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const isFutureDate = dateStr => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(dateStr);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const canProceed = requireAuth(
      null,
      'Vui lòng đăng nhập để đặt lịch hẹn hiến máu.'
    );
    if (!canProceed) return;
    
    if (!formData.appointmentDate) {
      showError('Vui lòng chọn ngày hẹn.');
      return;
    }
    
    if (!isFutureDate(formData.appointmentDate)) {
      showError('Ngày hẹn phải sau ngày hiện tại.');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    
    try {
      const requestData = {
        appointmentDate: formData.appointmentDate,
        location: HOSPITAL_INFO.FULL_ADDRESS,
        notes: formData.notes,
      };
      
      await donationService.createDonationRequest(requestData);
      showSuccess(
        'Yêu cầu hiến máu đã được gửi thành công! Chúng tôi sẽ sớm liên hệ với bạn.'
      );
      navigate('/my-donation-history');
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    formData,
    loading,
    showConfirmModal,
    isAuthenticated,
    
    // Actions
    setShowConfirmModal,
    handleChange,
    handleSubmit,
    handleConfirmSubmit,
  };
};
