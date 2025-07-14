// src/hooks/useModalManager.js
import { useState } from 'react';

export const useModalManager = () => {
  const [modals, setModals] = useState({
    showStatusModal: false,
    showHealthCheckModal: false,
    showCollectionModal: false,
    showTestResultModal: false,
    showAppointmentModal: false,
  });

  const [forms, setForms] = useState({
    statusForm: {
      newStatus: '',
      note: '',
    },
    healthCheckForm: {
      isEligible: true,
      bloodPressure: '',
      heartRate: '',
      weight: '',
      notes: '',
    },
    collectionForm: {
      collectedVolumeMl:350,
    },
    testResultForm: {
      isSafe: true,
      bloodUnitId: '',
      notes: '',
    },
    appointmentForm: {
      appointmentDateTime: '',
      location: '',
      notes: '',
      staffId: null,
    },
  });

  const openModal = (modalType) => {
    setModals(prev => ({
      ...prev,
      [`show${modalType.charAt(0).toUpperCase() + modalType.slice(1)}Modal`]: true,
    }));

    // Reset forms when opening modals
    switch (modalType) {
      case 'status':
        setForms(prev => ({
          ...prev,
          statusForm: { newStatus: '', note: '' },
        }));
        break;
      case 'healthCheck':
        setForms(prev => ({
          ...prev,
          healthCheckForm: {
            isEligible: true,
            bloodPressure: '',
            heartRate: '',
            weight: '',
            notes: '',
          },
        }));
        break;
      case 'collection':
        setForms(prev => ({
          ...prev,
          collectionForm: { collectedVolumeMl: 450 },
        }));
        break;
      case 'testResult':
        setForms(prev => ({
          ...prev,
          testResultForm: {
            isSafe: true,
            bloodUnitId: `BU${Date.now()}`,
            notes: '',
          },
        }));
        break;
      case 'appointment':
        setForms(prev => ({
          ...prev,
          appointmentForm: {
            appointmentDateTime: '',
            location: 'Bệnh viện Huyết học - FPT',
            notes: '',
            staffId: null,
          },
        }));
        break;
    }
  };

  const closeModal = modalType => {
    setModals(prev => ({
      ...prev,
      [`show${modalType.charAt(0).toUpperCase() + modalType.slice(1)}Modal`]: false,
    }));
  };

  const updateForm = (formType, field, value) => {
    setForms(prev => ({
      ...prev,
      [`${formType}Form`]: {
        ...prev[`${formType}Form`],
        [field]: value,
      },
    }));
  };

  return {
    modals,
    forms,
    openModal,
    closeModal,
    updateForm,
  };
};
