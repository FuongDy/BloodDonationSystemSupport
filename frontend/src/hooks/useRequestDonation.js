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
        setFormData(prev => ({...prev, [name]: value }));
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        const canProceed = requireAuth(
            null,
            'Vui lòng đăng nhập để đăng ký hiến máu.'
        );
        if (!canProceed) return;

        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async() => {
        setShowConfirmModal(false);
        setLoading(true);

        try {
            const requestData = {
                location: HOSPITAL_INFO.FULL_ADDRESS,
                notes: formData.notes,
            };

            await donationService.createDonationRequest(requestData);
            showSuccess(
                'Đăng ký hiến máu thành công! Chúng tôi sẽ sớm liên hệ với bạn để sắp xếp lịch hẹn phù hợp.'
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