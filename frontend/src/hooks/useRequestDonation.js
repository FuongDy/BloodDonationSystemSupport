// src/hooks/useRequestDonation.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import donationService from '../services/donationService';
import { useAuth } from './useAuth';
import useAuthRedirect from './useAuthRedirect';
import { HOSPITAL_INFO } from '../utils/constants';
import { useAppToast } from './useAppToast';
import { getErrorMessage } from '../utils/errorHandler';
import { canProceedWithDonation } from '../utils/cccvVerification';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

// Validation schema cho donation request
const donationRequestSchema = Yup.object().shape({
    notes: Yup.string()
        .max(500, 'Ghi chú không được vượt quá 500 ký tự')
        .nullable()
});

export const useRequestDonation = () => {
    // Tối ưu toast với duration ngắn
    const showToast = (type, message) => {
        toast.dismiss();
        toast[type](message, {
            duration: 2500,
            position: 'top-center',
        });
    };

    const [formData, setFormData] = useState({
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCCCDAlert, setShowCCCDAlert] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { requireAuth } = useAuthRedirect();
    const { showSuccess, showError } = useAppToast();

    const handleChange = useCallback(e => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        
        // Validate form data
        try {
            await donationRequestSchema.validate(formData, { abortEarly: false });
            setValidationErrors({});
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errors = {};
                error.inner.forEach(err => {
                    errors[err.path] = err.message;
                });
                setValidationErrors(errors);
                return; // Don't show toast for validation errors
            }
        }

        const canProceed = requireAuth(
            null,
            'Vui lòng đăng nhập để đăng ký hiến máu.'
        );
        if (!canProceed) return;

        // Check CCCD verification
        const donationCheck = canProceedWithDonation(user);
        if (!donationCheck.canProceed) {
            setShowCCCDAlert(true);
            return;
        }

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
            showToast('success', 'Đăng ký hiến máu thành công! Chúng tôi sẽ sớm liên hệ với bạn');
            navigate('/my-donation-history');
        } catch (error) {
            showToast('error', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return {
        // State
        formData,
        loading,
        showConfirmModal,
        showCCCDAlert,
        isAuthenticated,
        validationErrors,

        // Actions
        setShowConfirmModal,
        setShowCCCDAlert,
        handleChange,
        handleSubmit,
        handleConfirmSubmit,
    };
};